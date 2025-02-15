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
  const [pageCount, setPageCount] = useState(1)

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
  useEffect(() => {
    if (editor) {
      const content = editor.view.dom
      const contentHeight = content.scrollHeight
      const pageHeight = 1123 // A4 height in pixels
      const calculatedPages = Math.ceil(contentHeight / pageHeight)
      setPageCount(calculatedPages)
    }
  }, [editor]) //

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
  const MIN_ZOOM = 50
  const MAX_ZOOM = 200
  const ZOOM_STEP = 10
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 p-2 border-b zoom-controls">
      <Zoom className="h-4 w-4" />
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={ZOOM_STEP}
            className="w-[200px]"
          />
          <span className="text-sm">{zoom}%</span>
        </div>
        <ScrollArea className="flex-1 bg-gray-100">
        <div className="flex flex-col items-center py-8 document-viewer" data-zoom={zoom}>
        {Array.from({ length: pageCount }).map((_, index) => (
              <div
                key={index}
                className="document-page"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.3s ease-in-out",
                  // padding: '20px 20px'
                }}
                onClick={(e) => handlePageClick(e, index)}
              >
                <div className="page-content">
                  <TiptapEditor
                    content={pages[0].content.replace(/\\n/g, "\n").replace(/\\r/g, "\r")}
                    onChange={(newContent) => updatePageContent(pages[0].id, newContent)}
                    className="prose max-w-none w-full whitespace-pre-wrap"
                    readOnly={false}
                  />

                  {/* Signatures for this page */}
                  {signatures
                    .filter((sig) => Math.floor(sig.y / 1123) === index)
                    .map((signature) => (
                      <DraggableSignature
                        key={signature.id}
                        id={signature.id}
                        initialX={signature.x}
                        initialY={signature.y % 1123} // Adjust Y position relative to page
                        content={signature.content}
                        type={signature.type}
                        onDelete={removeSignature}
                        onPositionChange={(id, x, y) => updateSignature(id, { x, y: y + index * 1123 })}
                        onRotationChange={(id, rotation) => updateSignature(id, { rotation })}
                        isEmailMatch={isEmailMatch}
                        isNewSignature={newSignatures.includes(signature.id)}
                      />
                    ))}

                  {/* Comments for this page */}
                  {comments
                    .filter((comment) => Math.floor(((comment.y / 100) * 1123) / 1123) === index)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="absolute -ml-3 -mt-3"
                        style={{
                          left: `${comment.x}%`,
                          top: `${comment.y % 1123}px`,
                        }}
                        onClick={(e) => handleCommentClick(e, comment.id)}
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

                  {/* Drawings for this page */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                    {getDrawingsForPage(index + 1).paths.map((path, pathIndex) => (
                      <path
                        key={pathIndex}
                        d={path}
                        stroke={getDrawingsForPage(index + 1).colors[pathIndex]}
                        strokeWidth={getDrawingsForPage(index + 1).lineWidths[pathIndex]}
                        fill="none"
                      />
                    ))}
                    {currentPath && activePanel === "draw" && index === currentPage - 1 && (
                      <path d={currentPath} stroke={drawColor} strokeWidth={drawLineWidth} fill="none" />
                    )}
                  </svg>

                  {/* Drawing canvas */}
                  {activePanel === "draw" && index === currentPage - 1 && (
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{ zIndex: 11 }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={() => stopDrawing(index)}
                      onMouseLeave={() => stopDrawing(index)}
                    />
                  )}

                  {/* Page break indicator (except for last page) */}
                  {/* {index < pageCount - 1 && <div className="page-break" />} */}
                  {index < pageCount - 1 && <div className="page-break editor-only" />}

                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      {renderActivePanel()}
    </div>
  )
}

