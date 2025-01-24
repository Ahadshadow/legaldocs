'use client'

import { Button } from "../components/ui/button"
import { useDocument } from "../components/context/document-context"
import { Scissors } from 'lucide-react'

export function CutPanel() {
  const { editor, toggleCutPanel } = useDocument()

  const handleCut = () => {
    if (editor && editor.state) {
      const { from, to } = editor.state.selection;
      
      if (from !== undefined && to !== undefined && from !== to) {
        // Text is selected
        editor.chain().focus().deleteSelection().run();
      } else {
        // Check if an image is selected
        const node = editor.state.doc.nodeAt(from);
        if (node && node.type.name === 'image') {
          editor.chain().focus().deleteSelection().run();
        }
      }
    }
  };

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Cut</h3>
        </div>
        <p className="text-sm text-gray-500">
          Select text or an image in the document and click 'Cut' to remove it.
        </p>
        <Button onClick={handleCut} className="w-full">
          <Scissors className="h-4 w-4 mr-2" />
          Cut Selected Content
        </Button>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={toggleCutPanel}
        >
          Close Cut Panel
        </Button>
      </div>
    </div>
  )
}

