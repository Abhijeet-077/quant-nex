"use client"

import { useMemo } from "react"
import { ResponsiveRadar } from "@nivo/radar"

export function TreatmentEfficacyRadar() {
  // Sample data for visualization
  const data = useMemo(
    () => [
      {
        treatment: "Standard Chemo",
        tumor_reduction: 65,
        side_effects: 70,
        quality_of_life: 50,
        cost_effectiveness: 75,
        long_term_outlook: 60,
      },
      {
        treatment: "Targeted Therapy",
        tumor_reduction: 80,
        side_effects: 40,
        quality_of_life: 75,
        cost_effectiveness: 50,
        long_term_outlook: 85,
      },
      {
        treatment: "Quantum-Enhanced",
        tumor_reduction: 90,
        side_effects: 30,
        quality_of_life: 85,
        cost_effectiveness: 60,
        long_term_outlook: 95,
      },
    ],
    [],
  )

  // Get human-readable metric labels
  const metricLabels = {
    tumor_reduction: "Tumor Reduction",
    side_effects: "Side Effects (Lower is Better)",
    quality_of_life: "Quality of Life",
    cost_effectiveness: "Cost Effectiveness",
    long_term_outlook: "Long-term Outlook",
  }

  return (
    <div className="h-[400px]">
      <ResponsiveRadar
        data={data}
        keys={["tumor_reduction", "side_effects", "quality_of_life", "cost_effectiveness", "long_term_outlook"]}
        indexBy="treatment"
        maxValue="auto"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: "color" }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        dotBorderColor={{ from: "color" }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: "category10" }}
        blendMode="multiply"
        motionConfig="gentle"
        gridShape="circular"
        gridLevels={5}
        sliceTooltip={({ data, key, color, value }) => (
          <div className="bg-black/80 text-white p-2 rounded-md text-sm">
            <div className="font-bold mb-1">{data.treatment}</div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: color }} />
              <div>
                {metricLabels[key as keyof typeof metricLabels] || key}: {value}
              </div>
            </div>
          </div>
        )}
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: "#999",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
        theme={{
          background: "transparent",
          textColor: "#cccccc",
          fontSize: 12,
          grid: {
            line: {
              stroke: "#dddddd",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            },
          },
        }}
      />
    </div>
  )
}
