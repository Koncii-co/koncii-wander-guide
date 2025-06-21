import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar } from "lucide-react";
import DestinationDetailPopup from "./DestinationDetailPopup";

const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
    rating: 4.8,
    price: "From $899",
    description: "Tropical paradise with ancient temples",
    trending: true
  },
  {
    id: 2,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
    rating: 4.9,
    price: "From $1,299",
    description: "Stunning sunsets and whitewashed villages",
    trending: true
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    rating: 4.7,
    price: "From $1,099",
    description: "Modern metropolis meets ancient tradition",
    trending: false
  },
  {
    id: 4,
    name: "Patagonia, Chile",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    rating: 4.9,
    price: "From $1,599",
    description: "Breathtaking landscapes and adventure",
    trending: true
  },
  {
    id: 5,
    name: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
    rating: 4.6,
    price: "From $699",
    description: "Vibrant souks and stunning architecture",
    trending: false
  }
];

const InspirationCarousel = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);

  return (
    <div className="relative">
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {destinations.map((destination) => (
          <Card 
            key={destination.id} 
            className="koncii-card min-w-[320px] group cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {destination.trending && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Trending
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{destination.rating}</span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{destination.name}</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {destination.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {destination.price}
                  </span>
                  <Button size="sm" className="koncii-button" onClick={() => setSelectedDestination(destination)}>
                    Explore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDestination && (
        <DestinationDetailPopup
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </div>
  );
};

export default InspirationCarousel;
