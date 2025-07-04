import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Patient, MedicalReport, Treatment, Appointment, ApiResponse, PaginatedResponse } from '@/types/medical'
import { patientDataCache, CacheKeys } from '@/lib/caching'
import { sanitizer } from '@/lib/input-sanitization'

// Generic hook for medical data fetching with caching and error handling
export function useMedicalData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    enabled?: boolean
    refetchInterval?: number
    cacheTime?: number
    patientSpecific?: boolean
    requiresPermission?: string
  } = {}
) {
  const { data: session } = useSession()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    enabled = true,
    refetchInterval,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    patientSpecific = false,
    requiresPermission
  } = options

  // Check permissions
  const hasPermission = useCallback(() => {
    if (!requiresPermission || !session?.user) return true
    return session.user.permissions.includes(requiresPermission) || 
           session.user.permissions.includes('admin')
  }, [session, requiresPermission])

  const fetchData = useCallback(async () => {
    if (!enabled || !hasPermission()) {
      setLoading(false)
      return
    }

    // Check cache first
    const cached = patientDataCache.get<T>(key)
    if (cached) {
      setData(cached)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController()

      const result = await fetcher()
      
      // Cache the result
      patientDataCache.set(key, result, {
        ttl: cacheTime,
        patientSpecific,
      })

      setData(result)
      setLastFetch(new Date())
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
      }
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, enabled, hasPermission, cacheTime, patientSpecific])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refetchInterval, enabled])

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const invalidate = useCallback(() => {
    patientDataCache.delete(key)
    fetchData()
  }, [key, fetchData])

  const mutate = useCallback((newData: T) => {
    setData(newData)
    patientDataCache.set(key, newData, { ttl: cacheTime, patientSpecific })
  }, [key, cacheTime, patientSpecific])

  return {
    data,
    loading,
    error,
    lastFetch,
    refetch: fetchData,
    invalidate,
    mutate,
  }
}

// Hook for patient data management
export function usePatientData(patientId?: string) {
  const { data: session } = useSession()
  
  const fetchPatient = useCallback(async (): Promise<Patient> => {
    if (!patientId) throw new Error('Patient ID is required')
    
    const response = await fetch(`/api/patients/${patientId}`)
    if (!response.ok) throw new Error('Failed to fetch patient data')
    
    const result: ApiResponse<Patient> = await response.json()
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to fetch patient data')
    }
    
    return result.data
  }, [patientId])

  const {
    data: patient,
    loading,
    error,
    refetch,
    invalidate,
    mutate
  } = useMedicalData(
    patientId ? CacheKeys.patient(patientId) : '',
    fetchPatient,
    {
      enabled: !!patientId,
      patientSpecific: true,
      requiresPermission: 'read_patients',
    }
  )

  const updatePatient = useCallback(async (updates: Partial<Patient>) => {
    if (!patientId || !patient) throw new Error('Patient ID and current data required')

    // Sanitize input data
    const sanitizedUpdates = {
      ...updates,
      firstName: updates.firstName ? sanitizer.sanitizePatientName(updates.firstName) : undefined,
      lastName: updates.lastName ? sanitizer.sanitizePatientName(updates.lastName) : undefined,
      email: updates.email ? sanitizer.sanitizeEmail(updates.email) : undefined,
      phone: updates.phone ? sanitizer.sanitizePhoneNumber(updates.phone) : undefined,
    }

    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedUpdates),
    })

    if (!response.ok) throw new Error('Failed to update patient')

    const result: ApiResponse<Patient> = await response.json()
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to update patient')
    }

    // Update cache
    mutate(result.data)
    return result.data
  }, [patientId, patient, mutate])

  return {
    patient,
    loading,
    error,
    refetch,
    invalidate,
    updatePatient,
  }
}

// Hook for patient list with pagination and filtering
export function usePatientList(filters: {
  search?: string
  status?: string
  page?: number
  limit?: number
} = {}) {
  const { search = '', status = 'all', page = 1, limit = 20 } = filters

  const fetchPatients = useCallback(async (): Promise<PaginatedResponse<Patient>> => {
    const params = new URLSearchParams({
      search,
      status,
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await fetch(`/api/patients?${params}`)
    if (!response.ok) throw new Error('Failed to fetch patients')

    return response.json()
  }, [search, status, page, limit])

  const cacheKey = `patients_${search}_${status}_${page}_${limit}`

  return useMedicalData(
    cacheKey,
    fetchPatients,
    {
      requiresPermission: 'read_patients',
      cacheTime: 2 * 60 * 1000, // 2 minutes for list data
    }
  )
}

// Hook for patient appointments
export function usePatientAppointments(patientId: string) {
  const fetchAppointments = useCallback(async (): Promise<Appointment[]> => {
    const response = await fetch(`/api/patients/${patientId}/appointments`)
    if (!response.ok) throw new Error('Failed to fetch appointments')

    const result: ApiResponse<Appointment[]> = await response.json()
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to fetch appointments')
    }

    return result.data
  }, [patientId])

  return useMedicalData(
    CacheKeys.patientReports(patientId),
    fetchAppointments,
    {
      enabled: !!patientId,
      patientSpecific: true,
      requiresPermission: 'read_patients',
    }
  )
}

// Hook for patient treatments
export function usePatientTreatments(patientId: string) {
  const fetchTreatments = useCallback(async (): Promise<Treatment[]> => {
    const response = await fetch(`/api/patients/${patientId}/treatments`)
    if (!response.ok) throw new Error('Failed to fetch treatments')

    const result: ApiResponse<Treatment[]> = await response.json()
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to fetch treatments')
    }

    return result.data
  }, [patientId])

  return useMedicalData(
    CacheKeys.patientTreatment(patientId),
    fetchTreatments,
    {
      enabled: !!patientId,
      patientSpecific: true,
      requiresPermission: 'read_patients',
    }
  )
}

// Hook for patient reports
export function usePatientReports(patientId: string) {
  const fetchReports = useCallback(async (): Promise<MedicalReport[]> => {
    const response = await fetch(`/api/patients/${patientId}/reports`)
    if (!response.ok) throw new Error('Failed to fetch reports')

    const result: ApiResponse<MedicalReport[]> = await response.json()
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to fetch reports')
    }

    return result.data
  }, [patientId])

  return useMedicalData(
    CacheKeys.patientReports(patientId),
    fetchReports,
    {
      enabled: !!patientId,
      patientSpecific: true,
      requiresPermission: 'read_reports',
    }
  )
}

// Hook for real-time patient monitoring
export function usePatientMonitoring(patientId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [vitals, setVitals] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!patientId) return

    // Establish WebSocket connection for real-time monitoring
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/patients/${patientId}/monitoring`)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setVitals(data)
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [patientId])

  const sendCommand = useCallback((command: string, data?: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({ command, data }))
    }
  }, [isConnected])

  return {
    isConnected,
    vitals,
    sendCommand,
  }
}
