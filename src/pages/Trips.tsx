
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingCart, Calendar, MapPin, Users, Trash2, Plus, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Trip, getUserTrips, deleteTrip } from "@/services/tripsService";
import { useToast } from "@/hooks/use-toast";

const Trips = () => {
  const [activeTab, setActiveTab] = useState("planned");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cartItems, setCartItems] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isAuthenticated || !user || isLoading) return;

      try {
        setLoading(true);
        const userTrips = await getUserTrips(user.sub!);
        
        // Separate confirmed/planning trips from cart items
        const confirmedTrips = userTrips.filter(trip => 
          trip.status === 'confirmed' || trip.status === 'planning'
        );
        const cartTrips = userTrips.filter(trip => 
          trip.status === 'planning' && trip.estimated_cost && !trip.total_cost
        );
        
        setTrips(confirmedTrips);
        setCartItems(cartTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast({
          title: "Error",
          description: "Failed to load trips. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [isAuthenticated, user, isLoading, toast]);

  const handleBackHome = () => {
    navigate('/');
  };

  const removeFromCart = async (tripId: string) => {
    if (!user) return;

    const success = await deleteTrip(user.sub!, tripId);
    if (success) {
      setCartItems(cartItems.filter(item => item.id !== tripId));
      toast({
        title: "Success",
        description: "Trip removed from cart"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to remove trip from cart",
        variant: "destructive"
      });
    }
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => total + (item.estimated_cost || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'planning': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="koncii-card p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view and manage your trips.
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
          <p>Loading your trips...</p>
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
                  My Trips
                </h1>
                <p className="text-muted-foreground">Plan and manage your adventures</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <ShoppingCart className="w-3 h-3" />
                <span>{cartItems.length} in cart</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm border border-border/30 p-1">
            <TabsTrigger 
              value="planned"
              className={`transition-all duration-200 ${
                activeTab === "planned" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50"
              }`}
            >
              Planned Trips ({trips.length})
            </TabsTrigger>
            <TabsTrigger 
              value="cart"
              className={`transition-all duration-200 ${
                activeTab === "cart" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50"
              }`}
            >
              Shopping Cart ({cartItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planned" className="space-y-6">
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <Card key={trip.id} className="koncii-card hover:scale-105 transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={trip.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"}
                          alt={trip.destination}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <Badge 
                          className={`absolute top-3 right-3 ${getStatusColor(trip.status)} capitalize`}
                        >
                          {trip.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-xl">{trip.destination}</h3>
                          <p className="text-sm text-muted-foreground">{trip.hotel}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            {trip.dates}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Users className="w-4 h-4 mr-2" />
                              {trip.travelers} travelers
                            </div>
                            <span className="font-bold text-lg text-primary">
                              ${trip.total_cost || trip.estimated_cost || 0}
                            </span>
                          </div>
                        </div>

                        {trip.activities && trip.activities.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Activities:</p>
                            <div className="flex flex-wrap gap-1">
                              {trip.activities.map((activity, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-primary/10">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <Button className="flex-1 koncii-button">
                            View Details
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Modify Trip
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="koncii-card">
                <CardContent className="p-12 text-center space-y-4">
                  <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No trips planned yet</h3>
                  <p className="text-muted-foreground">
                    Start planning your next adventure by exploring destinations
                  </p>
                  <Button className="koncii-button" onClick={handleBackHome}>
                    <Plus className="w-4 h-4 mr-2" />
                    Explore Destinations
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            {cartItems.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Your Trip Cart</h2>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total estimated cost</p>
                    <p className="text-2xl font-bold text-primary">${getTotalCartValue()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="koncii-card">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"}
                            alt={item.destination}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{item.destination}</h3>
                                <p className="text-sm text-muted-foreground">{item.hotel}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {item.dates}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {item.travelers} travelers
                              </div>
                            </div>

                            {item.activities && item.activities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.activities.map((activity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                              <span className="font-bold text-lg text-primary">
                                ${item.estimated_cost || 0}
                              </span>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Customize
                                </Button>
                                <Button size="sm" className="koncii-button">
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="koncii-card bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Ready to book your trips?</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete your booking for all {cartItems.length} trips
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-2xl font-bold">${getTotalCartValue()}</p>
                        <Button className="koncii-button">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Book All Trips
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="koncii-card">
                <CardContent className="p-12 text-center space-y-4">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">Your cart is empty</h3>
                  <p className="text-muted-foreground">
                    Start planning your next adventure by adding trips to your cart
                  </p>
                  <Button className="koncii-button" onClick={handleBackHome}>
                    <Plus className="w-4 h-4 mr-2" />
                    Explore Destinations
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Trips;
