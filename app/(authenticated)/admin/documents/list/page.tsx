"use client"

import DataTable, { type Column } from "../../../../../components/data-table"

const documents = [
  { name: "Personal Injury/ Insurance Payment Demand Letter", description: "", subCategories: "No Sub-Categories" },
  { name: "Business Proposal", description: "", subCategories: "No Sub-Categories" },
  { name: "Invoice", description: "", subCategories: "No Sub-Categories" },
  { name: "Letter of Intent for General Property Purchase", description: "", subCategories: "No Sub-Categories" },
  { name: "Vehicle Power of Attorney", description: "", subCategories: "No Sub-Categories" },
  { name: "Cease and Desist – Harassment", description: "", subCategories: "No Sub-Categories" },
  { name: "Cease and Desist – Defamation", description: "", subCategories: "No Sub-Categories" },
  { name: "Photo Licensing (License) Agreement", description: "", subCategories: "No Sub-Categories" },
  { name: "Photo Release Form", description: "", subCategories: "No Sub-Categories" },
  { name: "Affidavit of Paternity", description: "", subCategories: "No Sub-Categories" },
]

export default function DocumentsList() {
  const columns: Column[] = [
    { key: "name", label: "NAME" },
    { key: "description", label: "DESCRIPTION" },
    {
      key: "subCategories",
      label: "SUB-CATEGORIES",
      render: (value) => <span className="italic text-muted-foreground">{value}</span>,
    },
  ]

  const actions = [
    {
      label: "Show",
      color: "cyan",
      onClick: (item: any) => console.log("Show", item),
    },
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) => console.log("Edit", item),
    },
    {
      label: "Delete",
      color: "red",
      onClick: (item: any) => console.log("Delete", item),
    },
  ]

  return <DataTable title="Documents List" columns={columns} data={documents} actions={actions} />
}

