"use client"

import * as React from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group-document"
import { Label } from "../components/ui/label"
import {
  Edit,
  FileSignature,
  Copy,
  Trash2,
  MoreHorizontal,
  RotateCw,
  RotateCcw,
  MoveUp,
  MoveDown,
  Replace,
  FileOutput,
  FilePlus2,
} from "lucide-react"
import { useDocument } from "./context/document-context"
import { toast } from "sonner"
import { useState, useRef } from "react"

interface SidebarButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarButton({ icon, label, active, onClick }: SidebarButtonProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="w-full flex flex-col items-center justify-center gap-2 px-2 py-3 h-auto"
      onClick={onClick}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
      <span className="text-xs text-center">{label}</span>
    </Button>
  )
}

interface PageActionsProps {
  pageId: number
  isEditable: boolean
}

function PageActions({ pageId, isEditable }: PageActionsProps) {
  const { deletePage, copyPage, rotatePage, movePageToTop, movePageToBottom, replacePage, extractPage, insertPage } =
    useDocument()

  const [showInsertDialog, setShowInsertDialog] = useState(false)
  const [showExtractDialog, setShowExtractDialog] = useState(false)
  const [showReplaceDialog, setShowReplaceDialog] = useState(false)
  const [insertPosition, setInsertPosition] = useState<"above" | "below">("above")
  const [numPages, setNumPages] = useState("1")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInsert = async () => {
    try {
      const position = insertPosition === "above" ? pageId : pageId + 1
      insertPage(position, "white")
      setShowInsertDialog(false)
      toast.success("Page inserted successfully")
    } catch (error) {
      toast.error("Failed to insert page")
    }
  }

  const handleExtract = async (andDelete: boolean) => {
    try {
      await extractPage(pageId)
      if (andDelete) {
        deletePage(pageId)
      }
      setShowExtractDialog(false)
      toast.success("Page extracted successfully")
    } catch (error) {
      toast.error("Failed to extract page")
    }
  }

  const handleReplace = async () => {
    try {
      replacePage(pageId, "white")
      setShowReplaceDialog(false)
      toast.success("Page replaced successfully")
    } catch (error) {
      toast.error("Failed to replace page")
    }
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-1 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-white hover:bg-gray-100"
          onClick={() => {
            if (isEditable) {
              copyPage(pageId)
              toast.success("Page copied successfully")
            }
          }}
          disabled={!isEditable}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-white hover:bg-gray-100"
          onClick={() => {
            if (isEditable) {
              deletePage(pageId)
              toast.success("Page deleted successfully")
            }
          }}
          disabled={!isEditable}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 bg-white hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Move pages</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  if (isEditable) {
                    movePageToTop(pageId)
                    toast.success("Page moved to top")
                  }
                }}
                disabled={!isEditable}
              >
                <MoveUp className="mr-2 h-4 w-4" />
                Move to Top
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (isEditable) {
                    movePageToBottom(pageId)
                    toast.success("Page moved to bottom")
                  }
                }}
                disabled={!isEditable}
              >
                <MoveDown className="mr-2 h-4 w-4" />
                Move to Bottom
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Page Orientation</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  if (isEditable) {
                    rotatePage(pageId, 90)
                    toast.success("Page rotated clockwise")
                  }
                }}
                disabled={!isEditable}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Rotate Clockwise
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (isEditable) {
                    rotatePage(pageId, -90)
                    toast.success("Page rotated counterclockwise")
                  }
                }}
                disabled={!isEditable}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Rotate Counterclockwise
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Page Manipulation</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setShowInsertDialog(true)} disabled={!isEditable}>
                <FilePlus2 className="mr-2 h-4 w-4" />
                Insert
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowReplaceDialog(true)} disabled={!isEditable}>
                <Replace className="mr-2 h-4 w-4" />
                Replace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExtractDialog(true)} disabled={!isEditable}>
                <FileOutput className="mr-2 h-4 w-4" />
                Extract
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showInsertDialog} onOpenChange={setShowInsertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Page Placement</Label>
              <RadioGroup
                defaultValue={insertPosition}
                onValueChange={(val) => setInsertPosition(val as "above" | "below")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="above" id="above" />
                  <Label htmlFor="above">Above Page</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="below" id="below" />
                  <Label htmlFor="below">Below Page</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specify Page</Label>
                <Input type="number" value={pageId} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Number Of Pages</Label>
                <Input type="number" min="1" value={numPages} onChange={(e) => setNumPages(e.target.value)} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Total {Number.parseInt(numPages) || 0} Pages</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsertDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>Add Page(s)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExtractDialog} onOpenChange={setShowExtractDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extract Page</DialogTitle>
            <DialogDescription>Are you sure you want to extract the selected page(s)?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtractDialog(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleExtract(true)}>
              Extract and Delete
            </Button>
            <Button onClick={() => handleExtract(false)}>Extract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Page</DialogTitle>
          </DialogHeader>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleReplace()
                }
              }}
            />
            <div className="text-sm text-muted-foreground">
              Drag & Drop your file here
              <div className="mt-2">Or</div>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Browse Files
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplaceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReplace}>Select</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function DocumentSidebar({isEmailMatch , isComplete}) {
  const { activeTool, setActiveTool, copyPage, deletePage, rotatePage, extractPage } = useDocument()
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkExtractDialog, setShowBulkExtractDialog] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const togglePageSelection = (pageId: number) => {
    setSelectedPages((prev) => (prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]))
  }

  console.log(isComplete, 'all');
  

  return (
    <div className="h-full flex flex-shrink-0 overflow-hidden">
      <div className="w-[120px] border-r flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="p-3 space-y-3">
            {!isEmailMatch && (
              <SidebarButton
                icon={<Edit />}
                label="Edit"
                active={activeTool === "edit"}
                onClick={() => setActiveTool(activeTool === "edit" ? null : "edit")}
              />
            )}
            {isComplete.status != "Complete" ?
            <SidebarButton
              icon={<FileSignature />}
              label="Signature"
              active={activeTool === "signature"}
              onClick={() => setActiveTool(activeTool === "signature" ? null : "signature")}
            /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

