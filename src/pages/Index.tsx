import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, User, Settings, LogOut, Edit, Sparkles } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import InspirationCarousel from "@/components/InspirationCarousel";
import QuickActions from "@/components/QuickActions";
import ExploreSection from "@/components/ExploreSection";
import ChatInterface from "@/components/ChatInterface";
import ThemeToggle from "@/components/ThemeToggle";
import KonciiLogo from "@/components/KonciiLogo";
import ExpandedSearch from "@/components/ExpandedSearch";
import MobileNavigation from "@/components/MobileNavigation";
import GlitteryBackground from "@/components/GlitteryBackground";
import SafeImage from "@/components/SafeImage";
import { useNavigate } from "react-router-dom";
import { syncUserWithSupabase } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showExpandedSearch, setShowExpandedSearch] = useState(false);
  const [userSynced, setUserSynced] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const { toast } = useToast();

  // Sync user with Supabase when authenticated
  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user && !userSynced && !isLoading) {
        console.log('Syncing user with Supabase:', user);
        const profile = await syncUserWithSupabase(user);
        if (profile) {
          setUserSynced(true);
          console.log('User synced successfully:', profile);
        } else {
          toast({
            title: "Sync Error",
            description: "Failed to sync user profile. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, userSynced, isLoading, toast]);

  // Animation loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchClick = () => {
    setShowExpandedSearch(true);
  };

  const handleBookingsClick = () => {
    navigate('/bookings');
  };

  const handleTripsClick = () => {
    navigate('/trips');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleProfileEdit = () => {
    console.log('Edit profile clicked');
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const handleChatOpenWithPrompt = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setShowChat(true);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setInitialChatPrompt("");
  };

  // Delhi-curated destinations data with correct images
  const delhiDestinations = [
    {
      id: 1,
      name: "Red Fort",
      location: "Old Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&q=80",
      description: "Historic Mughal fortress and UNESCO World Heritage Site"
    },
    {
      id: 2,
      name: "India Gate",
      location: "Central Delhi",
      image: "https://images.unsplash.com/photo-1597149212-5e8a35d0ba5c?w=400&h=300&fit=crop&q=80",
      description: "War memorial and iconic landmark of Delhi"
    },
    {
      id: 3,
      name: "Lotus Temple",
      location: "South Delhi",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df0?w=400&h=300&fit=crop&q=80",
      description: "Bahá'í House of Worship known for its lotus-like architecture"
    },
    {
      id: 4,
      name: "Humayun's Tomb",
      location: "Central Delhi",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80",
      description: "Mughal architecture masterpiece and garden tomb"
    },
    {
      id: 5,
      name: "Qutub Minar",
      location: "South Delhi",
      image: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=400&h=300&fit=crop&q=80",
      description: "Tallest brick minaret in the world"
    },
    {
      id: 6,
      name: "Chandni Chowk",
      location: "Old Delhi",
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&h=300&fit=crop&q=80",
      description: "Bustling market street in the heart of Old Delhi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative">
      {/* Glittery Background */}
      <GlitteryBackground />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="transition-transform duration-300 group-hover:scale-110 animate-bounce-in">
              <KonciiLogo size={40} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 animate-ease-in-bounce">
              Koncii
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">Explore</Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleTripsClick}
              className="hover:scale-105 transition-transform duration-200"
            >
              Trips
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBookingsClick}
              className="hover:scale-105 transition-transform duration-200"
            >
              Bookings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="hover:scale-105 transition-transform duration-200 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Assistant</span>
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Mobile Navigation */}
            <MobileNavigation onChatToggle={() => setShowChat(!showChat)} />
            
            <ThemeToggle />
            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 animate-fade-in">
                  <span className="text-sm font-medium hidden sm:inline">
                    {user?.name || user?.email || 'User'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleProfileEdit}
                    className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAuthClick}
                  className="flex items-center space-x-2 hover:scale-105 transition-all duration-200 animate-fade-in"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="hover:scale-105 transition-transform duration-200">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12 relative z-10">
        {/* Hero Section */}
        <section className={`text-center space-y-6 py-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold transition-all duration-1000 hover:scale-105 animate-bounce-in-ease">
              Your AI Travel
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse animate-ease-in-bounce">
                Concierge
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 hover:text-foreground animate-ease-in-bounce">
              Discover, plan, and book your perfect trip with AI-powered assistance every step of the way.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className={`max-w-2xl mx-auto relative transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Card className="koncii-card hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-bounce-in">
              <CardContent className="p-2 md:p-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <Input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-16 py-3 md:pl-12 md:pr-20 md:py-4 text-base md:text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 koncii-button hover:scale-110 transition-all duration-300 text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
                    size="sm"
                    onClick={handleSearchClick}
                  >
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} animate-ease-in-bounce`}>
          <QuickActions onChatOpen={handleChatOpenWithPrompt} />
        </div>

        {/* Delhi-Curated Destinations */}
        <section className={`space-y-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} animate-ease-in-bounce`}>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text animate-bounce-in-ease">
              Explore Delhi's Heritage
            </h3>
            <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">
              View All
            </Button>
          </div>
          
          {/* Delhi Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {delhiDestinations.map((destination) => (
              <Card key={destination.id} className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <SafeImage
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      fallbackIcon={
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-lg font-semibold">{destination.name}</h4>
                      <p className="text-sm opacity-90 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {destination.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{destination.description}</p>
                    <Button 
                      size="sm" 
                      className="w-full mt-3 koncii-button"
                      onClick={() => handleChatOpenWithPrompt(`Tell me more about ${destination.name} in Delhi and help me plan a visit there.`)}
                    >
                      Plan Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Delhi Travel Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="koncii-card">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">Best Time to Visit</h4>
                <p className="text-sm text-muted-foreground">October to March offers pleasant weather for exploring Delhi's attractions.</p>
              </CardContent>
            </Card>
            <Card className="koncii-card">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">Local Transport</h4>
                <p className="text-sm text-muted-foreground">Delhi Metro is the most convenient way to travel across the city.</p>
              </CardContent>
            </Card>
            <Card className="koncii-card">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">Must Try Food</h4>
                <p className="text-sm text-muted-foreground">Street food at Chandni Chowk and Connaught Place is a must-experience.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inspiration Carousel */}
        <section className={`space-y-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} animate-ease-in-bounce`}>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text animate-bounce-in-ease">
              Trending Destinations
            </h3>
            <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">
              View All
            </Button>
          </div>
          <InspirationCarousel />
        </section>

        {/* Explore Section */}
        <div className={`transition-all duration-1000 delay-1100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <ExploreSection onAIAgentClick={() => {
            setInitialChatPrompt("I want to explore travel options and get personalized recommendations. Can you help me plan my next adventure?");
            setShowChat(true);
          }} />
        </div>
      </main>

      {/* Chat Interface */}
      {showChat && (
        <div className="animate-slide-in">
          <ChatInterface onClose={handleChatClose} initialPrompt={initialChatPrompt} />
        </div>
      )}

      {/* Expanded Search Interface */}
      {showExpandedSearch && (
        <div className="animate-fade-in">
          <ExpandedSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowExpandedSearch(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
