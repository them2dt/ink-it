import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/api.types';
import * as signInMethods from '@/services/auth';
import { getUserProfile } from '@/services/userProfile';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserProfile();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log(`Auth state changed: ${event}`);
        setSession(session);
        
        if (session) {
          await loadUserProfile();
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile data
  const loadUserProfile = async () => {
    setLoading(true);
    const profile = await getUserProfile();
    setUser(profile);
    setLoading(false);
  };

  // Sign up
  const signUp = async (email: string, password: string, username?: string) => {
    setLoading(true);
    try {
      await signInMethods.signUp({ email, password, username });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign up' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInMethods.signIn({ email, password });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign in' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await signInMethods.signOut();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign out' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      await signInMethods.changePassword({ oldPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred changing password' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await signInMethods.resetPassword(email);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred resetting password' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    changePassword,
    resetPassword,
    refreshProfile: loadUserProfile
  };
} 