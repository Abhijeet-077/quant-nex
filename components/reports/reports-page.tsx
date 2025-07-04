"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  LineChart,
  Loader2,
  PieChart,
  Plus,
  Search,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "../layout/main-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportButton } from "@/components/ui/export-button"
import { useToast } from "@/components/ui/use-toast"

export function ReportsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState("last-30-days")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate search
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleShare = () => {
    toast({
      title: "Share functionality",
      description: "Report sharing link copied to clipboard!",
    })
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Report generated",
        description: "New report has been generated successfully!",
      })
    }, 2000)
  }

  // Mock report data
  const reports = [
    {
      id: "R-1001",
      title: "Monthly Patient Summary",
      type: "patient",
      date: "2025-05-01",
      author: "Dr. Rajesh Sharma",
      description: "Summary of all patient activities and outcomes for the month of April 2025.",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "R-1002",
      title: "Treatment Efficacy Analysis",
      type: "treatment",
      date: "2025-04-28",
      author: "Dr. Priya Patel",
      description: "Comparative analysis of treatment efficacy across different cancer types and stages.",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      id: "R-1003",
      title: "Patient Demographics Report",
      type: "patient",
      date: "2025-04-25",
      author: "Dr. Sneha Singh",
      description: "Demographic breakdown of patient population by age, gender, cancer type, and stage.",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      id: "R-1004",
      title: "Quantum Algorithm Performance",
      type: "research",
      date: "2025-04-22",
      author: "Dr. Arjun Kumar",
      description: "Analysis of quantum algorithm performance in treatment optimization compared to classical methods.",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "R-1005",
      title: "AI Model Accuracy Report",
      type: "ai",
      date: "2025-04-20",
      author: "Dr. Kavya Reddy",
      description: "Evaluation of AI model accuracy in cancer detection and classification.",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      id: "R-1006",
      title: "Survival Rate Analysis",
      type: "outcome",
      date: "2025-04-18",
      author: "Dr. Vikram Agarwal",
      description: "Analysis of 5-year survival rates by cancer type, stage, and treatment approach.",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      id: "R-1007",
      title: "Side Effect Incidence Report",
      type: "treatment",
      date: "2025-04-15",
      author: "Dr. Ananya Iyer",
      description: "Incidence and severity of treatment side effects across different protocols.",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "R-1008",
      title: "Research Publication Summary",
      type: "research",
      date: "2025-04-12",
      author: "Dr. Suresh Nair",
      description: "Summary of recent research publications and findings relevant to oncology practice.",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  // Filter reports based on search query and type filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || report.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold"><span>Reports</span></h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              <span>Share</span>
            </Button>
            <ExportButton
              pageType="reports"
              data={reports}
              variant="outline"
              size="sm"
              customTitle="Medical Reports Summary"
            />
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              <span>{isGenerating ? "Generating..." : "Generate Report"}</span>
            </Button>
          </div>
        </div>

        <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports by title, description, or author..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Search</span>}
              </Button>
            </form>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400"><span>Type:</span></span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all"><span>All Reports</span></SelectItem>
                    <SelectItem value="patient"><span>Patient</span></SelectItem>
                    <SelectItem value="treatment"><span>Treatment</span></SelectItem>
                    <SelectItem value="outcome"><span>Outcome</span></SelectItem>
                    <SelectItem value="research"><span>Research</span></SelectItem>
                    <SelectItem value="ai"><span>AI</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400"><span>Period:</span></span>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days"><span>Last 7 Days</span></SelectItem>
                    <SelectItem value="last-30-days"><span>Last 30 Days</span></SelectItem>
                    <SelectItem value="last-90-days"><span>Last 90 Days</span></SelectItem>
                    <SelectItem value="last-year"><span>Last Year</span></SelectItem>
                    <SelectItem value="all-time"><span>All Time</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all"><span>All Reports</span></TabsTrigger>
              <TabsTrigger value="patient"><span>Patient</span></TabsTrigger>
              <TabsTrigger value="treatment"><span>Treatment</span></TabsTrigger>
              <TabsTrigger value="research"><span>Research</span></TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.length === 0 ? (
                  <div className="col-span-3 p-6 text-center text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>No reports found matching your search criteria.</p>
                  </div>
                ) : (
                  filteredReports.map((report) => <ReportCard key={report.id} report={report} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="patient" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.filter((report) => report.type === "patient").length === 0 ? (
                  <div className="col-span-3 p-6 text-center text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>No patient reports found matching your search criteria.</p>
                  </div>
                ) : (
                  filteredReports
                    .filter((report) => report.type === "patient")
                    .map((report) => <ReportCard key={report.id} report={report} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.filter((report) => report.type === "treatment").length === 0 ? (
                  <div className="col-span-3 p-6 text-center text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>No treatment reports found matching your search criteria.</p>
                  </div>
                ) : (
                  filteredReports
                    .filter((report) => report.type === "treatment")
                    .map((report) => <ReportCard key={report.id} report={report} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.filter((report) => report.type === "research").length === 0 ? (
                  <div className="col-span-3 p-6 text-center text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>No research reports found matching your search criteria.</p>
                  </div>
                ) : (
                  filteredReports
                    .filter((report) => report.type === "research")
                    .map((report) => <ReportCard key={report.id} report={report} />)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Report ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((report) => (
                    <tr key={report.id} className="border-b border-gray-800 hover:bg-black/20">
                      <td className="px-4 py-4 text-sm">{report.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                            {report.icon}
                          </div>
                          <div className="font-medium">{report.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm capitalize">{report.type}</td>
                      <td className="px-4 py-4 text-sm">{report.date}</td>
                      <td className="px-4 py-4 text-sm">{report.author}</td>
                      <td className="px-4 py-4 text-sm">
                        <ExportButton
                          pageType="reports"
                          data={[report]}
                          variant="outline"
                          size="sm"
                          customTitle={report.title}
                          customFilename={`${report.id}_${report.title.replace(/\s+/g, '_')}`}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Report Categories</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4 text-cyan-500" />
                  </div>
                  <span className="text-white">Patient Reports</span>
                </div>
                <span className="text-sm text-gray-400">
                  {reports.filter((r) => r.type === "patient").length} reports
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <LineChart className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-white">Treatment Reports</span>
                </div>
                <span className="text-sm text-gray-400">
                  {reports.filter((r) => r.type === "treatment").length} reports
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                    <PieChart className="h-4 w-4 text-pink-500" />
                  </div>
                  <span className="text-white">Outcome Reports</span>
                </div>
                <span className="text-sm text-gray-400">
                  {reports.filter((r) => r.type === "outcome").length} reports
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-white">Research Reports</span>
                </div>
                <span className="text-sm text-gray-400">
                  {reports.filter((r) => r.type === "research").length} reports
                </span>
              </div>
            </div>
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Report Templates</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <span className="text-white block">Patient Summary</span>
                    <span className="text-xs text-gray-400">Comprehensive patient status report</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <LineChart className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-white block">Treatment Efficacy</span>
                    <span className="text-xs text-gray-400">Analysis of treatment outcomes</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                    <PieChart className="h-4 w-4 text-pink-500" />
                  </div>
                  <div>
                    <span className="text-white block">Demographic Analysis</span>
                    <span className="text-xs text-gray-400">Patient population breakdown</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <span className="text-white block">Research Summary</span>
                    <span className="text-xs text-gray-400">Summary of research findings</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Use
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function ReportCard({ report }: { report: any }) {
  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    patient: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-500",
      border: "border-cyan-500/20",
    },
    treatment: {
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/20",
    },
    outcome: {
      bg: "bg-pink-500/10",
      text: "text-pink-500",
      border: "border-pink-500/20",
    },
    research: {
      bg: "bg-green-500/10",
      text: "text-green-500",
      border: "border-green-500/20",
    },
    ai: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
  }

  const typeColor = typeColorMap[report.type] || {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    border: "border-gray-500/20",
  }

  return (
    <Card className="bg-black/20 border-white/10 hover:border-white/20 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className={`w-10 h-10 rounded-full ${typeColor.bg} flex items-center justify-center`}>{report.icon}</div>
          <div className={`px-2 py-1 text-xs rounded-full ${typeColor.bg} ${typeColor.text} capitalize`}>
            {report.type}
          </div>
        </div>
        <CardTitle className="mt-2">{report.title}</CardTitle>
        <CardDescription className="text-gray-400">
          {report.date} • {report.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 mb-4">{report.description}</p>
        <div className="flex justify-end">
          <ExportButton
            pageType="reports"
            data={[report]}
            variant="outline"
            size="sm"
            customTitle={report.title}
            customFilename={`${report.id}_${report.title.replace(/\s+/g, '_')}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
