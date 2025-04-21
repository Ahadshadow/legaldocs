"use client";

import { useSubCategories } from "@/context/subCategoriesContext";
import { getBlogs } from "@/service/supportService";
import { FileText, FolderOpenIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const subCategories = useSubCategories();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadsubCategories = async () => {
      try {
        const data = await getBlogs();

        setBlogs(data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadsubCategories();
  }, []);
  return (
    <div className="grid grid-cols-12 gap-6">
      {subCategories.map((subCategory) => {
        const blogsBySubCategory = blogs.filter(
          (item: any) => item.support_sub_category_id === subCategory._id
        );
        return (
          <div
            key={subCategory?._id}
            className="col-span-12 lg:col-span-6 bg-[#e8f3fe]  p-10 rounded"
          >
            <div className="flex items-center mb-3">
              <FolderOpenIcon size={25} color="#4b62f9" className="mr-2" />
              <h6 className="text-lg font-medium text-[#4b62f9]">
                {subCategory?.name}
              </h6>
              <h6 className="ml-2 text-lg font-medium text-[#4b62f9]">
                ({blogsBySubCategory.length})
              </h6>
            </div>
            <ol className="p-3">
              {blogsBySubCategory.map((blog: any) => {
                return (
                  <li key={blog?._id} className="flex items-center mb-2">
                    <Link
                      className="flex items-center hover:underline text-[#4b62f9]"
                      href={`/help-center/support/${blog?.sub_category?.category?.slug}/${blog?.sub_category?.slug}/${blog.slug}`}
                    >
                      <FileText color="#4b62f9" className="mr-2" size={15} />
                      <span className="text-[#4b62f9] text-sm">
                        {blog?.question}
                        {!blog?.question?.trim().endsWith("?") && "?"}
                      </span>
                    </Link>
                  </li>
                );
              })}

              {blogsBySubCategory.length === 0 && (
                <p className="text-sm">No Result found!</p>
              )}
            </ol>
          </div>
        );
      })}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
