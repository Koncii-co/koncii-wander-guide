
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, MessageSquare } from "lucide-react";

interface AirbnbSearchFormProps {
  onSearch: (location: string, checkin: string, checkout: string) => void;
  onPromptSearch: (prompt: string) => void;
  isLoading?: boolean;
}

const AirbnbSearchForm = ({ onSearch, onPromptSearch, isLoading = false }: AirbnbSearchFormProps) => {
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [prompt, setPrompt] = useState('');

  const suggestedPrompts = [
    "Find me a cozy studio in downtown Toronto for next weekend",
    "Looking for a beachfront Airbnb in San Diego for 3 nights",
    "Need a family-friendly place in Vancouver under $200/night",
    "Find luxury accommodations in Montreal for a romantic getaway",
    "Looking for pet-friendly Airbnbs in Seattle with kitchen facilities"
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && checkin && checkout) {
      onSearch(location, checkin, checkout);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSearch(prompt.trim());
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
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
        <Tabs defaultValue="form" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Form Search</span>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>AI Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
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
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4">
            <form onSubmit={handlePromptSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Describe what you're looking for</span>
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Find me a cozy beachfront studio in San Diego for next weekend under $200/night"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Suggested searches:</Label>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedPrompts.map((suggestedPrompt, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto p-3 text-wrap"
                      onClick={() => handleSuggestedPrompt(suggestedPrompt)}
                    >
                      {suggestedPrompt}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full koncii-button"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Search with AI
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AirbnbSearchForm;
