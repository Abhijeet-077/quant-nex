"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

export function LayeredAnatomyModel() {
  const [activeLayer, setActiveLayer] = useState("skin")
  const [layerOpacity, setLayerOpacity] = useState({
    skin: 0.9,
    muscle: 0.8,
    skeleton: 0.7,
    organs: 0.9,
    nervous: 0.6,
    circulatory: 0.5,
  })
  const [visibleLayers, setVisibleLayers] = useState({
    skin: true,
    muscle: true,
    skeleton: true,
    organs: true,
    nervous: true,
    circulatory: true,
  })
  const [rotation, setRotation] = useState(0)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  const updateOpacity = (layer: string, value: number) => {
    setLayerOpacity((prev) => ({ ...prev, [layer]: value }))
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-900 to-black rounded-xl overflow-hidden relative">
      {/* Advanced Controls */}
      <div className="absolute top-4 left-4 z-30 bg-black/95 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Anatomical Layers</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
              className="bg-blue-500/20 border-blue-500/50 text-blue-300 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Labels
            </Button>
          </div>

          <Tabs value={activeLayer} onValueChange={setActiveLayer} className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-800 text-xs">
              <TabsTrigger value="skin" className="text-xs">
                Skin
              </TabsTrigger>
              <TabsTrigger value="muscle" className="text-xs">
                Muscle
              </TabsTrigger>
              <TabsTrigger value="skeleton" className="text-xs">
                Bone
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Layer Controls */}
          <div className="space-y-3">
            {Object.entries(layerOpacity).map(([layer, opacity]) => (
              <div key={layer} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleLayer(layer as keyof typeof visibleLayers)} className="p-1 h-6 w-6">
                      {visibleLayers[layer as keyof typeof visibleLayers] ? (
                        <Eye className="h-3 w-3 text-green-400" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                    <span className="text-xs text-white capitalize">{layer}</span>
                  </div>
                  <span className="text-xs text-gray-400">{Math.round(opacity * 100)}%</span>
                </div>
                <Slider
                  value={[opacity]}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => updateOpacity(layer, value[0])}
                  className="w-full h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status and Info */}
      <div className="absolute bottom-4 left-4 z-30 space-y-2">
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          Medical Grade Anatomy
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          4 Layer System Active
        </Badge>
      </div>

      {/* Main Anatomical Model */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div
          className="relative w-80 h-96"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Skin Layer */}
          {visibleLayers.skin && (
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                opacity: layerOpacity.skin,
                background: `linear-gradient(135deg, 
                  rgba(255, 220, 177, 0.8) 0%, 
                  rgba(240, 200, 160, 0.6) 50%, 
                  rgba(220, 180, 140, 0.4) 100%)`,
                clipPath:
                  "polygon(40% 0%, 60% 0%, 70% 15%, 75% 30%, 80% 50%, 75% 70%, 70% 85%, 60% 100%, 40% 100%, 30% 85%, 25% 70%, 20% 50%, 25% 30%, 30% 15%)",
                boxShadow: `inset 0 0 30px rgba(255, 220, 177, 0.3), 0 0 20px rgba(255, 220, 177, 0.2)`,
                transform: "translateZ(20px)",
              }}
            >
              {showLabels && (
                <div className="absolute top-4 right-2 bg-orange-600/90 text-white text-xs px-2 py-1 rounded border border-orange-400">
                  Epidermis
                </div>
              )}
            </div>
          )}

          {/* Muscular System */}
          {visibleLayers.muscle && (
            <div
              className="absolute inset-0"
              style={{
                opacity: layerOpacity.muscle,
                transform: "translateZ(15px)",
              }}
            >
              {/* Major Muscle Groups */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-20 bg-red-600/80 rounded-lg" />
              <div className="absolute top-12 left-6 w-8 h-16 bg-red-500/80 rounded-lg transform -rotate-12" />
              <div className="absolute top-12 right-6 w-8 h-16 bg-red-500/80 rounded-lg transform rotate-12" />
              <div className="absolute top-32 left-1/2 -translate-x-1/2 w-20 h-24 bg-red-700/80 rounded-lg" />
              <div className="absolute top-40 left-4 w-6 h-20 bg-red-600/80 rounded-lg" />
              <div className="absolute top-40 right-4 w-6 h-20 bg-red-600/80 rounded-lg" />
              <div className="absolute top-60 left-8 w-8 h-24 bg-red-500/80 rounded-lg" />
              <div className="absolute top-60 right-8 w-8 h-24 bg-red-500/80 rounded-lg" />

              {/* Muscle Fiber Details */}
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-8 bg-red-400/60 rounded-full"
                  style={{
                    top: `${120 + (i % 4) * 20}px`,
                    left: `${140 + Math.floor(i / 4) * 15}px`,
                    transform: `rotate(${i * 15}deg)`,
                  }}
                />
              ))}

              {showLabels && (
                <>
                  <div className="absolute top-16 left-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded border border-red-400">
                    Pectoralis
                  </div>
                  <div className="absolute top-36 right-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded border border-red-400">
                    Deltoid
                  </div>
                  <div className="absolute bottom-20 left-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded border border-red-400">
                    Quadriceps
                  </div>
                </>
              )}
            </div>
          )}

          {/* Skeletal System */}
          {visibleLayers.skeleton && (
            <div
              className="absolute inset-0"
              style={{
                opacity: layerOpacity.skeleton,
                transform: "translateZ(10px)",
              }}
            >
              {/* Spine */}
              <div className="absolute left-1/2 top-16 -translate-x-1/2 w-2 h-64 bg-gray-200/90 rounded-full">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-3 bg-gray-300/80 rounded-full left-1/2 -translate-x-1/2"
                    style={{ top: `${i * 20}px` }}
                  />
                ))}
              </div>

              {/* Rib Cage */}
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 border-2 border-gray-300/70 rounded-full"
                  style={{
                    top: `${80 + i * 12}px`,
                    width: `${100 - i * 3}px`,
                    height: `${15 + i}px`,
                  }}
                />
              ))}

              {/* Skull */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 border-2 border-gray-300/80 rounded-full bg-gray-200/20" />

              {/* Pelvis */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-12 border-2 border-gray-300/80 rounded-lg bg-gray-200/20" />

              {/* Arms */}
              <div className="absolute top-20 left-2 w-2 h-20 bg-gray-300/80 rounded-full transform -rotate-12" />
              <div className="absolute top-20 right-2 w-2 h-20 bg-gray-300/80 rounded-full transform rotate-12" />

              {/* Legs */}
              <div className="absolute bottom-0 left-6 w-2 h-24 bg-gray-300/80 rounded-full" />
              <div className="absolute bottom-0 right-6 w-2 h-24 bg-gray-300/80 rounded-full" />

              {showLabels && (
                <>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-600/90 text-white text-xs px-2 py-1 rounded border border-gray-400">
                    Cranium
                  </div>
                  <div className="absolute top-24 left-1 bg-gray-600/90 text-white text-xs px-2 py-1 rounded border border-gray-400">
                    Ribs
                  </div>
                  <div className="absolute bottom-8 right-1 bg-gray-600/90 text-white text-xs px-2 py-1 rounded border border-gray-400">
                    Femur
                  </div>
                </>
              )}
            </div>
          )}

          {/* Organ Systems */}
          {visibleLayers.organs && (
            <div
              className="absolute inset-0"
              style={{
                opacity: layerOpacity.organs,
                transform: "translateZ(5px)",
              }}
            >
              {/* Heart */}
              <div
                className="absolute top-20 left-12 w-8 h-8 bg-red-500/90 rounded-full animate-pulse"
                style={{ animationDuration: "1.2s" }}
              >
                <div className="absolute top-1 left-1 w-6 h-6 bg-red-600/80 rounded-full" />
              </div>

              {/* Lungs */}
              <div className="absolute top-18 left-8 w-6 h-14 bg-pink-400/80 rounded-full" />
              <div className="absolute top-18 right-8 w-6 h-14 bg-pink-400/80 rounded-full" />

              {/* Liver */}
              <div className="absolute top-32 right-6 w-12 h-16 bg-orange-600/80 rounded-lg" />

              {/* Kidneys */}
              <div className="absolute top-36 left-4 w-4 h-8 bg-purple-500/80 rounded-full" />
              <div className="absolute top-36 right-4 w-4 h-8 bg-purple-500/80 rounded-full" />

              {/* Stomach */}
              <div className="absolute top-36 left-8 w-8 h-10 bg-yellow-600/80 rounded-full" />

              {/* Intestines */}
              <div className="absolute top-52 left-1/2 -translate-x-1/2 w-16 h-20 bg-orange-500/80 rounded-lg">
                <div className="absolute inset-2 border-2 border-orange-400/60 rounded-lg" />
                <div className="absolute inset-4 border border-orange-300/40 rounded" />
              </div>

              {showLabels && (
                <>
                  <div className="absolute top-16 left-16 bg-red-600/90 text-white text-xs px-2 py-1 rounded border border-red-400">
                    Heart
                  </div>
                  <div className="absolute top-14 left-2 bg-pink-600/90 text-white text-xs px-2 py-1 rounded border border-pink-400">
                    Lungs
                  </div>
                  <div className="absolute top-28 right-2 bg-orange-600/90 text-white text-xs px-2 py-1 rounded border border-orange-400">
                    Liver
                  </div>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-orange-600/90 text-white text-xs px-2 py-1 rounded border border-orange-400">
                    Intestines
                  </div>
                </>
              )}
            </div>
          )}

          {/* Nervous System */}
          {visibleLayers.nervous && (
            <div
              className="absolute inset-0"
              style={{
                opacity: layerOpacity.nervous,
                transform: "translateZ(0px)",
              }}
            >
              {/* Brain */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-14 bg-yellow-400/60 rounded-full">
                <div className="absolute inset-2 bg-yellow-300/40 rounded-full" />
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-0.5 bg-yellow-400/80 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      transformOrigin: "0 50%",
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Spinal Cord */}
              <div className="absolute left-1/2 top-16 -translate-x-1/2 w-1 h-48 bg-yellow-300/80 rounded-full">
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-0.5 bg-yellow-400/60 rounded-full"
                    style={{
                      top: `${i * 8}px`,
                      left: i % 2 === 0 ? "-8px" : "4px",
                      transform: `rotate(${i % 2 === 0 ? -30 : 30}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Peripheral Nerves */}
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-12 h-0.5 bg-yellow-300/50 rounded-full"
                  style={{
                    top: `${100 + i * 12}px`,
                    left: i % 2 === 0 ? "20px" : "240px",
                    transform: `rotate(${i % 2 === 0 ? 45 : -45}deg)`,
                  }}
                />
              ))}

              {showLabels && (
                <div className="absolute top-0 right-2 bg-yellow-600/90 text-white text-xs px-2 py-1 rounded border border-yellow-400">
                  Neural Network
                </div>
              )}
            </div>
          )}

          {/* Circulatory System */}
          {visibleLayers.circulatory && (
            <div
              className="absolute inset-0"
              style={{
                opacity: layerOpacity.circulatory,
                transform: "translateZ(-5px)",
              }}
            >
              {/* Major Arteries */}
              <div className="absolute left-1/2 top-20 -translate-x-1/2 w-1 h-40 bg-red-400/70 rounded-full" />

              {/* Branching Vessels */}
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute bg-red-300/50 rounded-full"
                  style={{
                    width: `${Math.max(1, 4 - Math.floor(i / 5))}px`,
                    height: `${20 + i * 3}px`,
                    top: `${80 + i * 8}px`,
                    left: `${140 + (i % 2 === 0 ? -20 : 20) + Math.sin(i) * 10}px`,
                    transform: `rotate(${i * 18}deg)`,
                  }}
                />
              ))}

              {/* Venous System */}
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-16 bg-blue-400/50 rounded-full"
                  style={{
                    top: `${120 + i * 15}px`,
                    left: `${120 + Math.cos(i) * 30}px`,
                    transform: `rotate(${i * 30}deg)`,
                  }}
                />
              ))}

              {showLabels && (
                <div className="absolute top-32 left-1 bg-red-600/90 text-white text-xs px-2 py-1 rounded border border-red-400">
                  Aorta
                </div>
              )}
            </div>
          )}
        </div>

        {/* System Information Panel */}
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-sm">
          <h3 className="text-white font-semibold mb-3">
            Active Layer: {activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)}
          </h3>
          <div className="space-y-2 text-sm">
            {activeLayer === "skin" && (
              <div className="text-gray-300">
                <p>• Epidermis and dermis layers</p>
                <p>• Protective barrier function</p>
                <p>• Temperature regulation</p>
              </div>
            )}
            {activeLayer === "muscle" && (
              <div className="text-gray-300">
                <p>• 600+ skeletal muscles</p>
                <p>• Cardiac and smooth muscle</p>
                <p>• Movement and posture</p>
              </div>
            )}
            {activeLayer === "skeleton" && (
              <div className="text-gray-300">
                <p>• 206 bones in adult body</p>
                <p>• Structural support system</p>
                <p>• Calcium and mineral storage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
