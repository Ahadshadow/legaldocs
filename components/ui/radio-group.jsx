'use client'

import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

const RadioGroupContext = createContext()

const RadioGroup = React.forwardRef(({ className, defaultValue, onValueChange, children, ...props }, ref) => {
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = (newValue) => {
    setValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { value: groupValue, onValueChange } = useContext(RadioGroupContext)
  const checked = value === groupValue

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        ref={ref}
        className={cn(
          'h-4 w-4 rounded-full border border-gray-300 text-[#5586ff] focus:outline-none focus:ring-2 focus:ring-[#5586ff] focus:ring-offset-2',
          checked && 'bg-[#5586ff]',
          className
        )}
        checked={checked}
        onChange={() => onValueChange(value)}
        {...props}
      />
      <span className="text-sm leading-none">{children}</span>
    </label>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }

