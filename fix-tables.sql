-- Fix missing columns and add sample data
-- Run this in your Supabase SQL Editor

-- First, let's check if the treatment_status type exists and add missing columns
DO $$ 
BEGIN
    -- Add missing columns to patients table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'treatment_status') THEN
        ALTER TABLE patients ADD COLUMN treatment_status treatment_status DEFAULT 'ACTIVE';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'treatment_progress') THEN
        ALTER TABLE patients ADD COLUMN treatment_progress INTEGER DEFAULT 0 CHECK (treatment_progress >= 0 AND treatment_progress <= 100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'cancer_type') THEN
        ALTER TABLE patients ADD COLUMN cancer_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'cancer_stage') THEN
        ALTER TABLE patients ADD COLUMN cancer_stage cancer_stage;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'diagnosis_date') THEN
        ALTER TABLE patients ADD COLUMN diagnosis_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'last_visit') THEN
        ALTER TABLE patients ADD COLUMN last_visit TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'next_appointment') THEN
        ALTER TABLE patients ADD COLUMN next_appointment TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'medical_history') THEN
        ALTER TABLE patients ADD COLUMN medical_history TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'allergies') THEN
        ALTER TABLE patients ADD COLUMN allergies TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'current_medications') THEN
        ALTER TABLE patients ADD COLUMN current_medications TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'family_history') THEN
        ALTER TABLE patients ADD COLUMN family_history TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'insurance_provider') THEN
        ALTER TABLE patients ADD COLUMN insurance_provider TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'insurance_policy_number') THEN
        ALTER TABLE patients ADD COLUMN insurance_policy_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'assigned_doctor_id') THEN
        ALTER TABLE patients ADD COLUMN assigned_doctor_id UUID REFERENCES medical_professionals(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'emergency_contact_name') THEN
        ALTER TABLE patients ADD COLUMN emergency_contact_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'emergency_contact_phone') THEN
        ALTER TABLE patients ADD COLUMN emergency_contact_phone TEXT;
    END IF;
END $$;

-- Now add sample data
-- Insert sample medical professionals
INSERT INTO medical_professionals (id, role, specialization, license_number, department, permissions) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'DOCTOR', 'Oncology', 'MED-2024-001', 'Oncology Department', ARRAY['patient_read', 'patient_write', 'appointment_read', 'appointment_write', 'medical_record_read', 'medical_record_write']),
('550e8400-e29b-41d4-a716-446655440001', 'DOCTOR', 'Radiology', 'MED-2024-002', 'Radiology Department', ARRAY['patient_read', 'appointment_read', 'medical_record_read', 'medical_record_write']),
('550e8400-e29b-41d4-a716-446655440002', 'ADMIN', NULL, 'ADMIN-2024-001', 'Administration', ARRAY['admin_access', 'audit_read', 'user_management'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample patient
INSERT INTO patients (
    id, 
    first_name, 
    last_name, 
    email, 
    phone, 
    date_of_birth, 
    gender, 
    medical_record_number, 
    cancer_type, 
    cancer_stage, 
    treatment_status, 
    assigned_doctor_id,
    treatment_progress,
    diagnosis_date
) VALUES (
    '660e8400-e29b-41d4-a716-446655440000', 
    'Priya', 
    'Sharma', 
    'priya.sharma@email.com', 
    '+91-9876543210', 
    '1970-03-15', 
    'FEMALE', 
    'PT-2024-0156', 
    'Glioblastoma', 
    'IV', 
    'ACTIVE', 
    '550e8400-e29b-41d4-a716-446655440000',
    25,
    '2024-01-15'
) ON CONFLICT (id) DO NOTHING;

-- Insert a sample appointment
INSERT INTO appointments (
    id,
    patient_id,
    doctor_id,
    created_by,
    appointment_date,
    appointment_time,
    type,
    status,
    duration_minutes,
    location,
    notes
) VALUES (
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    '2024-07-10',
    '14:30',
    'CONSULTATION',
    'SCHEDULED',
    60,
    'Oncology Wing - Room 201',
    'Follow-up consultation for treatment progress review'
) ON CONFLICT (id) DO NOTHING;

-- Insert a sample medical record
INSERT INTO medical_records (
    id,
    patient_id,
    author_id,
    author_name,
    record_type,
    title,
    content,
    record_date,
    is_confidential,
    tags,
    related_appointment_id
) VALUES (
    '880e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'Dr. Rajesh Sharma',
    'PROGRESS_NOTE',
    'Treatment Progress Review',
    'Patient showing positive response to current treatment protocol. Tumor markers have decreased by 15% since last visit. Continue with current chemotherapy regimen.',
    '2024-07-04',
    true,
    ARRAY['chemotherapy', 'progress', 'tumor-markers'],
    '770e8400-e29b-41d4-a716-446655440000'
) ON CONFLICT (id) DO NOTHING;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_patients_treatment_status ON patients(treatment_status);
CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor ON patients(assigned_doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);

-- Update RLS policies to be more permissive for testing
DROP POLICY IF EXISTS "Doctors can view assigned patients" ON patients;
CREATE POLICY "Doctors can view assigned patients" ON patients FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM medical_professionals 
        WHERE medical_professionals.id = auth.uid() 
        AND medical_professionals.role IN ('DOCTOR', 'NURSE', 'ADMIN')
    )
    OR 
    patients.assigned_doctor_id = auth.uid()
);

-- Add insert/update policies for medical professionals
CREATE POLICY IF NOT EXISTS "Medical professionals can insert patients" ON patients FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM medical_professionals 
        WHERE medical_professionals.id = auth.uid() 
        AND medical_professionals.role IN ('DOCTOR', 'NURSE', 'ADMIN')
    )
);

CREATE POLICY IF NOT EXISTS "Medical professionals can update patients" ON patients FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM medical_professionals 
        WHERE medical_professionals.id = auth.uid() 
        AND medical_professionals.role IN ('DOCTOR', 'NURSE', 'ADMIN')
    )
);

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
