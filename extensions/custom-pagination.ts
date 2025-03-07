import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

export const CustomPagination = Extension.create({
  name: "customPagination",

  addProseMirrorPlugins() {
    const key = new PluginKey("customPagination")

    return [
      new Plugin({
        key,
        props: {
          decorations(state) {
            const doc = state.doc
            const decorations: Decoration[] = []
            let height = 0
            const pageHeight = 1056 // A4 height in pixels

            doc.descendants((node, pos) => {
              if (node.isBlock) {
                const nodeHeight = node.nodeSize * 16 // Approximate height based on font size
                if (height + nodeHeight > pageHeight) {
                  decorations.push(
                    Decoration.widget(pos, () => {
                      const pageBreak = document.createElement("div")
                      pageBreak.className = "page-break"
                      return pageBreak
                    }),
                  )
                  height = nodeHeight
                } else {
                  height += nodeHeight
                }
              }
              return true
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

