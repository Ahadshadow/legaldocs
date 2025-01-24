"use client"

import { Button } from "../components/ui/button"
import { useDocument } from "../components/context/document-context"
import { useState } from "react"
import { toast } from "sonner"

export function HighlightPanel() {
  const { editor, setActivePanel } = useDocument()
  const [highlightColor, setHighlightColor] = useState("#ffff00")

  const handleHighlight = () => {
    if (editor) {
      if (editor.state.selection.empty) {
        toast.error("Please select some text to highlight")
        return
      }
      editor.chain().focus().toggleHighlight({ color: highlightColor }).run()
      toast.success("Text highlighted successfully")
    } else {
      toast.error("Editor is not available")
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Highlight</h3>
        </div>
        <p className="text-sm text-gray-500">
          Select text in the document and click 'Highlight' to emphasize important information.
        </p>
        <div className="flex items-center space-x-2">
          <label htmlFor="highlightColor" className="text-sm">
            Color:
          </label>
          <input
            type="color"
            id="highlightColor"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            className="w-8 h-8 border-none"
          />
        </div>
        <Button onClick={handleHighlight} className="w-full">
          Highlight Selected Text
        </Button>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button className="w-full" variant="secondary" onClick={() => setActivePanel(null)}>
          Close Highlight Panel
        </Button>
      </div>
    </div>
  )
}

