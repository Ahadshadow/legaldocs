"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../../components/ui/button";
import { toast } from "../../../../../../components/ui/use-toast";
import { Plus } from "lucide-react";
import DataTable from "../../../../../../components/admin/data-table";
import {
  deleteCategory,
  getCategories,
} from "../../../../../../service/supportCategoryService";

export default function CategoriesList() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
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
    loadCategories();
  }, []);

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteCategory(item.slug);
        loadCategories();
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  const columns = [
    { key: "name", label: "NAME" },
    { key: "slug", label: "SLUG" },
  ];

  const actions = [
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) =>
        router.push(`/admin/support/categories/edit/${item.slug}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Support Categories List</h1>
          <Button
            onClick={() => router.push("/admin/support/categories/add")}
            className="bg-black hover:bg-black/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        <DataTable
          title="Categories"
          columns={columns}
          data={categories}
          actions={actions}
          showPagination={false}
        />
      </div>
    </div>
  );
}
