"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Copy } from "lucide-react"
import { useToast } from "./ui/use-toast"

export function JsonPreview({ formStructure }) {
  const { toast } = useToast()

  // Function to clean up the form structure for export
  const cleanFormStructure = (structure) => {
    // Create a deep copy to avoid modifying the original
    const cleanedStructure = JSON.parse(JSON.stringify(structure))

    // Process each step
    cleanedStructure.steps = cleanedStructure.steps.map((step) => {
      // Process each subsection
      step.subsections = step.subsections.map((subsection) => {
        // Process each question
        subsection.question = subsection.question.map((question) => {
          // Ensure all required fields are present
          return {
            id: question.id || `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            affectedQuestion: question.affectedQuestion || [],
            documentId: question.documentId || [],
            list: question.list || [],
            listDescription: question.listDescription || [],
            listSubType: question.listSubType || [],
            uniqueKeyName: question.uniqueKeyName,
            selectionValue: question.selectionValue || "text",
            isRequired: question.isRequired || false,
            isAutoFillAddress: question.isAutoFillAddress || false,
            defaultValue: question.defaultValue || null,
            formattedIDType: question.formattedIDType || null,
            type: question.type,
            questionToAsk: question.questionToAsk,
            description: question.description || null,
            placeholder: question.placeholder || null,
            FAQQuestion: question.FAQQuestion || null,
            FAQAnswer: question.FAQAnswer || null,
          }
        })

        return {
          name: subsection.name,
          question: subsection.question,
          FAQQuestion: subsection.FAQQuestion || null,
          FAQAnswer: subsection.FAQAnswer || null,
        }
      })

      return {
        name: step.name,
        subsections: step.subsections,
        FAQQuestion: step.FAQQuestion || null,
        FAQAnswer: step.FAQAnswer || null,
      }
    })

    return cleanedStructure
  }

  const handleCopy = () => {
    const cleanedStructure = cleanFormStructure(formStructure)
    navigator.clipboard.writeText(JSON.stringify(cleanedStructure, null, 2))
    toast({
      title: "Copied to clipboard",
      description: "The JSON structure has been copied to your clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>JSON Structure</CardTitle>
            <CardDescription>The data structure that will be used by your form renderer</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px] text-xs">
          {JSON.stringify(cleanFormStructure(formStructure), null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
