import Link from "next/link";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Regular Menu", href: "/menu" },
  { name: "Build Your Own", href: "/builder" },
  { name: "My Account", href: "/account" },
  { name: "About", href: "/#about" },
];

export function Footer() {
  return (
    <footer className="border-t border-soft-grey bg-white px-6 pt-16 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start md:items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal">
              <span className="text-[10px] font-bold text-white tracking-tighter">
                CB
              </span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-charcoal">
              Casa Bowl
            </span>
          </div>

          <nav className="flex flex-col md:flex-row gap-6 md:gap-8 text-sm font-medium text-charcoal/70">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-deep-lavender transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-soft-grey pt-8 flex flex-col md:flex-row gap-12 justify-between">
          <p className="text-sm text-charcoal/50">
            Casa Bowl — demonstration project. Prices are demo content. Bowl
            and ingredient photography by{" "}
            <span className="font-medium text-charcoal/80">Pexels contributors</span>.
          </p>
          <p className="text-sm text-charcoal/50 text-right md:text-right">
            No real contact details published.
          </p>
        </div>
      </div>
    </footer>
  );
}
