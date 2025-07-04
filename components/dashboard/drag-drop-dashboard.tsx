"use client"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ThreeDVisualization, RadiationBeamPlanning, DoseDistributionHeatmaps, OrganAtRiskMapping } from "./3d-visuals"
import { DynamicSurvivalCurves, RiskAssessmentGauges, TreatmentOutcomeFunnels, BubbleCharts } from "./charts"
import { GlassmorphismDesign, SmoothAnimations, ResponsiveLayout, DarkLightTheme } from "./visual-enhancements"
import { HIPAACompliantMessaging, ProgressIndicators, AchievementSystem, OfflineMode } from "./professional-features"

const DragDropDashboard = () => {
  const items = [
    { id: "3d-tumor-visualization", content: <ThreeDVisualization /> },
    { id: "radiation-beam-planning", content: <RadiationBeamPlanning /> },
    { id: "dose-distribution-heatmaps", content: <DoseDistributionHeatmaps /> },
    { id: "organ-at-risk-mapping", content: <OrganAtRiskMapping /> },
    { id: "dynamic-survival-curves", content: <DynamicSurvivalCurves /> },
    { id: "risk-assessment-gauges", content: <RiskAssessmentGauges /> },
    { id: "treatment-outcome-funnels", content: <TreatmentOutcomeFunnels /> },
    { id: "bubble-charts", content: <BubbleCharts /> },
    { id: "glassmorphism-design", content: <GlassmorphismDesign /> },
    { id: "smooth-animations", content: <SmoothAnimations /> },
    { id: "responsive-layout", content: <ResponsiveLayout /> },
    { id: "dark-light-theme", content: <DarkLightTheme /> },
    { id: "hipaa-compliant-messaging", content: <HIPAACompliantMessaging /> },
    { id: "progress-indicators", content: <ProgressIndicators /> },
    { id: "achievement-system", content: <AchievementSystem /> },
    { id: "offline-mode", content: <OfflineMode /> },
  ]

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const reorderedItems = Array.from(items)
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, reorderedItem)

    // Update the items state with the reordered items
    // items = reorderedItems;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="dashboard">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragDropDashboard
