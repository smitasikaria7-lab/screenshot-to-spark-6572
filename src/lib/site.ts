import hero from "@/assets/hero-living.jpg";
import kitchen from "@/assets/kitchen.jpg";
import bedroom from "@/assets/bedroom.jpg";
import office from "@/assets/office.jpg";
import dining from "@/assets/dining.jpg";
import materials from "@/assets/materials.jpg";
import renovation from "@/assets/renovation.jpg";
import showroom from "@/assets/showroom.jpg";

export const images = { hero, kitchen, bedroom, office, dining, materials, renovation, showroom };

export const PHONE = "6003910929";
export const PHONE_INTL = "916003910929";
export const INSTAGRAM = "ancon_interio";
export const WA_MESSAGE =
  "Hello Ancon Interio, I am interested in your interior design services. I would like to discuss my project.";
export const whatsappUrl = (msg: string = WA_MESSAGE) =>
  `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;

export const services = [
  { slug: "residential", title: "Residential Interior Design", img: hero,
    desc: "Complete home interiors for apartments, villas, independent houses and luxury residences." },
  { slug: "commercial", title: "Commercial Interior Design", img: office,
    desc: "Professional interior solutions for offices, business spaces, showrooms and commercial establishments." },
  { slug: "renovation", title: "Renovation & Remodeling", img: renovation,
    desc: "Transform existing spaces through thoughtful planning, modern design and efficient execution." },
  { slug: "turnkey", title: "Turnkey Interior Solutions", img: kitchen,
    desc: "Complete interior project management, material selection, coordination and execution." },
  { slug: "visualization", title: "2D Layouts & 3D Visualization", img: materials,
    desc: "Detailed floor plans, space planning, furniture layouts and realistic 3D interior visualizations." },
  { slug: "mahavastu", title: "MahaVastu Consultancy", img: dining,
    desc: "Space consultancy focused on the principles of MahaVastu and thoughtful spatial planning." },
  { slug: "consultation", title: "Interior Design Consultation", img: bedroom,
    desc: "Personalized guidance for materials, colours, furniture, layouts and interior design decisions." },
];

export const categories = [
  "All", "Residential Interiors", "Commercial Interiors", "Modern Kitchens", "Luxury Bedrooms",
  "Living & Dining Spaces", "Office Interiors", "Renovation Projects",
] as const;

export type Project = {
  slug: string; title: string; categories: string[]; cover: string; gallery: string[];
  summary: string;
};

// Sample projects — replace titles, images and descriptions with real project information.
export const projects: Project[] = [
  { slug: "urban-rhythms", title: "Urban Rhythms", cover: renovation, gallery: [renovation, hero, dining],
    categories: ["Residential Interiors", "Renovation Projects"],
    summary: "Sample project — a renovated residence with warm wood textures and soft architectural lighting." },
  { slug: "contemporary-residence", title: "Contemporary Residence", cover: hero, gallery: [hero, bedroom, kitchen],
    categories: ["Residential Interiors", "Living & Dining Spaces"],
    summary: "Sample project — a calm, contemporary home in ivory, taupe and stone." },
  { slug: "luxury-living", title: "Luxury Living", cover: bedroom, gallery: [bedroom, dining, hero],
    categories: ["Luxury Bedrooms", "Residential Interiors"],
    summary: "Sample project — a refined master suite with layered textures and brass accents." },
  { slug: "modern-kitchen-transformation", title: "Modern Kitchen Transformation", cover: kitchen, gallery: [kitchen, dining, materials],
    categories: ["Modern Kitchens", "Renovation Projects"],
    summary: "Sample project — a marble-and-brass kitchen designed for everyday function." },
  { slug: "studio-mode", title: "Studio Mode", cover: dining, gallery: [dining, materials, hero],
    categories: ["Living & Dining Spaces"],
    summary: "Sample project — an open living and dining space centred around natural light." },
  { slug: "commercial-workspace", title: "Commercial Workspace", cover: office, gallery: [office, showroom, materials],
    categories: ["Commercial Interiors", "Office Interiors"],
    summary: "Sample project — a professional workspace and reception with understated luxury." },
];

export const whyUs = [
  "15 Years of Interior Design Experience", "Personalized Design Approach",
  "Residential & Commercial Expertise", "Thoughtful Space Planning",
  "Material Selection Assistance", "Design to Execution",
  "Quality-Focused Work", "Complete Project Coordination",
];

export const processSteps = [
  "Understanding Your Vision", "Site Consultation", "Space Planning & Layout",
  "Design Development & 3D Visualization", "Material Selection & Budget Planning",
  "Execution & Coordination", "Final Handover",
];

export const projectTypes = [
  "Residential – Apartment", "Residential – Villa / House", "Commercial – Office",
  "Commercial – Showroom / Retail", "Renovation", "MahaVastu Consultancy", "Other",
];
