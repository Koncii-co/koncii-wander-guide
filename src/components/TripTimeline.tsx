
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Utensils, Camera, CheckCircle, Edit } from "lucide-react";

interface Booking {
  id: number;
  destination: string;
  dates: string;
  status: string;
  image: string;
  hotel: string;
  coordinates: { lat: number; lng: number };
  activities: string[];
  totalCost: number;
  travelers: number;
}

interface TripTimelineProps {
  booking: Booking;
}

const TripTimeline = ({ booking }: TripTimelineProps) => {
  const timelineEvents = [
    {
      day: "Day 1",
      date: "Mar 15",
      events: [
        {
          time: "09:00",
          title: "Arrival & Check-in",
          location: booking.hotel,
          type: "accommodation",
          icon: <MapPin className="w-4 h-4" />,
          status: "completed"
        },
        {
          time: "14:00",
          title: "Welcome Lunch",
          location: "Local Restaurant",
          type: "dining",
          icon: <Utensils className="w-4 h-4" />,
          status: "completed"
        },
        {
          time: "16:00",
          title: "City Walking Tour",
          location: "Historic District",
          type: "activity",
          icon: <Camera className="w-4 h-4" />,
          status: "completed"
        }
      ]
    },
    {
      day: "Day 2",
      date: "Mar 16",
      events: [
        {
          time: "08:00",
          title: "Temple Visit",
          location: "Ancient Temple Complex",
          type: "activity",
          icon: <Camera className="w-4 h-4" />,
          status: "upcoming"
        },
        {
          time: "12:00",
          title: "Traditional Tea Ceremony",
          location: "Tea House",
          type: "cultural",
          icon: <Utensils className="w-4 h-4" />,
          status: "upcoming"
        },
        {
          time: "19:00",
          title: "Kaiseki Dinner",
          location: "Michelin Restaurant",
          type: "dining",
          icon: <Utensils className="w-4 h-4" />,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Day 3",
      date: "Mar 17",
      events: [
        {
          time: "10:00",
          title: "Cherry Blossom Viewing",
          location: "Maruyama Park",
          type: "activity",
          icon: <Camera className="w-4 h-4" />,
          status: "planned"
        },
        {
          time: "15:00",
          title: "Bamboo Grove Walk",
          location: "Arashiyama District",
          type: "activity",
          icon: <Camera className="w-4 h-4" />,
          status: "planned"
        }
      ]
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'accommodation': return 'bg-blue-500/20 text-blue-700';
      case 'dining': return 'bg-green-500/20 text-green-700';
      case 'activity': return 'bg-purple-500/20 text-purple-700';
      case 'cultural': return 'bg-orange-500/20 text-orange-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'planned': return <Calendar className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="koncii-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Trip Timeline
          </CardTitle>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {timelineEvents.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{day.day.split(' ')[1]}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{day.day}</h3>
                <p className="text-sm text-muted-foreground">{day.date}</p>
              </div>
            </div>

            <div className="ml-6 space-y-3 border-l-2 border-border/50 pl-6">
              {day.events.map((event, eventIndex) => (
                <div 
                  key={eventIndex} 
                  className="relative bg-card/50 rounded-lg p-4 hover:bg-card/80 transition-colors"
                >
                  <div className="absolute -left-8 top-6 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono text-muted-foreground">{event.time}</span>
                        <div className="flex items-center space-x-2">
                          {event.icon}
                          <span className="font-medium">{event.title}</span>
                        </div>
                        {getStatusIcon(event.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{event.location}</span>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type)} text-xs capitalize`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    
                    <Button size="sm" variant="ghost">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TripTimeline;
