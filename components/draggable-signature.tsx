"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Trash2, RotateCw, RotateCcw } from "lucide-react"
import type React from "react"
import { useDocument } from "./context/document-context"

interface DraggableSignatureProps {
  id: string
  initialX: number
  initialY: number
  content: string
  type: "draw" | "type" | "upload"
  onDelete: (id: string) => void
  onPositionChange: (id: string, x: number, y: number) => void
  onRotationChange: (id: string, rotation: number) => void
  isEmailMatch: boolean
  isNewSignature: boolean
}

export function DraggableSignature({
  id,
  initialX,
  initialY,
  content,
  type,
  onDelete,
  onPositionChange,
  onRotationChange,
  isEmailMatch,
  isNewSignature,
}: DraggableSignatureProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [size, setSize] = useState({ width: 200, height: 100 })
  const [rotation, setRotation] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const initialSize = useRef({ width: 0, height: 0 })
  const { updateSignature } = useDocument()


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        const newPosition = {
          x: position.x + dx,
          y: position.y + dy,
        }
        setPosition(newPosition)
        updateSignature(id, { x: newPosition.x, y: newPosition.y })
        onPositionChange(id, newPosition.x, newPosition.y)
        dragStart.current = { x: e.clientX, y: e.clientY }
      } else if (isResizing && elementRef.current) {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        const aspectRatio = initialSize.current.width / initialSize.current.height
        const newWidth = Math.max(100, initialSize.current.width + dx)
        const newHeight = newWidth / aspectRatio

        setSize({
          width: newWidth,
          height: newHeight,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
}, [id, isDragging, isResizing, onPositionChange, position.x, position.y, updateSignature])


  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    initialSize.current = { width: size.width, height: size.height }
  }

  const handleRotate = (direction: "clockwise" | "counterclockwise") => {
    const delta = direction === "clockwise" ? 90 : -90
    const newRotation = (rotation + delta) % 360
    setRotation(newRotation)
    onRotationChange(id, newRotation)
  }

  const canEdit = !isEmailMatch || isNewSignature

  return (
    <div
    ref={elementRef}
    className={`signature-item absolute cursor-${canEdit ? "move" : "default"}`}
    
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      transform: `rotate(${rotation}deg)`,
      zIndex: 1001, // Ensure it's above the signature layer
    }}
      onMouseDown={canEdit ? handleMouseDown : undefined}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative w-full h-full">
        {type === "draw" || type === "upload" ? (
          <img
            src={content || "/placeholder.svg"}
            alt="Signature"
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-cursive p-2">{content}</div>
        )}

        {showControls && canEdit && (
          <>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white border rounded-md shadow-sm p-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRotate("counterclockwise")}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRotate("clockwise")}>
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleResizeStart}>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-sm" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

