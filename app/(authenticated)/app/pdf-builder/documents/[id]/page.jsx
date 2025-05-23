"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HelpCircle, Loader } from "lucide-react";
import Sidebar from "../../../../../../components/sidebarPdf";
import { Input } from "../../../../../../components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../components/ui/radio-group-document";
import { Label } from "../../../../../../components/ui/label";
import { Button } from "../../../../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import { useToast } from "../../../../../../components/ui/use-toast";
import { Checkbox } from "../../../../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import { SC } from "../../../../../../service/Api/serverCall";
import { MultipleEntryListField } from "../../../../../../components/MultipleEntryListField";
import { useAuth } from "../../../../../../hooks/useAuth";
import LoginModal from "../../../../../../components/login-modal";
import InfoCard from "@/components/FaqSteperRender";

export default function DynamicForm({ params }) {
  const { toast } = useToast();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submission_id");

  const rawParams = use(params);
  const selectedId =
    rawParams.id;
  const [documentData, setDocumentData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
  const [affectingQuestions, setAffectingQuestions] = useState([]);
  const [hiddenQuestions, setHiddenQuestions] = useState({});
  const [subsectionInfo, setSubsectionInfo] = useState({});
  const [loginModal, setLoginModal] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    const fetchDocumentData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = submissionId
          ? `submissions/${submissionId}`
          : `document/${selectedId}`;

        const response = await SC.getCall({ url });

        if (response.status) {
          const data = response.data.data || {};
          const parsedRes = {
            steps: data.steps,
            name: submissionId ? data?.document_name : data.name,
            _id: submissionId ? data?.document_id : data._id,
          };

          const steps = parsedRes.steps;

          setDocumentData(parsedRes.steps);
          if (submissionId) updateFormData(steps); // IF EDIT MODE WITH SUBMISSION ID
          initializeSubsectionInfo(steps);
          setDocInfo({ name: parsedRes.name, _id: parsedRes._id });
        } else {
          setError(response.message || "Failed to fetch document data");
        }
      } catch (error) {
        setError(error.message || "Error fetching document data");
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedId || submissionId) {
      fetchDocumentData();
    }
  }, [selectedId, submissionId]);

  useEffect(() => {
    if (documentData) {
      const questions = documentData.flatMap((section) =>
        section.subsections.flatMap((subsection) =>
          subsection.question.filter(
            (q) => q.affectedQuestion && q.affectedQuestion.length > 0
          )
        )
      );
      setAffectingQuestions(
        questions.map((q) => ({ id: q.id, key: q.uniqueKeyName }))
      );
    }
  }, [documentData]);

  useEffect(() => {
    if (documentData) {
      updateHiddenQuestions();
    }
  }, [documentData, formData]); //Fixed unnecessary dependency

  // SAVING DOCUMENT CURRENT STATE IN LOCAL STORAGE ON INPUT CHANGE
  useEffect(() => {
    if (Object.keys(formData).length > 0 && !submissionId) {
      const documentDraft = {
        title: docInfo?.name,
        key: selectedId,
        formData: formData,
        currentStepIndex: currentStepIndex,
        currentSubsectionIndex: currentSubsectionIndex,
        completedSteps: completedSteps,
      };
      const stringifiedDocument = JSON.stringify(documentDraft);
      localStorage.setItem("documentDraft", stringifiedDocument);
    }
  }, [formData, docInfo]);

  // UPDATE DOCUMENT FROM LOCAL STORAGE DRAFT  IF NOT EDIT MODE
  useEffect(() => {
    const documentDraft = localStorage.getItem("documentDraft");
    if (documentDraft && !submissionId) {
      const parsedDocument = JSON.parse(documentDraft);

      if (
        parsedDocument?.title &&
        parsedDocument?.key === selectedId &&
        parsedDocument?.formData &&
        parsedDocument?.completedSteps
      ) {
        const documentData = {
          formData: parsedDocument.formData,
          currentStepIndex: parsedDocument.currentStepIndex,
          currentSubsectionIndex: parsedDocument.currentSubsectionIndex,
          completedSteps: parsedDocument.completedSteps,
        };
        setFormData(documentData.formData);
        setCurrentStepIndex(documentData.currentStepIndex);
        setCurrentSubsectionIndex(documentData.currentSubsectionIndex);
        setCompletedSteps(documentData.completedSteps);
      }
    }
  }, []);

  const updateFormData = (data) => {
    const initialData = {};
    data?.forEach((section) => {
      section.subsections?.forEach((subsection) => {
        subsection.question?.forEach((field) => {
          initialData[field.uniqueKeyName] = field.answer;
        });
      });
    });
    setFormData(initialData);
  };

  const initializeSubsectionInfo = (data) => {
    const info = {};
    data?.forEach((section, sectionIndex) => {
      info[sectionIndex] = {};
      section.subsections?.forEach((subsection, subsectionIndex) => {
        info[sectionIndex][subsectionIndex] = {
          totalQuestions: subsection.question.length,
          hiddenQuestions: 0,
        };
      });
    });
    setSubsectionInfo(info);
  };

  const findFieldById = (data, id) => {
    for (const section of data) {
      for (const subsection of section.subsections) {
        const field = subsection.question.find((q) => q.id === id);
        if (field) return { field, section, subsection };
      }
    }
    return null;
  };

  const shouldHideQuestion = (question) => {
    for (const affectingQ of affectingQuestions) {
      const affectingField = findFieldById(documentData, affectingQ.id);
      if (affectingField && affectingField.field.affectedQuestion) {
        const affectedQ = affectingField.field.affectedQuestion.find(
          (q) => q.id === question.id
        );
        if (affectedQ) {
          const currentValue = formData[affectingQ.key];
          if (Array.isArray(currentValue)) {
            // For checkboxes (pay_breakdown)
            if (
              !currentValue.some((value) => affectedQ.value.includes(value))
            ) {
              return true;
            }
          } else {
            // For other input types
            if (!affectedQ.value.includes(currentValue)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const updateHiddenQuestions = () => {
    const hidden = {};
    const updatedSubsectionInfo = { ...subsectionInfo };
    documentData?.forEach((section, sectionIndex) => {
      section.subsections?.forEach((subsection, subsectionIndex) => {
        const hiddenQuestionsCount =
          subsection.question.filter(shouldHideQuestion).length;
        if (!hidden[sectionIndex]) hidden[sectionIndex] = {};
        hidden[sectionIndex][subsectionIndex] = hiddenQuestionsCount;
        updatedSubsectionInfo[sectionIndex][subsectionIndex].hiddenQuestions =
          hiddenQuestionsCount;
      });
    });
    setHiddenQuestions(hidden);
    setSubsectionInfo(updatedSubsectionInfo);
  };

  const handleStepSelect = (stepIndex) => {
    setCurrentStepIndex(stepIndex);
    setCurrentSubsectionIndex(0);
    setIsPreviewMode(false);
  };

  const handleSubsectionSelect = (stepIndex, subsectionIndex) => {
    setCurrentStepIndex(stepIndex);
    setCurrentSubsectionIndex(subsectionIndex);
    setIsPreviewMode(false);
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleNext = () => {
    let nextStepIndex = currentStepIndex;
    let nextSubsectionIndex = currentSubsectionIndex;

    do {
      if (
        nextSubsectionIndex <
        documentData[nextStepIndex].subsections.length - 1
      ) {
        nextSubsectionIndex++;
      } else {
        nextStepIndex++;
        nextSubsectionIndex = 0;
      }

      if (nextStepIndex >= documentData.length) {
        setIsPreviewMode(true);
        return;
      }
    } while (
      subsectionInfo[nextStepIndex]?.[nextSubsectionIndex]?.totalQuestions ===
      subsectionInfo[nextStepIndex]?.[nextSubsectionIndex]?.hiddenQuestions
    );

    setCurrentStepIndex(nextStepIndex);
    setCurrentSubsectionIndex(nextSubsectionIndex);
    setCompletedSteps([
      ...completedSteps,
      { stepIndex: currentStepIndex, subsectionIndex: currentSubsectionIndex },
    ]);
  };

  const handleBack = () => {
    let prevStepIndex = currentStepIndex;
    let prevSubsectionIndex = currentSubsectionIndex;

    do {
      if (prevSubsectionIndex > 0) {
        prevSubsectionIndex--;
      } else if (prevStepIndex > 0) {
        prevStepIndex--;
        prevSubsectionIndex =
          documentData[prevStepIndex].subsections.length - 1;
      } else {
        // We're at the first visible step/subsection
        return;
      }
    } while (
      subsectionInfo[prevStepIndex]?.[prevSubsectionIndex]?.totalQuestions ===
      subsectionInfo[prevStepIndex]?.[prevSubsectionIndex]?.hiddenQuestions
    );

    setCurrentStepIndex(prevStepIndex);
    setCurrentSubsectionIndex(prevSubsectionIndex);
  };

  const findFirstVisibleStep = () => {
    for (let i = 0; i < documentData.length; i++) {
      for (let j = 0; j < documentData[i].subsections.length; j++) {
        if (
          subsectionInfo[i]?.[j]?.totalQuestions >
          subsectionInfo[i]?.[j]?.hiddenQuestions
        ) {
          return { stepIndex: i, subsectionIndex: j };
        }
      }
    }
    return { stepIndex: 0, subsectionIndex: 0 }; // Fallback to first step if all are hidden
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };
  const toggleLoginModal = () => setLoginModal(!loginModal);

  const handleSave = async () => {
    if (!isLoggedIn) {
      toggleLoginModal();
      return;
    }

    try {
      setSubmissionLoading(true);
      const submissionData = JSON.parse(JSON.stringify(documentData));

      submissionData?.forEach((section) => {
        section.subsections?.forEach((subsection) => {
          subsection.question?.forEach((question) => {
            const answer = formData[question.uniqueKeyName];
            if (answer !== undefined) {
              question.answer = answer;
            }
          });
        });
      });

      const payload = {
        steps: submissionData,
        document_id: docInfo?._id,
      };

      const requestMethod = submissionId ? "putCall" : "postCall";
      const url = submissionId ? "submissions/" + submissionId : "submissions";
      const response = await SC[requestMethod]({
        url,
        data: payload,
      });

      if (response.status) {
        toast({
          title: "Success",
          description: `Document ${submissionId ? "updated" : "saved"
            } successfully`,
        });
        localStorage.removeItem("documentDraft"); // REMOVE LOCAL STORAGE DOCUMENT DRAFT
        router.push("/app/user-panel/mydocs");
      } else {
        throw new Error(response.message || "Failed to save document");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmissionLoading(false);
    }
  };
  const renderField = (field) => {
    switch (field.type) {
      case "textField":
        return (
          <Input
            key={field.uniqueKeyName}
            id={field.uniqueKeyName}
            type={field.selectionValue === "date" ? "date" : "text"}
            value={formData[field.uniqueKeyName] || ""}
            onChange={(e) =>
              handleInputChange(field.uniqueKeyName, e.target.value)
            }
            required={field.isRequired}
            placeholder={field.placeholder}
          />
        );
      case "dropdownList":
        return (
          <Select
            key={field.uniqueKeyName}
            value={formData[field.uniqueKeyName] || ""}
            onValueChange={(value) =>
              handleInputChange(field.uniqueKeyName, value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.list.map((option) => (
                <SelectItem key={option.name} value={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radioButton":
        return (
          <RadioGroup
            key={field.uniqueKeyName}
            value={formData[field.uniqueKeyName] || ""}
            onValueChange={(value) =>
              handleInputChange(field.uniqueKeyName, value)
            }
          >
            {field.list.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.name}
                  id={`${field.uniqueKeyName}-${index}`}
                />
                <Label htmlFor={`${field.uniqueKeyName}-${index}`}>
                  {option.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkboxes":
        return (
          <div key={field.uniqueKeyName}>
            {field.list.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 my-2">
                <Checkbox
                  id={`${field.uniqueKeyName}-${index}`}
                  checked={(formData[field.uniqueKeyName] || []).includes(
                    option.name
                  )}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.uniqueKeyName] || [];
                    const newValues = checked
                      ? [...currentValues, option.name]
                      : currentValues.filter((value) => value !== option.name);
                    handleInputChange(field.uniqueKeyName, newValues);
                  }}
                />
                <Label htmlFor={`${field.uniqueKeyName}-${index}`}>
                  {option.name}
                </Label>
              </div>
            ))}
          </div>
        );
      case "multipleEntryList":
        return (
          <MultipleEntryListField
            key={field.uniqueKeyName}
            field={field}
            value={formData[field.uniqueKeyName] || []}
            onChange={(value) => handleInputChange(field.uniqueKeyName, value)}
          />
        );
      default:
        return (
          <div key={field.uniqueKeyName}>
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  useEffect(() => {
    if (documentData) {
      updateHiddenQuestions();
      const { stepIndex, subsectionIndex } = findFirstVisibleStep();
      setCurrentStepIndex(stepIndex);
      setCurrentSubsectionIndex(subsectionIndex);
    }
  }, [documentData]); //Fixed unnecessary dependency

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No document data available.
      </div>
    );
  }

  const currentSection = documentData[currentStepIndex];
  const currentSubsection = currentSection.subsections[currentSubsectionIndex];
  const progress = Math.round(
    (completedSteps.length /
      documentData.reduce(
        (acc, section) => acc + section.subsections.length,
        0
      )) *
    100
  );


  return (
    <div className="flex h-[calc(100vh-4.9rem)] bg-gray-50 overflow-hidden">
      <Sidebar
        steps={documentData.map((section, index) => ({
          id: index,
          title: section.name,
          subsections: section.subsections.map((sub, subIndex) => ({
            name: sub.name,
            totalQuestions:
              subsectionInfo[index]?.[subIndex]?.totalQuestions || 0,
            hiddenQuestions:
              subsectionInfo[index]?.[subIndex]?.hiddenQuestions || 0,
          })),
        }))}
        currentStep={currentStepIndex}
        currentSubsection={currentSubsectionIndex}
        completedSteps={completedSteps}
        onStepSelect={handleStepSelect}
        onSubsectionSelect={handleSubsectionSelect}
        onPreview={handlePreview}
        progress={progress}
        docName={docInfo?.name}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {isPreviewMode ? (
                <div className="prose max-w-none">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Preview</h2>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsPreviewMode(false)}
                        variant="outline"
                      >
                        Back
                      </Button>
                      <Button
                        disabled={submissionLoading}
                        onClick={handleSave}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        {submissionLoading ? (
                          <Loader />
                        ) : submissionId ? (
                          "Update"
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    {documentData.flatMap((section) =>
                      section.subsections.flatMap((subsection) =>
                        subsection.question.map((field, id) => (
                          <div key={`${id}-${field.uniqueKeyName}`} className="mb-4">
                            <h3 className="font-semibold">
                              {field.questionToAsk}
                            </h3>
                            <p className="whitespace-pre-wrap break-words">
                              {Array.isArray(formData[field.uniqueKeyName])
                                ? formData[field.uniqueKeyName].join(", ")
                                : formData[field.uniqueKeyName] ||
                                "Not provided"}
                            </p>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <div className="w-full max-h-[calc(100vh-120px)]">
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold mb-6">
                        {currentSection.name} - {currentSubsection.name}
                      </h2>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleNext();
                        }}
                      >
                        <div className="space-y-4 ">
                          {currentSubsection.question.map(
                            (field, id) =>
                              !shouldHideQuestion(field) && (
                                <div
                                  key={field.uniqueKeyName+id}
                                  className="bg-white shadow-sm border border-gray-200 rounded-lg"
                                >
                                  <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <Label
                                        htmlFor={field.uniqueKeyName}
                                        className="text-sm font-medium"
                                      >
                                        {field.questionToAsk}
                                      </Label>
                                      {/* {field.description && ( */}
                                      {field?.FAQQuestion && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.preventDefault(); // Prevents default form submission
                                                  e.stopPropagation(); // Stops the event from bubbling up
                                                }}
                                              >
                                                <HelpCircle className="w-4 h-4 text-gray-400" />
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="w-64 text-sm">
                                                {field?.FAQQuestion || null}
                                                <br />
                                                {field?.FAQAnswer || null}
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                    <div className="border-t border-gray-200 mt-2 pt-2">
                                      {renderField(field)}
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-8">
                          <Button
                            type="button"
                            onClick={handleBack}
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-800"
                            disabled={
                              currentStepIndex === 0 &&
                              currentSubsectionIndex === 0
                            }
                          >
                            ← Back
                          </Button>

                          <Button
                            type="submit"
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            {currentStepIndex === documentData.length - 1 &&
                              currentSubsectionIndex ===
                              currentSection.subsections.length - 1
                              ? "Preview"
                              : "Next"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>



                  {currentSection.FAQQuestion &&
                    <div>
                      <InfoCard
                        content={currentSection.FAQAnswer}
                        question={currentSection.FAQQuestion}

                      />
                    </div>
                  }

                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <LoginModal open={loginModal} toggleModal={toggleLoginModal} />
    </div>
  );
}
