
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Camera, Clock } from "lucide-react";

interface Booking {
  id: number;
  destination: string;
  dates: string;
  status: string;
  image: string;
  hotel: string;
  coordinates: { lat: number; lng: number };
  activities: string[];
  totalCost: number;
  travelers: number;
}

interface BookingMapProps {
  booking: Booking;
}

const BookingMap = ({ booking }: BookingMapProps) => {
  // Mock nearby attractions data
  const nearbyAttractions = [
    { name: "Historic Temple", distance: "0.8 km", rating: 4.8, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=100&h=100&fit=crop" },
    { name: "Local Market", distance: "1.2 km", rating: 4.6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop" },
    { name: "Scenic Viewpoint", distance: "2.1 km", rating: 4.9, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop" }
  ];

  const suggestedRoutes = [
    { name: "Cultural Heritage Route", duration: "4 hours", stops: 5, difficulty: "Easy" },
    { name: "Nature & Adventure Path", duration: "6 hours", stops: 7, difficulty: "Moderate" },
    { name: "Food & Shopping Tour", duration: "3 hours", stops: 4, difficulty: "Easy" }
  ];

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <Card className="koncii-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              Interactive Map
            </CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button size="sm" variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Street View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Map placeholder - In a real app, you'd integrate with Google Maps or Mapbox */}
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 mx-auto text-primary/60" />
                <p className="text-lg font-semibold text-primary">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {booking.coordinates.lat}, {booking.coordinates.lng}
                </p>
                <Badge variant="outline" className="bg-primary/10">
                  {booking.destination}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Attractions */}
        <Card className="koncii-card">
          <CardHeader>
            <CardTitle className="text-lg">Nearby Attractions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyAttractions.map((attraction, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{attraction.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{attraction.distance}</span>
                    <span>•</span>
                    <span>★ {attraction.rating}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Routes */}
        <Card className="koncii-card">
          <CardHeader>
            <CardTitle className="text-lg">AI Suggested Routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedRoutes.map((route, index) => (
              <div key={index} className="p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors space-y-2">
                <h4 className="font-medium">{route.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {route.duration}
                  </div>
                  <span>{route.stops} stops</span>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {route.difficulty}
                  </Badge>
                </div>
                <Button size="sm" className="w-full koncii-button">
                  Start Route
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingMap;
