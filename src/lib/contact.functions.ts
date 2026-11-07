import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{10,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255).or(z.literal("")),
  project_type: z.string().trim().min(1, "Select a project type").max(100),
  project_area: z.string().trim().max(100),
  project_location: z.string().trim().max(200),
  message: z.string().trim().max(2000),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => enquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      ...data,
      email: data.email || null,
    });
    if (error) throw new Error("Could not save enquiry");
    return { ok: true };
  });
