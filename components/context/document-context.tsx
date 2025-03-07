"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import type { Editor } from "@tiptap/react"
import type { Comment, Reply } from "../../types/comment"
import type { DrawingResult } from "../../types/drawing"
import type { Signature, Signer, SignatureField } from "../../types/signature"

interface Page {
  id: number
  pageNumber: number
  rotation: number
  backgroundColor: string
  content: string
}

interface Drawing {
  pageId: number
  paths: string[]
  colors: string[]
  lineWidths: number[]
}

interface DocumentContextType {
  pages: Page[]
  currentPage: number
  setCurrentPage: (page: number) => void
  addPage: () => void
  deletePage: (pageId: number) => void
  copyPage: (pageId: number) => void
  rotatePage: (pageId: number, degrees: number) => void
  movePageToTop: (pageId: number) => void
  movePageToBottom: (pageId: number) => void
  replacePage: (pageId: number, newBackgroundColor: string) => void
  extractPage: (pageId: number) => void
  insertPage: (beforeId: number, backgroundColor: string) => void
  updatePageContent: (pageId: number, newContent: string) => void
  viewerRef: React.RefObject<HTMLDivElement>
  activeTool: string | "edit" | "signature" | "formBuilder" | null
  setActiveTool: (tool: string) => void
  isFormatPanelOpen: boolean
  setIsFormatPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeToolbarItem: string | null
  setActiveToolbarItem: React.Dispatch<React.SetStateAction<string | null>>
  toggleFormatPanel: () => void
  comments: Comment[]
  addComment: (pageId: number, x: number, y: number) => void
  updateComment: (id: string, content: string) => void
  deleteComment: (id: string) => void
  activeComment: Comment | null
  setActiveComment: (comment: Comment | null) => void
  isCommentDialogOpen: boolean
  setIsCommentDialogOpen: (open: boolean) => void
  activeCommentId: string | null
  setActiveCommentId: React.Dispatch<React.SetStateAction<string | null>>
  toggleCommentPanel: (commentId?: string | null) => void
  addReply: (commentId: string, content: string) => void
  updateReply: (commentId: string, replyId: string, content: string) => void
  deleteReply: (commentId: string, replyId: string) => void
  editor: Editor | null
  setEditor: React.Dispatch<React.SetStateAction<Editor | null>>
  activePanel: string | null
  setActivePanel: (panel: string | null) => void
  signers: Signer[]
  setSigners: React.Dispatch<React.SetStateAction<Signer[]>>
  signatureFields: SignatureField[]
  setSignatureFields: React.Dispatch<React.SetStateAction<SignatureField[]>>
  addSignatureField: (label: string) => void
  removeSignatureField: (index: number) => void
  drawings: Drawing[]
  addDrawing: (pageId: number, path: string, color: string, lineWidth: number) => void
  clearDrawings: (pageId: number) => void
  getDrawingsForPage: (pageId: number) => DrawingResult
  signatures: Signature[]
  addSignature: (signature: Omit<Signature, "rotation">) => void
  updateSignature: (id: string, updates: Partial<{ x: number; y: number; rotation: number }>) => void
  removeSignature: (id: string) => void
  contentPages: string[]
  setContentPages: React.Dispatch<React.SetStateAction<string[]>>
  insertHorizontalLine: () => void
  updateHorizontalLine: (width: string, height: string) => void
  updatePageCount: (count: number) => void
  prepareForSubmission: () => {
    content: string
    signatures: Array<{
      id: string
      content: string
      x: number
      y: number
      rotation: number
      type: "draw" | "type" | "upload"
    }>
    email: string
  }
  email: string
  setEmail: (email: string) => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export const useDocument = () => {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider")
  }
  return context
}

export const DocumentProvider: React.FC<{ children: React.ReactNode; initialData?: any }> = ({
  children,
  initialData,
}) => {
  const [pages, setPages] = useState<Page[]>(() => [
    {
      id: 1,
      pageNumber: 1,
      rotation: 0,
      backgroundColor: "white",
      content: initialData?.content || "",
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const viewerRef = useRef<HTMLDivElement>(null)
  const [activeTool, setActiveTool] = useState<string | "edit" | "signature" | "formBuilder" | null>("edit")
  const [isFormatPanelOpen, setIsFormatPanelOpen] = useState(false)
  const [activeToolbarItem, setActiveToolbarItem] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [activeComment, setActiveComment] = useState<Comment | null>(null)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [activePanel, setActivePanelState] = useState<string | null>(null)
  const [signers, setSigners] = useState<Signer[]>([])
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([])
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [signatures, setSignatures] = useState<Signature[]>(initialData?.signatures || [])
  const [contentPages, setContentPages] = useState<string[]>([])
  const [pageCount, setPageCount] = useState(1)
  const [email, setEmail] = useState<string>(initialData?.email || "")

  const addPage = useCallback(() => {
    setPages((prevPages) => [
      ...prevPages,
      {
        id: prevPages.length + 1,
        pageNumber: prevPages.length + 1,
        rotation: 0,
        backgroundColor: "white",
        content: "",
      },
    ])
  }, [])

  const deletePage = (pageId: number) => {
    setPages((prevPages) => {
      const updatedPages = prevPages.filter((page) => page.id !== pageId)
      return updatedPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))
    })
    if (currentPage > pages.length - 1) {
      setCurrentPage(Math.max(1, pages.length - 1))
    }
    setPageCount(pages.length)
  }

  const copyPage = (pageId: number) => {
    setPages((prevPages) => {
      const pageToCopy = prevPages.find((page) => page.id === pageId)
      if (pageToCopy) {
        const newPage = {
          ...pageToCopy,
          id: Math.max(...prevPages.map((p) => p.id)) + 1,
          pageNumber: pageToCopy.pageNumber + 1,
          //contentSource: pageToCopy.contentSource,
        }
        const insertIndex = prevPages.findIndex((page) => page.id === pageId) + 1
        const updatedPages = [...prevPages.slice(0, insertIndex), newPage, ...prevPages.slice(insertIndex)]
        return updatedPages.map((page, index) => ({
          ...page,
          pageNumber: index + 1,
        }))
      }
      return prevPages
    })
    setPageCount(pages.length)
  }

  const rotatePage = (pageId: number, degrees: number) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.id === pageId ? { ...page, rotation: (page.rotation + degrees) % 360 } : page)),
    )
  }

  const movePageToTop = (pageId: number) => {
    setPages((prevPages) => {
      const pageToMove = prevPages.find((page) => page.id === pageId)
      if (!pageToMove) return prevPages
      return [pageToMove, ...prevPages.filter((page) => page.id !== pageId)]
    })
  }

  const movePageToBottom = (pageId: number) => {
    setPages((prevPages) => {
      const pageToMove = prevPages.find((page) => page.id === pageId)
      if (!pageToMove) return prevPages
      return [...prevPages.filter((page) => page.id !== pageId), pageToMove]
    })
  }

  const replacePage = (pageId: number, newBackgroundColor: string) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.id === pageId ? { ...page, backgroundColor: newBackgroundColor } : page)),
    )
  }

  const extractPage = (pageId: number) => {
    const pageToExtract = pages.find((page) => page.id === pageId)
    if (pageToExtract) {
      // In a real implementation, this would trigger a download
      console.log(`Extracting page ${pageId}`)
    }
  }

  const insertPage = (beforeId: number, backgroundColor = "white") => {
    setPages((prevPages) => {
      const insertIndex = prevPages.findIndex((page) => page.id === beforeId)
      const newPageNumber = insertIndex === -1 ? prevPages.length + 1 : prevPages[insertIndex].pageNumber
      const newPage = {
        id: Math.max(...prevPages.map((p) => p.id)) + 1,
        pageNumber: newPageNumber,
        rotation: 0,
        backgroundColor,
        content: "<p>Start typing your content here...</p>",
        //contentSource: "original",
      }
      const updatedPages = [...prevPages.slice(0, insertIndex), newPage, ...prevPages.slice(insertIndex)]
      return updatedPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))
    })
    setPageCount(pages.length)
  }

  const updatePageContent = useCallback((pageId: number, newContent: string) => {
    setPages((prevPages) => prevPages.map((page) => (page.id === pageId ? { ...page, content: newContent } : page)))
  }, [])

  const setActiveToolAndResetFormat = (tool: string) => {
    setActiveTool(tool)
    if (tool !== "edit") {
      setIsFormatPanelOpen(false)
    }
  }

  const toggleFormatPanel = useCallback(() => {
    setActiveTool("edit")
    setIsFormatPanelOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (activeTool !== "edit") {
      setIsFormatPanelOpen(false)
    }
  }, [activeTool])

  const addComment = useCallback((pageId: number, x: number, y: number) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      pageId,
      x,
      y,
      content: "",
      author: "masubghazali26@gmail.com",
      createdAt: new Date(),
      replies: [],
    }
    setComments((prev) => {
      const filteredComments = prev.filter((comment) => comment.pageId !== pageId)
      return [...filteredComments, newComment]
    })
    setActiveComment(newComment)
    setActiveCommentId(newComment.id)
    setIsCommentDialogOpen(true)
  }, [])

  const updateComment = useCallback((id: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? { ...comment, content, updatedAt: new Date() } : comment)),
    )
  }, [])

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id))
    setActiveCommentId(null)
  }, [])

  const addReply = useCallback((commentId: string, content: string) => {
    const newReply: Reply = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: "masubghazali26@gmail.com",
      createdAt: new Date(),
    }
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment,
      ),
    )
  }, [])

  const updateReply = useCallback((commentId: string, replyId: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId ? { ...reply, content, updatedAt: new Date() } : reply,
              ),
            }
          : comment,
      ),
    )
  }, [])

  const deleteReply = useCallback((commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== replyId) }
          : comment,
      ),
    )
  }, [])

  const toggleCommentPanel = useCallback((commentId: string | null = null) => {
    setActiveToolbarItem((prev) => (prev === "comment" ? null : "comment"))
    setActiveCommentId(commentId)
  }, [])

  const toggleRedactPanel = useCallback(() => {
    setActivePanel("redact")
  }, [])

  const toggleUnderlinePanel = useCallback(() => {
    setActivePanel("underline")
  }, [])

  const toggleHighlightPanel = useCallback(() => {
    setActivePanel("highlight")
  }, [])

  const toggleImagePanel = useCallback(() => {
    setActivePanel("image")
  }, [])

  const toggleCutPanel = useCallback(() => {
    setActivePanel("cut")
  }, [])

  const toggleSignaturePanel = useCallback(() => {
    setActivePanel("signature")
  }, [])

  const toggleDrawPanel = useCallback(() => {
    setActivePanel("draw")
  }, [])

  const addDrawing = useCallback((pageId: number, path: string, color: string, lineWidth: number) => {
    setDrawings((prevDrawings) => {
      const pageDrawing = prevDrawings.find((d) => d.pageId === pageId)
      if (pageDrawing) {
        return prevDrawings.map((d) =>
          d.pageId === pageId
            ? {
                ...d,
                paths: [...d.paths, path],
                colors: [...d.colors, color],
                lineWidths: [...d.lineWidths, lineWidth],
              }
            : d,
        )
      } else {
        return [...prevDrawings, { pageId, paths: [path], colors: [color], lineWidths: [lineWidth] }]
      }
    })
  }, [])

  const clearDrawings = useCallback((pageId: number) => {
    setDrawings((prevDrawings) => prevDrawings.filter((d) => d.pageId !== pageId))
  }, [])

  const getDrawingsForPage = useCallback(
    (pageId: number): DrawingResult => {
      return drawings.find((d) => d.pageId === pageId) || { paths: [], colors: [], lineWidths: [] }
    },
    [drawings],
  )

  const addSignature = useCallback((signature: Omit<Signature, "rotation">) => {
    setSignatures((prev) => [...prev, { ...signature, rotation: 0 }])
  }, [])

  const updateSignature = useCallback((id: string, updates: Partial<{ x: number; y: number; rotation: number }>) => {
    setSignatures((prev) => prev.map((sig) => (sig.id === id ? { ...sig, ...updates } : sig)))
  }, [])

  const removeSignature = useCallback((id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id))
  }, [])

  const addSignatureField = useCallback((label: string) => {
    const newField: SignatureField = {
      id: Math.random().toString(36).substr(2, 9),
      type: "signature",
      label,
      required: true,
      signerId: "",
    }
    setSignatureFields((prev) => [...prev, newField])
  }, [])

  const removeSignatureField = useCallback((index: number) => {
    setSignatureFields((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const insertHorizontalLine = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run()
    }
  }

  const updateHorizontalLine = useCallback(
    (width: string, height: string) => {
      if (editor) {
        editor.chain().focus().updateAttributes("customHorizontalRule", { width, height }).run()
      }
    },
    [editor],
  )

  const updatePageCount = useCallback((count: number) => {
    setPageCount(count)
    setPages((prevPages) => {
      const newPages = [...prevPages]
      while (newPages.length < count) {
        newPages.push({
          id: Math.max(...newPages.map((p) => p.id)) + 1,
          pageNumber: newPages.length + 1,
          rotation: 0,
          backgroundColor: "white",
          content: "",
        })
      }
      while (newPages.length > count) {
        newPages.pop()
      }
      return newPages
    })
  }, [])

  const prepareForSubmission = useCallback(() => {
    const content = pages[0].content
    console.log("Preparing submission with email:", email)
    return {
      content,
      signatures: signatures.map((sig) => ({
        id: sig.id,
        content: sig.content,
        x: sig.x,
        y: sig.y,
        rotation: sig.rotation || 0,
        type: sig.type,
      })),
      email,
    }
  }, [pages, signatures, email])

  const updateEmail = useCallback((newEmail: string) => {
    console.log("Setting email to:", newEmail)
    setEmail(newEmail)
  }, [])

  const setActivePanel = useCallback((panel: string | null) => {
    console.log("Setting active panel to:", panel)
    setActivePanelState(panel)
  }, [])

  return (
    <DocumentContext.Provider
      value={{
        pages,
        currentPage,
        setCurrentPage,
        addPage,
        deletePage,
        copyPage,
        rotatePage,
        movePageToTop,
        movePageToBottom,
        replacePage,
        extractPage,
        insertPage,
        updatePageContent,
        viewerRef,
        activeTool,
        setActiveTool: setActiveToolAndResetFormat,
        isFormatPanelOpen,
        setIsFormatPanelOpen,
        activeToolbarItem,
        setActiveToolbarItem,
        toggleFormatPanel,
        comments,
        addComment,
        updateComment,
        deleteComment,
        activeComment,
        setActiveComment,
        isCommentDialogOpen,
        setIsCommentDialogOpen,
        activeCommentId,
        setActiveCommentId,
        toggleCommentPanel,
        addReply,
        updateReply,
        deleteReply,
        editor,
        setEditor,
        activePanel,
        setActivePanel,
        signers,
        setSigners,
        signatureFields,
        setSignatureFields,
        addSignatureField,
        removeSignatureField,
        drawings,
        addDrawing,
        clearDrawings,
        getDrawingsForPage,
        signatures,
        addSignature,
        removeSignature,
        updateSignature,
        contentPages,
        setContentPages,
        insertHorizontalLine,
        updateHorizontalLine,
        updatePageCount,
        prepareForSubmission,
        email,
        setEmail: updateEmail,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

