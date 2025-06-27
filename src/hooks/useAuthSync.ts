
import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { syncUserWithSupabase } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

export const useAuthSync = () => {
  const [userSynced, setUserSynced] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth0();
  const { toast } = useToast();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user && !userSynced && !isLoading) {
        console.log('Syncing user with Supabase:', user);
        const profile = await syncUserWithSupabase(user);
        if (profile) {
          setUserSynced(true);
          console.log('User synced successfully:', profile);
        } else {
          toast({
            title: "Sync Error",
            description: "Failed to sync user profile. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, userSynced, isLoading, toast]);

  return { userSynced };
};
