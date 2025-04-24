"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../../../components/ui/input";
import { Button } from "../../../../../../components/ui/button";
import { Label } from "../../../../../../components/ui/label";
import { SC } from "../../../../../../service/Api/serverCall";
import { useToast } from "@/adminComponents/ui/use-toast";

export default function EditCategory({ params }: { params: { id: string } }) {
  const { toast } = useToast()

  const router = useRouter();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  const fetchCategory = async () => {
    try {
      const data = await SC.getCall({ url: `categories/${id}` });

      setFormData({
        name: data.data.data.name,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await SC.putCall({
        url: `categories/${id}`,
        data: formData,
      });

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      router.push("/admin/categories/list");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Category</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Category Name"
              className="mt-1"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-black hover:bg-black/90"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories/list")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
