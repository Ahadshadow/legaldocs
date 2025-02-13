"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HelpCircle } from "lucide-react"
import Sidebar from "../../../../../components/sidebarPdf"
import DocumentActions from "../../../../../components/document-actions"
import { SC } from "../../../../../service/Api/serverCall"
import { Input } from "../../../../../components/ui/input"
import { Textarea } from "../../../../../components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group-document"
import { Label } from "../../../../../components/ui/label"
import { Button } from "../../../../../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../components/ui/tooltip"
import { useToast } from "../../../../../components/ui/use-toast"
import { Checkbox } from "../../../../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"

// Function to transform documentData.steps into the format expected by Sidebar
const transformSteps = (steps) => {
  return steps.map((step) => ({
    id: step._id,
    title: step.name,
  }))
}

export default function LeaseAgreement() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("selectedId")

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({})
  const [documentData, setDocumentData] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchLeaseData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await SC.getCall({ url: `document/${selectedId}` })
        if (response.status) {
          setDocumentData(response.data.data)
          const initialFormData = {}
          if (response.data.data.steps && Array.isArray(response.data.data.steps)) {
            response.data.data.steps.forEach((step) => {
              if (step.fields && Array.isArray(step.fields)) {
                step.fields.forEach((field) => {
                  initialFormData[field._id] = ""
                })
              }
            })
          }
          setFormData(initialFormData)
          setCompletedSteps([])
        } else {
          setError(response.message || "Failed to fetch lease agreement data")
        }
      } catch (error) {
        setError(error.message || "Error fetching lease agreement data")
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedId) {
      fetchLeaseData()
    } else {
      setIsLoading(false)
    }
  }, [selectedId])

  const handleStepSelect = (stepId) => {
    if (documentData && documentData.steps) {
      const index = documentData.steps.findIndex((step) => step._id === stepId)
      if (index !== -1) {
        setCurrentStepIndex(index)
        setIsPreviewMode(false)
      }
    }
  }

  const handleInputChange = (fieldId, value) => {
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [fieldId]: value,
      }
      console.log("Updated formData:", newData)
      return newData
    })
  }

  const handleNext = () => {
    if (documentData && documentData.steps) {
      const currentStep = documentData.steps[currentStepIndex]
      if (!completedSteps.includes(currentStep._id)) {
        setCompletedSteps([...completedSteps, currentStep._id])
      }
      if (currentStepIndex < documentData.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      } else {
        setIsPreviewMode(true)
      }
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleSkip = () => {
    if (documentData && documentData.steps && currentStepIndex < documentData.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const responses = Object.entries(formData).map(([fieldId, value]) => ({
        field_id: fieldId,
        value: value,
      }))

      const payload = {
        document_id: selectedId,
        responses: responses,
      }

      const response = await SC.postCall({
        url: "submissions",
        data: payload,
      })

      if (response.status) {
        toast({
          title: "Success",
          description: "Document saved successfully",
        })
        router.push("/app/user-panel/documents")
      } else {
        throw new Error(response.message || "Failed to save the document")
      }
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackToForm = () => {
    setIsPreviewMode(false)
    setCurrentStepIndex(documentData.steps.length - 1)
  }

  const renderField = (field) => {
    // Check if the field has a dependency
    if (field.depends_on) {
      // Find the field that this field depends on
      const dependentField = currentStep.fields.find((f) => f.position === field.depends_on)
      if (dependentField) {
        const dependentFieldValue = formData[dependentField._id]
        console.log(
          `Field ${field.position} depends on ${field.depends_on} with value ${field.depends_on_value}. Current value: ${dependentFieldValue}`,
        )
        if (dependentFieldValue !== field.depends_on_value) {
          return null // Do not render the field if the condition is not met
        }
      }
    }

    switch (field.type) {
      case "text":
        return (
          <Input
            key={field._id}
            id={field._id}
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            required={field.required}
          />
        )

      case "textarea":
        return (
          <Textarea
            key={field._id}
            id={field._id}
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            required={field.required}
          />
        )

      case "radio":
        return (
          <RadioGroup
            key={field._id}
            value={formData[field._id] || ""}
            onValueChange={(value) => handleInputChange(field._id, value)}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field._id}-${index}`} />
                <Label htmlFor={`${field._id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "dropdown":
        return (
          <Select
            key={field._id}
            value={formData[field._id] || ""}
            onValueChange={(value) => handleInputChange(field._id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return field.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`${field._id}-${index}`}
              checked={Array.isArray(formData[field._id]) && formData[field._id].includes(option)}
              onCheckedChange={(checked) => {
                const currentValues = formData[field._id] || []
                const newValues = checked
                  ? [...currentValues, option]
                  : currentValues.filter((value) => value !== option)
                handleInputChange(field._id, newValues)
              }}
            />
            <Label htmlFor={`${field._id}-${index}`}>{option}</Label>
          </div>
        ))

      case "date":
        return (
          <Input
            key={field._id}
            id={field._id}
            type="date"
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            required={field.required}
          />
        )

      case "datetime":
        return (
          <Input
            key={field._id}
            id={field._id}
            type="datetime-local"
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            required={field.required}
          />
        )

      default:
        return <div key={field._id}>Unsupported field type: {field.type}</div>
    }
  }

  useEffect(() => {
    console.log("Form Data Updated:", formData)
  }, [formData])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>
  }

  if (!documentData || !documentData.steps || !Array.isArray(documentData.steps) || documentData.steps.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">No valid document data available</div>
  }

  const currentStep = documentData.steps[currentStepIndex]
  const progress =
    documentData.steps.length > 0 ? Math.round((completedSteps.length / documentData.steps.length) * 100) : 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        steps={transformSteps(documentData.steps)}
        currentStep={currentStep._id}
        completedSteps={completedSteps}
        onStepSelect={handleStepSelect}
        onPreview={handlePreview}
        progress={progress}
      />

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* <div className="mb-8">
            <DocumentActions />
          </div> */}

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {isPreviewMode ? (
                <div className="prose max-w-none">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Lease Agreement Preview</h1>
                    <div className="flex gap-2">
                      <Button onClick={handleBackToForm} variant="outline">
                        Back
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    {documentData.steps.flatMap((step) =>
                      step.fields.map((field) => (
                        <div key={field._id} className="mb-4">
                          <h3 className="font-semibold">{field.label}</h3>
                          <p className="whitespace-pre-wrap break-words">
                            {Array.isArray(formData[field._id])
                              ? formData[field._id].join(", ")
                              : formData[field._id] || "Not provided"}
                          </p>
                        </div>
                      )),
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">{currentStep.name}</h2>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleNext()
                      }}
                    >
                      <div className="space-y-4">
                        {currentStep.fields.map((field) => {
                          // Check dependencies before rendering the field container
                          if (field.depends_on) {
                            const dependentField = currentStep.fields.find((f) => f.position === field.depends_on)
                            if (dependentField) {
                              const dependentFieldValue = formData[dependentField._id]
                              if (dependentFieldValue !== field.depends_on_value) {
                                return null // Don't render the field container at all
                              }
                            }
                          }

                          return (
                            <div key={field._id} className="bg-white shadow-sm border border-gray-200 rounded-lg">
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Label htmlFor={field.position} className="text-sm font-medium">
                                    {field.label}
                                  </Label>
                                  {field.note && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <HelpCircle className="w-4 h-4 text-gray-400" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-64 text-sm">{field.note}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <div className="border-t border-gray-200 mt-2 pt-2">{renderField(field)}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <Button
                          type="button"
                          onClick={handleBack}
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ← Back
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={handleSkip}
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Skip
                          </Button>
                          <Button type="submit" className="bg-red-500 text-white hover:bg-red-600">
                            Next
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium">{currentStep.noteQuestion}</h3>
                  <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
                <div className="space-y-4 text-gray-500">
                  {/* <p className="text-sm font-medium">{currentStep.noteQuestion}</p> */}
                  <p className="text-sm">{currentStep.noteAnswer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

