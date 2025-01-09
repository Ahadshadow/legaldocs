'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

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
            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter street address"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter city"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter state"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-1">Zip Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter zip code"
                />
              </CardContent>
            </Card>
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

