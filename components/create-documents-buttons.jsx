'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "./ui/button"

export function CreateDocumentButton({ className, fullWidth = false, ...props }) {
  const router = useRouter()

  const handleClick = () => {
    router.push('/app/pdf-builder/documents')
  }

  return (
    <Button 
      onClick={handleClick}
      className={`
        ${fullWidth ? 'w-full' : ''}
        h-[52px] 
        px-8 
        text-base 
        bg-[#4b62f9] 
        hover:bg-[#3a4fd7] 
        transition-colors
        ${className || ''}
      `.trim()}
      {...props}
    >
      Create Document
    </Button>
  )
}
