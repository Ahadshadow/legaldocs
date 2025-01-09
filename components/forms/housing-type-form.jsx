'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HelpCircle } from 'lucide-react'

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
            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-4">
                  What is the type of housing?
                </label>
                <RadioGroup
                  value={formData.housingType}
                  onValueChange={(value) => setFormData({ ...formData, housingType: value })}
                  className="space-y-3"
                >
                  <RadioGroupItem value="house">A house</RadioGroupItem>
                  <RadioGroupItem value="apartment">An apartment</RadioGroupItem>
                  <RadioGroupItem value="condominium">A condominium</RadioGroupItem>
                  <RadioGroupItem value="room">A room</RadioGroupItem>
                  <RadioGroupItem value="townhouse">A townhouse</RadioGroupItem>
                  <RadioGroupItem value="duplex">A duplex</RadioGroupItem>
                  <RadioGroupItem value="semi-detached">A semi-detached house</RadioGroupItem>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Add your own here"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                    />
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-4">
                  Do you want to include the number of bedrooms and bathrooms?
                </label>
                <RadioGroup
                  value={formData.includeBedrooms}
                  onValueChange={(value) => setFormData({ ...formData, includeBedrooms: value })}
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

