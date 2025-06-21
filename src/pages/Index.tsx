
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, User, Settings } from "lucide-react";
import InspirationCarousel from "@/components/InspirationCarousel";
import QuickActions from "@/components/QuickActions";
import ExploreSection from "@/components/ExploreSection";
import ChatInterface from "@/components/ChatInterface";
import ThemeToggle from "@/components/ThemeToggle";
import KonciiLogo from "@/components/KonciiLogo";
import ExpandedSearch from "@/components/ExpandedSearch";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showExpandedSearch, setShowExpandedSearch] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <KonciiLogo size={40} className="text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Koncii
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm">Explore</Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleTripsClick}
            >
              Trips
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBookingsClick}
            >
              Bookings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              AI Assistant
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAuthClick}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold">
              Your AI Travel
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Concierge
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover, plan, and book your perfect trip with AI-powered assistance every step of the way.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-card/50 backdrop-blur-sm border-border/50 rounded-xl"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 koncii-button"
                size="sm"
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <QuickActions />

        {/* Inspiration Carousel */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold">Trending Destinations</h3>
            <Button variant="ghost">View All</Button>
          </div>
          <InspirationCarousel />
        </section>

        {/* Explore Section */}
        <ExploreSection />
      </main>

      {/* Chat Interface */}
      {showChat && (
        <ChatInterface onClose={() => setShowChat(false)} />
      )}

      {/* Expanded Search Interface */}
      {showExpandedSearch && (
        <ExpandedSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClose={() => setShowExpandedSearch(false)}
        />
      )}
    </div>
  );
};

export default Index;
