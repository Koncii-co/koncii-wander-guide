
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Calendar } from "lucide-react";

interface AirbnbSearchFormProps {
  onSearch: (location: string, checkin: string, checkout: string) => void;
  isLoading?: boolean;
}

const AirbnbSearchForm = ({ onSearch, isLoading = false }: AirbnbSearchFormProps) => {
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && checkin && checkout) {
      onSearch(location, checkin, checkout);
    }
  };

  return (
    <Card className="koncii-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-primary" />
          <span>Find Airbnb Accommodations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., San Diego, Paris, Tokyo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Check-in</span>
              </Label>
              <Input
                id="checkin"
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Check-out</span>
              </Label>
              <Input
                id="checkout"
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full koncii-button"
            disabled={isLoading || !location || !checkin || !checkout}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Airbnb
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AirbnbSearchForm;
