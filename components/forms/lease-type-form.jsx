'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HelpCircle } from 'lucide-react'

export default function LeaseTypeForm({ onNext, onBack, onSkip }) {
  const [formData, setFormData] = useState({
    leaseType: '',
    startDate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Term</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">What is a Lease Agreement?</h3>
              <p className="text-sm text-gray-600">
                A lease agreement (or rental agreement) is a legally binding contract between a tenant and landlord that outlines the terms and conditions of renting a property.
                <br /><br />
                It specifies the rights and obligations of both parties, including details such as the rent amount, payment schedule, duration of the lease, and any rules or restrictions on the use of the property.
                <br /><br />
                By clearly defining these terms, a lease agreement helps prevent disputes and provides a framework for resolving issues that may arise during the tenancy, such as late rent payments, property damage, or breaches of lease terms.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-4">
                  What type of lease agreement is this?
                </label>
                <RadioGroup
                  value={formData.leaseType}
                  onValueChange={(value) => setFormData({ ...formData, leaseType: value })}
                  className="space-y-3"
                >
                  <RadioGroupItem value="standard">Standard Lease</RadioGroupItem>
                  <RadioGroupItem value="month-to-month">Month to Month Lease</RadioGroupItem>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-4">
                  When does the lease begin?
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2 border rounded-md"
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

