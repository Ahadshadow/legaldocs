"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { DOCUMENT_DATA } from "../../../../../components/documentData"

export default function InjuryDemandLetter() {
  
  const { toast } = useToast()
  const router = useRouter()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const steps = DOCUMENT_DATA.definition

  const handleStepSelect = (stepId) => {
    const [parentName, subStepName] = stepId.split("-")
    const stepIndex = steps.findIndex((step) => step.name === parentName)
    const subStepIndex = steps[stepIndex].subsections.findIndex((subsection) => subsection.name === subStepName)

    if (stepIndex !== -1 && subStepIndex !== -1) {
      setCurrentStepIndex(stepIndex)
      setCurrentSubStepIndex(subStepIndex)
      setIsPreviewMode(false)
    }
  }

  const handleInputChange = (fieldId, value) => {
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [fieldId]: value,
      }
      // Force a re-render when "pay_breakdown_option" changes
      if (fieldId === "pay_breakdown_option") {
        return { ...newData }
      }
      return newData
    })
  }

  const handleNext = () => {
    const currentStep = steps[currentStepIndex]
    const currentSubStep = currentStep.subsections[currentSubStepIndex]
    const stepId = `${currentStep.name}-${currentSubStep.name}`

    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }

    // Try next sub-step in current step
    if (currentSubStepIndex < currentStep.subsections.length - 1) {
      setCurrentSubStepIndex(currentSubStepIndex + 1)
    }
    // Try first sub-step of next step
    else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      setCurrentSubStepIndex(0)
    }
    // If no more steps, show preview
    else {
      setIsPreviewMode(true)
    }
  }

  const handleBack = () => {
    // Try previous sub-step in current step
    if (currentSubStepIndex > 0) {
      setCurrentSubStepIndex(currentSubStepIndex - 1)
    }
    // Try last sub-step of previous step
    else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      setCurrentSubStepIndex(steps[currentStepIndex - 1].subsections.length - 1)
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
  }

  const handleSave = async () => {
    toast({
      title: "Success",
      description: "Document saved successfully",
    })
    router.push("/app/user-panel/documents")
  }

  const findFieldById = (id) => {
    for (const step of steps) {
      for (const subsection of step.subsections) {
        const field = subsection.question.find((q) => q.id === id)
        if (field) return field
      }
    }
    return null
  }


  const shouldShowField = (field) => {

    console.log("field", field);
    
    // Always show the "pay_breakdown_option" and "receiver_type" fields
    if (field.uniqueKeyName === "pay_breakdown_option" || field.uniqueKeyName === "receiver_type") {
      return true
    }

    // Check if this field is affected by the "pay_breakdown_option"
    const breakdownOptionField = findFieldById("512ab2d0-3fae-428e-ae29-2d484d5ea9d8")
    if (breakdownOptionField && formData[breakdownOptionField.uniqueKeyName] === "Yes") {
      const isAffectedField = breakdownOptionField.affectedQuestion.some((affectedQ) => affectedQ.id === field.id)
      if (isAffectedField) {
        return true
      }
    }

    // Check if this field is affected by the "receiver_type"
    const receiverTypeField = findFieldById("12bc2d97-498f-4e0b-9410-79ed35a1677c")
    if (receiverTypeField) {
      const receiverType = formData[receiverTypeField.uniqueKeyName]
      const isAffectedField = receiverTypeField.affectedQuestion.some((affectedQ) => affectedQ.id === field.id)
      if (isAffectedField) {
        if (receiverType === "An insurance company" && field.uniqueKeyName === "receiver_company_name") {
          return true
        }
        if (receiverType === "An individual" && field.uniqueKeyName === "receiver_individual_name") {
          return true
        }
        return false
      }
    }

    // For other fields, check their own affectedQuestion logic
    if (!field.affectedQuestion || field.affectedQuestion.length === 0) {
      return true
    }

    return field.affectedQuestion.some((condition) => {
      const affectingField = findFieldById(condition.id)
      if (!affectingField) return false

      const affectingFieldValue = formData[affectingField.uniqueKeyName]

      if (Array.isArray(affectingFieldValue)) {
        // For checkboxes
        return condition.value.some((v) => affectingFieldValue.includes(v))
      } else {
        // For radio buttons or other single-value fields
        return condition.value.includes(affectingFieldValue)
      }
    })
  }

  const renderField = (field) => {
    if (!shouldShowField(field)) {
      return null
    }

    switch (field.type) {
      case "textField":
        if (field.selectionValue === "date") {
          return (
            <Input
              key={field.id}
              id={field.id}
              type="date"
              value={formData[field.uniqueKeyName] || ""}
              onChange={(e) => handleInputChange(field.uniqueKeyName, e.target.value)}
              required={field.isRequired}
              placeholder={field.placeholder}
            />
          )
        }
        return (
          <Input
            key={field.id}
            id={field.id}
            value={formData[field.uniqueKeyName] || ""}
            onChange={(e) => handleInputChange(field.uniqueKeyName, e.target.value)}
            required={field.isRequired}
            placeholder={field.placeholder}
          />
        )
      case "radioButton":
        return (
          <RadioGroup
            key={field.id}
            value={formData[field.uniqueKeyName] || ""}
            onValueChange={(value) => handleInputChange(field.uniqueKeyName, value)}
          >
            {field.list.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.name} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option.name}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "dropdownList":
        return (
          <Select
            key={field.id}
            value={formData[field.uniqueKeyName] || ""}
            onValueChange={(value) => handleInputChange(field.uniqueKeyName, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.list.map((option, index) => (
                <SelectItem key={index} value={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkboxes":
        return (
          <div key={field.id}>
            {field.list.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(formData[field.uniqueKeyName] || []).includes(option.name)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.uniqueKeyName] || []
                    const newValues = checked
                      ? [...currentValues, option.name]
                      : currentValues.filter((value) => value !== option.name)
                    handleInputChange(field.uniqueKeyName, newValues)
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option.name}</Label>
              </div>
            ))}
          </div>
        )
      default:
        return <div key={field.id}>Unsupported field type: {field.type}</div>
    }
  }

  const currentStep = steps[currentStepIndex]
  const currentSubStep = currentStep.subsections[currentSubStepIndex]
  const currentStepId = `${currentStep.name}-${currentSubStep.name}`

  // Calculate total number of sub-steps across all steps
  const totalSubSteps = steps.reduce((total, step) => total + step.subsections.length, 0)
  const progress = totalSubSteps > 0 ? Math.round((completedSteps.length / totalSubSteps) * 100) : 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        steps={steps}
        currentStep={currentStepId}
        completedSteps={completedSteps}
        onStepSelect={handleStepSelect}
        onPreview={handlePreview}
        progress={progress}
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
                    {steps.flatMap((step) =>
                      step.subsections.flatMap((subsection) =>
                        subsection.question.filter(shouldShowField).map((field) => (
                          <div key={field.id} className="mb-4">
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
                    <h2 className="text-2xl font-semibold mb-2">{currentStep.name}</h2>
                    <h3 className="text-xl font-medium mb-6">{currentSubStep.name}</h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleNext()
                      }}
                    >
                      <div className="space-y-4">
                        {currentSubStep.question.map(
                          (field) =>
                            shouldShowField(field) && (
                              <div key={field.id} className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor={field.id} className="text-sm font-medium">
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
                        >
                          ← Back
                        </Button>

                        <Button type="submit" className="bg-red-500 text-white hover:bg-red-600">
                          {currentStepIndex === steps.length - 1 &&
                          currentSubStepIndex === currentStep.subsections.length - 1
                            ? "Preview"
                            : "Next"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/3">
              {currentSubStep.FAQQuestion && currentSubStep.FAQAnswer && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{currentSubStep.FAQQuestion}</h3>
                    <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                  <div
                    className="space-y-4 text-gray-500 text-sm"
                    dangerouslySetInnerHTML={{ __html: currentSubStep.FAQAnswer }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

