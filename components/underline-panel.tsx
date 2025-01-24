'use client'

import { Button } from "../components/ui/button"
import { useDocument } from "../components/context/document-context"

export function UnderlinePanel() {
  const { editor, toggleUnderlinePanel } = useDocument()

  const handleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run()
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Underline</h3>
        </div>
        <p className="text-sm text-gray-500">
          Select text in the document and click 'Underline' to emphasize important information.
        </p>
        <Button onClick={handleUnderline} className="w-full">
          Underline Selected Text
        </Button>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={toggleUnderlinePanel}
        >
          Close Underline Panel
        </Button>
      </div>
    </div>
  )
}

