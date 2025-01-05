









"use client"

import { List } from '../../../../../../../components/List'
import { FileText } from 'lucide-react'
import { Button } from "../../../../../../../components/ui/button"

const documents = [
  {
    name: "Lease/Rental Agreement",
    status: "Start E-Sign",
    lastUpdated: "Today",
    owner: "You",
  },
  {
    name: "Employee Non-Disclosure Agreement",
    status: "Draft",
    lastUpdated: "Today",
    owner: "You",
  },
  {
    name: "Employee Non-Disclosure Agreement",
    status: "Start E-Sign", 
    lastUpdated: "Today",
    owner: "You",
  },
  {
    name: "Lease/Rental Agreement",
    status: "Start E-Sign",
    lastUpdated: "Today",
    owner: "You",
  },
]

export default function CompletedPage() {
  const handleView = (document) => {
    console.log("View clicked for", document.name)
  }

  const handleEdit = (document) => {
    console.log("Edit clicked for", document.name)
  }

  const handleDelete = (document) => {
    console.log("Delete clicked for", document.name)
  }

  const columns = [
    {
      name: 'Name',
      render: (document) => (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-gray-500" />
          {document.name}
        </div>
      )
    },
    {
      name: 'E-Sign Status',
      render: (document) => (
        <Button
          variant={document.status === "Draft" ? "outline" : "default"}
          size="sm"
          className={document.status !== "Draft" ? "bg-[#5586FF] text-white" : ""}
        >
          {document.status}
        </Button>
      )
    },
    { name: 'Last Updated', render: (document) => document.lastUpdated },
    { name: 'Owner', render: (document) => document.owner },
    
  ]

  const actions = [
    { label: 'View', onClick: handleView },
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete },
  ]

  return (
    <div>
     
      <List
        items={documents}
        columns={columns}
        actions={actions}
        title={'Completed'}
      />
    </div>
  )
}


