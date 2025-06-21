
import { supabase } from "@/integrations/supabase/client";

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  dates: string;
  status: 'planning' | 'confirmed' | 'upcoming';
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
    // Set the current user context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: auth0UserId,
      is_local: true
    });

    const { data, error } = await supabase
      .from('trips')
      .select('*')
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
    // Set the current user context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: auth0UserId,
      is_local: true
    });

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
    // Set the current user context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: auth0UserId,
      is_local: true
    });

    const { data, error } = await supabase
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', tripId)
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
    // Set the current user context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: auth0UserId,
      is_local: true
    });

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

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
