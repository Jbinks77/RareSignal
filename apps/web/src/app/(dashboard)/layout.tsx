"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { PortfolioProvider } from "@/lib/portfolio-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortfolioProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-[240px] transition-all duration-300">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </PortfolioProvider>
  );
}
