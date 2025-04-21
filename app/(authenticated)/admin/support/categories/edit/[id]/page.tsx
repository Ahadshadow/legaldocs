"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../../../../components/ui/input";
import { Button } from "../../../../../../../components/ui/button";
import { Label } from "../../../../../../../components/ui/label";
import { toast } from "../../../../../../../components/ui/use-toast";
import {
  getCategory,
  updateCategory,
} from "../../../../../../../service/supportCategoryService";

export default function EditCategory({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const { data: category } = await getCategory(id);
        setFormData({
          name: category.name,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        });
      }
    };

    loadCategory();
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
      await updateCategory(id, formData);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      router.push("/admin/support/categories/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Support Category</h1>

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
              onClick={() => router.push("/admin/support/categories/list")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
