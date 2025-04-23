import { LightbulbIcon } from "lucide-react"
import type { ReactNode } from "react"

interface InfoCardProps {
  title: string
  content: ReactNode
  icon?: ReactNode
}

export default function InfoCard({ title, content, icon = <LightbulbIcon className="h-5 w-5" /> }: InfoCardProps) {
  return (
    <div className="bg-slate-50 p-6 rounded-lg max-w-md">
      <div className="flex items-start gap-3">
        <div className="text-slate-500 mt-1 ">{icon}</div>
        <div>
          <p className="text-slate-800 font-bold mb-1">{title}</p>
          <div className="text-slate-600 text-sm mt-1">{content}</div>
        </div>
      </div>
    </div>
  )
}
