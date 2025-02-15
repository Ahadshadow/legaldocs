"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ScrollArea } from "../components/ui/scroll-area"
import { ZoomInIcon as Zoom } from "lucide-react"
import { Slider } from "../components/ui/slider"
import { useDocument } from "./context/document-context"
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
import { HorizontalLinePanel } from "./horizontal-line-panel"
import { DraggableSignature } from "./draggable-signature"
import "./document-viewer.css"

export function DocumentViewer({ isEmailMatch }: { isEmailMatch: boolean }) {
  const [zoom, setZoom] = useState(100)
  const [currentPath, setCurrentPath] = useState<string>("")
  const [newSignatures, setNewSignatures] = useState<string[]>([])
  const {
    pages,
    updatePageContent,
    activePanel,
    comments,
    addComment,
    toggleCommentPanel,
    editor,
    drawings,
    addDrawing,
    getDrawingsForPage,
    signatures,
    removeSignature,
    updateSignature,
    currentPage,
  } = useDocument()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState("#000000")
  const [drawLineWidth, setDrawLineWidth] = useState(2)

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    if (activePanel === "comment") {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      addComment(pageIndex + 1, x, y)
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

  const stopDrawing = useCallback(
    (pageIndex: number) => {
      if (currentPath && activePanel === "draw") {
        addDrawing(pageIndex + 1, currentPath, drawColor, drawLineWidth)
      }
      setIsDrawing(false)
      setCurrentPath("")
    },
    [currentPath, activePanel, addDrawing, drawColor, drawLineWidth],
  )

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
  }, [])

  const handleSignatureAdd = useCallback((signature: any) => {
    setNewSignatures((prev) => [...prev, signature.id])
  }, [])

  const renderActivePanel = () => {
    console.log("Active Panel:", activePanel)
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
        return <SignaturePanel onSignatureAdd={handleSignatureAdd} isEmailMatch={isEmailMatch} />
      case "draw":
        return <DrawPanel setDrawColor={setDrawColor} setDrawLineWidth={setDrawLineWidth} />
      case "horizontalLine":
        return <HorizontalLinePanel />
      default:
        return null
    }
  }

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
              // className="relative bg-white document-viewer pagination-wrapper border-none"
              className="relative bg-white document-viewer pagination-wrapper border-none whitespace-pre-wrap"
              style={{
                width: "794px", // A4 width
                minHeight: "1123px", // A4 height (optional, for visual reference)
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Light shadow for better visibility
                margin: "0 auto", // Center the document
                paddingTop: "150px", // Remove padding
                // paddingBottom: '500px'

              }}
              onClick={(e) => handlePageClick(e, 0)}
            >
              <TiptapEditor
                content={pages[0].content}
                // content={pages[0].content.replace(/\\n/g, "\n").replace(/\\r/g, "\r")}
                onChange={(newContent) => updatePageContent(pages[0].id, newContent)}
                // className="prose max-w-none w-full"
                className="prose max-w-none w-full whitespace-pre-wrap"
                readOnly={isEmailMatch}
              />
              {signatures.map((signature) => (
                <DraggableSignature
                  key={signature.id}
                  id={signature.id}
                  initialX={signature.x}
                  initialY={signature.y}
                  content={signature.content}
                  type={signature.type}
                  onDelete={removeSignature}
                  onPositionChange={(id, x, y) => updateSignature(id, { x, y })}
                  onRotationChange={(id, rotation) => updateSignature(id, { rotation })}
                  isEmailMatch={isEmailMatch}
                  isNewSignature={newSignatures.includes(signature.id)}
                />
              ))}
              {comments.map((pageComment) => (
                <div
                  key={pageComment.id}
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
              ))}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                {getDrawingsForPage(currentPage).paths.map((path, pathIndex) => (
                  <path
                    key={pathIndex}
                    d={path}
                    stroke={getDrawingsForPage(currentPage).colors[pathIndex]}
                    strokeWidth={getDrawingsForPage(currentPage).lineWidths[pathIndex]}
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
                  onMouseUp={() => stopDrawing(0)}
                  onMouseLeave={() => stopDrawing(0)}
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

