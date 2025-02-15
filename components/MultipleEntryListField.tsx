import React, { useState } from 'react'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Plus, Trash } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface MultipleEntryListFieldProps {
    field: {
      uniqueKeyName: string
      questionToAsk: string
      listSubType?: string[]
      placeholder?: string
      list?: { name: string }[]
    }
    value: string[]
    onChange: (value: string[]) => void
  }
  
  export function MultipleEntryListField({ field, value, onChange }: MultipleEntryListFieldProps) {
    const [newEntry, setNewEntry] = useState("")
  
    const handleAddEntry = () => {
      if (newEntry.trim()) {
        onChange([...value, newEntry.trim()])
        setNewEntry("")
      }
    }
  
    const handleRemoveEntry = (index: number) => {
      const newValue = value.filter((_, i) => i !== index)
      onChange(newValue)
    }
  
    const isNameField = field.listSubType && field.listSubType[0] === "name"
    const hasOptions = field.list && field.list.length > 0
  
    if (!isNameField && !hasOptions) {
      return null // Don't render the component if there are no options and it's not a name field
    }
  
    return (
      <div>
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">{field.questionToAsk}</label> */}
        {value.map((entry, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              type="text"
              value={entry}
              onChange={(e) => {
                const newValue = [...value]
                newValue[index] = e.target.value
                onChange(newValue)
              }}
              className="flex-grow"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveEntry(index)} className="ml-2">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(isNameField || hasOptions) && (
          <div className="flex items-center">
            <Input
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder={field.placeholder || "Enter value"}
              className="flex-grow"
            />
            {/* <Button type="button" variant="ghost" size="icon" onClick={handleAddEntry} className="ml-2">
              <Plus className="h-4 w-4" />
            </Button> */}
          </div>
        )}
      </div>
    )
  }
  