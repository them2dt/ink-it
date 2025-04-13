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
Your task is to identify and describe the KEY ELEMENTS in the provided image with extreme precision.
Focus on shapes, objects, subjects, composition, and critical visual details.
Be extremely specific about what makes this image unique and recognizable.
Your description will be used to create a tattoo that MUST reflect these key elements faithfully.
Keep your response under 200 words and focus exclusively on visual elements.`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "What are the essential visual elements in this image that MUST be preserved in a tattoo design? Be extremely specific about the subjects, composition, and defining features." },
          { type: "image_url", image_url: { url: imageContent } }
        ]
      }
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  // Extract the description
  const imageDescription = imageAnalysis.choices[0]?.message?.content || "abstract design";
  
  // Generate a detailed prompt that emphasizes preserving the original image elements
  const baseStylePrompt = generateTattooPrompt(style);
  const enhancedPrompt = `
IMPORTANT: Create a tattoo design in the ${style} style that FAITHFULLY REPRODUCES these specific elements from the original image:

${imageDescription}

The design MUST be immediately recognizable as derived from the original image while applying the ${style} style aesthetics.

${baseStylePrompt}

CRITICAL: The subject matter and composition MUST closely match the original image - do NOT create a generic design.
`;
  
  // Generate the image using DALL-E 3
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: enhancedPrompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "vivid", // Use "vivid" for stronger adherence to the prompt
    response_format: "url",
    user: "ink-it-app",
  });
  
  // Return the URL of the generated image
  return response.data[0]?.url || '';
}

export default openai;