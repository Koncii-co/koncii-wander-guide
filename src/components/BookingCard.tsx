
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

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

interface BookingCardProps {
  booking: Booking;
  isSelected: boolean;
  onClick: () => void;
}

const BookingCard = ({ booking, isSelected, onClick }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'planning': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <Card 
      className={`koncii-card cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected ? 'ring-2 ring-primary border-primary/50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={booking.image}
            alt={booking.destination}
            className="w-full h-32 object-cover rounded-t-xl"
          />
          <Badge 
            className={`absolute top-2 right-2 ${getStatusColor(booking.status)} capitalize`}
          >
            {booking.status}
          </Badge>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{booking.destination}</h3>
            <p className="text-sm text-muted-foreground">{booking.hotel}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-3 h-3 mr-2" />
              {booking.dates}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Users className="w-3 h-3 mr-2" />
                {booking.travelers} travelers
              </div>
              <span className="font-semibold text-primary">${booking.totalCost}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
