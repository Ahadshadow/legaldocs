"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ScrollArea } from "..//components/ui/scroll-area"
import { ZoomInIcon as Zoom } from "lucide-react"
import { Slider } from "../components/ui/slider"
import { useDocument } from "../components/context/document-context"
import { TiptapEditor } from "./tiptap-editor"
import { TextFormattingPanel } from "./text-formatting-panel"
import { CommentPanel } from "./comment-panel"
import { RedactPanel } from "./redact-panel"
import { UnderlinePanel } from "./underline-panel"
import { HighlightPanel } from "./highlight-panel"
import { ImagePanel } from "./image-panel"
import { CutPanel } from "./cut-panel"
import { SignaturePanel } from "./signature-panel"
import { DrawPanel } from "./draw-panel"
import { SignatureField } from "./signature-field"

export function DocumentViewer() {
  const [zoom, setZoom] = useState(100)
  const [currentPath, setCurrentPath] = useState<string>("")
  const {
    pages,
    updatePageContent,
    activePanel,
    setActivePanel,
    comments,
    addComment,
    toggleCommentPanel,
    editor,
    drawings,
    addDrawing,
    getDrawingsForPage,
    signatureFields,
  } = useDocument()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState("#000000")
  const [drawLineWidth, setDrawLineWidth] = useState(2)

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activePanel === "comment") {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      addComment(1, x, y) // Always add comment to the first (and only) page
    }
  }

  const handleCommentClick = (e: React.MouseEvent, commentId: string) => {
    e.stopPropagation()
    toggleCommentPanel(commentId)
  }

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (activePanel !== "draw" || !canvasRef.current) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCurrentPath(`M${x},${y}`)
      setIsDrawing(true)
    },
    [activePanel],
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || activePanel !== "draw" || !canvasRef.current) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCurrentPath((prevPath) => `${prevPath} L${x},${y}`)
    },
    [isDrawing, activePanel],
  )

  const stopDrawing = useCallback(() => {
    if (currentPath && activePanel === "draw") {
      addDrawing(1, currentPath, drawColor, drawLineWidth) // Always add drawing to the first (and only) page
    }
    setIsDrawing(false)
    setCurrentPath("")
  }, [currentPath, activePanel, addDrawing, drawColor, drawLineWidth])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)
      return () => window.removeEventListener("resize", resizeCanvas)
    }
  }, [zoom, activePanel])

  const renderActivePanel = () => {
    switch (activePanel) {
      case "format":
        return <TextFormattingPanel />
      case "comment":
        return <CommentPanel />
      case "redact":
        return <RedactPanel />
      case "underline":
        return <UnderlinePanel />
      case "highlight":
        return <HighlightPanel />
      case "image":
        return <ImagePanel />
      case "cut":
        return <CutPanel />
      case "signature":
        return <SignaturePanel />
      case "draw":
        return <DrawPanel setDrawColor={setDrawColor} setDrawLineWidth={setDrawLineWidth} />
      default:
        return null
    }
  }

  const page = pages[0] // We only use the first page now
  const pageComment = comments.find((comment) => comment.pageId === page.id)
  const pageDrawings = getDrawingsForPage(page.id)

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-2 border-b">
          <Zoom className="h-4 w-4" />
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={50}
            max={200}
            step={10}
            className="w-[200px]"
          />
          <span className="text-sm">{zoom}%</span>
        </div>
        <ScrollArea className="flex-1 bg-gray-100">
          <div className="flex flex-col items-center py-8">
            <div
              className="relative mb-8 bg-white document-viewer"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                cursor: activePanel === "comment" ? "crosshair" : "default",
                minHeight: "100%",
                height: "auto",
                width: "210mm", // A4 width
                padding: "20mm", // Add some padding
              }}
              onClick={(e) => {
                handlePageClick(e)
              }}
            >
              <div ref={contentRef} className="w-full h-full">
                <TiptapEditor
                  content={page.content}
                  onChange={(newContent) => updatePageContent(page.id, newContent)}
                  className="prose max-w-none h-full"
                />
              </div>
              <div className="relative mt-8 px-16">
                {Array.from({ length: Math.ceil(signatureFields.length / 2) }).map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-2 gap-4 mb-4">
                    {signatureFields.slice(rowIndex * 2, rowIndex * 2 + 2).map((field, idx) => (
                      <SignatureField key={idx} label={field.label} type="custom" editable={true} />
                    ))}
                  </div>
                ))}
              </div>
              {pageComment && (
                <div
                  className="absolute -ml-3 -mt-3"
                  style={{
                    left: `${pageComment.x}%`,
                    top: `${pageComment.y}%`,
                  }}
                  onClick={(e) => handleCommentClick(e, pageComment.id)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                  >
                    <path
                      d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                      fill="#2563EB"
                    />
                  </svg>
                </div>
              )}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                {pageDrawings.paths.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    stroke={pageDrawings.colors[index]}
                    strokeWidth={pageDrawings.lineWidths[index]}
                    fill="none"
                  />
                ))}
                {currentPath && activePanel === "draw" && (
                  <path d={currentPath} stroke={drawColor} strokeWidth={drawLineWidth} fill="none" />
                )}
              </svg>
              {activePanel === "draw" && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ zIndex: 11 }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      {renderActivePanel()}
    </div>
  )
}

