"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TOTAL_STEPS = 5;

function StepDots({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        return (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-500 ${
              isCurrent
                ? "w-6 bg-white"
                : isCompleted
                  ? "w-2 bg-[#5B9BF3]"
                  : "w-2 bg-white/20"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-[-0.05em] text-white hover:opacity-80 transition-opacity"
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
