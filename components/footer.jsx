"use client";
import { Button } from "../components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const hideNavigation = pathname.includes("help-center");

  return (
    <footer
      className={`bg-[#1E2B3A] text-white ${hideNavigation ? "hidden" : ""}`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Get Your Free Legal Forms Today
            </h2>
            <p className="text-gray-400 mb-6">
              Don't waste your time with complex and costly legal services...
            </p>
            {/* <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6]">
              Get Started
            </Button> */}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-gray-700">
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              {/* <li><Link href="#" className="text-gray-400 hover:text-white">Careers</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              {/* <li><Link href="#" className="text-gray-400 hover:text-white">Cookie Policy</Link></li> */}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-4">
              <Image
                src="/placeholder.svg"
                alt="McAfee"
                width={80}
                height={30}
                className="h-8 object-contain"
              />
              <Image
                src="/placeholder.svg"
                alt="Trustpilot"
                width={80}
                height={30}
                className="h-8 object-contain"
              />
              <Image
                src="/placeholder.svg"
                alt="BBB"
                width={80}
                height={30}
                className="h-8 object-contain"
              />
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>f
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>t
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
