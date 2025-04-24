"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { toast } from "../../../../../components/ui/use-toast";
import { SC } from "../../../../../service/Api/serverCall";


export default function AddCategory() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    // slug: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const createCategory = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await SC.postCall({ url: "categories", data: formData });

      toast({
        title: "Success",
        description: "Category created successfully",
      });
      router.push("/admin/categories/list");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add Category</h1>

        <form className="space-y-6" onSubmit={createCategory}>
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
