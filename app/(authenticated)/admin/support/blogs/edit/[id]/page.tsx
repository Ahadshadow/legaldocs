"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../../../../components/ui/input";
import { Button } from "../../../../../../../components/ui/button";
import { Label } from "../../../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { toast } from "../../../../../../../components/ui/use-toast";
import { getSubCategories } from "../../../../../../../service/supportSubCategoryService";
import {
  getBlog,
  updateBlog,
} from "../../../../../../../service/supportBlogService";
import { Switch } from "../../../../../../../components/ui/switchPanel";
import { RichTextEditor } from "../../../../../../../components/ui/text-editor";

export default function EditBlog({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    popular: false,
    image: null,
    support_sub_category_id: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [subCategoriesData, blogData] = await Promise.all([
        getSubCategories(),
        getBlog(id),
      ]);

      // UPDATING subCATEGORIES
      setSubCategories(subCategoriesData.data || []);

      // UPDATING SUB CATEGORY
      const blog = blogData.data;

      setFormData({
        question: blog.question,
        answer: blog.answer,
        popular: blog.popular,
        image: blog?.image
          ? `https://legaldocs.unibyts.com/storage/${blog?.image}`
          : "",

        support_sub_category_id: blog.support_sub_category_id,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [id, router]);

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
    setSubmissionLoading(true);
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
      await updateBlog(id, form);
      toast({
        title: "Success",
        description: "blog updated successfully",
      });
      router.push("/admin/support/blogs/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setSubmissionLoading(false);
    }
  };
  if (isLoading) {
    return <div className="p-6 text-center">Loading blog...</div>;
  }


  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Support Blog</h1>
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
            {(imagePreview || formData.image) && (
              <img
                src={imagePreview || formData.image}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-md border object-cover"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-black hover:bg-black/90"
              disabled={submissionLoading}
            >
              {submissionLoading ? "Updating..." : "Update"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/support/blogs/list")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
