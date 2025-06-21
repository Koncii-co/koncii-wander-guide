
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  user_id: string;
  trip_id?: string;
  destination: string;
  dates: string;
  status: string; // Changed from union type to string to match database
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
      .from('bookings')
      .select('*')
      .eq('user_id', profile.id)
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
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('user_id', profile.id) // Ensure user can only update their own bookings
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
