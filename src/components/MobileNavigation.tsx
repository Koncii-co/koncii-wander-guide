
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Sparkles, MapPin, Calendar, User, Settings, LogOut, Edit } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import KonciiLogo from "./KonciiLogo";

interface MobileNavigationProps {
  onChatToggle: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onChatToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth0();
  const navigate = useNavigate();

  const handleTripsClick = () => {
    navigate('/trips');
    setIsOpen(false);
  };

  const handleBookingsClick = () => {
    navigate('/bookings');
    setIsOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/auth');
    setIsOpen(false);
  };

  const handleProfileEdit = () => {
    console.log('Edit profile clicked');
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    setIsOpen(false);
  };

  const handleChatClick = () => {
    onChatToggle();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:scale-105 transition-transform duration-200">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
          <SheetHeader className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <KonciiLogo size={32} />
              <SheetTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Koncii
              </SheetTitle>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Navigation
                </h3>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin className="w-4 h-4 mr-3" />
                  Explore
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={handleTripsClick}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Trips
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={handleBookingsClick}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Bookings
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={handleChatClick}
                >
                  <Sparkles className="w-4 h-4 mr-3" />
                  AI Assistant
                </Button>
              </div>
              
              <div className="pt-4 space-y-2 border-t border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
                
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 rounded-md bg-muted/50">
                      <p className="text-sm font-medium">{user?.name || user?.email || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      onClick={handleProfileEdit}
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Profile
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    onClick={handleAuthClick}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Sign In
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
