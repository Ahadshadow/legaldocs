"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useDocument } from "../components/context/document-context"
import { Eraser, Pencil } from "lucide-react"

interface DrawPanelProps {
  setDrawColor: (color: string) => void
  setDrawLineWidth: (width: number) => void
}

export function DrawPanel({ setDrawColor, setDrawLineWidth }: DrawPanelProps) {
  const { setActivePanel, clearDrawings, currentPage } = useDocument()
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(2)
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil")

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    setDrawColor(newColor)
  }

  const handleLineWidthChange = (newWidth: number) => {
    setLineWidth(newWidth)
    setDrawLineWidth(newWidth)
  }

  const handleClearDrawings = () => {
    clearDrawings(currentPage)
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Drawing Tools</h3>
        <div className="flex gap-2">
          <Button variant={tool === "pencil" ? "default" : "outline"} size="sm" onClick={() => setTool("pencil")}>
            <Pencil className="h-4 w-4 mr-2" />
            Pencil
          </Button>
          <Button variant={tool === "eraser" ? "default" : "outline"} size="sm" onClick={() => setTool("eraser")}>
            <Eraser className="h-4 w-4 mr-2" />
            Eraser
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <Input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Line Width</Label>
          <Input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => handleLineWidthChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="p-4 space-y-2">
        <Button onClick={handleClearDrawings} variant="outline" className="w-full">
          Clear All Drawings
        </Button>
        <Button onClick={() => setActivePanel(null)} className="w-full">
          Done
        </Button>
      </div>
    </div>
  )
}

