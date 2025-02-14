"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HelpCircle } from "lucide-react"
import Sidebar from "../../../../../components/sidebarPdf"
import { Input } from "../../../../../components/ui/input"
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group-document"
import { Label } from "../../../../../components/ui/label"
import { Button } from "../../../../../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../components/ui/tooltip"
import { useToast } from "../../../../../components/ui/use-toast"
import { Checkbox } from "../../../../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { SC } from "../../../../../service/Api/serverCall"

export default function DynamicForm({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("selectedId")

  const [documentData, setDocumentData] = useState(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [affectingQuestions, setAffectingQuestions] = useState([])
  const [breakdownTypes, setBreakdownTypes] = useState({})
  const [breakdownQuestion, setBreakdownQuestion] = useState(null)

  useEffect(() => {
    const fetchDocumentData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await SC.getCall({ url: `document/${selectedId}` })
        if (response.status) {
          setDocumentData(response.data.data.steps)
          initializeFormData(response.data.data.steps)
        } else {
          setError(response.message || "Failed to fetch document data")
        }
      } catch (error) {
        setError(error.message || "Error fetching document data")
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedId) {
      fetchDocumentData()
    }
  }, [selectedId])

  useEffect(() => {
    if (documentData) {
      console.log("Questions with affected questions:")
      documentData.forEach((section) => {
        section.subsections.forEach((subsection) => {
          subsection.question.forEach((question) => {
            if (question.affectedQuestion && question.affectedQuestion.length > 0) {
              console.log(`${question.uniqueKeyName} (ID: ${question.id}):`)
              question.affectedQuestion.forEach((affectedQ) => {
                const affectedField = findFieldById(documentData, affectedQ.id)
                if (affectedField) {
                  console.log(`  - ${affectedField.questionToAsk} (ID: ${affectedField.id})`)
                  console.log(`    Values: ${JSON.stringify(affectedQ.value)}`)
                  console.log(`    Show Only If This Match Selected: ${affectedQ.showOnlyIfThisMatchSelected}`)
                }
              })
            }
          })
        })
      })

      // Find the question that affects the breakdown subsections
      const breakdownQuestion = documentData.flatMap((section) =>
        section.subsections.flatMap((subsection) =>
          subsection.question.find(
            (question) =>
              question.affectedQuestion &&
              question.affectedQuestion.some(
                (affected) =>
                  affected.showOnlyIfThisMatchSelected && affected.showOnlyIfThisMatchSelected.includes("or"),
              ),
          ),
        ),
      )[0]

      if (breakdownQuestion) {
        const extractedBreakdownTypes = {}
        breakdownQuestion.list.forEach((item) => {
          extractedBreakdownTypes[item.name] = item.name.toLowerCase()
        })
        setBreakdownTypes(extractedBreakdownTypes)
        setBreakdownQuestion(breakdownQuestion)
      }
    }
  }, [documentData])

  useEffect(() => {
    if (documentData) {
      const questions = documentData.flatMap((section) =>
        section.subsections.flatMap((subsection) =>
          subsection.question.filter((q) => q.affectedQuestion && q.affectedQuestion.length > 0),
        ),
      )
      setAffectingQuestions(questions.map((q) => ({ id: q.id, key: q.uniqueKeyName })))
    }
  }, [documentData])

  const initializeFormData = (data) => {
    const initialData = {}
    data.forEach((section) => {
      section.subsections.forEach((subsection) => {
        subsection.question.forEach((field) => {
          initialData[field.uniqueKeyName] = field.type === "checkboxes" ? [] : ""
        })
      })
    })
    setFormData(initialData)
  }

  const findFieldById = (data, id) => {
    for (const section of data) {
      for (const subsection of section.subsections) {
        const field = subsection.question.find((q) => q.id === id)
        if (field) return field
      }
    }
    return null
  }

  const shouldHideQuestion = (question) => {
    for (const affectingQ of affectingQuestions) {
      const affectingField = findFieldById(documentData, affectingQ.id)
      if (affectingField && affectingField.affectedQuestion) {
        const affectedQ = affectingField.affectedQuestion.find((q) => q.id === question.id)
        if (affectedQ) {
          const currentValue = formData[affectingQ.key]
          if (Array.isArray(currentValue)) {
            // For checkboxes (pay_breakdown)
            if (!currentValue.some((value) => affectedQ.value.includes(value))) {
              return true
            }
          } else {
            // For other input types
            if (!affectedQ.value.includes(currentValue)) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  const handleStepSelect = (stepIndex) => {
    setCurrentStepIndex(stepIndex)
    setCurrentSubsectionIndex(0)
    setIsPreviewMode(false)
  }

  const handleSubsectionSelect = (stepIndex, subsectionIndex) => {
    setCurrentStepIndex(stepIndex)
    setCurrentSubsectionIndex(subsectionIndex)
    setIsPreviewMode(false)
  }

  const handleInputChange = (fieldId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }))
  }

  const handleNextStep = () => {
    let nextStepIndex = currentStepIndex + 1
    while (
      nextStepIndex < documentData.length &&
      !documentData[nextStepIndex].subsections.some((sub) => sub.question && sub.question.length > 0)
    ) {
      nextStepIndex++
    }
    if (nextStepIndex < documentData.length) {
      setCurrentStepIndex(nextStepIndex)
      setCurrentSubsectionIndex(0)
    } else {
      setIsPreviewMode(true)
    }
  }

  const handleNext = () => {
    const currentSection = documentData[currentStepIndex]
    if (currentSubsectionIndex < currentSection.subsections.length - 1) {
      let nextSubsectionIndex = currentSubsectionIndex + 1
      while (
        nextSubsectionIndex < currentSection.subsections.length &&
        (!currentSection.subsections[nextSubsectionIndex].question ||
          currentSection.subsections[nextSubsectionIndex].question.length === 0)
      ) {
        nextSubsectionIndex++
      }
      if (nextSubsectionIndex < currentSection.subsections.length) {
        setCurrentSubsectionIndex(nextSubsectionIndex)
      } else {
        handleNextStep()
      }
    } else {
      handleNextStep()
    }
    setCompletedSteps([...completedSteps, { stepIndex: currentStepIndex, subsectionIndex: currentSubsectionIndex }])
  }

  const handlePrevStep = () => {
    let prevStepIndex = currentStepIndex - 1
    while (
      prevStepIndex >= 0 &&
      !documentData[prevStepIndex].subsections.some((sub) => sub.question && sub.question.length > 0)
    ) {
      prevStepIndex--
    }
    if (prevStepIndex >= 0) {
      setCurrentStepIndex(prevStepIndex)
      const lastSubsectionIndex = documentData[prevStepIndex].subsections.length - 1
      setCurrentSubsectionIndex(lastSubsectionIndex)
    }
  }

  const handleBack = () => {
    if (currentSubsectionIndex > 0) {
      let prevSubsectionIndex = currentSubsectionIndex - 1
      while (
        prevSubsectionIndex >= 0 &&
        (!currentSection.subsections[prevSubsectionIndex].question ||
          currentSection.subsections[prevSubsectionIndex].question.length === 0)
      ) {
        prevSubsectionIndex--
      }
      if (prevSubsectionIndex >= 0) {
        setCurrentSubsectionIndex(prevSubsectionIndex)
      } else {
        handlePrevStep()
      }
    } else {
      handlePrevStep()
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
  }

  const handleSave = async () => {
    try {
      // Deep clone the document data to avoid mutating the original
      const submissionData = JSON.parse(JSON.stringify(documentData))

      // Add answers to the questions
      submissionData.forEach((section) => {
        section.subsections.forEach((subsection) => {
          subsection.question.forEach((question) => {
            const answer = formData[question.uniqueKeyName]
            if (answer !== undefined) {
              question.answer = answer
            }
          })
        })
      })

      // Prepare the final payload
      const payload = {
        steps: submissionData,
        document_id: selectedId,
      }

      const response = await SC.postCall({
        url: `document/${selectedId}/submit`,
        data: payload,
      })

      if (response.status) {
        toast({
          title: "Success",
          description: "Document saved successfully",
        })
        router.push("/app/user-panel/documents")
      } else {
        throw new Error(response.message || "Failed to save document")
      }
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderField = (field) => {
    switch (field.type) {
      case "textField":
        return (
          <Input
            key={field.uniqueKeyName}
            id={field.uniqueKeyName}
            type={field.selectionValue === "date" ? "date" : "text"}
            value={formData[field.uniqueKeyName] || ""}
            onChange={(e) => handleInputChange(field.uniqueKeyName, e.target.value)}
            required={field.isRequired}
            placeholder={field.placeholder}
          />
        )
      case "dropdownList":
        return (
          <Select
            key={field.uniqueKeyName}
            value={formData[field.uniqueKeyName] || ""}
            onValueChange={(value) => handleInputChange(field.uniqueKeyName, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.list.map((option) => (
                <SelectItem key={option.name} value={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "radioButton":
        return (
          <RadioGroup
            key={field.uniqueKeyName}
            value={formData[field.uniqueKeyName] || ""}
            onValueChange={(value) => handleInputChange(field.uniqueKeyName, value)}
          >
            {field.list.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.name} id={`${field.uniqueKeyName}-${index}`} />
                <Label htmlFor={`${field.uniqueKeyName}-${index}`}>{option.name}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "checkboxes":
        return (
          <div key={field.uniqueKeyName}>
            {field.list.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 my-2">
                <Checkbox
                  id={`${field.uniqueKeyName}-${index}`}
                  checked={(formData[field.uniqueKeyName] || []).includes(option.name)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.uniqueKeyName] || []
                    const newValues = checked
                      ? [...currentValues, option.name]
                      : currentValues.filter((value) => value !== option.name)
                    handleInputChange(field.uniqueKeyName, newValues)
                  }}
                />
                <Label htmlFor={`${field.uniqueKeyName}-${index}`}>{option.name}</Label>
              </div>
            ))}
          </div>
        )
      default:
        return <div key={field.uniqueKeyName}>Unsupported field type: {field.type}</div>
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  if (!documentData) {
    return <div className="flex justify-center items-center min-h-screen">No document data available.</div>
  }

  const currentSection = documentData[currentStepIndex]
  const currentSubsection = currentSection.subsections[currentSubsectionIndex]
  const progress = Math.round(
    (completedSteps.length / documentData.reduce((acc, section) => acc + section.subsections.length, 0)) * 100,
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        steps={documentData
          .filter((section) =>
            section.subsections.some((subsection) => subsection.question && subsection.question.length > 0),
          )
          .map((section, index) => ({
            id: index,
            title: section.name,
            subsections: section.subsections
              .filter((sub) => sub.question && sub.question.length > 0)
              .map((sub) => ({ name: sub.name })),
          }))}
        currentStep={currentStepIndex}
        currentSubsection={currentSubsectionIndex}
        completedSteps={completedSteps}
        onStepSelect={handleStepSelect}
        onSubsectionSelect={handleSubsectionSelect}
        onPreview={handlePreview}
        progress={progress}
        formData={formData}
        breakdownTypes={breakdownTypes}
        breakdownQuestion={breakdownQuestion}
      />

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {isPreviewMode ? (
                <div className="prose max-w-none">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Preview</h2>
                    <div className="flex gap-2">
                      <Button onClick={() => setIsPreviewMode(false)} variant="outline">
                        Back
                      </Button>
                      <Button onClick={handleSave} className="bg-red-500 text-white hover:bg-red-600">
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    {documentData.flatMap((section) =>
                      section.subsections.flatMap((subsection) =>
                        subsection.question.map((field) => (
                          <div key={field.uniqueKeyName} className="mb-4">
                            <h3 className="font-semibold">{field.questionToAsk}</h3>
                            <p className="whitespace-pre-wrap break-words">
                              {Array.isArray(formData[field.uniqueKeyName])
                                ? formData[field.uniqueKeyName].join(", ")
                                : formData[field.uniqueKeyName] || "Not provided"}
                            </p>
                          </div>
                        )),
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">
                      {currentSection.name} - {currentSubsection.name}
                    </h2>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleNext()
                      }}
                    >
                      <div className="space-y-4">
                        {currentSubsection.question.map(
                          (field) =>
                            !shouldHideQuestion(field) && (
                              <div
                                key={field.uniqueKeyName}
                                className="bg-white shadow-sm border border-gray-200 rounded-lg"
                              >
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor={field.uniqueKeyName} className="text-sm font-medium">
                                      {field.questionToAsk}
                                    </Label>
                                    {field.description && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="w-4 h-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="w-64 text-sm">{field.description}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                  <div className="border-t border-gray-200 mt-2 pt-2">{renderField(field)}</div>
                                </div>
                              </div>
                            ),
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <Button
                          type="button"
                          onClick={handleBack}
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-800"
                          disabled={currentStepIndex === 0 && currentSubsectionIndex === 0}
                        >
                          ← Back
                        </Button>

                        <Button type="submit" className="bg-red-500 text-white hover:bg-red-600">
                          {currentStepIndex === documentData.length - 1 &&
                          currentSubsectionIndex === currentSection.subsections.length - 1
                            ? "Preview"
                            : "Next"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

