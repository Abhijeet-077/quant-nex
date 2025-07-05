-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'nurse', 'admin', 'researcher')),
  specialization TEXT,
  license_number TEXT,
  department TEXT,
  permissions TEXT[] DEFAULT ARRAY['read_patients', 'read_reports'],
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_department_idx ON profiles(department);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Allow service role to insert profiles (for registration)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    specialization,
    license_number,
    department
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'doctor'),
    COALESCE(NEW.raw_user_meta_data->>'specialization', ''),
    COALESCE(NEW.raw_user_meta_data->>'license_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample users for testing
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  specialization,
  license_number,
  department,
  permissions,
  is_active
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'dr.sharma@quantnex.com',
  'Rajesh',
  'Sharma',
  'doctor',
  'Oncology',
  'MCI-12345',
  'Oncology',
  ARRAY['read_patients', 'write_patients', 'read_reports', 'write_reports'],
  true
),
(
  '00000000-0000-0000-0000-000000000002',
  'dr.patel@quantnex.com',
  'Priya',
  'Patel',
  'doctor',
  'Radiology',
  'MCI-67890',
  'Radiology',
  ARRAY['read_patients', 'read_reports', 'write_reports'],
  true
),
(
  '00000000-0000-0000-0000-000000000003',
  'admin@quantnex.com',
  'Admin',
  'User',
  'admin',
  'Administration',
  'ADM-00001',
  'Administration',
  ARRAY['read_patients', 'write_patients', 'read_reports', 'write_reports', 'admin_access'],
  true
)
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
