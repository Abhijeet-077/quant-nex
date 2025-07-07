"use client"

import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Download, Share2 } from "lucide-react"

interface SurvivalData {
  time: number
  survival: number
  confidence_lower: number
  confidence_upper: number
  at_risk: number
  treatment: string
}

export function InteractiveSurvivalCurves() {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(["Standard", "Quantum-Enhanced"])
  const [timeRange, setTimeRange] = useState([0, 60])
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true)
  const [highlightedPoint, setHighlightedPoint] = useState<any>(null)

  // Generate realistic survival data
  const generateSurvivalData = (treatment: string, baseRate: number) => {
    const data: SurvivalData[] = []
    for (let time = 0; time <= 60; time += 3) {
      const survival = Math.max(0, baseRate * Math.exp(-time / 30) + Math.random() * 0.05)
      data.push({
        time,
        survival: survival * 100,
        confidence_lower: Math.max(0, (survival - 0.1) * 100),
        confidence_upper: Math.min(100, (survival + 0.1) * 100),
        at_risk: Math.max(0, Math.floor(100 * survival)),
        treatment,
      })
    }
    return data
  }

  const allData = useMemo(() => {
    const treatments = {
      Standard: 0.7,
      "Quantum-Enhanced": 0.85,
      Immunotherapy: 0.75,
      Combination: 0.9,
    }

    return Object.entries(treatments).flatMap(([treatment, rate]) => generateSurvivalData(treatment, rate))
  }, [])

  const filteredData = useMemo(() => {
    return allData.filter(
      (d) => selectedTreatments.includes(d.treatment) && d.time >= timeRange[0] && d.time <= timeRange[1],
    )
  }, [allData, selectedTreatments, timeRange])

  const treatmentColors = {
    Standard: "#8884d8",
    "Quantum-Enhanced": "#00ffff",
    Immunotherapy: "#82ca9d",
    Combination: "#ffc658",
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/80 p-3 rounded-lg border border-white/20">
          <p className="text-white font-medium">{`Month ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="text-sm">
              <p style={{ color: entry.color }}>{`${entry.dataKey}: ${entry.value.toFixed(1)}%`}</p>
              {entry.payload.at_risk && (
                <p className="text-slate-400">{`At Risk: ${entry.payload.at_risk} patients`}</p>
              )}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-white" />
          <Select value={selectedTreatments[0]} onValueChange={(value) => setSelectedTreatments([value])}>
            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Treatment" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(treatmentColors).map((treatment) => (
                <SelectItem key={treatment} value={treatment}>
                  {treatment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
          className={`${showConfidenceInterval ? "bg-cyan-500/20" : "bg-white/10"} border-white/20 text-white`}
        >
          Confidence Interval
        </Button>

        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <span className="text-white text-sm">Time Range:</span>
          <Slider value={timeRange} onValueChange={setTimeRange} max={60} step={3} className="flex-1" />
          <span className="text-white text-sm">
            {timeRange[0]}-{timeRange[1]} months
          </span>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white">
            <Share2 className="h-3 w-3 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Treatment Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(treatmentColors).map(([treatment, color]) => (
          <Badge
            key={treatment}
            variant={selectedTreatments.includes(treatment) ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedTreatments.includes(treatment) ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
            }`}
            onClick={() => {
              setSelectedTreatments((prev) =>
                prev.includes(treatment) ? prev.filter((t) => t !== treatment) : [...prev, treatment],
              )
            }}
          >
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
            {treatment}
          </Badge>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis
              dataKey="time"
              stroke="#ffffff80"
              label={{ value: "Time (months)", position: "insideBottom", offset: -5, fill: "#ffffff80" }}
            />
            <YAxis
              stroke="#ffffff80"
              label={{ value: "Survival (%)", angle: -90, position: "insideLeft", fill: "#ffffff80" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {selectedTreatments.map((treatment) => (
              <Line
                key={treatment}
                type="monotone"
                dataKey="survival"
                data={filteredData.filter((d) => d.treatment === treatment)}
                stroke={treatmentColors[treatment as keyof typeof treatmentColors]}
                strokeWidth={3}
                dot={{ fill: treatmentColors[treatment as keyof typeof treatmentColors], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: treatmentColors[treatment as keyof typeof treatmentColors], strokeWidth: 2 }}
                name={treatment}
              />
            ))}

            {/* Reference lines */}
            <ReferenceLine y={50} stroke="#ff6b6b" strokeDasharray="5 5" label="50% Survival" />
            <ReferenceLine x={24} stroke="#4ecdc4" strokeDasharray="5 5" label="2 Years" />

            <Brush dataKey="time" height={30} stroke="#ffffff40" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white/5 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">94.2%</div>
          <div className="text-sm text-slate-400">1-Year Survival</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">78.5%</div>
          <div className="text-sm text-slate-400">2-Year Survival</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">65.3%</div>
          <div className="text-sm text-slate-400">5-Year Survival</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-sm text-slate-400">Patients Analyzed</div>
        </div>
      </div>
    </div>
  )
}
