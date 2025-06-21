
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import DestinationDetailPopup from "./DestinationDetailPopup";

const InspirationCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      title: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
      price: "$1,299",
      rating: 4.9,
      duration: "7 days",
      description: "Experience the breathtaking sunsets and white-washed buildings of this Greek island paradise.",
      trending: true
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      title: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
      price: "$1,899",
      rating: 4.8,
      duration: "10 days",
      description: "Discover ancient temples, traditional gardens, and rich cultural heritage in Japan's former capital.",
      trending: false
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      title: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      price: "$899",
      rating: 4.7,
      duration: "5 days",
      description: "Relax on pristine beaches, explore lush rice terraces, and immerse yourself in Balinese culture.",
      trending: true
    },
    {
      id: 4,
      name: "Paris, France",  
      title: "Paris, France",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
      price: "$1,599",
      rating: 4.9,
      duration: "6 days",
      description: "Fall in love with the City of Light's romantic charm, world-class museums, and exquisite cuisine.",
      trending: false
    },
    {
      id: 5,
      name: "Machu Picchu, Peru",
      title: "Machu Picchu, Peru",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
      price: "$1,199",
      rating: 4.8,
      duration: "8 days",
      description: "Trek through the Andes to reach this ancient Incan citadel, one of the New Seven Wonders of the World.",
      trending: true
    }
  ];

  useEffect(() => {
    if (!api) return;

    api.on("init", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    return () => {
      api.destroy();
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleExploreClick = (destination: any) => {
    setSelectedDestination(destination);
  };

  return (
    <>
      <div className="relative">
        <Carousel
          setApi={setApi}
          className="w-full"
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }) as any,
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {destinations.map((destination, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={destination.image}
                        alt={destination.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {destination.trending && (
                        <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm animate-pulse">
                          Trending
                        </Badge>
                      )}
                      
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                          {destination.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {destination.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{destination.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="text-primary font-semibold">{destination.price}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full koncii-button group-hover:shadow-lg transition-shadow duration-200"
                        onClick={() => handleExploreClick(destination)}
                      >
                        Explore Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2 md:hidden">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${
                index + 1 === current ? "carousel-dot-active" : ""
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Destination Detail Popup */}
      {selectedDestination && (
        <DestinationDetailPopup
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </>
  );
};

export default InspirationCarousel;
