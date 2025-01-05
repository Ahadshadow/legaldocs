import { DocumentsHeader } from "../../../../../../components/dashboard"

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full">
      <DocumentsHeader />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Users & Access</h1>
        {/* Add content for users and access management here */}
      </div>
    </div>
  )
}

