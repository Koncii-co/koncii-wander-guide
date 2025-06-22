
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Star, ExternalLink } from "lucide-react";
import { AirbnbListing } from "@/services/airbnbService";

interface AirbnbShoppingCartProps {
  cartItems: AirbnbListing[];
  onRemoveFromCart: (listingId: string) => void;
  onBookAll: () => void;
}

const AirbnbShoppingCart = ({ cartItems, onRemoveFromCart, onBookAll }: AirbnbShoppingCartProps) => {
  const totalCost = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (cartItems.length === 0) {
    return (
      <Card className="koncii-card">
        <CardContent className="p-8 text-center space-y-4">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">
            Add some Airbnb accommodations to start planning your trip
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6" />
          <span>Airbnb Cart ({cartItems.length})</span>
        </h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold text-primary">${totalCost.toFixed(2)} CAD</p>
        </div>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="koncii-card">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <img
                  src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=120&fit=crop&q=80`}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                      {item.hostInfo && (
                        <p className="text-sm text-muted-foreground">{item.hostInfo}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {item.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{item.rating}</span>
                        {item.reviewCount && (
                          <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                        )}
                      </div>
                    )}
                    
                    {item.badges && (
                      <Badge variant="outline" className="text-xs">
                        {item.badges}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-lg text-primary">
                        ${item.totalPrice.toFixed(2)} CAD
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (${item.pricePerNight} CAD/night)
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View on Airbnb
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="koncii-card bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Ready to book your accommodations?</h3>
              <p className="text-sm text-muted-foreground">
                Complete your booking for all {cartItems.length} accommodations
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-2xl font-bold">${totalCost.toFixed(2)} CAD</p>
              <Button className="koncii-button" onClick={onBookAll}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Book All Accommodations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirbnbShoppingCart;
