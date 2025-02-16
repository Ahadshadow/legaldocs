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
import { Extension } from "@tiptap/core"
import { CustomHorizontalRule } from "../extensions/horizontal-rule-extension"

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
  readOnly?: boolean
  extensions?: any[]
}

// Track processed nodes to prevent duplication
const processedNodes = new Set<string>()

const PageBreak = Extension.create({
  name: "pageBreak",
  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent(
              `<div class="page-break-container" contenteditable="false">
                <div class="page-break-line"></div>
              </div>`,
            )
            .run()
        },
    }
  },
})

const CustomPagination = Extension.create({
  name: "customPagination",
  addStorage() {
    return {
      processedNodes: new Set(),
    }
  },

  onUpdate() {
    const { editor } = this
    if (!editor) return

    // Clear processed nodes on each update
    this.storage.processedNodes.clear()

    setTimeout(() => {
      const editorElement = editor.view.dom
      const pageHeight = 1056 // A4 height in pixels
      const pageBreakPadding = 40 // Reduced padding
      let currentHeight = 0

      const processNode = (node: any, pos: number) => {
        if (!node || this.storage.processedNodes.has(node.attrs?.id)) return

        if (node.type.name === "paragraph" || node.type.name === "heading") {
          const element = editorElement.querySelector(`[data-node-id="${node.attrs?.id}"]`)
          if (!element) return

          const nodeHeight = (element as HTMLElement).offsetHeight
          const remainingSpace = pageHeight - pageBreakPadding - currentHeight

          // Only add page break if we're not at a section start and have significant content
          if (remainingSpace < nodeHeight && !node.textContent.match(/^\d+\.\s/) && currentHeight > pageHeight * 0.1) {
            editor.chain().focus().insertContentAt(pos, '<div class="content-spacer"></div>').setPageBreak().run()
            currentHeight = nodeHeight
          } else {
            currentHeight += nodeHeight
          }

          this.storage.processedNodes.add(node.attrs?.id)
        }
      }

      // Process nodes in order
      editor.state.doc.descendants((node, pos) => {
        processNode(node, pos)
      })
    }, 100) // Increased delay to ensure proper rendering
  },
})

export function TiptapEditor({ content, onChange, className, readOnly, extensions = [] }: TiptapEditorProps) {
  const { setEditor } = useDocument()
  const editorRef = useRef<HTMLDivElement>(null)

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
      PageBreak,
      ...extensions,
    ],
    content,
    onUpdate: ({ editor }) => {
      // Remove any duplicate content before triggering onChange
      const cleanContent = removeDuplicateContent(editor.getHTML())
      onChange(cleanContent)
    },
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "prose mx-auto focus:outline-none",
        style: "max-width: 100%; padding: 0; margin: 0; font-size: 12px;",
      },
    },
  })

  // Function to remove duplicate content
  const removeDuplicateContent = (html: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html

    // Remove duplicate paragraphs
    const paragraphs = tempDiv.getElementsByTagName("p")
    const seen = new Set<string>()
    Array.from(paragraphs).forEach((p) => {
      const content = p.textContent?.trim()
      if (content && seen.has(content)) {
        p.remove()
      } else if (content) {
        seen.add(content)
      }
    })

    return tempDiv.innerHTML
  }

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

  return (
    <div ref={editorRef} className={`w-full overflow-hidden ${className || ""}`}>
      <EditorContent editor={editor} className={`w-full whitespace-pre-wrap ${className || ""}`} />
    </div>
  )
}

