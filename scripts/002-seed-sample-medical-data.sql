-- Seed Sample Medical Data for QuantNex
-- This script populates the database with realistic sample data for testing

-- Insert sample hospitals
INSERT INTO hospitals (id, name, address, city, state, country, phone, email, bed_capacity) VALUES
(uuid_generate_v4(), 'Tata Memorial Hospital', 'Dr. E Borges Road, Parel', 'Mumbai', 'Maharashtra', 'India', '+91-22-2417-7000', 'info@tmc.gov.in', 629),
(uuid_generate_v4(), 'AIIMS Delhi', 'Ansari Nagar', 'New Delhi', 'Delhi', 'India', '+91-11-2658-8500', 'info@aiims.edu', 2478),
(uuid_generate_v4(), 'Apollo Hospital Chennai', 'No.21, Greams Lane', 'Chennai', 'Tamil Nadu', 'India', '+91-44-2829-3333', 'info@apollohospitals.com', 550),
(uuid_generate_v4(), 'Fortis Hospital Bangalore', 'No.14, Cunningham Road', 'Bangalore', 'Karnataka', 'India', '+91-80-6621-4444', 'info@fortishealthcare.com', 400);

-- Insert sample users (doctors and staff)
INSERT INTO users (id, email, first_name, last_name, role, specialization, license_number, department, phone) VALUES
(uuid_generate_v4(), 'dr.priya@quantnex.com', 'Priya', 'Patel', 'doctor', 'Neuro-Oncology', 'MH-DOC-2019-001', 'Oncology', '+91-98765-43210'),
(uuid_generate_v4(), 'dr.amit@quantnex.com', 'Amit', 'Gupta', 'doctor', 'Neurosurgery', 'DL-DOC-2018-002', 'Surgery', '+91-87654-32109'),
(uuid_generate_v4(), 'dr.sunita@quantnex.com', 'Sunita', 'Sharma', 'doctor', 'Radiology', 'MH-DOC-2020-003', 'Radiology', '+91-76543-21098'),
(uuid_generate_v4(), 'dr.rajesh@quantnex.com', 'Rajesh', 'Kumar', 'doctor', 'Medical Oncology', 'KA-DOC-2017-004', 'Oncology', '+91-65432-10987'),
(uuid_generate_v4(), 'admin@quantnex.com', 'Admin', 'User', 'administrator', 'Healthcare Administration', 'ADM-2021-001', 'Administration', '+91-54321-09876');

-- Insert sample patients
INSERT INTO patients (id, patient_id, first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, city, state, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, medical_history, current_medications, status, risk_level) VALUES
(uuid_generate_v4(), 'P-1001', 'Rajesh Kumar', 'Sharma', '1978-05-15', 'male', 'B+', '+91-98765-43210', 'rajesh.sharma@email.com', '123 MG Road, Andheri', 'Mumbai', 'Maharashtra', 'Priya Sharma', '+91-98765-43211', 'Wife', 'Hypertension, Diabetes Type 2', ARRAY['Metformin 500mg', 'Lisinopril 10mg'], 'active', 'high'),
(uuid_generate_v4(), 'P-1002', 'Priya', 'Patel', '1985-08-22', 'female', 'A+', '+91-87654-32109', 'priya.patel@email.com', '456 Park Street, Connaught Place', 'New Delhi', 'Delhi', 'Amit Patel', '+91-87654-32108', 'Husband', 'No significant medical history', ARRAY[], 'stable', 'low'),
(uuid_generate_v4(), 'P-1003', 'Amit', 'Singh', '1961-12-03', 'male', 'O+', '+91-76543-21098', 'amit.singh@email.com', '789 Brigade Road, Whitefield', 'Bangalore', 'Karnataka', 'Sunita Singh', '+91-76543-21097', 'Wife', 'Smoking history (quit 5 years ago)', ARRAY['Aspirin 75mg'], 'critical', 'high'),
(uuid_generate_v4(), 'P-1004', 'Sunita', 'Gupta', '1994-03-18', 'female', 'AB+', '+91-65432-10987', 'sunita.gupta@email.com', '321 Civil Lines, Malviya Nagar', 'Jaipur', 'Rajasthan', 'Ravi Gupta', '+91-65432-10986', 'Husband', 'Hormonal imbalance', ARRAY['Levothyroxine 50mcg'], 'recovered', 'low'),
(uuid_generate_v4(), 'P-1005', 'Mohammed', 'Ali', '1968-07-10', 'male', 'A-', '+91-54321-09876', 'mohammed.ali@email.com', '654 Charminar Road, Banjara Hills', 'Hyderabad', 'Telangana', 'Fatima Ali', '+91-54321-09875', 'Wife', 'Lung cancer (primary)', ARRAY['Morphine 10mg', 'Ondansetron 8mg'], 'active', 'high');

-- Insert sample diagnoses
INSERT INTO diagnoses (id, patient_id, condition_name, icd_10_code, description, severity, stage, status, confidence_score, diagnosed_date, notes) VALUES
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1001'), 'Glioblastoma Multiforme', 'C71.9', 'High-grade astrocytic tumor in the right frontal lobe', 'severe', 'IV', 'confirmed', 92.5, '2024-01-10', 'Large heterogeneous mass with significant edema and mass effect'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1002'), 'Meningioma', 'D32.0', 'Benign meningioma in the left parietal region', 'mild', 'I', 'confirmed', 88.3, '2024-01-05', 'Well-circumscribed lesion, no invasion detected'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1003'), 'Astrocytoma Grade II', 'C71.1', 'Low-grade astrocytoma in the left temporal lobe', 'moderate', 'II', 'confirmed', 85.7, '2024-01-15', 'Infiltrative tumor with minimal enhancement'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1004'), 'Pituitary Adenoma', 'D35.2', 'Non-functioning pituitary adenoma', 'mild', 'I', 'confirmed', 94.1, '2023-12-20', 'Microadenoma, no hormonal dysfunction'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1005'), 'Brain Metastases', 'C79.31', 'Multiple brain metastases from lung primary', 'severe', 'IV', 'confirmed', 96.8, '2024-01-08', 'Multiple lesions in bilateral hemispheres');

-- Insert sample treatment plans
INSERT INTO treatment_plans (id, patient_id, diagnosis_id, plan_name, treatment_type, description, start_date, end_date, status, progress_percentage, effectiveness_score, side_effects, notes) VALUES
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1001'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1001')), 'Concurrent Chemoradiation', 'combined', 'Radiation therapy with concurrent temozolomide followed by adjuvant chemotherapy', '2024-01-20', '2024-07-20', 'active', 35, 78.5, ARRAY['Fatigue', 'Nausea', 'Hair loss'], 'Patient tolerating treatment well'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1002'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1002')), 'Surgical Resection', 'surgery', 'Complete surgical resection of meningioma', '2024-01-25', '2024-01-25', 'completed', 100, 95.2, ARRAY['Post-operative headache'], 'Gross total resection achieved'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1003'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1003')), 'Radiation Therapy', 'radiation', 'Fractionated external beam radiation therapy', '2024-01-22', '2024-03-15', 'active', 60, 72.3, ARRAY['Fatigue', 'Skin irritation'], 'Good response to treatment'),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1005'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1005')), 'Stereotactic Radiosurgery', 'radiation', 'Gamma knife radiosurgery for multiple brain metastases', '2024-01-30', '2024-02-02', 'planned', 0, 0, ARRAY[], 'Treatment planning in progress');

-- Insert sample medications
INSERT INTO medications (id, patient_id, medication_name, generic_name, dosage, frequency, route, start_date, prescribing_doctor_id, instructions, side_effects, is_active) VALUES
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1001'), 'Temozolomide', 'Temozolomide', '150mg/m²', 'Daily x 5 days, q28 days', 'oral', '2024-01-20', (SELECT id FROM users WHERE email = 'dr.priya@quantnex.com'), 'Take on empty stomach', ARRAY['Nausea', 'Fatigue', 'Thrombocytopenia'], true),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1001'), 'Dexamethasone', 'Dexamethasone', '4mg', 'Twice daily', 'oral', '2024-01-15', (SELECT id FROM users WHERE email = 'dr.priya@quantnex.com'), 'Take with food', ARRAY['Insomnia', 'Increased appetite'], true),
(uuid_generate_v4(), (SELECT id FROM patients WHERE patient_id = 'P-1003'), 'Levetiracetam', 'Levetiracetam', '500mg', 'Twice daily', 'oral', '2024-01-16', (SELECT id FROM users WHERE email = 'dr.amit@quantnex.com'), 'Anti-seizure medication', ARRAY['Drowsiness', 'Dizziness'], true);

-- Insert sample vital signs
INSERT INTO vital_signs (patient_id, recorded_at, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, temperature, respiratory_rate, oxygen_saturation, consciousness_level) VALUES
((SELECT id FROM patients WHERE patient_id = 'P-1001'), CURRENT_TIMESTAMP - INTERVAL '1 hour', 72, 120, 80, 98.6, 16, 98, 'Alert'),
((SELECT id FROM patients WHERE patient_id = 'P-1001'), CURRENT_TIMESTAMP - INTERVAL '2 hours', 75, 125, 82, 98.4, 18, 97, 'Alert'),
((SELECT id FROM patients WHERE patient_id = 'P-1002'), CURRENT_TIMESTAMP - INTERVAL '30 minutes', 68, 110, 70, 98.2, 14, 99, 'Alert'),
((SELECT id FROM patients WHERE patient_id = 'P-1003'), CURRENT_TIMESTAMP - INTERVAL '45 minutes', 85, 140, 90, 99.1, 20, 95, 'Alert'),
((SELECT id FROM patients WHERE patient_id = 'P-1005'), CURRENT_TIMESTAMP - INTERVAL '15 minutes', 92, 135, 88, 99.8, 22, 94, 'Drowsy');

-- Insert sample medical alerts
INSERT INTO medical_alerts (patient_id, alert_type, title, message, severity, is_acknowledged) VALUES
((SELECT id FROM patients WHERE patient_id = 'P-1003'), 'warning', 'Elevated Blood Pressure', 'Patient blood pressure reading 140/90 - monitor closely', 3, false),
((SELECT id FROM patients WHERE patient_id = 'P-1005'), 'critical', 'Low Oxygen Saturation', 'Oxygen saturation dropped to 94% - immediate attention required', 5, false),
((SELECT id FROM patients WHERE patient_id = 'P-1001'), 'info', 'Medication Due', 'Next temozolomide dose due in 2 hours', 1, false);

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, duration_minutes, appointment_type, status, notes) VALUES
((SELECT id FROM patients WHERE patient_id = 'P-1001'), (SELECT id FROM users WHERE email = 'dr.priya@quantnex.com'), CURRENT_TIMESTAMP + INTERVAL '2 days', 45, 'Follow-up', 'scheduled', 'Treatment response evaluation'),
((SELECT id FROM patients WHERE patient_id = 'P-1002'), (SELECT id FROM users WHERE email = 'dr.amit@quantnex.com'), CURRENT_TIMESTAMP + INTERVAL '1 week', 30, 'Post-operative', 'scheduled', 'Surgical site check'),
((SELECT id FROM patients WHERE patient_id = 'P-1003'), (SELECT id FROM users WHERE email = 'dr.rajesh@quantnex.com'), CURRENT_TIMESTAMP + INTERVAL '3 days', 60, 'Treatment planning', 'scheduled', 'Radiation therapy planning');

-- Insert sample lab results
INSERT INTO lab_results (patient_id, test_name, test_code, result_value, reference_range, unit, status, test_date, result_date, notes) VALUES
((SELECT id FROM patients WHERE patient_id = 'P-1001'), 'Complete Blood Count', 'CBC', '4.2', '4.5-11.0', '10³/μL', 'low', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '12 hours', 'Mild leukopenia'),
((SELECT id FROM patients WHERE patient_id = 'P-1001'), 'Platelet Count', 'PLT', '180', '150-450', '10³/μL', 'normal', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '12 hours', 'Within normal limits'),
((SELECT id FROM patients WHERE patient_id = 'P-1003'), 'Liver Function Test', 'LFT', '25', '7-56', 'U/L', 'normal', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Normal liver function');

-- Insert sample prognosis data
INSERT INTO prognosis_data (patient_id, diagnosis_id, survival_probability_1_year, survival_probability_3_year, survival_probability_5_year, risk_factors, protective_factors, treatment_response_prediction, quality_of_life_prediction, ai_model_version, confidence_score) VALUES
((SELECT id FROM patients WHERE patient_id = 'P-1001'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1001')), 65.0, 25.0, 10.0, ARRAY['Age > 65', 'Large tumor size', 'High Ki-67'], ARRAY['Good performance status', 'Complete resection'], 78.5, 72.3, 'v2.1.0', 87.3),
((SELECT id FROM patients WHERE patient_id = 'P-1002'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1002')), 98.0, 95.0, 92.0, ARRAY['Female gender'], ARRAY['Young age', 'Benign histology', 'Complete resection'], 95.2, 94.8, 'v2.1.0', 94.1),
((SELECT id FROM patients WHERE patient_id = 'P-1003'), (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE patient_id = 'P-1003')), 85.0, 65.0, 45.0, ARRAY['Male gender', 'Smoking history'], ARRAY['Low grade', 'Young age at diagnosis'], 72.3, 78.9, 'v2.1.0', 85.7);
