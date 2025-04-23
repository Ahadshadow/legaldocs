"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { QuestionEditor } from "./question-editor"
import { Plus } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"

export function ConditionalEditor({ questions, addConditionalToDocument, generateFieldKey, onAddQuestion }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedCondition, setSelectedCondition] = useState("==")
  const [selectedValue, setSelectedValue] = useState("")
  const [conditionalContent, setConditionalContent] = useState("")
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false)

  // Get the selected question object
  const getSelectedQuestionObject = () => {
    return questions.find((q) => q.uniqueKeyName === selectedQuestion)
  }

  // Get available values for the selected question
  const getAvailableValues = () => {
    const question = getSelectedQuestionObject()
    if (!question) return []

    if (question.type === "dropdownList" || question.type === "radioButton" || question.type === "checkboxes") {
      return question.list.map((item) => item.name)
    }

    return []
  }

  // Handle adding the conditional with the correct syntax
  const handleAddConditional = () => {
    if (!selectedQuestion || !selectedValue || !conditionalContent) return

    addConditionalToDocument(selectedQuestion, selectedCondition, selectedValue, conditionalContent)

    // Reset form
    setSelectedValue("")
    setConditionalContent("")
  }

  // Handle creating a new question
  const handleCreateQuestion = (newQuestion) => {
    if (onAddQuestion) {
      const addedQuestion = onAddQuestion(newQuestion)
      if (addedQuestion) {
        setSelectedQuestion(addedQuestion.uniqueKeyName)
      }
      setShowNewQuestionDialog(false)
    }
  }

  return (
    <ScrollArea className="max-h-[60vh]">
      <div className="space-y-4 pr-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="question">Select Question</Label>
            <Button variant="outline" size="sm" onClick={() => setShowNewQuestionDialog(true)}>
              <Plus className="h-3 w-3 mr-1" /> New Question
            </Button>
          </div>
          <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <SelectTrigger id="question">
              <SelectValue placeholder="Choose a question" />
            </SelectTrigger>
            <SelectContent>
              {questions.map((question) => (
                <SelectItem key={question.uniqueKeyName} value={question.uniqueKeyName}>
                  {question.questionToAsk}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedQuestion && (
          <>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="==">equals (==)</SelectItem>
                  <SelectItem value="!=">not equals (!=)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              {getSelectedQuestionObject()?.type === "dropdownList" ||
              getSelectedQuestionObject()?.type === "radioButton" ? (
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                  <SelectTrigger id="value">
                    <SelectValue placeholder="Select a value" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableValues().map((value, index) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="value"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  placeholder="Enter a value"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content to Display</Label>
              <Input
                id="content"
                value={conditionalContent}
                onChange={(e) => setConditionalContent(e.target.value)}
                placeholder="Content to show when condition is met"
              />
            </div>

            <Button
              onClick={handleAddConditional}
              disabled={!selectedQuestion || !selectedValue || !conditionalContent}
            >
              Add Conditional Content
            </Button>

            {selectedQuestion && selectedValue && conditionalContent && (
              <Card className="mt-2">
                <CardContent className="p-3 text-xs">
                  <p className="font-mono">
                    &#123;&#123;% if {selectedQuestion} {selectedCondition} &quot;{selectedValue}&quot; %&#125;&#125;
                    {conditionalContent}&#123;&#123;% endif %&#125;&#125;
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Dialog for creating a new question */}
        <Dialog open={showNewQuestionDialog} onOpenChange={setShowNewQuestionDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
            </DialogHeader>
            <QuestionEditor
              question={{
                id: `question_${Date.now()}`,
                uniqueKeyName: "",
                questionToAsk: "",
                type: "textField",
                isRequired: false,
                placeholder: "",
                selectionValue: "text",
                list: [],
              }}
              generateFieldKey={generateFieldKey}
              onUpdate={handleCreateQuestion}
              autoClose={true}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  )
}
