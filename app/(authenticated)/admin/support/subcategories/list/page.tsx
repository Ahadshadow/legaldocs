"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import DataTable from "../../../components/data-table"
import { Button } from "../../../../../../components/ui/button";
import { toast } from "../../../../../../components/ui/use-toast";
import { Plus } from "lucide-react";
import DataTable from "../../../../../../components/admin/data-table";
import {
  deleteSubCategory,
  getSubCategories,
} from "../../../../../../service/supportSubCategoryService";

export default function SubcategoriesList() {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubcategories = async () => {
    try {
      const data = await getSubCategories();
      setSubcategories(
        data.data.map((item) => {
          return {
            ...item,
            category: item?.category?.name || "N/A",
          };
        }) || []
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subcategories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, []);

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteSubCategory(item.slug);
        loadSubcategories();
        toast({
          title: "Success",
          description: "Subcategory deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete subcategory",
          variant: "destructive",
        });
      }
    }
  };

  const columns = [
    { key: "name", label: "NAME" },
    { key: "category", label: "SUPPORT CATEGORY" },
    { key: "slug", label: "SLUG" },
  ];

  const actions = [
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) =>
        router.push(`/admin/support/subcategories/edit/${item.slug}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center">Loading subcategories...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Support Subcategories List</h1>
          <Button
            onClick={() => router.push("/admin/support/subcategories/add")}
            className="bg-black hover:bg-black/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Subcategory
          </Button>
        </div>

        <DataTable
          title="Subcategories"
          columns={columns}
          data={subcategories}
          actions={actions}
        />
      </div>
    </div>
  );
}
