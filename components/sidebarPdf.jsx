'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

const steps = [
  {
    id: 'lease-type',
    title: 'Lease Type',
  },
  {
    id: 'premises',
    title: 'Premises',
    subItems: [
      { id: 'housing-type', title: 'Housing Type' },
      { id: 'parking-storage', title: 'Parking and Storage' },
      { id: 'furnishings', title: 'Furnishings' },
      { id: 'condition', title: 'Condition of the Premises' },
      { id: 'additional-description', title: 'Additional Description' },
      { id: 'address', title: 'Address' },
      { id: 'lead-disclosure', title: 'Lead Disclosure' }
    ]
  },
  {
    id: 'final-details',
    title: 'Final Details',
    subItems: [
      { id: 'dispute-resolution', title: 'Dispute Resolution' },
      { id: 'landlord-address', title: 'Landlord\'s Address' },
      { id: 'tenant-address', title: 'Tenant\'s Address' },
      { id: 'date', title: 'Date' }
    ]
  }
]

export default function Sidebar({ currentStep, completedSteps, onStepSelect, onPreview, progress }) {
  const [expandedSection, setExpandedSection] = useState(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Determine which section should be expanded based on the current step
  useEffect(() => {
    const currentMainStep = steps.find(step => 
      step.id === currentStep || step.subItems?.some(subItem => subItem.id === currentStep)
    )
    if (currentMainStep) {
      setExpandedSection(currentMainStep.id)
    }
  }, [currentStep])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && !e.target.closest('.sidebar')) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileOpen])

  const isStepCompleted = (step) => {
    if (step.subItems) {
      return step.subItems.every(subItem => completedSteps.includes(subItem.id))
    }
    return completedSteps.includes(step.id)
  }

  const isStepActive = (stepId) => {
    return currentStep === stepId || 
           steps.find(step => step.id === stepId)?.subItems?.some(subItem => subItem.id === currentStep)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col p-4">
          <div className="mb-6">
            <h1 className="text-lg font-semibold mb-2">legaltemplates.</h1>
            <div className="text-sm text-gray-600 mb-2">
              Lease/Rental Agreement
            </div>
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
                  onClick={() => {
                    if (step.subItems) {
                      setExpandedSection(prevExpanded => prevExpanded === step.id ? null : step.id)
                    } else {
                      onStepSelect(step.id)
                    }
                  }}
                  className={`w-full flex items-center p-2 rounded-lg text-sm ${
                    isStepActive(step.id)
                      ? 'bg-[#5586ff]/10 text-[#5586ff]'
                      : 'text-gray-700 hover:bg-[#5586ff]/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center
                    ${isStepCompleted(step) ? 'bg-[#5586ff]' : 'border-2 border-gray-300'}`}>
                    {isStepCompleted(step) && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  {step.title}
                  {step.subItems && (
                    expandedSection === step.id 
                      ? <ChevronDown className="ml-auto w-4 h-4" />
                      : <ChevronRight className="ml-auto w-4 h-4" />
                  )}
                </button>
                
                {step.subItems && expandedSection === step.id && (
                  <div className="ml-9 mt-1 border-l border-gray-200 pl-4">
                    {step.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onStepSelect(subItem.id)}
                        className={`w-full text-left p-2 text-sm ${
                          currentStep === subItem.id
                            ? 'text-[#5586ff] border-l-2 border-[#5586ff] -ml-[17px] pl-[15px]'
                            : 'text-gray-600 hover:bg-[#5586ff]/10'
                        }`}
                      >
                        <span className="mr-2" />
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                )}
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
              <div className="text-sm text-gray-600">
                Logged in as
              </div>
              <div className="text-sm text-blue-600">
                masughazal26@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

