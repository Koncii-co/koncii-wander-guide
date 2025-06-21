
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  user_id: string;
  trip_id?: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'upcoming' | 'planning';
  image_url?: string;
  hotel?: string;
  travelers: number;
  total_cost: number;
  activities?: string[];
  coordinates?: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
}

export const getUserBookings = async (auth0UserId: string): Promise<Booking[]> => {
  try {
    // Set the current user context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: auth0UserId,
      is_local: true
    });

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return [];
  }
};

export const createBooking = async (auth0UserId: string, bookingData: Omit<Booking, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Booking | null> => {
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
      .from('bookings')
      .insert({
        ...bookingData,
        user_id: profile.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};

export const updateBooking = async (auth0UserId: string, bookingId: string, updates: Partial<Booking>): Promise<Booking | null> => {
  try {
    // Set the current user context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: auth0UserId,
      is_local: true
    });

    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating booking:', error);
    return null;
  }
};
