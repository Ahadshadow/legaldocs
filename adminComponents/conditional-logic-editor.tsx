"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"

export function ConditionalLogicEditor({ question, allQuestions, onUpdate }) {
  const [editedQuestion, setEditedQuestion] = useState({ ...question })
  const [selectedQuestionId, setSelectedQuestionId] = useState("")
  const [availableValues, setAvailableValues] = useState([])
  const [selectedValues, setSelectedValues] = useState([])
  const [customValue, setCustomValue] = useState("")
  const [useCustomValue, setUseCustomValue] = useState(false)

  useEffect(() => {
    setEditedQuestion({ ...question })
  }, [question])

  // Initialize affected questions if not present
  useEffect(() => {
    if (!editedQuestion.affectedQuestion) {
      setEditedQuestion((prev) => ({
        ...prev,
        affectedQuestion: [],
      }))
    }
  }, [editedQuestion])

  // Update available values when selected question changes
  useEffect(() => {
    if (!selectedQuestionId) {
      setAvailableValues([])
      return
    }

    const selectedQuestion = allQuestions.find((q) => q.id === selectedQuestionId)
    if (!selectedQuestion) return

    if (selectedQuestion.type === "dropdownList" || selectedQuestion.type === "radioButton") {
      // Find the actual question to get its list
      const fullQuestion = findFullQuestion(selectedQuestion.id)
      if (fullQuestion && fullQuestion.list) {
        setAvailableValues(fullQuestion.list.map((item) => item.name))
      }
    } else if (selectedQuestion.type === "checkboxes") {
      const fullQuestion = findFullQuestion(selectedQuestion.id)
      if (fullQuestion && fullQuestion.list) {
        setAvailableValues(fullQuestion.list.map((item) => item.name))
      }
    } else if (selectedQuestion.type === "textField") {
      // For text fields, we'll just use some common values
      setAvailableValues(["yes", "no", "true", "false"])
      setUseCustomValue(true)
    }
  }, [selectedQuestionId, allQuestions])

  // Find the full question object with all properties
  const findFullQuestion = (questionId) => {
    // This is a simplified version - in a real app, you'd need to search through all steps/subsections
    const targetQuestion = allQuestions.find((q) => q.id === questionId)
    if (!targetQuestion) return null

    // In a real implementation, you'd fetch the full question data here
    // For now, we'll just return what we have
    return targetQuestion
  }

  const addAffectedQuestion = () => {
    if (!selectedQuestionId || (selectedValues.length === 0 && !useCustomValue) || (useCustomValue && !customValue))
      return

    // Get the values to use for the condition
    const valuesToUse = useCustomValue ? [customValue] : selectedValues

    // Check if this question is already affected
    const existingIndex = editedQuestion.affectedQuestion.findIndex((q) => q.id === selectedQuestionId)

    if (existingIndex !== -1) {
      // Update existing affected question
      const updatedAffectedQuestions = [...editedQuestion.affectedQuestion]
      updatedAffectedQuestions[existingIndex] = {
        ...updatedAffectedQuestions[existingIndex],
        value: valuesToUse,
      }

      setEditedQuestion((prev) => ({
        ...prev,
        affectedQuestion: updatedAffectedQuestions,
      }))
    } else {
      // Add new affected question
      setEditedQuestion((prev) => ({
        ...prev,
        affectedQuestion: [
          ...(prev.affectedQuestion || []),
          {
            id: selectedQuestionId,
            value: valuesToUse,
          },
        ],
      }))
    }

    // Reset selection
    setSelectedQuestionId("")
    setSelectedValues([])
    setCustomValue("")
    setUseCustomValue(false)
  }

  const removeAffectedQuestion = (questionId) => {
    setEditedQuestion((prev) => ({
      ...prev,
      affectedQuestion: prev.affectedQuestion.filter((q) => q.id !== questionId),
    }))
  }

  const handleSave = () => {
    onUpdate(editedQuestion)
  }

  const getQuestionText = (questionId) => {
    const question = allQuestions.find((q) => q.id === questionId)
    return question ? question.questionToAsk : "Unknown Question"
  }

  const getQuestionType = (questionId) => {
    const question = allQuestions.find((q) => q.id === questionId)
    return question ? question.type : "unknown"
  }

  return (
    <div className="space-y-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Conditional Logic</CardTitle>
          <CardDescription>
            Define when questions should be shown or hidden based on answers to this question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>When this question&apos;s answer is:</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {editedQuestion.type === "dropdownList" ||
                editedQuestion.type === "radioButton" ||
                editedQuestion.type === "checkboxes" ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      This question will affect other questions based on its selected value.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {editedQuestion.list &&
                        editedQuestion.list.map((option, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center justify-center rounded-md bg-muted px-3 py-1 text-sm font-medium"
                          >
                            {option.name}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This question will affect other questions based on its text value.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <Label>Show these questions:</Label>

              {editedQuestion.affectedQuestion && editedQuestion.affectedQuestion.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {editedQuestion.affectedQuestion.map((affected, index) => {
                    const questionText = getQuestionText(affected.id)
                    const questionType = getQuestionType(affected.id)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{questionText}</p>
                          <p className="text-sm text-muted-foreground">
                            Show when value is: {affected.value.join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground">Type: {questionType}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeAffectedQuestion(affected.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No conditional questions set up yet.</p>
              )}

              <div className="mt-4 space-y-2 border-t pt-4">
                <Label>Add Conditional Question</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select
                    value={selectedQuestionId}
                    onValueChange={(value) => {
                      setSelectedQuestionId(value)
                      setSelectedValues([])
                      setCustomValue("")

                      // Check if this is a text field
                      const selectedQuestion = allQuestions.find((q) => q.id === value)
                      setUseCustomValue(selectedQuestion?.type === "textField")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a question to show/hide" />
                    </SelectTrigger>
                    <SelectContent>
                      {allQuestions
                        .filter((q) => q.id !== question.id) // Don't allow a question to affect itself
                        .map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.questionToAsk}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {selectedQuestionId && (
                    <div className="space-y-2">
                      <Label>Show when answer is:</Label>

                      {useCustomValue ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter custom value (e.g., 'yes', '42', etc.)"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the exact value that should trigger this question to appear.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {availableValues.map((value, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                id={`value-${index}`}
                                checked={selectedValues.includes(value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedValues((prev) => [...prev, value])
                                  } else {
                                    setSelectedValues((prev) => prev.filter((v) => v !== value))
                                  }
                                }}
                              />
                              <Label htmlFor={`value-${index}`}>{value}</Label>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addAffectedQuestion}
                        disabled={(useCustomValue && !customValue) || (!useCustomValue && selectedValues.length === 0)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Condition
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Conditions</Button>
      </div>
    </div>
  )
}
