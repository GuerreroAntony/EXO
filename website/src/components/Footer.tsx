import Link from "next/link";

const cols = {
  Soluções: [
    { label: "Call Center", href: "/callcenter" },
    { label: "Influencers Virtuais", href: "/inteligencia-virtual" },
    { label: "Digital Workers", href: "/digital-workers" },
    { label: "Robótica", href: "/robotica" },
  ],
  Empresa: [
    { label: "Sobre", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreiras", href: "#" },
  ],
  Legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos", href: "#" },
    { label: "LGPD", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="text-2xl font-black tracking-[-0.05em] text-white">
              EXO
            </Link>
            <p className="mt-4 text-sm text-white/45 leading-relaxed max-w-xs">
              A próxima evolução do trabalho humano.
            </p>
          </div>
          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[13px] font-medium text-white/40 uppercase tracking-wider mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/45 hover:text-white/50 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="line-fade my-12" />
        <p className="text-[12px] text-white/30 text-center">
          &copy; {new Date().getFullYear()} EXO. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
