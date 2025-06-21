
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { MapPin, Calendar, AlertTriangle, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

interface QuickActionsProps {
  onChatOpen?: (prompt: string) => void;
}

const QuickActions = ({ onChatOpen }: QuickActionsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const actions = [
    {
      title: "Plan a Trip",
      description: "AI-powered itinerary planning",
      icon: Calendar,
      color: "bg-primary",
      prompt: "I want to plan a comprehensive trip. Can you help me create a detailed itinerary including destinations, activities, accommodations, and transportation options? Please ask me about my preferences, budget, travel dates, and interests to create the perfect trip plan."
    },
    {
      title: "Nearby Highlights",
      description: "Discover local attractions",
      icon: Compass,
      color: "bg-accent",
      prompt: "I'm looking to discover amazing local attractions and highlights near my current location or a specific destination. Can you help me find hidden gems, popular tourist spots, restaurants, cultural sites, and unique experiences? Please ask me about the location I'm interested in exploring."
    },
    {
      title: "Travel Alerts",
      description: "Real-time updates & advisories",
      icon: AlertTriangle,
      color: "bg-orange-600",
      prompt: "I need current travel alerts and advisories for my destination. Can you provide real-time information about weather conditions, safety alerts, transportation disruptions, entry requirements, health advisories, and any other important travel updates? Please ask me about my destination and travel dates."
    },
    {
      title: "My Location",
      description: "Explore current area",
      icon: MapPin,
      color: "bg-blue-600",
      prompt: "I want to explore my current area or a specific location. Can you help me discover local attractions, restaurants, events, activities, and interesting places nearby? Please ask me about the specific location I'd like to explore and what type of experiences I'm looking for."
    }
  ];

  const ActionCard = ({ action, index }: { action: typeof actions[0], index: number }) => {
    const IconComponent = action.icon;
    
    const handleGetStarted = () => {
      if (onChatOpen) {
        onChatOpen(action.prompt);
      }
    };

    return (
      <Card 
        key={index}
        className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300"
      >
        <CardContent className="p-6 text-center space-y-4">
          <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">{action.title}</h4>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full border border-border/50 hover:bg-primary hover:text-primary-foreground"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-bold">Quick Actions</h3>
      
      {isMobile ? (
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            }) as any,
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {actions.map((action, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5">
                <ActionCard action={action} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <ActionCard key={index} action={action} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default QuickActions;
