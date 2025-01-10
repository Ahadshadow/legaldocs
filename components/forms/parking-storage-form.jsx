'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export default function ParkingStorageForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    hasParking: 'no',
    parkingSpaces: '',
    hasStorage: 'no'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Parking and Storage</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Does the premises include any parking?
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Specify if the rental property includes parking facilities.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasParking"
                        value="yes"
                        checked={formData.hasParking === 'yes'}
                        onChange={(e) => setFormData({ ...formData, hasParking: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasParking"
                        value="no"
                        checked={formData.hasParking === 'no'}
                        onChange={(e) => setFormData({ ...formData, hasParking: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {formData.hasParking === 'yes' && (
              <div className="bg-white shadow-sm border border-gray-200">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      How many parking spaces are included?
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64 text-sm">Enter the number of parking spaces available with the rental property.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g., 2"
                      value={formData.parkingSpaces}
                      onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Does the premises include any storage space?
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Indicate if the rental property includes any storage facilities.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasStorage"
                        value="yes"
                        checked={formData.hasStorage === 'yes'}
                        onChange={(e) => setFormData({ ...formData, hasStorage: e.target.value })}
                        className="h-4 w-4 border-gray-300 text-[#5586ff] focus:ring-[#5586ff]"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasStorage"
                        value="no"
                        checked={formData.hasStorage === 'no'}
                        onChange={(e) => setFormData({ ...formData, hasStorage: e.target.value })}
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

