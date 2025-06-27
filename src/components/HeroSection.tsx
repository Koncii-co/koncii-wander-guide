
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchClick: () => void;
  isLoaded: boolean;
}

const HeroSection = ({ searchQuery, setSearchQuery, onSearchClick, isLoaded }: HeroSectionProps) => {
  return (
    <section className={`text-center space-y-6 py-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold transition-all duration-1000 hover:scale-105 animate-bounce-in-ease">
          Your AI Travel
          <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse animate-ease-in-bounce">
            Concierge
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 hover:text-foreground animate-ease-in-bounce">
          Discover, plan, and book your perfect trip with AI-powered assistance every step of the way.
        </p>
      </div>

      {/* Enhanced Search Bar */}
      <div className={`max-w-2xl mx-auto relative transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <Card className="koncii-card hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-bounce-in">
          <CardContent className="p-2 md:p-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              <Input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-16 py-3 md:pl-12 md:pr-20 md:py-4 text-base md:text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 koncii-button hover:scale-110 transition-all duration-300 text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
                size="sm"
                onClick={onSearchClick}
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
