"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative  text-white">
      <div className="relative -mb-[10px]">
        <svg
          className="absolute -mb-[20px] bottom-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 250"
        >
          <path
            className="opacity-20"
            fillOpacity="1"
            fill="#0f172a"
            d="M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,170.7C672,171,768,117,864,80C960,43,1056,21,1152,32C1248,43,1344,85,1392,106.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="relative -mb-[10px] mt-[30px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 210"
        >
          <path
            fillOpacity="1"
            fill="#0f172a"
            d="M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,170.7C672,171,768,117,864,80C960,43,1056,21,1152,32C1248,43,1344,85,1392,106.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="bg-[#0f172a] px-6 md:px-12 pt-16 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-sm text-gray-300">
          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-base tracking-wide">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-white text-white font-semibold text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white text-white font-semibold text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-base tracking-wide">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-white text-sm font-semibold"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white text-sm font-semibold"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white text-sm font-semibold"
                >
                  Email
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-base tracking-wide">
              Follow Us
            </h3>
            <div className="flex items-center space-x-4">
              <Link href="#">
                <div className="border border-white/30 p-2 rounded hover:bg-white/10 text-white">
                  <Facebook size={16} />
                </div>
              </Link>
              <Link href="#">
                <div className="border border-white/30 p-2 rounded hover:bg-white/10 text-white">
                  <Twitter size={16} />
                </div>
              </Link>
              <Link href="#">
                <div className="border border-white/30 p-2 rounded hover:bg-white/10 text-white">
                  <Linkedin size={16} />
                </div>
              </Link>
              <Link href="#">
                <div className="border border-white/30 p-2 rounded hover:bg-white/10 text-white">
                  <Youtube size={16} />
                </div>
              </Link>
            </div>
          </div>
        </div>
        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400">
          © Copyright 2025 Legal Templates LLC. All Rights Reserved.
        </p>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
