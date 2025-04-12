import 'dotenv/config';

export default {
  expo: {
    name: "ink-it",
    slug: "ink-it",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.inkit",
      usesAppleSignIn: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.inkit"
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to convert them into tattoos.",
          "cameraPermission": "The app accesses your camera to capture images for tattoo designs."
        }
      ],
      "expo-apple-authentication"
    ],
    extra: {
      // Environment variables - use process.env in development 
      // or build-time config in production
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    },
    scheme: "ink-it"
  }
}; 