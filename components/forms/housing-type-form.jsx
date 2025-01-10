'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export default function HousingTypeForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    housingType: '',
    includeBedrooms: 'no'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Housing Type</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    What is the type of housing?
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Select the type of housing that best describes the property being leased.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="space-y-3">
                    {['house', 'apartment', 'condominium', 'room', 'townhouse', 'duplex', 'semi-detached'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="housingType"
                          value={type}
                          checked={formData.housingType === type}
                          onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                          className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add your own here"
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Do you want to include the number of bedrooms and bathrooms?
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Choose whether to specify the number of bedrooms and bathrooms in the lease agreement.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="includeBedrooms"
                        value="yes"
                        checked={formData.includeBedrooms === 'yes'}
                        onChange={(e) => setFormData({ ...formData, includeBedrooms: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="includeBedrooms"
                        value="no"
                        checked={formData.includeBedrooms === 'no'}
                        onChange={(e) => setFormData({ ...formData, includeBedrooms: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
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

