"use client"

import { DropdownMenuTrigger } from "./ui/dropdown-menu"

import { useEditor, EditorContent, Extension } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import FontFamily from "@tiptap/extension-font-family"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { Button } from "./ui/button"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  PlusCircle,
  Type,
  Strikethrough,
  Code,
  SubscriptIcon,
  SuperscriptIcon,
  Indent,
  Outdent,
  SeparatorHorizontal,
  Heading3,
  ZoomIn,
  ZoomOut,
  Maximize,
  Printer,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Separator } from "./ui/separator"

// Custom extension for horizontal rule with custom class
const HorizontalRule = Extension.create({
  name: "customHorizontalRule",
  addCommands() {
    return {
      setHorizontalRule:
        () =>
        ({ chain }) => {
          return chain().focus().insertContent('<hr class="custom-hr" />').run()
        },
    }
  },
})

// Custom extension to make field placeholders non-clickable
const FieldPlaceholders = Extension.create({
  name: "fieldPlaceholders",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute("class"),
            renderHTML: (attributes) => {
              if (!attributes.class) {
                return {}
              }
              return { class: attributes.class }
            },
          },
        },
      },
    ]
  },
})

export function DocumentEditor({
  content,
  setContent,
  formStructure,
  addFieldToDocument: addFieldToDocumentProp,
  addConditionalToDocument,
  setEditorInstance,
}) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [cursorPosition, setCursorPosition] = useState(null)
  const [insertFieldOpen, setInsertFieldOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const editorRef = useRef(null)
  const containerRef = useRef(null)
  const [lastContent, setLastContent] = useState(content)
  const [documentContent, setDocumentContent] = useState(content)
  const [editorInstance, setEditor] = useState(null)

  // Predefined colors
  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",
  ]

  // Font families
  const fontFamilies = [
    { name: "Default", value: "Inter, sans-serif" },
    { name: "Serif", value: "Georgia, serif" },
    { name: "Monospace", value: "Consolas, monospace" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
  ]

  // Font sizes
  const fontSizes = [
    { name: "Small", value: "0.875em" },
    { name: "Normal", value: "1em" },
    { name: "Medium", value: "1.25em" },
    { name: "Large", value: "1.5em" },
    { name: "X-Large", value: "2em" },
    { name: "XX-Large", value: "3em" },
  ]

  // Zoom presets
  const zoomPresets = [
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
    { label: "100%", value: 100 },
    { label: "125%", value: 125 },
    { label: "150%", value: 150 },
    { label: "200%", value: 200 },
  ]

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      Subscript,
      Superscript,
      HorizontalRule,
      // FieldPlaceholders,
      // Add this improved extension to handle backspace properly
      Extension.create({
        name: "preventBackspaceNewline",
        addKeyboardShortcuts() {
          return {
            Backspace: ({ editor }) => {
              const { selection } = editor.state
              const { empty, anchor } = selection

              // Get the current HTML at the cursor position
              const currentNode = editor.view.domAtPos(anchor).node

              // Check if we're near a field placeholder or conditional block
              const isNearPlaceholder =
                currentNode.parentElement?.classList.contains("field-placeholder") ||
                currentNode.parentElement?.closest(".field-placeholder") ||
                currentNode.parentElement?.classList.contains("conditional-block") ||
                currentNode.parentElement?.closest(".conditional-block")

              // If we're at the beginning of a node or near a placeholder, handle specially
              if ((empty && anchor === 1) || isNearPlaceholder) {
                // Use the editor's commands to delete content properly
                editor.commands.deleteContent()
                return true // Prevent default behavior
              }

              // Let the default behavior handle other cases
              return false
            },
          }
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      setContent(newContent)
      setLastContent(newContent)

      // Clean up content after a short delay to avoid cursor jumping
      setTimeout(cleanupContent, 10)
    },
    onSelectionUpdate: ({ editor }) => {
      // Store the current cursor position
      const { from } = editor.state.selection
      setCursorPosition(from)
    },
    onFocus: ({ editor }) => {
      const { from } = editor.state.selection
      setCursorPosition(from)
    },
  })

  // Add this function after the editor declaration
  const cleanupContent = () => {
    if (!editor) return

    // Get current content
    const content = editor.getHTML()

    // Fix multiple spaces
    const cleanedContent = content
      // Replace multiple non-breaking spaces with a single space
      .replace(/(&nbsp;){2,}/g, " ")
      // Replace combination of regular and non-breaking spaces
      .replace(/\s(&nbsp;)+/g, " ")
      .replace(/(&nbsp;)+\s/g, " ")
      // Replace multiple regular spaces
      .replace(/\s{2,}/g, " ")

    // Only update if content changed
    if (cleanedContent !== content) {
      // Store cursor position
      const { from } = editor.state.selection

      // Update content
      editor.commands.setContent(cleanedContent, false)

      // Try to restore cursor position
      editor.commands.setTextSelection(from)
    }
  }

  // Share the editor instance with parent components
  useEffect(() => {
    if (editor) {
      setEditorInstance(editor)
      setEditor(editor)
    }
  }, [editor, setEditorInstance])

  // Apply zoom level to the document container
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.style.transform = `scale(${zoomLevel / 100})`
      container.style.transformOrigin = "top center"
    }
  }, [zoomLevel])

  // Make field placeholders non-clickable
  // useEffect(() => {
  //   if (editor) {
  //     const editorElement = editorRef.current?.querySelector(".ProseMirror")
  //     if (editorElement) {
  //       // Add event listener to make field placeholders non-clickable
  //       const handleClick = (e) => {
  //         const target = e.target
  //         if (target.classList.contains("field-placeholder") || target.closest(".field-placeholder")) {
  //           e.preventDefault()
  //           e.stopPropagation()
  //         }
  //       }

  //       // Add event listener to prevent default behavior for backspace on field placeholders
  //       const handleKeyDown = (e) => {
  //         if (e.key === "Backspace" || e.key === "Delete") {
  //           const selection = window.getSelection()
  //           if (!selection.rangeCount) return

  //           const range = selection.getRangeAt(0)
  //           const startContainer = range.startContainer

  //           // Check if we're near a field placeholder or conditional block
  //           const nearPlaceholder =
  //             startContainer.parentElement?.classList.contains("field-placeholder") ||
  //             startContainer.parentElement?.closest(".field-placeholder") ||
  //             startContainer.parentElement?.classList.contains("conditional-block") ||
  //             startContainer.parentElement?.closest(".conditional-block")

  //           if (nearPlaceholder) {
  //             // Let the editor handle it properly without inserting newlines
  //             e.stopPropagation()

  //             // If at the edge of a placeholder, we need to handle deletion specially
  //             const placeholderElement = startContainer.parentElement?.classList.contains("field-placeholder")
  //               ? startContainer.parentElement
  //               : startContainer.parentElement?.closest(".field-placeholder")

  //             const conditionalElement = startContainer.parentElement?.classList.contains("conditional-block")
  //               ? startContainer.parentElement
  //               : startContainer.parentElement?.closest(".conditional-block")

  //             if (placeholderElement || conditionalElement) {
  //               const targetElement = placeholderElement || conditionalElement

  //               // If backspace at the beginning or delete at the end, remove the whole element
  //               if (
  //                 (e.key === "Backspace" && range.startOffset === 0) ||
  //                 (e.key === "Delete" && range.startOffset === (startContainer.textContent?.length || 0))
  //               ) {
  //                 e.preventDefault()

  //                 // Use the editor's commands to delete the node
  //                 const pos = editor.view.posAtDOM(targetElement, 0)
  //                 editor.commands.deleteRange({ from: pos, to: pos + targetElement.textContent.length })
  //               }
  //             }
  //           }
  //         }
  //       }

  //       editorElement.addEventListener("click", handleClick)
  //       editorElement.addEventListener("keydown", handleKeyDown, true)

  //       // Add a specific handler for backspace key
  //       const handleBackspace = (e) => {
  //         if (e.key === "Backspace") {
  //           // Prevent default only if we're at the edge of a special element
  //           const selection = window.getSelection()
  //           if (!selection.rangeCount) return

  //           const range = selection.getRangeAt(0)
  //           const startContainer = range.startContainer

  //           // Check if we're near a field placeholder or conditional block
  //           const nearPlaceholder =
  //             startContainer.parentElement?.classList.contains("field-placeholder") ||
  //             startContainer.parentElement?.closest(".field-placeholder") ||
  //             startContainer.parentElement?.classList.contains("conditional-block") ||
  //             startContainer.parentElement?.closest(".conditional-block")

  //           if (nearPlaceholder) {
  //             e.preventDefault()

  //             // Use editor commands to delete content properly
  //             editor.commands.deleteContent()

  //             // Clean up any extra spaces
  //             setTimeout(cleanupContent, 10)
  //           }
  //         }
  //       }

  //       editorElement.addEventListener("keydown", handleBackspace, true)

  //       // Don't forget to remove the event listener in the cleanup function
  //       return () => {
  //         editorElement.removeEventListener("click", handleClick)
  //         editorElement.removeEventListener("keydown", handleKeyDown, true)
  //         editorElement.removeEventListener("keydown", handleBackspace, true)
  //       }
  //     }
  //   }
  // }, [editor])

  // // Process content to add non-clickable styling to field placeholders
  // useEffect(() => {
  //   if (editor) {
  //     const editorElement = editorRef.current?.querySelector(".ProseMirror")
  //     if (editorElement) {
  //       // Find all field placeholders and add the non-clickable class
  //       const fieldRegex = /\{\{%\s*([a-zA-Z0-9_]+)\s*\|[^}]*%\}\}/g
  //       const conditionalRegex = /\{%\s*if\s+([a-zA-Z0-9_]+)\s*(==|!=)\s*"([^"]*)"\s*%\}(.*?)\{%\s*endif\s*%\}/gs

  //       // Process the HTML content
  //       let html = editorElement.innerHTML

  //       // First, preserve whitespace by replacing spaces with a special marker
  //       // This prevents the editor from collapsing multiple spaces
  //       html = html.replace(/\s+/g, (match) => {
  //         if (match.length > 1) {
  //           return " " + "&nbsp;".repeat(match.length - 1)
  //         }
  //         return match
  //       })

  //       // Add class to conditional blocks first
  //       html = html.replace(conditionalRegex, (match, field, operator, value, content) => {
  //         const condition = `if ${field} ${operator} "${value}"`
  //         return `<div class="conditional-block" data-condition="${condition}">${match}</div>`
  //       })

  //       // Then add class to field placeholders
  //       html = html.replace(fieldRegex, (match) => {
  //         return `<span class="field-placeholder" contenteditable="false">${match}</span>`
  //       })

  //       // Only update if changes were made
  //       if (html !== editorElement.innerHTML) {
  //         editor.commands.setContent(html, false)
  //       }
  //     }
  //   }
  // }, [content, editor])

  // Update editor when content changes externally
  useEffect(() => {
    if (editor && content !== lastContent) {
      // Only update if the content is different from what's in the editor
      editor.commands.setContent(content)
      setLastContent(content)
    }
  }, [content, editor, lastContent])

  if (!editor) {
    return null
  }

  // Add a horizontal line divider at the cursor position
  const addLineDivider = () => {
    editor.chain().focus().setHorizontalRule().run()
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  // Reset zoom to 100%
  const handleResetZoom = () => {
    setZoomLevel(100)
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Get all questions from the form structure
  const getAllQuestions = () => {
    const questions = []

    formStructure.steps.forEach((step) => {
      step.subsections.forEach((subsection) => {
        subsection.question.forEach((question) => {
          questions.push({
            id: question.id,
            uniqueKeyName: question.uniqueKeyName,
            questionToAsk: question.questionToAsk,
            type: question.type,
          })
        })
      })
    })

    return questions
  }

  // Function to add a field to the document content
  const insertField = (fieldKey, fieldType = "input") => {
    // Check if the field already exists in the document
    const fieldRegex = new RegExp(`\\{\\{%\\s*${fieldKey}\\s*\\|[^}]*%\\}\\}`, "g")
    const fieldExists = fieldRegex.test(documentContent)

    // If the field exists and no cursor position is provided, don't add a duplicate
    if (fieldExists && cursorPosition === null) {
      return
    }

    const fieldFormat = `{{% ${fieldKey} | ${fieldType} | underscore %}}`

    if (editorInstance && cursorPosition !== null) {
      // Insert at cursor position without line breaks
      const { state } = editorInstance
      const { tr } = state

      // Add a space before and after the field if not already present
      const textBefore = state.doc.textBetween(Math.max(0, cursorPosition - 1), cursorPosition)
      const textAfter = state.doc.textBetween(cursorPosition, Math.min(cursorPosition + 1, state.doc.content.size))

      let insertText = fieldFormat
      if (textBefore !== " " && textBefore !== "") {
        insertText = " " + insertText
      }
      if (textAfter !== " " && textAfter !== "") {
        insertText = insertText + " "
      }

      tr.insertText(insertText, cursorPosition)
      editorInstance.view.dispatch(tr)
    } else {
      // Fallback if no cursor position or editor instance
      setDocumentContent((prevContent) => {
        return prevContent + ` ${fieldFormat} `
      })
    }
  }

  // Update a field in the document content
  const updateFieldInDocument = (oldFieldKey, newFieldKey) => {
    if (editor) {
      const content = editor.getHTML()

      // Replace field placeholders
      const fieldRegex = new RegExp(`\\{\\{%\\s*${oldFieldKey}\\s*(\\|[^}]*%\\}\\})`, "g")
      let updatedContent = content.replace(fieldRegex, (match, formatPart) => {
        return `{{% ${newFieldKey}${formatPart}`
      })

      // Replace conditional logic references
      const conditionalRegex = new RegExp(`\\{%\\s*if\\s+${oldFieldKey}\\s*`, "g")
      updatedContent = updatedContent.replace(conditionalRegex, (match) => {
        return match.replace(oldFieldKey, newFieldKey)
      })

      // Only update if changes were made
      if (updatedContent !== content) {
        editor.commands.setContent(updatedContent)
        setLastContent(updatedContent)
      }
    }
  }

  // Function to add conditional content to the document
  const handleAddConditionalToDocument = (fieldKey, condition, value, content, cursorPosition = null) => {
    const conditionalFormat = `{% if ${fieldKey} ${condition} "${value}" %}${content}{% endif %}`

    if (editorInstance && cursorPosition !== null) {
      // Insert at cursor position with proper spacing
      const { state } = editorInstance
      const { tr } = state

      // Add a space before and after the conditional if not already present
      const textBefore = state.doc.textBetween(Math.max(0, cursorPosition - 1), cursorPosition)
      const textAfter = state.doc.textBetween(cursorPosition, Math.min(cursorPosition + 1, state.doc.content.size))

      let insertText = conditionalFormat
      if (textBefore !== " " && textBefore !== "" && textBefore !== "\n") {
        insertText = " " + insertText
      }
      if (textAfter !== " " && textAfter !== "" && textAfter !== "\n") {
        insertText = insertText + " "
      }

      tr.insertText(insertText, cursorPosition)
      editorInstance.view.dispatch(tr)
    } else {
      // Fallback if no cursor position or editor instance
      setDocumentContent((prevContent) => {
        return prevContent + `\n${conditionalFormat}\n`
      })
    }
  }

  // Toolbar button component for consistency
  const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, tooltip }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={isActive ? "bg-accent" : ""}
            disabled={disabled}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 flex  gap-1 overflow-x-auto">
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            tooltip="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            tooltip="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Subscript/Superscript */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            tooltip="Subscript"
          >
            <SubscriptIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            tooltip="Superscript"
          >
            <SuperscriptIcon className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Type className="h-4 w-4 mr-1" /> Heading
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Headings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
              >
                <Heading1 className="h-4 w-4 mr-2" /> Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
              >
                <Heading2 className="h-4 w-4 mr-2" /> Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
              >
                <Heading3 className="h-4 w-4 mr-2" /> Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive("paragraph") ? "bg-accent" : ""}
              >
                <Type className="h-4 w-4 mr-2" /> Paragraph
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            tooltip="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            tooltip="Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            tooltip="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            tooltip="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          {/* <Separator orientation="vertical" className="h-6 mx-1" /> */}

          {/* Indentation */}
          {/* <ToolbarButton onClick={() => editor.chain().focus().indent().run()} tooltip="Indent">
            <Indent className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().outdent().run()} tooltip="Outdent">
            <Outdent className="h-4 w-4" />
          </ToolbarButton> */}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Special Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            tooltip="Code Block"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Font Family */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Type className="h-4 w-4 mr-1" /> Font
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Font Family</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {fontFamilies.map((font) => (
                <DropdownMenuItem
                  key={font.value}
                  onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                  className={editor.isActive("textStyle", { fontFamily: font.value }) ? "bg-accent" : ""}
                >
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().unsetFontFamily().run()}>
                Clear Font
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Line Divider */}
          <ToolbarButton onClick={addLineDivider} tooltip="Insert Horizontal Line">
            <SeparatorHorizontal className="h-4 w-4" />
          </ToolbarButton>

          {/* Insert Field */}
          <Dialog open={insertFieldOpen} onOpenChange={setInsertFieldOpen}>
            {/* <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-1" /> Insert Field
              </Button>
            </DialogTrigger> */}
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
                          insertField(question.uniqueKeyName, "input")
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

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 ml-auto">
            <ToolbarButton onClick={handleZoomOut} tooltip="Zoom Out" disabled={zoomLevel <= 50}>
              <ZoomOut className="h-4 w-4" />
            </ToolbarButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-20">
                  {zoomLevel}%
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Zoom Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {zoomPresets.map((preset) => (
                  <DropdownMenuItem
                    key={preset.value}
                    onClick={() => setZoomLevel(preset.value)}
                    className={zoomLevel === preset.value ? "bg-accent" : ""}
                  >
                    {preset.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarButton onClick={handleZoomIn} tooltip="Zoom In" disabled={zoomLevel >= 200}>
              <ZoomIn className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton onClick={handleResetZoom} tooltip="Reset Zoom">
              <Maximize className="h-4 w-4" />
            </ToolbarButton>

            {/* <Separator orientation="vertical" className="h-6 mx-1" /> */}

            {/* <ToolbarButton onClick={handlePrint} tooltip="Print Document">
              <Printer className="h-4 w-4" />
            </ToolbarButton> */}
          </div>
        </div>

      <div className="flex-1 overflow-auto bg-gray-200 p-8">
        <div className="flex flex-col items-center zoom-container">
          <div className="" ref={containerRef}>
            <div className="document-canvas">
              <EditorContent
                editor={editor}
                className="document-content prose prose-sm sm:prose focus:outline-none"
                ref={editorRef}
              />
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}
