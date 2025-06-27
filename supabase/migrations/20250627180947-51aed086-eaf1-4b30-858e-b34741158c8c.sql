
-- Create analytics tracking tables

-- Table to track user activity and engagement
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'login', 'chat_interaction', 'search', 'trip_created', etc.
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store aggregated daily metrics
CREATE TABLE public.daily_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  chat_interactions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on new tables
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_analytics
CREATE POLICY "Admins can view all analytics"
  ON public.user_analytics
  FOR SELECT
  USING (
    public.has_role(
      (SELECT id FROM public.user_profiles WHERE auth0_user_id = current_setting('app.current_user_id', true)),
      'admin'::app_role
    )
  );

CREATE POLICY "Users can view their own analytics"
  ON public.user_analytics
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "System can insert analytics"
  ON public.user_analytics
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for daily_metrics
CREATE POLICY "Admins can view daily metrics"
  ON public.daily_metrics
  FOR ALL
  USING (
    public.has_role(
      (SELECT id FROM public.user_profiles WHERE auth0_user_id = current_setting('app.current_user_id', true)),
      'admin'::app_role
    )
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM public.user_profiles 
    WHERE auth0_user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    public.has_role(
      (SELECT id FROM public.user_profiles WHERE auth0_user_id = current_setting('app.current_user_id', true)),
      'admin'::app_role
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);
CREATE INDEX idx_user_analytics_created_at ON public.user_analytics(created_at);
CREATE INDEX idx_daily_metrics_date ON public.daily_metrics(date);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
