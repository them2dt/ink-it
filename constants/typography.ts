import { TextStyle } from 'react-native';
import { colors } from './colors';

// Font families
export const fontFamily = {
  regular: 'Satoshi-Regular',
  medium: 'Satoshi-Medium',
  light: 'Satoshi-Light',
  bold: 'Satoshi-Bold',
  black: 'Satoshi-Black',
};

// Font style options
export interface FontOptions {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
}

// Base text styles
const baseText: TextStyle = {
  fontFamily: fontFamily.regular,
  color: colors.black[100],
};

/**
 * Creates a text style with customized properties
 */
export const createTextStyle = (
  baseStyle: TextStyle,
  options?: FontOptions
): TextStyle => {
  return {
    ...baseStyle,
    ...(options?.color && { color: options.color }),
    ...(options?.fontFamily && { fontFamily: options.fontFamily }),
    ...(options?.fontSize && { fontSize: options.fontSize }),
  };
};

// Headings
export const heading1 = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.bold,
      fontSize: 32,
      lineHeight: 38,
    },
    options
  );

export const heading2 = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.bold,
      fontSize: 28,
      lineHeight: 34,
    },
    options
  );

export const heading3 = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.bold,
      fontSize: 24,
      lineHeight: 30,
    },
    options
  );

export const heading4 = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.medium,
      fontSize: 20,
      lineHeight: 26,
    },
    options
  );

// Body text
export const bodyLarge = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontSize: 18,
      lineHeight: 24,
    },
    options
  );

export const bodyMedium = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontSize: 16,
      lineHeight: 22,
    },
    options
  );

export const bodySmall = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontSize: 14,
      lineHeight: 20,
    },
    options
  );

// Button text
export const buttonLarge = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.medium,
      fontSize: 18,
      lineHeight: 24,
    },
    options
  );

export const buttonMedium = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.medium,
      fontSize: 16,
      lineHeight: 22,
    },
    options
  );

export const buttonSmall = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.medium,
      fontSize: 14,
      lineHeight: 20,
    },
    options
  );

// Caption and labels
export const caption = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontSize: 12,
      lineHeight: 16,
    },
    options
  );

export const label = (options?: FontOptions): TextStyle => 
  createTextStyle(
    {
      ...baseText,
      fontFamily: fontFamily.medium,
      fontSize: 12,
      lineHeight: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    options
  );

// Export everything for convenience
export const typography = {
  heading1,
  heading2,
  heading3,
  heading4,
  bodyLarge,
  bodyMedium,
  bodySmall,
  buttonLarge,
  buttonMedium,
  buttonSmall,
  caption,
  label,
  createTextStyle,
  fontFamily,
}; 