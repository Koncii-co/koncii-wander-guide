
import { supabase } from "@/integrations/supabase/client";

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  dates: string;
  status: string;
  image_url?: string;
  hotel?: string;
  travelers: number;
  estimated_cost?: number;
  total_cost?: number;
  activities?: string[];
  coordinates?: { lat: number; lng: number };
  added_date: string;
  created_at: string;
  updated_at: string;
}

export const getUserTrips = async (auth0UserId: string): Promise<Trip[]> => {
  try {
    console.log('Getting trips for user:', auth0UserId);
    
    // First get the user profile to get the internal user_id
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_user_id', auth0UserId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return [];
    }

    if (!profile) {
      console.error('User profile not found for auth0_user_id:', auth0UserId);
      return [];
    }

    console.log('Found user profile:', profile);

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trips:', error);
      return [];
    }

    console.log('Fetched trips:', data);

    // Transform the data to match our interface
    return (data || []).map(trip => ({
      ...trip,
      coordinates: trip.coordinates as { lat: number; lng: number } | undefined
    }));
  } catch (error) {
    console.error('Error getting user trips:', error);
    return [];
  }
};

export const createTrip = async (auth0UserId: string, tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'added_date'>): Promise<Trip | null> => {
  try {
    console.log('Creating trip for auth0UserId:', auth0UserId);
    console.log('Trip data:', tripData);

    // Get user profile to get the user_id
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_user_id', auth0UserId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    if (!profile) {
      console.error('User profile not found for auth0_user_id:', auth0UserId);
      console.log('This might mean the user profile was not synced properly');
      return null;
    }

    console.log('Found user profile for trip creation:', profile);

    const { data, error } = await supabase
      .from('trips')
      .insert({
        ...tripData,
        user_id: profile.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating trip:', error);
      return null;
    }

    console.log('Successfully created trip:', data);

    return {
      ...data,
      coordinates: data.coordinates as { lat: number; lng: number } | undefined
    };
  } catch (error) {
    console.error('Error creating trip:', error);
    return null;
  }
};

export const updateTrip = async (auth0UserId: string, tripId: string, updates: Partial<Trip>): Promise<Trip | null> => {
  try {
    // Get user profile to verify ownership
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_user_id', auth0UserId)
      .single();

    if (!profile) {
      console.error('User profile not found');
      return null;
    }

    const { data, error } = await supabase
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', tripId)
      .eq('user_id', profile.id) // Ensure user can only update their own trips
      .select()
      .single();

    if (error) {
      console.error('Error updating trip:', error);
      return null;
    }

    return {
      ...data,
      coordinates: data.coordinates as { lat: number; lng: number } | undefined
    };
  } catch (error) {
    console.error('Error updating trip:', error);
    return null;
  }
};

export const deleteTrip = async (auth0UserId: string, tripId: string): Promise<boolean> => {
  try {
    // Get user profile to verify ownership
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_user_id', auth0UserId)
      .single();

    if (!profile) {
      console.error('User profile not found');
      return false;
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', profile.id); // Ensure user can only delete their own trips

    if (error) {
      console.error('Error deleting trip:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return false;
  }
};
