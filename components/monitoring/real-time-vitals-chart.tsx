"use client"

import React, { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Thermometer, Droplets } from "lucide-react"

interface VitalData {
  time: string
  heartRate: number
  bloodPressureSys: number
  bloodPressureDia: number
  temperature: number
  oxygenSat: number
  respiratoryRate: number
}

interface RealTimeVitalsChartProps {
  title: string
  vitalType: "heartRate" | "bloodPressure" | "temperature" | "oxygenSat" | "respiratoryRate"
  color: string
  icon: React.ReactNode
  unit: string
  normalRange: [number, number]
  currentValue: number
}

export function RealTimeVitalsChart({
  title,
  vitalType,
  color,
  icon,
  unit,
  normalRange,
  currentValue
}: RealTimeVitalsChartProps) {
  const [data, setData] = useState<VitalData[]>([])
  const [isLive, setIsLive] = useState(true)

  // Generate initial data
  useEffect(() => {
    const generateInitialData = () => {
      const now = new Date()
      const initialData: VitalData[] = []
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2000) // 2 second intervals
        initialData.push({
          time: time.toLocaleTimeString(),
          heartRate: 70 + Math.sin(i * 0.1) * 5 + Math.random() * 4,
          bloodPressureSys: 120 + Math.sin(i * 0.15) * 8 + Math.random() * 6,
          bloodPressureDia: 80 + Math.sin(i * 0.12) * 4 + Math.random() * 3,
          temperature: 37.0 + Math.sin(i * 0.08) * 0.3 + Math.random() * 0.2,
          oxygenSat: 97 + Math.sin(i * 0.1) * 1.5 + Math.random() * 1,
          respiratoryRate: 16 + Math.sin(i * 0.1) * 2 + Math.random() * 1,
        })
      }
      
      setData(initialData)
    }

    generateInitialData()
  }, [])

  // Real-time data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData]
        const now = new Date()
        
        // Remove oldest data point and add new one
        newData.shift()
        newData.push({
          time: now.toLocaleTimeString(),
          heartRate: 70 + Math.sin(Date.now() * 0.001) * 5 + Math.random() * 4,
          bloodPressureSys: 120 + Math.sin(Date.now() * 0.0015) * 8 + Math.random() * 6,
          bloodPressureDia: 80 + Math.sin(Date.now() * 0.0012) * 4 + Math.random() * 3,
          temperature: 37.0 + Math.sin(Date.now() * 0.0008) * 0.3 + Math.random() * 0.2,
          oxygenSat: 97 + Math.sin(Date.now() * 0.001) * 1.5 + Math.random() * 1,
          respiratoryRate: 16 + Math.sin(Date.now() * 0.001) * 2 + Math.random() * 1,
        })
        
        return newData
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const getStatus = (value: number, range: [number, number]) => {
    if (value < range[0]) return "low"
    if (value > range[1]) return "high"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "text-blue-400"
      case "high": return "text-red-400"
      case "normal": return "text-green-400"
      default: return "text-gray-400"
    }
  }

  const status = getStatus(currentValue, normalRange)
  const statusColor = getStatusColor(status)

  const formatValue = (value: number) => {
    if (vitalType === "temperature") {
      return value.toFixed(1)
    }
    return Math.round(value).toString()
  }

  return (
    <Card className="bg-black/20 border-blue-500/30 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-white text-sm font-medium">{title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-white">
                  {formatValue(currentValue)}
                </span>
                <span className="text-sm text-gray-400">{unit}</span>
                <Badge 
                  variant="outline" 
                  className={`${statusColor} border-current text-xs`}
                >
                  {status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}
            />
            <span className="text-xs text-gray-400">
              {isLive ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${vitalType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--${color}-500)`} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={`var(--${color}-500)`} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af" 
                fontSize={10}
                tickFormatter={(value) => value.split(':').slice(1).join(':')}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={10}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                labelStyle={{ color: "#ffffff" }}
                formatter={(value: number) => [formatValue(value), title]}
              />
              <Area
                type="monotone"
                dataKey={vitalType}
                stroke={`var(--${color}-500)`}
                strokeWidth={2}
                fill={`url(#gradient-${vitalType})`}
                dot={false}
                activeDot={{ r: 4, stroke: `var(--${color}-500)`, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>Normal: {normalRange[0]}-{normalRange[1]} {unit}</span>
          <span>Last 60s</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized components for different vital signs
export function HeartRateChart() {
  return (
    <RealTimeVitalsChart
      title="Heart Rate"
      vitalType="heartRate"
      color="pink"
      icon={<Heart className="h-4 w-4" />}
      unit="bpm"
      normalRange={[60, 100]}
      currentValue={72}
    />
  )
}

export function BloodPressureChart() {
  return (
    <RealTimeVitalsChart
      title="Blood Pressure (Systolic)"
      vitalType="bloodPressureSys"
      color="cyan"
      icon={<Activity className="h-4 w-4" />}
      unit="mmHg"
      normalRange={[90, 140]}
      currentValue={118}
    />
  )
}

export function TemperatureChart() {
  return (
    <RealTimeVitalsChart
      title="Body Temperature"
      vitalType="temperature"
      color="yellow"
      icon={<Thermometer className="h-4 w-4" />}
      unit="°C"
      normalRange={[36.1, 37.2]}
      currentValue={37.1}
    />
  )
}

export function OxygenSaturationChart() {
  return (
    <RealTimeVitalsChart
      title="Oxygen Saturation"
      vitalType="oxygenSat"
      color="green"
      icon={<Droplets className="h-4 w-4" />}
      unit="%"
      normalRange={[95, 100]}
      currentValue={97}
    />
  )
}
