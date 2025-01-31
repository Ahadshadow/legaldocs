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

const CustomPagination = Extension.create({
  name: "customPagination",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          pageBreak: {
            default: false,
            parseHTML: (element) => element.hasAttribute("data-page-break"),
            renderHTML: (attributes) => {
              if (!attributes.pageBreak) {
                return {}
              }
              return { "data-page-break": "" }
            },
          },
        },
      },
    ]
  },

  onUpdate() {
    const { editor } = this
    if (!editor) return

    setTimeout(() => {
      const editorElement = editor.view.dom
      const pageHeight = 1056 // A4 height in pixels
      let currentHeight = 0
      let pageBreaksAdded = 0

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "paragraph" || node.type.name === "heading") {
          const element = editorElement.querySelector(`[data-node-id="${node.attrs.id}"]`)
          if (element) {
            const nodeHeight = (element as HTMLElement).offsetHeight
            if (currentHeight + nodeHeight > pageHeight) {
              editor.commands.updateAttributes(node.type.name, { pageBreak: true })
              currentHeight = nodeHeight
              pageBreaksAdded++
            } else {
              editor.commands.updateAttributes(node.type.name, { pageBreak: false })
              currentHeight += nodeHeight
            }
          }
        }
      })

      // Update the page count in the document context
      if (this.options.updatePageCount) {
        this.options.updatePageCount(pageBreaksAdded + 1)
      }
    }, 0)
  },
})

export function TiptapEditor({ content, onChange, className, readOnly, extensions = [] }: TiptapEditorProps) {
  const { setEditor, updatePageCount } = useDocument()
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
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
      CustomPagination.configure({
        updatePageCount: updatePageCount,
      }),
      ...extensions,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !readOnly,
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

  return (
    <div ref={editorRef} className={`w-full overflow-hidden ${className || ""}`}>
      <EditorContent editor={editor} className="w-full" />
    </div>
  )
}

