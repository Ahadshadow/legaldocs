"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import DataTable from "../../../components/data-table"
import { Button } from "../../../../../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../../../../../components/admin/data-table";
import {
  deleteBlog,
  getBlogs,
} from "../../../../../../service/supportBlogService";
import { useToast } from "@/adminComponents/ui/use-toast";

export default function BlogsList() {
  const { toast } = useToast()

  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(
        data.data?.map((item) => {
          return {
            ...item,
            image: `https://legaldocs.unibyts.com/storage/${item?.image}` || "",
            sub_category: item?.sub_category?.name || "N/A",
            popular: item?.popular ? "Yes" : "No",
          };
        }) || []
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (item: any) => {
    if (
      window &&
      window.confirm(`Are you sure you want to delete ${item.question}?`)
    ) {
      try {
        await deleteBlog(item.slug);
        loadBlogs();
        toast({
          title: "Success",
          description: "blog deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        });
      }
    }
  };
  const stripHtmlTags = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const columns = [
    { key: "question", label: "QUESTION" },
    {
      key: "answer",
      label: "ANSWER",
      render: (value) => {
        const plainText = stripHtmlTags(value);

        return (
          <div
            className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
            title={plainText}
          >
            {plainText}
          </div>
        );
      },
    },
    {
      key: "image",
      label: "Image",
      render: (value) => {
        return value ? (
          <img src={value} alt="image" className="w-4 h-4 rounded " />
        ) : (
          "N/A"
        );
      },
    },
    { key: "sub_category", label: "SUPPORT SUB CATEGORY" },
    { key: "popular", label: "Popular" },
    { key: "slug", label: "SLUG" },
  ];

  const actions = [
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) =>
        router.push(`/admin/support/blogs/edit/${item.slug}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center">Loading blogs...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Support blogs List</h1>
          <Button
            onClick={() => router.push("/admin/support/blogs/add")}
            className="bg-black hover:bg-black/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add blog
          </Button>
        </div>

        <DataTable
          title="blogs"
          columns={columns}
          data={blogs}
          actions={actions}
        />
      </div>
    </div>
  );
}
