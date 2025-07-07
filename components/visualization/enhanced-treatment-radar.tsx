"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

const treatmentData = [
  { subject: 'Effectiveness', A: 85, B: 78, fullMark: 100 },
  { subject: 'Safety', A: 92, B: 85, fullMark: 100 },
  { subject: 'Tolerance', A: 78, B: 90, fullMark: 100 },
  { subject: 'Response Rate', A: 88, B: 82, fullMark: 100 },
  { subject: 'Quality of Life', A: 75, B: 88, fullMark: 100 },
  { subject: 'Cost Effectiveness', A: 65, B: 75, fullMark: 100 },
]

export function EnhancedTreatmentRadar() {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={treatmentData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Current Treatment"
            dataKey="A"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Alternative Treatment"
            dataKey="B"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
