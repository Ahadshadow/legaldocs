"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useDocument } from "../components/context/document-context"
import { FileSignature, Plus, Trash } from "lucide-react"

export function SignaturePanel() {
  const { setActivePanel, addSignatureField, removeSignatureField, signatureFields } = useDocument()
  const [newLabel, setNewLabel] = useState("")

  const handleAddSignature = () => {
    if (newLabel.trim()) {
      addSignatureField(newLabel.trim())
      setNewLabel("")
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Add Signature Fields</h3>
        <div className="flex items-center space-x-2">
          <Input placeholder="Enter signature label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Button onClick={handleAddSignature}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {signatureFields.map((field, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{field.label}</span>
              <Button variant="ghost" size="sm" onClick={() => removeSignatureField(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Add signature fields for each signer. They will be placed on the last page of the document.
        </p>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button className="w-full" variant="secondary" onClick={() => setActivePanel(null)}>
          Done
        </Button>
      </div>
    </div>
  )
}

