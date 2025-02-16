"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"

const SidebarStep = ({ step, currentStep, currentSubsection, completedSteps, onStepSelect, onSubsectionSelect, docName }) => {
  const [isOpen, setIsOpen] = useState(false)

  const isStepCompleted = (stepIndex, subsectionIndex) => {
    return completedSteps.some((step) => step.stepIndex === stepIndex && step.subsectionIndex >= subsectionIndex)
  }

  const isCurrentStep = currentStep === step.id

  useEffect(() => {
    if (isCurrentStep) {
      setIsOpen(true)
    }
  }, [isCurrentStep])

  const visibleSubsections = step.subsections.filter(
    (subsection) => subsection.totalQuestions > subsection.hiddenQuestions,
  )

  if (visibleSubsections.length === 0) {
    return null // Hide the entire step if all subsections are hidden
  }

  const handleStepClick = () => {
    setIsOpen(!isOpen)
    if (visibleSubsections.length > 0) {
      onStepSelect(step.id)
      onSubsectionSelect(step.id, visibleSubsections[0].index)
    }
  }

  return (
    <div className="mb-2">
      <button
        onClick={handleStepClick}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-lg text-sm",
          isCurrentStep ? "bg-[#5586ff]/10 text-[#5586ff]" : "text-gray-700 hover:bg-gray-50",
        )}
      >
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center
            ${isStepCompleted(step.id, 0) ? "bg-[#5586ff]" : "border-2 border-gray-300"}`}
          >
            {isStepCompleted(step.id, 0) && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span>{step.title}</span>
        </div>
        {visibleSubsections.length > 0 &&
          (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
      </button>
      {isOpen && visibleSubsections.length > 0 && (
        <div className="ml-6 mt-1">
          {visibleSubsections.map((subsection) => (
            <div key={subsection.index}>
              <button
                onClick={() => onSubsectionSelect(step.id, subsection.index)}
                className={cn(
                  "w-full flex items-center p-2 rounded-lg text-sm mb-1",
                  currentStep === step.id && currentSubsection === subsection.index
                    ? "bg-[#5586ff]/10 text-[#5586ff]"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 flex items-center justify-center
                  ${isStepCompleted(step.id, subsection.index) ? "bg-[#5586ff]" : "border-2 border-gray-300"}`}
                >
                  {isStepCompleted(step.id, subsection.index) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span>{subsection.name}</span>
              </button>
              <div className="ml-6 text-xs text-gray-500">
                Visible questions: {subsection.totalQuestions - subsection.hiddenQuestions}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({
  docName,
  steps,
  currentStep,
  currentSubsection,
  completedSteps,
  onStepSelect,
  onSubsectionSelect,
  onPreview,
  progress,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && !e.target.closest(".sidebar")) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileOpen])

  const visibleSteps = steps
    .map((step) => ({
      ...step,
      subsections: step.subsections
        .filter((subsection) => subsection.totalQuestions > subsection.hiddenQuestions)
        .map((subsection, index) => ({ ...subsection, index })),
    }))
    .filter((step) => step.subsections.length > 0)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col p-4">
          <div className="mb-6">
            <h1 className="text-lg font-semibold mb-2">{docName || "Dynamic Form"}</h1>
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="h-full bg-[#5586ff] rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">{progress}%</div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {visibleSteps.map((step) => (
              <SidebarStep
                key={step.id}
                step={step}
                currentStep={currentStep}
                currentSubsection={currentSubsection}
                completedSteps={completedSteps}
                onStepSelect={onStepSelect}
                onSubsectionSelect={onSubsectionSelect}
                docName={docName}
              />
            ))}
          </nav>

          <div className="space-y-4 pt-4">
            <Button onClick={onPreview} className="w-full">
              Preview
            </Button>
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">Logged in as</div>
              <div className="text-sm text-blue-600">user@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

