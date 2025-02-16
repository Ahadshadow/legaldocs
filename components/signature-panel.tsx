"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { useDocument } from "./context/document-context"
import { FileSignature, Pen, Upload, Type } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { nanoid } from "nanoid"

interface Signature {
  id: string
  pageId: number
  type: "draw" | "type" | "upload"
  content: string
  x: number
  y: number
  rotation?: number
}

const DrawingCanvas = ({ onSave }: { onSave: (dataUrl: string, event: React.MouseEvent) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.lineWidth = 2
      context.strokeStyle = "#000000"
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.beginPath()
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      context.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleSave = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      onSave(dataUrl, e)
    }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        className="border border-gray-300 bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

interface NewSignature extends Omit<Signature, "id" | "rotation"> {
  id: string
  pageId: number
  x: number
  y: number
  type: "draw" | "type" | "upload"
  content: string
}

interface SignaturePanelProps {
  isEmailMatch: boolean
  onSignatureAdd: (signature: Signature) => void
}

export function SignaturePanel({ isEmailMatch, onSignatureAdd }: SignaturePanelProps) {
  const { setActivePanel, addSignature, removeSignature, signatures, email, currentPage } = useDocument()
  const [isDrawDialogOpen, setIsDrawDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [convertedImages, setConvertedImages] = useState<Record<string, string>>({})
  // const [newSignatures, setNewSignatures] = useState<string[]>([])
  const [newSignatures, setNewSignatures] = useState<Signature[]>([])


  useEffect(() => {
    console.log("SignaturePanel rendered")
    console.log("Current email:", email)
    console.log("Current signatures:", signatures)
  }, [email, signatures])

  useEffect(() => {
    const convertSignatures = async () => {
      const converted: Record<string, string> = {}
      // for (const signature of signatures) {
        for (const signature of newSignatures) {
        if (signature.type === "draw" || signature.type === "upload") {
          try {
            let base64Content = signature.content
            if (!base64Content.startsWith("data:image")) {
              base64Content = `data:image/png;base64,${base64Content}`
            }
            converted[signature.id] = base64Content
            console.log(`Processed signature ${signature.id}:`, base64Content.substring(0, 50) + "...")

            // Validate base64 string
            const img = new Image()
            img.onload = () => console.log(`Image ${signature.id} loaded successfully`)
            img.onerror = () => console.error(`Failed to load image ${signature.id}`)
            img.src = base64Content
          } catch (error) {
            console.error(`Error processing signature ${signature.id}:`, error)
          }
        }
      }
      setConvertedImages(converted)
      console.log("Converted images:", converted)
    }
    convertSignatures()
  // }, [signatures])
}, [newSignatures])


  const handleSignatureCreate = async (
    type: "draw" | "type" | "upload",
    content: string,
    event: React.MouseEvent | React.TouchEvent,
  ) => {
    const rect = document.querySelector(".document-viewer")?.getBoundingClientRect()
    if (rect) {
      const x = ("clientX" in event ? event.clientX : event.touches[0].clientX) - rect.left
      const y = ("clientY" in event ? event.clientY : event.touches[0].clientY) - rect.top
      const newSignature: NewSignature = {
        id: nanoid(),
        pageId: currentPage,
        type,
        content,
        x,
        y,
      }
      setNewSignatures((prev) => [...prev, newSignature])
      addSignature(newSignature)
      onSignatureAdd(newSignature)
      // setNewSignatures((prev) => [...prev, newSignature.id])
      // setNewSignatures((prev) => [...prev, newSignature])

       // Update convertedImages state for draw and upload types
       if (type === "draw" || type === "upload") {
        setConvertedImages((prev) => ({
          ...prev,
          [newSignature.id]: content,
        }))
      }

      setIsDrawDialogOpen(false)
      console.log(`Signature added:`, newSignature)

      // if (type === "draw" || type === "upload") {
      //   try {
      //     let base64Content = content
      //     if (!base64Content.startsWith("data:image")) {
      //       base64Content = `data:image/png;base64,${base64Content}`
      //     }
      //     setConvertedImages((prev) => {
      //       const updated = { ...prev, [newSignature.id]: base64Content }
      //       console.log("Updated converted images:", updated)
      //       return updated
      //     })

      //     // Validate base64 string
      //     const img = new Image()
      //     img.onload = () => console.log(`New image ${newSignature.id} loaded successfully`)
      //     img.onerror = () => console.error(`Failed to load new image ${newSignature.id}`)
      //     img.src = base64Content
      //   } catch (error) {
      //     console.error(`Error processing new signature ${newSignature.id}:`, error)
      //   }
      // }
    }
  }
// Update the handleImageUpload function
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        // Calculate center position of the document viewer
        const documentViewer = document.querySelector(".document-viewer")
        let clientX = window.innerWidth / 2
        let clientY = window.innerHeight / 2
        
        if (documentViewer) {
          const rect = documentViewer.getBoundingClientRect()
          clientX = rect.left + rect.width / 2
          clientY = rect.top + rect.height / 2
        }

        // Create synthetic event with calculated coordinates
        const syntheticEvent = {
          clientX,
          clientY,
        } as React.MouseEvent
        
        handleSignatureCreate("upload", event.target.result as string, syntheticEvent)
      }
    }
    reader.readAsDataURL(file)
  }
}

  const handleTextSignature = () => {
    const text = prompt("Enter your signature text:")
    if (text) {
      const event = { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as React.MouseEvent
      handleSignatureCreate("type", text, event)
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Add Signature</h3>
        <div className="space-y-2">
          <Button onClick={handleTextSignature} className="w-full">
            <Type className="mr-2 h-4 w-4" />
            Text
          </Button>
          <Button onClick={() => setIsDrawDialogOpen(true)} className="w-full">
            <Pen className="mr-2 h-4 w-4" />
            Draw
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        {/* {signatures.length > 0 && ( */}
        {newSignatures.length > 0 && (

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Existing Signatures</h3>
            {/* <p className="text-xs text-muted-foreground mb-2">
              {isEmailMatch
                ? "These signatures are present in the document"
                : "You can edit or delete these signatures"}
            </p> */}
            <div className="space-y-2">
              {/* {signatures.map((signature) => ( */}
              {newSignatures.map((signature) => (

                <div key={signature.id} className="flex flex-col items-start p-2 bg-muted rounded-md">
                  <div className="w-full h-20 flex items-center justify-center overflow-hidden bg-white rounded mb-2">
                    {signature.type === "draw" || signature.type === "upload" ? (
                      <img
                        src={convertedImages[signature.id] || "/placeholder.svg"}
                        alt="Signature"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          console.error("Error loading image:", e)
                          console.log("Problematic signature:", signature)
                          console.log("Image source:", (e.target as HTMLImageElement).src)
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                        }}
                      />
                    ) : (
                      <span className="text-lg font-semibold" style={{ fontFamily: "cursive" }}>
                        {signature.content}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Type: {signature.type}, Position: ({signature.x.toFixed(2)}, {signature.y.toFixed(2)})
                    </span>
                    {/* {(!isEmailMatch || newSignatures.includes(signature.id)) && ( */}
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => removeSignature(signature.id)}
                        onClick={() => {
                          removeSignature(signature.id)
                          setNewSignatures((prev) => prev.filter((sig) => sig.id !== signature.id))
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <FileSignature className="h-4 w-4" />
                      </Button>
                    {/* )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t">
        <Button className="w-full" variant="secondary" onClick={() => setActivePanel(null)}>
          Done
        </Button>
      </div>

      <Dialog open={isDrawDialogOpen} onOpenChange={setIsDrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draw Signature</DialogTitle>
          </DialogHeader>
          <DrawingCanvas onSave={(dataUrl, event) => handleSignatureCreate("draw", dataUrl, event)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

