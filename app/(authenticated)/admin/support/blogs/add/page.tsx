"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../../../components/ui/input";
import { Button } from "../../../../../../components/ui/button";
import { Label } from "../../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import { getSubCategories } from "../../../../../../service/supportSubCategoryService";
import { createBlog } from "../../../../../../service/supportBlogService";
// import { RichTextEditor } from "../../../../../../components/ui/text-editor";
import { Switch } from "../../../../../../components/ui/switchPanel";
import { useToast } from "@/adminComponents/ui/use-toast";
const RichTextEditor = dynamic(
  () =>
    import("../../../../../../components/ui/text-editor").then(
      (mod) => mod.RichTextEditor
    ),
  { ssr: false }
);
export default function AddBlog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    popular: false,
    image: null,
    support_sub_category_id: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadSubCategories = async () => {
      try {
        const data = await getSubCategories();
        setSubCategories(data.data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sub categories",
          variant: "destructive",
        });
      }
    };

    loadSubCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      image: files ? files[0] : null,
    });
    const file = files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      support_sub_category_id: value,
    });
  };
  const handleAnswerChange = (value: string) => {
    setFormData({
      ...formData,
      answer: value,
    });
  };

  const handlePopularChange = (value: boolean) => {
    setFormData({
      ...formData,
      popular: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData();

    for (const key in formData) {
      const value = formData[key];
      // If it's a File object (e.g., image), append directly
      if (value instanceof File) {
        form.append(key, value);
      } else {
        form.append(key, String(value));
      }
    }

    try {
      await createBlog(form);
      toast({
        title: "Success",
        description: "blog created successfully",
      });
      router.push("/admin/support/blogs/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("data", formData);
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add Support Blog</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="sub-category">Sub Category</Label>
            <Select
              value={formData.support_sub_category_id}
              onValueChange={handleSubCategoryChange}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select support sub category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Enter question here"
              className="mt-1"
              value={formData.question}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="answer">Answer</Label>
            <RichTextEditor
              value={formData.answer}
              onChange={handleAnswerChange}
            />
          </div>

          <div className="flex items-center ">
            <Label htmlFor="popular">Popular</Label>
            <Switch
              className="ml-2"
              id="popular"
              checked={formData.popular}
              onCheckedChange={handlePopularChange}
            />
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              placeholder="Upload image"
              className="mt-1"
              onChange={handleImageChange}
              type="file"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-md border object-cover"
              />
            )}
          </div>

          <Button
            type="submit"
            className="bg-black hover:bg-black/90"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
