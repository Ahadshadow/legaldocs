"use client";

import { DocumentHeader } from "../../../../../../components/document-header";
import { DocumentSidebar } from "../../../../../../components/document-sidebar";
import { DocumentToolbar } from "../../../../../../components/document-toolbar";
import { DocumentViewer } from "../../../../../../components/document-viewer";
import { DocumentProvider } from "../../../../../../components/context/document-context";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { SC } from "../../../../../../service/Api/serverCall";
import { useAuth } from "../../../../../../hooks/useAuth";
import { getUserData } from "../../../../../../lib/utils";
import { Toaster } from "sonner";

export default function DocumentPage({ params }) {
  const submissionId = use(params)?.id;

  if (!submissionId) {
    return <div>Error: No submission ID provided</div>;
  }

  const [documentsData, setDocumentsData] = useState(null);

  const [userData, setUserData] = useState<{
    email: string;
    name?: string;
  } | null>(null);
  const { isLoggedIn } = useAuth();
  const [isEmailMatch, setIsEmailMatch] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await SC.getCall({
          url: `submissions/${submissionId}`,
        });
        if (response.status) {
          setDocumentsData(response?.data.data);
        } else {
          throw new Error("Failed to fetch submissions");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
      }
    };

    fetchSubmissions();
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      const data = getUserData();
      setUserData(data);
      // console.log(data.email, "data.email");
    } else {
      setUserData(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userData?.email && documentsData?.signatureRequestEmail) {
      const userEmail = userData?.email.trim().toLowerCase();
      const signatureEmail = documentsData?.signatureRequestEmail
        .trim()
        .toLowerCase();

      const match = userEmail === signatureEmail;
      setIsEmailMatch(match);
    } else {
      setIsEmailMatch(false);
    }
  }, [userData?.email, documentsData?.signatureRequestEmail]);

  const Heading = documentsData?.document_name;

  if (documentsData === null) return null;
  return (
    <DocumentProvider initialData={documentsData}>
      <Toaster />

      <div className="h-screen flex flex-col">
        <DocumentHeader
          submissionId={submissionId}
          isEmailMatch={isEmailMatch}
          documentsData={documentsData}
          Heading={Heading}
        />
        <div className="flex-1 flex overflow-hidden">
          <DocumentSidebar
            isEmailMatch={isEmailMatch}
            documentsData={documentsData}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DocumentToolbar
              isEmailMatch={isEmailMatch}
              isComplete={documentsData.status}
            />
            <DocumentViewer isEmailMatch={isEmailMatch}
             documentsData={documentsData}
            />
          </div>
        </div>
      </div>
    </DocumentProvider>
  );
}
