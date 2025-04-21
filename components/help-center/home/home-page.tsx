"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { Header } from "./header";
import { getCategories, getPopularBlogs } from "@/service/supportService";
import SearchField from "../search-field";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredQuestions, setFeaturedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadPopularBlogs = async () => {
      try {
        const data = await getPopularBlogs();
        setFeaturedQuestions(data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    loadPopularBlogs();
  }, []);
  return (
    <div className="min-h-screen">
      <div className="h-32 bg-[#f0f7ff]">
        <Header />
      </div>
      <section className="relative bg-blue-50 px-4 text-center overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="max-w-3xl mx-auto z-10 relative min-h-[400px]  md:min-h-[600px] mt-20">
            <h1
              className="font-bold text-2xl sm:text-4xl lg:text-6xl text-[#292929] leading-snug text-center"
              style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
            >
              How can we help you today?
            </h1>
            <p
              style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
              className="mx-auto mb-[30px] text-md md:text-xl lg:text-2xl font-light leading-[1.5] max-w-[600px] text-[#264966]"
            >
              Search for answers to your questions by entering keywords below,
              or look through our knowledge base.
            </p>

            <SearchField />
          </div>
        </div>

        {/* SVG Waves */}
        <svg
          className="absolute bottom-0 left-0 w-full aries_waves opacity_layer z-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 275"
        >
          <path
            fill="#e8f3fe"
            fillOpacity="1"
            d="M0,64L60,64C120,64,240,64,360,101.3C480,139,600,213,720,229.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full aries_waves solid_wave z-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 250"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L60,64C120,64,240,64,360,101.3C480,139,600,213,720,229.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </section>
      {isLoading ? (
        <div className="text-center py-10">Loading support resources...</div>
      ) : (
        <>
          {/* Categories Section */}
          <section className="-mt-[60px] md:-mt-[150px] px-6 md:px-12 pb-20 z-10 relative">
            <div className="max-w-[1300px] w-[90%] mx-auto portal-container">
              <div className="flex justify-center items-center flex-wrap gap-4">
                {categories.map((category: any) => (
                  <Link
                    key={category._id}
                    href={`/help-center/support/${category.slug}`}
                    className="w-[300px] h-[150px]"
                  >
                    <Card className="group h-full transition-all bg-white border-[2px] border-[rgba(75,98,249,0.25)] rounded-[0.5em] hover:border-[#4b62f9] hover:shadow-md p-1">
                      <CardHeader className="h-full rounded-[0.5em] flex justify-center items-center group-hover:bg-[#f5f8ff] transition-all">
                        <CardTitle className="h-full flex justify-center items-center text-xl font-semibold text-[#292929] group-hover:text-[#4b62f9] transition-all">
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white py-16 px-12 mb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className=" text-2xl sm:text-4xl lg:text-6xl font-bold text-center text-gray-800 mb-12">
                Most Popular Articles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredQuestions.map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/help-center/support/${article?.sub_category?.category?.slug}/${article?.sub_category?.slug}/${article.slug}`}
                  >
                    <div className="p-6 border bg-white border border-[#ddd] rounded-[7px] p-[30px] shadow-[0_2px_48px_0_rgba(0,0,0,0.06)] transition-shadow bg-white hover:shadow-md transition-all h-full flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {article.question}
                        </h3>
                      </div>
                      <p
                        dangerouslySetInnerHTML={{ __html: article.answer }}
                        className="text-sm text-gray-500 mt-1 line-clamp-2 overflow-hidden text-ellipsis"
                      />
                      <div className="text-blue-500 text-sm flex items-center hover:underline">
                        Read More <ArrowRightIcon className="ml-1 w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="px-6 md:px-12 -mb-20 z-10 relative">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className=" text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-4">
            Here to help you
          </h2>
          <p className="text-gray-600">Our support team is available 24/7</p>
        </div>

        <div className="w-full flex justify-center  items-center">
          <div className="border-2 bg-white border-[#4b62f940] rounded help-box transition-all w-[573px] h-[182px] hover:border-[#4b62f9] group p-1 ">
            <a
              href="mailto:support@example.com"
              className="flex flex-col items-center justify-center rounded  transition-all w-full h-full group-hover:bg-[#f5f8ff] px-2"
            >
              <Mail
                size={40}
                className="mb-2 text-[#94a6f3] group-hover:text-[#4b62f9]"
              />
              <p className="text-black text-lg font-semibold group-hover:text-[#4b62f9]">
                Email
              </p>
              <span className="truncate text-black">
                Email us with your customer support inquiry.
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
