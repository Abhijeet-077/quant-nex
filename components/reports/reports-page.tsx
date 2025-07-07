"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Share2, Calendar, TrendingUp, BarChart3, Filter, Search, Plus, Eye } from "lucide-react"

interface Report {
  id: string
  title: string
  type: "patient" | "treatment" | "outcome" | "research" | "administrative"
  status: "draft" | "completed" | "published" | "archived"
  createdDate: string
  lastModified: string
  author: string
  description: string
  tags: string[]
  downloadCount: number
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const [reports] = useState<Report[]>([
    {
      id: "1",
      title: "Glioblastoma Treatment Outcomes Q4 2023",
      type: "outcome",
      status: "completed",
      createdDate: "2024-01-15",
      lastModified: "2024-01-18",
      author: "Dr. Rajesh Sharma",
      description:
        "Comprehensive analysis of glioblastoma treatment outcomes for Q4 2023, including survival rates and treatment efficacy.",
      tags: ["glioblastoma", "outcomes", "Q4-2023", "survival"],
      downloadCount: 45,
    },
    {
      id: "2",
      title: "Patient Demographics and Risk Factors Analysis",
      type: "patient",
      status: "completed",
      createdDate: "2024-01-10",
      lastModified: "2024-01-12",
      author: "Dr. Priya Patel",
      description:
        "Statistical analysis of patient demographics and associated risk factors for brain tumors in Indian population.",
      tags: ["demographics", "risk-factors", "statistics", "indian-population"],
      downloadCount: 32,
    },
    {
      id: "3",
      title: "Radiation Therapy Effectiveness Study",
      type: "treatment",
      status: "draft",
      createdDate: "2024-01-08",
      lastModified: "2024-01-20",
      author: "Dr. Amit Singh",
      description:
        "Ongoing study on the effectiveness of different radiation therapy protocols for various brain tumor types.",
      tags: ["radiation", "therapy", "effectiveness", "protocols"],
      downloadCount: 0,
    },
    {
      id: "4",
      title: "AI Diagnosis Accuracy Report",
      type: "research",
      status: "published",
      createdDate: "2024-01-05",
      lastModified: "2024-01-15",
      author: "Dr. Sunita Gupta",
      description: "Research report on AI-powered diagnosis accuracy compared to traditional diagnostic methods.",
      tags: ["AI", "diagnosis", "accuracy", "research", "comparison"],
      downloadCount: 78,
    },
    {
      id: "5",
      title: "Monthly Administrative Summary - January 2024",
      type: "administrative",
      status: "completed",
      createdDate: "2024-01-31",
      lastModified: "2024-01-31",
      author: "Admin Team",
      description: "Monthly summary of administrative activities, patient statistics, and operational metrics.",
      tags: ["administrative", "monthly", "january-2024", "statistics"],
      downloadCount: 12,
    },
    {
      id: "6",
      title: "Immunotherapy Clinical Trial Results",
      type: "research",
      status: "completed",
      createdDate: "2024-01-20",
      lastModified: "2024-01-22",
      author: "Dr. Mohammed Ali",
      description: "Results from Phase II clinical trial of novel immunotherapy approach for recurrent glioblastoma.",
      tags: ["immunotherapy", "clinical-trial", "phase-II", "glioblastoma"],
      downloadCount: 56,
    },
  ])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || report.type === filterType
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "published":
        return "bg-blue-500"
      case "draft":
        return "bg-yellow-500"
      case "archived":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "patient":
        return "text-blue-400"
      case "treatment":
        return "text-green-400"
      case "outcome":
        return "text-purple-400"
      case "research":
        return "text-orange-400"
      case "administrative":
        return "text-gray-400"
      default:
        return "text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "patient":
        return "👤"
      case "treatment":
        return "💊"
      case "outcome":
        return "📊"
      case "research":
        return "🔬"
      case "administrative":
        return "📋"
      default:
        return "📄"
    }
  }

  const getReportsByType = (type: string) => {
    return reports.filter((report) => report.type === type).length
  }

  const getReportsByStatus = (status: string) => {
    return reports.filter((report) => report.status === status).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <FileText className="h-8 w-8" />
              Reports & Analytics
            </h1>
            <p className="text-gray-300 mt-2">Comprehensive reporting and data analysis dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glow-hover bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
            <Button className="btn-glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-400 mb-1">{reports.length}</div>
              <p className="text-sm text-gray-400">Total Reports</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{getReportsByStatus("completed")}</div>
              <p className="text-sm text-gray-400">Completed</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{getReportsByStatus("published")}</div>
              <p className="text-sm text-gray-400">Published</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{getReportsByStatus("draft")}</div>
              <p className="text-sm text-gray-400">In Progress</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">{getReportsByType("research")}</div>
              <p className="text-sm text-gray-400">Research</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-teal-900/20 border-teal-500/30"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="patient">Patient Reports</SelectItem>
                  <SelectItem value="treatment">Treatment Reports</SelectItem>
                  <SelectItem value="outcome">Outcome Reports</SelectItem>
                  <SelectItem value="research">Research Reports</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-teal-900/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-600">
              All Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-teal-600">
              Templates
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-teal-600">
              Scheduled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Report Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/15 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getTypeIcon(report.type)}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{report.title}</h3>
                            <p className="text-sm text-gray-300 mb-2">{report.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {report.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadge(report.status)}>{report.status}</Badge>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <p className={`font-medium capitalize ${getTypeColor(report.type)}`}>{report.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Author:</span>
                          <p className="text-white">{report.author}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Created:</span>
                          <p className="text-white">{new Date(report.createdDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Downloads:</span>
                          <p className="text-white">{report.downloadCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Report Generation Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                      <span className="text-sm text-gray-300">Patient Reports</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-sm text-white">60%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                      <span className="text-sm text-gray-300">Treatment Reports</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <span className="text-sm text-white">45%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                      <span className="text-sm text-gray-300">Research Reports</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <span className="text-sm text-white">75%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                      <span className="text-sm text-gray-300">Outcome Reports</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                        </div>
                        <span className="text-sm text-white">55%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-teal-900/20">
                      <div className="text-2xl font-bold text-teal-400 mb-1">223</div>
                      <p className="text-xs text-gray-400">Total Downloads</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-teal-900/20">
                      <div className="text-2xl font-bold text-green-400 mb-1">89%</div>
                      <p className="text-xs text-gray-400">Completion Rate</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Report Quality Score</span>
                        <span className="text-teal-400">4.7/5.0</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">User Satisfaction</span>
                        <span className="text-green-400">92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Timeliness</span>
                        <span className="text-blue-400">87%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Report Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Patient Summary Template</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Comprehensive patient summary including diagnosis, treatment plan, and progress notes.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Use Template
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Treatment Outcome Report</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Standardized template for documenting treatment outcomes and effectiveness metrics.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Use Template
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Research Study Report</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Template for clinical research studies with statistical analysis sections.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Use Template
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Monthly Statistics Report</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Monthly operational statistics and key performance indicators template.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Use Template
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Quality Assurance Report</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Quality assurance and compliance reporting template for regulatory requirements.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Use Template
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Custom Report Builder</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Create custom report templates with drag-and-drop components and fields.
                    </p>
                    <Button className="w-full btn-glow-primary">Create Custom</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Scheduled Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Weekly Patient Summary</h3>
                        <p className="text-sm text-gray-400">Every Monday at 9:00 AM</p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Automated weekly summary of all patient activities and status updates.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Edit Schedule
                      </Button>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        View Last Report
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Monthly Outcome Analysis</h3>
                        <p className="text-sm text-gray-400">First day of each month at 8:00 AM</p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Monthly analysis of treatment outcomes and effectiveness metrics.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Edit Schedule
                      </Button>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        View Last Report
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Quarterly Research Summary</h3>
                        <p className="text-sm text-gray-400">End of each quarter at 10:00 AM</p>
                      </div>
                      <Badge variant="secondary">Paused</Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Quarterly summary of all research activities and findings.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Resume Schedule
                      </Button>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        View Last Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
