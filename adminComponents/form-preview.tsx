"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Checkbox } from "./ui/checkbox"
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'

export function FormPreview({ formStructure }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [hiddenQuestions, setHiddenQuestions] = useState({})
  const [affectingQuestions, setAffectingQuestions] = useState([])

  // Extract questions that affect other questions
  useEffect(() => {
    if (formStructure && formStructure.steps) {
      const questions = formStructure.steps.flatMap((section) =>
        section.subsections.flatMap((subsection) =>
          subsection.question.filter(
            (q) => q.affectedQuestion && q.affectedQuestion.length > 0
          )
        )
      )
      setAffectingQuestions(
        questions.map((q) => ({ id: q.id, uniqueKeyName: q.uniqueKeyName }))
      )
    }
  }, [formStructure])

  // Update hidden questions when form data changes
  useEffect(() => {
    if (formStructure && formStructure.steps) {
      updateHiddenQuestions()
    }
  }, [formData, formStructure])

  // Find a field by its ID
  const findFieldById = (id) => {
    for (const section of formStructure.steps) {
      for (const subsection of section.subsections) {
        const field = subsection.question.find((q) => q.id === id)
        if (field) return field
      }
    }
    return null
  }

  // Determine if a question should be hidden based on conditional logic
  const shouldHideQuestion = (question) => {
    for (const affectingQ of affectingQuestions) {
      const affectingField = findFieldById(affectingQ.id)
      if (affectingField && affectingField.affectedQuestion) {
        const affectedQ = affectingField.affectedQuestion.find(
          (q) => q.id === question.id
        )
        if (affectedQ) {
          const currentValue = formData[affectingQ.uniqueKeyName]
          
          // For checkboxes (array values)
          if (Array.isArray(currentValue)) {
            if (!currentValue.some((value) => affectedQ.value.includes(value))) {
              return true // Hide if none of the selected values match
            }
          }
          // For other input types (string values)
          else if (currentValue !== undefined && !affectedQ.value.includes(currentValue)) {
            return true // Hide if the value doesn't match
          }
          // If no value is set yet, hide by default
          else if (currentValue === undefined) {
            return true
          }
        }
      }
    }
    return false
  }

  // Update the hidden questions state
  const updateHiddenQuestions = () => {
    const hidden = {}
    formStructure.steps.forEach((section, sectionIndex) => {
      section.subsections.forEach((subsection, subsectionIndex) => {
        const hiddenQuestionsCount = subsection.question.filter(shouldHideQuestion).length
        if (!hidden[sectionIndex]) hidden[sectionIndex] = {}
        hidden[sectionIndex][subsectionIndex] = hiddenQuestionsCount
      })
    })
    setHiddenQuestions(hidden)
  }

  // Handle input changes
  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  // Navigation functions
  const handleNext = () => {
    const currentStep = formStructure.steps[currentStepIndex]

    if (currentSubsectionIndex < currentStep.subsections.length - 1) {
      setCurrentSubsectionIndex(currentSubsectionIndex + 1)
    } else if (currentStepIndex < formStructure.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      setCurrentSubsectionIndex(0)
    } else {
      setIsPreviewMode(true)
    }
  }

  const handleBack = () => {
    if (currentSubsectionIndex > 0) {
      setCurrentSubsectionIndex(currentSubsectionIndex - 1)
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      setCurrentSubsectionIndex(formStructure.steps[currentStepIndex - 1].subsections.length - 1)
    }
  }

  // Render different field types
  const renderField = (field) => {
    if (shouldHideQuestion(field)) {
      return null
    }

    switch (field.type) {
      case "textField":
        return (
          <div key={field.uniqueKeyName} className="space-y-2">
            <Label htmlFor={field.uniqueKeyName}>{field.questionToAsk}</Label>
            <Input
              id={field.uniqueKeyName}
              type={field.selectionValue === "date" ? "date" : field.selectionValue === "number" ? "number" : "text"}
              value={formData[field.uniqueKeyName] || ""}
              onChange={(e) => handleInputChange(field.uniqueKeyName, e.target.value)}
              required={field.isRequired}
              placeholder={field.placeholder}
            />
          </div>
        )

      case "dropdownList":
        return (
          <div key={field.uniqueKeyName} className="space-y-2">
            <Label htmlFor={field.uniqueKeyName}>{field.questionToAsk}</Label>
            <Select
              value={formData[field.uniqueKeyName] || ""}
              onValueChange={(value) => handleInputChange(field.uniqueKeyName, value)}
            >
              <SelectTrigger id={field.uniqueKeyName}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.list &&
                  field.list.map((option, index) => (
                    <SelectItem key={index} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "radioButton":
        return (
          <div key={field.uniqueKeyName} className="space-y-2">
            <Label>{field.questionToAsk}</Label>
            <RadioGroup
              value={formData[field.uniqueKeyName] || ""}
              onValueChange={(value) => handleInputChange(field.uniqueKeyName, value)}
            >
              {field.list &&
                field.list.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.name} id={`${field.uniqueKeyName}-${index}`} />
                    <Label htmlFor={`${field.uniqueKeyName}-${index}`}>{option.name}</Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
        )

      case "checkboxes":
        return (
          <div key={field.uniqueKeyName} className="space-y-2">
            <Label>{field.questionToAsk}</Label>
            <div className="space-y-2">
              {field.list &&
                field.list.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
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
          </div>
        )

      case "multipleEntryList":
        return (
          <div key={field.uniqueKeyName} className="space-y-2">
            <Label>{field.questionToAsk}</Label>
            <div className="space-y-2">
              {(formData[field.uniqueKeyName] || [""]).map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={value}
                    onChange={(e) => {
                      const newValues = [...(formData[field.uniqueKeyName] || [""])]
                      newValues[index] = e.target.value
                      handleInputChange(field.uniqueKeyName, newValues)
                    }}
                    placeholder={field.placeholder || `Entry ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newValues = (formData[field.uniqueKeyName] || [""]).filter((_, i) => i !== index)
                      if (newValues.length === 0) newValues.push("")
                      handleInputChange(field.uniqueKeyName, newValues)
                    }}
                    disabled={(formData[field.uniqueKeyName] || [""]).length <= 1}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newValues = [...(formData[field.uniqueKeyName] || [""]), ""]
                  handleInputChange(field.uniqueKeyName, newValues)
                }}
              >
                + Add Entry
              </Button>
            </div>
          </div>
        )

      default:
        return <div key={field.uniqueKeyName}>Unsupported field type: {field.type}</div>
    }
  }

  if (!formStructure || !formStructure.steps || formStructure.steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
          <CardDescription>No form structure available to preview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center p-6">Please create a form structure in the Form Builder tab first.</p>
        </CardContent>
      </Card>
    )
  }

  const currentStep = formStructure.steps[currentStepIndex]
  const currentSubsection = currentStep.subsections[currentSubsectionIndex]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Form Preview</CardTitle>
            <CardDescription>
              {isPreviewMode ? "Review your answers" : `${currentStep.name} - ${currentSubsection.name}`}
            </CardDescription>
          </div>
          {!isPreviewMode && (
            <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(true)}>
              <Eye className="h-4 w-4 mr-1" /> Preview All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isPreviewMode ? (
          <div className="space-y-6">
            {formStructure.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="space-y-4">
                <h3 className="text-lg font-semibold">{step.name}</h3>

                {step.subsections.map((subsection, subsectionIndex) => (
                  <div key={subsectionIndex} className="space-y-2">
                    <h4 className="text-md font-medium">{subsection.name}</h4>

                    <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                      {subsection.question.map((question) => {
                        if (shouldHideQuestion(question)) return null

                        const value = formData[question.uniqueKeyName]
                        return (
                          <div key={question.uniqueKeyName} className="space-y-1">
                            <p className="font-medium">{question.questionToAsk}</p>
                            <p className="text-muted-foreground">
                              {Array.isArray(value) ? value.join(", ") : value || "Not answered"}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Form
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">{currentSubsection.question.map(renderField)}</div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0 && currentSubsectionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>

              <Button onClick={handleNext}>
                {currentStepIndex === formStructure.steps.length - 1 &&
                currentSubsectionIndex === currentStep.subsections.length - 1
                  ? "Preview"
                  : "Next"}{" "}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
