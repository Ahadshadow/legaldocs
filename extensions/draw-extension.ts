import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { DrawComponent } from "../components/draw-component"

export interface DrawOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    draw: {
      setDraw: (attributes: { path: string; color: string; strokeWidth: number }) => ReturnType
    }
  }
}

export const Draw = Node.create<DrawOptions>({
  name: "draw",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      path: {
        default: "",
      },
      color: {
        default: "#000000",
      },
      strokeWidth: {
        default: 2,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draw"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "draw" }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawComponent)
  },

  addCommands() {
    return {
      setDraw:
        (attributes) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs: attributes }).run()
        },
    }
  },
})

