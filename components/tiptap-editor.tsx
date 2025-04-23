"use client"

import { useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Link from "@tiptap/extension-link"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import { Redact } from "../extensions/redact-extension"
import { useDocument } from "./context/document-context"
import { Draw } from "../extensions/draw-extension"
import { CustomHorizontalRule } from "../extensions/horizontal-rule-extension"
import { CustomPagination } from "../extensions/custom-pagination"
import { Node, mergeAttributes } from "@tiptap/core"
import { generateAttribute } from "../lib/utils"
import "./tap-tap.css"
import { removeCustomQuestionStyling} from "./Editor/editor-helper"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customQuestion: {
      setCustomQuestion: (question: string, type: string) => ReturnType
    }
  }
}

// Create a custom extension for handling question nodes
const CustomQuestion = Node.create({
  name: "customQuestion",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true, // Make it an atomic node

  addAttributes() {
    return {
      question: {
        default: null,
      },
      type: {
        default: null,
      },
      attribute: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="custom-question"]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    // Use minimal attributes to avoid adding styling
    const attrs = mergeAttributes(HTMLAttributes, {
      "data-type": "custom-question",
      "data-question-attribute": node.attrs.attribute,
      "data-question-type": node.attrs.type,
      class: "custom-question-node",
      contenteditable: "false", // Make the node itself not editable
    })

    // Return the node with its content
    return ["span", attrs, `{{% ${node.attrs.attribute} | ${node.attrs.type} | underscore %}}`]
  },

  addCommands() {
    return {
      setCustomQuestion:
        (question, type) =>
        ({ chain }) => {
          const attribute = generateAttribute(question)

          // Insert the content and ensure the cursor is placed after the node
          return chain()
            .insertContent({
              type: this.name,
              attrs: { question, type, attribute },
            })
            .run()
        },
    }
  },
})

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
  readOnly?: boolean
  extensions?: any[]
}

export function TiptapEditor({ content, onChange, className, readOnly, extensions = [] }: TiptapEditorProps) {
  const { setEditor } = useDocument()
  const editorRef = useRef<HTMLDivElement>(null)

  const sanitizeContent = (html: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const cleanNode = (node: Node): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) {
          node.textContent = node.textContent
            .replace(/([^\s$])\1{3,}/g, "$1$1$1") // Limit repeated characters to 3
            .replace(/\s+/g, " ") // Normalize whitespace
            .replace(/\$+/g, "$") // Fix repeated dollar signs
            .trim()
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        if (element.tagName === "P" && !element.textContent?.trim()) {
          element.remove()
        } else {
          Array.from(element.childNodes).forEach(cleanNode)
        }
      }
    }

    cleanNode(doc.body)
    return doc.body.innerHTML
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Redact,
      Draw,
      CustomHorizontalRule,
      CustomPagination,
      CustomQuestion,
      ...extensions,
    ],
    content: sanitizeContent(content),
    onUpdate: ({ editor }) => {
      const cleanContent = sanitizeContent(editor.getHTML())
      onChange(cleanContent)
    },
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "prose mx-auto focus:outline-none custom-tiptap-content",
        style: "max-width: 100%; padding: 0; margin: 0; font-size: 12px; line-height: 1.5;",
      },
      handleClick(view, pos, event) {
        // Handle clicks on custom question nodes
        const target = event.target as HTMLElement
        if (target.getAttribute("data-type") === "custom-question") {
          const nodePos = view.posAtDOM(target, 0)
          const node = view.state.doc.nodeAt(nodePos)

          if (node) {
            // Determine if click is on left or right side of the node
            const rect = target.getBoundingClientRect()
            const clickX = event.clientX
            const isRightSide = clickX > rect.left + rect.width / 2

            // Set cursor position before or after the node
            const newPos = isRightSide ? nodePos + node.nodeSize : nodePos

            // Update selection
            const tr = view.state.tr.setSelection(view.state.selection.constructor.near(view.state.doc.resolve(newPos)))
            view.dispatch(tr)

            return true // Prevent default handling
          }
        }
        return false // Let other click handlers run
      },
      handleKeyDown(view, event) {
        // Handle arrow key navigation around custom nodes
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          const { selection } = view.state
          const { $from, $to } = selection

          // Check if we're at a custom question node
          const node = $from.nodeAfter || $to.nodeBefore
          if (node && node.type.name === "customQuestion") {
            // Move cursor before or after the node based on arrow direction
            const pos = event.key === "ArrowLeft" ? $from.pos : $to.pos
            const tr = view.state.tr.setSelection(view.state.selection.constructor.near(view.state.doc.resolve(pos)))
            view.dispatch(tr)
            return true
          }
        }
        return false
      },
    },
  })

  useEffect(() => {
    if (editor) {
      setEditor(editor)
    }
  }, [editor, setEditor])

  useEffect(() => {
    if (editor && editor.isEditable !== !readOnly) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly])

  // Add a custom CSS class to the editor when it's mounted
  useEffect(() => {
    if (editorRef.current) {
      const editorElement = editorRef.current.querySelector(".ProseMirror")
      if (editorElement) {
        editorElement.classList.add("custom-tiptap-editor")
      }
    }
  }, [editor])

  // Add a click handler to improve cursor positioning around custom nodes
  useEffect(() => {
    if (editor) {
      const editorElement = document.querySelector(".ProseMirror")
      if (editorElement) {
        const handleClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement
          if (target.getAttribute("data-type") === "custom-question") {
            // Find the nearest valid cursor position
            const rect = target.getBoundingClientRect()
            const isClickOnRightHalf = e.clientX > rect.left + rect.width / 2

            if (isClickOnRightHalf) {
              // Place cursor after the node
              const pos = editor.view.posAtDOM(target, 0) + target.textContent!.length
              editor.commands.setTextSelection(pos)
            } else {
              // Place cursor before the node
              const pos = editor.view.posAtDOM(target, 0)
              editor.commands.setTextSelection(pos)
            }

            e.preventDefault()
            e.stopPropagation()
          }
        }

        editorElement.addEventListener("click", handleClick)
        return () => {
          editorElement.removeEventListener("click", handleClick)
        }
      }
    }
  }, [editor])

  // Process text nodes with custom question format to remove styling
  useEffect(() => {
    if (editor) {
      const processTextNodes = () => {
        const editorElement = document.querySelector(".ProseMirror")
        if (!editorElement) return

        // Find all text nodes that contain custom question format
        const walker = document.createTreeWalker(editorElement, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            const text = node.textContent || ""
            return text.includes("{{% ") && text.includes(" %}}") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
          },
        })

        const nodesToProcess = []
        let currentNode
        while ((currentNode = walker.nextNode())) {
          nodesToProcess.push(currentNode)
        }

        // Process the nodes to remove styling
        nodesToProcess.forEach((node) => {
          const parent = node.parentNode
          if (parent && parent.nodeType === Node.ELEMENT_NODE) {
            // Remove any styling classes or attributes
            if ((parent as Element).classList.contains("custom-question-text")) {
              ;(parent as Element).classList.remove("custom-question-text")
            }
            if ((parent as Element).hasAttribute("data-custom-question")) {
              ;(parent as Element).removeAttribute("data-custom-question")
            }
            // Remove any inline styles
            if ((parent as Element).style.backgroundColor) {
              ;(parent as Element).style.backgroundColor = ""
            }
            if ((parent as Element).style.color) {
              ;(parent as Element).style.color = ""
            }
            if ((parent as Element).style.border) {
              ;(parent as Element).style.border = ""
            }
            if ((parent as Element).style.padding) {
              ;(parent as Element).style.padding = ""
            }
            if ((parent as Element).style.margin) {
              ;(parent as Element).style.margin = ""
            }
            if ((parent as Element).style.fontFamily) {
              ;(parent as Element).style.fontFamily = ""
            }
          }
        })
      }

      // Process on initial load
      processTextNodes()

      // Set up a listener for editor updates
      const handleUpdate = () => {
        processTextNodes()
      }

      editor.on("update", handleUpdate)

      return () => {
        editor.off("update", handleUpdate)
      }
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      // Remove styling on initial load
      removeCustomQuestionStyling()

      // Set up a listener for editor updates
      const handleUpdate = () => {
        removeCustomQuestionStyling()
      }

      editor.on("update", handleUpdate)

      return () => {
        editor.off("update", handleUpdate)
      }
    }
  }, [editor])

  return (
    <div ref={editorRef} className={`w-full overflow-hidden ${className || ""}`}>
      <EditorContent editor={editor} className={`w-full whitespace-pre-wrap ${className || ""}`} />
    </div>
  )
}
