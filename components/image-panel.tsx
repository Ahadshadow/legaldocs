'use client'

import { Button } from "../components/ui/button"
import { ScrollArea } from "../components/ui/scroll-area-document"
import { ImageUploadDialog } from "./image-upload-dialog"
import { useDocument } from "../components/context/document-context"
import { Plus, Trash2 } from 'lucide-react'
import { useState } from "react"

export function ImagePanel() {
  const { editor, toggleImagePanel } = useDocument()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [images, setImages] = useState<{ id: string; src: string }[]>([])

  const handleImageUpload = (imageUrl: string) => {
    const newImage = {
      id: Math.random().toString(36).substring(7),
      src: imageUrl
    }
    setImages(prev => [...prev, newImage])
  }

  const handleImageDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const handleImageInsert = (src: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src }).run()
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Images</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Image
          </Button>

          <div className="grid gap-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="relative group border rounded-lg overflow-hidden"
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt="Uploaded content"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleImageInsert(image.src)}
                  >
                    Insert
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleImageDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={toggleImagePanel}
        >
          Close Image Panel
        </Button>
      </div>

      <ImageUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={(imageUrl) => {
          handleImageUpload(imageUrl)
          setIsUploadDialogOpen(false)
        }}
      />
    </div>
  )
}

