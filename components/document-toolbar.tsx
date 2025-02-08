"use client"

import { Button } from "../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip-document"
import {
  TextSelect,
  UndoIcon,
  ImageIcon,
  Highlighter,
  Underline,
  MessageSquare,
  X,
  Scissors,
  FileSignature,
  Pencil,
  MinusSquare,
} from "lucide-react"
import { useDocument } from "./context/document-context"
import type React from "react"
import { useState } from "react"
import { SignerSelectionDialog } from "./signer-selection-dialog"

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  toolbarItem: string
  hasDropdown?: boolean
  onClick?: () => void
}

function ToolbarButton({ icon, label, toolbarItem, hasDropdown, onClick }: ToolbarButtonProps) {
  const { activePanel, setActivePanel } = useDocument()

  const handleClick = () => {
    if (toolbarItem === "signature") {
      setActivePanel("signature")
      if (onClick) {
        onClick()
      }
      return
    }

    setActivePanel(activePanel === toolbarItem ? null : toolbarItem)
  }

  const isActive = activePanel === toolbarItem

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={handleClick}
            className={`flex flex-col items-center justify-center h-auto py-2 px-3 hover:bg-transparent hover:text-primary gap-1 group relative ${
              isActive ? "bg-muted" : ""
            }`}
          >
            <div className="relative">
              {icon}
              {hasDropdown && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -bottom-1 -right-1"
                >
                  <path
                    d="M3 5L6 8L9 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            {isActive && (
              <div
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setActivePanel(null)
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <span className="text-[11px] font-normal text-muted-foreground group-hover:text-primary">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function DocumentToolbar({isEmailMatch , isComplete}) {
  const { activeTool, activePanel, setActivePanel, setActiveTool, setEmail } = useDocument()
  const [isSelectSignerOpen, setIsSelectSignerOpen] = useState(false)

  if (activeTool !== "edit" && activeTool !== "signature") {
    return null
  }

  const handleSignatureClick = () => {
    if (isEmailMatch) {
      setActivePanel("signature")
    } else {
      setIsSelectSignerOpen(true)
    }
  }
  console.log(isComplete, "compiii");
  

  return (
    <div className="flex items-center gap-0.5 p-1 border-b bg-background">
      {activeTool === "edit" && !isEmailMatch && (
        <>
          <ToolbarButton icon={<TextSelect className="h-4 w-4" />} label="Format text" toolbarItem="format" />
          <ToolbarButton icon={<UndoIcon className="h-4 w-4" />} label="Redact" toolbarItem="redact" />
          <ToolbarButton icon={<ImageIcon className="h-4 w-4" />} label="Image" toolbarItem="image" />
          <ToolbarButton icon={<Scissors className="h-4 w-4" />} label="Cut" toolbarItem="cut" />
          <ToolbarButton icon={<Highlighter className="h-4 w-4" />} label="Highlight" toolbarItem="highlight" />
          <ToolbarButton icon={<Underline className="h-4 w-4" />} label="Underline" toolbarItem="underline" />
          <ToolbarButton icon={<MessageSquare className="h-4 w-4" />} label="Comment" toolbarItem="comment" />
          <ToolbarButton icon={<Pencil className="h-4 w-4" />} label="Draw" toolbarItem="draw" />
          <ToolbarButton
            icon={<MinusSquare className="h-4 w-4" />}
            label="Horizontal Line"
            toolbarItem="horizontalLine"
          />
        </>
      )}
      {isComplete != "Complete"  ?
      <ToolbarButton
        icon={<FileSignature className="h-4 w-4" />}
        label="Signature"
        toolbarItem="signature"
        onClick={handleSignatureClick}
      /> : null}
      {!isEmailMatch && (
        <SignerSelectionDialog
          isOpen={isSelectSignerOpen}
          onClose={() => setIsSelectSignerOpen(false)}
          onSelect={(email) => {
            setEmail(email)
            setActivePanel("signature")
            setIsSelectSignerOpen(false)
          }}
        />
      )}
    </div>
  )
}

