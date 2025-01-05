import { FileText, Clock, Share2, FileSignature, Users, Trash2, CheckCircle, Clock4, XCircle, FileDown, Ban } from 'lucide-react'

export const routes = [
  {
    name: "My Documents",
    href: "app/dasboard/documents",
    icon: FileText,
  },
  {
    name: "Recent",
    href: "/app/dashboard/documents/recent",
    icon: Clock,
  },
  {
    name: "Shared With Me",
    href: "/app/dashboard/documents/shared",
    icon: Share2,
  },
  {
    name: "E-Sign Status",
    href: "/app/dashboard/documents/sign",
    icon: FileSignature,
    children: [
      {
        name: "Actions Required",
        href: "/app/dashboard/documents/sign/actions-required",
        icon: Clock4,
      },
      {
        name: "Waiting for Others",
        href: "/app/dashboard/documents/sign/waiting",
        icon: Clock,
      },
      {
        name: "Completed",
        href: "/app/dashboard/documents/sign/completed",
        icon: CheckCircle,
      },
      {
        name: "Draft",
        href: "/app/dashboard/documents/sign/draft",
        icon: FileDown,
      },
      {
        name: "Cancelled",
        href: "/app/dashboard/documents/sign/cancelled",
        icon: XCircle,
      },
      {
        name: "Declined",
        href: "/app/dashboard/documents/sign/declined",
        icon: Ban,
      },
    ],
  },
  {
    name: "Users & Access",
    href: "/app/dashboard/documents/users",
    icon: Users,
  },
  {
    name: "Trash",
    href: "/app/dashboard/documents/trash",
    icon: Trash2,
  },
]

