"use client"

import React from "react"
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
import { useDocument } from "../components/context/document-context"
import { Draw } from "../extensions/draw-extension"

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
  readOnly?: boolean
}

export function TiptapEditor({ content, onChange, className, readOnly }: TiptapEditorProps) {
  const { setEditor } = useDocument()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          keepMarks: true,
          keepAttributes: false,
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
        HTMLAttributes: {
          class: "highlight",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Redact,
      Draw.configure({
        HTMLAttributes: {
          class: "draw-node",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: `prose max-w-none w-full h-full outline-none px-8 py-6 ${readOnly ? "pointer-events-none" : ""}`,
      },
    },
  })

  React.useEffect(() => {
    if (editor) {
      setEditor(editor)
    }
  }, [editor, setEditor])

  React.useEffect(() => {
    if (editor && editor.isEditable !== !readOnly) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly])

  return (
    <div className={`w-full h-full overflow-hidden prose ${className || ""}`}>
      <EditorContent editor={editor} className="w-full h-full" />
    </div>
  )
}

