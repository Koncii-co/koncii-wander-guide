
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";

const InspirationCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  const destinations = [
    {
      title: "Santorini, Greece",
      image: "/placeholder.svg",
      price: "$1,299",
      rating: 4.9,
      duration: "7 days",
      travelers: "2.1k",
      description: "Experience the breathtaking sunsets and white-washed buildings"
    },
    {
      title: "Kyoto, Japan",
      image: "/placeholder.svg",
      price: "$1,899",
      rating: 4.8,
      duration: "10 days",
      travelers: "1.8k",
      description: "Discover ancient temples and traditional Japanese culture"
    },
    {
      title: "Bali, Indonesia",
      image: "/placeholder.svg",
      price: "$899",
      rating: 4.7,
      duration: "5 days",
      travelers: "3.2k",
      description: "Relax on pristine beaches and explore lush rice terraces"
    },
    {
      title: "Paris, France",
      image: "/placeholder.svg",
      price: "$1,599",
      rating: 4.9,
      duration: "6 days",
      travelers: "2.7k",
      description: "Romance, art, and cuisine in the City of Light"
    },
    {
      title: "Machu Picchu, Peru",
      image: "/placeholder.svg",
      price: "$1,199",
      rating: 4.8,
      duration: "8 days",
      travelers: "1.5k",
      description: "Trek to the ancient Incan citadel in the clouds"
    }
  ];

  return (
    <div className="w-full space-y-4">
      <Carousel
        setApi={setApi}
        plugins={isMobile ? [
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
          }),
        ] : []}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {destinations.map((destination, index) => (
            <CarouselItem 
              key={index} 
              className={`pl-2 md:pl-4 ${isMobile ? 'basis-4/5' : 'basis-1/2 lg:basis-1/3'} ${isMobile ? 'animate-fade-in' : ''}`}
            >
              <Card className={`koncii-card group cursor-pointer overflow-hidden ${isMobile ? 'hover:scale-105 transition-all duration-500' : 'hover:scale-105 transition-all duration-300'}`}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className={`w-full h-48 object-cover ${isMobile ? 'group-hover:scale-110 transition-transform duration-700' : 'group-hover:scale-110 transition-transform duration-500'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-bold mb-1">{destination.title}</h4>
                      <div className="flex items-center space-x-3 text-sm opacity-90">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{destination.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{destination.travelers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{destination.price}</span>
                        <span className="text-muted-foreground text-sm ml-1">per person</span>
                      </div>
                      <Button 
                        size="sm" 
                        className={`koncii-button ${isMobile ? 'hover:scale-110 transition-all duration-300' : ''}`}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots - Only show on mobile */}
      {isMobile && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current - 1
                  ? 'bg-primary scale-125 shadow-lg shadow-primary/50'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InspirationCarousel;
