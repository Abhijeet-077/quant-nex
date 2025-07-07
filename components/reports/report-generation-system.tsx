"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Download,
  Printer,
  Mail,
  Share2,
  Calendar,
  User,
  Activity,
  BarChart3,
  Image,
  FileImage,
  File,
  BarChart3 as FileSpreadsheet,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface ReportSection {
  id: string
  name: string
  description: string
  included: boolean
  required: boolean
  icon: React.ReactNode
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: string[]
  format: "pdf" | "docx" | "html"
  category: "clinical" | "research" | "administrative"
}

interface GeneratedReport {
  id: string
  name: string
  type: string
  generatedAt: string
  size: string
  status: "generating" | "ready" | "failed"
  downloadUrl?: string
}

export function ReportGenerationSystem() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("comprehensive")
  const [reportSections, setReportSections] = useState<ReportSection[]>([
    {
      id: "patient_info",
      name: "Patient Information",
      description: "Demographics, medical history, and contact details",
      included: true,
      required: true,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "diagnosis",
      name: "Diagnosis Summary",
      description: "Current diagnosis, staging, and pathology results",
      included: true,
      required: true,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: "imaging",
      name: "Medical Imaging",
      description: "MRI, CT scans, and other imaging studies",
      included: true,
      required: false,
      icon: <Image className="h-4 w-4" />,
    },
    {
      id: "treatment_plan",
      name: "Treatment Plan",
      description: "Current and planned treatments, medications",
      included: true,
      required: false,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "progress",
      name: "Treatment Progress",
      description: "Response to treatment, side effects, outcomes",
      included: true,
      required: false,
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "prognosis",
      name: "Prognosis & Risk Assessment",
      description: "Survival analysis, risk factors, predictions",
      included: false,
      required: false,
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "lab_results",
      name: "Laboratory Results",
      description: "Blood work, biomarkers, genetic testing",
      included: false,
      required: false,
      icon: <FileText className="h-4 w-4" />,
    },
  ])

  const [reportTemplates] = useState<ReportTemplate[]>([
    {
      id: "comprehensive",
      name: "Comprehensive Medical Report",
      description: "Complete patient report with all available data",
      sections: ["patient_info", "diagnosis", "imaging", "treatment_plan", "progress", "prognosis"],
      format: "pdf",
      category: "clinical",
    },
    {
      id: "treatment_summary",
      name: "Treatment Summary",
      description: "Focus on treatment plans and progress",
      sections: ["patient_info", "treatment_plan", "progress"],
      format: "pdf",
      category: "clinical",
    },
    {
      id: "imaging_report",
      name: "Imaging Report",
      description: "Detailed imaging analysis and findings",
      sections: ["patient_info", "diagnosis", "imaging"],
      format: "pdf",
      category: "clinical",
    },
    {
      id: "research_data",
      name: "Research Data Export",
      description: "Anonymized data for research purposes",
      sections: ["diagnosis", "treatment_plan", "progress", "lab_results"],
      format: "docx",
      category: "research",
    },
  ])

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: "report1",
      name: "Comprehensive Report - Rajesh Kumar",
      type: "Comprehensive Medical Report",
      generatedAt: "2024-02-20 14:30",
      size: "2.4 MB",
      status: "ready",
      downloadUrl: "/reports/comprehensive-rajesh-kumar.pdf",
    },
    {
      id: "report2",
      name: "Treatment Summary - Priya Sharma",
      type: "Treatment Summary",
      generatedAt: "2024-02-20 13:15",
      size: "1.1 MB",
      status: "ready",
      downloadUrl: "/reports/treatment-summary-priya-sharma.pdf",
    },
    {
      id: "report3",
      name: "Imaging Report - Amit Singh",
      type: "Imaging Report",
      generatedAt: "2024-02-20 12:45",
      size: "3.7 MB",
      status: "generating",
    },
  ])

  const [isGenerating, setIsGenerating] = useState(false)
  const [reportTitle, setReportTitle] = useState("")
  const [reportNotes, setReportNotes] = useState("")

  const toggleSection = (sectionId: string) => {
    setReportSections(prev => prev.map(section => 
      section.id === sectionId && !section.required
        ? { ...section, included: !section.included }
        : section
    ))
  }

  const selectTemplate = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId)
    if (!template) return

    setSelectedTemplate(templateId)
    setReportSections(prev => prev.map(section => ({
      ...section,
      included: section.required || template.sections.includes(section.id)
    })))
  }

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `report${Date.now()}`,
        name: reportTitle || `${reportTemplates.find(t => t.id === selectedTemplate)?.name} - ${new Date().toLocaleDateString()}`,
        type: reportTemplates.find(t => t.id === selectedTemplate)?.name || "Custom Report",
        generatedAt: new Date().toLocaleString(),
        size: "1.8 MB",
        status: "ready",
        downloadUrl: `/reports/generated-${Date.now()}.pdf`,
      }

      setGeneratedReports(prev => [newReport, ...prev])
      setIsGenerating(false)
      setReportTitle("")
      setReportNotes("")
    }, 3000)
  }

  const downloadReport = (report: GeneratedReport) => {
    if (report.status === "ready") {
      // Create a mock PDF content
      const reportContent = {
        title: report.name,
        generatedAt: report.generatedAt,
        type: report.type,
        sections: reportSections.filter(s => s.included),
        notes: reportNotes || "No additional notes",
      }

      const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${report.name.replace(/\s+/g, "_")}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle className="h-4 w-4 text-green-400" />
      case "generating": return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf": return <File className="h-4 w-4 text-red-400" />
      case "docx": return <FileText className="h-4 w-4 text-blue-400" />
      case "xlsx": return <FileSpreadsheet className="h-4 w-4 text-green-400" />
      default: return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-teal-400 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Report Generation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {generatedReports.filter(r => r.status === "ready").length}
              </div>
              <p className="text-sm text-gray-400">Ready Reports</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {generatedReports.filter(r => r.status === "generating").length}
              </div>
              <p className="text-sm text-gray-400">Generating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {reportSections.filter(s => s.included).length}
              </div>
              <p className="text-sm text-gray-400">Selected Sections</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {reportTemplates.length}
              </div>
              <p className="text-sm text-gray-400">Available Templates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Configure Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-teal-900/20 mb-6">
                  <TabsTrigger value="templates" className="data-[state=active]:bg-teal-600">
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="data-[state=active]:bg-teal-600">
                    Custom
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? "border-teal-400 bg-teal-900/20"
                            : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                        }`}
                        onClick={() => selectTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-medium">{template.name}</h4>
                            <div className="flex items-center gap-1">
                              {getFormatIcon(template.format)}
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                          <div className="text-xs text-gray-400">
                            {template.sections.length} sections included
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Report Title</label>
                      <Input
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="Enter custom report title"
                        className="bg-slate-800/50 border-slate-700/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Additional Notes</label>
                      <Textarea
                        value={reportNotes}
                        onChange={(e) => setReportNotes(e.target.value)}
                        placeholder="Add any additional notes or instructions"
                        className="bg-slate-800/50 border-slate-700/50"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Section Selection */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-4">Report Sections</h3>
                <div className="space-y-3">
                  {reportSections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30"
                    >
                      <Checkbox
                        checked={section.included}
                        onCheckedChange={() => toggleSection(section.id)}
                        disabled={section.required}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        {section.icon}
                        <div>
                          <div className="text-white font-medium text-sm">{section.name}</div>
                          <div className="text-gray-400 text-xs">{section.description}</div>
                        </div>
                      </div>
                      {section.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-6 flex items-center gap-4">
                <Button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="btn-glow-primary flex-1"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
                <Button variant="outline" className="glow-hover bg-transparent">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Reports */}
        <div className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{report.name}</h4>
                        <p className="text-xs text-gray-400">{report.type}</p>
                      </div>
                      {getStatusIcon(report.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                      <div>Generated: {report.generatedAt}</div>
                      <div>Size: {report.size}</div>
                    </div>
                    {report.status === "ready" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => downloadReport(report)}
                          className="btn-glow-accent flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {report.status === "generating" && (
                      <div className="space-y-2">
                        <Progress value={65} className="h-1" />
                        <p className="text-xs text-gray-400">Processing sections...</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
