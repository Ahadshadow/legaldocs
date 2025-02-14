import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  formData: any
  documentData: any
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, formData, documentData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="max-w-3xl mx-auto space-y-6">
              {documentData.map((section: any, sectionIndex: number) => (
                <div key={sectionIndex} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
                  {section.subsections.map((subsection: any, subsectionIndex: number) => (
                    <div key={subsectionIndex} className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">{subsection.name}</h3>
                      {subsection.question.map((field: any) => (
                        <div key={field.uniqueKeyName} className="mb-4">
                          <p className="font-medium">{field.questionToAsk}</p>
                          <p className="mt-1">
                            {Array.isArray(formData[field.uniqueKeyName])
                              ? formData[field.uniqueKeyName].join(", ")
                              : formData[field.uniqueKeyName] || "Not provided"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewModal

