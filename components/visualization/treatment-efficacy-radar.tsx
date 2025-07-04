"use client"

import { useMemo } from "react"
import { ResponsiveRadar } from "@nivo/radar"

export function TreatmentEfficacyRadar() {
  const data = useMemo(() => [
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
  ], [])

  const keys = ["tumor_reduction", "side_effects", "quality_of_life", "cost_effectiveness", "long_term_outlook"]

  const metricLabels = {
    tumor_reduction: "Tumor Reduction",
    side_effects: "Side Effects (Lower is Better)",
    quality_of_life: "Quality of Life",
    cost_effectiveness: "Cost Effectiveness",
    long_term_outlook: "Long-term Outlook",
  }

  return (
    <div className="h-[400px] bg-black/20 rounded-lg p-4 border border-blue-500/20">
      <ResponsiveRadar
        data={data}
        keys={keys}
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
        sliceTooltip={({ data }) => (
          <div className="bg-black/90 text-white p-3 rounded-lg text-sm border border-blue-500/30">
            <div className="font-bold mb-2">{(data as any).treatment}</div>
            <div className="space-y-1">
              {Object.entries(data).map(([key, value]) => {
                if (key === 'treatment') return null;
                return (
                  <div key={key} className="flex items-center">
                    <div className="w-3 h-3 mr-2 rounded-full bg-blue-500" />
                    <div>
                      <span>{metricLabels[key as keyof typeof metricLabels] || key}: {value}</span>
                    </div>
                  </div>
                );
              })}
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
                  itemTextColor: "#fff",
                },
              },
            ],
          },
        ]}
        theme={{
          background: "transparent",
          text: {
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
          },
          grid: {
            line: {
              stroke: "#3b82f6",
              strokeWidth: 1,
              strokeOpacity: 0.6,
            },
          },
          axis: {
            domain: {
              line: {
                stroke: "#3b82f6",
                strokeWidth: 2,
              },
            },
            legend: {
              text: {
                fontSize: 14,
                fill: "#ffffff",
                fontWeight: 600,
                outlineWidth: 1,
                outlineColor: "#000000",
              },
            },
            ticks: {
              line: {
                stroke: "#3b82f6",
                strokeWidth: 2,
              },
              text: {
                fontSize: 13,
                fill: "#ffffff",
                fontWeight: 600,
                outlineWidth: 1,
                outlineColor: "#000000",
              },
            },
          },
          legends: {
            text: {
              fontSize: 14,
              fill: "#ffffff",
              fontWeight: 600,
              outlineWidth: 1,
              outlineColor: "#000000",
            },
          },
        }}
      />
    </div>
  )
}
