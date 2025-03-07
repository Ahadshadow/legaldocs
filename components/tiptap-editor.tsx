// Version 462
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
import { Node, RawCommands, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customQuestion: {
      setCustomQuestion: (step: string, question: string, type: string) => ReturnType
    }
  }
}

const CustomQuestion = Node.create({
  name: "customQuestion",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      step: {
        default: null,
      },
      question: {
        default: null,
      },
      type: {
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
    const attrs = mergeAttributes(HTMLAttributes, { "data-type": "custom-question" })
    return ["span", attrs, `{{${node.attrs.step} | ${node.attrs.question} | ${node.attrs.type}}}`]
  },

  addCommands() {
    return {
        setCustomQuestion:
            (step: any, question: any, type: any) =>
            ({ commands }: { commands: any }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: { step, question, type },
                });
            },
    } as Partial<RawCommands>;
}
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
  
    const cleanNode = (node: ChildNode): void => {
      if (node.nodeType === 3) { // TEXT_NODE
        if (node.textContent) {
          node.textContent = node.textContent
            .replace(/([^\s$])\1{3,}/g, "$1$1$1") // Limit repeated characters to 3
            .replace(/\s+/g, " ") // Normalize whitespace
            .replace(/\$+/g, "$") // Fix repeated dollar signs
            .trim();
        }
      } else if (node.nodeType === 1) { // ELEMENT_NODE
        const element = node as HTMLElement;
        if (element.tagName === "P" && !element.textContent?.trim()) {
          element.remove();
        } else {
          Array.from(element.childNodes).forEach((child) => cleanNode(child as ChildNode));
        }
      }
    };
    
    cleanNode(doc.body);
    return doc.body.innerHTML;
  };
  

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
        class: "prose mx-auto focus:outline-none",
        style: "max-width: 100%; padding: 0; margin: 0; font-size: 12px; line-height: 1.5;",
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

  return (
    <div ref={editorRef} className={`w-full overflow-hidden ${className || ""}`}>
      <EditorContent editor={editor} className={`w-full whitespace-pre-wrap ${className || ""}`} />
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  )
}

const globalStyles = `
.ProseMirror span[data-type="custom-question"] {
  background-color: #f0f9ff;
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: medium;
  color: #0066cc;
  display: inline-block;
  margin: 0 2px;
  border: 1px solid #e6f3ff;
}
`

