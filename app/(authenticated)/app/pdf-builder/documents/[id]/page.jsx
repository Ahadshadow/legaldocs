"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HelpCircle } from "lucide-react"
import Sidebar from "../../../../../../components/sidebarPdf"
import { Input } from "../../../../../../components/ui/input"
import { RadioGroup, RadioGroupItem } from "../../../../../../components/ui/radio-group-document"
import { Label } from "../../../../../../components/ui/label"
import { Button } from "../../../../../../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../../components/ui/tooltip"
import { useToast } from "../../../../../../components/ui/use-toast"
import { Checkbox } from "../../../../../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { SC } from "../../../../../../service/Api/serverCall"
import { MultipleEntryListField } from "../../../../../../components/MultipleEntryListField"

export default function DynamicForm({ params }) {

  const { toast } = useToast()
  const router = useRouter()


  // const routeparam = new URLSearchParams(window.location.search);
  // const selectedId = routeparam.get("selectedId");

  const selectedId = params.id


  const [documentData, setDocumentData] = useState(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [docName, setdocName] = useState(null)
  const [affectingQuestions, setAffectingQuestions] = useState([])
  const [hiddenQuestions, setHiddenQuestions] = useState({})
  const [subsectionInfo, setSubsectionInfo] = useState({})

  useEffect(() => {
    const fetchDocumentData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await SC.getCall({ url: `document/${selectedId}` })
        if (response.status) {
          setDocumentData(response.data.data.steps)
          initializeFormData(response.data.data.steps)
          initializeSubsectionInfo(response.data.data.steps)
          setdocName(response.data.data.name)
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
      const questions = documentData.flatMap((section) =>
        section.subsections.flatMap((subsection) =>
          subsection.question.filter((q) => q.affectedQuestion && q.affectedQuestion.length > 0),
        ),
      )
      setAffectingQuestions(questions.map((q) => ({ id: q.id, key: q.uniqueKeyName })))
    }
  }, [documentData])

  useEffect(() => {
    if (documentData) {
      updateHiddenQuestions()
    }
  }, [documentData, formData]) //Fixed unnecessary dependency

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

  const initializeSubsectionInfo = (data) => {
    const info = {}
    data.forEach((section, sectionIndex) => {
      info[sectionIndex] = {}
      section.subsections.forEach((subsection, subsectionIndex) => {
        info[sectionIndex][subsectionIndex] = {
          totalQuestions: subsection.question.length,
          hiddenQuestions: 0,
        }
      })
    })
    setSubsectionInfo(info)
  }

  const findFieldById = (data, id) => {
    for (const section of data) {
      for (const subsection of section.subsections) {
        const field = subsection.question.find((q) => q.id === id)
        if (field) return { field, section, subsection }
      }
    }
    return null
  }

  const shouldHideQuestion = (question) => {
    for (const affectingQ of affectingQuestions) {
      const affectingField = findFieldById(documentData, affectingQ.id)
      if (affectingField && affectingField.field.affectedQuestion) {
        const affectedQ = affectingField.field.affectedQuestion.find((q) => q.id === question.id)
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

  const updateHiddenQuestions = () => {
    const hidden = {}
    const updatedSubsectionInfo = { ...subsectionInfo }
    documentData.forEach((section, sectionIndex) => {
      section.subsections.forEach((subsection, subsectionIndex) => {
        const hiddenQuestionsCount = subsection.question.filter(shouldHideQuestion).length
        if (!hidden[sectionIndex]) hidden[sectionIndex] = {}
        hidden[sectionIndex][subsectionIndex] = hiddenQuestionsCount
        updatedSubsectionInfo[sectionIndex][subsectionIndex].hiddenQuestions = hiddenQuestionsCount
      })
    })
    setHiddenQuestions(hidden)
    setSubsectionInfo(updatedSubsectionInfo)
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

  const handleNext = () => {
    let nextStepIndex = currentStepIndex
    let nextSubsectionIndex = currentSubsectionIndex

    do {
      if (nextSubsectionIndex < documentData[nextStepIndex].subsections.length - 1) {
        nextSubsectionIndex++
      } else {
        nextStepIndex++
        nextSubsectionIndex = 0
      }

      if (nextStepIndex >= documentData.length) {
        setIsPreviewMode(true)
        return
      }
    } while (
      subsectionInfo[nextStepIndex]?.[nextSubsectionIndex]?.totalQuestions ===
      subsectionInfo[nextStepIndex]?.[nextSubsectionIndex]?.hiddenQuestions
    )

    setCurrentStepIndex(nextStepIndex)
    setCurrentSubsectionIndex(nextSubsectionIndex)
    setCompletedSteps([...completedSteps, { stepIndex: currentStepIndex, subsectionIndex: currentSubsectionIndex }])
  }

  const handleBack = () => {
    let prevStepIndex = currentStepIndex
    let prevSubsectionIndex = currentSubsectionIndex

    do {
      if (prevSubsectionIndex > 0) {
        prevSubsectionIndex--
      } else if (prevStepIndex > 0) {
        prevStepIndex--
        prevSubsectionIndex = documentData[prevStepIndex].subsections.length - 1
      } else {
        // We're at the first visible step/subsection
        return
      }
    } while (
      subsectionInfo[prevStepIndex]?.[prevSubsectionIndex]?.totalQuestions ===
      subsectionInfo[prevStepIndex]?.[prevSubsectionIndex]?.hiddenQuestions
    )

    setCurrentStepIndex(prevStepIndex)
    setCurrentSubsectionIndex(prevSubsectionIndex)
  }

  const findFirstVisibleStep = () => {
    for (let i = 0; i < documentData.length; i++) {
      for (let j = 0; j < documentData[i].subsections.length; j++) {
        if (subsectionInfo[i]?.[j]?.totalQuestions > subsectionInfo[i]?.[j]?.hiddenQuestions) {
          return { stepIndex: i, subsectionIndex: j }
        }
      }
    }
    return { stepIndex: 0, subsectionIndex: 0 } // Fallback to first step if all are hidden
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
  }

  const handleSave = async () => {
    try {
      const submissionData = JSON.parse(JSON.stringify(documentData))

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

      const payload = {
        steps: submissionData,
        document_id: selectedId,
      }

      const response = await SC.postCall({
        url: `submissions`,
        data: payload,
      })

      if (response.status) {
        toast({
          title: "Success",
          description: "Document saved successfully",
        })
        router.push("/app/user-panel/mydocs")
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
        case "multipleEntryList":
          return (
            <MultipleEntryListField
              key={field.uniqueKeyName}
              field={field}
              value={formData[field.uniqueKeyName] || []}
              onChange={(value) => handleInputChange(field.uniqueKeyName, value)}
            />
          )
      default:
        return <div key={field.uniqueKeyName}>Unsupported field type: {field.type}</div>
    }
  }

  useEffect(() => {
    if (documentData) {
      updateHiddenQuestions()
      const { stepIndex, subsectionIndex } = findFirstVisibleStep()
      setCurrentStepIndex(stepIndex)
      setCurrentSubsectionIndex(subsectionIndex)
    }
  }, [documentData]) //Fixed unnecessary dependency

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
        steps={documentData.map((section, index) => ({
          id: index,
          title: section.name,
          subsections: section.subsections.map((sub, subIndex) => ({
            name: sub.name,
            totalQuestions: subsectionInfo[index]?.[subIndex]?.totalQuestions || 0,
            hiddenQuestions: subsectionInfo[index]?.[subIndex]?.hiddenQuestions || 0,
          })),
        }))}
        currentStep={currentStepIndex}
        currentSubsection={currentSubsectionIndex}
        completedSteps={completedSteps}
        onStepSelect={handleStepSelect}
        onSubsectionSelect={handleSubsectionSelect}
        onPreview={handlePreview}
        progress={progress}
        docName = {docName}
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
                                    {/* {field.description && ( */}
                                    {true && (
                                      <TooltipProvider >
                                        <Tooltip>
                                          <TooltipTrigger>
                                          <button type="button"
                                          
                                          onClick={(e) => {
                                            e.preventDefault() // Prevents default form submission
                                            e.stopPropagation() // Stops the event from bubbling up
                                          }}
                                          >
                                            <HelpCircle className="w-4 h-4 text-gray-400" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {/* <p className="w-64 text-sm">{field.description}</p> */}
                                            <p className="w-64 text-sm">ahad sad  sda</p>
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

