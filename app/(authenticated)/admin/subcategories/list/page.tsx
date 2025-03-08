"use client"

import DataTable from "../../../../../components/data-table"

const subcategories = [
  { name: "Corporate Filings", category: "BUSINESS" },
  { name: "Employees / Contractors", category: "BUSINESS" },
  { name: "Customers", category: "BUSINESS" },
  { name: "Suppliers & Partners", category: "BUSINESS" },
  { name: "Internet", category: "BUSINESS" },
  { name: "Mergers & Acquisitions", category: "BUSINESS" },
  { name: "Property Management", category: "BUSINESS" },
  { name: "Litigation", category: "BUSINESS" },
  { name: "Tax Forms", category: "BUSINESS" },
  { name: "Operations", category: "BUSINESS" },
]

export default function SubcategoriesList() {
  const columns = [
    { key: "name", label: "NAME" },
    { key: "category", label: "CATEGORY" },
  ]

  const actions = [
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

  return <DataTable title="Subcategories List" columns={columns} data={subcategories} actions={actions} />
}

