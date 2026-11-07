import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, CalendarDays, CheckCircle2, Clock3, FileText, FolderKanban,
  IndianRupee, LayoutDashboard, Loader2, LogOut, Menu, Pencil, Plus,
  Search, Trash2, Truck, Users, UserRound, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { demoAdmin, demoProjects, isDemoLogin } from "@/lib/admin-demo";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Studio Admin Login | Ancon Interio" },
    { name: "description", content: "Sign in to the Ancon Interio studio workspace or explore the read-only sample." },
    { property: "og:title", content: "Studio Admin Login | Ancon Interio" },
    { property: "og:description", content: "Ancon Interio studio administration and sample workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminPage,
});

type Field = { key: string; label: string; type?: string; required?: boolean; options?: string[] };
type ModuleKey = "projects" | "leads" | "sales" | "quotations" | "team" | "vendors";
type RowData = Record<string, unknown> & { id: string };

const modules: Record<ModuleKey, { title: string; singular: string; table: string; icon: typeof FolderKanban; fields: Field[]; columns: { key: string; label: string }[] }> = {
  projects: {
    title: "Projects", singular: "Project", table: "business_projects", icon: FolderKanban,
    fields: [
      { key: "project_name", label: "Project name", required: true },
      { key: "client_name", label: "Client name", required: true },
      { key: "project_type", label: "Project type", options: ["Residential", "Commercial", "Renovation", "MahaVastu", "Consultation"] },
      { key: "location", label: "Location" },
      { key: "budget", label: "Project value (₹)", type: "number" },
      { key: "status", label: "Status", options: ["Enquiry", "Planning", "Design", "Quotation", "Execution", "On Hold", "Completed"] },
      { key: "start_date", label: "Start date", type: "date" },
      { key: "target_date", label: "Target completion", type: "date" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [{ key: "project_name", label: "Project" }, { key: "client_name", label: "Client" }, { key: "project_type", label: "Type" }, { key: "status", label: "Status" }, { key: "budget", label: "Value" }],
  },
  leads: {
    title: "Leads", singular: "Lead", table: "contact_submissions", icon: UserRound,
    fields: [
      { key: "name", label: "Contact name", required: true }, { key: "phone", label: "Phone", required: true },
      { key: "email", label: "Email", type: "email" }, { key: "project_type", label: "Requirement" },
      { key: "project_location", label: "Project location" }, { key: "project_area", label: "Area (sq ft)" },
      { key: "lead_status", label: "Lead status", options: ["New", "Contacted", "Site Visit", "Proposal Sent", "Negotiation", "Won", "Lost"] },
      { key: "follow_up_at", label: "Next follow-up", type: "date" }, { key: "estimated_budget", label: "Estimated budget (₹)", type: "number" },
      { key: "assigned_to", label: "Assigned to" }, { key: "message", label: "Enquiry notes", type: "textarea" },
    ],
    columns: [{ key: "name", label: "Lead" }, { key: "phone", label: "Phone" }, { key: "project_type", label: "Requirement" }, { key: "lead_status", label: "Status" }, { key: "follow_up_at", label: "Follow-up" }],
  },
  sales: {
    title: "Sales", singular: "Sale", table: "sales_records", icon: IndianRupee,
    fields: [
      { key: "client_name", label: "Client name", required: true }, { key: "project_name", label: "Project", required: true },
      { key: "amount", label: "Sale amount (₹)", type: "number", required: true },
      { key: "payment_status", label: "Payment status", options: ["Pending", "Part Payment", "Paid", "Overdue"] },
      { key: "invoice_date", label: "Invoice date", type: "date" }, { key: "due_date", label: "Due date", type: "date" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [{ key: "client_name", label: "Client" }, { key: "project_name", label: "Project" }, { key: "amount", label: "Amount" }, { key: "payment_status", label: "Payment" }, { key: "due_date", label: "Due date" }],
  },
  quotations: {
    title: "Quotations", singular: "Quotation", table: "quotations", icon: FileText,
    fields: [
      { key: "quotation_no", label: "Quotation number", required: true }, { key: "client_name", label: "Client name", required: true },
      { key: "project_name", label: "Project", required: true }, { key: "amount", label: "Quotation value (₹)", type: "number", required: true },
      { key: "status", label: "Status", options: ["Draft", "Sent", "Viewed", "Approved", "Rejected", "Expired"] },
      { key: "valid_until", label: "Valid until", type: "date" }, { key: "notes", label: "Scope / notes", type: "textarea" },
    ],
    columns: [{ key: "quotation_no", label: "Quote #" }, { key: "client_name", label: "Client" }, { key: "project_name", label: "Project" }, { key: "amount", label: "Value" }, { key: "status", label: "Status" }],
  },
  team: {
    title: "Team", singular: "Team member", table: "team_members", icon: Users,
    fields: [
      { key: "name", label: "Full name", required: true }, { key: "role", label: "Role / designation", required: true },
      { key: "phone", label: "Phone" }, { key: "email", label: "Email", type: "email" },
      { key: "monthly_cost", label: "Monthly cost (₹)", type: "number" },
      { key: "status", label: "Status", options: ["Active", "On Leave", "Inactive"] }, { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "phone", label: "Phone" }, { key: "status", label: "Status" }],
  },
  vendors: {
    title: "Vendors", singular: "Vendor", table: "vendors", icon: Truck,
    fields: [
      { key: "company_name", label: "Company / vendor name", required: true }, { key: "contact_name", label: "Contact person" },
      { key: "category", label: "Category", options: ["Carpentry", "Electrical", "Plumbing", "Painting", "Civil", "Furniture", "Materials", "Fabrication", "Other"] },
      { key: "phone", label: "Phone" }, { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Address" }, { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [{ key: "company_name", label: "Vendor" }, { key: "contact_name", label: "Contact" }, { key: "category", label: "Category" }, { key: "phone", label: "Phone" }],
  },
};

const money = (value: unknown) => value === null || value === undefined || value === "" ? "—" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value));
const readableDate = (value: unknown) => value ? new Date(String(value)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const db = supabase as unknown as { from: (table: string) => any; auth: typeof supabase.auth; rpc: (fn: string) => Promise<{ data: unknown; error: { message: string } | null }> };

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [demo, setDemo] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<ModuleKey | "overview">("overview");
  const [rows, setRows] = useState<RowData[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RowData | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  const verify = useCallback(async (current: any) => {
    if (!current) { setAuthorized(false); setAuthChecked(true); return; }
    const { data, error } = await db.rpc("is_ancon_admin");
    setAuthorized(!error && data === true);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    let alive = true;
    db.auth.getUser().then(({ data }: any) => {
      if (!alive) return;
      const current = data.user ? { user: data.user } : null;
      setSession(current);
      void verify(current);
    }).catch(() => { if (alive) setAuthChecked(true); });
    const { data } = db.auth.onAuthStateChange((_event: string, next: any) => {
      setSession(next);
      setTimeout(() => void verify(next), 0);
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [verify]);

  const loadCounts = useCallback(async () => {
    if (demo) { setCounts({ projects: 1, leads: 0, sales: 0, quotations: 0, team: 0, vendors: 0 }); return; }
    const pairs = await Promise.all(Object.entries(modules).map(async ([key, config]) => {
      const { count, error } = await db.from(config.table).select("id", { count: "exact", head: true });
      return [key, error ? 0 : (count ?? 0)] as const;
    }));
    setCounts(Object.fromEntries(pairs));
  }, [demo]);

  const loadRows = useCallback(async () => {
    if (demo) { setRows(active === "projects" ? demoProjects : []); return; }
    if (active === "overview") {
      const { data } = await db.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(6);
      setRows((data ?? []) as RowData[]);
      return;
    }
    const config = modules[active];
    const sortKey = active === "leads" ? "created_at" : "created_at";
    const { data, error } = await db.from(config.table).select("*").order(sortKey, { ascending: false });
    if (error) { setNotice(error.message); setRows([]); return; }
    setRows((data ?? []) as RowData[]);
  }, [active, demo]);

  useEffect(() => {
    if (authorized || demo) { void loadCounts(); void loadRows(); }
  }, [authorized, demo, loadCounts, loadRows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(q)));
  }, [rows, search]);

  function openNew() {
    if (active === "overview") setActive("projects");
    setEditing(null); setForm({}); setModalOpen(true);
  }
  function openEdit(row: RowData) {
    setEditing(row);
    const config = modules[active as ModuleKey];
    setForm(Object.fromEntries(config.fields.map((field) => [field.key, row[field.key] == null ? "" : String(row[field.key]).slice(0, 10)])));
    setModalOpen(true);
  }
  async function saveRecord(event: React.FormEvent) {
    event.preventDefault();
    if (demo) { setNotice("Sample workspace is read-only. No changes were saved."); return; }
    if (active === "overview") return;
    setBusy(true); setNotice("");
    const config = modules[active];
    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const value = form[field.key]?.trim() ?? "";
      payload[field.key] = field.type === "number" ? (value ? Number(value) : null) : (value || null);
    }
    const result = editing
      ? await db.from(config.table).update(payload).eq("id", editing.id)
      : await db.from(config.table).insert(payload);
    setBusy(false);
    if (result.error) { setNotice(result.error.message); return; }
    setModalOpen(false); setNotice(config.singular + " saved successfully.");
    await loadRows(); await loadCounts();
  }
  async function removeRecord(row: RowData) {
    if (demo) { setNotice("Sample workspace is read-only. No records were deleted."); return; }
    if (active === "overview" || !window.confirm("Delete this record? This cannot be undone.")) return;
    const { error } = await db.from(modules[active].table).delete().eq("id", row.id);
    if (error) setNotice(error.message);
    else { setNotice("Record deleted."); await loadRows(); await loadCounts(); }
  }
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setAuthError("");
    if (isDemoLogin(email, password)) { setDemo(true); setBusy(false); setRows([]); return; }
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setAuthError(error.message);
    else { setSession(data.session); await verify(data.session); }
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    setRows([]); setCounts({}); setAuthorized(false); setDemo(false); setModalOpen(false);
    setActive("overview"); setPassword(""); setNotice("");
    if (!demo) { await db.auth.signOut(); setSession(null); }
    await navigate({ to: "/admin", replace: true });
  }

  if (!authChecked) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;
  if (!demo && (!session || !authorized)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
        <div className="w-full max-w-md border border-border bg-card p-8 shadow-sm sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Ancon Interio</p>
          <h1 className="mt-4 font-serif text-4xl">Studio Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your projects and business operations.</p>
          {!session ? (
            <form onSubmit={signIn} className="mt-8 space-y-5">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-border bg-transparent px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-ring" /></label>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-border bg-transparent px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-ring" /></label>
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button disabled={busy} className="w-full uppercase">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</Button>
            </form>
          ) : (
            <div className="mt-8">
              <p className="text-sm text-destructive">This account does not have administrator access.</p>
              <Button onClick={() => void signOut()} variant="outline" className="mt-5">Sign out</Button>
            </div>
          )}
          <div className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Sample login · Read-only demo</p>
            <p className="mt-2 break-all">Email: {demoAdmin.email}</p>
            <p className="mt-1">Password: {demoAdmin.password}</p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => { setEmail(demoAdmin.email); setPassword(demoAdmin.password); setDemo(true); setRows([]); }}>Open sample workspace</Button>
          </div>
          <a href="/" className="mt-8 inline-block text-xs text-muted-foreground underline underline-offset-4">Back to website</a>
        </div>
      </main>
    );
  }

  const navItems = [
    { key: "overview" as const, label: "Overview", icon: LayoutDashboard },
    ...Object.entries(modules).map(([key, value]) => ({ key: key as ModuleKey, label: value.title, icon: value.icon })),
  ];
  const current = active === "overview" ? null : modules[active];
  const accountLabel = demo ? "Sample admin · Read-only" : session?.user?.email;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <a href="/" className="border-b border-border px-7 py-7">
          <span className="block font-serif text-2xl tracking-[0.22em]">ANCON</span><span className="mt-1 block text-[0.58rem] tracking-[0.48em] text-gold">INTERIO · ADMIN</span>
        </a>
        <p className="px-7 pb-3 pt-8 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">Workspace</p>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <Button key={item.key} onClick={() => { setActive(item.key); setSearch(""); setNotice(""); }} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${active === item.key ? "bg-background text-gold" : "text-muted-foreground hover:bg-background"}`}><Icon className="h-4 w-4" />{item.label}{item.key !== "overview" && <span className="ml-auto text-xs text-muted-foreground">{counts[item.key] ?? 0}</span>}</Button>;
          })}
        </nav>
        <div className="mt-auto border-t border-border p-5">
          <p className="truncate text-xs text-muted-foreground">{accountLabel}</p>
          <Button onClick={() => void signOut()} className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive"><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-8">
          <div><p className="text-[0.62rem] uppercase tracking-[0.25em] text-gold">Ancon Interio / Workspace</p><h1 className="mt-1 font-serif text-2xl">{active === "overview" ? "Business Overview" : current?.title}</h1></div>
          <div className="flex items-center gap-3"><span className="hidden text-xs text-muted-foreground sm:block">{accountLabel}</span><Button onClick={() => void signOut()} aria-label="Sign out" className="border border-border p-2 text-muted-foreground hover:text-destructive"><LogOut className="h-4 w-4" /></Button></div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navItems.map((item) => <Button key={item.key} onClick={() => setActive(item.key)} className={`whitespace-nowrap border px-3 py-2 text-xs ${active === item.key ? "border-ring bg-accent text-primary-foreground" : "border-border bg-card"}`}>{item.label}</Button>)}
          </div>
          {notice && <div className="mb-5 flex items-center justify-between border border-border bg-background px-4 py-3 text-sm text-gold">{notice}<Button onClick={() => setNotice("")} aria-label="Dismiss"><X className="h-4 w-4" /></Button></div>}

          {active === "overview" ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">A quick view of your studio activity.</p><p className="mt-1 text-xs text-muted-foreground">Keep projects, client conversations and operations in one place.</p></div><Button onClick={() => { setActive("projects"); setEditing(null); setForm({}); setModalOpen(true); }} className="flex items-center gap-2 bg-primary px-5 py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:bg-accent"><Plus className="h-4 w-4" /> Add project</Button></div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: "Active projects", key: "projects", icon: FolderKanban },
                  { label: "Total leads", key: "leads", icon: UserRound },
                  { label: "Sales records", key: "sales", icon: IndianRupee },
                  { label: "Quotations", key: "quotations", icon: FileText },
                  { label: "Team members", key: "team", icon: Users },
                  { label: "Vendors", key: "vendors", icon: Truck },
                ].map((card) => { const Icon = card.icon; return <Button key={card.key} onClick={() => setActive(card.key as ModuleKey)} className="border border-border bg-card p-5 text-left transition-shadow hover:shadow-md"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{card.label}</span><Icon className="h-4 w-4 text-gold" /></div><p className="mt-5 font-serif text-4xl">{counts[card.key] ?? "—"}</p><span className="mt-3 inline-flex items-center gap-1 text-xs text-gold">Open section <ArrowUpRight className="h-3 w-3" /></span></Button>; })}
              </div>
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <section className="border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><p className="font-serif text-2xl">Recent enquiries</p><p className="mt-1 text-xs text-muted-foreground">Latest website leads</p></div><Button onClick={() => setActive("leads")} className="text-xs uppercase tracking-widest text-gold">View all</Button></div>{rows.length ? <div className="divide-y divide-border">{rows.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="text-sm">{String(row["name"] ?? "New enquiry")}</p><p className="mt-1 text-xs text-muted-foreground">{String(row["project_type"] ?? "Project enquiry")} · {String(row["project_location"] ?? "Location not added")}</p></div><span className="text-xs text-muted-foreground">{readableDate(row["created_at"])}</span></div>)}</div> : <p className="px-5 py-8 text-sm text-muted-foreground">No enquiries yet. Website enquiries will appear here.</p>}</section>
                <section className="border border-border bg-card p-5"><p className="font-serif text-2xl">Studio shortcuts</p><div className="mt-5 space-y-2">{navItems.slice(1).map((item) => { const Icon = item.icon; return <Button key={item.key} onClick={() => setActive(item.key as ModuleKey)} className="flex w-full items-center gap-3 border-b border-border py-3 text-left text-sm text-foreground hover:text-gold"><Icon className="h-4 w-4 text-gold" />{item.label}<ArrowUpRight className="ml-auto h-3 w-3" /></Button>; })}</div></section>
              </div>
            </>
          ) : current ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Manage your {current.title.toLowerCase()} and keep details up to date.</p><p className="mt-1 text-xs text-muted-foreground">{counts[active] ?? rows.length} records</p></div><Button onClick={() => { setEditing(null); setForm({}); setModalOpen(true); }} className="flex items-center gap-2 bg-primary px-5 py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:bg-accent"><Plus className="h-4 w-4" /> Add {current.singular}</Button></div>
              <div className="mt-7 border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4"><div className="relative min-w-[220px] flex-1 sm:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${current.title.toLowerCase()}...`} className="w-full border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ring" /></div><span className="text-xs text-muted-foreground">{filtered.length} shown</span></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-background"><tr>{current.columns.map((col) => <th key={col.key} className="px-5 py-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">{col.label}</th>)}<th className="px-5 py-3 text-right text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">Actions</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((row) => <tr key={row.id} className="hover:bg-background">{current.columns.map((col) => <td key={col.key} className="max-w-[240px] truncate px-5 py-4 text-sm text-foreground">{["amount", "budget", "estimated_budget", "monthly_cost"].includes(col.key) ? money(row[col.key]) : col.key.includes("date") || col.key === "follow_up_at" || col.key === "valid_until" ? readableDate(row[col.key]) : String(row[col.key] ?? "—")}</td>)}<td className="px-5 py-4"><div className="flex justify-end gap-2"><Button onClick={() => openEdit(row)} aria-label="Edit record" className="border border-border p-2 hover:border-ring hover:text-gold"><Pencil className="h-3.5 w-3.5" /></Button><Button onClick={() => void removeRecord(row)} aria-label="Delete record" className="border border-border p-2 hover:border-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></div></td></tr>)}</tbody></table></div>
                {!filtered.length && <div className="px-5 py-14 text-center"><p className="font-serif text-2xl">Nothing here yet</p><p className="mt-2 text-sm text-muted-foreground">Add your first {current.singular.toLowerCase()} to get started.</p></div>}
              </div>
            </>
          ) : null}
        </main>
      </div>

      {modalOpen && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-primary/55 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <form onSubmit={saveRecord} className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-card shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-5"><div><p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Ancon Interio · {current.title}</p><h2 className="mt-1 font-serif text-2xl">{editing ? "Edit" : "Add"} {current.singular}</h2></div><Button type="button" onClick={() => setModalOpen(false)} aria-label="Close" className="p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></Button></div>
            <div className="grid gap-5 p-6 sm:grid-cols-2">{current.fields.map((field) => <label key={field.key} className={`block text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>{field.label}{field.options ? <select required={field.required} value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="mt-2 w-full border border-border bg-card px-3 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-ring"><option value="">Select...</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea rows={3} value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="mt-2 w-full border border-border px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-ring" /> : <input required={field.required} type={field.type ?? "text"} value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="mt-2 w-full border border-border px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-ring" />}</label>)}</div>
            <div className="flex justify-end gap-3 border-t border-border px-6 py-5"><Button type="button" onClick={() => setModalOpen(false)} className="border border-border px-5 py-3 text-xs uppercase tracking-widest">Cancel</Button><Button disabled={busy} className="flex items-center gap-2 bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-accent disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Create record"}</Button></div>
          </form>
        </div>
      )}
    </div>
  );
}
