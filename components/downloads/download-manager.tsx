"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Download,
  FileText,
  Image,
  BarChart3,
  Archive,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Folder,
  File,
  Share2,
} from "lucide-react"

interface DownloadItem {
  id: string
  name: string
  type: "report" | "image" | "chart" | "data" | "archive"
  size: string
  format: string
  status: "completed" | "downloading" | "failed" | "queued"
  progress: number
  downloadedAt?: string
  url?: string
  category: string
  description?: string
}

interface DownloadCategory {
  id: string
  name: string
  count: number
  icon: React.ReactNode
  color: string
}

export function DownloadManager() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: "dl1",
      name: "Comprehensive Medical Report - Rajesh Kumar",
      type: "report",
      size: "2.4 MB",
      format: "PDF",
      status: "completed",
      progress: 100,
      downloadedAt: "2024-02-20 14:30",
      url: "/downloads/comprehensive-report-rajesh.pdf",
      category: "Medical Reports",
      description: "Complete patient medical report with diagnosis and treatment plan",
    },
    {
      id: "dl2",
      name: "Brain MRI Scan - Axial View",
      type: "image",
      size: "15.7 MB",
      format: "DICOM",
      status: "completed",
      progress: 100,
      downloadedAt: "2024-02-20 13:45",
      url: "/downloads/brain-mri-axial.dcm",
      category: "Medical Imaging",
      description: "High-resolution MRI scan showing tumor location",
    },
    {
      id: "dl3",
      name: "Treatment Progress Chart",
      type: "chart",
      size: "1.2 MB",
      format: "PNG",
      status: "completed",
      progress: 100,
      downloadedAt: "2024-02-20 12:15",
      url: "/downloads/treatment-progress-chart.png",
      category: "Analytics",
      description: "Visual representation of treatment response over time",
    },
    {
      id: "dl4",
      name: "Patient Data Export",
      type: "data",
      size: "856 KB",
      format: "CSV",
      status: "downloading",
      progress: 65,
      category: "Data Export",
      description: "Anonymized patient data for research purposes",
    },
    {
      id: "dl5",
      name: "Complete Case Archive",
      type: "archive",
      size: "45.2 MB",
      format: "ZIP",
      status: "queued",
      progress: 0,
      category: "Archives",
      description: "Complete case files including all reports and images",
    },
  ])

  const categories: DownloadCategory[] = [
    {
      id: "all",
      name: "All Downloads",
      count: downloads.length,
      icon: <Download className="h-4 w-4" />,
      color: "text-blue-400",
    },
    {
      id: "reports",
      name: "Medical Reports",
      count: downloads.filter(d => d.type === "report").length,
      icon: <FileText className="h-4 w-4" />,
      color: "text-green-400",
    },
    {
      id: "images",
      name: "Medical Images",
      count: downloads.filter(d => d.type === "image").length,
      icon: <Image className="h-4 w-4" />,
      color: "text-purple-400",
    },
    {
      id: "charts",
      name: "Charts & Analytics",
      count: downloads.filter(d => d.type === "chart").length,
      icon: <BarChart3 className="h-4 w-4" />,
      color: "text-yellow-400",
    },
    {
      id: "archives",
      name: "Archives",
      count: downloads.filter(d => d.type === "archive").length,
      icon: <Archive className="h-4 w-4" />,
      color: "text-red-400",
    },
  ]

  const filteredDownloads = downloads.filter(download => {
    const matchesSearch = download.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || 
                      (activeTab === "reports" && download.type === "report") ||
                      (activeTab === "images" && download.type === "image") ||
                      (activeTab === "charts" && download.type === "chart") ||
                      (activeTab === "archives" && download.type === "archive")
    
    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-400" />
      case "downloading": return <Clock className="h-4 w-4 text-blue-400 animate-spin" />
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "queued": return <Clock className="h-4 w-4 text-yellow-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "report": return <FileText className="h-4 w-4 text-green-400" />
      case "image": return <Image className="h-4 w-4 text-purple-400" />
      case "chart": return <BarChart3 className="h-4 w-4 text-yellow-400" />
      case "data": return <File className="h-4 w-4 text-blue-400" />
      case "archive": return <Archive className="h-4 w-4 text-red-400" />
      default: return <File className="h-4 w-4 text-gray-400" />
    }
  }

  const handleDownload = (item: DownloadItem) => {
    if (item.status === "completed" && item.url) {
      // Create a mock download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `${item.name}.${item.format.toLowerCase()}`
      link.click()
      console.log(`Downloading: ${item.name}`)
    } else if (item.status === "queued") {
      // Start download
      setDownloads(prev => prev.map(d => 
        d.id === item.id ? { ...d, status: "downloading", progress: 0 } : d
      ))
      
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloads(prev => prev.map(d => {
          if (d.id === item.id && d.status === "downloading") {
            const newProgress = Math.min(d.progress + 10, 100)
            return {
              ...d,
              progress: newProgress,
              status: newProgress === 100 ? "completed" : "downloading",
              downloadedAt: newProgress === 100 ? new Date().toLocaleString() : undefined,
              url: newProgress === 100 ? `/downloads/${item.name.toLowerCase().replace(/\s+/g, '-')}.${item.format.toLowerCase()}` : undefined,
            }
          }
          return d
        }))
      }, 500)

      setTimeout(() => clearInterval(interval), 5000)
    }
  }

  const handleBulkDownload = () => {
    const selectedDownloads = downloads.filter(d => selectedItems.includes(d.id) && d.status === "completed")
    if (selectedDownloads.length > 0) {
      console.log(`Bulk downloading ${selectedDownloads.length} items`)
      // In a real app, this would create a ZIP file with all selected items
    }
  }

  const deleteDownload = (itemId: string) => {
    setDownloads(prev => prev.filter(d => d.id !== itemId))
    setSelectedItems(prev => prev.filter(id => id !== itemId))
  }

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const getTotalSize = () => {
    return downloads
      .filter(d => d.status === "completed")
      .reduce((total, d) => {
        const size = parseFloat(d.size)
        const unit = d.size.split(' ')[1]
        const multiplier = unit === "GB" ? 1024 : unit === "KB" ? 0.001 : 1
        return total + (size * multiplier)
      }, 0)
      .toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Download className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{downloads.length}</div>
            <p className="text-sm text-gray-400">Total Downloads</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">
              {downloads.filter(d => d.status === "completed").length}
            </div>
            <p className="text-sm text-gray-400">Completed</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Archive className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{getTotalSize()} MB</div>
            <p className="text-sm text-gray-400">Total Size</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">
              {downloads.filter(d => d.status === "downloading" || d.status === "queued").length}
            </div>
            <p className="text-sm text-gray-400">In Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleBulkDownload}
                  className="btn-glow-accent"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Download Selected ({selectedItems.length})
                </Button>
              )}
              <Button size="sm" variant="outline" className="glow-hover bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-teal-900/20 mb-6">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-teal-600 text-xs"
                >
                  <div className="flex items-center gap-1">
                    <span className={category.color}>{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                    <Badge variant="secondary" className="text-xs ml-1">
                      {category.count}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredDownloads.map((item) => (
                <Card
                  key={item.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.format}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className="text-xs text-gray-400 capitalize">{item.status}</span>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-400">Size:</span>
                            <div className="text-white">{item.size}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Category:</span>
                            <div className="text-white">{item.category}</div>
                          </div>
                          {item.downloadedAt && (
                            <div>
                              <span className="text-gray-400">Downloaded:</span>
                              <div className="text-white">{item.downloadedAt}</div>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <div className="text-white capitalize">{item.status}</div>
                          </div>
                        </div>

                        {item.status === "downloading" && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Progress:</span>
                              <span className="text-white">{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(item)}
                            disabled={item.status === "downloading" || item.status === "failed"}
                            className={
                              item.status === "completed"
                                ? "btn-glow-primary"
                                : item.status === "queued"
                                ? "btn-glow-accent"
                                : ""
                            }
                          >
                            <Download className="h-3 w-3 mr-1" />
                            {item.status === "completed" ? "Download" : 
                             item.status === "queued" ? "Start Download" : 
                             item.status === "downloading" ? "Downloading..." : "Retry"}
                          </Button>
                          
                          {item.status === "completed" && (
                            <Button size="sm" variant="outline" className="text-xs">
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteDownload(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredDownloads.length === 0 && (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No downloads found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
