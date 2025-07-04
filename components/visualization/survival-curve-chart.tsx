"use client"

import { useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"

export function SurvivalCurveChart() {
  const data = useMemo(() => {
    // Generate realistic survival curve data
    const baselineData = {
      id: "Population Baseline",
      color: "#8884d8",
      data: Array.from({ length: 61 }, (_, i) => ({
        x: i,
        y: Math.max(0, 100 * Math.exp(-0.02 * i)),
      })),
    }

    const patientData = {
      id: "Patient Prediction",
      color: "#82ca9d",
      data: Array.from({ length: 61 }, (_, i) => ({
        x: i,
        y: Math.max(0, 100 * Math.exp(-0.015 * i) * (1 - 0.2 * Math.sin(i / 10))),
        yLow: Math.max(0, 100 * Math.exp(-0.02 * i) * (1 - 0.2 * Math.sin(i / 10) - 0.05)),
        yHigh: Math.max(0, 100 * Math.exp(-0.01 * i) * (1 - 0.2 * Math.sin(i / 10) + 0.05)),
      })),
    }

    const treatmentData = {
      id: "With Treatment",
      color: "#ffc658",
      data: Array.from({ length: 61 }, (_, i) => ({
        x: i,
        y: Math.max(0, 100 * Math.exp(-0.008 * i) * (1 - 0.1 * Math.sin(i / 15))),
      })),
    }

    return [baselineData, patientData, treatmentData]
  }, [])

  return (
    <div className="h-[400px] bg-black/20 rounded-lg p-4 border border-blue-500/20">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "linear", min: 0, max: "auto" }}
        yScale={{ type: "linear", min: 0, max: 100 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Time (months)",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Survival Probability (%)",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "category10" }}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <div className="bg-black/90 text-white p-3 rounded-lg text-sm border border-blue-500/30">
            <div className="font-bold mb-2">Time: {slice.points[0]?.data?.x || 0} months</div>
            {slice.points.map((point) => (
              <div key={point.id} className="flex items-center mb-1">
                <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: point.serieColor }} />
                <div>
                  <span>{point.serieId}: {typeof point.data.y === 'number' ? point.data.y.toFixed(1) : point.data.y}%</span>
                  {(point.data as any).yLow !== undefined && (
                    <div className="text-xs opacity-80">
                      CI: {(point.data as any).yLow.toFixed(1)}% - {(point.data as any).yHigh.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        theme={{
          background: "transparent",
          text: {
            fill: "#ffffff",
          },
          axis: {
            domain: {
              line: {
                stroke: "#ffffff",
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fill: "#ffffff",
              },
            },
            ticks: {
              line: {
                stroke: "#ffffff",
                strokeWidth: 1,
              },
              text: {
                fill: "#ffffff",
              },
            },
          },
          grid: {
            line: {
              stroke: "#ffffff",
              strokeWidth: 0.5,
              strokeOpacity: 0.3,
            },
          },
          legends: {
            text: {
              fill: "#ffffff",
            },
          },
        }}
        motionConfig="gentle"
      />
    </div>
  )
}


