
-- Create user_profiles table to store Auth0 user information
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth0_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table with user segregation
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  dates TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',
  image_url TEXT,
  hotel TEXT,
  travelers INTEGER DEFAULT 1,
  estimated_cost INTEGER,
  total_cost INTEGER,
  activities TEXT[],
  coordinates JSONB,
  added_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table with user segregation
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  destination TEXT NOT NULL,
  dates TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  image_url TEXT,
  hotel TEXT,
  travelers INTEGER DEFAULT 1,
  total_cost INTEGER NOT NULL,
  activities TEXT[],
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth0_user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth0_user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth0_user_id = current_setting('app.current_user_id', true));

-- RLS Policies for trips
CREATE POLICY "Users can view their own trips" 
  ON public.trips 
  FOR SELECT 
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can insert their own trips" 
  ON public.trips 
  FOR INSERT 
  WITH CHECK (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can update their own trips" 
  ON public.trips 
  FOR UPDATE 
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can delete their own trips" 
  ON public.trips 
  FOR DELETE 
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can insert their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can delete their own bookings" 
  ON public.bookings 
  FOR DELETE 
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_auth0_user_id ON public.user_profiles(auth0_user_id);
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_trip_id ON public.bookings(trip_id);
