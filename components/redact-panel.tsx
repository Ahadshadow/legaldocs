'use client'

import { Button } from "../components/ui/button"
import { useDocument } from "../components/context/document-context"
import { Scissors } from 'lucide-react';

export function RedactPanel() {
  const { editor, setActivePanel } = useDocument()

  const handleRedact = () => {
    if (editor) {
      editor.chain().focus().toggleMark('textStyle', { redacted: true }).run()
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Redact</h3>
        </div>
        <p className="text-sm text-gray-500">
          Select text or an image in the document and click 'Redact' to hide sensitive information.
        </p>
        <Button onClick={handleRedact} className="w-full">
          <Scissors className="h-4 w-4 mr-2" />
          Redact Selected Content
        </Button>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={() => setActivePanel(null)}
        >
          Close Redact Panel
        </Button>
      </div>
    </div>
  )
}

