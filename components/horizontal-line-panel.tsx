"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useDocument } from "./context/document-context"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group-document"

export function HorizontalLinePanel() {
  const { editor, setActivePanel } = useDocument()
  const [widthValue, setWidthValue] = useState(100)
  const [widthUnit, setWidthUnit] = useState("%")
  const [thicknessValue, setThicknessValue] = useState(2)
  const [thicknessUnit, setThicknessUnit] = useState("px")
  const [color, setColor] = useState("#000000")
  const [borderRadiusValue, setBorderRadiusValue] = useState(0)
  const [borderRadiusUnit, setBorderRadiusUnit] = useState("px")
  const [marginTopValue, setMarginTopValue] = useState(1)
  const [marginTopUnit, setMarginTopUnit] = useState("em")
  const [marginBottomValue, setMarginBottomValue] = useState(1)
  const [marginBottomUnit, setMarginBottomUnit] = useState("em")
  const [justifyContent, setJustifyContent] = useState("center")

  useEffect(() => {
    if (editor) {
      const updateLineAttributes = () => {
        const attrs = editor.getAttributes("customHorizontalRule")
        if (attrs.width) {
          const [value, unit] = attrs.width.match(/(\d+)(\D+)/).slice(1)
          setWidthValue(Number.parseInt(value))
          setWidthUnit(unit)
        }
        if (attrs.thickness) {
          const [value, unit] = attrs.thickness.match(/(\d+)(\D+)/).slice(1)
          setThicknessValue(Number.parseInt(value))
          setThicknessUnit(unit)
        }
        if (attrs.color) setColor(attrs.color)
        if (attrs.borderRadius) {
          const [value, unit] = attrs.borderRadius.match(/(\d+)(\D+)/).slice(1)
          setBorderRadiusValue(Number.parseInt(value))
          setBorderRadiusUnit(unit)
        }
        if (attrs.marginTop) {
          const [value, unit] = attrs.marginTop.match(/(\d+)(\D+)/).slice(1)
          setMarginTopValue(Number.parseInt(value))
          setMarginTopUnit(unit)
        }
        if (attrs.marginBottom) {
          const [value, unit] = attrs.marginBottom.match(/(\d+)(\D+)/).slice(1)
          setMarginBottomValue(Number.parseInt(value))
          setMarginBottomUnit(unit)
        }
        if (attrs.justifyContent) setJustifyContent(attrs.justifyContent)
      }

      editor.on("selectionUpdate", updateLineAttributes)
      editor.on("update", updateLineAttributes)

      return () => {
        editor.off("selectionUpdate", updateLineAttributes)
        editor.off("update", updateLineAttributes)
      }
    }
  }, [editor])

  const handleInsertHorizontalLine = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run()
      updateHorizontalLine()
    }
  }

  const updateHorizontalLine = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .updateAttributes("customHorizontalRule", {
          width: `${widthValue}${widthUnit}`,
          thickness: `${thicknessValue}${thicknessUnit}`,
          color: color,
          borderRadius: `${borderRadiusValue}${borderRadiusUnit}`,
          marginTop: `${marginTopValue}${marginTopUnit}`,
          marginBottom: `${marginBottomValue}${marginBottomUnit}`,
          justifyContent: justifyContent,
        })
        .run()
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Horizontal Line</h3>
        </div>
        <Button onClick={handleInsertHorizontalLine} className="w-full">
          Insert Horizontal Line
        </Button>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                id="width"
                value={widthValue}
                onChange={(e) => setWidthValue(Number(e.target.value))}
                className="w-20"
              />
              <select value={widthUnit} onChange={(e) => setWidthUnit(e.target.value)} className="border rounded p-1">
                <option value="%">%</option>
                <option value="px">px</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="thickness">Thickness</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                id="thickness"
                value={thicknessValue}
                onChange={(e) => setThicknessValue(Number(e.target.value))}
                className="w-20"
              />
              <select
                value={thicknessUnit}
                onChange={(e) => setThicknessUnit(e.target.value)}
                className="border rounded p-1"
              >
                <option value="px">px</option>
                <option value="em">em</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-grow"
                placeholder="#000000 or rgb(0,0,0)"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alignment</Label>
            <RadioGroup value={justifyContent} onValueChange={(value) => setJustifyContent(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="start" id="left" />
                <Label htmlFor="left">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="end" id="right" />
                <Label htmlFor="right">Right</Label>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={updateHorizontalLine} className="w-full">
            Update Line
          </Button>
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button className="w-full" variant="secondary" onClick={() => setActivePanel(null)}>
          Close Horizontal Line Panel
        </Button>
      </div>
    </div>
  )
}

