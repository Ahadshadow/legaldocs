'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export default function LeaseTypeForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    leaseType: '',
    startDate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Term</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    What type of lease agreement is this?
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Choose the type of lease agreement that best fits your situation. A standard lease is for a fixed term, while a month-to-month lease offers more flexibility.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="leaseType"
                        value="standard"
                        checked={formData.leaseType === 'standard'}
                        onChange={(e) => setFormData({ ...formData, leaseType: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">Standard Lease</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="leaseType"
                        value="month-to-month"
                        checked={formData.leaseType === 'month-to-month'}
                        onChange={(e) => setFormData({ ...formData, leaseType: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">Month to Month Lease</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    When does the lease begin?
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Select the start date of the lease. This is typically the day the tenant can move in and start occupying the property.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSkip}
                className="text-gray-600 hover:text-gray-800"
              >
                Skip
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

