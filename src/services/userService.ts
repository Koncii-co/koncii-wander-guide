
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  auth0_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const syncUserWithSupabase = async (auth0User: any): Promise<UserProfile | null> => {
  try {
    console.log('Syncing user with Supabase:', auth0User);

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth0_user_id', auth0User.sub)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return null;
    }

    // Handle missing email - use a fallback or the Auth0 sub as identifier
    const email = auth0User.email || `${auth0User.sub}@auth0.local`;
    
    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          email: email,
          name: auth0User.name || auth0User.nickname || auth0User.given_name || 'User',
          avatar_url: auth0User.picture,
          updated_at: new Date().toISOString()
        })
        .eq('auth0_user_id', auth0User.sub)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return existingUser;
      }

      return updatedUser;
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          auth0_user_id: auth0User.sub,
          email: email,
          name: auth0User.name || auth0User.nickname || auth0User.given_name || 'User',
          avatar_url: auth0User.picture
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return null;
      }

      return newUser;
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    return null;
  }
};

export const getCurrentUserProfile = async (auth0UserId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth0_user_id', auth0UserId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};
