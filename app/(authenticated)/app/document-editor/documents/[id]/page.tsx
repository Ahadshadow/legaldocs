// "use client"

// import { useSearchParams } from "next/navigation"
// import { DocumentHeader } from "../../../../../components/document-header"
// import { DocumentSidebar } from "../../../../../components/document-sidebar"
// import { DocumentToolbar } from "../../../../../components/document-toolbar"
// import { DocumentViewer } from "../../../../../components/document-viewer"
// import { DocumentProvider } from "../../../../../components/context/document-context"
// import { useEffect, useState } from "react"
// import { SC } from "../../../../../service/Api/serverCall"

// export default function DocumentPage() {
//   const searchParams = useSearchParams()
//   const submissionId = searchParams.get("submissionId")
//     const [documentsData,  setDocumentsData] = useState(null)
  

//   if (!submissionId) {
//     return <div>Error: No submission ID provided</div>
//   }


//   useEffect(() => {
//         const fetchSubmissions = async () => {
//           try {
//             const response = await SC.getCall({ url: `submissions/${submissionId}` })
//             if (response.status) {
//               setDocumentsData(response?.data.document?.document_data)
              
//             } else {
//               throw new Error( "Failed to fetch submissions")
//             }
//           } catch (error) {
//             console.error("Error fetching submissions:", error)
//           } finally {
//           }
//         }
    
//         fetchSubmissions()
//       }, [])

//   if(documentsData === null ) return null

//   return (
//     <DocumentProvider documentsData={documentsData}>
//       <div className="h-screen flex flex-col">
//         <DocumentHeader submissionId={submissionId} />
//         <div className="flex-1 flex overflow-hidden">
//           <DocumentSidebar />
//           <div className="flex-1 flex flex-col overflow-hidden">
//             <DocumentToolbar />
//             <DocumentViewer />
//           </div>
//         </div>
//       </div>
//     </DocumentProvider>
//   )
// }



"use client"

import { DocumentHeader } from "../../../../../../components/document-header"
import { DocumentSidebar } from "../../../../../../components/document-sidebar"
import { DocumentToolbar } from "../../../../../../components/document-toolbar"
import { DocumentViewer } from "../../../../../../components/document-viewer"
import { DocumentProvider } from "../../../../../../components/context/document-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SC } from "../../../../../../service/Api/serverCall"
import { useAuth } from "../../../../../../hooks/useAuth"
import { getUserData } from "../../../../../../lib/utils"
import { Toaster } from "sonner"

// Hardcoded static content
const staticDocumentsData = {
  content: `
    <h1>Residential Lease Agreement</h1>
    <p>This Residential Lease Agreement ("Agreement") is made and entered into on [DATE], by and between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant").</p>
    <h2>1. Property</h2>
    <p>The Landlord agrees to rent to the Tenant the residential property located at [FULL PROPERTY ADDRESS] ("the Property").</p>
    <h2>2. Term</h2>
    <p>The term of this lease shall be for a period of [LEASE DURATION], commencing on [START DATE] and ending on [END DATE], unless terminated earlier in accordance with this Agreement.</p>
    <h2>3. Rent</h2>
    <p>The Tenant agrees to pay rent in the amount of $[RENT AMOUNT] per month, due on the [DUE DATE] of each month. Payments shall be made to [PAYMENT DETAILS]. Late payments will incur a fee of $[LATE FEE AMOUNT] for each day the rent is overdue.</p>
     <h1>Residential Lease Agreement</h1>
    <p>This Residential Lease Agreement ("Agreement") is made and entered into on [DATE], by and between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant").</p>
    <h2>1. Property</h2>
    <p>The Landlord agrees to rent to the Tenant the residential property located at [FULL PROPERTY ADDRESS] ("the Property").</p>
    <h2>2. Term</h2>
    <p>The term of this lease shall be for a period of [LEASE DURATION], commencing on [START DATE] and ending on [END DATE], unless terminated earlier in accordance with this Agreement.</p>
    <h2>3. Rent</h2>
    <p>The Tenant agrees to pay rent in the amount of $[RENT AMOUNT] per month, due on the [DUE DATE] of each month. Payments shall be made to [PAYMENT DETAILS]. Late payments will incur a fee of $[LATE FEE AMOUNT] for each day the rent is overdue.</p>
     <h1>Residential Lease Agreement</h1>
    <p>This Residential Lease Agreement ("Agreement") is made and entered into on [DATE], by and between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant").</p>
    <h2>1. Property</h2>
    <p>The Landlord agrees to rent to the Tenant the residential property located at [FULL PROPERTY ADDRESS] ("the Property").</p>
    <h2>2. Term</h2>
    <p>The term of this lease shall be for a period of [LEASE DURATION], commencing on [START DATE] and ending on [END DATE], unless terminated earlier in accordance with this Agreement.</p>
    <h2>3. Rent</h2>
    <p>The Tenant agrees to pay rent in the amount of $[RENT AMOUNT] per month, due on the [DUE DATE] of each month. Payments shall be made to [PAYMENT DETAILS]. Late payments will incur a fee of $[LATE FEE AMOUNT] for each day the rent is overdue.</p>
     <h1>Residential Lease Agreement</h1>
    <p>This Residential Lease Agreement ("Agreement") is made and entered into on [DATE], by and between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant").</p>
    <h2>1. Property</h2>
    <p>The Landlord agrees to rent to the Tenant the residential property located at [FULL PROPERTY ADDRESS] ("the Property").</p>
    <h2>2. Term</h2>
    <p>The term of this lease shall be for a period of [LEASE DURATION], commencing on [START DATE] and ending on [END DATE], unless terminated earlier in accordance with this Agreement.</p>
    <h2>3. Rent</h2>
    <p>The Tenant agrees to pay rent in the amount of $[RENT AMOUNT] per month, due on the [DUE DATE] of each month. Payments shall be made to [PAYMENT DETAILS]. Late payments will incur a fee of $[LATE FEE AMOUNT] for each day the rent is overdue.</p>
  `,
  signatures: [
    {
      id: "sig1",
      pageId: 1,
      x: 100,
      y: 500,
      type: "draw",
      content:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAACitJREFUeF7tnV3oJmMYxq/dtezKR+sjpDjYPaEoZR3sIh9JSssJCeXA1xmKlJScbIk4pcTJorYoEfkobSjyGQ6QnCA2LC1KWB/vXe+sMd55Z+Z9/zPzXDO/KdnszPNc9+++38szzzwzzypxQAACEDAhsMpEJzIhAAEICMOiCCAAARsCGJZNqhAKAQhgWNQABCBgQwDDskkVQiEAAQyLGoAABGwIYFg2qUIoBCCAYVEDEICADQEMyyZVCIUABDAsagACELAhgGHZpAqhEIAAhkUNQAACNgQwLJtUIRQCEMCwqAEIQMCGAIZlkyqEQgACGBY1AAEI2BDAsGxShVAIQADDogYgAAEbAhiWTaoQCgEIYFjUAAQgYEMAw7JJFUIhAAEMixqAAARsCGBYNqlCKAQggGFRAxCAgA0BDMsmVQiFAAQwLGoAAhCwIYBh2aQKoRCAAIZFDUAAAjYEMCybVCEUAhDAsKgBCEDAhgCGZZMqhEIAAhgWNQABCNgQwLBsUoVQCEAAw/KugUMl7ZG0RlLkss18/j1FFf/+SdIGb3SodyTQZoE78nDQfLSk3ZJWJyQ2TCz+eU7StoR0IWVgBDAsn4T+VXMElZnHPkmHSfptwRDDFMMcsxppWivZiCx0x0jw1wV1cBkE9hNoWoSg64dA9uMv9h7/va+RVhhi9N2khkJvGOj6fjDSqzuBJsXmHquz/rxh9WlSVQyfknRpg/m0iOUTSSdXNczfQyAIYFgedZA3rD8kHeghe7/KP2uaWNw+Xi/pUbP4kNsRAQyrI9BLdhMmdUCujZRHWVWhviZpa8X/LCO+8yTtqmqMvx8XAQzLJ9+/S1o7ENPKUw8zzpZlpDRH51MZI1KKYXkl+z5JtxUkx+R33si8Ivqv2q8kHT8jgLhVDFPjGDkBDMuzAGJOKP900PkWcVYGirfA2TkRd/7W2DN7qF6YAIa1MLreL7xuMhp5uKDiCkk7e1e2cgJi9DhrZBVLI9atXDe05EIAw3LJVLnOsgWlQ1rzVBxRZjQ+l7TJP4VEUJcAhlWXVNrn1VkFn62AP1FSzBU5HmVxcqvomM0FNGNYC0BL9JKXJZ0/1VaV1zCveOroeFt1q6R4+DArxohrh6RrEs0RspYkUFXYSzbP5T0TiPf3DqpY8+T6BO5uSXfNiY1RV8/F10b3GFYbVNNtc+/0ReSy0UlMcJe9t5huVFLZ5HxojnielHR5ygGgrR4BDKsepyGeNW+y/kdJRxoGfcdkTdr2ObeLfb0obogyTckYVpp56VJV2RO4TEOMUL4pWdDZpc6mfRXfDMiu51axKcmEzsewEkpGz1JibVOsmK+qiTCwWNgZc2MOx8GTtwN+mRHXu5JOdwgAjf8SqCpOWI2PQHzq5aOaX1fI5ojCxI6V9F3CuG6ZfNDwgYJxDe0NgYTxr4w0DGtlOA69lbi9ildi6tRLNml/taQnEgTz7fRLqnlprk9KE8TbrqQ6BdiuAlp3JPDZZL3TxpoGlo3CUruNnDV3F5trHO6YkLFoxrDGkul248w2xqi7c0+26j6F28ji01IWn7ZbK0u1jmEthY+L5xCoO4k/q4n8lmLx55gbO65F2lskvc78VouEV6hpDGuFQNJMJYH4jte907P6rruy/uOWMHb4yR/vTLYv21wZHSd0QqDvwukkSDpJlsDP0x108reSXdRkVR/F+a2P2SgjjRqqSlwaKlEBge4J/FDY3frLyeYYJ3Qvgx7zBDAs6gEC5QSKprVH0lEA648AhtUfe3r2IBAmdUROquM2ax6ka6jEsGpA4pTRE4inlPmRFSvkeyoJDKsn8HRrR+ChyUvgNxZUx9ch7rGLxFgwhmWcPKT3QmDWQtPYmiy+aMHRMgEMq2XAND9IArEc45BCZPyWOkg1kDuATBeDJZAfbTGv1UGaMawOINPFoAnkTSu+BHHMoKPtOTgMq+cE0L09gVjyEEsfsoPfVIspBW6LcGl6NAQ+kHTqNFp+Uy2mHbgtwqXpURHIvjDBb6rFtAO3Rbg0PXgC38/YXYjfVItpB26LcGl6sATKtkh7Jbf79mCD7zMwDKtP+vSdIoGXJJ05WcG+rsGcVHysMDs/xZgGownDGkwqCWRBAjslXdbg+/RZNzFn9aKkixbsl8sWIIBhLQCNS+wJlG2yWhZYNqEeI6k3JZ1rT8A0AAzLNHHIbkxgd41FnfHpmE2SvmjcOhd0QgDD6gQznfREYIekq+bc7sXI6XlJF/ekj24bEsCwGgLj9OQJnC1pV4VJnSPp1eQjQeD/CGBYFIU7ge2Sbpe0psKkYhfq2I2aw5gAhmWcvBFKjy24PpUUG7DWqd1Y2BmbvHIMhECdpA8kVMIwJRBLBy6oaVDZpqunSfraNF5kzyGAYVEeqRG4ebKZ6f3TW7x52sKcYv/A2Jz1ztSCQE87BDCsdrjSan0CGyW9P/2C57x6DIPaK+kkSbFEgWOEBDCsESY9kZDjKd1ZFVr2Sbppsn7qwUQ0I6NnAhhWzwkYYffFbeDzCGIU9YakrSPkQsg1CGBYNSBxytIE3pK0uaSVMLAzJL23dC80MHgCGNbgU9xbgDFKitu+1SUK3p4aVW8C6diPAIbll7MUFceyg8ema57m1VSMptZPnurFO3scEGhMAMNqjGz0F8S6qHi1ZW3NtVEBjA/bjb5sVgYAhrUyHJ1a+VDSKTME52vhkcmc0jZJG2qshyo2FRPnMYKKOaktkrJPszgxQmuiBDCsRBPTgqwLJb0wp924XYv38Zoc8ang2OLqWknPNrmQcyGwCAEMaxFqftdcIunpJWTHeqgwpmcmr7zcsEQ7XAqBpQhgWEvhs7j4SkmP11Qao6zYYy+WGcSfOSCQFAEMK6l0IAYCEJhHAMOiPiAAARsCGJZNqhAKAQhgWNQABCBgQwDDskkVQiEAAQyLGoAABGwIYFg2qUIoBCCAYVEDEICADQEMyyZVCIUABDAsagACELAhgGHZpAqhEIAAhkUNQAACNgQwLJtUIRQCEMCwqAEIQMCGAIZlkyqEQgACGBY1AAEI2BDAsGxShVAIQADDogYgAAEbAhiWTaoQCgEIYFjUAAQgYEMAw7JJFUIhAAEMixqAAARsCGBYNqlCKAQggGFRAxCAgA0BDMsmVQiFAAQwLGoAAhCwIYBh2aQKoRCAAIZFDUAAAjYEMCybVCEUAhDAsKgBCEDAhgCGZZMqhEIAAhgWNQABCNgQwLBsUoVQCEAAw6IGIAABGwIYlk2qEAoBCGBY1AAEIGBDAMOySRVCIQABDIsagAAEbAhgWDapQigEIIBhUQMQgIANAQzLJlUIhQAEMCxqAAIQsCGAYdmkCqEQgACGRQ1AAAI2BDAsm1QhFAIQwLCoAQhAwIYAhmWTKoRCAAIYFjUAAQjYEMCwbFKFUAhAAMOiBiAAARsCGJZNqhAKAQhgWNQABCBgQwDDskkVQiEAAQyLGoAABGwIYFg2qUIoBCDwD0rx4Ze3+vFtAAAAAElFTkSuQmCC",
    },
    {
      id: "sig2",
      pageId: 1,
      x: 300,
      y: 500,
      type: "type",
      content: "John Doe",
    },
  ],
  email: "johndoe@example.com",
}


export default function DocumentPage({params}) {
  const submissionId = params.id

  

  if (!submissionId) {
    return <div>Error: No submission ID provided</div>
  }
  
    const [documentsData,  setDocumentsData] = useState(null)

    const [userData, setUserData] = useState<{ email: string; name?: string } | null>(null)
  const { isLoggedIn } = useAuth()
  const [isEmailMatch, setIsEmailMatch] = useState(false);




  
  useEffect(() => {
        const fetchSubmissions = async () => {
          try {
            const response = await SC.getCall({ url: `submissions/${submissionId}` })
            if (response.status) {
              setDocumentsData(response?.data.data)
              
            } else {
              throw new Error( "Failed to fetch submissions")
            }
          } catch (error) {
            console.error("Error fetching submissions:", error)
          } finally {
          }
        }
    
        fetchSubmissions()
      }, [])
      useEffect(() => {
        if (isLoggedIn) {
          const data = getUserData()
          setUserData(data)
          console.log(data.email, "data.email");
          
        } else {
          setUserData(null)
        }
      }, [isLoggedIn])

      useEffect(() => {
        if (userData?.email && documentsData?.signatureRequestEmail) {
          const userEmail = userData?.email.trim().toLowerCase();
          const signatureEmail = documentsData?.signatureRequestEmail.trim().toLowerCase();
      
          const match = userEmail === signatureEmail;
          setIsEmailMatch(match);
        } else {
          console.log('One of the emails is undefined or null');
          setIsEmailMatch(false);
        }
      }, [userData?.email, documentsData?.signatureRequestEmail]);



      

      
    

console.log(documentsData, 'ismatch');
      

  if(documentsData === null ) return null
  return (
    <DocumentProvider initialData={documentsData}>
        <Toaster />

      <div className="h-screen flex flex-col">
        <DocumentHeader submissionId={submissionId} isEmailMatch={isEmailMatch} isComplete={documentsData} />
        <div className="flex-1 flex overflow-hidden">
          <DocumentSidebar isEmailMatch={isEmailMatch} isComplete={documentsData} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DocumentToolbar isEmailMatch={isEmailMatch} isComplete={documentsData.status} />
            <DocumentViewer isEmailMatch={isEmailMatch} />
          </div>
        </div>
      </div>
    </DocumentProvider>
  )
}


