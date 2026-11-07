import { createFileRoute } from "@tanstack/react-router";
import { PageHero, About, Founder, WhyUs, CTA } from "@/components/site/Sections";
import { images } from "@/lib/site";

const title = "About Ancon Interio | Interior Designer in Guwahati since 2013";
const description = "Meet Ancon Interio, founded by Smithaa Bidawatka — 15 years of residential and commercial interior design and MahaVastu consultancy in Guwahati, Assam.";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: () => (<><PageHero eyebrow="About Us" title="Turning Houses into Dream Homes." img={images.dining} /><About full /><Founder /><WhyUs /><CTA /></>),
});
