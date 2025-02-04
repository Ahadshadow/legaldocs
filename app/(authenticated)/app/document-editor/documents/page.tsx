"use client"

import { useSearchParams } from "next/navigation"
import { DocumentHeader } from "../../../../../components/document-header"
import { DocumentSidebar } from "../../../../../components/document-sidebar"
import { DocumentToolbar } from "../../../../../components/document-toolbar"
import { DocumentViewer } from "../../../../../components/document-viewer"
import { DocumentProvider } from "../../../../../components/context/document-context"
import { useEffect, useState } from "react"
import { SC } from "../../../../../service/Api/serverCall"

export default function DocumentPage() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get("submissionId")
    const [documentsData,  setDocumentsData] = useState(null)
  

  if (!submissionId) {
    return <div>Error: No submission ID provided</div>
  }


  useEffect(() => {
        const fetchSubmissions = async () => {
          try {
            const response = await SC.getCall({ url: `submissions/${submissionId}` })
            if (response.status) {
              setDocumentsData(response?.data.document?.document_data)
              
            } else {
              throw new Error( "Failed to fetch submissions")
            }
          } catch (error) {
            console.error("Error fetching submissions:", error)
          } finally {
          }
        }
    
        fetchSubmissions()
      }, [])

  if(documentsData === null ) return null

  return (
    <DocumentProvider documentsData={documentsData}>
      <div className="h-screen flex flex-col">
        <DocumentHeader />
        <div className="flex-1 flex overflow-hidden">
          <DocumentSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DocumentToolbar />
            <DocumentViewer />
          </div>
        </div>
      </div>
    </DocumentProvider>
  )
}

