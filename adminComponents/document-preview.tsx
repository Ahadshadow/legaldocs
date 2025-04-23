"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function DocumentPreview({ content, formStructure, formData, setFormData }) {
  const [processedContent, setProcessedContent] = useState("")
  const [activeTab, setActiveTab] = useState("form")

  // Get all questions from the form structure
  const getAllQuestions = () => {
    const questions = []

    formStructure.steps.forEach((step) => {
      step.subsections.forEach((subsection) => {
        subsection?.question?.forEach((question) => {
          questions.push(question)
        })
      })
    })

    return questions
  }

  // Update the DocumentPreview component to handle conditional questions

  // First, add a function to determine if a question should be hidden based on conditional logic
  const shouldHideQuestion = (questionId) => {
    // Find all questions that might affect others
    const affectingQuestions = getAllQuestions().filter((q) => q.affectedQuestion && q.affectedQuestion.length > 0)

    for (const affectingQ of affectingQuestions) {
      // Check if this question affects the one we're checking
      const affectedQ = affectingQ.affectedQuestion.find((q) => q.id === questionId)
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
    return false
  }

  // Then, modify the content processing to skip hidden questions
  useEffect(() => {
    let result = content

    // Get all questions
    const allQuestions = getAllQuestions()

    // First, process conditionals with the updated syntax
    // Format: {% if field_name == "value" %}content{% endif %}
    const conditionalRegex = /\{%\s*if\s+([a-zA-Z0-9_]+)\s*==\s*"([^"]*)"\s*%\}(.*?)\{%\s*endif\s*%\}/gs

    result = result.replace(conditionalRegex, (match, field, value, content) => {
      const fieldValue = formData[field]

      // Find the question by its key
      const question = allQuestions.find((q) => q.uniqueKeyName === field)

      // Skip if this question should be hidden based on conditional logic
      if (question && shouldHideQuestion(question.id)) {
        return ""
      }

      if (fieldValue === value) {
        // Process any field placeholders inside the conditional block
        let processedContent = content
        const nestedFieldRegex = /\{\{%\s*([a-zA-Z0-9_]+)\s*\|[^}]*%\}\}/g

        processedContent = processedContent.replace(nestedFieldRegex, (fieldMatch, fieldKey) => {
          const nestedValue = formData[fieldKey]
          const nestedQuestion = allQuestions.find((q) => q.uniqueKeyName === fieldKey)

          // Skip if this nested question should be hidden
          if (nestedQuestion && shouldHideQuestion(nestedQuestion.id)) {
            return ""
          }

          return Array.isArray(nestedValue) ? nestedValue.join(", ") : nestedValue || ""
        })

        return processedContent
      }
      return ""
    })

    // Process not equal conditionals
    const notEqualRegex = /\{%\s*if\s+([a-zA-Z0-9_]+)\s*!=\s*"([^"]*)"\s*%\}(.*?)\{%\s*endif\s*%\}/gs

    result = result.replace(notEqualRegex, (match, field, value, content) => {
      const fieldValue = formData[field]

      // Find the question by its key
      const question = allQuestions.find((q) => q.uniqueKeyName === field)

      // Skip if this question should be hidden based on conditional logic
      if (question && shouldHideQuestion(question.id)) {
        return ""
      }

      if (fieldValue !== value) {
        // Process any field placeholders inside the conditional block
        let processedContent = content
        const nestedFieldRegex = /\{\{%\s*([a-zA-Z0-9_]+)\s*\|[^}]*%\}\}/g

        processedContent = processedContent.replace(nestedFieldRegex, (fieldMatch, fieldKey) => {
          const nestedValue = formData[fieldKey]
          const nestedQuestion = allQuestions.find((q) => q.uniqueKeyName === fieldKey)

          // Skip if this nested question should be hidden
          if (nestedQuestion && shouldHideQuestion(nestedQuestion.id)) {
            return ""
          }

          return Array.isArray(nestedValue) ? nestedValue.join(", ") : nestedValue || ""
        })

        return processedContent
      }
      return ""
    })

    // Now process any remaining field replacements outside of conditionals
    // Format: {{% field_name | input | underscore %}}
    const fieldRegex = /\{\{%\s*([a-zA-Z0-9_]+)\s*\|[^}]*%\}\}/g

    result = result.replace(fieldRegex, (match, key) => {
      const value = formData[key]

      // Find the question by its key
      const question = allQuestions.find((q) => q.uniqueKeyName === key)

      // Skip if this question should be hidden based on conditional logic
      if (question && shouldHideQuestion(question.id)) {
        return ""
      }

      const displayValue = Array.isArray(value) ? value.join(", ") : value || ""
      // Preserve the original spacing around the placeholder
      return displayValue
    })

    // Process assign statements
    const assignRegex = /\{%\s*assign\s+([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+)\s*\|\s*([a-zA-Z0-9_:]+)\s*%\}/g

    // For now, we'll just remove assign statements in preview
    result = result.replace(assignRegex, "")

    // Fix any instances of multiple spaces that might have been created
    result = result.replace(/\s{2,}/g, " ")

    setProcessedContent(result)
  }, [content, formData])

  // Handle input changes
  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  // Render different field types
  const renderField = (field) => {
    // Skip if this question should be hidden based on conditional logic
    if (shouldHideQuestion(field.id)) {
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

      default:
        return <div key={field.uniqueKeyName}>Unsupported field type: {field.type}</div>
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 border-b">
          <TabsList>
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="form" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">{getAllQuestions().map(renderField)}</div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="document" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-8 max-w-4xl mx-auto">
              <div
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs> */}
       <ScrollArea className="h-full">
            <div className="p-4 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">{getAllQuestions().map(renderField)}</div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

      {/* <ScrollArea className="h-full">
            <div className="p-8 max-w-4xl mx-auto">
              <div
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </ScrollArea> */}
    </div>
  )
}
