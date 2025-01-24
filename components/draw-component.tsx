import { NodeViewWrapper } from "@tiptap/react"
import React from "react"

interface DrawComponentProps {
  node: {
    attrs: {
      path: string
      color: string
      strokeWidth: number
    }
  }
}

export function DrawComponent({ node }: DrawComponentProps) {
  return (
    <NodeViewWrapper className="draw-component">
      <svg
        className="w-full h-full"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        <path d={node.attrs.path} stroke={node.attrs.color} strokeWidth={node.attrs.strokeWidth} fill="none" />
      </svg>
    </NodeViewWrapper>
  )
}

