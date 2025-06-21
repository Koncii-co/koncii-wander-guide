
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Github } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

const AuthModal = ({ mode, onClose, onSwitchMode }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { toast } = useToast();

  // Close modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Success",
        description: "Successfully signed in!"
      });
      onClose();
    }
  }, [isAuthenticated, onClose, toast]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup' && password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }

      // Use Auth0 for email/password authentication
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: mode === 'signup' ? 'signup' : 'login',
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  };

  const handleGithubAuth = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'github',
      },
    });
  };

  // Show loading state while Auth0 is processing
  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p>Authenticating...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Welcome back! Please sign in to your account.' 
              : 'Create a new account to get started with Koncii.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={loading || isLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGithubAuth}
              disabled={loading || isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || isLoading}
                />
              </div>
            )}

            <Button type="submit" className="w-full koncii-button" disabled={loading || isLoading}>
              {loading || isLoading ? "Please wait..." : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              disabled={loading || isLoading}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
