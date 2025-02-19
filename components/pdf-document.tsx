import type React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

// Move StyleSheet creation here
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
})

interface PDFDocumentProps {
  content: string
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ content }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.text}>{content}</Text>
      </View>
    </Page>
  </Document>
)

export default PDFDocument

