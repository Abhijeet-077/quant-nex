"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Brain, 
  Target,
  BarChart3,
  LineChart,
  PieChart,
  AlertTriangle
} from 'lucide-react'

// Safe Chart.js integration with SSR handling
let Chart: any = null

// Dynamically import Chart.js to prevent SSR issues
const loadChartJS = async () => {
  if (typeof window === 'undefined') return null

  try {
    const chartModule = await import('chart.js/auto')
    Chart = chartModule.default
    return Chart
  } catch (error) {
    console.error('Failed to load Chart.js:', error)
    return null
  }
}

interface MedicalChartProps {
  title: string
  data: any
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar'
  className?: string
  height?: number
}

// Safe chart component with error boundaries
export function SafeMedicalChart({ 
  title, 
  data, 
  type, 
  className = "",
  height = 300 
}: MedicalChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const initChart = async () => {
      try {
        setIsLoading(true)
        setHasError(false)

        // Load Chart.js
        const ChartJS = await loadChartJS()
        if (!ChartJS || !canvasRef.current) {
          throw new Error('Chart.js failed to load or canvas not available')
        }

        // Destroy existing chart
        if (chartRef.current) {
          chartRef.current.destroy()
        }

        // Create new chart with error handling
        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) {
          throw new Error('Canvas context not available')
        }

        chartRef.current = new ChartJS(ctx, {
          type,
          data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: '#ffffff'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#3b82f6',
                borderWidth: 1
              }
            },
            scales: type !== 'pie' && type !== 'doughnut' ? {
              x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(156, 163, 175, 0.1)' }
              },
              y: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(156, 163, 175, 0.1)' }
              }
            } : undefined
          }
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Chart initialization error:', error)
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Chart failed to load')
        setIsLoading(false)
      }
    }

    initChart()

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, type])

  if (hasError) {
    return (
      <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-red-300 text-sm">Chart Error</p>
            <p className="text-gray-400 text-xs">{errorMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height, position: 'relative' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <div className="text-center space-y-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-blue-300 text-sm">Loading chart...</p>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-configured medical chart components
export function PatientVitalsChart({ className = "" }: { className?: string }) {
  const vitalsData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: [72, 68, 75, 80, 78, 74],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Blood Pressure (Systolic)',
        data: [120, 118, 125, 130, 128, 122],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  return (
    <SafeMedicalChart
      title="Patient Vital Signs"
      data={vitalsData}
      type="line"
      className={className}
    />
  )
}

export function TumorProgressionChart({ className = "" }: { className?: string }) {
  const tumorData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Tumor Size (mm)',
        data: [25, 23, 20, 18, 15, 12],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(139, 92, 246, 0.5)',
          'rgba(139, 92, 246, 0.4)',
          'rgba(139, 92, 246, 0.3)'
        ],
        borderColor: '#8b5cf6',
        borderWidth: 2
      }
    ]
  }

  return (
    <SafeMedicalChart
      title="Tumor Progression"
      data={tumorData}
      type="bar"
      className={className}
    />
  )
}

export function TreatmentEfficacyChart({ className = "" }: { className?: string }) {
  const efficacyData = {
    labels: ['Radiation', 'Chemotherapy', 'Immunotherapy', 'Surgery'],
    datasets: [
      {
        label: 'Efficacy %',
        data: [85, 72, 68, 95],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 2
      }
    ]
  }

  return (
    <SafeMedicalChart
      title="Treatment Efficacy"
      data={efficacyData}
      type="doughnut"
      className={className}
    />
  )
}

export function SurvivalCurveChart({ className = "" }: { className?: string }) {
  const survivalData = {
    labels: ['0', '6', '12', '18', '24', '30', '36', '42', '48', '54', '60'],
    datasets: [
      {
        label: 'Survival Rate (%)',
        data: [100, 95, 88, 82, 76, 70, 65, 60, 55, 50, 45],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Treatment Group (%)',
        data: [100, 98, 94, 90, 86, 82, 78, 74, 70, 66, 62],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  return (
    <SafeMedicalChart
      title="Survival Curve Analysis"
      data={survivalData}
      type="line"
      className={className}
    />
  )
}

// Medical KPI Cards
export function MedicalKPICard({ 
  title, 
  value, 
  unit, 
  trend, 
  icon: Icon,
  color = "blue",
  className = "" 
}: {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  icon: any
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow'
  className?: string
}) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'border-green-500/30 bg-green-900/20'
      case 'red':
        return 'border-red-500/30 bg-red-900/20'
      case 'purple':
        return 'border-purple-500/30 bg-purple-900/20'
      case 'yellow':
        return 'border-yellow-500/30 bg-yellow-900/20'
      default:
        return 'border-blue-500/30 bg-blue-900/20'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className={`${getColorClasses()} border ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-white">{value}</span>
              {unit && <span className="text-gray-400 text-sm">{unit}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Icon className={`w-6 h-6 text-${color}-400`} />
            {trend && getTrendIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Radiation therapy dose mapping visualization
export function RadiationDoseMap({ className = "" }: { className?: string }) {
  const doseData = {
    labels: ['Target Volume', 'Critical Organs', 'Healthy Tissue', 'Skin Surface'],
    datasets: [
      {
        label: 'Radiation Dose (Gy)',
        data: [60, 20, 5, 2],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#10b981',
          '#3b82f6'
        ],
        borderWidth: 2
      }
    ]
  }

  return (
    <SafeMedicalChart
      title="Radiation Dose Distribution"
      data={doseData}
      type="pie"
      className={className}
    />
  )
}
