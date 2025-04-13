import Constants from 'expo-constants';
import OpenAI from 'openai';

// Initialize OpenAI client with API key
const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

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
 * Process an image to generate a tattoo design using OpenAI
 * @param imageContent Base64 or URL of the input image
 * @param style Tattoo style to apply
 * @returns URL of the generated tattoo image
 */
export async function processImageToTattoo(
  imageContent: string,
  style: string
): Promise<string> {
  // First, analyze the image with GPT-4o to get a description
  const imageAnalysis = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a tattoo artist specializing in ${style} style. 
Analyze the provided image and describe its key elements very concisely. 
Focus only on the main visual elements that should be incorporated into a tattoo.
Keep your response under 300 words and very specific to visual content only.`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "What are the key visual elements in this image that would be important for a tattoo design?" },
          { type: "image_url", image_url: { url: imageContent } }
        ]
      }
    ],
    max_tokens: 150,
  });

  // Extract the description
  const imageDescription = imageAnalysis.choices[0]?.message?.content || "abstract design";
  
  // Generate the prompt based on style and image description
  const prompt = `Based on this description: "${imageDescription}", ${generateTattooPrompt(style)}`;
  
  // Generate the image using DALL-E 3
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    response_format: "url",
    user: "ink-it-app",
  });
  
  // Return the URL of the generated image
  return response.data[0]?.url || '';
}

export default openai;