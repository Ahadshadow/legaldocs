'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function DateForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Date</h2>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-4">
              <label className="block text-sm font-medium mb-4">
                What is the date of this agreement?
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-sm text-gray-500 italic">
                  This should be the date the agreement will be signed
                </p>
              </div>
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
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

