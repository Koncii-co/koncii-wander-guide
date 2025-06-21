import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Navigation, Phone, Clock, X, Filter, ArrowLeft } from "lucide-react";

interface Location {
  id: string;
  name: string;
  type: 'restaurant' | 'attraction' | 'hotel' | 'hospital' | 'event';
  coordinates: [number, number];
  rating?: number;
  distance?: string;
  phone?: string;
  description?: string;
  image?: string;
  price?: string;
  hours?: string;
}

interface InteractiveMapProps {
  onClose: () => void;
}

const InteractiveMap = ({ onClose }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const getMarkerColor = (type: Location["type"]) => {
    switch (type) {
      case "restaurant": return "#ef4444";
      case "attraction": return "#10b981";
      case "hotel": return "#3b82f6";
      case "hospital": return "#f59e0b";
      case "event": return "#8b5cf6";
      default: return "#6b7280";
    }
  };

  // Mock data for nearby locations
  const nearbyLocations: Location[] = [
    {
      id: "1",
      name: "The Green Garden",
      type: "restaurant",
      coordinates: [-74.006, 40.7128],
      rating: 4.7,
      distance: "0.3 miles",
      description: "Mediterranean cuisine with fresh ingredients",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
      price: "$$",
      hours: "11:00 AM - 10:00 PM"
    },
    {
      id: "2",
      name: "City Art Museum",
      type: "attraction",
      coordinates: [-74.008, 40.7148],
      rating: 4.6,
      distance: "1.2 miles",
      description: "Contemporary art exhibitions and cultural events",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      hours: "10:00 AM - 6:00 PM"
    },
    {
      id: "3",
      name: "Central Park",
      type: "attraction",
      coordinates: [-73.9654, 40.7829],
      rating: 4.9,
      distance: "0.8 miles",
      description: "Urban oasis with walking trails and recreational activities",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop",
      hours: "6:00 AM - 10:00 PM"
    },
    {
      id: "4",
      name: "Ocean Breeze",
      type: "restaurant",
      coordinates: [-74.004, 40.7108],
      rating: 4.8,
      distance: "0.5 miles",
      description: "Fresh seafood and ocean views",
      image: "https://images.unsplash.com/photo-1555939594-58e4fd4036c5?w=300&h=200&fit=crop",
      price: "$$$",
      hours: "12:00 PM - 11:00 PM"
    },
    {
      id: "5",
      name: "City General Hospital",
      type: "hospital",
      coordinates: [-74.010, 40.7168],
      rating: 4.3,
      distance: "2.1 miles",
      phone: "+1 (555) 123-4567",
      description: "24/7 emergency care and general medical services"
    },
    {
      id: "6",
      name: "Summer Music Festival",
      type: "event",
      coordinates: [-74.002, 40.7088],
      description: "Annual music festival featuring local and international artists",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      hours: "June 25-27"
    }
  ];

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.log("Error getting location:", error);
          // Default to NYC coordinates if location access is denied
          setUserLocation([-74.006, 40.7128]);
        }
      );
    } else {
      // Default to NYC coordinates
      setUserLocation([-74.006, 40.7128]);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || !userLocation) return;

    map.current = new mapboxgl.Map({
      accessToken: mapboxToken,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add user location marker
    new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
      .addTo(map.current);

    // Add location markers
    nearbyLocations.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: getMarkerColor(location.type) })
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${location.name}</h3>
              <p class="text-sm text-gray-600">${location.type}</p>
              ${location.rating ? `<p class="text-sm">★ ${location.rating}</p>` : ""}
            </div>
          `)
        )
        .addTo(map.current);

      // Add click event to marker
      marker.getElement().addEventListener("click", () => {
        setSelectedLocation(location);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, userLocation]);

  const getTypeLabel = (type: Location["type"]) => {
    switch (type) {
      case "restaurant": return "Restaurant";
      case "attraction": return "Attraction";
      case "hotel": return "Hotel";
      case "hospital": return "Hospital";
      case "event": return "Event";
      default: return type;
    }
  };

  const filteredLocations = activeTab === "all" 
    ? nearbyLocations 
    : nearbyLocations.filter(location => location.type === activeTab);

  const flyToLocation = (coordinates: [number, number]) => {
    if (map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: 16,
        duration: 2000
      });
    }
  };

  if (!mapboxToken) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl mx-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interactive Map</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Mapbox token not configured</h3>
              <p className="text-muted-foreground">
                Please add your Mapbox token to the environment variables to view the interactive map.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-7xl mx-4 h-[90vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Interactive Map
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex gap-4 p-0">
          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapContainer} className="w-full h-full rounded-b-lg" />
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-card/50 backdrop-blur-sm border-l border-border/50 p-4 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="restaurant">Food</TabsTrigger>
                <TabsTrigger value="attraction">Places</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-3 mt-4">
                <div className="space-y-3 max-h-[calc(90vh-200px)] overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <Card 
                      key={location.id} 
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedLocation(location);
                        flyToLocation(location.coordinates);
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          {location.image && (
                            <img
                              src={location.image}
                              alt={location.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{location.name}</h4>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(location.type)}
                                  </Badge>
                                  {location.rating && (
                                    <div className="flex items-center">
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      <span>{location.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {location.distance && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {location.distance}
                                  </p>
                                )}
                              </div>
                              <Button size="sm" variant="ghost">
                                <Navigation className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>

        {/* Location Details Modal */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">{selectedLocation.name}</h3>
                  <Badge variant="outline">{getTypeLabel(selectedLocation.type)}</Badge>
                </div>
                {selectedLocation.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedLocation.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm">
                  {selectedLocation.rating && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{selectedLocation.rating}</span>
                    </div>
                  )}
                  {selectedLocation.distance && (
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{selectedLocation.distance}</span>
                    </div>
                  )}
                  {selectedLocation.hours && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{selectedLocation.hours}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedLocation.phone && (
                  <Button size="sm" variant="outline">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                )}
                <Button size="sm" className="koncii-button">
                  <Navigation className="w-3 h-3 mr-1" />
                  Directions
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedLocation(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InteractiveMap;
