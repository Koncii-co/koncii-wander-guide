
-- Assign admin role to alexcastellanos29@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.user_profiles
WHERE email = 'alexcastellanos29@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
