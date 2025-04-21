"use client";

import SupportNav from "@/components/help-center/support/header";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function SupportLayout({ children }) {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter((seg) => seg !== "");
    const supportIndex = segments.indexOf("support");
    const afterSupport = segments.slice(supportIndex + 1);

    let link = "/help-center/support";

    const newBreadcrumbs = afterSupport.map((segment, index) => {
      const isLastItem = index === afterSupport.length - 1;

      const cleanTitle = segment
        .replace(/-\w{8,}$/, "") // remove trailing IDs
        .replace(/[-\d]+$/, "") // remove numeric suffixes
        .replace(/-/g, " ") // convert dashes to spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // title case

      link += `/${segment}`;

      return {
        title: cleanTitle,
        link,
        isLastItem,
      };
    });

    setBreadcrumbs(newBreadcrumbs);
  }, [pathname]);

  return (
    <section className="flex flex-col">
      <SupportNav />
      <div className="text-sm text-blue-600 flex items-center mb-10 -mt-5 z-50 container mx-auto px-2 sm:px-0 ">
        <Link href="/help-center" className="hover:underline">
          Help Center
        </Link>
        {breadcrumbs.map(({ title, link, isLastItem }, index) => (
          <Fragment key={index}>
            <ChevronRight />
            {isLastItem ? (
              <p className="text-black">{title}</p>
            ) : (
              <Link href={link} className="hover:underline">
                {title}
              </Link>
            )}
          </Fragment>
        ))}
      </div>
      <div className="flex-grow">{children}</div>
    </section>
  );
}
