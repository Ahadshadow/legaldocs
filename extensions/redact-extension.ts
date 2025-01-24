import { Extension } from '@tiptap/core'
import '@tiptap/extension-text-style'

export interface RedactOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    redact: {
      /**
       * Set a redaction mark
       */
      setRedact: () => ReturnType
      /**
       * Toggle a redaction mark
       */
      toggleRedact: () => ReturnType
      /**
       * Unset a redaction mark
       */
      unsetRedact: () => ReturnType
    }
  }
}

export const Redact = Extension.create<RedactOptions>({
  name: 'redact',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      class: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.class) {
            return {}
          }

          return {
            class: attributes.class
          }
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          redacted: {
            default: false,
            parseHTML: element => element.hasAttribute('data-redacted'),
            renderHTML: attributes => {
              if (!attributes.redacted) {
                return {}
              }

              return {
                'data-redacted': '',
                style: 'background-color: black; color: black;'
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setRedact: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { redacted: true })
          .run()
      },
      toggleRedact: () => ({ chain }) => {
        return chain()
          .toggleMark('textStyle', { redacted: true })
          .run()
      },
      unsetRedact: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { redacted: false })
          .run()
      },
    }
  },
})

