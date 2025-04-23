"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { FormBuilder } from "../../../../../../adminComponents/form-builder"
import { DocumentEditor } from "../../../../../../adminComponents/document-editor"
import { Button } from "../../../../../../adminComponents/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useToast } from "../../../../../../adminComponents/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../adminComponents/ui/tabs"
import { DocumentPreview } from "../../../../../../adminComponents/document-preview"
import { SC } from "@/service/Api/serverCall"

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const templateId = params?.id as string
  const [documentRaw, setDocumentRaw] = useState(null)

  // State for form structure and document content
  const [formStructure, setFormStructure] = useState({ steps: [] })

  const [documentContent, setDocumentContent] = useState()
  const [formData, setFormData] = useState({})
  const [editorInstance, setEditorInstance] = useState(null)

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)

  // Function to generate a field key from a question text
  const generateFieldKey = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
  }

  // Function to add a field to the document content
  const addFieldToDocument = (fieldKey, fieldType = "input", cursorPosition = null) => {
    // Check if the field already exists in the document
    const fieldRegex = new RegExp(`\\{\\{%\\s*${fieldKey}\\s*\\|[^}]*%\\}\\}`, "g")
    const fieldExists = fieldRegex.test(documentContent)

    // If the field exists and no cursor position is provided, don't add a duplicate
    if (fieldExists && cursorPosition === null) {
      return
    }

    if (editorInstance && cursorPosition !== null) {
      // Format: {{% field_name | input | underscore %}}
      const fieldFormat = `{{% ${fieldKey} | ${fieldType} | underscore %}}`

      // Insert at cursor position without line breaks
      const { state } = editorInstance
      const { tr } = state
      tr.insertText(fieldFormat, cursorPosition)
      editorInstance.view.dispatch(tr)
    } else {
      // Fallback if no cursor position or editor instance
      setDocumentContent((prevContent) => {
        return prevContent + `{{% ${fieldKey} | ${fieldType} | underscore %}}`
      })
    }
  }

  // Function to remove a field from the document content
  const removeFieldFromDocument = (fieldKey) => {
    setDocumentContent((prevContent) => {
      // Remove field references with the exact format
      const fieldRegex = new RegExp(`\\{\\{%\\s*${fieldKey}\\s*\\|[^}]*%\\}\\}`, "g")
      let newContent = prevContent.replace(fieldRegex, "")

      // Remove conditional blocks that reference this field
      const conditionalRegex = new RegExp(`\\{%\\s*if\\s+${fieldKey}\\s*.*?%\\}.*?\\{%\\s*endif\\s*%\\}`, "gs")
      newContent = newContent.replace(conditionalRegex, "")

      // Update the editor immediately if it exists
      if (editorInstance) {
        setTimeout(() => {
          editorInstance.commands.setContent(newContent)
        }, 10)
      }

      return newContent
    })
  }

  // Function to add conditional content to the document
  const addConditionalToDocument = (fieldKey, condition, value, content, cursorPosition = null) => {
    if (editorInstance && cursorPosition !== null) {
      // Format: {% if field_name == "value" %}content{% endif %}
      const conditionalFormat = `{% if ${fieldKey} ${condition} "${value}" %}${content}{% endif %}`

      // Insert at cursor position without line breaks
      const { state } = editorInstance
      const { tr } = state
      tr.insertText(conditionalFormat, cursorPosition)
      editorInstance.view.dispatch(tr)
    } else {
      // Fallback if no cursor position or editor instance
      setDocumentContent((prevContent) => {
        return prevContent + `{% if ${fieldKey} ${condition} "${value}" %}${content}{% endif %}`
      })
    }
  }

  // Fetch template data on component mount
  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await SC.getCall({ url: `document/${templateId}` })

        console.log("response", response)

        // const [documentRaw, setDocumentRaw] = useState(null)

        if (response.status == 200 && response.data.data) {
          setDocumentRaw(response.data.data)
          setFormStructure({ steps: response.data.data?.steps || [] })
          setDocumentContent(response.data.data?.markup || "")
          setIsNewTemplate(false)
        } else {
          // If no data found, we're creating a new template
          setIsNewTemplate(true)
          toast({
            title: "Creating new template",
            description: "No existing template found. You're creating a new one.",
          })
        }
      } catch (err) {
        console.error("Error fetching template:", err)
        setError("Failed to load template. Creating a new one.")
        setIsNewTemplate(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplateData()
  }, [templateId, toast])

  // Save or update template
  const handleSaveTemplate = async () => {
    setIsSaving(true)
    setError(null)

    const templateData = {
      id: templateId,
      formStructure,
      documentContent,
    }


    console.log("templateData", templateData);
    
    try {
      // Use the same endpoint for both create and update
      // const response = await axios.post(`/api/templates/${templateId}`, templateData)

        const response = await SC.postCall({
          url: `document/${templateId}/update`,
          data: {
            ...templateData,
            markup: templateData.documentContent,
            steps: templateData.formStructure?.steps,
          },
        })
  

      toast({
        title: isNewTemplate ? "Template created" : "Template updated",
        description: "Your template has been saved successfully.",
      })

      // If this was a new template, update the state
      if (isNewTemplate) {
        setIsNewTemplate(false)
      }

      // Save to local storage as backup
      localStorage.setItem(
        "templateBuilderData",
        JSON.stringify({
          formStructure,
          documentContent,
        }),
      )

      return response.data
    } catch (err) {
      console.error("Error saving template:", err)
      setError("Failed to save template. Please try again.")

      toast({
        title: "Error saving template",
        description: "There was a problem saving your template. Please try again.",
        variant: "destructive",
      })

      return null
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const exportData = {
      formStructure,
      documentContent,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document-template-${templateId || "new"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Load saved data from local storage if available and no template ID
  useEffect(() => {
    if (!templateId) {
      const savedData = localStorage.getItem("templateBuilderData")
      if (savedData) {
        try {
          const { formStructure: savedFormStructure, documentContent: savedDocumentContent } = JSON.parse(savedData)
          setFormStructure(savedFormStructure)
          setDocumentContent(savedDocumentContent)
        } catch (error) {
          console.error("Error loading saved data:", error)
        }
      }
    }
  }, [templateId])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar with form builder */}
      <div className="w-[350px] border-r bg-background overflow-y-auto">
        {/* <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Form Builder</h2>
          <p className="text-sm text-muted-foreground">{isNewTemplate ? "Create a new template" : "Edit template"}</p>
        </div> */}
        <FormBuilder
          formStructure={formStructure}
          setFormStructure={setFormStructure}
          generateFieldKey={generateFieldKey}
          addFieldToDocument={addFieldToDocument}
          removeFieldFromDocument={removeFieldFromDocument}
          addConditionalToDocument={addConditionalToDocument}
          documentContent={documentContent}
          setDocumentContent={setDocumentContent}
          editorInstance={editorInstance}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Document Template Builder</h1>
          <div className="flex gap-2">
            <Button onClick={handleSaveTemplate} variant="default" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isNewTemplate ? "Create Template" : "Update Template"}
                </>
              )}
            </Button>
            {/* <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button> */}
          </div>
        </div>

        {/* {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}

        <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 border-b">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-y-auto p-0 m-0">
            <DocumentEditor
              content={documentContent}
              setContent={setDocumentContent}
              formStructure={formStructure}
              addFieldToDocument={addFieldToDocument}
              addConditionalToDocument={addConditionalToDocument}
              setEditorInstance={setEditorInstance}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-y-auto p-0 m-0">
            <DocumentPreview
              content={documentContent}
              formStructure={formStructure}
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
