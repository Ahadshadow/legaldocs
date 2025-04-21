"use client";

import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import Navigation from "../components/navigation";
import ContinueEditing from "../components/continue-editing";
import AuthWrapper from "../lib/AuthWrapper";
import { useEffect } from "react";
// import { useUser } from "../lib/useUser" // assuming this hook gives you the user info
import { Button } from "../components/ui/button";
import { getUserData } from "../lib/utils";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = getUserData(); // You'll need to implement or already have this hook

  const hideNavigation =
    pathname === "/signin" ||
    pathname.includes("user-panel") ||
    pathname.split("/").includes("admin");

  useEffect(() => {
    // if (currentUser?.isAdmin && pathname !== "/admin") {
    //   router.push("/admin")
    // } else
    if (pathname.split("/").includes("admin") && !currentUser?.isAdmin) {
      router.push("/");
    }
  }, [currentUser, pathname, router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>

        <AuthWrapper>
          {!hideNavigation && <Navigation />}
          <ContinueEditing />

          {/* {!hideNavigation && (
            <header className="bg-gray-900 text-white p-4 flex justify-center items-center">
              <div className="flex items-center gap-4">
                <p>Would you like to continue working on your Employee Non-Disclosure Agreement?</p>
                <Button style={{ backgroundColor: "#6366F1", hover: { backgroundColor: "#4F46E5" } }}>
  Continue Editing
</Button>
              </div>
            </header>
          )} */}
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
