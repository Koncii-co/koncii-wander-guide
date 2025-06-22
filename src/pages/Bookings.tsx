
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingCart, Search, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@/hooks/use-toast";
import AirbnbSearchForm from "@/components/AirbnbSearchForm";
import AirbnbCard from "@/components/AirbnbCard";
import AirbnbShoppingCart from "@/components/AirbnbShoppingCart";
import { AirbnbListing, airbnbService } from "@/services/airbnbService";
import { createTrip } from "@/services/tripsService";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [airbnbListings, setAirbnbListings] = useState<AirbnbListing[]>([]);
  const [cartItems, setCartItems] = useState<AirbnbListing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<{location: string, checkin: string, checkout: string} | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { toast } = useToast();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleSearch = async (location: string, checkin: string, checkout: string) => {
    try {
      setIsSearching(true);
      setSearchParams({ location, checkin, checkout });
      console.log('Searching for Airbnbs:', { location, checkin, checkout });
      
      const listings = await airbnbService.searchAirbnbs(location, checkin, checkout);
      console.log('Found listings:', listings);
      
      setAirbnbListings(listings);
      setActiveTab("results");
      
      toast({
        title: "Search Complete",
        description: `Found ${listings.length} accommodations in ${location}`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for accommodations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCart = (listing: AirbnbListing) => {
    if (!cartItems.find(item => item.id === listing.id)) {
      setCartItems([...cartItems, listing]);
      toast({
        title: "Added to Cart",
        description: `${listing.name} has been added to your cart`,
      });
    }
  };

  const handleRemoveFromCart = (listingId: string) => {
    setCartItems(cartItems.filter(item => item.id !== listingId));
    toast({
      title: "Removed from Cart",
      description: "Accommodation removed from your cart",
    });
  };

  const handleViewDetails = (listing: AirbnbListing) => {
    if (listing.url) {
      window.open(listing.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookAll = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book accommodations.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save each cart item as a booking/trip
      for (const item of cartItems) {
        const tripData = {
          destination: searchParams?.location || 'Unknown Location',
          dates: searchParams ? `${searchParams.checkin} to ${searchParams.checkout}` : 'TBD',
          status: 'confirmed' as const,
          hotel: item.name,
          travelers: 1,
          total_cost: Math.round(item.totalPrice),
          activities: ['Accommodation Booking'],
          coordinates: {
            lat: item.coordinates.latitude,
            lng: item.coordinates.longitude
          }
        };

        await createTrip(user.sub!, tripData);
      }

      toast({
        title: "Bookings Confirmed!",
        description: `Successfully booked ${cartItems.length} accommodations`,
      });

      // Clear cart and navigate to trips
      setCartItems([]);
      navigate('/trips');
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: "Failed to complete bookings. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="koncii-card p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to search and book accommodations.
            </p>
            <Button onClick={() => navigate('/auth')} className="koncii-button">
              Sign In
            </Button>
          </CardContent>
        </Card>
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
                  Airbnb Bookings
                </h1>
                <p className="text-muted-foreground">Find and book your perfect accommodation</p>
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
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-border/30 p-1">
            <TabsTrigger 
              value="search"
              className={`transition-all duration-200 ${
                activeTab === "search" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50"
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger 
              value="results"
              className={`transition-all duration-200 ${
                activeTab === "results" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50"
              }`}
            >
              Results ({airbnbListings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="cart"
              className={`transition-all duration-200 ${
                activeTab === "cart" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50"
              }`}
            >
              Cart ({cartItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <AirbnbSearchForm onSearch={handleSearch} isLoading={isSearching} />
            
            {searchParams && (
              <Card className="koncii-card">
                <CardHeader>
                  <CardTitle>Recent Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{searchParams.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{searchParams.checkin} to {searchParams.checkout}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {airbnbListings.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    Found {airbnbListings.length} accommodations
                    {searchParams && ` in ${searchParams.location}`}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("search")}
                  >
                    New Search
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {airbnbListings.map((listing) => (
                    <AirbnbCard
                      key={listing.id}
                      listing={listing}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                      isInCart={cartItems.some(item => item.id === listing.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="koncii-card">
                <CardContent className="p-12 text-center space-y-4">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No results yet</h3>
                  <p className="text-muted-foreground">
                    Start by searching for accommodations in your desired location
                  </p>
                  <Button className="koncii-button" onClick={() => setActiveTab("search")}>
                    Start Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <AirbnbShoppingCart
              cartItems={cartItems}
              onRemoveFromCart={handleRemoveFromCart}
              onBookAll={handleBookAll}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Bookings;
