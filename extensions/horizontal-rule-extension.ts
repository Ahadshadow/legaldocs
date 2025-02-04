import { mergeAttributes, Node } from "@tiptap/core"

export interface HorizontalRuleOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    horizontalRule: {
      /**
       * Add a horizontal rule
       */
      setHorizontalRule: () => ReturnType
    }
  }
}

export const CustomHorizontalRule = Node.create<HorizontalRuleOptions>({
  name: "customHorizontalRule",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: "block",

  parseHTML() {
    return [{ tag: "hr" }]
  },

  renderHTML({ HTMLAttributes }) {
    const hrAttributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: "custom-horizontal-rule",
    })

    const cssString = JSON.stringify(HTMLAttributes.style)

    const match = cssString.match(/justify-content:\s*([^";]+)/)

    const justifyContent = match ? match[1].trim() : null

    return ["div", { style: `display: flex; justify-content: ${justifyContent}` }, ["hr", hrAttributes]]
  },

  addCommands() {
    return {
      setHorizontalRule:
        () =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name }).run()
        },
    }
  },

  addAttributes() {
    return {
      width: {
        default: "100%",
        parseHTML: (element) => element.style.width,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return {
            style: `width: ${attributes.width}`,
          }
        },
      },
      thickness: {
        default: "2px",
        parseHTML: (element) => element.style.height,
        renderHTML: (attributes) => {
          if (!attributes.thickness) {
            return {}
          }
          return {
            style: `height: ${attributes.thickness}`,
          }
        },
      },
      color: {
        default: "currentColor",
        parseHTML: (element) => element.style.backgroundColor,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {}
          }
          return {
            style: `background-color: ${attributes.color}`,
          }
        },
      },
      borderRadius: {
        default: "0px",
        parseHTML: (element) => element.style.borderRadius,
        renderHTML: (attributes) => {
          if (!attributes.borderRadius) {
            return {}
          }
          return {
            style: `border-radius: ${attributes.borderRadius}`,
          }
        },
      },
      marginTop: {
        default: "1em",
        parseHTML: (element) => element.style.marginTop,
        renderHTML: (attributes) => {
          if (!attributes.marginTop) {
            return {}
          }
          return {
            style: `margin-top: ${attributes.marginTop}`,
          }
        },
      },
      marginBottom: {
        default: "1em",
        parseHTML: (element) => element.style.marginBottom,
        renderHTML: (attributes) => {
          if (!attributes.marginBottom) {
            return {}
          }
          return {
            style: `margin-bottom: ${attributes.marginBottom}`,
          }
        },
      },
      justifyContent: {
        default: "center",
        parseHTML: (element) => element.style.justifyContent,
        renderHTML: (attributes) => {
            
          if (!attributes.justifyContent) {
            return {}
          }
          return {
            style: `justify-content: ${attributes.justifyContent}`,
          }
        },
      },
    }
  },
})

