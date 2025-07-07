"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { BrainCircuit, ImagePlus, Loader2, RotateCcw, Scan, ZoomIn } from "lucide-react"

export function AIDemo() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(92)
  const [zoomLevel, setZoomLevel] = useState([1])

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
    // Use actual medical images from the public/images directory
    const sampleImages = [
      '/images/brain-ct-scans.jpg',
      '/images/brain-tumor-reference.png',
      '/images/brain-medical-reference.jpg',
      '/images/brain-reference.jpg'
    ]
    const imageIndex = parseInt(sample.split('-')[1]) - 1
    setSelectedImage(sampleImages[imageIndex] || '/placeholder.svg?height=400&width=400')
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

  const handleReset = () => {
    setSelectedImage(null)
    setIsAnalyzed(false)
    setZoomLevel([1])
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6">
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="upload" className="data-[state=active]:bg-purple-900/50">
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="samples" className="data-[state=active]:bg-purple-900/50">
            <Scan className="h-4 w-4 mr-2" />
            Sample Images
          </TabsTrigger>
        </TabsList>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <TabsContent value="upload" className="mt-0">
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

            <TabsContent value="samples" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 1, name: 'Brain CT Scan', image: '/images/brain-ct-scans.jpg' },
                  { id: 2, name: 'Brain Tumor MRI', image: '/images/brain-tumor-reference.png' },
                  { id: 3, name: 'Medical Reference', image: '/images/brain-medical-reference.jpg' },
                  { id: 4, name: 'Brain Reference', image: '/images/brain-reference.jpg' }
                ].map((sample) => (
                  <div
                    key={sample.id}
                    className="border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-purple-500 transition-colors"
                    onClick={() => handleSampleSelect(`sample-${sample.id}`)}
                  >
                    <img
                      src={sample.image}
                      alt={sample.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg?height=150&width=150'
                      }}
                    />
                    <div className="p-2 text-center">
                      <p className="text-sm text-gray-300">{sample.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {selectedImage && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ZoomIn className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-400">Zoom: {zoomLevel[0].toFixed(1)}x</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleReset} disabled={isProcessing}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <Slider value={zoomLevel} onValueChange={setZoomLevel} min={1} max={3} step={0.1} className="mb-4" />

                <div className="relative border border-gray-700 rounded-xl overflow-hidden" style={{ height: "300px" }}>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      transform: `scale(${zoomLevel[0]})`,
                      transformOrigin: "center",
                    }}
                  />

                  {isAnalyzed && (
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
                        {confidence}% confidence
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                      {isAnalyzed ? "Re-Analyze Image" : "Analyze Image"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div>
            {isAnalyzed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-black/50 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Analysis Results</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Detection</h4>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="text-gray-200">Malignant Tumor</span>
                      </div>
                      <span className="text-pink-500 font-semibold">{confidence}%</span>
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

                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                    Generate Detailed Report
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <BrainCircuit className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">AI Analysis Results</h3>
                <p className="text-gray-500">
                  Upload or select an image and click "Analyze Image" to see AI-powered detection results.
                </p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
