
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, MapPin, Camera, Utensils, Compass, Star } from "lucide-react";

interface ExpandedSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
}

const aiSuggestions = [
  {
    id: 1,
    title: "Romantic Getaway",
    description: "Perfect destinations for couples",
    image: "https://images.unsplash.com/photo-1502780402662-acc01917949e?w=300&h=200&fit=crop",
    tags: ["Romance", "Beaches", "Wine"],
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 2,
    title: "Adventure Sports",
    description: "Thrilling outdoor activities",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
    tags: ["Hiking", "Climbing", "Rafting"],
    icon: <Compass className="w-5 h-5" />
  },
  {
    id: 3,
    title: "Cultural Experience",
    description: "Museums, history, and art",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop",
    tags: ["Museums", "History", "Art"],
    icon: <Camera className="w-5 h-5" />
  },
  {
    id: 4,
    title: "Food & Wine Tours",
    description: "Culinary adventures await",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
    tags: ["Food", "Wine", "Local"],
    icon: <Utensils className="w-5 h-5" />
  }
];

const quickSearches = [
  "Beach vacation", "Mountain retreat", "City break", "Safari adventure",
  "Cultural tour", "Food & wine", "Romantic getaway", "Family fun"
];

const ExpandedSearch = ({ searchQuery, setSearchQuery, onClose }: ExpandedSearchProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
        {/* Search Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">What's your dream destination?</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Expanded Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations, activities, or experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-6 py-6 text-xl bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Quick Search Tags */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-lg font-semibold mb-4">Popular searches</h3>
          <div className="flex flex-wrap gap-3">
            {quickSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="rounded-full bg-card/30 hover:bg-primary/20"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">AI Travel Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiSuggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className={`koncii-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedSuggestion === suggestion.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedSuggestion(
                  selectedSuggestion === suggestion.id ? null : suggestion.id
                )}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full">
                      {suggestion.icon}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {suggestion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button size="sm" className="w-full koncii-button">
                      Explore {suggestion.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Destinations Carousel */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Trending This Week</h3>
            <div className="flex items-center space-x-1 text-primary">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">AI Recommended</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Kyoto, Japan",
                image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
                price: "From $1,200",
                rating: 4.9,
                highlight: "Cherry Blossom Season"
              },
              {
                name: "Tuscany, Italy",
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
                price: "From $950",
                rating: 4.8,
                highlight: "Wine Harvest Tours"
              },
              {
                name: "Banff, Canada",
                image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
                price: "From $800",
                rating: 4.9,
                highlight: "Fall Colors Peak"
              }
            ].map((destination, index) => (
              <Card key={index} className="koncii-card overflow-hidden hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {destination.highlight}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2">{destination.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{destination.price}</span>
                      <Button size="sm" className="koncii-button">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedSearch;
