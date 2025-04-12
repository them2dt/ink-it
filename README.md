# Ink-It App

Convert your photos into tattoo designs using AI.

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up/login
2. Create a new project
3. Note your project URL and anon key (found in Project Settings > API)

### 2. Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `config/supabase.sql` file
3. Paste and run the SQL in the Supabase SQL editor

The SQL script will:
- Create the `profiles` and `images` tables
- Set up row-level security policies
- Create a trigger for new user registration

### 3. About Image Storage

This app stores images locally on the user's device instead of in cloud storage:
- Original photos are saved to the device's local filesystem
- Generated tattoo designs are also stored locally
- Supabase only stores references to these local files
- This approach reduces cloud storage costs and keeps image data on the device

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the `.env` file with your Supabase URL and anon key
3. Add your OpenAI API key for the AI image generation

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Setup Script

```bash
npm run setup:supabase
```

## Running the App

```bash
npm run dev
```

## Features

- **Authentication**: Email/password login and signup
- **Profile Management**: Change password, reset profile
- **Image Processing**: Convert photos to tattoo designs using AI
- **Subscription Plans**: Free and premium options
- **Local Storage**: Images stored on device for privacy and reduced cloud costs

## Project Structure

- `app/` - App screens and navigation
- `lib/` - Core libraries (Supabase, OpenAI)
- `services/` - Business logic services
- `hooks/` - React hooks
- `types/` - TypeScript type definitions
- `config/` - Configuration files
- `constants/` - App constants

## Screenshots

[Screenshots of the app will be added here]

## Tech Stack

- React Native with Expo
- TypeScript
- Expo Router for navigation
- React Native Animations
- Image processing APIs

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical devices)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ink-it.git
   cd ink-it
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with the Expo Go app on your physical device

## Usage

1. **Onboarding**: When you first open the app, you'll be guided through an onboarding sequence explaining the app's functionality.

2. **Permissions**: The app requires camera and photo library access to function properly.

3. **Taking/Selecting Photos**: Use the camera button to take a photo, or select an existing photo from your gallery.

4. **Style Selection**: Choose from various tattoo styles to apply to your image.

5. **Processing**: The app will process your image, applying the chosen style.

6. **Result View**: View your transformed image and choose to retry, take a new photo, save, or share.

## Development Roadmap

- [ ] User accounts and saved designs
- [ ] More tattoo styles
- [ ] Advanced customization options
- [ ] AR try-on feature

## License

[License information will go here]

## Credits

Developed by [Your Name/Team]

## Contact

[Contact information will go here] 