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
import { getCategories } from "../../../../../../../service/supportCategoryService";
import {
  getSubCategory,
  updateSubCategory,
} from "../../../../../../../service/supportSubCategoryService";
import { useToast } from "@/adminComponents/ui/use-toast";

export default function EditSubcategory({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast()

  const { id } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    support_category_id: "",
  });

  const loadData = async () => {
    try {
      const [categoriesData, subcategoriesData] = await Promise.all([
        getCategories(),
        getSubCategory(id),
      ]);

      // UPDATING CATEGORIES
      setCategories(categoriesData.data || []);
      // UPDATING SUB CATEGORY
      const subcategory = subcategoriesData.data || {};

      setFormData({
        name: subcategory.name,
        support_category_id: subcategory.support_category_id,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
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

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      support_category_id: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSubCategory(id, formData);
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
      router.push("/admin/support/subcategories/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subcategory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Support Subcategory</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.support_category_id}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Subcategory Name"
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
              onClick={() => router.push("/admin/support/subcategories/list")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
