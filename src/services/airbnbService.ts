
const API_BASE_URL = 'https://api.koncii.co/mcp-airbnb';

export interface AirbnbListing {
  id: string;
  name: string;
  url: string;
  rating?: number;
  reviewCount?: number;
  pricePerNight: number;
  totalPrice: number;
  badges?: string;
  bedInfo?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hostInfo?: string;
  freeCancellation?: boolean;
  priceBreakdown?: string;
}

export interface AirbnbSearchResponse {
  response: string;
  status: string;
  function_calls?: any[];
  function_responses?: any[];
}

class AirbnbService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async searchAirbnbs(location: string, checkin: string, checkout: string): Promise<AirbnbListing[]> {
    try {
      console.log('Searching Airbnbs for:', { location, checkin, checkout });
      
      const message = `Find Airbnb accommodations in ${location} from ${checkin} to ${checkout}`;
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: AirbnbSearchResponse = await response.json();
      console.log('Airbnb API response:', data);
      
      return this.parseAirbnbResponse(data);
    } catch (error) {
      console.error('Error searching Airbnbs:', error);
      throw error;
    }
  }

  private parseAirbnbResponse(data: AirbnbSearchResponse): AirbnbListing[] {
    try {
      // Look for function responses that contain Airbnb data
      const airbnbFunctionResponse = data.function_responses?.find(
        response => response.name === 'airbnb_search'
      );

      if (airbnbFunctionResponse?.response?.result?.content?.[0]?.text) {
        const airbnbData = JSON.parse(airbnbFunctionResponse.response.result.content[0].text);
        
        if (airbnbData.searchResults) {
          return airbnbData.searchResults.map((item: any) => {
            // Extract rating and review count
            const ratingMatch = item.avgRatingA11yLabel?.match(/(\d+\.?\d*) out of 5 average rating, (\d+) reviews/);
            const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;
            const reviewCount = ratingMatch ? parseInt(ratingMatch[2]) : undefined;

            // Extract prices
            const pricePerNight = this.extractPrice(item.structuredDisplayPrice?.primaryLine?.accessibilityLabel);
            const totalPrice = this.extractPrice(item.structuredDisplayPrice?.secondaryLine?.accessibilityLabel);

            return {
              id: item.id,
              name: item.demandStayListing?.description?.name?.localizedStringWithTranslationPreference || 'Airbnb Listing',
              url: item.url,
              rating,
              reviewCount,
              pricePerNight,
              totalPrice,
              badges: item.badges,
              bedInfo: item.structuredContent?.primaryLine,
              coordinates: {
                latitude: item.demandStayListing?.location?.coordinate?.latitude || 0,
                longitude: item.demandStayListing?.location?.coordinate?.longitude || 0,
              },
              hostInfo: item.structuredContent?.mapCategoryInfo,
              freeCancellation: item.structuredContent?.secondaryLine?.includes('Free cancellation'),
              priceBreakdown: item.structuredDisplayPrice?.explanationData?.priceDetails,
            };
          });
        }
      }

      // Fallback: parse from the text response
      return this.parseTextResponse(data.response);
    } catch (error) {
      console.error('Error parsing Airbnb response:', error);
      return this.parseTextResponse(data.response);
    }
  }

  private parseTextResponse(response: string): AirbnbListing[] {
    const listings: AirbnbListing[] = [];
    const lines = response.split('\n');
    
    let currentListing: Partial<AirbnbListing> = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('*   **') && trimmedLine.endsWith('**')) {
        // New listing name
        if (currentListing.name) {
          listings.push(currentListing as AirbnbListing);
        }
        currentListing = {
          name: trimmedLine.replace(/\*\s+\*\*/g, '').replace(/\*\*/g, ''),
          id: Math.random().toString(36).substr(2, 9),
          coordinates: { latitude: 0, longitude: 0 },
          pricePerNight: 0,
          totalPrice: 0,
        };
      } else if (trimmedLine.includes('Rating:')) {
        const ratingMatch = trimmedLine.match(/(\d+\.?\d*) out of 5 \((\d+) reviews\)/);
        if (ratingMatch) {
          currentListing.rating = parseFloat(ratingMatch[1]);
          currentListing.reviewCount = parseInt(ratingMatch[2]);
        }
      } else if (trimmedLine.includes('Price:')) {
        const priceMatch = trimmedLine.match(/\$(\d+) CAD per night \(\$([0-9,]+\.?\d*) CAD total\)/);
        if (priceMatch) {
          currentListing.pricePerNight = parseInt(priceMatch[1]);
          currentListing.totalPrice = parseFloat(priceMatch[2].replace(',', ''));
        }
      } else if (trimmedLine.includes('Link:')) {
        currentListing.url = trimmedLine.replace('*   **Link:** ', '');
      }
    }
    
    // Add the last listing
    if (currentListing.name) {
      listings.push(currentListing as AirbnbListing);
    }
    
    return listings;
  }

  private extractPrice(priceText?: string): number {
    if (!priceText) return 0;
    const match = priceText.match(/\$(\d+(?:,\d+)*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(',', '')) : 0;
  }
}

export const airbnbService = new AirbnbService();
