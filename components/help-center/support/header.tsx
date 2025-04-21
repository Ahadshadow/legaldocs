// components/home/header.tsx

"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

const SupportHeader = () => {
  return (
    <Fragment>
      <header
        className=""
        style={{
          backgroundColor: "#e8f3fe",
          width: "100%",
          height: "96px",
          fontFamily: '"Source Sans Pro",',
          fontSize: "16px",
        }}
      >
        <div className="flex justify-between items-center h-full container mx-auto px-2 sm:px-0 ">
          <div className="font-bold text-3xl">
            <Link href="/">legaltemplates.</Link>
          </div>
          <div>
            <Link href="/help-center" className="text-blue-600 hover:underline">
              <ArrowLeftIcon className="inline-block" />
              <span className="hidden sm:inline-block ml-2">
                Back to Help Center
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative">
        <svg
          className="absolute mt-[14px] opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 140"
        >
          <path
            fill="#e8f3fe"
            fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,26.7C320,21,400,11,480,16C560,21,640,43,720,48C800,53,880,43,960,37.3C1040,32,1120,32,1200,48C1280,64,1360,96,1400,112L1440,128L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
        <svg
          className="solid_header_wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 140"
        >
          <path
            fill="#e8f3fe"
            fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,26.7C320,21,400,11,480,16C560,21,640,43,720,48C800,53,880,43,960,37.3C1040,32,1120,32,1200,48C1280,64,1360,96,1400,112L1440,128L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>
    </Fragment>
  );
};

export default SupportHeader;
