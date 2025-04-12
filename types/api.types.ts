// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  username?: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
}

// Image processing types
export interface ImageUploadRequest {
  uri: string;
  type: string;
  name: string;
}

export interface ImageProcessRequest {
  imageUrl: string;
  userId: string;
  style?: string;
}

export interface ImageProcessResponse {
  success: boolean;
  tattooUrl?: string;
  error?: string;
}

// Profile related types
export interface UserProfile {
  id: string;
  email?: string;
  username?: string | null;
  avatarUrl?: string | null;
}

// Error response
export interface ErrorResponse {
  error: string;
  status: number;
  details?: any;
} 