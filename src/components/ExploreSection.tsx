import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Phone } from "lucide-react";
import InteractiveMap from "./InteractiveMap";

const ExploreSection = () => {
  const [selectedLocation, setSelectedLocation] = useState("current");
  const [showMap, setShowMap] = useState(false);

  const restaurants = [
    {
      name: "The Green Garden",
      cuisine: "Mediterranean",
      rating: 4.7,
      distance: "0.3 miles",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop"
    },
    {
      name: "Ocean Breeze",
      cuisine: "Seafood",
      rating: 4.8,
      distance: "0.5 miles",
      image: "https://images.unsplash.com/photo-1555939594-58e4fd4036c5?w=300&h=200&fit=crop"
    }
  ];

  const attractions = [
    {
      name: "City Art Museum",
      type: "Museum",
      rating: 4.6,
      distance: "1.2 miles",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    },
    {
      name: "Central Park",
      type: "Park",
      rating: 4.9,
      distance: "0.8 miles",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop"
    }
  ];

  const hospitals = [
    {
      name: "City General Hospital",
      type: "General Hospital",
      rating: 4.3,
      distance: "2.1 miles",
      phone: "+1 (555) 123-4567"
    },
    {
      name: "Emergency Care Center",
      type: "Emergency Care",
      rating: 4.5,
      distance: "1.5 miles",
      phone: "+1 (555) 987-6543"
    }
  ];

  const events = [
    {
      name: "Summer Music Festival",
      date: "June 25-27",
      location: "Downtown Plaza",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop"
    },
    {
      name: "Food & Wine Expo",
      date: "July 15",
      location: "Convention Center",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold">Explore Your Area</h3>
        <Button variant="ghost" onClick={() => setShowMap(true)}>View Map</Button>
      </div>

      <Tabs defaultValue="restaurants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-5 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tips" className="hidden lg:inline-flex">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant, index) => (
              <Card key={index} className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{restaurant.name}</h4>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attractions.map((attraction, index) => (
              <Card key={index} className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{attraction.name}</h4>
                        <p className="text-sm text-muted-foreground">{attraction.type}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{attraction.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{attraction.distance}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hospitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((hospital, index) => (
              <Card key={index} className="koncii-card">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{hospital.name}</h4>
                      <p className="text-sm text-muted-foreground">{hospital.type}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{hospital.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{hospital.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-primary">
                      <Phone className="w-3 h-3" />
                      <span>{hospital.phone}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full koncii-button">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event, index) => (
              <Card key={index} className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold">{event.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full koncii-button">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="koncii-card">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold">Local Transportation</h4>
                <p className="text-sm text-muted-foreground">
                  Best ways to get around the city and save money on transport.
                </p>
              </CardContent>
            </Card>
            <Card className="koncii-card">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold">Hidden Gems</h4>
                <p className="text-sm text-muted-foreground">
                  Discover local favorites that tourists rarely find.
                </p>
              </CardContent>
            </Card>
            <Card className="koncii-card">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold">Safety Tips</h4>
                <p className="text-sm text-muted-foreground">
                  Stay safe while exploring with these local insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Interactive Map Modal */}
      {showMap && (
        <InteractiveMap onClose={() => setShowMap(false)} />
      )}
    </section>
  );
};

export default ExploreSection;
