import { DocumentHeader } from "../../../../../components/document-header"
import { DocumentSidebar } from "../../../../../components/document-sidebar"
import { DocumentToolbar } from "../../../../../components/document-toolbar"
import { DocumentViewer } from "../../../../../components/document-viewer"
import { DocumentProvider } from "../../../../../components/context/document-context"

export default function DocumentPage() {
  return (
    <DocumentProvider>
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

