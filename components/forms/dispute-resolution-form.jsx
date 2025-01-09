'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
          <Card>
            <CardContent className="p-4">
              <label className="block text-sm font-medium mb-4">
                How should disputes be resolved?
              </label>
              <RadioGroup
                value={formData.disputeResolution}
                onValueChange={(value) => setFormData({ ...formData, disputeResolution: value })}
                className="space-y-3"
              >
                <RadioGroupItem value="mediation">Mediation</RadioGroupItem>
                <RadioGroupItem value="arbitration">Arbitration</RadioGroupItem>
                <RadioGroupItem value="court">Court</RadioGroupItem>
              </RadioGroup>
            </CardContent>
          </Card>

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

