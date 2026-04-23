"use client";

import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-[-0.05em] text-foreground hover:opacity-80 transition-opacity"
        >
          EXO
        </Link>
      </header>

      {/* Content area */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
