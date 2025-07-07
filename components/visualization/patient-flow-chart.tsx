"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function PatientFlowChart() {
  const data = [
    { stage: "Initial Screening", patients: 1247, color: "#3b82f6" },
    { stage: "Diagnosis", patients: 892, color: "#8b5cf6" },
    { stage: "Treatment Planning", patients: 756, color: "#06b6d4" },
    { stage: "Active Treatment", patients: 634, color: "#10b981" },
    { stage: "Monitoring", patients: 523, color: "#f59e0b" },
    { stage: "Recovery", patients: 445, color: "#84cc16" },
    { stage: "Follow-up", patients: 389, color: "#06d6a0" },
  ]

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="stage"
            stroke="#9CA3AF"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              color: "white",
            }}
            formatter={(value: number) => [`${value} patients`, "Count"]}
          />
          <Bar dataKey="patients" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
