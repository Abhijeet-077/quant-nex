"use client"

import { useState } from "react"
import { Activity, AlertTriangle, Download, Loader2, Share2, Sliders, Syringe, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "../layout/main-layout"
import { TreatmentEfficacyRadar } from "../visualization/treatment-efficacy-radar"
import { DamagedOrgansModel } from "../visualization/damaged-organs-model"
import { ModelViewerModal } from "../ui/model-viewer-modal"
import { ModelIconButton } from "../ui/model-icon-button"

export function EnhancedTreatmentPage() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [treatmentParams, setTreatmentParams] = useState({
    radiationDose: [60],
    beamCount: [6],
    fractionCount: [30],
    margin: [0.5],
    intensity: [0.8],
  })
  const [activeModal, setActiveModal] = useState<"organs" | null>(null)

  const handleOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      setIsOptimized(true)
    }, 2000)
  }

  const openModal = () => {
    setActiveModal("organs")
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Advanced Treatment Planning</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share Plan
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export DICOM
              </Button>
            </div>
          </div>

          {/* 3D Model Icon */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <ModelIconButton
              type="organs"
              title="Human Body Analysis & Radiation Planning"
              description="Interactive 3D model showing radiation effects on organs with detailed dose distribution and risk assessment."
              onClick={openModal}
            />

            {/* Treatment Analysis */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  Treatment Efficacy Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <TreatmentEfficacyRadar />
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Quantum Optimization */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-white">Quantum Optimization</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="bg-purple-500/20 border-purple-500/50 text-purple-300"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sliders className="h-4 w-4 mr-2" />
                        Optimize Plan
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300">Radiation Dose (Gy)</label>
                      <span className="text-sm text-white font-mono">{treatmentParams.radiationDose[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.radiationDose}
                      onValueChange={(value) => setTreatmentParams({ ...treatmentParams, radiationDose: value })}
                      min={40}
                      max={80}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300">Beam Count</label>
                      <span className="text-sm text-white font-mono">{treatmentParams.beamCount[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.beamCount}
                      onValueChange={(value) => setTreatmentParams({ ...treatmentParams, beamCount: value })}
                      min={3}
                      max={9}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300">Fraction Count</label>
                      <span className="text-sm text-white font-mono">{treatmentParams.fractionCount[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.fractionCount}
                      onValueChange={(value) => setTreatmentParams({ ...treatmentParams, fractionCount: value })}
                      min={10}
                      max={40}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300">Safety Margin (cm)</label>
                      <span className="text-sm text-white font-mono">{treatmentParams.margin[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.margin}
                      onValueChange={(value) => setTreatmentParams({ ...treatmentParams, margin: value })}
                      min={0.1}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300">Intensity Modulation</label>
                      <span className="text-sm text-white font-mono">
                        {Math.round(treatmentParams.intensity[0] * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={treatmentParams.intensity}
                      onValueChange={(value) => setTreatmentParams({ ...treatmentParams, intensity: value })}
                      min={0.1}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>

                {isOptimized && (
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-semibold text-green-400">Optimization Complete</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>• Plan efficiency improved by 28%</p>
                      <p>• Healthy tissue exposure reduced by 35%</p>
                      <p>• Target coverage: 98.5%</p>
                      <p>• Critical organ sparing: 92%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Treatment Protocol */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Treatment Protocol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center mb-3">
                      <Zap className="h-5 w-5 text-cyan-500 mr-2" />
                      <h4 className="font-semibold text-white">IMRT Protocol</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-400">Total Dose:</div>
                      <div className="text-white text-right font-mono">{treatmentParams.radiationDose[0]} Gy</div>
                      <div className="text-gray-400">Fractions:</div>
                      <div className="text-white text-right font-mono">{treatmentParams.fractionCount[0]}</div>
                      <div className="text-gray-400">Beam Angles:</div>
                      <div className="text-white text-right font-mono">{treatmentParams.beamCount[0]} fields</div>
                      <div className="text-gray-400">Schedule:</div>
                      <div className="text-white text-right">5 days/week</div>
                      <div className="text-gray-400">Duration:</div>
                      <div className="text-white text-right font-mono">
                        {Math.ceil(treatmentParams.fractionCount[0] / 5)} weeks
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg border border-purple-500/30">
                    <div className="flex items-center mb-3">
                      <Syringe className="h-5 w-5 text-purple-500 mr-2" />
                      <h4 className="font-semibold text-white">Supportive Care</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Anti-nausea:</span>
                        <span className="text-white">Ondansetron 8mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Skin care:</span>
                        <span className="text-white">Aquaphor cream</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monitoring:</span>
                        <span className="text-white">Weekly CBC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <span className="text-sm text-gray-300">Heart (Critical)</span>
                    <span className="text-sm text-red-400 font-mono">15% risk</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <span className="text-sm text-gray-300">Lungs (Moderate)</span>
                    <span className="text-sm text-yellow-400 font-mono">8% risk</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <span className="text-sm text-gray-300">Liver (Low)</span>
                    <span className="text-sm text-green-400 font-mono">3% risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal */}
        <ModelViewerModal
          isOpen={activeModal === "organs"}
          onClose={closeModal}
          title="Human Body Analysis & Radiation Planning"
          modelType="organs"
        >
          <DamagedOrgansModel />
        </ModelViewerModal>
      </div>
    </MainLayout>
  )
}
