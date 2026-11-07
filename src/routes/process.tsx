import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Process, CTA } from "@/components/site/Sections";
import { images } from "@/lib/site";

const title = "Our Design Process | Ancon Interio, Guwahati";
const description = "From understanding your vision to final handover — the seven-step interior design process at Ancon Interio, Guwahati.";

export const Route = createFileRoute("/process")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: () => (<><PageHero eyebrow="Our Process" title="From Vision to Handover." img={images.materials} /><Process /><CTA /></>),
});
