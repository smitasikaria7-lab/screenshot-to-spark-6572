import { Link } from "@tanstack/react-router";
import { Menu, X, Instagram, Phone, MapPin, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { INSTAGRAM, PHONE, whatsappUrl } from "@/lib/site";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/process", label: "Our Process" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "bg-background/95 backdrop-blur border-b border-border py-3" : "bg-transparent py-6"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className={`leading-none ${scrolled || open ? "text-foreground" : "text-ivory"}`} onClick={() => setOpen(false)}>
          <span className="block font-serif text-2xl tracking-[0.25em]">ANCON</span>
          <span className="block text-[0.6rem] tracking-[0.55em] text-gold">INTERIO</span>
        </Link>
        <nav className="hidden items-center gap-5 xl:gap-8 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className={`text-[0.72rem] uppercase tracking-[0.22em] transition-colors hover:text-gold ${scrolled ? "text-foreground" : "text-ivory"}`}
              activeProps={{ className: "!text-gold" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/contact" className={scrolled ? "btn-ink !py-3 !px-5" : "btn-gold !py-3 !px-5"}>Book Consultation</Link>
          <Button asChild variant="ghost" size="sm" className={scrolled ? "text-foreground" : "text-ivory"}><Link to="/admin"><UserRound className="h-4 w-4" /> Admin Login</Link></Button>
        </nav>
        <button className={`lg:hidden ${scrolled || open ? "text-foreground" : "text-ivory"}`} onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border bg-background px-6 py-6" aria-label="Mobile">
          <ul className="space-y-4">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} onClick={() => setOpen(false)} className="font-serif text-2xl text-foreground" activeProps={{ className: "!text-gold" }} activeOptions={{ exact: n.to === "/" }}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <Link to="/contact" onClick={() => setOpen(false)} className="btn-ink mt-6">Book Consultation</Link>
          <Button asChild variant="outline" className="mt-4 flex w-fit"><Link to="/admin" onClick={() => setOpen(false)}><UserRound className="h-4 w-4" /> Admin Login</Link></Button>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl tracking-[0.25em]">ANCON <span className="text-gold">INTERIO</span></p>
          <p className="mt-4 max-w-sm font-serif text-xl italic text-ivory/70">Design with Energy, Decorate with Purpose.</p>
          <p className="mt-6 text-sm text-ivory/60">Turning Houses into Dream Homes — since 2013.</p>
          <div className="mt-8 max-w-md">
            <p className="eyebrow mb-3">Visit Our Studio</p>
            <p className="mb-3 text-sm text-ivory/75">Sample location: Bharalumukh, Guwahati, Assam</p>
            <div className="overflow-hidden border border-ivory/15">
              <iframe
                title="Sample Ancon Interio studio location in Bharalumukh, Guwahati"
                src="https://www.google.com/maps?q=Bharalumukh%2C%20Guwahati%2C%20Assam&output=embed"
                width="100%"
                height="180"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Bharalumukh%2C%20Guwahati%2C%20Assam"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-ivory"
            >
              Get Directions ↗
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-gold">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Studio</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold" /> Guwahati, Assam, India</li>
            <li><a href={`tel:+91${PHONE}`} className="flex gap-2 hover:text-gold"><Phone className="h-4 w-4 text-gold" /> +91 {PHONE}</a></li>
            <li><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-gold"><Instagram className="h-4 w-4 text-gold" /> @{INSTAGRAM}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs tracking-widest text-ivory/50">
        © {new Date().getFullYear()} ANCON INTERIO · Interior Designer in Guwahati
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Chat with Ancon Interio on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ivory shadow-xl transition-transform hover:scale-110">
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 8 4.41zm8.02-17.45A11.27 11.27 0 0 0 2.33 17.66L.73 23.5l5.98-1.57a11.27 11.27 0 0 0 5.34 1.36h.01A11.28 11.28 0 0 0 20.07 4.05z"/></svg>
    </a>
  );
}
