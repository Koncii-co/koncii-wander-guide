
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Edit, User, Sparkles } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import ThemeToggle from "@/components/ThemeToggle";
import KonciiLogo from "@/components/KonciiLogo";
import MobileNavigation from "@/components/MobileNavigation";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoaded: boolean;
  onChatToggle: () => void;
}

const Header = ({ isLoaded, onChatToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth0();

  const handleTripsClick = () => {
    navigate('/trips');
  };

  const handleBookingsClick = () => {
    navigate('/bookings');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleProfileEdit = () => {
    console.log('Edit profile clicked');
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <header className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group">
          <div className="transition-transform duration-300 group-hover:scale-110 animate-bounce-in">
            <KonciiLogo size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 animate-ease-in-bounce">
            Koncii
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">Explore</Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleTripsClick}
            className="hover:scale-105 transition-transform duration-200"
          >
            Trips
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBookingsClick}
            className="hover:scale-105 transition-transform duration-200"
          >
            Bookings
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onChatToggle}
            className="hover:scale-105 transition-transform duration-200 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          {/* Mobile Navigation */}
          <MobileNavigation onChatToggle={onChatToggle} />
          
          <ThemeToggle />
          
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 animate-fade-in">
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.name || user?.email || 'User'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleProfileEdit}
                  className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAuthClick}
                className="flex items-center space-x-2 hover:scale-105 transition-all duration-200 animate-fade-in"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="hover:scale-105 transition-transform duration-200">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
