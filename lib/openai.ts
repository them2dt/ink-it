import OpenAI from 'openai';
import Constants from 'expo-constants';

// Initialize OpenAI client with API key
const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey || '';

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export default openai; 