'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export default function TenantAddressForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Tenant's Address</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Street Address</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Enter the full street address of the tenant.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter street address"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">City</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Enter the city of the tenant's address.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">State</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Select the state of the tenant's address.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select state</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    {/* Add more states */}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Zip Code</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64 text-sm">Enter the zip code of the tenant's address.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter zip code"
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

