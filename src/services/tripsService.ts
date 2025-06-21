
import { supabase } from "@/integrations/supabase/client";

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  dates: string;
  status: string; // Changed from union type to string to match database
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
    // First get the user profile to get the internal user_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_user_id', auth0UserId)
      .single();

    if (!profile) {
      console.error('User profile not found');
      return [];
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trips:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user trips:', error);
    return [];
  }
};

export const createTrip = async (auth0UserId: string, tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'added_date'>): Promise<Trip | null> => {
  try {
    // Get user profile to get the user_id
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

    return data;
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

    return data;
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
