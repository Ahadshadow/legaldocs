"use client"

import { useState, useRef, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Plus, Trash2, Settings, Edit, Check, X, Code } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { QuestionEditor } from "./question-editor"
import { ScrollArea } from "./ui/scroll-area"
import { ConditionalLogicEditor } from "./conditional-logic-editor"
import { useToast } from "./ui/use-toast"
import { ConditionalEditor } from "./conditional-editor"

export function FormBuilder({
  formStructure,
  setFormStructure,
  generateFieldKey,
  addFieldToDocument,
  removeFieldFromDocument,
  addConditionalToDocument,
  documentContent,
  setDocumentContent,
  editorInstance,
}) {
  const { toast } = useToast()
  const [selectedStep, setSelectedStep] = useState(0)
  const [selectedSubsection, setSelectedSubsection] = useState(0)
  const [editingStepIndex, setEditingStepIndex] = useState(null)
  const [editingSubsectionIndex, setEditingSubsectionIndex] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [cursorPosition, setCursorPosition] = useState(null)
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState(null)
  const [openInsertFieldDialog, setOpenInsertFieldDialog] = useState(false)
  const [openConditionalDialog, setOpenConditionalDialog] = useState(false)
  const inputRef = useRef(null)

  // Update cursor position when editor instance changes
  useEffect(() => {
    if (editorInstance) {
      const { from } = editorInstance.state.selection
      setCursorPosition(from)
    }
  }, [editorInstance])

  // Add a new step with FAQ fields
  const addStep = () => {
    const newStepName = `Step ${formStructure.steps.length + 1}`
    const updatedSteps = [
      ...formStructure.steps,
      {
        name: newStepName,
        FAQQuestion: "",
        FAQAnswer: "",
        subsections: [
          {
            name: "New Subsection",
            FAQQuestion: "",
            FAQAnswer: "",
            question: [],
          },
        ],
      },
    ]

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })

    setSelectedStep(formStructure.steps.length)
    setSelectedSubsection(0)
  }

  // Add a new subsection with FAQ fields
  const addSubsection = (stepIndex) => {
    const newSubsectionName = `Subsection ${formStructure.steps[stepIndex].subsections.length + 1}`
    const updatedSteps = [...formStructure.steps]
    updatedSteps[stepIndex].subsections.push({
      name: newSubsectionName,
      FAQQuestion: "",
      FAQAnswer: "",
      question: [],
    })

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })

    setSelectedStep(stepIndex)
    setSelectedSubsection(updatedSteps[stepIndex].subsections.length - 1)
  }

  // Add a new question with all required fields
  const addQuestion = (stepIndex, subsectionIndex) => {
    const defaultQuestionText = "New Question"
    const uniqueKeyName = generateFieldKey(defaultQuestionText)

    const uniqueId = `question_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const newQuestion = {
      id: uniqueId,
      uniqueKeyName: uniqueKeyName,
      questionToAsk: defaultQuestionText,
      type: "textField",
      isRequired: false,
      placeholder: "Enter your answer",
      selectionValue: "text",
      list: [],
      listDescription: [],
      listSubType: [],
      affectedQuestion: [],
      documentId: [],
      isAutoFillAddress: false,
      defaultValue: null,
      formattedIDType: null,
      description: null,
      FAQQuestion: "",
      FAQAnswer: "",
    }

    const updatedSteps = [...formStructure.steps]
    updatedSteps[stepIndex].subsections[subsectionIndex].question.push(newQuestion)

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })

    // Get current cursor position from editor
    if (editorInstance) {
      const { from } = editorInstance.state.selection
      // Automatically add the field to the document at cursor position
      addFieldToDocument(uniqueKeyName, "input", from)
    } else {
      // Fallback if editor not available
      addFieldToDocument(uniqueKeyName, "input")
    }
  }

  // Start editing a step name
  const startEditingStep = (stepIndex, name) => {
    setEditingStepIndex(stepIndex)
    setEditingName(name)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  // Start editing a subsection name
  const startEditingSubsection = (stepIndex, subsectionIndex, name) => {
    setEditingSubsectionIndex({ stepIndex, subsectionIndex })
    setEditingName(name)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  // Save edited name
  const saveEditedName = () => {
    if (editingStepIndex !== null) {
      updateStepName(editingStepIndex, editingName)
      setEditingStepIndex(null)
    } else if (editingSubsectionIndex !== null) {
      updateSubsectionName(editingSubsectionIndex.stepIndex, editingSubsectionIndex.subsectionIndex, editingName)
      setEditingSubsectionIndex(null)
    }
    setEditingName("")
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingStepIndex(null)
    setEditingSubsectionIndex(null)
    setEditingName("")
  }

  // Update step name
  const updateStepName = (stepIndex, newName) => {
    const updatedSteps = [...formStructure.steps]
    updatedSteps[stepIndex].name = newName

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })
  }

  // Update subsection name
  const updateSubsectionName = (stepIndex, subsectionIndex, newName) => {
    const updatedSteps = [...formStructure.steps]
    updatedSteps[stepIndex].subsections[subsectionIndex].name = newName

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })
  }

  // Delete a step
  const deleteStep = (stepIndex) => {
    if (formStructure.steps.length <= 1) {
      return // Don't delete the last step
    }

    // Remove all questions in this step from the document
    formStructure.steps[stepIndex]?.subsections?.forEach((subsection) => {
      subsection?.question?.forEach((question) => {
        removeFieldFromDocument(question.uniqueKeyName)
      })
    })

    const updatedSteps = formStructure.steps.filter((_, index) => index !== stepIndex)

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })

    if (selectedStep >= updatedSteps.length) {
      setSelectedStep(updatedSteps.length - 1)
      setSelectedSubsection(0)
    }

    // Force editor update
    if (editorInstance) {
      setTimeout(() => {
        editorInstance.commands.focus()
      }, 100)
    }
  }

  // Delete a subsection
  const deleteSubsection = (stepIndex, subsectionIndex) => {
    if (formStructure.steps[stepIndex].subsections.length <= 1) {
      return // Don't delete the last subsection
    }

    // Remove all questions in this subsection from the document
    formStructure.steps[stepIndex].subsections[subsectionIndex].question.forEach((question) => {
      removeFieldFromDocument(question.uniqueKeyName)
    })

    const updatedSteps = [...formStructure.steps]
    updatedSteps[stepIndex].subsections = updatedSteps[stepIndex].subsections.filter(
      (_, index) => index !== subsectionIndex,
    )

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })

    if (selectedSubsection >= updatedSteps[stepIndex].subsections.length) {
      setSelectedSubsection(updatedSteps[stepIndex].subsections.length - 1)
    }

    // Force editor update
    if (editorInstance) {
      setTimeout(() => {
        editorInstance.commands.focus()
      }, 100)
    }
  }

  // Delete a question
  const deleteQuestion = (stepIndex, subsectionIndex, questionId) => {
    const question = formStructure.steps[stepIndex].subsections[subsectionIndex].question.find(
      (q) => q.id === questionId,
    )

    if (question) {
      // Remove the field from the document
      removeFieldFromDocument(question.uniqueKeyName)
    }

    const updatedSteps = [...formStructure.steps]
    updatedSteps[stepIndex].subsections[subsectionIndex].question = updatedSteps[stepIndex].subsections[
      subsectionIndex
    ].question.filter((q) => q.id !== questionId)

    // Also remove any conditional logic that references this question
    updatedSteps?.forEach((step) => {
      step?.subsections?.forEach((subsection) => {
        subsection?.question?.forEach((question) => {
          if (question.affectedQuestion) {
            question.affectedQuestion = question.affectedQuestion.filter((affected) => affected.id !== questionId)
          }
        })
      })
    })

    setFormStructure({
      ...formStructure,
      steps: updatedSteps,
    })

    // Force editor update with the new content
    if (editorInstance) {
      setTimeout(() => {
        // Force the editor to update with the latest content
        editorInstance.commands.setContent(documentContent)
        editorInstance.commands.focus()
      }, 100)
    }
  }

  // Update question
  const updateQuestion = (stepIndex, subsectionIndex, questionId, updatedQuestion) => {
    // Validate required fields
    if (!updatedQuestion.questionToAsk || !updatedQuestion.uniqueKeyName) {
      toast({
        title: "Validation Error",
        description: "Question text and field key are required",
        variant: "destructive",
      })
      return false
    }

    // Validate options for dropdown, radio, and checkbox types
    if (
      (updatedQuestion.type === "dropdownList" ||
        updatedQuestion.type === "radioButton" ||
        updatedQuestion.type === "checkboxes") &&
      (!updatedQuestion.list || updatedQuestion.list.length === 0 || updatedQuestion.list.some((item) => !item.name))
    ) {
      toast({
        title: "Validation Error",
        description: "Please add at least one option with a name",
        variant: "destructive",
      })
      return false
    }

    const updatedSteps = [...formStructure.steps]
    const questionIndex = updatedSteps[stepIndex].subsections[subsectionIndex].question.findIndex(
      (q) => q.id === questionId,
    )

    if (questionIndex !== -1) {
      const oldQuestion = updatedSteps[stepIndex].subsections[subsectionIndex].question[questionIndex]
      const oldFieldKey = oldQuestion.uniqueKeyName
      const newFieldKey = updatedQuestion.uniqueKeyName

      // If the field key changed, update references in the document
      if (oldFieldKey !== newFieldKey) {
        // Update the document content by replacing all instances of the old field key
        // with the new field key, preserving the rest of the field format
        let updatedContent = documentContent

        // Replace field placeholders
        const fieldRegex = new RegExp(`\\{\\{%\\s*${oldFieldKey}\\s*(\\|[^}]*%\\}\\})`, "g")
        updatedContent = updatedContent.replace(fieldRegex, (match, formatPart) => {
          return `{{% ${newFieldKey}${formatPart}`
        })

        // Replace conditional logic references
        const conditionalRegex = new RegExp(`\\{%\\s*if\\s+${oldFieldKey}\\s*`, "g")
        updatedContent = updatedContent.replace(conditionalRegex, (match) => {
          return match.replace(oldFieldKey, newFieldKey)
        })

        // Update the document content
        setDocumentContent(updatedContent)

        // Update the editor if it exists
        if (editorInstance) {
          setTimeout(() => {
            editorInstance.commands.setContent(updatedContent)
          }, 10)
        }
      }

      // Update the question in the form structure
      updatedSteps[stepIndex].subsections[subsectionIndex].question[questionIndex] = {
        ...oldQuestion,
        ...updatedQuestion,
      }

      setFormStructure({
        ...formStructure,
        steps: updatedSteps,
      })

      return true
    }

    return false
  }

  // Get all questions for conditional logic
  const getAllQuestions = () => {
    const questions = []

    formStructure?.steps?.forEach((step) => {
      step?.subsections?.forEach((subsection) => {
        subsection?.question?.forEach((question) => {
          questions.push({
            id: question.id,
            uniqueKeyName: question.uniqueKeyName,
            questionToAsk: question.questionToAsk,
            type: question.type,
            list: question.list || [],
          })
        })
      })
    })

    return questions
  }

  // Function to get questions that affect this question
  const getAffectingQuestions = (questionId) => {
    const affectingQuestions = []

    formStructure?.steps?.forEach((step) => {
      step?.subsections?.forEach((subsection) => {
        subsection?.question?.forEach((question) => {
          if (question.affectedQuestion && question.affectedQuestion.some((q) => q.id === questionId)) {
            affectingQuestions.push({
              id: question.id,
              uniqueKeyName: question.uniqueKeyName,
              questionToAsk: question.questionToAsk,
              values: question.affectedQuestion.find((q) => q.id === questionId).value,
            })
          }
        })
      })
    })

    return affectingQuestions
  }

  // Add a new question directly from the conditional editor
  const addNewQuestionFromConditional = (newQuestion) => {
    if (formStructure.steps.length > 0) {
      const stepIndex = selectedStep
      const subsectionIndex = selectedSubsection

      const uniqueId = `question_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const uniqueKeyName = newQuestion.uniqueKeyName || generateFieldKey(newQuestion.questionToAsk)

      const questionToAdd = {
        ...newQuestion,
        id: uniqueId,
        uniqueKeyName: uniqueKeyName,
        affectedQuestion: [],
      }

      const updatedSteps = [...formStructure.steps]
      updatedSteps[stepIndex].subsections[subsectionIndex].question.push(questionToAdd)

      setFormStructure({
        ...formStructure,
        steps: updatedSteps,
      })

      return questionToAdd
    }
    return null
  }

  // Open question editor dialog
  const openQuestionEditor = (question, stepIndex, subsectionIndex) => {
    setCurrentQuestion(question)
    setCurrentQuestionIndices({ stepIndex, subsectionIndex })
    setOpenQuestionDialog(true)
  }

  // Open conditional logic editor dialog
  const openConditionalEditor = (question, stepIndex, subsectionIndex) => {
    setCurrentQuestion(question)
    setCurrentQuestionIndices({ stepIndex, subsectionIndex })
    setOpenConditionalDialog(true)
  }

  // Handle question update from dialog
  const handleQuestionUpdate = (updatedQuestion) => {
    if (currentQuestionIndices) {
      const success = updateQuestion(
        currentQuestionIndices.stepIndex,
        currentQuestionIndices.subsectionIndex,
        currentQuestion.id,
        updatedQuestion,
      )

      if (success) {
        setOpenQuestionDialog(false)
      }
    }
  }

  // Handle conditional logic update from dialog
  const handleConditionalUpdate = (updatedQuestion) => {
    if (currentQuestionIndices) {
      const success = updateQuestion(
        currentQuestionIndices.stepIndex,
        currentQuestionIndices.subsectionIndex,
        currentQuestion.id,
        updatedQuestion,
      )

      if (success) {
        setOpenConditionalDialog(false)
        toast({
          title: "Conditional Logic Updated",
          description: "The conditional logic for this question has been updated.",
        })
      }
    }
  }

  // Insert a field at the current cursor position
  const insertField = (fieldKey, fieldType = "input") => {
    if (editorInstance) {
      const { from } = editorInstance.state.selection
      addFieldToDocument(fieldKey, fieldType, from)
      editorInstance.commands.focus()
    } else {
      addFieldToDocument(fieldKey, fieldType)
    }
  }

  // Insert a conditional field at the current cursor position
  const insertConditionalField = (controllingField, value, dependentField) => {
    if (editorInstance) {
      const { from } = editorInstance.state.selection
      const conditionalContent = `{{% ${dependentField} | input | underscore %}}`
      addConditionalToDocument(controllingField, "==", value, conditionalContent, from)
      editorInstance.commands.focus()
    } else {
      const conditionalContent = `{{% ${dependentField} | input | underscore %}}`
      addConditionalToDocument(controllingField, "==", value, conditionalContent)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-73px)]">
      <div className="p-4 space-y-4">
        <Accordion type="multiple" defaultValue={["steps", "conditionals"]}>
          <AccordionItem value="steps">
            <AccordionTrigger>Form Structure</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {formStructure.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className={`p-3 border rounded-md ${selectedStep === stepIndex ? "border-primary bg-primary/5" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {editingStepIndex === stepIndex ? (
                        <div className="flex items-center space-x-1 flex-1">
                          <Input
                            ref={inputRef}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditedName()
                              if (e.key === "Escape") cancelEditing()
                            }}
                            className="h-8"
                          />
                          <div
                            role="button"
                            tabIndex={0}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
                            onClick={saveEditedName}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === "Space") saveEditedName()
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          <div
                            role="button"
                            tabIndex={0}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
                            onClick={cancelEditing}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === "Space") cancelEditing()
                            }}
                          >
                            <X className="h-4 w-4" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium flex items-center">
                            {step.name}
                            <div
                              role="button"
                              tabIndex={0}
                              className="h-6 w-6 ml-1 flex items-center justify-center rounded-md hover:bg-accent"
                              onClick={() => startEditingStep(stepIndex, step.name)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === "Space") startEditingStep(stepIndex, step.name)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </div>
                          </div>
                          <div
                            role="button"
                            tabIndex={0}
                            className={`h-8 w-8 flex items-center justify-center rounded-md ${
                              formStructure.steps.length <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-accent cursor-pointer"
                            }`}
                            onClick={() => {
                              if (formStructure.steps.length > 1) {
                                deleteStep(stepIndex)
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || (e.key === "Space" && formStructure.steps.length > 1)) {
                                deleteStep(stepIndex)
                              }
                            }}
                            aria-disabled={formStructure.steps.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Add FAQ fields for steps */}
                    <div className="mt-2 space-y-2">
                      <div className="text-xs font-medium">Step FAQ</div>
                      <Input
                        placeholder="FAQ Question"
                        value={step.FAQQuestion || ""}
                        onChange={(e) => {
                          const updatedSteps = [...formStructure.steps]
                          updatedSteps[stepIndex].FAQQuestion = e.target.value
                          setFormStructure({
                            ...formStructure,
                            steps: updatedSteps,
                          })
                        }}
                        className="text-xs h-7"
                      />
                      <Input
                        placeholder="FAQ Answer"
                        value={step.FAQAnswer || ""}
                        onChange={(e) => {
                          const updatedSteps = [...formStructure.steps]
                          updatedSteps[stepIndex].FAQAnswer = e.target.value
                          setFormStructure({
                            ...formStructure,
                            steps: updatedSteps,
                          })
                        }}
                        className="text-xs h-7"
                      />
                    </div>

                    <div className="pl-4 border-l-2 border-gray-200 mt-3">
                      <div className="text-sm font-medium mb-2">Subsections</div>
                      <div className="space-y-2">
                        {formStructure.steps.map((step, stepIndex) =>
                          step.subsections.map((subsection, subsectionIndex) => (
                            <Accordion
                              key={subsectionIndex}
                              type="single"
                              collapsible
                              className={`border rounded-md ${
                                selectedStep === stepIndex && selectedSubsection === subsectionIndex
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200"
                              }`}
                            >
                              <AccordionItem value="subsection" className="border-none">
                                <div
                                  className="flex items-center justify-between w-full px-3 py-2 cursor-pointer"
                                  onClick={() => {
                                    const accordionTrigger = document.getElementById(
                                      `subsection-${stepIndex}-${subsectionIndex}`,
                                    )
                                    if (accordionTrigger) {
                                      accordionTrigger.click()
                                    }
                                  }}
                                >
                                  {editingSubsectionIndex &&
                                  editingSubsectionIndex.stepIndex === stepIndex &&
                                  editingSubsectionIndex.subsectionIndex === subsectionIndex ? (
                                    <div className="flex items-center space-x-1 flex-1">
                                      <Input
                                        ref={inputRef}
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") saveEditedName()
                                          if (e.key === "Escape") cancelEditing()
                                        }}
                                        className="h-7 text-sm"
                                      />
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent"
                                        onClick={saveEditedName}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === "Space") saveEditedName()
                                        }}
                                      >
                                        <Check className="h-3 w-3" />
                                      </div>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent"
                                        onClick={cancelEditing}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === "Space") cancelEditing()
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-sm flex items-center">
                                        {subsection.name}
                                        <div
                                          role="button"
                                          tabIndex={0}
                                          className="h-5 w-5 ml-1 flex items-center justify-center rounded-md hover:bg-accent"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            startEditingSubsection(stepIndex, subsectionIndex, subsection.name)
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === "Space") {
                                              e.stopPropagation()
                                              startEditingSubsection(stepIndex, subsectionIndex, subsection.name)
                                            }
                                          }}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </div>
                                      </span>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className={`h-6 w-6 flex items-center justify-center rounded-md ${
                                          step.subsections.length <= 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-accent cursor-pointer"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (step.subsections.length > 1) {
                                            deleteSubsection(stepIndex, subsectionIndex)
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === "Space") {
                                            e.stopPropagation()
                                            if (step.subsections.length > 1) {
                                              deleteSubsection(stepIndex, subsectionIndex)
                                            }
                                          }
                                        }}
                                        aria-disabled={step.subsections.length <= 1}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <AccordionTrigger
                                  id={`subsection-${stepIndex}-${subsectionIndex}`}
                                  className="sr-only"
                                />
                                <AccordionContent className="px-3 pb-2">
                                  {/* Add FAQ fields for subsections */}
                                  <div className="mb-3 space-y-2">
                                    <div className="text-xs font-medium">Subsection FAQ</div>
                                    <Input
                                      placeholder="FAQ Question"
                                      value={subsection.FAQQuestion || ""}
                                      onChange={(e) => {
                                        const updatedSteps = [...formStructure.steps]
                                        updatedSteps[stepIndex].subsections[subsectionIndex].FAQQuestion =
                                          e.target.value
                                        setFormStructure({
                                          ...formStructure,
                                          steps: updatedSteps,
                                        })
                                      }}
                                      className="text-xs h-7"
                                    />
                                    <Input
                                      placeholder="FAQ Answer"
                                      value={subsection.FAQAnswer || ""}
                                      onChange={(e) => {
                                        const updatedSteps = [...formStructure.steps]
                                        updatedSteps[stepIndex].subsections[subsectionIndex].FAQAnswer = e.target.value
                                        setFormStructure({
                                          ...formStructure,
                                          steps: updatedSteps,
                                        })
                                      }}
                                      className="text-xs h-7"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="text-xs font-medium mb-1">Questions</div>
                                    {subsection?.question?.length === 0 ? (
                                      <div className="text-xs text-muted-foreground py-2">No questions added</div>
                                    ) : (
                                      <div className="space-y-2">
                                        {subsection?.question?.map((question) => {
                                          const affectingQuestions = getAffectingQuestions(question.id)

                                          return (
                                            <div
                                              key={question.id}
                                              className="flex items-center justify-between p-2 border rounded-md text-xs"
                                            >
                                              <div className="flex flex-col">
                                                <span className="font-medium">{question.questionToAsk}</span>
                                                <span className="text-muted-foreground text-xs">
                                                  {question.uniqueKeyName}
                                                </span>
                                                {question.affectedQuestion && question.affectedQuestion.length > 0 && (
                                                  <span className="text-xs text-blue-500 mt-1">
                                                    Controls {question.affectedQuestion.length} question(s)
                                                  </span>
                                                )}
                                                {affectingQuestions.length > 0 && (
                                                  <span className="text-xs text-green-500 mt-1">
                                                    Depends on:{" "}
                                                    {affectingQuestions.map((q) => q.questionToAsk).join(", ")}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex space-x-1">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() => {
                                                    insertField(question.uniqueKeyName, "input")
                                                  }}
                                                  title="Insert Field"
                                                >
                                                  <Plus className="h-3 w-3" />
                                                </Button>

                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() =>
                                                    openQuestionEditor(question, stepIndex, subsectionIndex)
                                                  }
                                                  title="Edit Question"
                                                >
                                                  <Settings className="h-3 w-3" />
                                                </Button>

                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() =>
                                                    openConditionalEditor(question, stepIndex, subsectionIndex)
                                                  }
                                                  title="Edit Conditional Logic"
                                                >
                                                  <Code className="h-3 w-3" />
                                                </Button>

                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() =>
                                                    deleteQuestion(stepIndex, subsectionIndex, question.id)
                                                  }
                                                  title="Delete Question"
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-xs"
                                      onClick={() => {
                                        setSelectedStep(stepIndex)
                                        setSelectedSubsection(subsectionIndex)
                                        addQuestion(stepIndex, subsectionIndex)
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" /> Add Question
                                    </Button>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )),
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => addSubsection(stepIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Subsection
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full" onClick={addStep}>
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="conditionals">
            <AccordionTrigger>Conditional Content</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add conditional content that will appear based on form responses.
                </p>

                {getAllQuestions().length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2 border rounded-md">
                    Add questions first to create conditional content.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <h3 className="text-sm font-medium mb-2">Insert Conditional Field</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Insert a field that only appears when another question has a specific value.
                      </p>

                      <div className="space-y-3">
                        {formStructure.steps.map((step) =>
                          step.subsections.map((subsection) =>
                            subsection?.question?.map((question) => {
                              if (question.affectedQuestion && question.affectedQuestion.length > 0) {
                                return question.affectedQuestion.map((affected, index) => {
                                  const affectedQuestion = getAllQuestions().find((q) => q.id === affected.id)
                                  if (!affectedQuestion) return null

                                  return (
                                    <div
                                      key={`${question.id}-${affected.id}-${index}`}
                                      className="border rounded-md p-2"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="text-xs font-medium">
                                            If <span className="text-blue-500">{question.questionToAsk}</span> is{" "}
                                            <span className="text-green-500">{affected.value.join(" or ")}</span>
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Show{" "}
                                            <span className="text-purple-500">{affectedQuestion.questionToAsk}</span>
                                          </p>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            insertConditionalField(
                                              question.uniqueKeyName,
                                              affected.value[0],
                                              affectedQuestion.uniqueKeyName,
                                            )
                                          }}
                                        >
                                          Insert
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                })
                              }
                              return null
                            }),
                          ),
                        )}
                      </div>
                    </div>

                    <ConditionalEditor
                      questions={getAllQuestions()}
                      addConditionalToDocument={(fieldKey, condition, value, content) => {
                        // Get current cursor position from editor
                        if (editorInstance) {
                          const { from } = editorInstance.state.selection
                          addConditionalToDocument(fieldKey, condition, value, content, from)
                        } else {
                          addConditionalToDocument(fieldKey, condition, value, content)
                        }
                      }}
                      generateFieldKey={generateFieldKey}
                      onAddQuestion={addNewQuestionFromConditional}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Question Editor Dialog */}
      <Dialog open={openQuestionDialog} onOpenChange={setOpenQuestionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <QuestionEditor
              question={currentQuestion}
              generateFieldKey={generateFieldKey}
              onUpdate={handleQuestionUpdate}
              autoClose={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Conditional Logic Editor Dialog */}
      <Dialog open={openConditionalDialog} onOpenChange={setOpenConditionalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Conditional Logic</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <ConditionalLogicEditor
              question={currentQuestion}
              allQuestions={getAllQuestions().filter((q) => q.id !== currentQuestion.id)}
              onUpdate={handleConditionalUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Insert Field Dialog */}
      <Dialog open={openInsertFieldDialog} onOpenChange={setOpenInsertFieldDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Field</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 gap-2">
              {getAllQuestions().length > 0 ? (
                getAllQuestions().map((question) => (
                  <div
                    key={question.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-accent"
                    onClick={() => {
                      if (editorInstance) {
                        const { from } = editorInstance.state.selection
                        addFieldToDocument(question.uniqueKeyName, "input", from)
                      } else {
                        addFieldToDocument(question.uniqueKeyName, "input")
                      }
                      setOpenInsertFieldDialog(false)
                    }}
                  >
                    <div className="font-medium">{question.questionToAsk}</div>
                    <div className="text-sm text-muted-foreground">Field key: {question.uniqueKeyName}</div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No fields found. Add questions in the form builder first.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}
