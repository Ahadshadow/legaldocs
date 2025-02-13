"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"

export default function Sidebar({ steps, currentStep, completedSteps, onStepSelect, onPreview, progress }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<string[]>(["Parties"]) // Default expand first step

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && !e.target.closest(".sidebar")) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileOpen])

  const isStepCompleted = (stepName) => {
    const step = steps.find((s) => s.name === stepName)
    return step?.subsections.every((subsection) => completedSteps.includes(`${stepName}-${subsection.name}`)) || false // Handle case where step might not exist
  }

  const isStepActive = (stepId) => {
    return currentStep === stepId
  }

  const toggleStep = (stepName: string) => {
    setExpandedSteps((prev) => (prev.includes(stepName) ? prev.filter((s) => s !== stepName) : [...prev, stepName]))
  }

  const isStepExpanded = (stepName: string) => {
    return expandedSteps.includes(stepName)
  }

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
            <h1 className="text-lg font-semibold mb-2">legaltemplates.</h1>
            <div className="text-sm text-gray-600 mb-2">Personal Injury/ Insurance Payment Demand Letter</div>
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="h-full bg-[#5586ff] rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">{progress}%</div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {steps.map((step) => (
              <div key={step.name} className="mb-1">
                <button
                  onClick={() => toggleStep(step.name)}
                  className="w-full flex items-center justify-between p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center
                      ${isStepCompleted(step.name) ? "bg-[#5586ff]" : "border-2 border-gray-300"}`}
                    >
                      {isStepCompleted(step.name) && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span>{step.name}</span>
                  </div>
                  {isStepExpanded(step.name) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isStepExpanded(step.name) && (
                  <div className="ml-4 relative pl-4 border-l-2 border-[#5586ff]/20">
                    {step.subsections.map((subsection) => {
                      const stepId = `${step.name}-${subsection.name}`
                      return (
                        <button
                          key={stepId}
                          onClick={() => onStepSelect(stepId)}
                          className={cn(
                            "w-full flex items-center p-2 rounded-lg text-sm",
                            isStepActive(stepId) ? "bg-[#5586ff]/10 text-[#5586ff]" : "text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          {subsection.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="space-y-4 pt-4">
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">Logged in as</div>
              <div className="text-sm text-blue-600">masughazal26@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

