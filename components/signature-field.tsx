"use client"

import { useState, useRef } from "react"
import { Button } from "../components/ui/button"

interface SignatureFieldProps {
  label: string
  type: "tenant" | "landlord" | "custom"
  className?: string
  editable?: boolean
  onSignatureAdd?: (signature: { id: string; content: string; x: number; y: number }) => void
}

interface DraggableSignatureData {
  id: string
  content: string
  x: number
  y: number
  rotation: number
}

const DrawingCanvas = ({ onSave }: { onSave: (dataUrl: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

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

