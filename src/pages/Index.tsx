
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
import { useNavigate } from "react-router-dom";
import { syncUserWithSupabase } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showExpandedSearch, setShowExpandedSearch] = useState(false);
  const [userSynced, setUserSynced] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <KonciiLogo size={40} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
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
            <h2 className="text-4xl md:text-6xl font-bold transition-all duration-1000 hover:scale-105">
              Your AI Travel
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                Concierge
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 hover:text-foreground">
              Discover, plan, and book your perfect trip with AI-powered assistance every step of the way.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className={`max-w-2xl mx-auto relative transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Card className="koncii-card hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
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
        <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <QuickActions />
        </div>

        {/* Inspiration Carousel */}
        <section className={`space-y-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
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
          <ExploreSection />
        </div>
      </main>

      {/* Chat Interface */}
      {showChat && (
        <div className="animate-slide-in">
          <ChatInterface onClose={() => setShowChat(false)} />
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
