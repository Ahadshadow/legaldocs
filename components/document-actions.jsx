'use client'

import { Download, FileText, Printer, PenTool } from 'lucide-react'

export default function DocumentActions() {
  const actions = [
    { id: 'pdf', icon: Download, label: 'PDF' },
    { id: 'word', icon: FileText, label: 'Word' },
    { id: 'print', icon: Printer, label: 'Print' },
    { id: 'e-sign', icon: PenTool, label: 'E-Sign' },
  ]

  return (
    <div className="w-full lg:w-2/3">
      <div className="flex flex-col sm:flex-row gap-2">
        {actions.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50"
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

