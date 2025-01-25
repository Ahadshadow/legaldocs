"use client"

import { Dialog, DialogContent } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { UploadIcon } from "lucide-react"
import { useRef, useState } from "react"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    // Handle the uploaded files here
    console.log("Files:", files)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Upload Your File</h2>
          <p className="text-gray-600 mb-6">
            Add documents for editing, converting, e-signing, and sharing across all your devices.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragging ? "border-blue-600 bg-blue-50" : "border-gray-200"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <UploadIcon className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-sm font-medium mb-2">Drag and drop to upload</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              multiple
            />
            <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
              Upload from device
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Only PDF, JPG, PNG, Word, Excel (excluding .csv), and PowerPoint ({"<"} 100 MB) allowed
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

