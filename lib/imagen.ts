import Constants from 'expo-constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI client with API key
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey || '';

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

/**
 * Generate a specialized prompt for tattoo design based on style
 */
export function generateTattooPrompt(
  style: string
): string {
  // Base prompt that applies to all tattoo styles
  const basePrompt = `Design a black and grey tattoo of [subject], in [style] style. The design should be clear and detailed, with bold outlines and no shading gradients. Present the tattoo on a pure white background (#FFFFFF), ensuring it's suitable as a stencil or template.`;

  // Style-specific additions to the prompt
  const stylePrompts: Record<string, string> = {
    'Traditional': `Incorporate bold black outlines and a limited color palette, featuring iconic motifs such as anchors, roses, or swallows. The design should reflect the classic American traditional tattoo style, emphasizing simplicity and strong symbolism.`,
    'Realism': `Render the subject with lifelike detail, capturing intricate textures and depth through precise shading. The design should closely resemble a high-resolution black and grey photograph, emphasizing realism and accuracy.`,
    'Neo-Traditional': `Blend traditional tattoo elements with modern artistic techniques, using bold outlines combined with intricate details and a broader color palette. The design should offer a contemporary twist on classic motifs, adding depth and dimension.`,
    'Japanese': `Incorporate traditional Japanese motifs such as koi fish, dragons, or cherry blossoms, using bold outlines and vibrant colors. The design should reflect the rich cultural heritage and storytelling aspects of Irezumi, emphasizing balance and flow.`,
    'Tribal': `Utilize bold black lines and repetitive geometric patterns inspired by indigenous tribal art. The design should be abstract, focusing on symmetry and symbolic meaning, reflecting traditional tribal tattoo aesthetics.`,
  };

  // Get the style-specific prompt or use a default
  const stylePrompt = stylePrompts[style] || stylePrompts['Minimalist'];

  // Combine the base prompt with the style-specific instructions
  return `${basePrompt}\n\n${stylePrompt}`;
}

/**
 * Process an image to generate a tattoo design using Google's Imagen
 * @param imageContent Base64 or URL of the input image
 * @param style Tattoo style to apply
 * @returns URL of the generated tattoo image
 */
export async function processImageToTattoo(
  imageContent: string,
  style: string
): Promise<string> {
  // First, analyze the image with Gemini to get a description
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  // Convert base64 image if needed
  let fileData;
  if (imageContent.startsWith('data:')) {
    // Extract base64 data if it's in data URL format
    const base64Data = imageContent.split(',')[1];
    fileData = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };
  } else {
    // If it's a URL, we need to fetch the image and convert to base64
    // Currently the Gemini API doesn't support direct URL inputs for images
    console.log("URL image provided, this currently requires fetching & conversion to base64");
    // Use placeholder for now - in production you would fetch and convert the image
    fileData = {
      inlineData: {
        data: "placeholder-base64-data",
        mimeType: "image/jpeg"
      }
    };
  }
  
  // Analyze the image
  const result = await model.generateContent([
    "You are a tattoo artist specializing in " + style + " style. " +
    "Your task is to identify and describe the KEY ELEMENTS in the provided image with extreme precision. " +
    "Focus on shapes, objects, subjects, composition, and critical visual details. " +
    "Be extremely specific about what makes this image unique and recognizable. " +
    "Your description will be used to create a tattoo that MUST reflect these key elements faithfully. " +
    "Keep your response under 200 words and focus exclusively on visual elements.",
    fileData
  ]);
  
  const imageDescription = result.response.text();
  
  // Generate a detailed prompt that emphasizes preserving the original image elements
  const baseStylePrompt = generateTattooPrompt(style);
  const enhancedPrompt = `
IMPORTANT: Create a tattoo design in the ${style} style that FAITHFULLY REPRODUCES these specific elements from the original image:

${imageDescription}

The design MUST be immediately recognizable as derived from the original image while applying the ${style} style aesthetics.

${baseStylePrompt}

CRITICAL: The subject matter and composition MUST closely match the original image - do NOT create a generic design.
`;

  try {
    // For now, we'll return a test image URL since we can't directly generate images with the current API
    // In a production environment, this would be integrated with an actual image generation API
    // such as Imagen or another Google service that returns image URLs
    
    console.log("Generated prompt for tattoo design:", enhancedPrompt);
    
    // Placeholder for image URL - in a real implementation, this would be replaced with the URL returned by the image generation API
    return "https://example.com/generated-tattoo.jpg";
    
    // Note: When Google's Generative AI SDK supports direct image generation with URLs,
    // the code would look something like this:
    //
    // const imageModel = genAI.getGenerativeModel({ model: "imagen-1.0" });
    // const imageResult = await imageModel.generateContent([enhancedPrompt]);
    // const imageUrl = imageResult.response.imageUrl();
    // return imageUrl;
  } catch (error) {
    console.error("Error generating tattoo design:", error);
    throw new Error("Failed to generate tattoo design");
  }
}

export default genAI; 