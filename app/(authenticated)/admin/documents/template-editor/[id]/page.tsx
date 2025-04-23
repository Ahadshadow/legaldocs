"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { FormBuilder } from "../../../../../../adminComponents/form-builder"
import { DocumentEditor } from "../../../../../../adminComponents/document-editor"
import { Button } from "../../../../../../adminComponents/ui/button"
import { Download, Save, Loader2 } from "lucide-react"
import { useToast } from "../../../../../../adminComponents/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../adminComponents/ui/tabs"
import { DocumentPreview } from "../../../../../../adminComponents/document-preview"
import { Alert, AlertDescription, AlertTitle } from "../../../../../../adminComponents/ui/alert"

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const templateId = params?.id as string

  // State for form structure and document content
  const [formStructure, setFormStructure] = useState({
    steps: [
      {
        name: "Contract Basics",
        FAQQuestion: "What information is needed for the contract basics?",
        FAQAnswer: "You'll need to provide the contract type, effective date, and parties involved.",
        subsections: [
          {
            name: "Contract Type",
            FAQQuestion: "What types of contracts can I create?",
            FAQAnswer: "You can create service agreements, employment contracts, or sales contracts.",
            question: [
              {
                id: "question_1",
                uniqueKeyName: "contract_type",
                questionToAsk: "What type of contract is this?",
                type: "radioButton",
                isRequired: true,
                placeholder: "Select contract type",
                selectionValue: "text",
                list: [
                  { name: "Service Agreement" },
                  { name: "Employment Contract" },
                  { name: "Sales Contract" }
                ],
                affectedQuestion: [
                  {
                    id: "question_4",
                    value: ["Service Agreement"]
                  },
                  {
                    id: "question_5",
                    value: ["Employment Contract"]
                  },
                  {
                    id: "question_6",
                    value: ["Sales Contract"]
                  }
                ]
              },
              {
                id: "question_2",
                uniqueKeyName: "effective_date",
                questionToAsk: "What is the effective date of this contract?",
                type: "textField",
                isRequired: true,
                placeholder: "MM/DD/YYYY",
                selectionValue: "date"
              },
              {
                id: "question_3",
                uniqueKeyName: "contract_duration",
                questionToAsk: "What is the duration of this contract?",
                type: "dropdownList",
                isRequired: true,
                placeholder: "Select duration",
                list: [
                  { name: "6 months" },
                  { name: "1 year" },
                  { name: "2 years" },
                  { name: "3 years" },
                  { name: "5 years" },
                  { name: "Indefinite" }
                ],
                affectedQuestion: [
                  {
                    id: "question_7",
                    value: ["Indefinite"]
                  }
                ]
              }
            ]
          },
          {
            name: "Service Details",
            FAQQuestion: "What service details are required?",
            FAQAnswer: "You'll need to specify the service scope, deliverables, and timeline.",
            question: [
              {
                id: "question_4",
                uniqueKeyName: "service_scope",
                questionToAsk: "What is the scope of services?",
                type: "textField",
                isRequired: true,
                placeholder: "Describe the services to be provided",
                selectionValue: "text"
              }
            ]
          },
          {
            name: "Employment Details",
            FAQQuestion: "What employment details are required?",
            FAQAnswer: "You'll need to specify the position, salary, and benefits.",
            question: [
              {
                id: "question_5",
                uniqueKeyName: "position_title",
                questionToAsk: "What is the position title?",
                type: "textField",
                isRequired: true,
                placeholder: "Enter position title",
                selectionValue: "text"
              }
            ]
          },
          {
            name: "Sales Details",
            FAQQuestion: "What sales details are required?",
            FAQAnswer: "You'll need to specify the product, quantity, and price.",
            question: [
              {
                id: "question_6",
                uniqueKeyName: "product_description",
                questionToAsk: "What is the product or service being sold?",
                type: "textField",
                isRequired: true,
                placeholder: "Describe the product or service",
                selectionValue: "text"
              }
            ]
          }
        ]
      },
      {
        name: "Parties Information",
        FAQQuestion: "What information is needed about the parties?",
        FAQAnswer: "You'll need to provide details about both parties involved in the contract.",
        subsections: [
          {
            name: "First Party",
            FAQQuestion: "What information is needed for the first party?",
            FAQAnswer: "You'll need to provide the name, address, and contact information.",
            question: [
              {
                id: "question_8",
                uniqueKeyName: "party1_name",
                questionToAsk: "What is the name of the first party?",
                type: "textField",
                isRequired: true,
                placeholder: "Enter name",
                selectionValue: "text"
              },
              {
                id: "question_9",
                uniqueKeyName: "party1_type",
                questionToAsk: "What type of entity is the first party?",
                type: "radioButton",
                isRequired: true,
                placeholder: "Select entity type",
                list: [
                  { name: "Individual" },
                  { name: "Corporation" },
                  { name: "LLC" },
                  { name: "Partnership" }
                ],
                affectedQuestion: [
                  {
                    id: "question_10",
                    value: ["Corporation", "LLC", "Partnership"]
                  }
                ]
              },
              {
                id: "question_10",
                uniqueKeyName: "party1_representative",
                questionToAsk: "Who is the authorized representative?",
                type: "textField",
                isRequired: true,
                placeholder: "Enter representative name",
                selectionValue: "text"
              }
            ]
          },
          {
            name: "Second Party",
            FAQQuestion: "What information is needed for the second party?",
            FAQAnswer: "You'll need to provide the name, address, and contact information.",
            question: [
              {
                id: "question_11",
                uniqueKeyName: "party2_name",
                questionToAsk: "What is the name of the second party?",
                type: "textField",
                isRequired: true,
                placeholder: "Enter name",
                selectionValue: "text"
              },
              {
                id: "question_12",
                uniqueKeyName: "party2_type",
                questionToAsk: "What type of entity is the second party?",
                type: "radioButton",
                isRequired: true,
                placeholder: "Select entity type",
                list: [
                  { name: "Individual" },
                  { name: "Corporation" },
                  { name: "LLC" },
                  { name: "Partnership" }
                ],
                affectedQuestion: [
                  {
                    id: "question_13",
                    value: ["Corporation", "LLC", "Partnership"]
                  }
                ]
              },
              {
                id: "question_13",
                uniqueKeyName: "party2_representative",
                questionToAsk: "Who is the authorized representative?",
                type: "textField",
                isRequired: true,
                placeholder: "Enter representative name",
                selectionValue: "text"
              }
            ]
          }
        ]
      },
      {
        name: "Payment Terms",
        FAQQuestion: "What payment terms can be specified?",
        FAQAnswer: "You can specify payment amount, schedule, and method.",
        subsections: [
          {
            name: "Payment Details",
            FAQQuestion: "What payment details are required?",
            FAQAnswer: "You'll need to specify the payment amount, schedule, and method.",
            question: [
              {
                id: "question_14",
                uniqueKeyName: "payment_amount",
                questionToAsk: "What is the payment amount?",
                type: "textField",
                isRequired: true,
                placeholder: "Enter amount",
                selectionValue: "number"
              },
              {
                id: "question_15",
                uniqueKeyName: "payment_currency",
                questionToAsk: "What currency will be used?",
                type: "dropdownList",
                isRequired: true,
                placeholder: "Select currency",
                list: [
                  { name: "USD" },
                  { name: "EUR" },
                  { name: "GBP" },
                  { name: "CAD" },
                  { name: "AUD" }
                ]
              },
              {
                id: "question_16",
                uniqueKeyName: "payment_schedule",
                questionToAsk: "What is the payment schedule?",
                type: "radioButton",
                isRequired: true,
                placeholder: "Select payment schedule",
                list: [
                  { name: "One-time payment" },
                  { name: "Monthly" },
                  { name: "Quarterly" },
                  { name: "Annually" },
                  { name: "Custom schedule" }
                ],
                affectedQuestion: [
                  {
                    id: "question_17",
                    value: ["Custom schedule"]
                  }
                ]
              },
              {
                id: "question_17",
                uniqueKeyName: "custom_payment_details",
                questionToAsk: "Describe the custom payment schedule",
                type: "textField",
                isRequired: true,
                placeholder: "Enter custom payment details",
                selectionValue: "text"
              }
            ]
          }
        ]
      },
      {
        name: "Termination",
        FAQQuestion: "What termination terms can be specified?",
        FAQAnswer: "You can specify termination conditions, notice period, and consequences.",
        subsections: [
          {
            name: "Termination Conditions",
            FAQQuestion: "What termination conditions can be specified?",
            FAQAnswer: "You can specify early termination options and notice periods.",
            question: [
              {
                id: "question_7",
                uniqueKeyName: "termination_clause",
                questionToAsk: "Should the contract include an early termination clause?",
                type: "radioButton",
                isRequired: true,
                placeholder: "Select option",
                list: [
                  { name: "Yes" },
                  { name: "No" }
                ],
                affectedQuestion: [
                  {
                    id: "question_18",
                    value: ["Yes"]
                  }
                ]
              },
              {
                id: "question_18",
                uniqueKeyName: "notice_period",
                questionToAsk: "What is the notice period for early termination?",
                type: "dropdownList",
                isRequired: true,
                placeholder: "Select notice period",
                list: [
                  { name: "7 days" },
                  { name: "14 days" },
                  { name: "30 days" },
                  { name: "60 days" },
                  { name: "90 days" }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Dispute Resolution",
        FAQQuestion: "What dispute resolution methods can be specified?",
        FAQAnswer: "You can specify mediation, arbitration, or litigation.",
        subsections: [
          {
            name: "Resolution Method",
            FAQQuestion: "What dispute resolution methods can be specified?",
            FAQAnswer: "You can specify mediation, arbitration, or litigation.",
            question: [
              {
                id: "question_19",
                uniqueKeyName: "dispute_resolution",
                questionToAsk: "How should disputes be resolved?",
                type: "radioButton",
                isRequired: true,
                placeholder: "Select resolution method",
                list: [
                  { name: "Mediation" },
                  { name: "Arbitration" },
                  { name: "Litigation" }
                ],
                affectedQuestion: [
                  {
                    id: "question_20",
                    value: ["Arbitration"]
                  }
                ]
              },
              {
                id: "question_20",
                uniqueKeyName: "arbitration_org",
                questionToAsk: "Which arbitration organization should be used?",
                type: "dropdownList",
                isRequired: true,
                placeholder: "Select arbitration organization",
                list: [
                  { name: "American Arbitration Association" },
                  { name: "JAMS" },
                  { name: "International Chamber of Commerce" },
                  { name: "Other" }
                ],
                affectedQuestion: [
                  {
                    id: "question_21",
                    value: ["Other"]
                  }
                ]
              },
              {
                id: "question_21",
                uniqueKeyName: "other_arbitration_org",
                questionToAsk: "Specify the other arbitration organization",
                type: "textField",
                isRequired: true,
                placeholder: "Enter organization name",
                selectionValue: "text"
              }
            ]
          }
        ]
      }
    ],
  })

  const [documentContent, setDocumentContent] = useState(`<h1>LEGAL CONTRACT</h1>

<p>This {{% contract_type | input | underscore %}} (the "Agreement") is made and entered into as of {{% effective_date | input | underscore %}} (the "Effective Date"), by and between:</p>

<p><strong>{{% party1_name | input | underscore %}}</strong>, a 
{% if party1_type == "Individual" %}
an individual
{% endif %}
{% if party1_type == "Corporation" %}
corporation organized under the laws of [State/Country], represented by {{% party1_representative | input | underscore %}}
{% endif %}
{% if party1_type == "LLC" %}
limited liability company organized under the laws of [State/Country], represented by {{% party1_representative | input | underscore %}}
{% endif %}
{% if party1_type == "Partnership" %}
partnership organized under the laws of [State/Country], represented by {{% party1_representative | input | underscore %}}
{% endif %}
 (hereinafter referred to as the "First Party"),</p>

<p>and</p>

<p><strong>{{% party2_name | input | underscore %}}</strong>, a 
{% if party2_type == "Individual" %}
an individual
{% endif %}
{% if party2_type == "Corporation" %}
corporation organized under the laws of [State/Country], represented by {{% party2_representative | input | underscore %}}
{% endif %}
{% if party2_type == "LLC" %}
limited liability company organized under the laws of [State/Country], represented by {{% party2_representative | input | underscore %}}
{% endif %}
{% if party2_type == "Partnership" %}
partnership organized under the laws of [State/Country], represented by {{% party2_representative | input | underscore %}}
{% endif %}
 (hereinafter referred to as the "Second Party").</p>

<p>The First Party and Second Party may be individually referred to as a "Party" and collectively as the "Parties."</p>

<h2>1. TERM</h2>

<p>This Agreement shall commence on the Effective Date and shall continue for a period of {{% contract_duration | input | underscore %}}, unless earlier terminated as provided herein.</p>

{% if termination_clause == "Yes" %}
<h2>2. TERMINATION</h2>

<p>Either Party may terminate this Agreement prior to its expiration by providing written notice to the other Party at least {{% notice_period | input | underscore %}} in advance of the intended termination date.</p>
{% endif %}

{% if contract_type == "Service Agreement" %}
<h2>3. SERVICES</h2>

<p>The First Party agrees to provide the following services to the Second Party:</p>

<p>{{% service_scope | input | underscore %}}</p>
{% endif %}

{% if contract_type == "Employment Contract" %}
<h2>3. EMPLOYMENT</h2>

<p>The First Party agrees to employ the Second Party in the position of {{% position_title | input | underscore %}}.</p>
{% endif %}

{% if contract_type == "Sales Contract" %}
<h2>3. SALE OF GOODS</h2>

<p>The First Party agrees to sell to the Second Party the following products:</p>

<p>{{% product_description | input | underscore %}}</p>
{% endif %}

<h2>4. PAYMENT</h2>

<p>The Second Party shall pay the First Party the amount of {{% payment_amount | input | underscore %}} {{% payment_currency | input | underscore %}} according to the following schedule:</p>

{% if payment_schedule == "One-time payment" %}
<p>Full payment shall be made within 30 days of the Effective Date.</p>
{% endif %}

{% if payment_schedule == "Monthly" %}
<p>Payment shall be made in equal monthly installments, due on the first day of each month.</p>
{% endif %}

{% if payment_schedule == "Quarterly" %}
<p>Payment shall be made in equal quarterly installments, due on the first day of each quarter.</p>
{% endif %}

{% if payment_schedule == "Annually" %}
<p>Payment shall be made in equal annual installments, due on the anniversary of the Effective Date.</p>
{% endif %}

{% if payment_schedule == "Custom schedule" %}
<p>{{% custom_payment_details | input | underscore %}}</p>
{% endif %}

<h2>5. DISPUTE RESOLUTION</h2>

{% if dispute_resolution == "Mediation" %}
<p>Any dispute arising out of or relating to this Agreement shall be resolved through mediation. The Parties agree to attempt in good faith to resolve any dispute through negotiation between the Parties. If the dispute cannot be resolved through negotiation, the Parties agree to engage a mutually agreed upon mediator.</p>
{% endif %}

{% if dispute_resolution == "Arbitration" %}
<p>Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration administered by 
{% if arbitration_org == "Other" %}
{{% other_arbitration_org | input | underscore %}}
{% else %}
the {{% arbitration_org | input | underscore %}}
{% endif %}
 in accordance with its applicable rules. The arbitration shall take place in [City, State/Country], and the language of the arbitration shall be English. The decision of the arbitrator shall be final and binding on the Parties.</p>
{% endif %}

{% if dispute_resolution == "Litigation" %}
<p>Any dispute arising out of or relating to this Agreement shall be resolved through litigation in the courts of [Jurisdiction]. The Parties consent to the exclusive jurisdiction of such courts for the resolution of any such dispute.</p>
{% endif %}

<h2>6. GOVERNING LAW</h2>

<p>This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], without giving effect to any choice of law or conflict of law provisions.</p>

<h2>7. ENTIRE AGREEMENT</h2>

<p>This Agreement constitutes the entire understanding between the Parties concerning the subject matter hereof and supersedes all prior agreements, understandings, or negotiations.</p>

<h2>8. SIGNATURES</h2>

<p>IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the Effective Date.</p>

<p>
<strong>First Party:</strong><br>
{{% party1_name | input | underscore %}}<br>
{% if party1_type != "Individual" %}
By: {{% party1_representative | input | underscore %}}<br>
Title: ___________________<br>
{% endif %}
Date: ___________________<br>
Signature: ___________________
</p>

<p>
<strong>Second Party:</strong><br>
{{% party2_name | input | underscore %}}<br>
{% if party2_type != "Individual" %}
By: {{% party2_representative | input | underscore %}}<br>
Title: ___________________<br>
{% endif %}
Date: ___________________<br>
Signature: ___________________
</p>`)
  const [formData, setFormData] = useState({})
  const [editorInstance, setEditorInstance] = useState(null)

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)

  // Function to generate a field key from a question text
  const generateFieldKey = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
  }

  // Function to add a field to the document content
  const addFieldToDocument = (fieldKey, fieldType = "input", cursorPosition = null) => {
    // Check if the field already exists in the document
    const fieldRegex = new RegExp(`\\{\\{%\\s*${fieldKey}\\s*\\|[^}]*%\\}\\}`, "g")
    const fieldExists = fieldRegex.test(documentContent)

    // If the field exists and no cursor position is provided, don't add a duplicate
    if (fieldExists && cursorPosition === null) {
      return
    }

    if (editorInstance && cursorPosition !== null) {
      // Format: {{% field_name | input | underscore %}}
      const fieldFormat = `{{% ${fieldKey} | ${fieldType} | underscore %}}`

      // Insert at cursor position without line breaks
      const { state } = editorInstance
      const { tr } = state
      tr.insertText(fieldFormat, cursorPosition)
      editorInstance.view.dispatch(tr)
    } else {
      // Fallback if no cursor position or editor instance
      setDocumentContent((prevContent) => {
        return prevContent + `{{% ${fieldKey} | ${fieldType} | underscore %}}`
      })
    }
  }

  // Function to remove a field from the document content
  const removeFieldFromDocument = (fieldKey) => {
    setDocumentContent((prevContent) => {
      // Remove field references with the exact format
      const fieldRegex = new RegExp(`\\{\\{%\\s*${fieldKey}\\s*\\|[^}]*%\\}\\}`, "g")
      let newContent = prevContent.replace(fieldRegex, "")

      // Remove conditional blocks that reference this field
      const conditionalRegex = new RegExp(`\\{%\\s*if\\s+${fieldKey}\\s*.*?%\\}.*?\\{%\\s*endif\\s*%\\}`, "gs")
      newContent = newContent.replace(conditionalRegex, "")

      // Update the editor immediately if it exists
      if (editorInstance) {
        setTimeout(() => {
          editorInstance.commands.setContent(newContent)
        }, 10)
      }

      return newContent
    })
  }

  // Function to add conditional content to the document
  const addConditionalToDocument = (fieldKey, condition, value, content, cursorPosition = null) => {
    if (editorInstance && cursorPosition !== null) {
      // Format: {% if field_name == "value" %}content{% endif %}
      const conditionalFormat = `{% if ${fieldKey} ${condition} "${value}" %}${content}{% endif %}`

      // Insert at cursor position without line breaks
      const { state } = editorInstance
      const { tr } = state
      tr.insertText(conditionalFormat, cursorPosition)
      editorInstance.view.dispatch(tr)
    } else {
      // Fallback if no cursor position or editor instance
      setDocumentContent((prevContent) => {
        return prevContent + `{% if ${fieldKey} ${condition} "${value}" %}${content}{% endif %}`
      })
    }
  }

  // Fetch template data on component mount
  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get(`/api/templates/${templateId}`)

        if (response.data) {
          setFormStructure(response.data.formStructure || formStructure)
          setDocumentContent(response.data.documentContent || "")
          setIsNewTemplate(false)
        } else {
          // If no data found, we're creating a new template
          setIsNewTemplate(true)
          toast({
            title: "Creating new template",
            description: "No existing template found. You're creating a new one.",
          })
        }
      } catch (err) {
        console.error("Error fetching template:", err)
        setError("Failed to load template. Creating a new one.")
        setIsNewTemplate(true)
      } finally {
        setIsLoading(false)
      }
    }

    // fetchTemplateData()
  }, [templateId, toast])

  // Save or update template
  const handleSaveTemplate = async () => {
    setIsSaving(true)
    setError(null)

    const templateData = {
      id: templateId,
      formStructure,
      documentContent,
    }

    try {
      // Use the same endpoint for both create and update
      const response = await axios.post(`/api/templates/${templateId}`, templateData)

      toast({
        title: isNewTemplate ? "Template created" : "Template updated",
        description: "Your template has been saved successfully.",
      })

      // If this was a new template, update the state
      if (isNewTemplate) {
        setIsNewTemplate(false)
      }

      // Save to local storage as backup
      localStorage.setItem(
        "templateBuilderData",
        JSON.stringify({
          formStructure,
          documentContent,
        }),
      )

      return response.data
    } catch (err) {
      console.error("Error saving template:", err)
      setError("Failed to save template. Please try again.")

      toast({
        title: "Error saving template",
        description: "There was a problem saving your template. Please try again.",
        variant: "destructive",
      })

      return null
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const exportData = {
      formStructure,
      documentContent,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document-template-${templateId || "new"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Load saved data from local storage if available and no template ID
  useEffect(() => {
    if (!templateId) {
      const savedData = localStorage.getItem("templateBuilderData")
      if (savedData) {
        try {
          const { formStructure: savedFormStructure, documentContent: savedDocumentContent } = JSON.parse(savedData)
          setFormStructure(savedFormStructure)
          setDocumentContent(savedDocumentContent)
        } catch (error) {
          console.error("Error loading saved data:", error)
        }
      }
    }
  }, [templateId])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar with form builder */}
      <div className="w-[350px] border-r bg-background overflow-y-auto">
        {/* <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Form Builder</h2>
          <p className="text-sm text-muted-foreground">{isNewTemplate ? "Create a new template" : "Edit template"}</p>
        </div> */}
        <FormBuilder
          formStructure={formStructure}
          setFormStructure={setFormStructure}
          generateFieldKey={generateFieldKey}
          addFieldToDocument={addFieldToDocument}
          removeFieldFromDocument={removeFieldFromDocument}
          addConditionalToDocument={addConditionalToDocument}
          documentContent={documentContent}
          setDocumentContent={setDocumentContent}
          editorInstance={editorInstance}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Document Template Builder</h1>
          <div className="flex gap-2">
            <Button onClick={handleSaveTemplate} variant="default" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isNewTemplate ? "Create Template" : "Update Template"}
                </>
              )}
            </Button>
            {/* <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button> */}
          </div>
        </div>

        {/* {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}

        <Tabs defaultValue="editor"  className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 border-b">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-y-auto p-0 m-0">
            <DocumentEditor
              content={documentContent}
              setContent={setDocumentContent}
              formStructure={formStructure}
              addFieldToDocument={addFieldToDocument}
              addConditionalToDocument={addConditionalToDocument}
              setEditorInstance={setEditorInstance}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-y-auto p-0 m-0">
            <DocumentPreview
              content={documentContent}
              formStructure={formStructure}
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
