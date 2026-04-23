import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preload particles.js so it's ready when the component mounts */}
      <link
        rel="preload"
        href="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        as="script"
      />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
