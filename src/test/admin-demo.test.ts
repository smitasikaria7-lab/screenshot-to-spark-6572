import { describe, expect, it } from "vitest";
import { demoAdmin, isDemoLogin } from "@/lib/admin-demo";

describe("Sample admin login", () => {
  it("accepts the published sample credentials", () => {
    expect(isDemoLogin(demoAdmin.email, demoAdmin.password)).toBe(true);
  });
  it("rejects another password", () => {
    expect(isDemoLogin(demoAdmin.email, "incorrect")).toBe(false);
  });
});