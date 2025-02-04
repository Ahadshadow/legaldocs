"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "../lib/utils"

export default function Sidebar({ steps, currentStep, completedSteps, onStepSelect, onPreview, progress }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && !e.target.closest(".sidebar")) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileOpen])

  const isStepCompleted = (stepId) => {
    return completedSteps.includes(stepId)
  }

  const isStepActive = (stepId) => {
    return currentStep === stepId
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col p-4">
          <div className="mb-6">
            <h1 className="text-lg font-semibold mb-2">legaltemplates.</h1>
            <div className="text-sm text-gray-600 mb-2">Lease/Rental Agreement</div>
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
              <div key={step.id} className="mb-1">
                <button
                  onClick={() => onStepSelect(step.id)}
                  className={`w-full flex items-center p-2 rounded-lg text-sm ${
                    isStepActive(step.id) ? "bg-[#5586ff]/10 text-[#5586ff]" : "text-gray-700 hover:bg-[#5586ff]/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center
                    ${isStepCompleted(step.id) ? "bg-[#5586ff]" : "border-2 border-gray-300"}`}
                  >
                    {isStepCompleted(step.id) && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  {step.title}
                </button>
              </div>
            ))}
          </nav>

          <div className="space-y-4 pt-4">
            <button
              onClick={onPreview}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Preview
            </button>
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

