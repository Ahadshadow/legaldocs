"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, ChevronRight } from "lucide-react";
import { getBlog } from "@/service/supportService";
import { useParams } from "next/navigation";

export default function QuestionPage() {
  const { blog } = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const mailTo = "support@legaltemplates.net";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBlog(blog);
        const dateStr = data?.data?.updated_at;
        const date = new Date(dateStr);
        const parsedData = {
          ...data.data,
          image:
            `https://legaldocs.unibyts.com/storage/${data?.data?.image}` || "",
          modifiedAt: date
            .toLocaleString("en-US", {
              weekday: "short", // Thu
              month: "short", // Jan
              day: "numeric", // 9
              hour: "numeric", // 4
              minute: "2-digit", // 59
              hour12: true, // AM/PM format
            })
            .replace(",", ""),
        };
        setQuestion(parsedData);
      } catch (error) {
        console.error("Error fetching question data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [blog]);

  const handleFeedback = (helpful: boolean) => {
    // In a real app, you'd send this to your API
    console.log(`User found article ${helpful ? "helpful" : "not helpful"}`);
    setFeedbackSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6 text-center">
        Loading question...
      </div>
    );
  }
  if (!question) {
    return (
      <div className="min-h-screen  p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Question not found</h1>
        <Link href="/help-center/support">
          <Button variant="outline" className="mt-4">
            Back to Support Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {question?.question}
          {!question?.question?.trim().endsWith("?") && "?"}
        </h1>
        {question.modifiedAt && (
          <p className="text-xs text-[#959595] mb-6">
            Modified on {question.modifiedAt}
          </p>
        )}
      </div>
      <div className="w-full h-px bg-gray-300 my-4" />

      <div className="bg-white rounded-lg mb-8">
        <div className="p-0">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: question.answer }}
          />

          {question.image && (
            <div className="mt-6 border rounded-md overflow-hidden">
              <img
                src={question.image || "/placeholder.svg"}
                alt={`Screenshot for ${question.question}`}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              For help, contact{" "}
              <a
                href={`mailto:${mailTo}`}
                className="text-blue-600 hover:underline"
              >
                {mailTo}
              </a>{" "}
              or chat with us Monday-Friday, 9 AM-6 PM EST.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#e6f0ff] rounded-lg p-6 mb-8">
        <h2 className="text-center font-semibold mb-4">
          Was this article helpful?
        </h2>
        {feedbackSubmitted ? (
          <p className="text-center text-muted-foreground">
            Thank you for your feedback!
          </p>
        ) : (
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => handleFeedback(false)}
            >
              <ThumbsDown className="mr-2 h-4 w-4" /> No
            </Button>
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => handleFeedback(true)}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Yes
            </Button>
          </div>
        )}
      </div>

      {relatedQuestions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
          <div className="space-y-2">
            {relatedQuestions.map((relatedQuestion: any) => (
              <Link
                key={relatedQuestion.id}
                href={`/help-center/support/questions/${relatedQuestion.slug}`}
              >
                <div className="p-3 border bg-white rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-blue-600 hover:underline">
                    {relatedQuestion.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
