import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center text-2xl font-bold text-white tracking-[-0.04em] mb-10"
        >
          EXO
        </Link>
        {children}
      </div>
    </div>
  );
}
