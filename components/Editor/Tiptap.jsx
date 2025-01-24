'use client'

import { useEditor } from '@tiptap/react'
import { EditorContent } from '@tiptap/pm/view'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Type, BoldIcon, ItalicIcon, UnderlineIcon, Strikethrough, CodeIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, ImageIcon, Eraser, Pencil, Scissors, Square, MessageCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      Link.configure({ openOnClick: true }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: `
      <p>Welcome to the full-featured editor! 🌟</p>
      <p>You can now use <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, and much more!</p>
    `,
  })

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ onClick, disabled, icon: Icon, tooltip }: any) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClick} 
            disabled={disabled}
            className="h-9 w-9 p-2"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <Card className="w-full border rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b">
        <ToolbarButton
          icon={Type}
          onClick={() => {}}
          tooltip="Text"
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton
          icon={BoldIcon}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          tooltip="Bold"
        />
        <ToolbarButton
          icon={ItalicIcon}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          tooltip="Italic"
        />
        <ToolbarButton
          icon={UnderlineIcon}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          tooltip="Underline"
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton
          icon={Eraser}
          onClick={() => {}}
          tooltip="Eraser"
        />
        <ToolbarButton
          icon={Pencil}
          onClick={() => {}}
          tooltip="Draw"
        />
        <ToolbarButton
          icon={Scissors}
          onClick={() => {}}
          tooltip="Redact"
        />
        <ToolbarButton
          icon={ImageIcon}
          onClick={() => {}}
          tooltip="Image"
        />
        <ToolbarButton
          icon={Square}
          onClick={() => {}}
          tooltip="Shape"
        />
        <ToolbarButton
          icon={Highlighter}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          tooltip="Highlight"
        />
        <ToolbarButton
          icon={UnderlineIcon}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          tooltip="Underline"
        />
        <ToolbarButton
          icon={MessageCircle}
          onClick={() => {}}
          tooltip="Comment"
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton
          icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={!editor.can().chain().focus().setTextAlign('left').run()}
          tooltip="Align Left"
        />
        <ToolbarButton
          icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={!editor.can().chain().focus().setTextAlign('center').run()}
          tooltip="Align Center"
        />
        <ToolbarButton
          icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          disabled={!editor.can().chain().focus().setTextAlign('right').run()}
          tooltip="Align Right"
        />
        <ToolbarButton
          icon={AlignJustify}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          disabled={!editor.can().chain().focus().setTextAlign('justify').run()}
          tooltip="Justify"
        />
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </Card>
  )
}

export default Tiptap

