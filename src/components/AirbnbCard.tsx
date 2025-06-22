
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, Heart, ShoppingCart } from "lucide-react";
import { AirbnbListing } from "@/services/airbnbService";

interface AirbnbCardProps {
  listing: AirbnbListing;
  onAddToCart: (listing: AirbnbListing) => void;
  onViewDetails: (listing: AirbnbListing) => void;
  isInCart?: boolean;
}

const AirbnbCard = ({ listing, onAddToCart, onViewDetails, isInCart = false }: AirbnbCardProps) => {
  return (
    <Card className="koncii-card hover:scale-105 transition-all duration-300 group">
      <CardContent className="p-0">
        <div className="relative">
          {/* Placeholder image - in real implementation, you'd get this from the API */}
          <img
            src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&q=80`}
            alt={listing.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.badges && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {listing.badges}
              </Badge>
            )}
            {listing.freeCancellation && (
              <Badge variant="secondary" className="bg-green-500/90 text-white">
                Free cancellation
              </Badge>
            )}
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {listing.name}
            </h3>
            {listing.hostInfo && (
              <p className="text-sm text-muted-foreground">{listing.hostInfo}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {listing.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{listing.rating}</span>
                {listing.reviewCount && (
                  <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
                )}
              </div>
            )}
            
            {listing.bedInfo && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{listing.bedInfo}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-lg font-bold text-primary">${listing.pricePerNight} CAD</span>
              <span className="text-sm text-muted-foreground"> / night</span>
              <p className="text-xs text-muted-foreground">${listing.totalPrice} CAD total</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(listing)}
              >
                View Details
              </Button>
              <Button
                size="sm"
                className={`koncii-button ${isInCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => onAddToCart(listing)}
                disabled={isInCart}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {isInCart ? 'Added' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirbnbCard;
