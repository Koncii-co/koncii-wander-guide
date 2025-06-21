
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Users, Clock, Sparkles, MessageSquare, Camera, Navigation } from "lucide-react";
import BookingCard from "@/components/BookingCard";
import BookingMap from "@/components/BookingMap";
import AITravelAssistant from "@/components/AITravelAssistant";
import TripTimeline from "@/components/TripTimeline";
import WeatherForecast from "@/components/WeatherForecast";

const mockBookings = [
  {
    id: 1,
    destination: "Kyoto, Japan",
    dates: "Mar 15 - Mar 22, 2024",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    hotel: "Traditional Ryokan Inn",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    activities: ["Temple Visits", "Tea Ceremony", "Cherry Blossom Viewing"],
    totalCost: 2400,
    travelers: 2
  },
  {
    id: 2,
    destination: "Tuscany, Italy",
    dates: "Jun 10 - Jun 17, 2024",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    hotel: "Villa Countryside Resort",
    coordinates: { lat: 43.7711, lng: 11.2486 },
    activities: ["Wine Tasting", "Cooking Classes", "Art Tours"],
    totalCost: 1800,
    travelers: 4
  },
  {
    id: 3,
    destination: "Banff, Canada",
    dates: "Sep 5 - Sep 12, 2024",
    status: "planning",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    hotel: "Mountain Lodge Resort",
    coordinates: { lat: 51.4968, lng: -115.9281 },
    activities: ["Hiking", "Lake Tours", "Wildlife Watching"],
    totalCost: 1600,
    travelers: 2
  }
];

const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(mockBookings[0]);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-muted-foreground">Manage your trips with AI assistance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="koncii-button">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Trip Planner
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Trips</h2>
              <Badge variant="secondary">{mockBookings.length} trips</Badge>
            </div>
            
            {mockBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isSelected={selectedBooking.id === booking.id}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="map">Map & Route</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="koncii-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{selectedBooking.destination}</CardTitle>
                      <Badge 
                        variant={selectedBooking.status === 'confirmed' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative">
                      <img
                        src={selectedBooking.image}
                        alt={selectedBooking.destination}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">{selectedBooking.dates}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">{selectedBooking.travelers} travelers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{selectedBooking.hotel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-primary">
                          ${selectedBooking.totalCost}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Planned Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.activities.map((activity, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/10">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <WeatherForecast destination={selectedBooking.destination} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map" className="space-y-6">
                <BookingMap booking={selectedBooking} />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <TripTimeline booking={selectedBooking} />
              </TabsContent>

              <TabsContent value="ai-assistant" className="space-y-6">
                <AITravelAssistant booking={selectedBooking} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bookings;
