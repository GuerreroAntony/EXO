"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 lg:ml-64 min-h-0">
        {/* Mobile topbar */}
        <div className="flex items-center h-14 px-4 border-b border-white/5 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <Menu size={22} />
          </button>
          <span className="ml-3 text-white font-semibold text-sm">EXO Admin</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
