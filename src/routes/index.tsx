import { createFileRoute } from "@tanstack/react-router";
import { Hero, About, Services, Portfolio, WhyUs, Process, Testimonials, CTA, Contact } from "@/components/site/Sections";

const title = "Ancon Interio | Premium Interior Designer in Guwahati, Assam";
const description = "Ancon Interio offers premium residential and commercial interior design, renovation, turnkey solutions, 2D layouts, 3D visualization and MahaVastu consultancy in Guwahati, Assam.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: () => (
    <>
      <Hero /><About /><Services /><Portfolio /><WhyUs /><Process /><Testimonials /><CTA /><Contact />
    </>
  ),
});
