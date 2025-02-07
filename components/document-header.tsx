"use client"

import { Button } from "../components/ui/button"
import { Printer, Save, Undo, Redo, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useDocument } from "./context/document-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { useCallback } from "react"
import { toast } from "sonner"
import { SC } from "../service/Api/serverCall"

export function DocumentHeader({submissionId}) {
  const { editor, activeTool, signatures, prepareForSubmission, email } = useDocument()
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
            logging: true,
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
              const pageHeight = pdf.internal.pageSize.getHeight()

              let heightLeft = pdfHeight
              let position = 0
              let page = 1

              while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
                heightLeft -= pageHeight
                position -= pageHeight

                if (heightLeft > 0) {
                  pdf.addPage()
                  page++
                }
              }

              const blob = pdf.output("blob")
              saveAs(blob, "document.pdf")
              console.log(`PDF saved successfully with ${page} page(s)`)
            })
            .catch((error) => {
              console.error("Error generating PDF:", error)
              alert("Error generating PDF. Please check the console for details.")
            })
        } else {
          try {
            const content = contentDiv.innerHTML
            const signaturesHtml = signatures
              .map(
                (sig) =>
                  `<div style="position:absolute;left:${sig.x}px;top:${sig.y}px;transform:rotate(${sig.rotation || 0}deg);z-index:1000;">
            ${
              sig.type === "draw" || sig.type === "upload"
                ? `<img src="${sig.content}" alt="Signature" style="max-width:200px;max-height:100px;" />`
                : `<span style="font-family:cursive;font-size:24px;">${sig.content}</span>`
            }
          </div>`,
              )
              .join("")
            const fullContent = `<div style="position:relative;">${content}${signaturesHtml}</div>`
            const blob = new Blob(
              [`<html><head><meta charset='utf-8'><title>Document</title></head><body>${fullContent}</body></html>`],
              { type: "application/msword" },
            )
            saveAs(blob, "document.doc")
            console.log("DOC saved successfully with signatures")
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
    [editor, signatures],
  )
  const handleSubmit = useCallback(async () => {
    console.log("Current email:", email);
    const data = prepareForSubmission();
    console.log("Complete data payload for API:", data);
    try {
      const response = await SC.postCall({
        url: "send-signature-request",
        data: {
          ...data,
          email,
          submission_id : submissionId,
        },
      })
  
  
      if (response) {
        toast.success("Document submitted successfully");
      } else {
        throw new Error("Failed to submit document");
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("Failed to submit document");
    }
  }, [prepareForSubmission, email]);
  

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
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  )
}

