import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, Compass, MapPin, LayoutGrid, Box, Palette, Hammer, KeyRound, Quote, Instagram, Phone, Loader2 } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { images, services, projects, categories, whyUs, processSteps, projectTypes, whatsappUrl, PHONE, INSTAGRAM } from "@/lib/site";
import { submitEnquiry, enquirySchema } from "@/lib/contact.functions";

export function PageHero({ eyebrow, title, img }: { eyebrow: string; title: string; img: string }) {
  return (
    <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-5xl text-ivory md:text-7xl">{title}</h1>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <img src={images.hero} alt="Luxury contemporary living room interior designed by Ancon Interio, Guwahati" width={1920} height={1088}
        className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-20">
        <Reveal>
          <p className="eyebrow">Ancon Interio · Interior Design | Renovation | MahaVastu Consultancy</p>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[1.02] text-ivory sm:text-7xl lg:text-8xl">
            Spaces Designed Around <em className="text-gold">Your Dreams.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ivory/80">
            Thoughtfully designed residential and commercial interiors, combining aesthetics, functionality and purposeful planning.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/portfolio" className="btn-gold">Explore Our Projects <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/contact" className="btn-outline-light">Book a Consultation</Link>
          </div>
          <p className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ivory/70">
            <MapPin className="h-4 w-4 text-gold" /> Guwahati, Assam | Serving Residential & Commercial Clients
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function About({ full = false }: { full?: boolean }) {
  const hl = ["15 Years of Experience", "Residential & Commercial Interiors", "Design, Planning & Execution", "Personalized Consultancy"];
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <Reveal className="relative">
          <img src={images.materials} alt="Interior design material samples and floor plans at the Ancon Interio studio" loading="lazy" width={1200} height={912} className="aspect-[4/5] w-full object-cover" />
          <div className="absolute -bottom-8 -right-4 bg-ink px-8 py-6 text-ivory md:-right-8">
            <p className="font-serif text-6xl text-gold">15</p>
            <p className="text-xs uppercase tracking-[0.25em]">Years of design</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="About the Studio" title="Designing Spaces. Creating Experiences." />
          <Reveal delay={150} className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            <p>At Ancon Interio, we believe every space has a story to tell.</p>
            <p>With 15 years of experience in interior designing, we transform residential and commercial spaces into thoughtfully designed environments that reflect our clients' lifestyle, aspirations and functionality requirements.</p>
            {full && <p>From conceptual planning and material selection to detailed design and execution, we offer a comprehensive interior design experience with a focus on quality, aesthetics and accountability.</p>}
            <p>Our approach combines contemporary design, practical planning and energy-conscious space consultancy to create interiors that are beautiful, functional and meaningful.</p>
          </Reveal>
          <Reveal delay={250}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {hl.map((h) => (
                <li key={h} className="flex items-center gap-3 border-t border-border pt-4 text-sm"><Check className="h-4 w-4 text-gold" />{h}</li>
              ))}
            </ul>
            {!full && <Link to="/about" className="btn-line mt-10">Our Story <ArrowRight className="h-4 w-4" /></Link>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Founder() {
  return (
    <section className="bg-secondary py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="eyebrow">The Founder</p>
          <h2 className="mt-5 text-5xl">Smithaa Bidawatka</h2>
          <p className="mt-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">Interior Designer | MahaVastu Consultant</p>
          <span className="gold-rule mx-auto mt-8" />
          <p className="mt-8 font-serif text-3xl italic leading-snug">"You bring the dream. We bring the design, planning, and execution."</p>
          <p className="mt-6 text-muted-foreground">Designing interiors for 15 years and leading Ancon Interio since 2013.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Services({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <section className="bg-secondary py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="What We Do" title="Our Services" />
          {limit && <Link to="/services" className="btn-line">All Services <ArrowRight className="h-4 w-4" /></Link>}
        </div>
        <div className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 100} className="group bg-card">
              <article id={s.slug} className="flex h-full flex-col scroll-mt-28">
                <div className="overflow-hidden">
                  <img src={s.img} alt={`${s.title} by Ancon Interio, Guwahati`} loading="lazy" width={1200} height={912}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="font-serif text-gold text-lg">0{i + 1}</p>
                  <h3 className="mt-2 text-3xl">{s.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em]">
                    <Link to="/services" hash={s.slug} className="flex items-center gap-2 hover:text-gold">Learn More <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    <Link to="/contact" className="text-gold hover:text-foreground">Book Consultation</Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Portfolio({ withFilters = true, limit }: { withFilters?: boolean; limit?: number }) {
  const [cat, setCat] = useState<string>("All");
  let list = cat === "All" ? projects : projects.filter((p) => p.categories.includes(cat));
  if (limit) list = list.slice(0, limit);
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Portfolio" title="Spaces That Speak for Themselves." />
        {withFilters && (
          <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                className={`border px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${cat === c ? "border-ink bg-ink text-ivory" : "border-border hover:border-gold"}`}>
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }}
              className={`group relative block overflow-hidden ${i % 3 === 0 ? "lg:row-span-2" : ""}`}>
              <img src={p.cover} alt={`${p.title} — ${p.categories[0]} by Ancon Interio`} loading="lazy" width={1200} height={912}
                className={`w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 ${i % 3 === 0 ? "aspect-[3/4] lg:h-full" : "aspect-[4/3]"}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <p className="eyebrow">{p.categories[0]}</p>
                <h3 className="mt-2 flex items-center justify-between text-3xl">{p.title}<ArrowUpRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></h3>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && <p className="mt-12 text-muted-foreground">Projects in this category will be added soon.</p>}
        {limit && <div className="mt-14 text-center"><Link to="/portfolio" className="btn-line">View Full Portfolio <ArrowRight className="h-4 w-4" /></Link></div>}
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="bg-ink py-28 text-ivory md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading eyebrow="Why Ancon Interio" title="Your Vision. Our Responsibility." light />
          <Reveal delay={150}>
            <p className="mt-8 font-serif text-2xl italic leading-snug text-ivory/80">
              "We believe great interiors are not just about beautiful designs. They are about thoughtful planning, the right materials, responsible execution and creating spaces that genuinely work for you."
            </p>
          </Reveal>
        </div>
        <div className="grid gap-px bg-ivory/10 sm:grid-cols-2">
          {whyUs.map((w, i) => (
            <Reveal key={w} delay={(i % 2) * 100} className="bg-ink p-8">
              <p className="font-serif text-3xl text-gold">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-lg">{w}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const stepIcons = [Compass, MapPin, LayoutGrid, Box, Palette, Hammer, KeyRound];
export function Process() {
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="How We Work" title="Our Design Process" />
        <ol className="relative mt-16 border-l border-border md:ml-6">
          {processSteps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <Reveal key={s} delay={i * 60}>
                <li className="relative grid gap-4 pb-12 pl-10 md:grid-cols-[120px_1fr] md:pl-16">
                  <span className="absolute -left-5 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-background text-gold">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="font-serif text-5xl text-gold/70">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="self-center text-3xl">{s}</h3>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const placeholderTestimonials = [
  { text: "Placeholder testimonial — replace with a genuine client review describing their experience with Ancon Interio.", who: "Client Name", role: "Residential Client, Guwahati" },
  { text: "Placeholder testimonial — add a real quote from a commercial client about the design and execution process.", who: "Client Name", role: "Commercial Client" },
  { text: "Placeholder testimonial — share a genuine review about planning, materials and project coordination.", who: "Client Name", role: "Renovation Client" },
];
export function Testimonials() {
  const [i, setI] = useState(0);
  const t = placeholderTestimonials[i];
  const n = placeholderTestimonials.length;
  return (
    <section className="bg-secondary py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" center />
        <Reveal delay={150}>
          <Quote className="mx-auto mt-12 h-10 w-10 text-gold" aria-hidden="true" />
          <p className="mt-6 min-h-[8rem] font-serif text-3xl italic leading-snug">{t.text}</p>
          <p className="mt-8 text-sm uppercase tracking-[0.25em]">{t.who}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t.role}</p>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-taupe">Sample placeholder · not a real review</p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink hover:bg-ink hover:text-ivory"><ArrowLeft className="h-4 w-4" /></button>
            <span className="text-xs tracking-[0.3em]">{i + 1} / {n}</span>
            <button onClick={() => setI((i + 1) % n)} aria-label="Next testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink hover:bg-ink hover:text-ivory"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative overflow-hidden py-36">
      <img src={images.bedroom} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow">Begin Your Project</p>
        <h2 className="mt-6 text-5xl text-ivory md:text-7xl">Ready to Transform Your Space?</h2>
        <p className="mt-6 text-lg text-ivory/80">Let's discuss your vision and create an interior that reflects your lifestyle, personality and aspirations.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-gold">Book a Consultation</Link>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-outline-light">Chat on WhatsApp</a>
        </div>
      </Reveal>
    </section>
  );
}

type FormState = Record<"name" | "phone" | "email" | "project_type" | "project_area" | "project_location" | "message", string>;
const empty: FormState = { name: "", phone: "", email: "", project_type: "", project_area: "", project_location: "", message: "" };

function ContactForm() {
  const [f, setF] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = enquirySchema.safeParse(f);
    if (!r.success) {
      const errs: typeof errors = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as keyof FormState] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await submitEnquiry({ data: r.data });
      setStatus("ok");
      setF(empty);
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full border-0 border-b border-input bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none";
  const label = "text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground";
  const Err = ({ k }: { k: keyof FormState }) => errors[k] ? <p className="mt-1 text-xs text-destructive">{errors[k]}</p> : null;

  if (status === "ok") {
    return (
      <div className="border border-gold p-10 text-center" role="status">
        <Check className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-4 text-3xl">Thank you.</h3>
        <p className="mt-3 text-muted-foreground">Your enquiry has been received. For a quicker response, you can also message us on WhatsApp.</p>
        <button onClick={() => setStatus("idle")} className="btn-line mt-8">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
      <div><label htmlFor="name" className={label}>Name *</label><input id="name" className={field} value={f.name} onChange={set("name")} autoComplete="name" /><Err k="name" /></div>
      <div><label htmlFor="phone" className={label}>Phone number *</label><input id="phone" type="tel" className={field} value={f.phone} onChange={set("phone")} autoComplete="tel" /><Err k="phone" /></div>
      <div><label htmlFor="email" className={label}>Email</label><input id="email" type="email" className={field} value={f.email} onChange={set("email")} autoComplete="email" /><Err k="email" /></div>
      <div>
        <label htmlFor="ptype" className={label}>Project type *</label>
        <select id="ptype" className={field} value={f.project_type} onChange={set("project_type")}>
          <option value="">Select…</option>
          {projectTypes.map((p) => <option key={p}>{p}</option>)}
        </select><Err k="project_type" />
      </div>
      <div><label htmlFor="area" className={label}>Approx. project area (sq ft)</label><input id="area" className={field} value={f.project_area} onChange={set("project_area")} /></div>
      <div><label htmlFor="loc" className={label}>Project location</label><input id="loc" className={field} value={f.project_location} onChange={set("project_location")} /></div>
      <div className="sm:col-span-2"><label htmlFor="msg" className={label}>Message</label><textarea id="msg" rows={4} className={field} value={f.message} onChange={set("message")} /></div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "loading"} className="btn-ink disabled:opacity-60">
          {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Send Enquiry <ArrowRight className="h-4 w-4" /></>}
        </button>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-line">Enquire on WhatsApp</a>
        {status === "error" && <p className="w-full text-sm text-destructive" role="alert">Sorry, your enquiry could not be sent. Please try again or contact us on WhatsApp.</p>}
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading eyebrow="Get in Touch" title="Let's Create Something Beautiful." />
          <Reveal delay={150} className="mt-10 space-y-2">
            <p className="font-serif text-2xl tracking-[0.2em]">ANCON INTERIO</p>
            <p className="text-lg">Smithaa Bidawatka</p>
            <p className="text-sm text-muted-foreground">Interior Designer | MahaVastu Consultant</p>
            <p className="text-sm text-muted-foreground">Guwahati, Assam, India</p>
            <div className="space-y-3 pt-6 text-sm">
              <a href={`tel:+91${PHONE}`} className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold" /> +91 {PHONE}</a>
              <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold"><Instagram className="h-4 w-4 text-gold" /> @{INSTAGRAM}</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100}><ContactForm /></Reveal>
      </div>
      <div className="mx-auto mt-24 max-w-7xl px-6">
        <iframe title="Map of Guwahati, Assam" src="https://www.google.com/maps?q=Guwahati,Assam,India&output=embed" loading="lazy"
          className="h-[380px] w-full border-0 grayscale-[60%]" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}
