
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface DelhiHeritageSectionProps {
  isLoaded: boolean;
  onChatOpenWithPrompt: (prompt: string) => void;
}

const DelhiHeritageSection = ({ isLoaded, onChatOpenWithPrompt }: DelhiHeritageSectionProps) => {
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
                  onClick={() => onChatOpenWithPrompt(`Tell me more about ${destination.name} in Delhi and help me plan a visit there.`)}
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
  );
};

export default DelhiHeritageSection;
