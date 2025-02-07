import type React from "react"
import { useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

interface SignatureLabelInputProps {
  onLabelChange: (label: string) => void
}

export function SignatureLabelInput({ onLabelChange }: SignatureLabelInputProps) {
  const [label, setLabel] = useState("Tenant")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLabelChange(label)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter signature label"
        className="flex-grow"
      />
      <Button type="submit">Set Label</Button>
    </form>
  )
}

