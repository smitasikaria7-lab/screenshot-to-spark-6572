import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, CTA } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Reveal";
import { projects } from "@/lib/site";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const p = projects.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { slug: p.slug };
  },
  head: ({ loaderData }) => {
    const p = projects.find((x) => x.slug === loaderData?.slug);
    const title = p ? `${p.title} | Ancon Interio Portfolio` : "Project | Ancon Interio";
    const description = p ? `${p.title} — ${p.categories.join(", ")} by Ancon Interio, Guwahati.` : "Interior design project by Ancon Interio.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] };
  },
  notFoundComponent: () => (
    <div className="py-48 text-center"><h1 className="text-5xl">Project not found</h1><Link to="/portfolio" className="btn-line mt-8">Back to Portfolio</Link></div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useLoaderData();
  const idx = projects.findIndex((x) => x.slug === slug);
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];
  return (
    <>
      <PageHero eyebrow={p.categories.join(" · ")} title={p.title} img={p.cover} />
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <Link to="/portfolio" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:text-gold"><ArrowLeft className="h-4 w-4" /> All Projects</Link>
            <p className="mt-10 text-lg leading-relaxed text-muted-foreground">{p.summary}</p>
            <dl className="mt-10 space-y-4 text-sm">
              <div className="border-t border-border pt-4"><dt className="eyebrow">Category</dt><dd className="mt-1">{p.categories.join(", ")}</dd></div>
              <div className="border-t border-border pt-4"><dt className="eyebrow">Location</dt><dd className="mt-1">To be updated</dd></div>
              <div className="border-t border-border pt-4"><dt className="eyebrow">Scope</dt><dd className="mt-1">To be updated</dd></div>
            </dl>
          </Reveal>
          <div className="grid gap-6">
            {p.gallery.map((g, i) => (
              <Reveal key={i}><img src={g} alt={`${p.title} interior view ${i + 1}`} loading="lazy" className="w-full object-cover" /></Reveal>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-20 max-w-7xl px-6 text-right">
          <Link to="/portfolio/$slug" params={{ slug: next.slug }} className="inline-flex items-center gap-3 font-serif text-3xl hover:text-gold">Next: {next.title} <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>
      <CTA />
    </>
  );
}
