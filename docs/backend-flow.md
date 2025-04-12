# Backend Flow: Authentication to Image Generation

This document outlines the complete backend process flow in the Ink-It app, from user authentication to tattoo design generation.

## 1. Authentication Process

1. **User signup/login**:
   - User enters credentials in the frontend
   - `hooks/useAuth.ts` calls Supabase auth methods from `services/auth.ts`
   - Supabase handles authentication and returns a session token

2. **Session management**:
   - Session token is stored securely using `expo-secure-store` (configured in `lib/supabase.ts`)
   - The token is automatically attached to subsequent API calls
   - `useAuth` hook maintains user state and provides auth methods to components

3. **Profile creation**:
   - When a new user signs up, the `handle_new_user()` database trigger automatically creates a profile record
   - User information is stored in the `profiles` table in Supabase

## 2. Image Capture/Selection Process

1. **Image acquisition**:
   - User takes a photo or selects an image from their gallery using frontend UI
   - This triggers either `takePhoto()` or `pickImage()` in `hooks/useImageUpload.ts`
   - These functions use `expo-image-picker` to access device camera/gallery

2. **Local image processing**:
   - The selected image is passed to `handleLocalImage()` function
   - This calls `processLocalImage()` from `services/imageProcessing.ts`
   - The image is saved to the device's local filesystem using `expo-file-system`
   - A unique ID (`uuid`) is generated for the image

3. **Database record creation**:
   - A record is created in the Supabase `images` table with:
     - `user_id`: The authenticated user's ID
     - `local_uri`: Reference to the local image file
     - `processed`: Set to `false` initially

## 3. Style Selection Process

1. **Edit page navigation**:
   - After image capture/selection, user is taken to an edit page
   - The selected image is displayed for preview

2. **Style selection**:
   - User can select from different tattoo styles (e.g., Traditional, Minimalist, Geometric, Watercolor)
   - Each style has different characteristics that influence the final design

3. **Style confirmation**:
   - User confirms the selected style
   - The style selection is stored alongside the image data for processing

## 4. Tattoo Generation Process

1. **AI processing initiation**:
   - After style confirmation, the app initiates the tattoo generation process
   - This triggers `processImage()` in `hooks/useImageUpload.ts`
   - This calls `processImageToTattoo()` from `services/imageProcessing.ts`
   - The selected style is passed as a parameter to influence the generation

2. **Image preparation for OpenAI**:
   - Local image is converted to base64 format
   - The base64 image is formatted for the OpenAI API

3. **ChatGPT analysis**:
   - The image is sent to OpenAI's GPT-4 Vision model
   - The AI analyzes the image and creates a text description of a tattoo design
   - The analysis uses a prompt that specifies tattoo design requirements and includes the selected style:
     ```
     "You are a tattoo artist. Convert the user's image into a tattoo design in the [SELECTED_STYLE] style. 
     Capture the essence of the original image but optimize it for a tattoo. Focus on clear lines, 
     appropriate contrast, and a design that will age well as a tattoo."
     ```

4. **DALL-E image generation**:
   - The text description is sent to DALL-E 3
   - DALL-E generates a tattoo design image based on the description
   - The prompt specifies design requirements including the selected style:
     ```
     "Create a tattoo design in the [SELECTED_STYLE] style based on this description: [GPT description]. 
     Make it with clear lines, high contrast, and suitable for a tattoo."
     ```

5. **Result processing**:
   - The generated tattoo image is downloaded from OpenAI
   - The image is saved locally on the device's filesystem
   - A new unique ID is generated for the tattoo image

6. **Database update**:
   - The Supabase `images` record is updated with:
     - `tattoo_local_uri`: Reference to the local tattoo file
     - `processed`: Set to `true`
     - `style`: The selected tattoo style

7. **Response to frontend**:
   - The local URI of the tattoo image is returned to the frontend
   - UI updates to display the generated tattoo design

## 5. Privacy & Storage Approach

- **Local-first storage**: All image data (original photos and generated tattoos) remains on the user's device
- **Database references**: Only references to file locations are stored in Supabase
- **User isolation**: Row-level security ensures users can only access their own data
- **Benefits**:
  - Enhanced privacy as sensitive images stay on the user's device
  - Reduced cloud storage costs
  - Faster access to images through local filesystem

## 6. Code Structure

- **Auth management**: `hooks/useAuth.ts` and `services/auth.ts`
- **Image processing**: `hooks/useImageUpload.ts` and `services/imageProcessing.ts`
- **Profile management**: `services/userProfile.ts`
- **API clients**: `lib/supabase.ts` and `lib/openai.ts`
- **Database schema**: `config/supabase.sql` 