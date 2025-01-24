"use client"

import { Button } from "../components/ui/button"
import { Printer, Save, Undo, Redo, ChevronDown } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDocument } from "../components/context/document-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

export function DocumentHeader() {
  const { editor, activeTool } = useDocument()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    const updateState = () => {
      setCanUndo(editor?.can().undo() ?? false)
      setCanRedo(editor?.can().redo() ?? false)
    }

    editor?.on("update", updateState)
    return () => {
      editor?.off("update", updateState)
    }
  }, [editor])

  const handleUndo = useCallback(() => {
    editor?.chain().focus().undo().run()
  }, [editor])

  const handleRedo = useCallback(() => {
    editor?.chain().focus().redo().run()
  }, [editor])

  const handlePrint = useCallback(() => {
    if (editor) {
      const content = editor.getHTML()
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Document</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  padding: 20px;
                }
              </style>
            </head>
            <body>
              ${content}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  }
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }, [editor])

  const handleSave = useCallback(
    (format: "pdf" | "doc") => {
      console.log("handleSave called with format:", format)
      if (editor) {
        // Select the entire document content, including signature fields
        const contentDiv = document.querySelector(".document-viewer") as HTMLElement

        if (!contentDiv) {
          console.error("Could not find .document-viewer element")
          alert("Error: Could not find document content. Please try again.")
          return
        }

        const saveAs = (blob: Blob, filename: string) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }

        if (format === "pdf") {
          html2canvas(contentDiv, {
            scale: 2,
            useCORS: true,
            logging: true, // Enable logging for debugging
            allowTaint: true,
            ignoreElements: (element) => element.classList.contains("ProseMirror-gapcursor"),
          })
            .then((canvas) => {
              console.log("HTML2Canvas successful")
              const imgData = canvas.toDataURL("image/png")
              const pdf = new jsPDF("p", "mm", "a4")
              const imgProps = pdf.getImageProperties(imgData)
              const pdfWidth = pdf.internal.pageSize.getWidth()
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
              pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
              const blob = pdf.output("blob")
              saveAs(blob, "document.pdf")
              console.log("PDF saved successfully")
            })
            .catch((error) => {
              console.error("Error generating PDF:", error)
              alert("Error generating PDF. Please check the console for details.")
            })
        } else {
          try {
            const content = contentDiv.innerHTML
            const blob = new Blob(
              [`<html><head><meta charset='utf-8'><title>Document</title></head><body>${content}</body></html>`],
              { type: "application/msword" },
            )
            saveAs(blob, "document.doc")
            console.log("DOC saved successfully")
          } catch (error) {
            console.error("Error generating DOC:", error)
            alert("Error generating DOC. Please check the console for details.")
          }
        }
      } else {
        console.error("Editor is not available")
        alert("Error: Editor is not available. Please try again.")
      }
    },
    [editor],
  )

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Lease/Rental Agreement</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleUndo} disabled={!canUndo || activeTool === "signature"}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleRedo} disabled={!canRedo || activeTool === "signature"}>
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSave("pdf")}>Save as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSave("doc")}>Save as DOC</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

