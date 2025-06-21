import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Star, Sparkles, Sun, Wind, Droplets } from "lucide-react";

interface Destination {
  id: number;
  name: string;
  image: string;
  rating: number;
  price: string;
  description: string;
  trending: boolean;
}

interface DestinationDetailPopupProps {
  destination: Destination;
  onClose: () => void;
}

const DestinationDetailPopup = ({ destination, onClose }: DestinationDetailPopupProps) => {
  const aiSuggestions = [
    { title: "Visit the Uluwatu Temple", description: "Experience a traditional Kecak fire dance at sunset.", icon: <Sparkles className="w-4 h-4 text-primary" /> },
    { title: "Explore the Tegallalang Rice Terraces", description: "Walk through lush green landscapes and enjoy stunning views.", icon: <Sparkles className="w-4 h-4 text-primary" /> },
    { title: "Relax on Seminyak Beach", description: "Enjoy the sunset, beach clubs, and vibrant nightlife.", icon: <Sparkles className="w-4 h-4 text-primary" /> }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl mx-4 h-[90vh] flex flex-col koncii-card">
        <CardHeader className="relative p-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-4xl font-bold text-white">{destination.name}</h2>
            <p className="text-lg text-white/80">{destination.description}</p>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <Badge variant="secondary" className="text-lg">
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              {destination.rating}
            </Badge>
            <Button variant="ghost" size="icon" className="text-white bg-black/50 hover:bg-black/70 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* AI Placeholder */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-primary" />
              AI-Powered Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <Card key={index} className="bg-card/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      {suggestion.icon}
                      <h4 className="font-semibold">{suggestion.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Weather Placeholder */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Weather Forecast</h3>
            <div className="flex space-x-4">
              <Card className="flex-1 bg-card/50 text-center">
                <CardContent className="p-4">
                  <Sun className="w-8 h-8 mx-auto text-yellow-400" />
                  <p className="text-2xl font-bold mt-2">28°C</p>
                  <p className="text-muted-foreground">Sunny</p>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-card/50 text-center">
                <CardContent className="p-4">
                  <Wind className="w-8 h-8 mx-auto text-blue-400" />
                  <p className="text-2xl font-bold mt-2">12 km/h</p>
                  <p className="text-muted-foreground">Wind</p>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-card/50 text-center">
                <CardContent className="p-4">
                  <Droplets className="w-8 h-8 mx-auto text-cyan-400" />
                  <p className="text-2xl font-bold mt-2">78%</p>
                  <p className="text-muted-foreground">Humidity</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center pt-4">
            <Button size="lg" className="koncii-button">
              Start Planning Your Trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DestinationDetailPopup; 