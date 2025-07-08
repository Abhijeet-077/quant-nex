// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, query, where } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ABCDEF123",
}

// Initialize Firebase
let app
let db: any
let auth: any
let storage: any

// Check if we're in a browser environment before initializing Firebase
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
    storage = getStorage(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Authentication service
export const authService = {
  // Register a new user
  async register(email: string, password: string, userData: any) {
    if (!auth) return null

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return user
  },

  // Login user
  async login(email: string, password: string) {
    if (!auth) return null

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  // Logout user
  async logout() {
    if (!auth) return

    await signOut(auth)
  },

  // Get current user profile
  async getCurrentUserProfile() {
    if (!auth || !auth.currentUser) return null

    const docRef = doc(db, "users", auth.currentUser.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  },
}

// Patient service
export const patientService = {
  // Get all patients
  async getAllPatients() {
    if (!db) return []

    const patientsCollection = collection(db, "patients")
    const patientsSnapshot = await getDocs(patientsCollection)
    return patientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  // Get patient by ID
  async getPatientById(patientId: string) {
    if (!db) return null

    const docRef = doc(db, "patients", patientId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  },

  // Create new patient
  async createPatient(patientData: any) {
    if (!db) return null

    const patientRef = doc(collection(db, "patients"))
    await setDoc(patientRef, {
      ...patientData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { id: patientRef.id, ...patientData }
  },

  // Update patient
  async updatePatient(patientId: string, patientData: any) {
    if (!db) return null

    const patientRef = doc(db, "patients", patientId)
    await setDoc(
      patientRef,
      {
        ...patientData,
        updatedAt: new Date(),
      },
      { merge: true },
    )

    return { id: patientId, ...patientData }
  },
}

// Scan service
export const scanService = {
  // Upload scan image
  async uploadScanImage(file: File, patientId: string, scanType: string) {
    if (!storage || !db) return null

    const fileExtension = file.name.split(".").pop()
    const fileName = `${patientId}_${scanType}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `scans/${fileName}`)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    // Create scan record in Firestore
    const scanRef = doc(collection(db, "scans"))
    await setDoc(scanRef, {
      patientId,
      scanType,
      imageUrl: downloadURL,
      fileName,
      uploadedAt: new Date(),
      status: "pending_analysis",
    })

    return {
      id: scanRef.id,
      patientId,
      scanType,
      imageUrl: downloadURL,
      fileName,
      uploadedAt: new Date(),
      status: "pending_analysis",
    }
  },

  // Get scans by patient ID
  async getScansByPatientId(patientId: string) {
    if (!db) return []

    const scansQuery = query(collection(db, "scans"), where("patientId", "==", patientId))

    const scansSnapshot = await getDocs(scansQuery)
    return scansSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  // Get recent scans
  async getRecentScans(limit = 10) {
    if (!db) {
      // Return mock data for demo purposes
      return Array.from({ length: limit }, (_, i) => ({
        id: `scan-${i}`,
        patientId: `patient-${i % 5}`,
        scanType: i % 2 === 0 ? "MRI" : "CT",
        imageUrl: "/placeholder.svg?height=300&width=300",
        fileName: `scan_${i}.dcm`,
        uploadedAt: new Date(Date.now() - i * 86400000),
        status: i % 3 === 0 ? "pending_analysis" : i % 3 === 1 ? "analyzed" : "reviewed",
      }))
    }

    const scansCollection = collection(db, "scans")
    const scansSnapshot = await getDocs(scansCollection)
    return scansSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .slice(0, limit)
  },
}

// ML results service
export const mlResultsService = {
  // Get diagnosis results
  async getDiagnosisResults(scanId: string) {
    if (!db) return null

    const docRef = doc(db, "diagnoses", scanId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  },

  // Get prognosis results
  async getPrognosisResults(patientId: string) {
    if (!db) return null

    const docRef = doc(db, "prognoses", patientId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  },

  // Get treatment plan
  async getTreatmentPlan(patientId: string) {
    if (!db) return null

    const docRef = doc(db, "treatments", patientId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  },

  // Get recent insights
  async getRecentInsights(limit = 5) {
    if (!db) {
      // Return mock data for demo purposes
      return Array.from({ length: limit }, (_, i) => ({
        id: `insight-${i}`,
        title: [
          "Treatment Resistance Detected",
          "Potential Clinical Trial Match",
          "Anomaly in Tumor Growth Pattern",
          "Genetic Marker Identified",
          "Immunotherapy Response Predicted",
        ][i],
        description: [
          "Patient is showing signs of resistance to the current treatment regimen. Consider adjusting the protocol based on the latest genomic analysis.",
          "Patient matches the criteria for the new quantum-enhanced radiotherapy trial. Genomic profile indicates high likelihood of positive response.",
          "Unusual growth pattern detected in patient's latest scan. The peripheral region shows unexpected metabolic activity that differs from typical progression.",
          "New genetic marker identified that may indicate sensitivity to targeted therapy. Consider genomic consultation.",
          "Based on immune profile, patient is likely to respond well to immunotherapy. Consider as adjuvant to current treatment.",
        ][i],
        confidence: 0.7 + i * 0.05,
        timestamp: new Date(Date.now() - i * 3600000),
        references: [
          {
            title: "Recent study on treatment resistance in glioblastoma",
            url: "#",
          },
          {
            title: "Similar case study from Memorial Cancer Institute",
            url: "#",
          },
        ],
      }))
    }

    const insightsCollection = collection(db, "insights")
    const insightsSnapshot = await getDocs(insightsCollection)
    return insightsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .slice(0, limit)
  },

  // Get treatment efficacy data
  async getTreatmentEfficacyData() {
    // Return mock data for demo purposes
    return [
      {
        name: "Standard Chemo",
        metrics: {
          tumor_reduction: 65,
          side_effects: 70,
          quality_of_life: 50,
          cost_effectiveness: 75,
          long_term_outlook: 60,
        },
      },
      {
        name: "Targeted Therapy",
        metrics: {
          tumor_reduction: 80,
          side_effects: 40,
          quality_of_life: 75,
          cost_effectiveness: 50,
          long_term_outlook: 85,
        },
      },
      {
        name: "Quantum-Enhanced",
        metrics: {
          tumor_reduction: 90,
          side_effects: 30,
          quality_of_life: 85,
          cost_effectiveness: 60,
          long_term_outlook: 95,
        },
      },
    ]
  },

  // Get survival data
  async getSurvivalData() {
    // Return mock data for demo purposes
    return [
      {
        name: "Patient Prediction",
        values: Array.from({ length: 60 }, (_, i) => ({
          time: i,
          probability: Math.exp(-0.015 * i) * (1 - 0.2 * Math.sin(i / 10)),
          lowerBound: Math.exp(-0.02 * i) * (1 - 0.2 * Math.sin(i / 10) - 0.05),
          upperBound: Math.exp(-0.01 * i) * (1 - 0.2 * Math.sin(i / 10) + 0.05),
        })),
        baseline: Array.from({ length: 60 }, (_, i) => ({
          time: i,
          probability: Math.exp(-0.02 * i),
        })),
      },
      {
        name: "With Treatment",
        values: Array.from({ length: 60 }, (_, i) => ({
          time: i,
          probability: Math.exp(-0.008 * i) * (1 - 0.1 * Math.sin(i / 15)),
          lowerBound: Math.exp(-0.012 * i) * (1 - 0.1 * Math.sin(i / 15) - 0.05),
          upperBound: Math.exp(-0.005 * i) * (1 - 0.1 * Math.sin(i / 15) + 0.05),
        })),
      },
    ]
  },
}

export { db, auth, storage }
