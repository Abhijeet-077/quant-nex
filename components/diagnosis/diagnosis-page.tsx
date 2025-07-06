"use client"

import type React from "react"

import { useState } from "react"
import {
  BrainCircuit,
  ChevronRight,
  Download,
  FileUp,
  ImagePlus,
  Layers,
  Loader2,
  MessageSquare,
  Microscope,
  Pencil,
  Ruler,
  Share2,
  Sliders,
  ZoomIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { MainLayout } from "../layout/main-layout"

export function DiagnosisPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState([1])
  const [viewMode, setViewMode] = useState("original")
  const [activeTab, setActiveTab] = useState("upload")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSampleSelect = (sample: string) => {
    setSelectedImage(sample)
  }

  const handleAnalyze = () => {
    if (!selectedImage) return

    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      setIsAnalyzed(true)
    }, 2000)
  }

  const handleShare = () => {
    if (!selectedImage) return

    // Create shareable link with analysis results
    const shareData = {
      title: 'Medical Diagnosis Analysis - Quant-NEX',
      text: 'View my medical diagnosis analysis results',
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData).catch(console.error)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Analysis link copied to clipboard!')
    }
  }

  const handleExport = () => {
    if (!selectedImage || !isAnalyzed) return

    // Generate comprehensive report data
    const reportData = {
      timestamp: new Date().toISOString(),
      patientId: "PT-2024-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      analysisResults: {
        confidence: "94.2%",
        classification: "Glioblastoma Grade IV",
        tumorSize: "3.2 cm x 2.8 cm",
        location: "Right frontal lobe",
        recommendations: [
          "Further diagnostic imaging recommended",
          "Biopsy to confirm classification",
          "Consultation with neuro-oncology team"
        ]
      },
      imageData: selectedImage
    }

    // Create and download JSON report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagnosis-report-${reportData.patientId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerateDetailedReport = () => {
    if (!selectedImage || !isAnalyzed) return

    // Generate comprehensive PDF-style report
    const detailedReport = {
      reportId: "RPT-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      timestamp: new Date().toISOString(),
      patientInfo: {
        id: "PT-2024-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: "Patient Name",
        age: "54",
        gender: "Female",
        studyDate: new Date().toLocaleDateString()
      },
      clinicalFindings: {
        primaryDiagnosis: "Glioblastoma Grade IV",
        confidence: "94.2%",
        tumorCharacteristics: {
          size: "3.2 cm x 2.8 cm x 2.1 cm",
          location: "Right frontal lobe",
          enhancement: "Heterogeneous ring enhancement",
          edema: "Moderate perilesional edema",
          massEffect: "Mild midline shift (3mm)"
        },
        differentialDiagnosis: [
          "Glioblastoma multiforme (primary)",
          "Metastatic lesion (secondary)",
          "High-grade astrocytoma"
        ]
      },
      recommendations: [
        "Immediate neurosurgical consultation",
        "MRI with contrast for surgical planning",
        "Tissue biopsy for histopathological confirmation",
        "Molecular profiling (IDH1/2, MGMT methylation)",
        "Multidisciplinary team discussion"
      ],
      followUp: "Urgent - within 24-48 hours",
      reportingPhysician: "Dr. AI Assistant",
      disclaimer: "This AI-generated report requires validation by a qualified radiologist."
    }

    // Create detailed HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detailed Medical Report - ${detailedReport.reportId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .findings { background: #f9f9f9; padding: 15px; border-radius: 5px; }
            .recommendations { background: #e8f4fd; padding: 15px; border-radius: 5px; }
            .disclaimer { background: #fff3cd; padding: 10px; border-radius: 5px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Quant-NEX Medical Diagnosis Report</h1>
            <p><strong>Report ID:</strong> ${detailedReport.reportId}</p>
            <p><strong>Generated:</strong> ${new Date(detailedReport.timestamp).toLocaleString()}</p>
          </div>

          <div class="section">
            <h3>Patient Information</h3>
            <p><strong>Patient ID:</strong> ${detailedReport.patientInfo.id}</p>
            <p><strong>Study Date:</strong> ${detailedReport.patientInfo.studyDate}</p>
          </div>

          <div class="section findings">
            <h3>Clinical Findings</h3>
            <p><strong>Primary Diagnosis:</strong> ${detailedReport.clinicalFindings.primaryDiagnosis}</p>
            <p><strong>Confidence Level:</strong> ${detailedReport.clinicalFindings.confidence}</p>
            <h4>Tumor Characteristics:</h4>
            <ul>
              <li><strong>Size:</strong> ${detailedReport.clinicalFindings.tumorCharacteristics.size}</li>
              <li><strong>Location:</strong> ${detailedReport.clinicalFindings.tumorCharacteristics.location}</li>
              <li><strong>Enhancement:</strong> ${detailedReport.clinicalFindings.tumorCharacteristics.enhancement}</li>
              <li><strong>Edema:</strong> ${detailedReport.clinicalFindings.tumorCharacteristics.edema}</li>
              <li><strong>Mass Effect:</strong> ${detailedReport.clinicalFindings.tumorCharacteristics.massEffect}</li>
            </ul>
          </div>

          <div class="section recommendations">
            <h3>Recommendations</h3>
            <ul>
              ${detailedReport.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            <p><strong>Follow-up:</strong> ${detailedReport.followUp}</p>
          </div>

          <div class="disclaimer">
            <p><strong>Disclaimer:</strong> ${detailedReport.disclaimer}</p>
          </div>
        </body>
      </html>
    `

    // Create and download HTML report
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `detailed-report-${detailedReport.reportId}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show success message
    alert('Detailed report generated and downloaded successfully!')
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-12 gap-6 p-6">
        <div className="col-span-12 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Diagnosis</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={!selectedImage}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!selectedImage || !isAnalyzed}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Medical Imaging</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                View: {viewMode}
              </Button>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Annotate
              </Button>
              <Button variant="outline" size="sm">
                <Ruler className="h-4 w-4 mr-2" />
                Measure
              </Button>
            </div>
          </div>

          {selectedImage ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ZoomIn className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">Zoom: {zoomLevel[0].toFixed(1)}x</span>
                </div>
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                  <TabsList className="grid grid-cols-4 h-8">
                    <TabsTrigger value="original" className="text-xs">
                      Original
                    </TabsTrigger>
                    <TabsTrigger value="segmented" className="text-xs">
                      Segmented
                    </TabsTrigger>
                    <TabsTrigger value="enhanced" className="text-xs">
                      Enhanced
                    </TabsTrigger>
                    <TabsTrigger value="overlay" className="text-xs">
                      AI Overlay
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Slider value={zoomLevel} onValueChange={setZoomLevel} min={1} max={3} step={0.1} className="mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="relative border border-gray-700 rounded-xl overflow-hidden" style={{ height: "400px" }}>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      transform: `scale(${zoomLevel[0]})`,
                      transformOrigin: "center",
                    }}
                  />

                  {isAnalyzed && viewMode === "overlay" && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Simulated tumor detection overlay */}
                      <div
                        className="absolute rounded-full border-2 border-pink-500 bg-pink-500/20"
                        style={{
                          width: "120px",
                          height: "120px",
                          top: "40%",
                          left: "45%",
                          transform: `scale(${zoomLevel[0]})`,
                          transformOrigin: "center",
                        }}
                      />

                      {/* Confidence label */}
                      <div
                        className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded"
                        style={{
                          top: "35%",
                          left: "45%",
                          transform: `scale(${zoomLevel[0]})`,
                          transformOrigin: "center",
                        }}
                      >
                        92% confidence
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative border border-gray-700 rounded-xl overflow-hidden" style={{ height: "400px" }}>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      transform: `scale(${zoomLevel[0]})`,
                      transformOrigin: "center",
                      filter: "hue-rotate(180deg) contrast(1.2)",
                    }}
                  />

                  {isAnalyzed && viewMode === "overlay" && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Simulated tumor detection overlay */}
                      <div
                        className="absolute rounded-full border-2 border-cyan-500 bg-cyan-500/20"
                        style={{
                          width: "120px",
                          height: "120px",
                          top: "40%",
                          left: "45%",
                          transform: `scale(${zoomLevel[0]})`,
                          transformOrigin: "center",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="relative border border-gray-700 rounded-xl overflow-hidden" style={{ height: "200px" }}>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      transform: `scale(${zoomLevel[0]})`,
                      transformOrigin: "center",
                      filter: "saturate(0)",
                    }}
                  />
                </div>

                <div className="relative border border-gray-700 rounded-xl overflow-hidden" style={{ height: "200px" }}>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      transform: `scale(${zoomLevel[0]})`,
                      transformOrigin: "center",
                      filter: "brightness(1.2) contrast(1.5)",
                    }}
                  />
                </div>

                <div className="relative border border-gray-700 rounded-xl overflow-hidden" style={{ height: "200px" }}>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      transform: `scale(${zoomLevel[0]})`,
                      transformOrigin: "center",
                      filter: "hue-rotate(90deg) saturate(1.5)",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                  <TabsTrigger value="upload">
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload Image
                  </TabsTrigger>
                  <TabsTrigger value="samples">
                    <Layers className="h-4 w-4 mr-2" />
                    Sample Images
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isProcessing}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <ImagePlus className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-300 mb-2">Drag and drop an image or click to browse</p>
                      <p className="text-gray-500 text-sm">Supported formats: JPEG, PNG, DICOM</p>
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="samples">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { src: "/medical-scan-1.jpeg", label: "Brain MRI Scan" },
                      { src: "/medical-scan-2.jpeg", label: "CT Scan" },
                      { src: "/medical-scan-3.jpeg", label: "X-Ray Image" }
                    ].map((sample, index) => (
                      <div
                        key={index}
                        className="border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-purple-500 transition-colors group"
                        onClick={() => handleSampleSelect(sample.src)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={sample.src}
                            alt={sample.label}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-3 text-center">
                          <p className="text-sm text-gray-300 font-medium">{sample.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>

            {isAnalyzed ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Detection</h4>
                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                      <span className="text-gray-200">Malignant Tumor</span>
                    </div>
                    <span className="text-pink-500 font-semibold">92%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Classification</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-gray-200">Type</span>
                      <span className="text-cyan-400 font-semibold">Glioblastoma</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-gray-200">Grade</span>
                      <span className="text-cyan-400 font-semibold">IV</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-gray-200">Size</span>
                      <span className="text-cyan-400 font-semibold">3.2 cm</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Further diagnostic imaging recommended</li>
                    <li>Biopsy to confirm classification</li>
                    <li>Consultation with neuro-oncology team</li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  onClick={handleGenerateDetailedReport}
                  disabled={!isAnalyzed}
                >
                  Generate Detailed Report
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">
                  {selectedImage
                    ? "Click 'Analyze Image' to start AI-powered detection"
                    : "Upload or select an image to begin analysis"}
                </p>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleAnalyze}
                  disabled={isProcessing || !selectedImage}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">Similar Cases</h3>

            {isAnalyzed ? (
              <div className="space-y-3">
                {[1, 2, 3].map((caseNum) => (
                  <div
                    key={caseNum}
                    className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=48&width=48`}
                          alt={`Case ${caseNum}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-white">Case #{1000 + caseNum}</h4>
                      <p className="text-sm text-white/70">Glioblastoma, Grade IV, 89% match</p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-2">
                  View All Similar Cases
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <Microscope className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-500">Similar cases will appear here after analysis</p>
              </div>
            )}
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">Collaboration</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-2">
                    <MessageSquare className="h-4 w-4 text-cyan-500" />
                  </div>
                  <span className="text-white">Discussion Thread</span>
                </div>
                <span className="text-xs text-gray-500">3 comments</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                    <Sliders className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-white">Second Opinion</span>
                </div>
                <Button variant="outline" size="sm">
                  Request
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-2">
                    <Share2 className="h-4 w-4 text-pink-500" />
                  </div>
                  <span className="text-white">Share with Team</span>
                </div>
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
