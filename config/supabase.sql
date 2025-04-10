-- Create tables

-- Profiles table to store user profile data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Images table to store user uploaded images and processed tattoos
CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  tattoo_path TEXT,
  processed BOOLEAN DEFAULT FALSE
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name) VALUES ('images', 'images') ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name) VALUES ('tattoos', 'tattoos') ON CONFLICT DO NOTHING;

-- Set up row level security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Images policies
CREATE POLICY "Users can view their own images"
  ON public.images
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
  ON public.images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
  ON public.images
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies

-- Images bucket
CREATE POLICY "Users can upload their own images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can access their own images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Tattoos bucket
CREATE POLICY "Users can access their own tattoos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'tattoos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can insert their own tattoos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'tattoos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own tattoos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'tattoos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own tattoos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'tattoos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Functions

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, updated_at)
  VALUES (new.id, new.raw_user_meta_data->>'username', NULL, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 