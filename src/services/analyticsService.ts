
import { supabase } from "@/integrations/supabase/client";

export interface UserAnalytic {
  id: string;
  user_id: string;
  event_type: string;
  event_data?: any;
  created_at: string;
}

export interface DailyMetric {
  id: string;
  date: string;
  new_users: number;
  active_users: number;
  total_bookings: number;
  total_trips: number;
  total_revenue: number;
  chat_interactions: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalBookings: number;
  totalTrips: number;
  totalRevenue: number;
  chatInteractions: number;
  newUsersThisMonth: number;
  activeUsersThisMonth: number;
}

class AnalyticsService {
  async trackUserEvent(eventType: string, eventData?: any): Promise<void> {
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .single();

      if (userProfile) {
        await supabase
          .from('user_analytics')
          .insert({
            user_id: userProfile.id,
            event_type: eventType,
            event_data: eventData
          });
      }
    } catch (error) {
      console.error('Error tracking user event:', error);
    }
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total bookings and revenue
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_cost');

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_cost || 0), 0) || 0;

      // Get total trips
      const { count: totalTrips } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true });

      // Get chat interactions count
      const { count: chatInteractions } = await supabase
        .from('user_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'chat_interaction');

      // Get new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get active users this month (users who have analytics events)
      const { count: activeUsersThisMonth } = await supabase
        .from('user_analytics')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      return {
        totalUsers: totalUsers || 0,
        totalBookings,
        totalTrips: totalTrips || 0,
        totalRevenue,
        chatInteractions: chatInteractions || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        activeUsersThisMonth: activeUsersThisMonth || 0,
      };
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return {
        totalUsers: 0,
        totalBookings: 0,
        totalTrips: 0,
        totalRevenue: 0,
        chatInteractions: 0,
        newUsersThisMonth: 0,
        activeUsersThisMonth: 0,
      };
    }
  }

  async getUserRegistrationTrend(days: number = 30): Promise<{ date: string; count: number }[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      // Group by date
      const dateCount: { [key: string]: number } = {};
      
      data?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        dateCount[date] = (dateCount[date] || 0) + 1;
      });

      // Fill in missing dates with 0
      const result = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        result.unshift({
          date: dateStr,
          count: dateCount[dateStr] || 0
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching user registration trend:', error);
      return [];
    }
  }

  async getBookingTrend(days: number = 30): Promise<{ date: string; count: number; revenue: number }[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data } = await supabase
        .from('bookings')
        .select('created_at, total_cost')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      // Group by date
      const dateStats: { [key: string]: { count: number; revenue: number } } = {};
      
      data?.forEach(booking => {
        const date = new Date(booking.created_at).toISOString().split('T')[0];
        if (!dateStats[date]) {
          dateStats[date] = { count: 0, revenue: 0 };
        }
        dateStats[date].count += 1;
        dateStats[date].revenue += booking.total_cost || 0;
      });

      // Fill in missing dates with 0
      const result = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        result.unshift({
          date: dateStr,
          count: dateStats[dateStr]?.count || 0,
          revenue: dateStats[dateStr]?.revenue || 0
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching booking trend:', error);
      return [];
    }
  }

  async checkUserRole(): Promise<'admin' | 'user' | null> {
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .single();

      if (!userProfile) return null;

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userProfile.id);

      return roles?.find(r => r.role === 'admin') ? 'admin' : 'user';
    } catch (error) {
      console.error('Error checking user role:', error);
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();
