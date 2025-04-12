import { supabase } from '@/lib/supabase';
import openai from '@/lib/openai';
import { ImageProcessRequest, ImageProcessResponse, ImageUploadRequest } from '@/types/api.types';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

/**
 * Process an image locally without uploading to Supabase storage
 */
export async function processLocalImage(
  userId: string,
  imageFile: ImageUploadRequest
): Promise<string> {
  try {
    // Create a unique file identifier
    const fileId = uuidv4();
    
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
export async function processImageToTattoo(
  request: ImageProcessRequest
): Promise<ImageProcessResponse> {
  try {
    // For local files, convert to base64 for OpenAI API
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

    // Call OpenAI's Vision API to process the image
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: `You are a tattoo artist. Convert the user's image into a tattoo design in the ${style} style. Capture the essence of the original image but optimize it for a tattoo. Focus on clear lines, appropriate contrast, and a design that will age well as a tattoo.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Convert this image into a tattoo design." },
            { type: "image_url", image_url: { url: imageContent } }
          ]
        }
      ],
      max_tokens: 300,
    });

    // Use DALL-E to generate the tattoo image based on the GPT-4 description
    const description = response.choices[0]?.message?.content || "";
    
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a tattoo design in the ${style} style based on this description: ${description}. Make it with clear lines, high contrast, and suitable for a tattoo.`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const tattooUrl = imageResponse.data[0]?.url;
    
    if (!tattooUrl) {
      throw new Error("Failed to generate tattoo image");
    }

    // Download the generated image to local file system
    const tattooId = uuidv4();
    const tattooUri = FileSystem.documentDirectory + tattooId + '.png';
    
    // Download the image from the OpenAI URL
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