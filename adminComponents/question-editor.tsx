"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Trash2, Plus, AlertCircle } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { Alert, AlertDescription } from "./ui/alert"

export function QuestionEditor({ question, onUpdate, generateFieldKey, autoClose = false }) {
  const [editedQuestion, setEditedQuestion] = useState({ ...question })
  const [isAutoGeneratingKey, setIsAutoGeneratingKey] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setEditedQuestion({ ...question })
  }, [question])

  const handleChange = (field, value) => {
    setEditedQuestion((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate field key when question text changes
    if (field === "questionToAsk" && isAutoGeneratingKey) {
      const newFieldKey = generateFieldKey(value)
      setEditedQuestion((prev) => ({
        ...prev,
        uniqueKeyName: newFieldKey,
      }))
    }

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleKeyChange = (value) => {
    setIsAutoGeneratingKey(false)
    setEditedQuestion((prev) => ({
      ...prev,
      uniqueKeyName: value,
    }))

    // Clear error for this field if it exists
    if (errors.uniqueKeyName) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.uniqueKeyName
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Check required fields
    if (!editedQuestion.questionToAsk) {
      newErrors.questionToAsk = "Question text is required"
    }

    if (!editedQuestion.uniqueKeyName) {
      newErrors.uniqueKeyName = "Field key is required"
    }

    // Check options for dropdown, radio, and checkbox types
    if (
      editedQuestion.type === "dropdownList" ||
      editedQuestion.type === "radioButton" ||
      editedQuestion.type === "checkboxes"
    ) {
      if (!editedQuestion.list || editedQuestion.list.length === 0) {
        newErrors.list = "At least one option is required"
      } else if (editedQuestion.list.some((item) => !item.name)) {
        newErrors.list = "All options must have a name"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(editedQuestion)
      if (autoClose) {
        // Close the dialog after saving
        const closeEvent = new CustomEvent("dialog.close")
        document.dispatchEvent(closeEvent)
      }
    }
  }

  const addListItem = () => {
    setEditedQuestion((prev) => ({
      ...prev,
      list: [...(prev.list || []), { name: "" }],
    }))
  }

  const updateListItem = (index, value) => {
    const updatedList = [...editedQuestion.list]
    updatedList[index] = { name: value }

    setEditedQuestion((prev) => ({
      ...prev,
      list: updatedList,
    }))

    // Clear list error if it exists
    if (errors.list) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.list
        return newErrors
      })
    }
  }

  const removeListItem = (index) => {
    const updatedList = editedQuestion.list.filter((_, i) => i !== index)

    setEditedQuestion((prev) => ({
      ...prev,
      list: updatedList,
    }))
  }

  useEffect(() => {
    // When type changes, ensure we have the right structure
    if (
      editedQuestion.type === "dropdownList" ||
      editedQuestion.type === "radioButton" ||
      editedQuestion.type === "checkboxes"
    ) {
      if (!editedQuestion.list || !Array.isArray(editedQuestion.list) || editedQuestion.list.length === 0) {
        setEditedQuestion((prev) => ({
          ...prev,
          list: [{ name: "" }],
        }))
      }
    }

    // For text fields, ensure we have the right selection value
    if (editedQuestion.type === "textField" && !editedQuestion.selectionValue) {
      setEditedQuestion((prev) => ({
        ...prev,
        selectionValue: "text",
      }))
    }
  }, [editedQuestion.type])

  // Add event listener to close dialog when requested
  useEffect(() => {
    const handleCloseDialog = () => {
      setDialogOpen(false)
    }

    document.addEventListener("dialog.close", handleCloseDialog)

    return () => {
      document.removeEventListener("dialog.close", handleCloseDialog)
    }
  }, [])

  return (
    <div className="space-y-4 py-4">
      <div className=" pr-4 overflow-y-auto h-[600px]">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionToAsk" className={errors.questionToAsk ? "text-destructive" : ""}>
              Question Text
            </Label>
            <Input
              id="questionToAsk"
              value={editedQuestion.questionToAsk}
              onChange={(e) => handleChange("questionToAsk", e.target.value)}
              className={errors.questionToAsk ? "border-destructive" : ""}
            />
            {errors.questionToAsk && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.questionToAsk}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="uniqueKeyName" className={errors.uniqueKeyName ? "text-destructive" : ""}>
                Field Key
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAutoGeneratingKey(true)
                  const newFieldKey = generateFieldKey(editedQuestion.questionToAsk)
                  setEditedQuestion((prev) => ({
                    ...prev,
                    uniqueKeyName: newFieldKey,
                  }))

                  // Clear error if it exists
                  if (errors.uniqueKeyName) {
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.uniqueKeyName
                      return newErrors
                    })
                  }
                }}
                className="text-xs h-6"
              >
                Auto-generate
              </Button>
            </div>
            <Input
              id="uniqueKeyName"
              value={editedQuestion.uniqueKeyName}
              onChange={(e) => handleKeyChange(e.target.value)}
              className={errors.uniqueKeyName ? "border-destructive" : ""}
            />
            {errors.uniqueKeyName && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.uniqueKeyName}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Question Type</Label>
            <Select value={editedQuestion.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="textField">Text Field</SelectItem>
                <SelectItem value="dropdownList">Dropdown List</SelectItem>
                <SelectItem value="radioButton">Radio Button</SelectItem>
                <SelectItem value="checkboxes">Checkboxes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editedQuestion.type === "textField" && (
            <div className="space-y-2">
              <Label htmlFor="selectionValue">Text Field Type</Label>
              <Select
                value={editedQuestion.selectionValue}
                onValueChange={(value) => handleChange("selectionValue", value)}
              >
                <SelectTrigger id="selectionValue">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder Text</Label>
            <Input
              id="placeholder"
              value={editedQuestion.placeholder || ""}
              onChange={(e) => handleChange("placeholder", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRequired"
              checked={editedQuestion.isRequired}
              onCheckedChange={(checked) => handleChange("isRequired", checked)}
            />
            <Label htmlFor="isRequired">Required Field</Label>
          </div>

          {/* Add FAQ fields */}
          <div className="space-y-2">
            <Label htmlFor="faqQuestion">FAQ Question</Label>
            <Input
              id="faqQuestion"
              value={editedQuestion.FAQQuestion || ""}
              onChange={(e) => handleChange("FAQQuestion", e.target.value)}
              placeholder="Enter FAQ question"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faqAnswer">FAQ Answer</Label>
            <Input
              id="faqAnswer"
              value={editedQuestion.FAQAnswer || ""}
              onChange={(e) => handleChange("FAQAnswer", e.target.value)}
              placeholder="Enter FAQ answer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedQuestion.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAutoFillAddress"
              checked={editedQuestion.isAutoFillAddress || false}
              onCheckedChange={(checked) => handleChange("isAutoFillAddress", checked)}
            />
            <Label htmlFor="isAutoFillAddress">Auto-fill Address</Label>
          </div>

          {/* Add other fields from the example JSON */}
          <div className="space-y-2">
            <Label htmlFor="defaultValue">Default Value</Label>
            <Input
              id="defaultValue"
              value={editedQuestion.defaultValue || ""}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
              placeholder="Enter default value"
            />
          </div>

          {(editedQuestion.type === "dropdownList" ||
            editedQuestion.type === "radioButton" ||
            editedQuestion.type === "checkboxes") && (
            <div className="space-y-2">
              <Label className={errors.list ? "text-destructive" : ""}>Options</Label>
              {errors.list && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.list}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                {editedQuestion.list &&
                  editedQuestion.list.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={item.name}
                        onChange={(e) => updateListItem(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className={errors.list ? "border-destructive" : ""}
                      />
                      <Input
                        value={(editedQuestion.listDescription && editedQuestion.listDescription[index]) || ""}
                        onChange={(e) => {
                          const updatedDescriptions = [...(editedQuestion.listDescription || [])]
                          updatedDescriptions[index] = e.target.value
                          setEditedQuestion((prev) => ({
                            ...prev,
                            listDescription: updatedDescriptions,
                          }))
                        }}
                        placeholder="Description (optional)"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(index)}
                        disabled={editedQuestion.list.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" size="sm" onClick={addListItem}>
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
