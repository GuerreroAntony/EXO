import Hero from "@/components/Hero";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="relative z-10">
        <CTA />
      </div>
    </main>
  );
}
