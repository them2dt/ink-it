import { supabase } from '@/lib/supabase';
import openai from '@/lib/openai';
import { ImageProcessRequest, ImageProcessResponse, ImageUploadRequest } from '@/types/api.types';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase storage
 */
export async function uploadImage(
  userId: string,
  imageFile: ImageUploadRequest
): Promise<string> {
  try {
    // Create a unique filename
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(imageFile.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Upload to Supabase
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, Buffer.from(base64, 'base64'), {
        contentType: imageFile.type,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    
    // Save reference in the database
    const { error: dbError } = await supabase.from('images').insert({
      user_id: userId,
      storage_path: filePath,
      processed: false,
    });

    if (dbError) {
      console.error('Error saving image reference:', dbError);
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Process an image using OpenAI to create a tattoo design
 */
export async function processImageToTattoo(
  request: ImageProcessRequest
): Promise<ImageProcessResponse> {
  try {
    // Call OpenAI's Vision API to process the image
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are a tattoo artist. Convert the user's image into a tattoo design that captures the essence of the original image but is optimized for a tattoo. Focus on clear lines, appropriate contrast, and a design that will age well as a tattoo."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Convert this image into a tattoo design." },
            { type: "image_url", image_url: { url: request.imageUrl } }
          ]
        }
      ],
      max_tokens: 300,
    });

    // Use DALL-E to generate the tattoo image based on the GPT-4 description
    const description = response.choices[0]?.message?.content || "";
    
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a tattoo design based on this description: ${description}. Make it with clear lines, high contrast, and suitable for a tattoo. Use a minimalist style with black ink only.`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const tattooUrl = imageResponse.data[0]?.url;
    
    if (!tattooUrl) {
      throw new Error("Failed to generate tattoo image");
    }

    // Download the generated image and upload to Supabase
    const imageData = await fetch(tattooUrl).then(res => res.arrayBuffer());
    const buffer = Buffer.from(imageData);
    
    // Create a tattoo file path
    const filePath = `${request.userId}/tattoos/${uuidv4()}.png`;
    
    // Upload the tattoo to Supabase
    const { error } = await supabase.storage
      .from('tattoos')
      .upload(filePath, buffer, {
        contentType: 'image/png',
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data } = supabase.storage.from('tattoos').getPublicUrl(filePath);
    
    // Update the image record
    await supabase
      .from('images')
      .update({
        tattoo_path: filePath,
        processed: true,
      })
      .eq('user_id', request.userId)
      .eq('storage_path', request.imageUrl.split('/').pop() || '');

    return {
      success: true,
      tattooUrl: data.publicUrl,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing image',
    };
  }
} 