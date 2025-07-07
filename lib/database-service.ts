import { neon } from "@neondatabase/serverless"

// Initialize Neon database connection
const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

// Types for database entities
export interface Patient {
  id: string
  patient_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: "male" | "female" | "other" | "prefer_not_to_say"
  blood_type?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relation?: string
  status: "active" | "stable" | "critical" | "recovered" | "deceased" | "inactive"
  risk_level: string
  medical_history?: string
  current_medications?: string[]
  created_at: string
  updated_at: string
}

export interface Diagnosis {
  id: string
  patient_id: string
  condition_name: string
  icd_10_code?: string
  description?: string
  severity?: string
  stage?: string
  status: "preliminary" | "confirmed" | "ruled_out" | "under_review"
  confidence_score?: number
  diagnosed_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface TreatmentPlan {
  id: string
  patient_id: string
  diagnosis_id?: string
  plan_name: string
  treatment_type?: string
  description?: string
  start_date?: string
  end_date?: string
  status: "planned" | "active" | "completed" | "paused" | "cancelled"
  progress_percentage: number
  effectiveness_score?: number
  side_effects?: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface VitalSigns {
  id: string
  patient_id: string
  recorded_at: string
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  temperature?: number
  respiratory_rate?: number
  oxygen_saturation?: number
  consciousness_level?: string
  created_at: string
}

export interface MedicalAlert {
  id: string
  patient_id: string
  alert_type: "critical" | "warning" | "info" | "resolved"
  title: string
  message: string
  severity: number
  is_acknowledged: boolean
  acknowledged_by_id?: string
  acknowledged_at?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  duration_minutes: number
  appointment_type?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  patient_id: string
  medication_name: string
  generic_name?: string
  dosage?: string
  frequency?: string
  route?: string
  start_date?: string
  end_date?: string
  instructions?: string
  side_effects?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LabResult {
  id: string
  patient_id: string
  test_name: string
  test_code?: string
  result_value?: string
  reference_range?: string
  unit?: string
  status: string
  test_date?: string
  result_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface PrognosisData {
  id: string
  patient_id: string
  diagnosis_id?: string
  survival_probability_1_year?: number
  survival_probability_3_year?: number
  survival_probability_5_year?: number
  risk_factors?: string[]
  protective_factors?: string[]
  treatment_response_prediction?: number
  quality_of_life_prediction?: number
  ai_model_version?: string
  confidence_score?: number
  created_at: string
}

// Database service class
export class DatabaseService {
  // Patient operations
  async getAllPatients(): Promise<Patient[]> {
    try {
      const result = await sql`
        SELECT * FROM patients 
        ORDER BY created_at DESC
      `
      return result as Patient[]
    } catch (error) {
      console.error("Error fetching patients:", error)
      throw new Error("Failed to fetch patients")
    }
  }

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const result = await sql`
        SELECT * FROM patients 
        WHERE id = ${id}
      `
      return (result[0] as Patient) || null
    } catch (error) {
      console.error("Error fetching patient:", error)
      throw new Error("Failed to fetch patient")
    }
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | null> {
    try {
      const result = await sql`
        SELECT * FROM patients 
        WHERE patient_id = ${patientId}
      `
      return (result[0] as Patient) || null
    } catch (error) {
      console.error("Error fetching patient by patient_id:", error)
      throw new Error("Failed to fetch patient")
    }
  }

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    try {
      const result = await sql`
        INSERT INTO patients (
          patient_id, first_name, last_name, date_of_birth, gender, 
          blood_type, phone, email, address, city, state, country,
          emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
          status, risk_level, medical_history, current_medications
        ) VALUES (
          ${patientData.patient_id}, ${patientData.first_name}, ${patientData.last_name},
          ${patientData.date_of_birth}, ${patientData.gender}, ${patientData.blood_type},
          ${patientData.phone}, ${patientData.email}, ${patientData.address},
          ${patientData.city}, ${patientData.state}, ${patientData.country || "India"},
          ${patientData.emergency_contact_name}, ${patientData.emergency_contact_phone},
          ${patientData.emergency_contact_relation}, ${patientData.status || "active"},
          ${patientData.risk_level || "low"}, ${patientData.medical_history},
          ${patientData.current_medications || []}
        )
        RETURNING *
      `
      return result[0] as Patient
    } catch (error) {
      console.error("Error creating patient:", error)
      throw new Error("Failed to create patient")
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    try {
      const result = await sql`
        UPDATE patients SET
          first_name = COALESCE(${patientData.first_name}, first_name),
          last_name = COALESCE(${patientData.last_name}, last_name),
          phone = COALESCE(${patientData.phone}, phone),
          email = COALESCE(${patientData.email}, email),
          address = COALESCE(${patientData.address}, address),
          status = COALESCE(${patientData.status}, status),
          risk_level = COALESCE(${patientData.risk_level}, risk_level),
          medical_history = COALESCE(${patientData.medical_history}, medical_history),
          current_medications = COALESCE(${patientData.current_medications}, current_medications),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] as Patient
    } catch (error) {
      console.error("Error updating patient:", error)
      throw new Error("Failed to update patient")
    }
  }

  // Diagnosis operations
  async getDiagnosesByPatientId(patientId: string): Promise<Diagnosis[]> {
    try {
      const result = await sql`
        SELECT * FROM diagnoses 
        WHERE patient_id = ${patientId}
        ORDER BY diagnosed_date DESC
      `
      return result as Diagnosis[]
    } catch (error) {
      console.error("Error fetching diagnoses:", error)
      throw new Error("Failed to fetch diagnoses")
    }
  }

  async createDiagnosis(diagnosisData: Partial<Diagnosis>): Promise<Diagnosis> {
    try {
      const result = await sql`
        INSERT INTO diagnoses (
          patient_id, condition_name, icd_10_code, description, severity,
          stage, status, confidence_score, diagnosed_date, notes
        ) VALUES (
          ${diagnosisData.patient_id}, ${diagnosisData.condition_name},
          ${diagnosisData.icd_10_code}, ${diagnosisData.description},
          ${diagnosisData.severity}, ${diagnosisData.stage},
          ${diagnosisData.status || "preliminary"}, ${diagnosisData.confidence_score},
          ${diagnosisData.diagnosed_date}, ${diagnosisData.notes}
        )
        RETURNING *
      `
      return result[0] as Diagnosis
    } catch (error) {
      console.error("Error creating diagnosis:", error)
      throw new Error("Failed to create diagnosis")
    }
  }

  // Treatment plan operations
  async getTreatmentPlansByPatientId(patientId: string): Promise<TreatmentPlan[]> {
    try {
      const result = await sql`
        SELECT * FROM treatment_plans 
        WHERE patient_id = ${patientId}
        ORDER BY start_date DESC
      `
      return result as TreatmentPlan[]
    } catch (error) {
      console.error("Error fetching treatment plans:", error)
      throw new Error("Failed to fetch treatment plans")
    }
  }

  async createTreatmentPlan(treatmentData: Partial<TreatmentPlan>): Promise<TreatmentPlan> {
    try {
      const result = await sql`
        INSERT INTO treatment_plans (
          patient_id, diagnosis_id, plan_name, treatment_type, description,
          start_date, end_date, status, progress_percentage, effectiveness_score,
          side_effects, notes
        ) VALUES (
          ${treatmentData.patient_id}, ${treatmentData.diagnosis_id},
          ${treatmentData.plan_name}, ${treatmentData.treatment_type},
          ${treatmentData.description}, ${treatmentData.start_date},
          ${treatmentData.end_date}, ${treatmentData.status || "planned"},
          ${treatmentData.progress_percentage || 0}, ${treatmentData.effectiveness_score},
          ${treatmentData.side_effects || []}, ${treatmentData.notes}
        )
        RETURNING *
      `
      return result[0] as TreatmentPlan
    } catch (error) {
      console.error("Error creating treatment plan:", error)
      throw new Error("Failed to create treatment plan")
    }
  }

  async updateTreatmentPlan(id: string, treatmentData: Partial<TreatmentPlan>): Promise<TreatmentPlan> {
    try {
      const result = await sql`
        UPDATE treatment_plans SET
          status = COALESCE(${treatmentData.status}, status),
          progress_percentage = COALESCE(${treatmentData.progress_percentage}, progress_percentage),
          effectiveness_score = COALESCE(${treatmentData.effectiveness_score}, effectiveness_score),
          side_effects = COALESCE(${treatmentData.side_effects}, side_effects),
          notes = COALESCE(${treatmentData.notes}, notes),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] as TreatmentPlan
    } catch (error) {
      console.error("Error updating treatment plan:", error)
      throw new Error("Failed to update treatment plan")
    }
  }

  // Vital signs operations
  async getVitalSignsByPatientId(patientId: string, limit = 50): Promise<VitalSigns[]> {
    try {
      const result = await sql`
        SELECT * FROM vital_signs 
        WHERE patient_id = ${patientId}
        ORDER BY recorded_at DESC
        LIMIT ${limit}
      `
      return result as VitalSigns[]
    } catch (error) {
      console.error("Error fetching vital signs:", error)
      throw new Error("Failed to fetch vital signs")
    }
  }

  async createVitalSigns(vitalData: Partial<VitalSigns>): Promise<VitalSigns> {
    try {
      const result = await sql`
        INSERT INTO vital_signs (
          patient_id, heart_rate, blood_pressure_systolic, blood_pressure_diastolic,
          temperature, respiratory_rate, oxygen_saturation, consciousness_level
        ) VALUES (
          ${vitalData.patient_id}, ${vitalData.heart_rate}, ${vitalData.blood_pressure_systolic},
          ${vitalData.blood_pressure_diastolic}, ${vitalData.temperature},
          ${vitalData.respiratory_rate}, ${vitalData.oxygen_saturation},
          ${vitalData.consciousness_level}
        )
        RETURNING *
      `
      return result[0] as VitalSigns
    } catch (error) {
      console.error("Error creating vital signs:", error)
      throw new Error("Failed to create vital signs")
    }
  }

  // Medical alerts operations
  async getAlertsByPatientId(patientId: string): Promise<MedicalAlert[]> {
    try {
      const result = await sql`
        SELECT * FROM medical_alerts 
        WHERE patient_id = ${patientId}
        ORDER BY created_at DESC
      `
      return result as MedicalAlert[]
    } catch (error) {
      console.error("Error fetching alerts:", error)
      throw new Error("Failed to fetch alerts")
    }
  }

  async getAllActiveAlerts(): Promise<MedicalAlert[]> {
    try {
      const result = await sql`
        SELECT ma.*, p.first_name, p.last_name, p.patient_id
        FROM medical_alerts ma
        JOIN patients p ON ma.patient_id = p.id
        WHERE ma.is_acknowledged = false
        ORDER BY ma.severity DESC, ma.created_at DESC
      `
      return result as (MedicalAlert & { first_name: string; last_name: string; patient_id: string })[]
    } catch (error) {
      console.error("Error fetching active alerts:", error)
      throw new Error("Failed to fetch active alerts")
    }
  }

  async createAlert(alertData: Partial<MedicalAlert>): Promise<MedicalAlert> {
    try {
      const result = await sql`
        INSERT INTO medical_alerts (
          patient_id, alert_type, title, message, severity, is_acknowledged
        ) VALUES (
          ${alertData.patient_id}, ${alertData.alert_type}, ${alertData.title},
          ${alertData.message}, ${alertData.severity || 1}, ${alertData.is_acknowledged || false}
        )
        RETURNING *
      `
      return result[0] as MedicalAlert
    } catch (error) {
      console.error("Error creating alert:", error)
      throw new Error("Failed to create alert")
    }
  }

  async acknowledgeAlert(id: string, acknowledgedById?: string): Promise<MedicalAlert> {
    try {
      const result = await sql`
        UPDATE medical_alerts SET
          is_acknowledged = true,
          acknowledged_by_id = ${acknowledgedById},
          acknowledged_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] as MedicalAlert
    } catch (error) {
      console.error("Error acknowledging alert:", error)
      throw new Error("Failed to acknowledge alert")
    }
  }

  // Appointments operations
  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    try {
      const result = await sql`
        SELECT a.*, u.first_name as doctor_first_name, u.last_name as doctor_last_name
        FROM appointments a
        JOIN users u ON a.doctor_id = u.id
        WHERE a.patient_id = ${patientId}
        ORDER BY a.appointment_date ASC
      `
      return result as (Appointment & { doctor_first_name: string; doctor_last_name: string })[]
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw new Error("Failed to fetch appointments")
    }
  }

  async getUpcomingAppointments(limit = 10): Promise<Appointment[]> {
    try {
      const result = await sql`
        SELECT a.*, 
               p.first_name as patient_first_name, p.last_name as patient_last_name, p.patient_id,
               u.first_name as doctor_first_name, u.last_name as doctor_last_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON a.doctor_id = u.id
        WHERE a.appointment_date >= CURRENT_TIMESTAMP
        ORDER BY a.appointment_date ASC
        LIMIT ${limit}
      `
      return result as (Appointment & {
        patient_first_name: string
        patient_last_name: string
        patient_id: string
        doctor_first_name: string
        doctor_last_name: string
      })[]
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error)
      throw new Error("Failed to fetch upcoming appointments")
    }
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const result = await sql`
        INSERT INTO appointments (
          patient_id, doctor_id, appointment_date, duration_minutes,
          appointment_type, status, notes
        ) VALUES (
          ${appointmentData.patient_id}, ${appointmentData.doctor_id},
          ${appointmentData.appointment_date}, ${appointmentData.duration_minutes || 30},
          ${appointmentData.appointment_type}, ${appointmentData.status || "scheduled"},
          ${appointmentData.notes}
        )
        RETURNING *
      `
      return result[0] as Appointment
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw new Error("Failed to create appointment")
    }
  }

  // Medications operations
  async getMedicationsByPatientId(patientId: string): Promise<Medication[]> {
    try {
      const result = await sql`
        SELECT * FROM medications 
        WHERE patient_id = ${patientId} AND is_active = true
        ORDER BY start_date DESC
      `
      return result as Medication[]
    } catch (error) {
      console.error("Error fetching medications:", error)
      throw new Error("Failed to fetch medications")
    }
  }

  async createMedication(medicationData: Partial<Medication>): Promise<Medication> {
    try {
      const result = await sql`
        INSERT INTO medications (
          patient_id, medication_name, generic_name, dosage, frequency,
          route, start_date, end_date, instructions, side_effects, is_active
        ) VALUES (
          ${medicationData.patient_id}, ${medicationData.medication_name},
          ${medicationData.generic_name}, ${medicationData.dosage},
          ${medicationData.frequency}, ${medicationData.route},
          ${medicationData.start_date}, ${medicationData.end_date},
          ${medicationData.instructions}, ${medicationData.side_effects || []},
          ${medicationData.is_active !== false}
        )
        RETURNING *
      `
      return result[0] as Medication
    } catch (error) {
      console.error("Error creating medication:", error)
      throw new Error("Failed to create medication")
    }
  }

  // Lab results operations
  async getLabResultsByPatientId(patientId: string): Promise<LabResult[]> {
    try {
      const result = await sql`
        SELECT * FROM lab_results 
        WHERE patient_id = ${patientId}
        ORDER BY test_date DESC
      `
      return result as LabResult[]
    } catch (error) {
      console.error("Error fetching lab results:", error)
      throw new Error("Failed to fetch lab results")
    }
  }

  async createLabResult(labData: Partial<LabResult>): Promise<LabResult> {
    try {
      const result = await sql`
        INSERT INTO lab_results (
          patient_id, test_name, test_code, result_value, reference_range,
          unit, status, test_date, result_date, notes
        ) VALUES (
          ${labData.patient_id}, ${labData.test_name}, ${labData.test_code},
          ${labData.result_value}, ${labData.reference_range}, ${labData.unit},
          ${labData.status || "normal"}, ${labData.test_date}, ${labData.result_date},
          ${labData.notes}
        )
        RETURNING *
      `
      return result[0] as LabResult
    } catch (error) {
      console.error("Error creating lab result:", error)
      throw new Error("Failed to create lab result")
    }
  }

  // Prognosis operations
  async getPrognosisByPatientId(patientId: string): Promise<PrognosisData | null> {
    try {
      const result = await sql`
        SELECT * FROM prognosis_data 
        WHERE patient_id = ${patientId}
        ORDER BY created_at DESC
        LIMIT 1
      `
      return (result[0] as PrognosisData) || null
    } catch (error) {
      console.error("Error fetching prognosis:", error)
      throw new Error("Failed to fetch prognosis")
    }
  }

  async createOrUpdatePrognosis(prognosisData: Partial<PrognosisData>): Promise<PrognosisData> {
    try {
      const result = await sql`
        INSERT INTO prognosis_data (
          patient_id, diagnosis_id, survival_probability_1_year,
          survival_probability_3_year, survival_probability_5_year,
          risk_factors, protective_factors, treatment_response_prediction,
          quality_of_life_prediction, ai_model_version, confidence_score
        ) VALUES (
          ${prognosisData.patient_id}, ${prognosisData.diagnosis_id},
          ${prognosisData.survival_probability_1_year}, ${prognosisData.survival_probability_3_year},
          ${prognosisData.survival_probability_5_year}, ${prognosisData.risk_factors || []},
          ${prognosisData.protective_factors || []}, ${prognosisData.treatment_response_prediction},
          ${prognosisData.quality_of_life_prediction}, ${prognosisData.ai_model_version},
          ${prognosisData.confidence_score}
        )
        ON CONFLICT (patient_id) DO UPDATE SET
          survival_probability_1_year = EXCLUDED.survival_probability_1_year,
          survival_probability_3_year = EXCLUDED.survival_probability_3_year,
          survival_probability_5_year = EXCLUDED.survival_probability_5_year,
          risk_factors = EXCLUDED.risk_factors,
          protective_factors = EXCLUDED.protective_factors,
          treatment_response_prediction = EXCLUDED.treatment_response_prediction,
          quality_of_life_prediction = EXCLUDED.quality_of_life_prediction,
          ai_model_version = EXCLUDED.ai_model_version,
          confidence_score = EXCLUDED.confidence_score,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
      `
      return result[0] as PrognosisData
    } catch (error) {
      console.error("Error creating/updating prognosis:", error)
      throw new Error("Failed to create/update prognosis")
    }
  }

  // Dashboard statistics
  async getDashboardStats() {
    try {
      const [patientStats, alertStats, appointmentStats] = await Promise.all([
        sql`
          SELECT 
            COUNT(*) as total_patients,
            COUNT(*) FILTER (WHERE status = 'active') as active_patients,
            COUNT(*) FILTER (WHERE status = 'critical') as critical_patients,
            COUNT(*) FILTER (WHERE status = 'stable') as stable_patients
          FROM patients
        `,
        sql`
          SELECT 
            COUNT(*) as total_alerts,
            COUNT(*) FILTER (WHERE is_acknowledged = false) as unacknowledged_alerts,
            COUNT(*) FILTER (WHERE alert_type = 'critical' AND is_acknowledged = false) as critical_alerts
          FROM medical_alerts
        `,
        sql`
          SELECT 
            COUNT(*) as total_appointments,
            COUNT(*) FILTER (WHERE appointment_date >= CURRENT_TIMESTAMP) as upcoming_appointments,
            COUNT(*) FILTER (WHERE appointment_date >= CURRENT_TIMESTAMP AND appointment_date <= CURRENT_TIMESTAMP + INTERVAL '7 days') as this_week_appointments
          FROM appointments
        `,
      ])

      return {
        patients: patientStats[0],
        alerts: alertStats[0],
        appointments: appointmentStats[0],
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      throw new Error("Failed to fetch dashboard statistics")
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()
