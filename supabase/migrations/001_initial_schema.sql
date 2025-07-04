-- Quant-NEX Medical Application Database Schema
-- HIPAA-compliant medical data structure
-- Created: 2025-07-04

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table for Supabase Auth integration
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('DOCTOR', 'NURSE', 'ADMIN', 'RESEARCHER', 'TECHNICIAN');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE cancer_stage AS ENUM ('I', 'II', 'III', 'IV');
CREATE TYPE treatment_status AS ENUM ('ACTIVE', 'REMISSION', 'CRITICAL', 'DECEASED', 'INACTIVE');
CREATE TYPE appointment_type AS ENUM ('CONSULTATION', 'FOLLOW_UP', 'TREATMENT', 'TELEMEDICINE', 'EMERGENCY');
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE record_type AS ENUM ('LAB_RESULT', 'IMAGING', 'PATHOLOGY', 'TREATMENT_NOTE', 'PROGRESS_NOTE', 'DISCHARGE_SUMMARY');
CREATE TYPE audit_outcome AS ENUM ('SUCCESS', 'FAILURE', 'UNAUTHORIZED');
CREATE TYPE data_classification AS ENUM ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED');

-- Medical professionals table (extends profiles)
CREATE TABLE medical_professionals (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Professional Information
    role user_role NOT NULL,
    specialization TEXT,
    license_number TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    permissions TEXT[] DEFAULT '{}',

    -- Contact Information
    phone TEXT,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    address TEXT,
    
    -- Emergency Contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- Medical Information
    medical_record_number TEXT UNIQUE NOT NULL,
    cancer_type TEXT,
    cancer_stage cancer_stage,
    diagnosis_date DATE,
    treatment_status treatment_status DEFAULT 'ACTIVE',
    treatment_progress INTEGER DEFAULT 0 CHECK (treatment_progress >= 0 AND treatment_progress <= 100),
    
    -- Visit Information
    last_visit TIMESTAMP WITH TIME ZONE,
    next_appointment TIMESTAMP WITH TIME ZONE,
    
    -- Medical History
    medical_history TEXT,
    allergies TEXT[] DEFAULT '{}',
    current_medications TEXT[] DEFAULT '{}',
    family_history TEXT,
    
    -- Insurance Information
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    
    -- Relationships
    assigned_doctor_id UUID REFERENCES medical_professionals(id)
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Appointment Details
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL, -- Store as time string (e.g., "14:30")
    duration_minutes INTEGER DEFAULT 30,
    type appointment_type NOT NULL,
    status appointment_status DEFAULT 'SCHEDULED',
    
    -- Location
    location TEXT,
    room_number TEXT,
    
    -- Notes and Instructions
    notes TEXT,
    preparation_instructions TEXT,
    
    -- Reminder System
    reminder_sent BOOLEAN DEFAULT FALSE,
    
    -- Relationships
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES medical_professionals(id),
    created_by UUID NOT NULL REFERENCES medical_professionals(id)
);

-- Medical Records table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Record Information
    record_type record_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    record_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- File Attachments
    attachments TEXT[] DEFAULT '{}', -- URLs to stored files
    
    -- Security and Classification
    is_confidential BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}', -- For categorization and search
    
    -- Relationships
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES medical_professionals(id),
    author_name TEXT NOT NULL, -- Denormalized for audit trail
    related_appointment_id UUID REFERENCES appointments(id)
);

-- Audit Logs table (HIPAA Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User Information
    user_id UUID NOT NULL REFERENCES medical_professionals(id),
    user_email TEXT NOT NULL,
    
    -- Action Information
    action TEXT NOT NULL, -- What action was performed
    resource_type TEXT NOT NULL, -- What type of resource
    resource_id TEXT NOT NULL, -- ID of the resource
    
    -- Patient Information (if applicable)
    patient_id UUID REFERENCES patients(id),
    
    -- Session Information
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    session_id TEXT NOT NULL,
    
    -- Outcome and Details
    outcome audit_outcome NOT NULL,
    details JSONB, -- Additional details about the action
    
    -- HIPAA Compliance
    phi_accessed BOOLEAN DEFAULT FALSE, -- Protected Health Information
    data_classification data_classification NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_medical_professionals_license_number ON medical_professionals(license_number);
CREATE INDEX idx_medical_professionals_role ON medical_professionals(role);
CREATE INDEX idx_medical_professionals_is_active ON medical_professionals(is_active);
CREATE INDEX idx_medical_professionals_department ON medical_professionals(department);

CREATE INDEX idx_patients_medical_record_number ON patients(medical_record_number);
CREATE INDEX idx_patients_assigned_doctor ON patients(assigned_doctor_id);
CREATE INDEX idx_patients_treatment_status ON patients(treatment_status);
CREATE INDEX idx_patients_cancer_type ON patients(cancer_type);
CREATE INDEX idx_patients_cancer_stage ON patients(cancer_stage);
CREATE INDEX idx_patients_name ON patients(first_name, last_name);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_type ON appointments(type);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_author ON medical_records(author_id);
CREATE INDEX idx_medical_records_type ON medical_records(record_type);
CREATE INDEX idx_medical_records_date ON medical_records(record_date);
CREATE INDEX idx_medical_records_confidential ON medical_records(is_confidential);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_patient ON audit_logs(patient_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_phi_accessed ON audit_logs(phi_accessed);
CREATE INDEX idx_audit_logs_data_classification ON audit_logs(data_classification);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_medical_professionals_updated_at BEFORE UPDATE ON medical_professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) for HIPAA compliance
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic - to be refined based on specific requirements)

-- Profiles table policies (Supabase Auth integration)
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING ((auth.uid() = id));

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING ((auth.uid() = id));

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK ((auth.uid() = id));

-- Medical professionals table policies
CREATE POLICY "Medical professionals can view own profile" ON medical_professionals FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Medical professionals can update own profile" ON medical_professionals FOR UPDATE USING (auth.uid() = id);

-- Patients can be viewed by assigned doctors and authorized staff
CREATE POLICY "Doctors can view assigned patients" ON patients FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM medical_professionals
        WHERE medical_professionals.id = auth.uid()
        AND (medical_professionals.role IN ('DOCTOR', 'NURSE', 'ADMIN') OR patients.assigned_doctor_id = auth.uid())
    )
);

-- Medical records access based on patient access
CREATE POLICY "Authorized staff can view medical records" ON medical_records FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM medical_professionals
        WHERE medical_professionals.id = auth.uid()
        AND medical_professionals.role IN ('DOCTOR', 'NURSE', 'ADMIN')
    )
);

-- Audit logs are read-only for authorized personnel
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM medical_professionals
        WHERE medical_professionals.id = auth.uid()
        AND medical_professionals.role = 'ADMIN'
    )
);

-- Insert sample data for development
-- Note: You'll need to create these users in Supabase Auth first, then add their professional data
INSERT INTO medical_professionals (id, role, specialization, license_number, department, permissions) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'DOCTOR', 'Oncology', 'MED-2024-001', 'Oncology Department', ARRAY['patient_read', 'patient_write', 'appointment_read', 'appointment_write', 'medical_record_read', 'medical_record_write']),
('550e8400-e29b-41d4-a716-446655440001', 'DOCTOR', 'Radiology', 'MED-2024-002', 'Radiology Department', ARRAY['patient_read', 'appointment_read', 'medical_record_read', 'medical_record_write']),
('550e8400-e29b-41d4-a716-446655440002', 'ADMIN', NULL, 'ADMIN-2024-001', 'Administration', ARRAY['admin_access', 'audit_read', 'user_management']);

-- Insert sample patient
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, medical_record_number, cancer_type, cancer_stage, treatment_status, assigned_doctor_id) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Priya', 'Sharma', 'priya.sharma@email.com', '+91-9876543210', '1970-03-15', 'FEMALE', 'PT-2024-0156', 'Glioblastoma', 'IV', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440000');

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a trigger to update profiles updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth users';
COMMENT ON TABLE medical_professionals IS 'Medical professionals and staff members with role-based permissions';
COMMENT ON TABLE patients IS 'Patient medical records and information';
COMMENT ON TABLE appointments IS 'Medical appointments and scheduling';
COMMENT ON TABLE medical_records IS 'Patient medical records and documentation';
COMMENT ON TABLE audit_logs IS 'HIPAA-compliant audit trail for all system actions';
