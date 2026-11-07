import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Portfolio, CTA } from "@/components/site/Sections";
import { images } from "@/lib/site";

const title = "Interior Design Portfolio | Ancon Interio, Guwahati";
const description = "Explore residential, commercial, kitchen, bedroom, office and renovation interiors by Ancon Interio in Guwahati, Assam.";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: () => (<><PageHero eyebrow="Portfolio" title="Our Work." img={images.showroom} /><Portfolio /><CTA /></>),
});
