"use client"

import DataTable from "../../../../../components/data-table"

const categories = [{ name: "BUSINESS" }, { name: "REAL ESTATE" }, { name: "PERSONAL" }]

export default function CategoriesList() {
  const columns = [{ key: "name", label: "NAME" }]

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

  return (
    <DataTable title="Categories List" columns={columns} data={categories} actions={actions} showPagination={false} />
  )
}

