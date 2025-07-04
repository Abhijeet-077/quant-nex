"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

export function AIInsightsPanel() {
  const insights = [
    {
      type: "prediction",
      title: "Treatment Response",
      confidence: 94,
      status: "positive",
      description: "High probability of positive response to immunotherapy",
    },
    {
      type: "risk",
      title: "Surgical Risk",
      confidence: 87,
      status: "warning",
      description: "Moderate risk due to tumor proximity to motor cortex",
    },
    {
      type: "prognosis",
      title: "5-Year Survival",
      confidence: 91,
      status: "positive",
      description: "Above average survival probability with current treatment plan",
    },
  ]

  return (
    <Card className="card-glow border-blue-500/30 h-[600px]">
      <CardHeader>
        <CardTitle className="text-white flex items-center glow-text">
          <Brain className="h-5 w-5 mr-2 text-purple-400 neon-glow" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 rounded-lg bg-black/30 border border-blue-500/20 glow-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">{insight.title}</h3>
              <Badge
                variant="secondary"
                className={`${
                  insight.status === "positive"
                    ? "bg-green-500/20 text-green-300"
                    : insight.status === "warning"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                }`}
              >
                <span>{insight.confidence}%</span>
              </Badge>
            </div>
            <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
            <div className="flex items-center space-x-2">
              {insight.status === "positive" ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : insight.status === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-400" />
              )}
              <span className="text-xs text-gray-400">AI Confidence: {insight.confidence}%</span>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 glow-border-subtle">
          <h3 className="text-white font-medium mb-2">AI Recommendation</h3>
          <p className="text-gray-300 text-sm">
            Consider combination therapy with targeted radiation and immunotherapy for optimal outcomes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
