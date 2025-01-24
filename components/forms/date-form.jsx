"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { useRouter } from "next/navigation"

export default function DateForm({ onNext, onBack, onSkip }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onNext) {
      
      onNext(formData)
    }
    

    router.push("/app/document-editor/documents")

  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Date</h2>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">What is the date of this agreement?</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64 text-sm">
                        This should be the date the agreement will be signed or become effective.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="space-y-2">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="text-sm text-gray-500 italic">This should be the date the agreement will be signed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button type="button" onClick={onBack || (() => {})} className="text-gray-600 hover:text-gray-800">
              ← Back
            </button>

            <div className="flex gap-2">
              <button type="button" onClick={onSkip || (() => {})} className="text-gray-600 hover:text-gray-800">
                Skip
              </button>
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

