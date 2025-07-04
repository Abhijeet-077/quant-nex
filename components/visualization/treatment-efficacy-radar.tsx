"use client"

import { useMemo } from "react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

export function TreatmentEfficacyRadar() {
  const data = useMemo(() => [
    {
      metric: "Tumor Reduction",
      "Standard Chemo": 65,
      "Targeted Therapy": 80,
      "Quantum-Enhanced": 90,
      fullMark: 100,
    },
    {
      metric: "Side Effects (Lower is Better)",
      "Standard Chemo": 30, // Inverted: 100-70
      "Targeted Therapy": 60, // Inverted: 100-40
      "Quantum-Enhanced": 70, // Inverted: 100-30
      fullMark: 100,
    },
    {
      metric: "Quality of Life",
      "Standard Chemo": 50,
      "Targeted Therapy": 75,
      "Quantum-Enhanced": 85,
      fullMark: 100,
    },
    {
      metric: "Cost Effectiveness",
      "Standard Chemo": 75,
      "Targeted Therapy": 50,
      "Quantum-Enhanced": 60,
      fullMark: 100,
    },
    {
      metric: "Long-term Outlook",
      "Standard Chemo": 60,
      "Targeted Therapy": 85,
      "Quantum-Enhanced": 95,
      fullMark: 100,
    },
  ], [])

  return (
    <div className="h-[400px] bg-black/20 rounded-lg p-4 border border-blue-500/20">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <PolarGrid stroke="#ffffff20" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#ffffff80', fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#ffffff60', fontSize: 10 }}
          />
          <Radar
            name="Standard Chemo"
            dataKey="Standard Chemo"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Targeted Therapy"
            dataKey="Targeted Therapy"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Quantum-Enhanced"
            dataKey="Quantum-Enhanced"
            stroke="#ffc658"
            fill="#ffc658"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ color: '#ffffff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
