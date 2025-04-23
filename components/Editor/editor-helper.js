/**
 * Helper functions for the TipTap editor
 */

// Function to fix cursor positioning around custom question nodes
export function fixCursorPositioning(editor) {
    if (!editor) return
  
    // Get the editor element
    const editorElement = document.querySelector(".ProseMirror")
    if (!editorElement) return
  
    // Find all custom question nodes
    const questionNodes = editorElement.querySelectorAll('[data-type="custom-question"]')
  
    // Add event listeners to each node
    questionNodes.forEach((node) => {
      // Remove existing listeners to prevent duplicates
      node.removeEventListener("click", handleQuestionNodeClick)
  
      // Add click listener
      node.addEventListener("click", handleQuestionNodeClick)
    })
  
    // Handle clicks on custom question nodes
    function handleQuestionNodeClick(event) {
      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()
  
      // Get the node position
      const node = event.target
      const rect = node.getBoundingClientRect()
      const clickX = event.clientX
  
      // Determine if click is on left or right side
      const isRightSide = clickX > rect.left + rect.width / 2
  
      // Get the node position in the document
      const pos = editor.view.posAtDOM(node, 0)
      const docNode = editor.view.state.doc.nodeAt(pos)
  
      if (docNode) {
        // Set cursor position before or after the node
        const newPos = isRightSide ? pos + docNode.nodeSize : pos
  
        // Update selection
        editor.chain().focus().setTextSelection(newPos).run()
      }
    }
  }
  
  // Function to process text nodes with custom question format
  export function processCustomQuestionTextNodes(editor) {
    if (!editor) return
  
    // Get the editor element
    const editorElement = document.querySelector(".ProseMirror")
    if (!editorElement) return
  
    // Function to process text nodes
    const processTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ""
        if (text.includes("{{% ") && text.includes(" %}}")) {
          // This is a text node containing a custom question format
          // We need to wrap it in a span with special styling
          const span = document.createElement("span")
          span.className = "custom-question-text"
          span.setAttribute("data-custom-question", "true")
          span.textContent = text
          node.parentNode?.replaceChild(span, node)
        }
      } else {
        // Process child nodes
        Array.from(node.childNodes).forEach(processTextNodes)
      }
    }
  
    // Process all text nodes
    processTextNodes(editorElement)
  }
  

  /**
 * Utility function to remove styling from custom question nodes
 */
export function removeCustomQuestionStyling() {
    // Find all custom question nodes
    const questionNodes = document.querySelectorAll('[data-type="custom-question"]')
  
    // Remove styling from each node
    questionNodes.forEach((node) => {
      // Remove background color
      node.style.backgroundColor = ""
      // Remove border
      node.style.border = ""
      // Remove padding
      node.style.padding = ""
      // Remove margin
      node.style.margin = ""
      // Remove font family
      node.style.fontFamily = ""
      // Remove color
      node.style.color = ""
      // Remove any classes that might add styling
      node.className = "custom-question-node"
    })
  
    // Find all text nodes that contain custom question format
    const textNodes = Array.from(document.querySelectorAll(".ProseMirror *")).filter((el) => {
      const text = el.textContent || ""
      return text.includes("{{% ") && text.includes(" %}}")
    })
  
    // Remove styling from each text node
    textNodes.forEach((node) => {
      // Remove background color
      node.style.backgroundColor = ""
      // Remove border
      node.style.border = ""
      // Remove padding
      node.style.padding = ""
      // Remove margin
      node.style.margin = ""
      // Remove font family
      node.style.fontFamily = ""
      // Remove color
      node.style.color = ""
      // Remove any classes that might add styling
      if (node.className.includes("custom-question-text")) {
        node.className = node.className.replace("custom-question-text", "").trim()
      }
      if (node.hasAttribute("data-custom-question")) {
        node.removeAttribute("data-custom-question")
      }
    })
  }
  


  /**
 * Parses document content to extract questions and organize them into steps and subsections
 * @param {string} content - Document HTML content
 * @returns {Array} - Array of steps with subsections and questions
 */
export function parseDocumentContent(content) {
    if (!content) return []
  
    // Create a DOM parser to extract questions from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
  
    // Find all custom question nodes and text nodes with question format
    const questionNodes = [
      ...Array.from(doc.querySelectorAll('[data-type="custom-question"]')),
      ...Array.from(doc.querySelectorAll("*")).filter((el) => {
        const text = el.textContent || ""
        return text.includes("{{% ") && text.includes(" %}}")
      }),
    ]
  
    // Extract question data from nodes
    const questions = questionNodes.map((node) => {
      let attribute, type, label, options
  
      if (node.getAttribute("data-type") === "custom-question") {
        // Extract from custom question node
        attribute = node.getAttribute("data-question-attribute") || ""
        type = node.getAttribute("data-question-type") || "input"
        label = node.textContent.replace(/\{\{% |\| underscore %\}\}/g, "").trim()
      } else {
        // Extract from text node with question format
        const text = node.textContent || ""
        const match = text.match(/\{\{% ([^|]+)\| ([^|]+)\| underscore %\}\}/)
        if (match) {
          attribute = match[1].trim()
          type = match[2].trim()
          label = attribute.replace(/_/g, " ")
        }
      }
  
      // Check for dependency
      let dependence = null
      const parentText = node.parentNode?.textContent || ""
      const dependencyMatch = parentText.match(/\{\{% if ([^=]+) == "([^"]+)" %\}/)
      if (dependencyMatch) {
        dependence = {
          question: dependencyMatch[1].trim(),
          value: dependencyMatch[2].trim(),
        }
      }
  
      // Map TipTap types to form renderer types
      let fieldType
      switch (type) {
        case "dropdown":
          fieldType = "dropdownList"
          options = []
          break
        case "checkbox":
          fieldType = "checkboxes"
          options = []
          break
        case "radio":
          fieldType = "radioButton"
          options = []
          break
        case "date":
          fieldType = "textField"
          break
        default:
          fieldType = "textField"
      }
  
      return {
        id: Math.random().toString(36).substring(2, 9),
        uniqueKeyName: attribute,
        type: fieldType,
        questionToAsk: label,
        selectionValue: type === "date" ? "date" : "",
        isRequired: true,
        placeholder: `Enter ${label}`,
        list: options || [],
        affectedQuestion: [],
        answer: "",
      }
    })
  
    // Group questions into steps and subsections
    // For simplicity, we'll create default grouping if none exists
    const steps = [
      {
        name: "Document Information",
        subsections: [
          {
            name: "Basic Information",
            question: questions,
          },
        ],
      },
    ]
  
    return steps
  }
  
  /**
   * Merges existing steps data from API with parsed steps data
   * @param {Array} apiSteps - Steps data from API
   * @param {Array} parsedSteps - Steps data parsed from document
   * @returns {Array} - Merged steps data
   */
  export function mergeStepsData(apiSteps, parsedSteps) {
    if (!apiSteps || !Array.isArray(apiSteps) || apiSteps.length === 0) {
      return parsedSteps
    }
  
    if (!parsedSteps || !Array.isArray(parsedSteps) || parsedSteps.length === 0) {
      return apiSteps
    }
  
    // Create a map of all questions from parsed steps for quick lookup
    const parsedQuestionsMap = {}
    parsedSteps.forEach((step) => {
      step.subsections.forEach((subsection) => {
        subsection.question.forEach((question) => {
          parsedQuestionsMap[question.uniqueKeyName] = question
        })
      })
    })
  
    // Update API steps with any new questions found in parsed steps
    const mergedSteps = JSON.parse(JSON.stringify(apiSteps))
  
    // Add any missing questions from parsed steps
    const allApiQuestionKeys = new Set()
    mergedSteps.forEach((step) => {
      step.subsections.forEach((subsection) => {
        subsection.question.forEach((question) => {
          allApiQuestionKeys.add(question.uniqueKeyName)
  
          // Update question properties if needed
          const parsedQuestion = parsedQuestionsMap[question.uniqueKeyName]
          if (parsedQuestion) {
            // Preserve existing answers and dependencies
            const answer = question.answer
            const affectedQuestion = question.affectedQuestion
  
            // Update other properties
            Object.assign(question, parsedQuestion)
  
            // Restore preserved properties
            question.answer = answer
            question.affectedQuestion = affectedQuestion
          }
        })
      })
    })
  
    // Find questions in parsed steps that don't exist in API steps
    const newQuestions = []
    parsedSteps.forEach((step) => {
      step.subsections.forEach((subsection) => {
        subsection.question.forEach((question) => {
          if (!allApiQuestionKeys.has(question.uniqueKeyName)) {
            newQuestions.push(question)
          }
        })
      })
    })
  
    // Add new questions to the first subsection of the first step
    if (newQuestions.length > 0 && mergedSteps.length > 0 && mergedSteps[0].subsections.length > 0) {
      mergedSteps[0].subsections[0].question.push(...newQuestions)
    }
  
    return mergedSteps
  }
  
  /**
   * Prepares steps data for API submission
   * @param {Array} steps - Array of steps with subsections and questions
   * @returns {Array} - Formatted steps data for API
   */
  export function prepareStepsData(steps) {
    if (!steps || !Array.isArray(steps)) return []
  
    return steps.map((step) => ({
      name: step.name,
      subsections: step.subsections.map((subsection) => ({
        name: subsection.name,
        faqQuestion: subsection.faqQuestion || "",
        faqAnswer: subsection.faqAnswer || "",
        question: subsection.questions.map((question) => {
          // Convert from template editor format to form renderer format
          const list = []
          if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option) => {
              list.push({ name: option })
            })
          }
  
          // Convert question type
          let type
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
  
          // Convert dependencies
          const affectedQuestion = []
          if (question.dependence) {
            // In our system, we store which questions are affected by this question
            // But we need to convert to the opposite - which questions affect this question
          }
  
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
  