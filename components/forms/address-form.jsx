'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AddressForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Address</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">What does the premises address include?</h3>
              <p className="text-sm text-gray-600">
                This is the address and location of the premises being rented or leased out to the tenant(s). 
                Be sure to include any room or apartment number as part of the street address, if it applies 
                to your type of housing. The lease agreement will clearly state what is included as part of 
                the leased or rented premises.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 w-full">
                <label className="block text-sm font-medium mb-1">
                  What is the address of the property?
                </label>
                <input
                  type="text"
                  placeholder="Enter street address"
                  className="w-full p-2 border rounded-md"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 w-full">
                <label className="block text-sm font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full p-2 border rounded-md"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 w-full">
                <label className="block text-sm font-medium mb-1">
                  State
                </label>
                <select
                  className="w-full p-2 border rounded-md appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-[right_0.7em_top_50%] bg-no-repeat pr-[2.5em]"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Please select</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  {/* Add other states */}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 w-full">
                <label className="block text-sm font-medium mb-1">
                  Zip code
                </label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  className="w-full p-2 border rounded-md"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mt-8 w-full">
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

