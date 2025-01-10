'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export default function DisputeResolutionForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    disputeResolution: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Dispute Resolution</h2>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  How should disputes be resolved?
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64 text-sm">Choose the preferred method for resolving disputes between the landlord and tenant. This can affect the legal process and costs involved in case of disagreements.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="disputeResolution"
                      value="mediation"
                      checked={formData.disputeResolution === 'mediation'}
                      onChange={(e) => setFormData({ ...formData, disputeResolution: e.target.value })}
                      className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                    />
                    <span className="text-sm">Mediation</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="disputeResolution"
                      value="arbitration"
                      checked={formData.disputeResolution === 'arbitration'}
                      onChange={(e) => setFormData({ ...formData, disputeResolution: e.target.value })}
                      className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                    />
                    <span className="text-sm">Arbitration</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="disputeResolution"
                      value="court"
                      checked={formData.disputeResolution === 'court'}
                      onChange={(e) => setFormData({ ...formData, disputeResolution: e.target.value })}
                      className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                    />
                    <span className="text-sm">Court</span>
                  </label>
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

