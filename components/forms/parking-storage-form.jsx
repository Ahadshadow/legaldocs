'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HelpCircle } from 'lucide-react'

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
            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-4">
                  Does the premises include any parking?
                </label>
                <RadioGroup
                  value={formData.hasParking}
                  onValueChange={(value) => setFormData({ ...formData, hasParking: value })}
                  className="space-y-3"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              </CardContent>
            </Card>

            {formData.hasParking === 'yes' && (
              <Card>
                <CardContent className="p-4">
                  <label className="block text-sm font-medium mb-4">
                    How many parking spaces are included?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2"
                    value={formData.parkingSpaces}
                    onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-4">
                  Does the premises include any storage space?
                </label>
                <RadioGroup
                  value={formData.hasStorage}
                  onValueChange={(value) => setFormData({ ...formData, hasStorage: value })}
                  className="space-y-3"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
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

