import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Contact } from "@/components/site/Sections";
import { images } from "@/lib/site";

const title = "Contact Ancon Interio | Book an Interior Design Consultation in Guwahati";
const description = "Book a consultation with Ancon Interio — interior designer and MahaVastu consultant in Guwahati, Assam. Call or WhatsApp +91 6003910929.";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: () => (<><PageHero eyebrow="Contact" title="Book a Consultation." img={images.hero} /><Contact /></>),
});
