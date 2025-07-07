"use client"

import { useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"

export function SurvivalCurveChart() {
  // Sample data for visualization
  const data = useMemo(() => {
    const patientData = {
      id: "Patient Prediction",
      data: Array.from({ length: 60 }, (_, i) => ({
        x: i,
        y: 100 * Math.exp(-0.015 * i) * (1 - 0.2 * Math.sin(i / 10)),
        yLow: 100 * Math.exp(-0.02 * i) * (1 - 0.2 * Math.sin(i / 10) - 0.05),
        yHigh: 100 * Math.exp(-0.01 * i) * (1 - 0.2 * Math.sin(i / 10) + 0.05),
      })),
    }

    const baselineData = {
      id: "Population Baseline",
      data: Array.from({ length: 60 }, (_, i) => ({
        x: i,
        y: 100 * Math.exp(-0.02 * i),
      })),
    }

    const treatmentData = {
      id: "With Treatment",
      data: Array.from({ length: 60 }, (_, i) => ({
        x: i,
        y: 100 * Math.exp(-0.008 * i) * (1 - 0.1 * Math.sin(i / 15)),
      })),
    }

    return [baselineData, patientData, treatmentData]
  }, [])

  return (
    <div className="h-[400px]">
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
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <div className="bg-black/80 text-white p-2 rounded-md text-sm">
            <div className="font-bold mb-1">Time: {slice.points[0].data.x} months</div>
            {slice.points.map((point) => (
              <div key={point.id} className="flex items-center">
                <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: point.serieColor }} />
                <div>
                  {point.serieId}: {point.data.y.toFixed(1)}%
                </div>
                {point.data.yLow !== undefined && (
                  <div className="ml-2 text-xs opacity-80">
                    ({point.data.yLow.toFixed(1)}% - {point.data.yHigh.toFixed(1)}%)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        // Add confidence intervals
        layers={[
          "grid",
          "markers",
          "axes",
          "areas",
          "crosshair",
          "lines",
          "points",
          "slices",
          "mesh",
          "legends",
          // Custom layer for confidence intervals
          ({ points, xScale, yScale }) => (
            <g>
              {points.map((point) => {
                if (point.data.yLow === undefined) return null

                return (
                  <rect
                    key={`${point.id}-ci`}
                    x={point.x - 4}
                    y={yScale(point.data.yHigh)}
                    width={8}
                    height={yScale(point.data.yLow) - yScale(point.data.yHigh)}
                    fill={point.color}
                    opacity={0.2}
                    rx={2}
                    ry={2}
                  />
                )
              })}
            </g>
          ),
        ]}
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
          textColor: "#cccccc",
          fontSize: 12,
          axis: {
            domain: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
            ticks: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
          },
          grid: {
            line: {
              stroke: "#dddddd",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            },
          },
          crosshair: {
            line: {
              stroke: "#ffffff",
              strokeWidth: 1,
              strokeOpacity: 0.35,
              strokeDasharray: "6 6",
            },
          },
        }}
        motionConfig="gentle"
      />
    </div>
  )
}
