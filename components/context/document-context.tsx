"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import type { Comment, Reply } from "../../types/comment"
import type { Editor } from "@tiptap/react"

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

type Signer = {}

type SignatureField = { label: string }

interface Signature {
  id: string
  pageId: number
  x: number
  y: number
  type: "draw" | "type"
  content: string
}

interface DocumentContextType {
  pages: Page[]
  currentPage: number
  setCurrentPage: (page: number) => void
  deletePage: (pageId: number) => void
  copyPage: (pageId: number) => void
  rotatePage: (pageId: number, degrees: number) => void
  movePageToTop: (pageId: number) => void
  movePageToBottom: (pageId: number) => void
  replacePage: (pageId: number, newBackgroundColor: string) => void
  extractPage: (pageId: number) => void
  insertPage: (beforeId: number, backgroundColor: string) => void
  viewerRef: React.RefObject<HTMLDivElement>
  activeTool: string
  setActiveTool: (tool: string) => void
  updatePageContent: (pageId: number, newContent: string) => void
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
  isRedactPanelOpen: boolean
  isUnderlinePanelOpen: boolean
  isHighlightPanelOpen: boolean
  toggleRedactPanel: () => void
  toggleUnderlinePanel: () => void
  toggleHighlightPanel: () => void
  isImagePanelOpen: boolean
  toggleImagePanel: () => void
  isCutPanelOpen: boolean
  toggleCutPanel: () => void
  activePanel: string | null
  setActivePanel: (panel: string | null) => void
  isSignaturePanelOpen: boolean
  toggleSignaturePanel: () => void
  signers: Signer[]
  setSigners: React.Dispatch<React.SetStateAction<Signer[]>>
  signatureFields: SignatureField[]
  setSignatureFields: React.Dispatch<React.SetStateAction<SignatureField[]>>
  addSignatureField: (label: string) => void
  removeSignatureField: (index: number) => void
  isDrawPanelOpen: boolean
  toggleDrawPanel: () => void
  drawings: Drawing[]
  addDrawing: (pageId: number, path: string, color: string, lineWidth: number) => void
  clearDrawings: (pageId: number) => void
  getDrawingsForPage: (pageId: number) => Drawing
  signatures: Signature[]
  addSignature: (pageId: number, x: number, y: number, type: "draw" | "type", content: string) => void
  removeSignature: (id: string) => void
  contentPages: string[]
  setContentPages: React.Dispatch<React.SetStateAction<string[]>>
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export const useDocument = () => {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider")
  }
  return context
}

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>(() => [
    {
      id: 1,
      pageNumber: 1,
      rotation: 0,
      backgroundColor: "white",
      content: `
      <h1>Lease Agreement</h1>
      <p>This Lease Agreement (the "Agreement") is made and entered into on [DATE], by and between [LANDLORD NAME] (the "Landlord") and [TENANT NAME] (the "Tenant").</p>
      <h2>1. Property</h2>
      <p>The Landlord agrees to rent to the Tenant the property located at [PROPERTY ADDRESS] (the "Property").</p>
      <h2>2. Term</h2>
      <p>The term of this lease shall be for a period of [LEASE DURATION], commencing on [START DATE] and ending on [END DATE].</p>
      <h2>3. Rent</h2>
      <p>The Tenant agrees to pay rent in the amount of $[RENT AMOUNT] per month, due on the [DUE DATE] of each month. Late payments will incur a fee of $[LATE FEE AMOUNT].</p>
      <h2>4. Security Deposit</h2>
      <p>Upon execution of this Agreement, the Tenant shall deposit with the Landlord the sum of $[DEPOSIT AMOUNT] as a security deposit.</p>
      <h2>5. Utilities</h2>
      <p>The Tenant shall be responsible for the payment of the following utilities and services:</p>
      <ul>
        <li>Electricity</li>
        <li>Gas</li>
        <li>Water and sewage</li>
        <li>Internet and cable TV</li>
      </ul>
    `,
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const viewerRef = useRef<HTMLDivElement>(null)
  const [activeTool, setActiveTool] = useState<string>("edit")
  const [isFormatPanelOpen, setIsFormatPanelOpen] = useState(false)
  const [activeToolbarItem, setActiveToolbarItem] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [activeComment, setActiveComment] = useState<Comment | null>(null)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [isRedactPanelOpen, setIsRedactPanelOpen] = useState(false)
  const [isUnderlinePanelOpen, setIsUnderlinePanelOpen] = useState(false)
  const [isHighlightPanelOpen, setIsHighlightPanelOpen] = useState(false)
  const [isImagePanelOpen, setIsImagePanelOpen] = useState(false)
  const [isCutPanelOpen, setIsCutPanelOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [isSignaturePanelOpen, setIsSignaturePanelOpen] = useState(false)
  const [signers, setSigners] = useState<Signer[]>([])
  const [signatureFields, setSignatureFields] = useState<{ label: string }[]>([])
  const [isDrawPanelOpen, setIsDrawPanelOpen] = useState(false)
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [contentPages, setContentPages] = useState<string[]>([])

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
  }

  const updatePageContent = useCallback((pageId: number, newContent: string) => {
    const paginateContent = (content: string): string[] => {
      // Split content at natural break points (headers, paragraphs)
      const sections = content.split(/(?=<h[1-6]|<p>|<ul>|<ol>)/)
      const pages: string[] = [""]
      let currentPage = 0

      sections.forEach((section) => {
        // Create a temporary div to measure content height
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = pages[currentPage] + section
        tempDiv.className = "prose max-w-none"
        document.body.appendChild(tempDiv)

        // Check if content exceeds page height (297mm - margins)
        const contentHeight = tempDiv.offsetHeight
        const maxHeight = (297 - 40) * 3.779528 // Convert mm to px (1mm = 3.779528px)

        document.body.removeChild(tempDiv)

        if (contentHeight > maxHeight && pages[currentPage].length > 0) {
          // Start new page if content exceeds height
          currentPage++
          pages[currentPage] = section
        } else {
          // Add content to current page
          pages[currentPage] += section
        }
      })

      return pages
    }

    const paginatedContent = paginateContent(newContent)

    setPages((prevPages) => {
      // Update the first page content
      const updatedPages = prevPages.map((page, index) =>
        index === 0 ? { ...page, content: paginatedContent[0] } : page,
      )

      // Add or remove overflow pages as needed
      const overflowPages = paginatedContent.slice(1).map((content, index) => ({
        id: Math.max(...prevPages.map((p) => p.id)) + index + 1,
        pageNumber: index + 2,
        rotation: 0,
        backgroundColor: "white",
        content,
      }))

      // Combine original first page with new overflow pages
      const newPages = [...updatedPages.slice(0, 1), ...overflowPages]

      // Update page numbers
      return newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))
    })
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
  }, [setActiveTool, setIsFormatPanelOpen])

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
    setIsRedactPanelOpen((prev) => !prev)
    setIsUnderlinePanelOpen(false)
    setIsHighlightPanelOpen(false)
    setIsImagePanelOpen(false)
    setIsCutPanelOpen(false)
    setIsSignaturePanelOpen(false)
    setIsDrawPanelOpen(false)
  }, [])

  const toggleUnderlinePanel = useCallback(() => {
    setIsUnderlinePanelOpen((prev) => !prev)
    setIsRedactPanelOpen(false)
    setIsHighlightPanelOpen(false)
    setIsImagePanelOpen(false)
    setIsCutPanelOpen(false)
    setIsSignaturePanelOpen(false)
    setIsDrawPanelOpen(false)
  }, [])

  const toggleHighlightPanel = useCallback(() => {
    setIsHighlightPanelOpen((prev) => !prev)
    setIsRedactPanelOpen(false)
    setIsUnderlinePanelOpen(false)
    setIsImagePanelOpen(false)
    setIsCutPanelOpen(false)
    setIsSignaturePanelOpen(false)
    setIsDrawPanelOpen(false)
  }, [])

  const toggleImagePanel = useCallback(() => {
    setIsImagePanelOpen((prev) => !prev)
    setIsRedactPanelOpen(false)
    setIsUnderlinePanelOpen(false)
    setIsHighlightPanelOpen(false)
    setIsCutPanelOpen(false)
    setIsSignaturePanelOpen(false)
    setIsDrawPanelOpen(false)
  }, [])

  const toggleCutPanel = useCallback(() => {
    setIsCutPanelOpen((prev) => !prev)
    setIsRedactPanelOpen(false)
    setIsUnderlinePanelOpen(false)
    setIsHighlightPanelOpen(false)
    setIsImagePanelOpen(false)
    setIsSignaturePanelOpen(false)
    setIsDrawPanelOpen(false)
  }, [])

  const toggleSignaturePanel = useCallback(() => {
    setIsSignaturePanelOpen((prev) => !prev)
    setIsRedactPanelOpen(false)
    setIsUnderlinePanelOpen(false)
    setIsHighlightPanelOpen(false)
    setIsImagePanelOpen(false)
    setIsCutPanelOpen(false)
    setIsDrawPanelOpen(false)
  }, [])

  const toggleDrawPanel = useCallback(() => {
    setIsDrawPanelOpen((prev) => !prev)
    setIsRedactPanelOpen(false)
    setIsUnderlinePanelOpen(false)
    setIsHighlightPanelOpen(false)
    setIsImagePanelOpen(false)
    setIsCutPanelOpen(false)
    setIsSignaturePanelOpen(false)
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
    (pageId: number) => {
      return drawings.find((d) => d.pageId === pageId) || { paths: [], colors: [], lineWidths: [] }
    },
    [drawings],
  )

  const addSignature = useCallback((pageId: number, x: number, y: number, type: "draw" | "type", content: string) => {
    const newSignature: Signature = {
      id: Math.random().toString(36).substr(2, 9),
      pageId,
      x,
      y,
      type,
      content,
    }
    setSignatures((prev) => [...prev, newSignature])
  }, [])

  const removeSignature = useCallback((id: string) => {
    setSignatures((prev) => prev.filter((signature) => signature.id !== id))
  }, [])

  const addSignatureField = useCallback((label: string) => {
    setSignatureFields((prev) => [...prev, { label }])
  }, [])

  const removeSignatureField = useCallback((index: number) => {
    setSignatureFields((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <DocumentContext.Provider
      value={{
        pages,
        currentPage,
        setCurrentPage,
        deletePage,
        copyPage,
        rotatePage,
        movePageToTop,
        movePageToBottom,
        replacePage,
        extractPage,
        insertPage,
        viewerRef,
        activeTool,
        setActiveTool: setActiveToolAndResetFormat,
        updatePageContent,
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
        isRedactPanelOpen,
        isUnderlinePanelOpen,
        isHighlightPanelOpen,
        toggleRedactPanel,
        toggleUnderlinePanel,
        toggleHighlightPanel,
        isImagePanelOpen,
        toggleImagePanel,
        isCutPanelOpen,
        toggleCutPanel,
        activePanel,
        setActivePanel,
        isSignaturePanelOpen,
        toggleSignaturePanel,
        signers,
        setSigners,
        signatureFields,
        setSignatureFields,
        addSignatureField,
        removeSignatureField,
        isDrawPanelOpen,
        toggleDrawPanel,
        drawings,
        addDrawing,
        clearDrawings,
        getDrawingsForPage,
        signatures,
        addSignature,
        removeSignature,
        contentPages,
        setContentPages,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

