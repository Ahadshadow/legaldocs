import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Pen, Type, Upload, X } from "lucide-react"

interface SignatureFieldProps {
  label: string
  type: "tenant" | "landlord" | "custom"
  className?: string
  editable?: boolean
}

const DrawingCanvas = ({ onSave }: { onSave: (dataUrl: string) => void }) => {
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
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext("2d")
      context?.beginPath()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      context.stroke()
      context.beginPath()
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      onSave(dataUrl)
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
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        className="border border-gray-300"
      />
      <div className="flex mt-2">
        <Button onClick={handleClear} variant="outline" className="mr-2">
          Clear
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

const SignatureOptions = ({
  onClose,
  onSign,
}: { onClose: () => void; onSign: (type: "draw" | "text" | "image", content: string) => void }) => {
  const [activeOption, setActiveOption] = useState<"draw" | "text" | "image" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrawSave = (dataUrl: string) => {
    onSign("draw", dataUrl)
    onClose()
  }

  const handleTextSave = () => {
    const text = prompt("Enter your signature:")
    if (text) {
      onSign("text", text)
      onClose()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const maxWidth = 300
            const maxHeight = 150
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width
                width = maxWidth
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height
            ctx?.drawImage(img, 0, 0, width, height)
            const resizedDataUrl = canvas.toDataURL("image/png")
            onSign("image", resizedDataUrl)
            onClose()
          }
          img.src = event.target.result as string
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {activeOption === null ? (
        <>
          <Button onClick={() => setActiveOption("draw")}>
            <Pen className="mr-2 h-4 w-4" /> Draw
          </Button>
          <Button onClick={handleTextSave}>
            <Type className="mr-2 h-4 w-4" /> Type
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload Photo
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </>
      ) : activeOption === "draw" ? (
        <>
          <Button onClick={() => setActiveOption(null)} variant="outline" className="self-start">
            <X className="mr-2 h-4 w-4" /> Back
          </Button>
          <DrawingCanvas onSave={handleDrawSave} />
        </>
      ) : null}
    </div>
  )
}

export function SignatureField({ label, type, className = "", editable = true }: SignatureFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [signatureContent, setSignatureContent] = useState<string | null>(null)

  const handleSign = (signType: "draw" | "text" | "image", content: string) => {
    setSignatureContent(content)
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`w-full border-b ${editable ? "border-black" : "border-gray-300"}`}>
        {signatureContent && (
          <div className="py-2 flex justify-center items-end h-[150px]">
            {signatureContent.startsWith("data:image") ? (
              <img
                src={signatureContent || "/placeholder.svg"}
                alt="Signature"
                className="max-w-full max-h-full object-contain object-bottom"
              />
            ) : (
              <p className="text-center w-full" style={{ marginBottom: "0" }}>
                {signatureContent}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-1 text-sm">
        <span className="font-semibold">{label}</span>
        <span className="ml-1">Signature</span>
      </div>
      {editable && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <span className="text-xs text-blue-600 mt-1 cursor-pointer">
              {signatureContent ? "Change signature" : "Click to sign"}
            </span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Signature Method</DialogTitle>
            </DialogHeader>
            <SignatureOptions onClose={() => setIsOpen(false)} onSign={handleSign} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

