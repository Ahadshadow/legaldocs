// import { createContext, useContext, useCallback, useState, useMemo } from "react"
// import { nanoid } from "nanoid"

// interface Page {
//   id: string
//   content: string
// }

// interface DocumentContextType {
//   pages: Page[]
//   addPage: () => void
//   updatePageContent: (id: string, content: string) => void
//   deletePage: (id: string) => void
//   movePage: (id: string, newIndex: number) => void
// }

// const DocumentContext = createContext<DocumentContextType | null>(null)

// export const useDocumentContext = () => {
//   const context = useContext(DocumentContext)
//   if (context === null) {
//     throw new Error("useDocumentContext must be used within a DocumentProvider")
//   }
//   return context
// }

// export const DocumentProvider: React.FC = ({ children }) => {
//   const [pages, setPages] = useState<Page[]>([{ id: nanoid(), content: "Page 1" }])

//   const addPage = useCallback(() => {
//     setPages((prevPages) => [...prevPages, { id: nanoid(), content: `Page ${prevPages.length + 1}` }])
//   }, [])

//   const updatePageContent = useCallback((id: string, content: string) => {
//     setPages((prevPages) => prevPages.map((page) => (page.id === id ? { ...page, content } : page)))
//   }, [])

//   const deletePage = useCallback((id: string) => {
//     setPages((prevPages) => prevPages.filter((page) => page.id !== id))
//   }, [])

//   const movePage = useCallback(
//     (id: string, newIndex: number) => {
//       const oldIndex = pages.findIndex((page) => page.id === id)
//       if (oldIndex === -1) return
// // 
//       setPages((prevPages) => {
//         const newPages = [...prevPages]
//         const [removed] = newPages.splice(oldIndex, 1)
//         newPages.splice(newIndex, 0, removed)
//         return newPages
//       })
//     },
//     [pages],
//   )

//   const value = useMemo(
//     () => ({ pages, addPage, updatePageContent, deletePage, movePage }),
//     [pages, addPage, updatePageContent, deletePage, movePage],
//   )

//   return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
// }

