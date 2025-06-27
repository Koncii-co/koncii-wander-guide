
import { useCallback } from 'react';
import { analyticsService } from '@/services/analyticsService';

export const useAnalytics = () => {
  const trackEvent = useCallback(async (eventType: string, eventData?: any) => {
    try {
      await analyticsService.trackUserEvent(eventType, eventData);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, []);

  return {
    trackEvent,
    trackLogin: () => trackEvent('login'),
    trackSearch: (query: string) => trackEvent('search', { query }),
    trackChatInteraction: (message: string) => trackEvent('chat_interaction', { message }),
    trackTripCreated: (destination: string) => trackEvent('trip_created', { destination }),
    trackBookingCreated: (bookingId: string, amount: number) => trackEvent('booking_created', { bookingId, amount }),
  };
};
