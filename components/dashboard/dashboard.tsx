"use client"

import type React from "react"
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  FlaskConical,
  GalleryHorizontalEnd,
  Gauge,
  Microscope,
  Network,
  Syringe,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CustomizableDashboard } from "./customizable-dashboard"

export function Dashboard() {
  return <CustomizableDashboard />
}

function StatisticsPanel({
  patientCount,
  activeTreatments,
  pendingDiagnoses,
  criticalAlerts,
}: {
  patientCount: number
  activeTreatments: number
  pendingDiagnoses: number
  criticalAlerts: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <StatCard
        title="Total Patients"
        value={patientCount}
        icon={<Users className="h-8 w-8 text-cyan-500" />}
        trend={+5}
        trendLabel="from last week"
      />
      <StatCard
        title="Active Treatments"
        value={activeTreatments}
        icon={<Syringe className="h-8 w-8 text-green-500" />}
        trend={+2}
        trendLabel="from last week"
      />
      <StatCard
        title="Pending Diagnoses"
        value={pendingDiagnoses}
        icon={<FlaskConical className="h-8 w-8 text-amber-500" />}
        trend={-3}
        trendLabel="from last week"
      />
      <StatCard
        title="Critical Alerts"
        value={criticalAlerts}
        icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
        trend={+1}
        trendLabel="from yesterday"
        isNegativeTrendBad={true}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  isNegativeTrendBad = false,
}: {
  title: string
  value: number
  icon: React.ReactNode
  trend: number
  trendLabel: string
  isNegativeTrendBad?: boolean
}) {
  const isTrendPositive = trend > 0
  const isTrendNegative = trend < 0
  const isTrendGood = isNegativeTrendBad ? isTrendNegative : isTrendPositive
  const isTrendBad = isNegativeTrendBad ? isTrendPositive : isTrendNegative

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-white/70">{title}</p>
          <h4 className="text-2xl font-bold mt-1 text-white">{value}</h4>
        </div>
        <div className="p-2 rounded-full bg-white/5">{icon}</div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          {isTrendPositive && <TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
          {isTrendNegative && <TrendingDown className="h-4 w-4 mr-1 text-red-500" />}
          {trend === 0 && <span className="h-4 w-4 mr-1 text-gray-500">-</span>}

          <span className={`text-sm ${isTrendGood ? "text-green-500" : isTrendBad ? "text-red-500" : "text-gray-500"}`}>
            {isTrendPositive ? "+" : ""}
            {trend} {trendLabel}
          </span>
        </div>
      )}
    </div>
  )
}

function RecentPatientsList() {
  const patients = [
    {
      id: 1,
      firstName: "Priya",
      lastName: "Sharma",
      cancerType: "Glioblastoma",
      stage: "IV",
      status: "active",
      treatmentProgress: 65,
    },
    {
      id: 2,
      firstName: "Arjun",
      lastName: "Patel",
      cancerType: "Lung Carcinoma",
      stage: "III",
      status: "active",
      treatmentProgress: 42,
    },
    {
      id: 3,
      firstName: "Sneha",
      lastName: "Gupta",
      cancerType: "Breast Cancer",
      stage: "II",
      status: "remission",
      treatmentProgress: 100,
    },
    {
      id: 4,
      firstName: "Rajesh",
      lastName: "Kumar",
      cancerType: "Melanoma",
      stage: "III",
      status: "critical",
      treatmentProgress: 28,
    },
    {
      id: 5,
      firstName: "Kavya",
      lastName: "Singh",
      cancerType: "Lymphoma",
      stage: "II",
      status: "active",
      treatmentProgress: 75,
    },
  ]

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <User className="h-5 w-5 text-cyan-500" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">
              {patient.firstName} {patient.lastName}
            </h4>
            <p className="text-sm text-white/70 truncate">
              {patient.cancerType}, Stage {patient.stage}
            </p>
          </div>

          <div className="ml-2">
            <StatusBadge status={patient.status} />
          </div>

          <div className="ml-3 w-16">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${patient.treatmentProgress}%` }} />
            </div>
            <p className="text-xs text-white/50 text-right mt-1">{patient.treatmentProgress}%</p>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full mt-2">
        View All Patients
      </Button>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    active: { color: "bg-green-500", label: "Active" },
    remission: { color: "bg-cyan-500", label: "Remission" },
    critical: { color: "bg-red-500", label: "Critical" },
    deceased: { color: "bg-gray-500", label: "Deceased" },
    inactive: { color: "bg-yellow-500", label: "Inactive" },
  }

  const config = statusConfig[status] || { color: "bg-gray-500", label: status }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

function AIInsightsTimeline() {
  const insights = [
    {
      id: 1,
      title: "Treatment Resistance Detected",
      description:
        "Patient ID #4872 is showing signs of resistance to the current treatment regimen. Consider adjusting the protocol based on the latest genomic analysis.",
      confidence: 0.89,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
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
    },
    {
      id: 2,
      title: "Potential Clinical Trial Match",
      description:
        "Patient ID #3156 matches the criteria for the new quantum-enhanced radiotherapy trial. Genomic profile indicates high likelihood of positive response.",
      confidence: 0.94,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      references: [
        {
          title: "Clinical trial NCT0123456 details",
          url: "#",
        },
      ],
    },
    {
      id: 3,
      title: "Anomaly in Tumor Growth Pattern",
      description:
        "Unusual growth pattern detected in Patient ID #5923's latest scan. The peripheral region shows unexpected metabolic activity that differs from typical progression.",
      confidence: 0.78,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      references: [
        {
          title: "Research on atypical growth patterns in brain tumors",
          url: "#",
        },
        {
          title: "Imaging guidelines for unusual metabolic activity",
          url: "#",
        },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div key={insight.id} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-cyan-500" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-white">{insight.title}</h4>
              <div className="flex items-center">
                <div className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-500 mr-2">
                  {(insight.confidence * 100).toFixed(0)}% confidence
                </div>
                <span className="text-xs text-white/50">{formatTimeAgo(new Date(insight.timestamp))}</span>
              </div>
            </div>

            <p className="mt-1 text-white/80">{insight.description}</p>

            {insight.references && insight.references.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-white/50">References:</p>
                <ul className="list-disc list-inside text-xs text-white/70 mt-1">
                  {insight.references.map((ref, i) => (
                    <li key={i}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3 flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8">
                <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <ThumbsDown className="h-3 w-3 mr-1" /> Not Helpful
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
}

function SystemStatus() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="grid items-start">
          <div className="text-sm flex items-start md:items-center gap-4 p-4 border rounded-lg">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <Network className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div>
                <span className="font-medium">Status</span>: Connected
              </div>
              <div className="text-xs text-muted-foreground">All systems operational.</div>
            </div>
          </div>
          <div className="text-sm flex items-start md:items-center gap-4 p-4 rounded-lg">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div>
                <span className="font-medium">Connectivity</span>: Excellent
              </div>
              <div className="text-xs text-muted-foreground">
                Your connection to the quantum processing unit is stable.
              </div>
            </div>
          </div>
          <div className="text-sm flex items-start md:items-center gap-4 p-4 rounded-lg">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div>
                <span className="font-medium">Processing</span>: 4 Jobs Running
              </div>
              <div className="text-xs text-muted-foreground">ML model training in progress.</div>
            </div>
          </div>
          <div className="text-sm flex items-start md:items-center gap-4 p-4 rounded-lg">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <Activity className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div>
                <span className="font-medium">System Load</span>: 42%
              </div>
              <div className="text-xs text-muted-foreground">System resources are being utilized efficiently.</div>
            </div>
          </div>
          <div className="text-sm flex items-start md:items-center gap-4 p-4 rounded-lg">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <GalleryHorizontalEnd className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div>
                <span className="font-medium">Storage</span>: 1.2TB Used (24%)
              </div>
              <div className="text-xs text-muted-foreground">Plenty of storage available for patient data.</div>
            </div>
          </div>
          <div className="text-sm flex items-start md:items-center gap-4 p-4 rounded-lg">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <Microscope className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div>
                <span className="font-medium">AI Models</span>: Up to Date
              </div>
              <div className="text-xs text-muted-foreground">All models are running the latest version.</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
