"use client";

import { Button } from "../components/ui/button";
import {
  Printer,
  Save,
  Undo,
  Redo,
  ChevronDown,
  FileDown,
  Loader,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDocument } from "./context/document-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SC } from "../service/Api/serverCall";

export function DocumentHeader({
  submissionId,
  isEmailMatch,
  documentsData,
  Heading,
}: {
  submissionId?: string;
  isEmailMatch?: boolean;
  documentsData?: any;
  Heading?: string;
}) {
  const { editor, activeTool, signatures, prepareForSubmission, email } =
    useDocument();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return () => {
      // Clean up localStorage when navigating away
      localStorage.removeItem("document-steps-definition");
    };
  }, []);

  useEffect(() => {
    const updateState = () => {
      setCanUndo(editor?.can().undo() ?? false);
      setCanRedo(editor?.can().redo() ?? false);
    };

    editor?.on("update", updateState);
    return () => {
      editor?.off("update", updateState);
    };
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  const handlePrint = useCallback(async () => {
    const content = document.querySelector(".document-viewer") as HTMLElement;
    if (!content) return;

    const pageHeight = 1056; // Height of an A4 page in pixels at 96 DPI
    const contentWidth = content.offsetWidth;
    const contentHeight = content.scrollHeight;

    const pdf = new jsPDF({
      unit: "px",
      format: "a4",
      orientation: "portrait",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const scale = pdfWidth / contentWidth;

    let verticalOffset = 0;
    while (verticalOffset < contentHeight) {
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        ignoreElements: (element) =>
          element.classList.contains("ProseMirror-gapcursor"),
        windowWidth: contentWidth,
        windowHeight: pageHeight,
        y: verticalOffset,
        height: pageHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      if (verticalOffset > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      verticalOffset += pageHeight;
    }

    pdf.save("document.pdf");
  }, []);

  const handleSave = useCallback(
    (format: "pdf" | "doc") => {
      if (editor) {
        // Select the entire document content, including signature fields
        const contentDiv = document.querySelector(
          ".document-viewer"
        ) as HTMLElement;

        if (!contentDiv) {
          console.error("Could not find .document-viewer element");
          alert("Error: Could not find document content. Please try again.");
          return;
        }

        const saveAs = (blob: Blob, filename: string) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        };

        if (format === "pdf") {
          html2canvas(contentDiv, {
            scale: 2,
            useCORS: true,
            logging: true,
            allowTaint: true,
            ignoreElements: (element) =>
              element.classList.contains("ProseMirror-gapcursor"),
          })
            .then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF("p", "mm", "a4");
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              const pageHeight = pdf.internal.pageSize.getHeight();

              let heightLeft = pdfHeight;
              let position = 0;
              let page = 1;

              while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;

                if (heightLeft > 0) {
                  pdf.addPage();
                  page++;
                }
              }

              const blob = pdf.output("blob");
              saveAs(blob, "document.pdf");
            })
            .catch((error) => {
              console.error("Error generating PDF:", error);
              alert(
                "Error generating PDF. Please check the console for details."
              );
            });
        } else {
          try {
            const content = editor
              .getHTML()
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r");
            const signaturesHtml = signatures
              .map(
                (sig) =>
                  `<div style="position:absolute;left:${sig.x}px;top:${
                    sig.y
                  }px;transform:rotate(${sig.rotation || 0}deg);z-index:1000;">
            ${
              sig.type === "draw" || sig.type === "upload"
                ? `<img src="${sig.content}" alt="Signature" style="max-width:200px;max-height:100px;" />`
                : `<span style="font-family:cursive;font-size:24px;">${sig.content}</span>`
            }
          </div>`
              )
              .join("");
            const fullContent = `<div style="position:relative;">${content}${signaturesHtml}</div>`;
            const blob = new Blob(
              [
                `<html><head><meta charset='utf-8'><title>Document</title></head><body>${fullContent}</body></html>`,
              ],
              { type: "application/msword" }
            );
            saveAs(blob, "document.doc");
          } catch (error) {
            console.error("Error generating DOC:", error);
            alert(
              "Error generating DOC. Please check the console for details."
            );
          }
        }
      } else {
        console.error("Editor is not available");
        alert("Error: Editor is not available. Please try again.");
      }
    },
    [editor, signatures]
  );

  // In the handleSubmit and handleSubmitAsAdmin functions, update the data preparation:
  const handleSubmit = useCallback(async () => {
    const data = prepareForSubmission();

    // Get the steps data from localStorage
    let stepsData = [];
    try {
      const savedSteps = localStorage.getItem("document-steps-definition");
      if (savedSteps) {
        stepsData = JSON.parse(savedSteps);
      }
    } catch (error) {
      console.error("Error preparing steps data:", error);
    }

    try {
      setSubmitLoading(true);
      const response = await SC.postCall({
        url: isEmailMatch ? "add-signature" : "send-signature-request",
        data: {
          ...data,
          content: data.content.replace(/\n/g, "\\n").replace(/\r/g, "\\r"),
          email,
          submission_id: submissionId,
          steps: stepsData, // Add steps data to the API payload
        },
      });

      if (response) {
        toast.success("Document submitted successfully");
        // Clear localStorage after successful submission
        localStorage.removeItem("document-steps-definition");
        router.push("/app/user-panel/mydocs");
      } else {
        throw new Error("Failed to submit document");
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("Failed to submit document");
    } finally {
      setSubmitLoading(false);
    }
  }, [prepareForSubmission, email, isEmailMatch, submissionId, router]);

  // Similarly update handleSubmitAsAdmin
  const handleSubmitAsAdmin = useCallback(async () => {
    const data = prepareForSubmission();

    // Get the steps data from localStorage
    let stepsData = [];
    try {
      const savedSteps = localStorage.getItem("document-steps-definition");
      if (savedSteps) {
        stepsData = JSON.parse(savedSteps);
      }
    } catch (error) {
      console.error("Error preparing steps data:", error);
    }

    try {
      const response = await SC.postCall({
        url: `document/${submissionId}/update`,
        data: {
          ...data,
          markup: data.content.replace(/\n/g, "\\n").replace(/\r/g, "\\r"),
          steps: stepsData, // Add steps data to the API payload
        },
      });

      if (response) {
        toast.success("Document submitted as admin successfully");
        localStorage.removeItem("document-steps-definition");
        router.push("/admin/documents/list");
      } else {
        throw new Error("Failed to submit document as admin");
      }
    } catch (error) {
      console.error("Error submitting document as admin:", error);
      toast.error("Failed to submit document as admin");
    }
  }, [prepareForSubmission, email, submissionId, router]);

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">
          {Heading || "Lease/Rental Agreement"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          disabled={!canUndo || activeTool === "signature"}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRedo}
          disabled={!canRedo || activeTool === "signature"}
        >
          <Redo className="h-4 w-4" />
        </Button>
        {/* <Button variant="outline" size="icon" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSave("pdf")}>
              Save as PDF
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleSave("doc")}>Save as DOC</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* {typeof window !== "undefined" && (
          <Button onClick={() => handleSave("pdf")}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )} */}
        {
          documentsData?.status != "Complete" &&   <div className="flex items-center gap-2">
          <Button disabled={submitLoading} onClick={handleSubmit}>
            {submitLoading ? (
              <div className="flex gap-1">
                <Loader className="animate-spin h-4 w-4" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
        }
       
      </div>
    </div>
  );
}
