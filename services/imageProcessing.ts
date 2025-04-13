import { supabase } from '@/lib/supabase';
import openai, { processImageToTattoo } from '@/lib/openai';
import { ImageProcessRequest, ImageProcessResponse, ImageUploadRequest } from '@/types/api.types';
import * as FileSystem from 'expo-file-system';

/**
 * Generate a unique ID using timestamp and random values
 * Lightweight alternative to UUID, suitable for Expo apps
 */
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Process an image locally without uploading to Supabase storage
 */
export async function processLocalImage(
  userId: string,
  imageFile: ImageUploadRequest
): Promise<string> {
  try {
    // Create a unique file identifier
    const fileId = generateUniqueId();
    
    // Store the image locally in the app's file system
    const fileUri = FileSystem.documentDirectory + fileId + '.jpg';
    
    // If the image is already a file URI on the device, copy it
    if (imageFile.uri.startsWith('file://')) {
      await FileSystem.copyAsync({
        from: imageFile.uri,
        to: fileUri
      });
    } else {
      // For base64 or remote images, download/save them
      await FileSystem.writeAsStringAsync(
        fileUri,
        imageFile.uri.startsWith('data:') 
          ? imageFile.uri.split(',')[1] 
          : await FileSystem.readAsStringAsync(imageFile.uri, { encoding: FileSystem.EncodingType.Base64 }),
        { encoding: FileSystem.EncodingType.Base64 }
      );
    }
    
    // Save reference in the database (without storage_path)
    const { error: dbError } = await supabase.from('images').insert({
      user_id: userId,
      local_uri: fileId,
      processed: false,
    });

    if (dbError) {
      console.error('Error saving image reference:', dbError);
    }

    return fileUri;
  } catch (error) {
    console.error('Error processing local image:', error);
    throw error;
  }
}

/**
 * Process an image using OpenAI to create a tattoo design
 */
export async function generateTattooFromImage(
  request: ImageProcessRequest
): Promise<ImageProcessResponse> {
  try {
    // Step 1: Convert the image into a usable format
    let imageContent;
    if (request.imageUrl.startsWith('file://')) {
      const base64 = await FileSystem.readAsStringAsync(request.imageUrl, {
        encoding: FileSystem.EncodingType.Base64,
      });
      imageContent = `data:image/jpeg;base64,${base64}`;
    } else {
      imageContent = request.imageUrl;
    }

    // Get the selected style or use a default
    const style = request.style || 'minimalist';
    
    // Step 2 & 3: Generate the tattoo image using the function from openai.ts
    const tattooUrl = await processImageToTattoo(imageContent, style);
    
    if (!tattooUrl) {
      throw new Error("Failed to generate tattoo image");
    }
    
    // Step 4: Download and save the generated image locally
    const tattooId = generateUniqueId();
    const tattooUri = FileSystem.documentDirectory + tattooId + '.png';
    
    await FileSystem.downloadAsync(tattooUrl, tattooUri);
    
    // Extract the file ID from the original image URI
    const fileId = request.imageUrl.split('/').pop()?.split('.')[0];
    
    // Update the image record with the local URI for the tattoo
    await supabase
      .from('images')
      .update({
        tattoo_local_uri: tattooId,
        style: style,
        processed: true,
      })
      .eq('user_id', request.userId)
      .eq('local_uri', fileId);

    return {
      success: true,
      tattooUrl: tattooUri,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing image',
    };
  }
} 