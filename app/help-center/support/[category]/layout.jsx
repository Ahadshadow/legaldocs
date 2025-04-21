"use client";

import { getSubCategoriesByCategory } from "@/service/supportService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubCategoryContext } from "@/context/subCategoriesContext";

export default function CategoryLayout({ children }) {
  const params = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const subCategorySlug = params.subcategory;
  useEffect(() => {
    if (params.category) {
      const loadSubCategories = async () => {
        try {
          const data = await getSubCategoriesByCategory(params.category);
          setSubCategories(data.data || []);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      loadSubCategories();
    }
  }, [params]);

  return (
    <SubCategoryContext.Provider value={subCategories}>
      <section className="grid grid-cols-12 gap-8 container mx-auto px-2 sm:px-0 ">
        <div className="col-span-12 md:col-span-3">
          <h6 className="text-lg font-semibold text-black mb-3">
            Portal Sub Categories
          </h6>
          <div className="flex flex-col">
            {subCategories.map((item, index) => {
              const isActiveSub = item?.slug === subCategorySlug;
              return (
                <Link
                  key={index}
                  className={`bg-[#e8f3fe] hover:bg-[#4b62f9] w p-3 text-sm rounded text-[#0072ed]  hover:text-white mb-2 ${
                    item?.slug === subCategorySlug
                      ? "!bg-[#4b62f9] !text-white"
                      : ""
                  }`}
                  href={`/help-center/support/${params.category}/${item?.slug}`}
                >
                  {item.name}
                </Link>
              );
            })}
            {isLoading && <p>Loading...</p>}
          </div>
        </div>
        <div className="col-span-12 md:col-span-9">{children}</div>
      </section>
    </SubCategoryContext.Provider>
  );
}
