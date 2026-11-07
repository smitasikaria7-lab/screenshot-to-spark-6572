import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Services, Process, CTA } from "@/components/site/Sections";
import { images } from "@/lib/site";

const title = "Interior Design Services in Guwahati | Ancon Interio";
const description = "Residential and commercial interior design, renovation, turnkey interiors, 2D layouts, 3D visualization and MahaVastu consultancy in Guwahati, Assam.";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: () => (<><PageHero eyebrow="Services" title="Design, Planning & Execution." img={images.kitchen} /><Services /><Process /><CTA /></>),
});
