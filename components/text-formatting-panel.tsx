"use client"

import { useDocument } from "../components/context/document-context"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Separator } from "../components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link,
  Unlink,
  Subscript,
  Superscript,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
} from "lucide-react"

export function TextFormattingPanel() {
  const { editor, setActiveTool } = useDocument()

  if (!editor) {
    return null
  }

  const headingLevels = [
    { value: "0", label: "Paragraph", icon: "P" },
    { value: "1", label: "Heading 1", icon: "H1" },
    { value: "2", label: "Heading 2", icon: "H2" },
    { value: "3", label: "Heading 3", icon: "H3" },
    { value: "4", label: "Heading 4", icon: "H4" },
    { value: "5", label: "Heading 5", icon: "H5" },
    { value: "6", label: "Heading 6", icon: "H6" },
  ]

  const getCurrentHeadingLevel = () => {
    if (editor.isActive("paragraph")) {
      return "0"
    }
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i.toString()
      }
    }
    return "0"
  }

  const setHeading = (level: string) => {
    const intLevel = Number.parseInt(level)
    if (intLevel === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor
        .chain()
        .focus()
        .setHeading({ level: intLevel as 1 | 2 | 3 | 4 | 5 | 6 })
        .run()
    }
  }

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Text Style</h3>
          <Select value={getCurrentHeadingLevel()} onValueChange={setHeading}>
            <SelectTrigger>
              <SelectValue placeholder="Text style" />
            </SelectTrigger>
            <SelectContent>
              {headingLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Basic Formatting</h3>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-muted" : ""}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-muted" : ""}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "bg-muted" : ""}
            >
              <Subscript className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "bg-muted" : ""}
            >
              <Superscript className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive("highlight") ? "bg-muted" : ""}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Alignment</h3>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={editor.isActive({ textAlign: "justify" }) ? "bg-muted" : ""}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Lists</h3>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-muted" : ""}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Special Formatting</h3>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "bg-muted" : ""}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "bg-muted" : ""}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Link</h3>
          <div className="flex flex-wrap gap-2">
            <Input
              type="url"
              placeholder="Enter URL"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editor.chain().focus().setLink({ href: e.currentTarget.value }).run()
                }
              }}
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const previousUrl = editor.getAttributes("link").href
                  const url = window.prompt("URL", previousUrl)
                  if (url === null) {
                    return
                  }
                  if (url === "") {
                    editor.chain().focus().unsetLink().run()
                    return
                  }
                  editor.chain().focus().setLink({ href: url }).run()
                }}
                className={editor.isActive("link") ? "bg-muted" : ""}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive("link")}
              >
                <Unlink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">History</h3>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
        <Button className="w-full" variant="secondary" onClick={() => setActiveTool("edit")}>
          Finish Editing
        </Button>
      </div>
    </div>
  )
}

