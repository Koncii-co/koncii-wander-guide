
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Users, Clock, Sparkles, MessageSquare, Camera, Navigation, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import BookingCard from "@/components/BookingCard";
import BookingMap from "@/components/BookingMap";
import AITravelAssistant from "@/components/AITravelAssistant";
import TripTimeline from "@/components/TripTimeline";
import WeatherForecast from "@/components/WeatherForecast";
import { Booking, getUserBookings } from "@/services/bookingsService";
import { useToast } from "@/hooks/use-toast";

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user || isLoading) return;

      try {
        setLoading(true);
        const userBookings = await getUserBookings(user.sub!);
        setBookings(userBookings);
        if (userBookings.length > 0) {
          setSelectedBooking(userBookings[0]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, user, isLoading, toast]);

  const handleBackHome = () => {
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="koncii-card p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your bookings.
            </p>
            <Button onClick={() => navigate('/auth')} className="koncii-button">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackHome}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  My Bookings
                </h1>
                <p className="text-muted-foreground">Manage your trips with AI assistance</p>
              </div>
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
        {bookings.length === 0 ? (
          <Card className="koncii-card">
            <CardContent className="p-12 text-center space-y-4">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">No bookings yet</h3>
              <p className="text-muted-foreground">
                Start planning your trips and create your first booking
              </p>
              <Button className="koncii-button" onClick={() => navigate('/trips')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Plan a Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bookings List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Trips</h2>
                <Badge variant="secondary">{bookings.length} trips</Badge>
              </div>
              
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={{
                    id: parseInt(booking.id),
                    destination: booking.destination,
                    dates: booking.dates,
                    status: booking.status,
                    image: booking.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
                    hotel: booking.hotel || "Hotel",
                    coordinates: booking.coordinates as { lat: number; lng: number } || { lat: 0, lng: 0 },
                    activities: booking.activities || [],
                    totalCost: booking.total_cost,
                    travelers: booking.travelers
                  }}
                  isSelected={selectedBooking?.id === booking.id}
                  onClick={() => setSelectedBooking(booking)}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedBooking && (
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
                            src={selectedBooking.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"}
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
                              ${selectedBooking.total_cost}
                            </span>
                          </div>
                        </div>

                        {selectedBooking.activities && selectedBooking.activities.length > 0 && (
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
                        )}

                        <WeatherForecast destination={selectedBooking.destination} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="map" className="space-y-6">
                    <BookingMap booking={{
                      id: parseInt(selectedBooking.id),
                      destination: selectedBooking.destination,
                      dates: selectedBooking.dates,
                      status: selectedBooking.status,
                      image: selectedBooking.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
                      hotel: selectedBooking.hotel || "Hotel",
                      coordinates: selectedBooking.coordinates as { lat: number; lng: number } || { lat: 0, lng: 0 },
                      activities: selectedBooking.activities || [],
                      totalCost: selectedBooking.total_cost,
                      travelers: selectedBooking.travelers
                    }} />
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6">
                    <TripTimeline booking={{
                      id: parseInt(selectedBooking.id),
                      destination: selectedBooking.destination,
                      dates: selectedBooking.dates,
                      status: selectedBooking.status,
                      image: selectedBooking.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
                      hotel: selectedBooking.hotel || "Hotel",
                      coordinates: selectedBooking.coordinates as { lat: number; lng: number } || { lat: 0, lng: 0 },
                      activities: selectedBooking.activities || [],
                      totalCost: selectedBooking.total_cost,
                      travelers: selectedBooking.travelers
                    }} />
                  </TabsContent>

                  <TabsContent value="ai-assistant" className="space-y-6">
                    <AITravelAssistant booking={{
                      id: parseInt(selectedBooking.id),
                      destination: selectedBooking.destination,
                      dates: selectedBooking.dates,
                      status: selectedBooking.status,
                      image: selectedBooking.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
                      hotel: selectedBooking.hotel || "Hotel",
                      coordinates: selectedBooking.coordinates as { lat: number; lng: number } || { lat: 0, lng: 0 },
                      activities: selectedBooking.activities || [],
                      totalCost: selectedBooking.total_cost,
                      travelers: selectedBooking.travelers
                    }} />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookings;
