import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/api.types';
import * as FileSystem from 'expo-file-system';

/**
 * Get the profile of the current user
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting user:', userError);
    return null;
  }

  // Get the user's profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: data.username,
    avatarUrl: data.avatar_url,
  };
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting user:', userError);
    return null;
  }

  // Update auth metadata if username is provided
  if (profile.username) {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { username: profile.username }
    });

    if (updateError) {
      console.error('Error updating auth metadata:', updateError);
    }
  }

  // Update the profile in the profiles table
  const updates = {
    ...(profile.username && { username: profile.username }),
    ...(profile.avatarUrl && { avatar_url: profile.avatarUrl }),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: data.username,
    avatarUrl: data.avatar_url,
  };
}

/**
 * Reset the user's profile data
 */
export async function resetUserProfile(): Promise<boolean> {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting user:', userError);
    return false;
  }

  // Reset the profile to default values
  const { error } = await supabase
    .from('profiles')
    .update({
      username: null,
      avatar_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error resetting profile:', error);
    return false;
  }

  // Get user's images from database to delete local files
  const { data: images } = await supabase
    .from('images')
    .select('local_uri, tattoo_local_uri')
    .eq('user_id', user.id);

  if (images && images.length > 0) {
    // Delete local image files
    for (const img of images) {
      try {
        if (img.local_uri) {
          const originalUri = FileSystem.documentDirectory + img.local_uri + '.jpg';
          await FileSystem.deleteAsync(originalUri, { idempotent: true });
        }
        
        if (img.tattoo_local_uri) {
          const tattooUri = FileSystem.documentDirectory + img.tattoo_local_uri + '.png';
          await FileSystem.deleteAsync(tattooUri, { idempotent: true });
        }
      } catch (e) {
        console.error('Error deleting local files:', e);
      }
    }

    // Delete image records from database
    const { error: dbError } = await supabase
      .from('images')
      .delete()
      .eq('user_id', user.id);
    
    if (dbError) {
      console.error('Error deleting image records:', dbError);
    }
  }

  return true;
} 