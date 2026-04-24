import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center text-2xl font-bold text-foreground tracking-[-0.04em] mb-10"
        >
          EXO
        </Link>
        {children}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
