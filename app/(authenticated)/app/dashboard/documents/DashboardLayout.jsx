"use client"

import NavHeader, { Sidebar } from "../../../../../components/dashboard"
import { SidebarProvider } from "../../../../../components/context/SidebarContext"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div>
        <NavHeader />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1" style={{overflow: 'hidden'}}>{children}</main>
        </div>
        <style jsx global>{`
          .no-footer footer {
            display: none;
          }
        `}</style>
      </div>
    </SidebarProvider>
  );
}

