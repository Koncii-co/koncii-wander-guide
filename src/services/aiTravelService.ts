const API_BASE_URL = 'https://api.koncii.co';

export interface TravelAgentResponse {
  response: string;
  status: string;
}

export interface ChatMessage {
  message: string;
}

class AITravelService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async sendMessage(message: string): Promise<TravelAgentResponse> {
    try {
      console.log('Sending message to:', `${this.baseUrl}/chat`);
      console.log('Message:', message);
      
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Check if this is a mock response
      if (data.response && data.response.includes('temporarily unavailable')) {
        console.log('⚠️ This appears to be a mock response due to AI service unavailability');
      }
      
      return data;
    } catch (error) {
      console.error('Error communicating with AI travel agent:', error);
      throw error;
    }
  }

  async getTravelSuggestions(query: string): Promise<TravelAgentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: `I'm looking for travel suggestions for: ${query}. Please provide recommendations for destinations, activities, and tips.` 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting travel suggestions:', error);
      throw error;
    }
  }

  async getDestinationInfo(destination: string): Promise<TravelAgentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: `Tell me about ${destination}. I want to know about attractions, local culture, best time to visit, and travel tips.` 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting destination info:', error);
      throw error;
    }
  }

  async planTrip(details: {
    destination: string;
    duration: string;
    budget?: string;
    interests?: string[];
  }): Promise<TravelAgentResponse> {
    try {
      const interestsText = details.interests ? details.interests.join(', ') : 'general travel';
      const budgetText = details.budget ? ` with a budget of ${details.budget}` : '';
      
      const message = `I want to plan a ${details.duration} trip to ${details.destination}${budgetText}. My interests include: ${interestsText}. Please help me create a detailed itinerary.`;

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error planning trip:', error);
      throw error;
    }
  }
}

export const aiTravelService = new AITravelService(); 