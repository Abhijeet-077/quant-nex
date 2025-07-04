"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function SurvivalCurveChart() {
  const data = useMemo(() => {
    return Array.from({ length: 61 }, (_, i) => ({
      time: i,
      baseline: Math.max(0, 100 * Math.exp(-0.02 * i)),
      patient: Math.max(0, 100 * Math.exp(-0.015 * i) * (1 - 0.2 * Math.sin(i / 10))),
      treatment: Math.max(0, 100 * Math.exp(-0.008 * i) * (1 - 0.1 * Math.sin(i / 15))),
    }))
  }, [])

  return (
    <div className="h-[400px] bg-black/20 rounded-lg p-4 border border-blue-500/20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis
            dataKey="time"
            stroke="#ffffff80"
            label={{ value: 'Time (months)', position: 'insideBottom', offset: -10, fill: '#ffffff80' }}
          />
          <YAxis
            stroke="#ffffff80"
            label={{ value: 'Survival Probability (%)', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#000000cc',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            name="Population Baseline"
          />
          <Line
            type="monotone"
            dataKey="patient"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
            name="Patient Prediction"
          />
          <Line
            type="monotone"
            dataKey="treatment"
            stroke="#ffc658"
            strokeWidth={2}
            dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
            name="With Treatment"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


