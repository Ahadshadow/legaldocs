"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

export default function ContinueEditing() {
  const [visible, setVisibility] = useState(false);
  const [document, setDocument] = useState({});
  const pathname = usePathname();
  const router = useRouter();

  const hideBar =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.includes("pdf-builder");

  useEffect(() => {
    const documentDraft = localStorage.getItem("documentDraft");

    if (documentDraft && !hideBar) {
      const parsedDocument = JSON.parse(documentDraft);
      if (parsedDocument?.title && parsedDocument?.key) {
        const documentData = {
          title: parsedDocument.title,
          url: `/app/pdf-builder/documents/${parsedDocument?.key}`,
        };
        setDocument(documentData);
        setVisibility(true);
      }
      return; // Exit loop early if found
    }
    // If not found, hide banner
    setVisibility(false);
  }, [pathname]); // Triggers on route change

  const gotoDocumentPage = () => {
    router.push(document.url);
  };

  return (
    <>
      {visible && (
        <div className="bg-black py-4 flex justify-center items-center">
          <p className="text-white">
            Would you like to continue working on your {document?.title}?
          </p>
          <Button
            className="ml-4"
            variant="secondary"
            onClick={gotoDocumentPage}
          >
            Continue Editing
          </Button>
        </div>
      )}
    </>
  );
}
