"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "../components/ui/button"

import { Input } from "../components/ui/input"
import { Plus, Trash2, Edit2, Check, Link, RefreshCw } from "lucide-react"
import { useDocument } from "./context/document-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { generateAttribute } from "../lib/utils"
import { toast } from "sonner"
import { mergeStepsData, parseDocumentContent } from "./Editor/editor-helper"

interface Question {
  id?: string
  label: string
  type: "input" | "dropdown" | "checkbox" | "radio" | "date"
  attribute: string
  options?: string[]
  dependence?: {
    question: string
    value: string
  }
  faqQuestion?: string
  faqAnswer?: string
}

interface Subsection {
  name: string
  questions: Question[]
  faqQuestion?: string
  faqAnswer?: string
}

interface Step {
  name: string
  subsections: Subsection[]
}

// This interface matches the format expected by the form renderer
interface FormRendererQuestion {
  id: string
  uniqueKeyName: string
  type: "textField" | "dropdownList" | "radioButton" | "checkboxes" | "multipleEntryList"
  questionToAsk: string
  selectionValue?: string
  isRequired: boolean
  placeholder: string
  list: Array<{ name: string }>
  affectedQuestion: Array<{ id: string; value: string[] }>
  answer?: string
  faqQuestion?: string
  faqAnswer?: string
}

interface FormRendererSubsection {
  name: string
  question: FormRendererQuestion[]
  faqQuestion?: string
  faqAnswer?: string
}

interface FormRendererStep {
  name: string
  subsections: FormRendererSubsection[]
}

export function QuestionsStepsPanel() {
  const { setActivePanel, editor, pages, initialData } = useDocument()
  const [definition, setDefinition] = useState<Step[]>([])
  const [newStepName, setNewStepName] = useState("")
  const [newSubsectionName, setNewSubsectionName] = useState("")
  const [newSubsectionFaqQuestion, setNewSubsectionFaqQuestion] = useState("")
  const [newSubsectionFaqAnswer, setNewSubsectionFaqAnswer] = useState("")
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [selectedSubsectionIndex, setSelectedSubsectionIndex] = useState<number | null>(null)
  const [newQuestionType, setNewQuestionType] = useState<"input" | "dropdown" | "checkbox" | "radio" | "date" | "">("")
  const [newQuestionLabel, setNewQuestionLabel] = useState("")
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)
  const [editingStepText, setEditingStepText] = useState("")
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)
  const [editingQuestionLabel, setEditingQuestionLabel] = useState("")
  const [editingQuestionType, setEditingQuestionType] = useState<"input" | "dropdown" | "checkbox" | "radio" | "date">(
    "input",
  )
  const [editingDependence, setEditingDependence] = useState<{ question: string; value: string } | null>(null)
  const [editingSubsectionIndex, setEditingSubsectionIndex] = useState<number | null>(null)
  const [editingSubsectionText, setEditingSubsectionText] = useState("")
  const [editingSubsectionFaqQuestion, setEditingSubsectionFaqQuestion] = useState("")
  const [editingSubsectionFaqAnswer, setEditingSubsectionFaqAnswer] = useState("")
  const [newQuestionFaqQuestion, setNewQuestionFaqQuestion] = useState("")
  const [newQuestionFaqAnswer, setNewQuestionFaqAnswer] = useState("")
  const [editingQuestionFaqQuestion, setEditingQuestionFaqQuestion] = useState("")
  const [editingQuestionFaqAnswer, setEditingQuestionFaqAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [showDependencyFields, setShowDependencyFields] = useState(false)
  const [dependencyValue, setDependencyValue] = useState("")
  const [dependencyQuestion, setDependencyQuestion] = useState("")
  const [optionsInput, setOptionsInput] = useState("")
  const [dependencyOptions, setDependencyOptions] = useState<string[]>([])

  // Add this function inside the QuestionsStepsPanel component
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout | null = null
    return (...args: any) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Add this after the state declarations
  const debouncedSave = useRef(
    debounce((data: Step[]) => {
      try {
        // Convert to form renderer format before saving
        const formRendererData = convertToFormRendererFormat(data)
        localStorage.setItem("document-steps-definition", JSON.stringify(formRendererData))
      } catch (error) {
        console.error("Error saving steps data to localStorage:", error)
      }
    }, 500),
  ).current

  // Convert from our internal format to the form renderer format
  const convertToFormRendererFormat = (steps: Step[]): FormRendererStep[] => {
    return steps.map((step) => ({
      name: step.name,
      subsections: step.subsections.map((subsection) => ({
        name: subsection.name,
        faqQuestion: subsection.faqQuestion || "",
        faqAnswer: subsection.faqAnswer || "",
        question: subsection.questions.map((question) => {
          // Convert question type
          let type: "textField" | "dropdownList" | "radioButton" | "checkboxes" | "multipleEntryList"
          switch (question.type) {
            case "dropdown":
              type = "dropdownList"
              break
            case "checkbox":
              type = "checkboxes"
              break
            case "radio":
              type = "radioButton"
              break
            default:
              type = "textField"
          }

          // Convert options to list format
          const list = []
          if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option) => {
              list.push({ name: option })
            })
          }

          // Create affected questions array
          const affectedQuestion: Array<{ id: string; value: string[] }> = []

          return {
            id: question.id || Math.random().toString(36).substring(2, 9),
            uniqueKeyName: question.attribute,
            type: type,
            questionToAsk: question.label,
            selectionValue: question.type === "date" ? "date" : "",
            isRequired: true,
            placeholder: `Enter ${question.label}`,
            list: list,
            affectedQuestion: affectedQuestion,
            answer: "",
            faqQuestion: question.faqQuestion || "",
            faqAnswer: question.faqAnswer || "",
          }
        }),
      })),
    }))
  }

  // Convert from form renderer format to our internal format
  const convertFromFormRendererFormat = (steps: any[]): Step[] => {
    if (!steps || !Array.isArray(steps)) return []

    return steps.map((step) => ({
      name: step.name,
      subsections: step.subsections.map((subsection) => ({
        name: subsection.name,
        faqQuestion: subsection.faqQuestion || "",
        faqAnswer: subsection.faqAnswer || "",
        questions: (subsection.question || []).map((question) => {
          // Convert question type
          let type: "input" | "dropdown" | "checkbox" | "radio" | "date"
          switch (question.type) {
            case "dropdownList":
              type = "dropdown"
              break
            case "checkboxes":
              type = "checkbox"
              break
            case "radioButton":
              type = "radio"
              break
            default:
              type = question.selectionValue === "date" ? "date" : "input"
          }

          // Convert list to options array
          const options = (question.list || []).map((item) => item.name)

          return {
            id: question.id,
            label: question.questionToAsk,
            type: type,
            attribute: question.uniqueKeyName,
            options: options,
            dependence: null, // We'll handle dependencies separately
            faqQuestion: question.faqQuestion || "",
            faqAnswer: question.faqAnswer || "",
          }
        }),
      })),
    }))
  }

  // Process dependencies after conversion
  const processDependencies = (steps: Step[], formRendererSteps: any[]): Step[] => {
    const updatedSteps = [...steps]

    // Create a map of all questions by uniqueKeyName
    const questionMap = new Map()
    updatedSteps.forEach((step, stepIndex) => {
      step.subsections.forEach((subsection, subsectionIndex) => {
        subsection.questions.forEach((question, questionIndex) => {
          questionMap.set(question.attribute, {
            stepIndex,
            subsectionIndex,
            questionIndex,
            question,
          })
        })
      })
    })

    // Process affected questions
    formRendererSteps.forEach((step) => {
      step.subsections.forEach((subsection) => {
        subsection.question.forEach((question) => {
          if (question.affectedQuestion && question.affectedQuestion.length > 0) {
            question.affectedQuestion.forEach((affected) => {
              const targetQuestion = questionMap.get(affected.id)
              if (targetQuestion) {
                const { stepIndex, subsectionIndex, questionIndex } = targetQuestion

                // Set dependence on the target question
                updatedSteps[stepIndex].subsections[subsectionIndex].questions[questionIndex].dependence = {
                  question: question.uniqueKeyName,
                  value: affected.value[0], // Take the first value for simplicity
                }
              }
            })
          }
        })
      })
    })

    return updatedSteps
  }

  // Parse document content and extract steps data
  const parseDocumentSteps = useCallback(() => {
    setIsLoading(true)

    
    try {
      if (pages && pages.length > 0) {
        const content = pages[0].content
        const parsedSteps = parseDocumentContent(content)

        // If we have steps data from the API, merge it with the parsed steps
        let mergedSteps = parsedSteps
        if (initialData && initialData.steps && initialData.steps.length > 0) {
          mergedSteps = mergeStepsData(initialData.steps, parsedSteps)
        }

        // Convert to our internal format
        const internalFormat = convertFromFormRendererFormat(mergedSteps)

        // Process dependencies
        const withDependencies = processDependencies(internalFormat, mergedSteps)

        setDefinition(withDependencies)
        toast.success("Document steps parsed successfully")
      }
    } catch (error) {
      console.log("Error parsing document steps:", error)
      toast.error("Failed to parse document steps")
    } finally {
      setIsLoading(false)
    }
  }, [pages, initialData])

  // Load steps data on component mount
  useEffect(() => {
    // First try to load from localStorage
    try {
      const savedData = localStorage.getItem("document-steps-definition")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Convert from form renderer format to our internal format
        const internalFormat = convertFromFormRendererFormat(parsedData)
        // Process dependencies
        const withDependencies = processDependencies(internalFormat, parsedData)
        setDefinition(withDependencies)
      } else if (initialData && initialData.steps && initialData.steps.length > 0) {
        // If no localStorage data, try to load from API data
        const internalFormat = convertFromFormRendererFormat(initialData.steps)
        // Process dependencies
        const withDependencies = processDependencies(internalFormat, initialData.steps)
        setDefinition(withDependencies)
      } else {
        // If no data from localStorage or API, parse from document content
        parseDocumentSteps()
      }
    } catch (error) {
      console.error("Error loading steps data:", error)
      // If error, try to parse from document content
      parseDocumentSteps()
    }
  }, [initialData, parseDocumentSteps])

  useEffect(() => {
    if (selectedStepIndex !== null && dependencyQuestion) {
      const selectedQuestion = definition[selectedStepIndex].subsections
        .flatMap((subsection) => subsection.questions)
        .find((q) => q.attribute === dependencyQuestion)
      if (selectedQuestion && selectedQuestion.options) {
        setDependencyOptions(selectedQuestion.options)
      } else {
        setDependencyOptions([])
      }
    }
  }, [dependencyQuestion, selectedStepIndex, definition])

  useEffect(() => {
    if (editingDependence && editingDependence.question) {
      const currentStep = definition[selectedStepIndex!]
      const dependentQuestion = currentStep.subsections
        .flatMap((subsection) => subsection.questions)
        .find((q) => q.attribute === editingDependence.question)
      if (dependentQuestion && dependentQuestion.options) {
        setDependencyOptions(dependentQuestion.options)
      } else {
        setDependencyOptions([])
      }
    }
  }, [editingDependence, selectedStepIndex, definition])

  useEffect(() => {
    // Add CSS to ensure consistent styling for dependency questions in the document
    const style = document.createElement("style")
    style.textContent = `
  /* Target all question formats including those with commas */
  span[data-type="custom-question"],
  span:has(code),
  span:contains("{{% "),
  span:contains("%}}"),
  span:contains("if"),
  span:contains("endif"),
  span:contains("=="),
  span:contains("underscore"),
  code,
  p:contains("{{% if"),
  p:contains("{{% endif"),
  p:contains("underscore") {
    background-color: #f0f9ff !important;
    border-radius: 4px !important;
    padding: 2px 4px !important;
    font-weight: medium !important;
    color: #0066cc !important;
    display: inline-block !important;
    margin: 0 2px !important;
    border: 1px solid #e6f3ff !important;
    font-family: monospace !important;
  }
  
  /* Ensure no nested backgrounds */
  span[data-type="custom-question"] span,
  span:contains("{{% ") span,
  span:contains("%}}") span,
  span:contains("if") span,
  span:contains("endif") span {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Direct targeting for the specific problematic format */
  *:contains("{{% if") {
    background-color: #f0f9ff !important;
    border-radius: 4px !important;
    border: 1px solid #e6f3ff !important;
  }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Add this useEffect after the other useEffect hooks
  // useEffect(() => {
  //   console.log(
  //     "Current Definition Array:",
  //     definition.map((step) => ({
  //       name: step.name,
  //       subsections: step.subsections.map((subsection) => ({
  //         name: subsection.name,
  //         faqQuestion: subsection.faqQuestion,
  //         faqAnswer: subsection.faqAnswer,
  //         questions: subsection.questions.map((q) => ({
  //           label: q.label,
  //           faqQuestion: q.faqQuestion,
  //           faqAnswer: q.faqAnswer,
  //           type: q.type,
  //           attribute: q.attribute,
  //           options: q.options,
  //           dependence: q.dependence
  //             ? {
  //                 question: q.dependence.question,
  //                 value: q.dependence.value,
  //               }
  //             : undefined,
  //         })),
  //       })),
  //     })),
  //   )
  // }, [definition])

  // Add this useEffect to save the steps definition to localStorage when it changes
  useEffect(() => {
    if (definition.length > 0) {
      debouncedSave(definition)
    }
  }, [definition, debouncedSave])

  // Add this useEffect to save the steps definition to localStorage when the component unmounts
  useEffect(() => {
    return () => {
      if (definition.length > 0) {
        try {
          const formRendererData = convertToFormRendererFormat(definition)
          localStorage.setItem("document-steps-definition", JSON.stringify(formRendererData))
        } catch (error) {
          console.error("Error saving steps data to localStorage on unmount:", error)
        }
      }
    }
  }, [definition])

  const addStep = () => {
    if (newStepName.trim()) {
      setDefinition([...definition, { name: newStepName.trim(), subsections: [] }])
      setNewStepName("")
    }
  }

  // Update the addSubsection function to include the FAQ fields
  const addSubsection = (stepIndex: number) => {
    if (newSubsectionName.trim() && stepIndex >= 0 && stepIndex < definition.length) {
      setDefinition(
        definition.map((step, i) =>
          i === stepIndex
            ? {
                ...step,
                subsections: [
                  ...step.subsections,
                  {
                    name: newSubsectionName.trim(),
                    questions: [],
                    faqQuestion: newSubsectionFaqQuestion.trim(),
                    faqAnswer: newSubsectionFaqAnswer.trim(),
                  },
                ],
              }
            : step,
        ),
      )
      setNewSubsectionName("")
      setNewSubsectionFaqQuestion("")
      setNewSubsectionFaqAnswer("")
    }
  }

  const startEditingStep = (index: number) => {
    setEditingStepIndex(index)
    setEditingStepText(definition[index].name)
  }

  const updateStep = (index: number) => {
    setDefinition(definition.map((step, i) => (i === index ? { ...step, name: editingStepText.trim() } : step)))
    setEditingStepIndex(null)
  }

  const startEditingSubsection = (stepIndex: number, subsectionIndex: number) => {
    const subsection = definition[stepIndex].subsections[subsectionIndex]
    setSelectedStepIndex(stepIndex)
    setEditingSubsectionIndex(subsectionIndex)
    setEditingSubsectionText(subsection.name)
    setEditingSubsectionFaqQuestion(subsection.faqQuestion || "")
    setEditingSubsectionFaqAnswer(subsection.faqAnswer || "")
  }

  const updateSubsection = (stepIndex: number, subsectionIndex: number) => {
    setDefinition(
      definition.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              subsections: step.subsections.map((subsection, j) =>
                j === subsectionIndex
                  ? {
                      ...subsection,
                      name: editingSubsectionText.trim(),
                      faqQuestion: editingSubsectionFaqQuestion.trim(),
                      faqAnswer: editingSubsectionFaqAnswer.trim(),
                    }
                  : subsection,
              ),
            }
          : step,
      ),
    )
    setEditingSubsectionIndex(null)
  }

  const removeStep = (index: number) => {
    const stepToRemove = definition[index]

    if (editor) {
      stepToRemove.subsections.forEach((subsection) => {
        subsection.questions.forEach((question) => {
          removeQuestionFromDocument(question.attribute, question.type)
        })
      })
    }

    setDefinition(definition.filter((_, i) => i !== index))

    if (selectedStepIndex === index) {
      setSelectedStepIndex(null)
      setSelectedSubsectionIndex(null)
    }
  }

  const removeSubsection = (stepIndex: number, subsectionIndex: number) => {
    if (stepIndex >= 0 && stepIndex < definition.length) {
      const subsectionToRemove = definition[stepIndex].subsections[subsectionIndex]

      if (editor) {
        subsectionToRemove.questions.forEach((question) => {
          removeQuestionFromDocument(question.attribute, question.type)
        })
      }

      setDefinition(
        definition.map((step, i) =>
          i === stepIndex ? { ...step, subsections: step.subsections.filter((_, j) => j !== subsectionIndex) } : step,
        ),
      )

      if (selectedStepIndex === stepIndex && selectedSubsectionIndex === subsectionIndex) {
        setSelectedSubsectionIndex(null)
      }
    }
  }

  const formatQuestionWithDependency = (question: Question): string => {
    const baseFormat = `{{% ${question.attribute} | ${question.type} | underscore %}}`

    if (question.dependence) {
      return `{{% if ${question.dependence.question} == "${question.dependence.value}" %}} ${baseFormat} {{% endif %}}`
    }

    return baseFormat
  }

  const addQuestion = () => {
    if (
      selectedStepIndex !== null &&
      selectedSubsectionIndex !== null &&
      selectedStepIndex < definition.length &&
      selectedSubsectionIndex < definition[selectedStepIndex].subsections.length &&
      newQuestionType &&
      newQuestionLabel.trim()
    ) {
      const attribute = generateAttribute(newQuestionLabel.trim())
      const newQuestion: Question = {
        id: Math.random().toString(36).substring(2, 9),
        label: newQuestionLabel.trim(),
        type: newQuestionType,
        attribute,
        options: ["dropdown", "checkbox", "radio"].includes(newQuestionType)
          ? optionsInput.split(",").map((opt) => opt.trim())
          : undefined,
        dependence: showDependencyFields
          ? {
              question: dependencyQuestion,
              value: dependencyValue,
            }
          : undefined,
        faqQuestion: newQuestionFaqQuestion.trim(),
        faqAnswer: newQuestionFaqAnswer.trim(),
      }

      setDefinition(
        definition.map((step, stepIdx) =>
          stepIdx === selectedStepIndex
            ? {
                ...step,
                subsections: step.subsections.map((subsection, subIdx) =>
                  subIdx === selectedSubsectionIndex
                    ? { ...subsection, questions: [...subsection.questions, newQuestion] }
                    : subsection,
                ),
              }
            : step,
        ),
      )

      if (editor) {
        // Insert the question with dependency format if needed
        if (showDependencyFields && dependencyQuestion && dependencyValue) {
          const dependencyFormat = formatQuestionWithDependency(newQuestion)
          editor.chain().focus().insertContent(dependencyFormat).run()
        } else {
          editor.chain().focus().setCustomQuestion(newQuestionLabel.trim(), newQuestionType).run()
        }
      }

      setNewQuestionLabel("")
      setNewQuestionType("")
      setOptionsInput("")
      setShowDependencyFields(false)
      setDependencyQuestion("")
      setDependencyValue("")
      setNewQuestionFaqQuestion("")
      setNewQuestionFaqAnswer("")
    }
  }

  const removeQuestionFromDocument = (attribute: string, type: string): number | null => {
    if (editor) {
      const { state } = editor
      let questionPos: number | null = null

      // First, check for questions with dependency wrappers
      state.doc.descendants((node, pos) => {
        if (node.type.name === "text" && node.text) {
          const text = node.text
          // Look for the dependency pattern with this attribute
          const pattern = new RegExp(`{{% if .+? %}} {{% ${attribute} \\| ${type} \\| underscore %}} {{% endif %}}`)
          if (pattern.test(text)) {
            questionPos = pos
            // Get the full match to delete
            const match = text.match(pattern)
            if (match && match[0]) {
              editor
                .chain()
                .focus()
                .deleteRange({ from: pos, to: pos + match[0].length })
                .run()
              return false // Stop searching
            }
          }
        }
        return true
      })

      // If not found with dependency, look for the simple format
      if (questionPos === null) {
        state.doc.descendants((node, pos) => {
          if (node.type.name === "customQuestion" && node.attrs.attribute === attribute && node.attrs.type === type) {
            questionPos = pos
            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + node.nodeSize })
              .run()
            return false // Stop searching after the first match
          }
        })
      }

      return questionPos
    }
    return null
  }

  const startEditingQuestion = (stepIndex: number, subsectionIndex: number, questionIndex: number) => {
    const question = definition[stepIndex].subsections[subsectionIndex].questions[questionIndex]
    setSelectedStepIndex(stepIndex)
    setSelectedSubsectionIndex(subsectionIndex)
    setEditingQuestionIndex(questionIndex)
    setEditingQuestionLabel(question.label)
    setEditingQuestionType(question.type)
    setEditingDependence(question.dependence || null)
    setOptionsInput(question.options?.join(", ") || "")
    setEditingQuestionFaqQuestion(question.faqQuestion || "")
    setEditingQuestionFaqAnswer(question.faqAnswer || "")
  }

  const updateQuestion = (stepIndex: number, subsectionIndex: number, questionIndex: number) => {
    const oldQuestion = definition[stepIndex].subsections[subsectionIndex].questions[questionIndex]
    const oldAttribute = oldQuestion.attribute
    const newAttribute = generateAttribute(editingQuestionLabel.trim())

    // Create the updated question object
    const updatedQuestion: Question = {
      id: oldQuestion.id,
      label: editingQuestionLabel,
      type: editingQuestionType,
      attribute: newAttribute,
      dependence: editingDependence,
      options: ["dropdown", "checkbox", "radio"].includes(editingQuestionType)
        ? optionsInput.split(",").map((opt) => opt.trim())
        : undefined,
      faqQuestion: editingQuestionFaqQuestion.trim(),
      faqAnswer: editingQuestionFaqAnswer.trim(),
    }

    // Find all questions that depend on the old attribute
    const dependentQuestions: Array<{
      stepIndex: number
      subsectionIndex: number
      questionIndex: number
      question: Question
    }> = []

    definition.forEach((step, sIndex) => {
      step.subsections.forEach((subsection, subIndex) => {
        subsection.questions.forEach((question, qIndex) => {
          if (question.dependence && question.dependence.question === oldAttribute) {
            dependentQuestions.push({
              stepIndex: sIndex,
              subsectionIndex: subIndex,
              questionIndex: qIndex,
              question: { ...question },
            })
          }
        })
      })
    })

    if (editor) {
      // Store the current selection to restore it later
      const { from, to } = editor.state.selection

      // Remove the old question and get its position
      const questionPos = removeQuestionFromDocument(oldQuestion.attribute, oldQuestion.type)

      // If we found the position, insert the new question there
      if (questionPos !== null) {
        // Set selection to the position where the old question was
        editor.chain().setTextSelection(questionPos).run()

        // Insert the new question with dependency format if needed
        if (editingDependence) {
          const dependencyFormat = formatQuestionWithDependency(updatedQuestion)
          editor.chain().insertContent(dependencyFormat).run()
        } else {
          editor.chain().setCustomQuestion(editingQuestionLabel.trim(), editingQuestionType).run()
        }

        // Restore the original selection
        editor.chain().setTextSelection({ from, to }).run()
      } else {
        // Fallback: just insert at current position if we couldn't find the old one
        if (editingDependence) {
          const dependencyFormat = formatQuestionWithDependency(updatedQuestion)
          editor.chain().focus().insertContent(dependencyFormat).run()
        } else {
          editor.chain().focus().setCustomQuestion(editingQuestionLabel.trim(), editingQuestionType).run()
        }
      }

      // Update all dependent questions in the document
      dependentQuestions.forEach(({ question }) => {
        // Remove the old dependent question
        const dependentQuestionPos = removeQuestionFromDocument(question.attribute, question.type)

        // Create updated dependent question with new attribute reference
        const updatedDependentQuestion = {
          ...question,
          dependence: {
            ...question.dependence!,
            question: newAttribute,
          },
        }

        // Insert the updated dependent question
        if (dependentQuestionPos !== null) {
          editor.chain().setTextSelection(dependentQuestionPos).run()
          const dependencyFormat = formatQuestionWithDependency(updatedDependentQuestion)
          editor.chain().insertContent(dependencyFormat).run()
        }
      })
    }

    // Update the question in the definition state
    setDefinition((prevDefinition) => {
      const newDefinition = [...prevDefinition]

      // Update the main question
      newDefinition[stepIndex] = {
        ...newDefinition[stepIndex],
        subsections: newDefinition[stepIndex].subsections.map((subsection, subIdx) =>
          subIdx === subsectionIndex
            ? {
                ...subsection,
                questions: subsection.questions.map((q, qIdx) => (qIdx === questionIndex ? updatedQuestion : q)),
              }
            : subsection,
        ),
      }

      // Update all dependent questions
      dependentQuestions.forEach(
        ({ stepIndex: depStepIndex, subsectionIndex: depSubIndex, questionIndex: depQuestionIndex }) => {
          newDefinition[depStepIndex] = {
            ...newDefinition[depStepIndex],
            subsections: newDefinition[depStepIndex].subsections.map((subsection, subIdx) =>
              subIdx === depSubIndex
                ? {
                    ...subsection,
                    questions: subsection.questions.map((q, qIdx) => {
                      if (qIdx === depQuestionIndex && q.dependence) {
                        return {
                          ...q,
                          dependence: {
                            ...q.dependence,
                            question: newAttribute,
                          },
                        }
                      }
                      return q
                    }),
                  }
                : subsection,
            ),
          }
        },
      )

      return newDefinition
    })

    // Show notification if dependent questions were updated
    if (dependentQuestions.length > 0) {
      toast.success(
        `Updated ${dependentQuestions.length} dependent question${dependentQuestions.length > 1 ? "s" : ""}`,
      )
    }

    setEditingQuestionIndex(null)
    setEditingDependence(null)
    setOptionsInput("")
  }

  const removeQuestion = (stepIndex: number, subsectionIndex: number, questionIndex: number) => {
    if (
      stepIndex >= 0 &&
      stepIndex < definition.length &&
      subsectionIndex >= 0 &&
      subsectionIndex < definition[stepIndex].subsections.length
    ) {
      const question = definition[stepIndex].subsections[subsectionIndex].questions[questionIndex]

      setDefinition(
        definition.map((step, sIdx) =>
          sIdx === stepIndex
            ? {
                ...step,
                subsections: step.subsections.map((subsection, subIdx) =>
                  subIdx === subsectionIndex
                    ? {
                        ...subsection,
                        questions: subsection.questions.filter((_, qIdx) => qIdx !== questionIndex),
                      }
                    : subsection,
                ),
              }
            : step,
        ),
      )

      removeQuestionFromDocument(question.attribute, question.type)
    }
  }

  const getPreviousMultiOptionQuestions = (stepIndex: number, subsectionIndex: number, questionIndex: number) => {
    // Get questions from the current subsection up to the current question
    const currentSubsectionQuestions = definition[stepIndex].subsections[subsectionIndex].questions
      .slice(0, questionIndex)
      .filter((q) => ["dropdown", "checkbox", "radio"].includes(q.type))

    // Get questions from previous subsections in the same step
    const previousSubsectionsQuestions = definition[stepIndex].subsections
      .slice(0, subsectionIndex)
      .flatMap((subsection) => subsection.questions.filter((q) => ["dropdown", "checkbox", "radio"].includes(q.type)))

    // Get questions from previous steps
    const previousStepsQuestions = definition
      .slice(0, stepIndex)
      .flatMap((step) =>
        step.subsections.flatMap((subsection) =>
          subsection.questions.filter((q) => ["dropdown", "checkbox", "radio"].includes(q.type)),
        ),
      )

    // Combine all questions
    return [...previousStepsQuestions, ...previousSubsectionsQuestions, ...currentSubsectionQuestions]
  }

  // Add a button to re-parse the document content
  const handleReparseDocument = () => {
    parseDocumentSteps()
  }

  // Export steps data in form renderer format
  const exportStepsData = () => {
    try {
      const formRendererData = convertToFormRendererFormat(definition)
      // Create a downloadable JSON file
      const dataStr = JSON.stringify(formRendererData, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = "steps-data.json"

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast.success("Steps data exported successfully")
    } catch (error) {
      console.error("Error exporting steps data:", error)
      toast.error("Failed to export steps data")
    }
  }

  return (
    <div className="w-[450px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Questions & Steps</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReparseDocument} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Parsing..." : "Parse Document"}
            </Button>
            <Button variant="outline" size="sm" onClick={exportStepsData}>
              Export Steps
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Add a new step..."
            value={newStepName}
            onChange={(e) => setNewStepName(e.target.value)}
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
          {definition.map((step, stepIndex) => (
            <div key={stepIndex} className="bg-gray-100 p-2 rounded space-y-2">
              <div className="flex items-center justify-between">
                {editingStepIndex === stepIndex ? (
                  <div className="flex-1 space-y-2">
                    <Input value={editingStepText} onChange={(e) => setEditingStepText(e.target.value)} autoFocus />
                    <Button onClick={() => updateStep(stepIndex)}>
                      <Check className="h-4 w-4 mr-2" />
                      Update Step
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm font-medium">{step.name}</span>
                )}
                <div>
                  <Button variant="ghost" size="sm" onClick={() => startEditingStep(stepIndex)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeStep(stepIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Subsections */}
              {step.subsections.map((subsection, subsectionIndex) => (
                <div key={subsectionIndex} className="ml-4 bg-gray-200 p-2 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    {editingSubsectionIndex === subsectionIndex && selectedStepIndex === stepIndex ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={editingSubsectionText}
                          onChange={(e) => setEditingSubsectionText(e.target.value)}
                          autoFocus
                          placeholder="Subsection name"
                        />
                        <Input
                          value={editingSubsectionFaqQuestion}
                          onChange={(e) => setEditingSubsectionFaqQuestion(e.target.value)}
                          placeholder="FAQ Question"
                        />
                        <Input
                          value={editingSubsectionFaqAnswer}
                          onChange={(e) => setEditingSubsectionFaqAnswer(e.target.value)}
                          placeholder="FAQ Answer"
                        />
                        <Button onClick={() => updateSubsection(stepIndex, subsectionIndex)}>
                          <Check className="h-4 w-4 mr-2" />
                          Update Subsection
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">{subsection.name}</span>
                    )}
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditingSubsection(stepIndex, subsectionIndex)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeSubsection(stepIndex, subsectionIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* FAQ Question Field */}
                  <div className="ml-2 mt-2">
                    <div className="block">
                      <span className="text-xs font-medium text-gray-500">FAQ Question:</span>
                      {editingSubsectionIndex === subsectionIndex && selectedStepIndex === stepIndex ? (
                        <Input
                          placeholder="Enter FAQ question..."
                          className="ml-2 h-8 text-sm"
                          value={editingSubsectionFaqQuestion}
                          onChange={(e) => setEditingSubsectionFaqQuestion(e.target.value)}
                        />
                      ) : (
                        <span className="ml-2 text-sm">{subsection.faqQuestion || "None"}</span>
                      )}
                    </div>
                  </div>

                  {/* FAQ Answer Field */}
                  <div className="ml-2 mt-2">
                    <div className="block">
                      <span className="text-xs font-medium text-gray-500">FAQ Answer:</span>
                      {editingSubsectionIndex === subsectionIndex && selectedStepIndex === stepIndex ? (
                        <Input
                          placeholder="Enter FAQ answer..."
                          className="ml-2 h-8 text-sm"
                          value={editingSubsectionFaqAnswer}
                          onChange={(e) => setEditingSubsectionFaqAnswer(e.target.value)}
                        />
                      ) : (
                        <span className="ml-2 text-sm">{subsection.faqAnswer || "None"}</span>
                      )}
                    </div>
                  </div>

                  {/* Questions */}
                  {subsection.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="text-sm pl-4 flex flex-col space-y-2">
                      {editingQuestionIndex === questionIndex &&
                      selectedStepIndex === stepIndex &&
                      selectedSubsectionIndex === subsectionIndex ? (
                        <div className="space-y-2">
                          <Input
                            value={editingQuestionLabel}
                            onChange={(e) => setEditingQuestionLabel(e.target.value)}
                            autoFocus
                          />
                          <Select
                            value={editingQuestionType}
                            onValueChange={(value: "input" | "dropdown" | "checkbox" | "radio" | "date") =>
                              setEditingQuestionType(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="input">Input</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* Add FAQ fields for editing questions */}
                          <Input
                            placeholder="FAQ Question..."
                            value={editingQuestionFaqQuestion}
                            onChange={(e) => setEditingQuestionFaqQuestion(e.target.value)}
                          />
                          <Input
                            placeholder="FAQ Answer..."
                            value={editingQuestionFaqAnswer}
                            onChange={(e) => setEditingQuestionFaqAnswer(e.target.value)}
                          />
                          {["dropdown", "checkbox", "radio"].includes(editingQuestionType) && (
                            <Input
                              placeholder="Enter options (comma-separated)..."
                              value={optionsInput}
                              onChange={(e) => setOptionsInput(e.target.value)}
                            />
                          )}
                          {editingDependence && (
                            <div className="space-y-2">
                              <Select
                                value={editingDependence.question}
                                onValueChange={(value) => {
                                  setEditingDependence({ ...editingDependence, question: value, value: "" })
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select question to depend on..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {getPreviousMultiOptionQuestions(stepIndex, subsectionIndex, questionIndex).map(
                                    (q, index) => (
                                      <SelectItem key={index} value={q.attribute}>
                                        {q.label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              {editingDependence.question && (
                                <Select
                                  value={editingDependence.value}
                                  onValueChange={(value) => setEditingDependence({ ...editingDependence, value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select dependency value..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dependencyOptions.map((option, index) => (
                                      <SelectItem key={index} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          )}
                          <div className="flex justify-between">
                            <Button onClick={() => updateQuestion(stepIndex, subsectionIndex, questionIndex)}>
                              <Check className="h-4 w-4 mr-2" />
                              Update Question
                            </Button>
                            {!editingDependence && (
                              <Button
                                variant="outline"
                                onClick={() => setEditingDependence({ question: "", value: "" })}
                              >
                                <Link className="h-4 w-4 mr-2" />
                                Add Dependence
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>
                            Q: {question.label} ({question.type})
                            {question.options && ` - Options: ${question.options.join(", ")}`}
                            <br />
                            <code className="text-xs bg-blue-100 p-1 rounded">
                              {question.dependence
                                ? `{{% if ${question.dependence.question} == "${question.dependence.value}" %}} {{% ${question.attribute} | ${question.type} | underscore %}} {{% endif %}}`
                                : `{{% ${question.attribute} | ${question.type} | underscore %}}`}
                            </code>
                            {question.dependence && (
                              <span className="block text-xs text-gray-500">
                                Depends on: {question.dependence.question} = {question.dependence.value}
                              </span>
                            )}
                            {/* Display FAQ fields for questions in read-only mode */}
                            {question.faqQuestion && (
                              <div className="mt-1">
                                <span className="text-xs font-medium text-gray-500">FAQ Question:</span>
                                <span className="ml-1 text-xs">{question.faqQuestion}</span>
                              </div>
                            )}
                            {question.faqAnswer && (
                              <div>
                                <span className="text-xs font-medium text-gray-500">FAQ Answer:</span>
                                <span className="ml-1 text-xs">{question.faqAnswer}</span>
                              </div>
                            )}
                          </span>
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingQuestion(stepIndex, subsectionIndex, questionIndex)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(stepIndex, subsectionIndex, questionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStepIndex(stepIndex)
                      setSelectedSubsectionIndex(subsectionIndex)
                    }}
                    className="w-full mt-2"
                  >
                    Add Question to this Subsection
                  </Button>
                </div>
              ))}

              {/* Add Subsection form */}
              <div className="ml-4 space-y-2 bg-gray-100 p-2 rounded">
                <h4 className="text-sm font-medium">Add New Subsection</h4>
                <Input
                  placeholder="Subsection name..."
                  value={selectedStepIndex === stepIndex ? newSubsectionName : ""}
                  onChange={(e) => {
                    setSelectedStepIndex(stepIndex)
                    setNewSubsectionName(e.target.value)
                  }}
                />
                <Input
                  placeholder="FAQ Question..."
                  value={selectedStepIndex === stepIndex ? newSubsectionFaqQuestion : ""}
                  onChange={(e) => {
                    setSelectedStepIndex(stepIndex)
                    setNewSubsectionFaqQuestion(e.target.value)
                  }}
                />
                <Input
                  placeholder="FAQ Answer..."
                  value={selectedStepIndex === stepIndex ? newSubsectionFaqAnswer : ""}
                  onChange={(e) => {
                    setSelectedStepIndex(stepIndex)
                    setNewSubsectionFaqAnswer(e.target.value)
                  }}
                />
                <Button onClick={() => addSubsection(stepIndex)} className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subsection
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Panel */}
        {selectedStepIndex !== null &&
          selectedSubsectionIndex !== null &&
          selectedStepIndex < definition.length &&
          selectedSubsectionIndex < definition[selectedStepIndex].subsections.length && (
            <div className="space-y-2 bg-blue-50 p-2 rounded">
              <h4 className="text-sm font-medium">
                Add Question to: {definition[selectedStepIndex].name} &gt;{" "}
                {definition[selectedStepIndex].subsections[selectedSubsectionIndex].name}
              </h4>
              <Select
                value={newQuestionType}
                onValueChange={(value: "input" | "dropdown" | "checkbox" | "radio" | "date" | "") =>
                  setNewQuestionType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              {newQuestionType && (
                <>
                  <Input
                    placeholder="Enter question label..."
                    value={newQuestionLabel}
                    onChange={(e) => setNewQuestionLabel(e.target.value)}
                  />
                  {/* Add FAQ fields for questions */}
                  <Input
                    placeholder="FAQ Question..."
                    value={newQuestionFaqQuestion}
                    onChange={(e) => setNewQuestionFaqQuestion(e.target.value)}
                  />
                  <Input
                    placeholder="FAQ Answer..."
                    value={newQuestionFaqAnswer}
                    onChange={(e) => setNewQuestionFaqAnswer(e.target.value)}
                  />
                  {["dropdown", "checkbox", "radio"].includes(newQuestionType) && (
                    <Input
                      placeholder="Enter options (comma-separated)..."
                      value={optionsInput}
                      onChange={(e) => setOptionsInput(e.target.value)}
                    />
                  )}
                  {getPreviousMultiOptionQuestions(
                    selectedStepIndex,
                    selectedSubsectionIndex,
                    definition[selectedStepIndex].subsections[selectedSubsectionIndex].questions.length,
                  ).length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowDependencyFields(!showDependencyFields)}
                      className="mt-2"
                    >
                      Dependency
                    </Button>
                  )}
                  {showDependencyFields && (
                    <div className="space-y-2 mt-2">
                      <Select
                        value={dependencyQuestion}
                        onValueChange={(value) => {
                          setDependencyQuestion(value)
                          setDependencyValue("")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select question to depend on..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getPreviousMultiOptionQuestions(
                            selectedStepIndex,
                            selectedSubsectionIndex,
                            definition[selectedStepIndex].subsections[selectedSubsectionIndex].questions.length,
                          ).map((question, index) => (
                            <SelectItem key={index} value={question.attribute}>
                              {question.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {dependencyQuestion && (
                        <Select value={dependencyValue} onValueChange={(value) => setDependencyValue(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dependency value..." />
                          </SelectTrigger>
                          <SelectContent>
                            {dependencyOptions.map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}
                </>
              )}
              <Button onClick={addQuestion} disabled={!newQuestionType || !newQuestionLabel.trim()} className="mt-2">
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
      <style jsx global>{`
.ProseMirror span[data-type="custom-question"],
.ProseMirror span[data-dependency="true"],
.ProseMirror *:contains("{{% if"),
.ProseMirror *:contains("=="),
.ProseMirror *:contains("{{% endif"),
.ProseMirror *:contains("underscore") {
  background-color: #f0f9ff !important;
  border-radius: 4px !important;
  padding: 2px 4px !important;
  font-weight: medium !important;
  color: #0066cc !important;
  display: inline !important;
  margin: 0 2px !important;
  border: 1px solid #e6f3ff !important;
  font-family: monospace !important;
  width: auto !important;
  max-width: fit-content !important;
  white-space: normal !important;
  word-break: normal !important;
  overflow-wrap: anywhere !important;
}

/* Fix for cursor positioning */
.ProseMirror p {
  position: relative !important;
}

/* Ensure inline behavior */
.ProseMirror span[data-type="custom-question"],
.ProseMirror span:contains("{{% "),
.ProseMirror span:contains("%}}"),
.ProseMirror span:contains("if"),
.ProseMirror span:contains("endif"),
.ProseMirror span:contains("underscore") {
  display: inline !important;
  vertical-align: baseline !important;
}

/* Ensure no nested backgrounds */
span[data-type="custom-question"] span,
span:contains("{{% ") span,
span:contains("%}}") span,
span:contains("if") span,
span:contains("endif") span {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Direct targeting for the specific problematic format */
*:contains("{{% if") {
  background-color: #f0f9ff !important;
  border-radius: 4px !important;
  border: 1px solid #e6f3ff !important;
  display: inline !important;
  width: auto !important;
}

/* Make sure the parent elements don't force full width */
.ProseMirror p {
  display: block !important;
  width: 100% !important;
}

/* Ensure custom questions inside paragraphs flow naturally */
.ProseMirror p span[data-type="custom-question"],
.ProseMirror p *:contains("{{% if") {
  display: inline !important;
  width: auto !important;
  white-space: normal !important;
  word-break: normal !important;
  overflow-wrap: anywhere !important;
}
`}</style>
    </div>
  )
}
