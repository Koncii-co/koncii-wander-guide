
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, AlertTriangle, Compass } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Plan a Trip",
      description: "AI-powered itinerary planning",
      icon: Calendar,
      color: "bg-primary",
      action: () => console.log("Plan a trip clicked")
    },
    {
      title: "Nearby Highlights",
      description: "Discover local attractions",
      icon: Compass,
      color: "bg-accent",
      action: () => console.log("Nearby highlights clicked")
    },
    {
      title: "Travel Alerts",
      description: "Real-time updates & advisories",
      icon: AlertTriangle,
      color: "bg-orange-600",
      action: () => console.log("Travel alerts clicked")
    },
    {
      title: "My Location",
      description: "Explore current area",
      icon: MapPin,
      color: "bg-blue-600",
      action: () => console.log("My location clicked")
    }
  ];

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-bold">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card 
              key={index}
              className="koncii-card group cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={action.action}
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
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
