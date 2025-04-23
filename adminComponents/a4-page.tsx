"use client"

import { PageNumber } from "./page-number"
import { forwardRef } from "react"

export const A4Page = forwardRef(({ children, pageNumber = 1, className = "", ...props }, ref) => {
  return (
    <div className={`a4-page-container ${className}`} {...props} ref={ref}>
      <div className="a4-page">
        {children}
        <PageNumber pageNumber={pageNumber} />
      </div>
    </div>
  )
})

A4Page.displayName = "A4Page"
