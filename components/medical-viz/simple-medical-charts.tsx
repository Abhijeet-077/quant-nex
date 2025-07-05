"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

interface MedicalChartProps {
  title: string
  className?: string
  height?: number
}

// Simple SVG-based charts that work with SSR
export function PatientVitalsChart({ className = "" }: { className?: string }) {
  const vitalsData = [
    { time: '00:00', heartRate: 72, bloodPressure: 120 },
    { time: '04:00', heartRate: 68, bloodPressure: 118 },
    { time: '08:00', heartRate: 75, bloodPressure: 125 },
    { time: '12:00', heartRate: 80, bloodPressure: 130 },
    { time: '16:00', heartRate: 78, bloodPressure: 128 },
    { time: '20:00', heartRate: 74, bloodPressure: 122 },
  ]

  return (
    <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-400" />
          Patient Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Heart Rate Line */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              points={vitalsData.map((d, i) => `${i * 66 + 20},${180 - (d.heartRate - 60) * 2}`).join(' ')}
            />
            
            {/* Blood Pressure Line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={vitalsData.map((d, i) => `${i * 66 + 20},${180 - (d.bloodPressure - 100) * 2}`).join(' ')}
            />
            
            {/* Data points */}
            {vitalsData.map((d, i) => (
              <g key={i}>
                <circle cx={i * 66 + 20} cy={180 - (d.heartRate - 60) * 2} r="3" fill="#ef4444" />
                <circle cx={i * 66 + 20} cy={180 - (d.bloodPressure - 100) * 2} r="3" fill="#3b82f6" />
              </g>
            ))}
            
            {/* Labels */}
            {vitalsData.map((d, i) => (
              <text key={i} x={i * 66 + 20} y={195} textAnchor="middle" fill="#9ca3af" fontSize="10">
                {d.time}
              </text>
            ))}
          </svg>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Heart Rate (BPM)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Blood Pressure</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TumorProgressionChart({ className = "" }: { className?: string }) {
  const tumorData = [
    { week: 'Week 1', size: 25 },
    { week: 'Week 2', size: 23 },
    { week: 'Week 3', size: 20 },
    { week: 'Week 4', size: 18 },
    { week: 'Week 5', size: 15 },
    { week: 'Week 6', size: 12 },
  ]

  const maxSize = Math.max(...tumorData.map(d => d.size))

  return (
    <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-400" />
          Tumor Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] relative">
          <svg className="w-full h-full" viewBox="0 0 300 200">
            {/* Bars */}
            {tumorData.map((d, i) => (
              <g key={i}>
                <rect
                  x={i * 45 + 20}
                  y={180 - (d.size / maxSize) * 140}
                  width="30"
                  height={(d.size / maxSize) * 140}
                  fill="#8b5cf6"
                  opacity="0.8"
                />
                <text
                  x={i * 45 + 35}
                  y={195}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {d.week.split(' ')[1]}
                </text>
                <text
                  x={i * 45 + 35}
                  y={175 - (d.size / maxSize) * 140}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                >
                  {d.size}mm
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

export function TreatmentEfficacyChart({ className = "" }: { className?: string }) {
  const treatments = [
    { name: 'Radiation', efficacy: 85, color: '#10b981' },
    { name: 'Chemotherapy', efficacy: 72, color: '#3b82f6' },
    { name: 'Immunotherapy', efficacy: 68, color: '#f59e0b' },
    { name: 'Surgery', efficacy: 95, color: '#ef4444' },
  ]

  return (
    <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
          Treatment Efficacy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {treatments.map((treatment, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">{treatment.name}</span>
                <span className="text-white font-medium">{treatment.efficacy}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${treatment.efficacy}%`,
                    backgroundColor: treatment.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SurvivalCurveChart({ className = "" }: { className?: string }) {
  const survivalData = [
    { month: 0, control: 100, treatment: 100 },
    { month: 6, control: 95, treatment: 98 },
    { month: 12, control: 88, treatment: 94 },
    { month: 18, control: 82, treatment: 90 },
    { month: 24, control: 76, treatment: 86 },
    { month: 30, control: 70, treatment: 82 },
    { month: 36, control: 65, treatment: 78 },
    { month: 42, control: 60, treatment: 74 },
    { month: 48, control: 55, treatment: 70 },
    { month: 54, control: 50, treatment: 66 },
    { month: 60, control: 45, treatment: 62 },
  ]

  return (
    <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <LineChart className="w-5 h-5 mr-2 text-blue-400" />
          Survival Curve Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <svg className="w-full h-full" viewBox="0 0 500 250">
            {/* Grid */}
            <defs>
              <pattern id="survival-grid" width="50" height="25" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 25" fill="none" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#survival-grid)" />
            
            {/* Control Group Line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={survivalData.map((d, i) => `${i * 45 + 20},${200 - (d.control / 100) * 160}`).join(' ')}
            />
            
            {/* Treatment Group Line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={survivalData.map((d, i) => `${i * 45 + 20},${200 - (d.treatment / 100) * 160}`).join(' ')}
            />
            
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((val, i) => (
              <text key={i} x="10" y={200 - (val / 100) * 160 + 5} fill="#9ca3af" fontSize="10">
                {val}%
              </text>
            ))}
            
            {/* X-axis labels */}
            {[0, 12, 24, 36, 48, 60].map((month, i) => (
              <text key={i} x={i * 90 + 20} y="220" textAnchor="middle" fill="#9ca3af" fontSize="10">
                {month}mo
              </text>
            ))}
          </svg>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Control Group</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Treatment Group</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  const doseData = [
    { area: 'Target Volume', dose: 60, color: '#ef4444' },
    { area: 'Critical Organs', dose: 20, color: '#f59e0b' },
    { area: 'Healthy Tissue', dose: 5, color: '#10b981' },
    { area: 'Skin Surface', dose: 2, color: '#3b82f6' },
  ]

  const total = doseData.reduce((sum, d) => sum + d.dose, 0)

  return (
    <Card className={`bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-orange-400" />
          Radiation Dose Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doseData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">{item.area}</span>
                <span className="text-white font-medium">{item.dose} Gy</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.dose / total) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
