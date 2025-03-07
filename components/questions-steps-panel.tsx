"use client"

// Version 465

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { useDocument } from "./context/document-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface Question {
  label: string
  type: "input" | "dropdown"
}

interface Step {
  text: string
  questions: Question[]
}

export function QuestionsStepsPanel() {
  const { setActivePanel, editor } = useDocument()
  const [steps, setSteps] = useState<Step[]>([])
  const [newStep, setNewStep] = useState("")
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [newQuestionType, setNewQuestionType] = useState<"input" | "dropdown" | "">("")
  const [newQuestionLabel, setNewQuestionLabel] = useState("")

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { text: newStep.trim(), questions: [] }])
      setNewStep("")
    }
  }

  const removeStep = (index: number) => {
    const stepToRemove = steps[index]

    // Remove all questions associated with this step from the document
    if (editor) {
      stepToRemove.questions.forEach((question) => {
        removeQuestionFromDocument(stepToRemove.text, question.label, question.type)
      })
    }

    // Remove the step from the steps array
    setSteps(steps.filter((_, i) => i !== index))

    if (selectedStepIndex === index) {
      setSelectedStepIndex(null)
    }
  }

  const addQuestion = () => {
    if (selectedStepIndex !== null && selectedStepIndex < steps.length && newQuestionType && newQuestionLabel.trim()) {
      const newQuestion: Question = {
        label: newQuestionLabel.trim(),
        type: newQuestionType,
      }

      setSteps(
        steps.map((step, index) =>
          index === selectedStepIndex ? { ...step, questions: [...step.questions, newQuestion] } : step,
        ),
      )

      if (editor) {
        editor
          .chain()
          .focus()
          .setCustomQuestion(steps[selectedStepIndex].text, newQuestion.label, newQuestion.type)
          .run()
      }

      setNewQuestionLabel("")
      setNewQuestionType("")
    }
  }

  const removeQuestion = (stepIndex: number, questionIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const stepText = steps[stepIndex].text
      const questionLabel = steps[stepIndex].questions[questionIndex].label
      const questionType = steps[stepIndex].questions[questionIndex].type

      // Remove the question from the steps state
      setSteps(
        steps.map((step, sIndex) =>
          sIndex === stepIndex
            ? { ...step, questions: step.questions.filter((_, qIndex) => qIndex !== questionIndex) }
            : step,
        ),
      )

      // Remove the question from the document
      removeQuestionFromDocument(stepText, questionLabel, questionType)
    }
  }

  const removeQuestionFromDocument = (stepText: string, questionLabel: string, questionType: string) => {
    if (editor) {
      const { state } = editor

      state.doc.descendants((node, pos) => {
        if (
          node.type.name === "customQuestion" &&
          node.attrs.step === stepText &&
          node.attrs.question === questionLabel &&
          node.attrs.type === questionType
        ) {
          editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + node.nodeSize })
            .run()
          return false // Stop searching after the first match
        }
      })
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-4 overflow-y-auto">
        <h3 className="text-sm font-medium">Questions & Steps</h3>
        <div className="space-y-2">
          <Input
            placeholder="Add a new step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addStep()
              }
            }}
          />
          <Button onClick={addStep} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
        <div className="space-y-4">
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} className="bg-gray-100 p-2 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{step.text}</span>
                <Button variant="ghost" size="sm" onClick={() => removeStep(stepIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {step.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="text-sm pl-4 flex justify-between items-center">
                  <span>
                    Q: {question.label} ({question.type})
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(stepIndex, questionIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStepIndex(stepIndex)}
                className="w-full mt-2"
              >
                Add Question to this Step
              </Button>
            </div>
          ))}
        </div>
        {selectedStepIndex !== null && selectedStepIndex < steps.length && (
          <div className="space-y-2 bg-blue-50 p-2 rounded">
            <h4 className="text-sm font-medium">Add Question to: {steps[selectedStepIndex].text}</h4>
            <Select
              value={newQuestionType}
              onValueChange={(value: "input" | "dropdown" | "") => setNewQuestionType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
              </SelectContent>
            </Select>
            {newQuestionType && (
              <Input
                placeholder="Enter question label..."
                value={newQuestionLabel}
                onChange={(e) => setNewQuestionLabel(e.target.value)}
              />
            )}
            <Button onClick={addQuestion} disabled={!newQuestionType || !newQuestionLabel.trim()}>
              Add Question
            </Button>
          </div>
        )}
      </div>
      <div className="mt-auto p-4 border-t">
        <Button className="w-full" variant="secondary" onClick={() => setActivePanel(null)}>
          Close Questions & Steps
        </Button>
      </div>
    </div>
  )
}

