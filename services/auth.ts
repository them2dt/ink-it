import { supabase } from '@/lib/supabase';
import { LoginCredentials, SignUpCredentials, PasswordChange } from '@/types/api.types';

/**
 * Sign up a new user
 */
export async function signUp({ email, password, username }: SignUpCredentials) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (data?.user) {
    // Create a profile for the user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: username || null,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }
  }

  return data;
}

/**
 * Sign in a user
 */
export async function signIn({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }

  return true;
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }

  return data.session;
}

/**
 * Change the user's password
 */
export async function changePassword({ oldPassword, newPassword }: PasswordChange) {
  // First verify the old password by trying to sign in
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    throw new Error('User not authenticated or email not available');
  }

  try {
    // Verify old password
    await signIn({ email: user.email, password: oldPassword });
    
    // Update to new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Reset password with email
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'ink-it://reset-password',
  });

  if (error) {
    throw error;
  }

  return true;
} 