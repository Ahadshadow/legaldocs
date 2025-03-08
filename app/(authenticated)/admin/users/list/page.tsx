"use client"

import DataTable from "../../../../../components/data-table"

const users = [
  {
    name: "Test User",
    email: "test@example.com",
    phone: "N/A",
    type: "Admin",
  },
  {
    name: "Abdulahad Tahir",
    email: "abdulahadtahir433@gmail.com",
    phone: "+923044688919",
    type: "User",
  },
  {
    name: "ahad 2",
    email: "sahdowahad@gmail.com",
    phone: "03044688919",
    type: "User",
  },
  {
    name: "Masub Ghazali",
    email: "masubghazali26@gmail.com",
    phone: "+923245658644",
    type: "User",
  },
  {
    name: "Andrej kutnar",
    email: "andro822@gmail.com",
    phone: "+386",
    type: "User",
  },
]

export default function UsersList() {
  const columns = [
    { key: "name", label: "NAME" },
    { key: "email", label: "EMAIL" },
    { key: "phone", label: "PHONE" },
    { key: "type", label: "TYPE" },
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

  return <DataTable title="Users List" columns={columns} data={users} actions={actions} />
}

