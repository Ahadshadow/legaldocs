"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import { toast } from "../../../../../components/ui/use-toast";
import { Plus } from "lucide-react";
import DataTable from "../../../../../components/admin/data-table";
import { SC } from "../../../../../service/Api/serverCall";
import { CustomPagination } from "../../../../../components/ui/custom-pagination";

export default function CategoriesList() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  });

  useEffect(() => {
    loadCategories(pagination.currentPage);
  }, []);

  const loadCategories = async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await SC.getCall({ url: `categories?page=${page}` });

      // Extract pagination data from response
      const {
        current_page,
        last_page,
        per_page,
        total,
        data: categoriesData,
      } = data.data.data;

      // Update pagination state
      setPagination({
        currentPage: current_page,
        totalPages: last_page,
        perPage: per_page,
        total: total,
      });

      setCategories(categoriesData);
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

  const handlePageChange = (page: number) => {
    loadCategories(page);
  };

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await SC.deleteCall({ url: `categories/${item.slug}` });

        // Reload the current page after deletion
        loadCategories(pagination.currentPage);

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
        router.push(`/admin/categories/edit/${item.slug}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ];

  if (isLoading && pagination.currentPage === 1) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Categories List</h1>
          <Button
            onClick={() => router.push("/admin/categories/add")}
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
          // isLoading={isLoading}
          showPagination={false} // We're using our custom pagination
        />

        {/* Pagination */}
        <div className="mt-6">
          <CustomPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            perPage={pagination.perPage}
            total={pagination.total}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxPageButtons={5}
          />
        </div>
      </div>
    </div>
  );
}
