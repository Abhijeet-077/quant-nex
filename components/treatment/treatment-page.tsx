"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Loader2,
  Microscope,
  Pill,
  Share2,
  Sliders,
  Syringe,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "../layout/main-layout"
import { TreatmentEfficacyRadar } from "../visualization/treatment-efficacy-radar"
import { Enhanced3DModel } from "../3d/enhanced-3d-model"

export function TreatmentPage() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [treatmentParams, setTreatmentParams] = useState({
    radiationDose: [60],
    beamCount: [5],
    fractionCount: [30],
    margin: [0.5],
    intensity: [0.8],
  })

  const handleOptimize = () => {
    setIsOptimizing(true)

    // Simulate processing time
    setTimeout(() => {
      setIsOptimizing(false)
      setIsOptimized(true)
    }, 2000)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-black p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white glow-text">Treatment Planning</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>
              <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                <Download className="h-4 w-4 mr-2" />
                <span>Export</span>
              </Button>
            </div>
          </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="card-glow rounded-xl border border-blue-500/30 overflow-hidden">
            <div className="p-4 border-b border-blue-500/30 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white glow-text">3D Treatment Planning</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                  <Zap className="h-4 w-4 mr-2" />
                  <span>Beam Angles</span>
                </Button>
                <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>Dose Distribution</span>
                </Button>
              </div>
            </div>

            <div className="p-4">
              <Tabs defaultValue="3d-view">
                <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
                  <TabsTrigger value="3d-view">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    <span>3D View</span>
                  </TabsTrigger>
                  <TabsTrigger value="dose-map">
                    <Activity className="h-4 w-4 mr-2" />
                    <span>Dose Map</span>
                  </TabsTrigger>
                  <TabsTrigger value="risk-organs">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>Organs at Risk</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="3d-view">
                  <div className="h-[500px]">
                    <Enhanced3DModel
                      modelType="brain"
                      title="Brain Tumor Treatment Planning"
                      showControls={true}
                      autoRotate={false}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="dose-map">
                  <div className="h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <Microscope className="h-16 w-16 text-blue-400 mx-auto mb-4 neon-glow" />
                      <p className="text-gray-300">Dose distribution map will appear here after optimization</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk-organs">
                  <div className="h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4 neon-glow" />
                      <p className="text-gray-300">Organs at risk visualization will appear here after optimization</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="card-glow rounded-xl border border-blue-500/30 p-4">
            <h3 className="text-xl font-semibold mb-4 text-white glow-text">Treatment Efficacy Comparison</h3>
            <div className="h-[400px]">
              <TreatmentEfficacyRadar />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="card-glow rounded-xl border border-blue-500/30 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white glow-text">Quantum Optimization</h3>
              <Button variant="outline" size="sm" onClick={handleOptimize} disabled={isOptimizing} className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                {isOptimizing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Sliders className="h-4 w-4 mr-2" />
                    <span>Optimize Plan</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">Radiation Dose (Gy)</label>
                  <span className="text-sm text-white">{treatmentParams.radiationDose[0]}</span>
                </div>
                <Slider
                  value={treatmentParams.radiationDose}
                  onValueChange={(value) => setTreatmentParams({ ...treatmentParams, radiationDose: value })}
                  min={40}
                  max={80}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">Beam Count</label>
                  <span className="text-sm text-white">{treatmentParams.beamCount[0]}</span>
                </div>
                <Slider
                  value={treatmentParams.beamCount}
                  onValueChange={(value) => setTreatmentParams({ ...treatmentParams, beamCount: value })}
                  min={3}
                  max={9}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">Fraction Count</label>
                  <span className="text-sm text-white">{treatmentParams.fractionCount[0]}</span>
                </div>
                <Slider
                  value={treatmentParams.fractionCount}
                  onValueChange={(value) => setTreatmentParams({ ...treatmentParams, fractionCount: value })}
                  min={10}
                  max={40}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">Margin (cm)</label>
                  <span className="text-sm text-white">{treatmentParams.margin[0]}</span>
                </div>
                <Slider
                  value={treatmentParams.margin}
                  onValueChange={(value) => setTreatmentParams({ ...treatmentParams, margin: value })}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">Intensity Modulation</label>
                  <span className="text-sm text-white">{treatmentParams.intensity[0] * 100}%</span>
                </div>
                <Slider
                  value={treatmentParams.intensity}
                  onValueChange={(value) => setTreatmentParams({ ...treatmentParams, intensity: value })}
                  min={0.1}
                  max={1}
                  step={0.01}
                />
              </div>

              {isOptimized && (
                <div className="mt-6 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BrainCircuit className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="font-semibold text-green-400">Optimization Complete</h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Quantum optimization has improved plan efficiency by 28% and reduced healthy tissue exposure by 35%.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card-glow rounded-xl border border-blue-500/30 p-4">
            <h3 className="text-xl font-semibold mb-4 text-white glow-text">Treatment Regimen</h3>

            <div className="space-y-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Syringe className="h-5 w-5 text-purple-500 mr-2" />
                  <h4 className="font-semibold text-white">Radiation Therapy</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Total Dose:</div>
                  <div className="text-white text-right">{treatmentParams.radiationDose[0]} Gy</div>

                  <div className="text-gray-400">Fractions:</div>
                  <div className="text-white text-right">{treatmentParams.fractionCount[0]}</div>

                  <div className="text-gray-400">Schedule:</div>
                  <div className="text-white text-right">5 days/week</div>

                  <div className="text-gray-400">Duration:</div>
                  <div className="text-white text-right">{Math.ceil(treatmentParams.fractionCount[0] / 5)} weeks</div>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Pill className="h-5 w-5 text-cyan-500 mr-2" />
                  <h4 className="font-semibold text-white">Chemotherapy</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Agent:</div>
                  <div className="text-white text-right">Temozolomide</div>

                  <div className="text-gray-400">Dosage:</div>
                  <div className="text-white text-right">75 mg/m²</div>

                  <div className="text-gray-400">Schedule:</div>
                  <div className="text-white text-right">Daily during RT</div>

                  <div className="text-gray-400">Maintenance:</div>
                  <div className="text-white text-right">6 cycles post-RT</div>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-pink-500 mr-2" />
                  <h4 className="font-semibold text-white">Treatment Schedule</h4>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Start Date: May 15, 2025</p>
                      <p className="text-xs text-gray-400">Initial radiation session</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-white">End Date: June 26, 2025</p>
                      <p className="text-xs text-gray-400">Final radiation session</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Follow-up: July 10, 2025</p>
                      <p className="text-xs text-gray-400">First post-treatment assessment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-glow rounded-xl border border-blue-500/30 p-4">
            <h3 className="text-xl font-semibold mb-4 text-white glow-text">Reports & Documentation</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-cyan-500 mr-3" />
                  <span className="text-white">Treatment Plan Summary</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-white">Dose Distribution Report</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-pink-500 mr-3" />
                  <span className="text-white">Side Effect Management</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </MainLayout>
  )
}
