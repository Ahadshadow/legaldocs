"use client";

import { DocumentHeader } from "../../../../../../components/document-header";
import { DocumentSidebar } from "../../../../../../components/document-sidebar";
import { DocumentToolbar } from "../../../../../../components/document-toolbar";
import { DocumentViewer } from "../../../../../../components/document-viewer";
import { DocumentProvider } from "../../../../../../components/context/document-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SC } from "../../../../../../service/Api/serverCall";
import { useAuth } from "../../../../../../hooks/useAuth";
import { getUserData } from "../../../../../../lib/utils";
import { Toaster } from "sonner";

export default function DocumentPage({ params }) {
  const submissionId = params.id;

  if (!submissionId) {
    return <div>Error: No Documnet ID provided</div>;
  }

  const [documentsData, setDocumentsData] = useState(null);

  const [userData, setUserData] = useState<{
    email: string;
    name?: string;
  } | null>(null);
  const { isLoggedIn } = useAuth();
  const [isEmailMatch, setIsEmailMatch] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await SC.getCall({ url: `document/${submissionId}` });

        if (response.status) {
          setDocumentsData({
            ...response?.data.data,
            documentData: response?.data?.data?.markup || "",
          });
        } else {
          throw new Error("Failed to fetch submissions");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
      }
    };

    fetchTemplate();
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      const data = getUserData();
      setUserData(data);
      console.log(data.email, "data.email");
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
      console.log("One of the emails is undefined or null");
      setIsEmailMatch(false);
    }
  }, [userData?.email, documentsData?.signatureRequestEmail]);

  const Heading = documentsData?.name;


  console.log("documentsData", documentsData);
  
  if (documentsData === null) return null;
  return (
    <DocumentProvider initialData={documentsData}>
      <Toaster />

      <div className="h-screen flex flex-col">
        <DocumentHeader
          submissionId={submissionId}
          isEmailMatch={false}
          isComplete={documentsData}
          Heading={Heading}
          isAdmin = {true}
        />
        <div className="flex-1 flex overflow-hidden">
          <DocumentSidebar
            isEmailMatch={false}
            isComplete={documentsData}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DocumentToolbar
              isEmailMatch={false}
              isComplete={documentsData.status}
            />
            <DocumentViewer isEmailMatch={isEmailMatch} />
          </div>
        </div>
      </div>
    </DocumentProvider>
  );
}
