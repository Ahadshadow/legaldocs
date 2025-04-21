"use client";

import {
  getBlogsBySubCategory,
  getSubCategory,
} from "@/service/supportService";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function SubCategoryPage() {
  const params = useParams();

  const subCategory = params.subcategory;
  const category = params.category;
  const [subCategoryData, setSubCategoryData] = useState<any>(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const myPromises = [
        getSubCategory(subCategory),
        getBlogsBySubCategory(subCategory),
      ];
      const [catData, blogsData] = await Promise.all(myPromises);

      setSubCategoryData(catData.data || null);
      setBlogs(blogsData.data || []);
      return;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (subCategory) loadData();
  }, [subCategory]);

  return (
    <Fragment>
      <h1 className="text-2xl font-bold mb-2">{subCategoryData?.name}</h1>

      <div className="bg-[#e8f3fe] p-8 rounded">
        <ol className="p-3">
          {blogs.map((blog: any) => {
            return (
              <li key={blog?._id} className="flex items-center mb-2">
                <Link
                  className="flex items-center hover:underline text-[#4b62f9]"
                  href={`/help-center/support/${category}/${subCategory}/${blog.slug}`}
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
          {blogs.length === 0 && <p className="text-sm">No Result found!</p>}
        </ol>
      </div>
    </Fragment>
  );
}
