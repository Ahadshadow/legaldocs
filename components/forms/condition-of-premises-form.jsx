'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export default function ConditionOfPremisesForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    conditionDescription: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Condition of Premises</h2>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Describe the condition of the premises:
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64 text-sm">Provide a detailed description of the current condition of the rental property.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <textarea
                  value={formData.conditionDescription}
                  onChange={(e) => setFormData({ ...formData, conditionDescription: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Describe the condition of the premises..."
                />
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

