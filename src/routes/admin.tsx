import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, CalendarDays, CheckCircle2, Clock3, FileText, FolderKanban,
  IndianRupee, LayoutDashboard, Loader2, LogOut, Menu, Pencil, Plus,
  Search, Trash2, Truck, Users, UserRound, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({ component: AdminPage });

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
    db.auth.getSession().then(({ data }: any) => {
      if (!alive) return;
      setSession(data.session);
      void verify(data.session);
    }).catch(() => { if (alive) setAuthChecked(true); });
    const { data } = db.auth.onAuthStateChange((_event: string, next: any) => {
      setSession(next);
      void verify(next);
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [verify]);

  const loadCounts = useCallback(async () => {
    const pairs = await Promise.all(Object.entries(modules).map(async ([key, config]) => {
      const { count, error } = await db.from(config.table).select("id", { count: "exact", head: true });
      return [key, error ? 0 : (count ?? 0)] as const;
    }));
    setCounts(Object.fromEntries(pairs));
  }, []);

  const loadRows = useCallback(async () => {
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
  }, [active]);

  useEffect(() => {
    if (authorized) { void loadCounts(); void loadRows(); }
  }, [authorized, loadCounts, loadRows]);

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
    if (active === "overview" || !window.confirm("Delete this record? This cannot be undone.")) return;
    const { error } = await db.from(modules[active].table).delete().eq("id", row.id);
    if (error) setNotice(error.message);
    else { setNotice("Record deleted."); await loadRows(); await loadCounts(); }
  }
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setAuthError("");
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setAuthError(error.message);
    else { setSession(data.session); await verify(data.session); }
  }

  if (!authChecked) return <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0]"><Loader2 className="h-6 w-6 animate-spin text-[#a88a50]" /></div>;
  if (!session || !authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-12 text-[#24221f]">
        <div className="w-full max-w-md border border-[#e4ded2] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-[#a88a50]">Ancon Interio</p>
          <h1 className="mt-4 font-serif text-4xl">Studio Admin</h1>
          <p className="mt-2 text-sm text-[#777168]">Sign in to manage your projects and business operations.</p>
          {!session ? (
            <form onSubmit={signIn} className="mt-8 space-y-5">
              <label className="block text-xs uppercase tracking-widest text-[#777168]">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-[#ded8cc] bg-transparent px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#a88a50]" /></label>
              <label className="block text-xs uppercase tracking-widest text-[#777168]">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-[#ded8cc] bg-transparent px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#a88a50]" /></label>
              {authError && <p className="text-sm text-red-700">{authError}</p>}
              <button disabled={busy} className="flex w-full items-center justify-center gap-2 bg-[#24221f] px-5 py-3 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#a88a50] disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</button>
            </form>
          ) : (
            <div className="mt-8">
              <p className="text-sm text-red-700">This account does not have administrator access.</p>
              <button onClick={() => void db.auth.signOut()} className="mt-5 border border-[#ded8cc] px-4 py-2 text-xs uppercase tracking-widest">Sign out</button>
            </div>
          )}
          <a href="/" className="mt-8 inline-block text-xs text-[#777168] underline underline-offset-4">Back to website</a>
        </div>
      </main>
    );
  }

  const navItems = [
    { key: "overview" as const, label: "Overview", icon: LayoutDashboard },
    ...Object.entries(modules).map(([key, value]) => ({ key: key as ModuleKey, label: value.title, icon: value.icon })),
  ];
  const current = active === "overview" ? null : modules[active];
  const totalSales = rows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const upcoming = rows.filter((row) => row.follow_up_at && String(row.follow_up_at) >= new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#282620]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#e7e1d6] bg-white lg:flex">
        <a href="/" className="border-b border-[#eee9e0] px-7 py-7">
          <span className="block font-serif text-2xl tracking-[0.22em]">ANCON</span><span className="mt-1 block text-[0.58rem] tracking-[0.48em] text-[#a88a50]">INTERIO · ADMIN</span>
        </a>
        <p className="px-7 pb-3 pt-8 text-[0.62rem] uppercase tracking-[0.22em] text-[#a49c8f]">Workspace</p>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.key} onClick={() => { setActive(item.key); setSearch(""); setNotice(""); }} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${active === item.key ? "bg-[#f2eee5] text-[#94743c]" : "text-[#6f6a61] hover:bg-[#faf8f4]"}`}><Icon className="h-4 w-4" />{item.label}{item.key !== "overview" && <span className="ml-auto text-xs text-[#aaa296]">{counts[item.key] ?? 0}</span>}</button>;
          })}
        </nav>
        <div className="mt-auto border-t border-[#eee9e0] p-5">
          <p className="truncate text-xs text-[#777168]">{session.user.email}</p>
          <button onClick={() => void db.auth.signOut()} className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#777168] hover:text-red-700"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e7e1d6] bg-[#f7f5f0]/95 px-5 py-4 backdrop-blur sm:px-8">
          <div><p className="text-[0.62rem] uppercase tracking-[0.25em] text-[#a88a50]">Ancon Interio / Workspace</p><h1 className="mt-1 font-serif text-2xl">{active === "overview" ? "Business Overview" : current?.title}</h1></div>
          <div className="flex items-center gap-3"><span className="hidden text-xs text-[#777168] sm:block">{session.user.email}</span><button onClick={() => void db.auth.signOut()} aria-label="Sign out" className="border border-[#ded8cc] p-2 text-[#777168] hover:text-red-700"><LogOut className="h-4 w-4" /></button></div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navItems.map((item) => <button key={item.key} onClick={() => setActive(item.key)} className={`whitespace-nowrap border px-3 py-2 text-xs ${active === item.key ? "border-[#a88a50] bg-[#a88a50] text-white" : "border-[#ded8cc] bg-white"}`}>{item.label}</button>)}
          </div>
          {notice && <div className="mb-5 flex items-center justify-between border border-[#e5d9bd] bg-[#fbf7ed] px-4 py-3 text-sm text-[#725c32]">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X className="h-4 w-4" /></button></div>}

          {active === "overview" ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#777168]">A quick view of your studio activity.</p><p className="mt-1 text-xs text-[#aaa296]">Keep projects, client conversations and operations in one place.</p></div><button onClick={() => { setActive("projects"); setEditing(null); setForm({}); setModalOpen(true); }} className="flex items-center gap-2 bg-[#282620] px-5 py-3 text-xs uppercase tracking-[0.15em] text-white hover:bg-[#a88a50]"><Plus className="h-4 w-4" /> Add project</button></div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: "Active projects", key: "projects", icon: FolderKanban },
                  { label: "Total leads", key: "leads", icon: UserRound },
                  { label: "Sales records", key: "sales", icon: IndianRupee },
                  { label: "Quotations", key: "quotations", icon: FileText },
                  { label: "Team members", key: "team", icon: Users },
                  { label: "Vendors", key: "vendors", icon: Truck },
                ].map((card) => { const Icon = card.icon; return <button key={card.key} onClick={() => setActive(card.key as ModuleKey)} className="border border-[#e7e1d6] bg-white p-5 text-left transition-shadow hover:shadow-md"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.16em] text-[#888176]">{card.label}</span><Icon className="h-4 w-4 text-[#a88a50]" /></div><p className="mt-5 font-serif text-4xl">{counts[card.key] ?? "—"}</p><span className="mt-3 inline-flex items-center gap-1 text-xs text-[#a88a50]">Open section <ArrowUpRight className="h-3 w-3" /></span></button>; })}
              </div>
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <section className="border border-[#e7e1d6] bg-white"><div className="flex items-center justify-between border-b border-[#eee9e0] px-5 py-4"><div><p className="font-serif text-2xl">Recent enquiries</p><p className="mt-1 text-xs text-[#999184]">Latest website leads</p></div><button onClick={() => setActive("leads")} className="text-xs uppercase tracking-widest text-[#a88a50]">View all</button></div>{rows.length ? <div className="divide-y divide-[#eee9e0]">{rows.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="text-sm">{String(row.name ?? "New enquiry")}</p><p className="mt-1 text-xs text-[#999184]">{String(row.project_type ?? "Project enquiry")} · {String(row.project_location ?? "Location not added")}</p></div><span className="text-xs text-[#999184]">{readableDate(row.created_at)}</span></div>)}</div> : <p className="px-5 py-8 text-sm text-[#999184]">No enquiries yet. Website enquiries will appear here.</p>}</section>
                <section className="border border-[#e7e1d6] bg-white p-5"><p className="font-serif text-2xl">Studio shortcuts</p><div className="mt-5 space-y-2">{navItems.slice(1).map((item) => { const Icon = item.icon; return <button key={item.key} onClick={() => setActive(item.key as ModuleKey)} className="flex w-full items-center gap-3 border-b border-[#f0ece5] py-3 text-left text-sm text-[#5f5a51] hover:text-[#a88a50]"><Icon className="h-4 w-4 text-[#a88a50]" />{item.label}<ArrowUpRight className="ml-auto h-3 w-3" /></button>; })}</div></section>
              </div>
            </>
          ) : current ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#777168]">Manage your {current.title.toLowerCase()} and keep details up to date.</p><p className="mt-1 text-xs text-[#aaa296]">{counts[active] ?? rows.length} records</p></div><button onClick={() => { setEditing(null); setForm({}); setModalOpen(true); }} className="flex items-center gap-2 bg-[#282620] px-5 py-3 text-xs uppercase tracking-[0.15em] text-white hover:bg-[#a88a50]"><Plus className="h-4 w-4" /> Add {current.singular}</button></div>
              <div className="mt-7 border border-[#e7e1d6] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee9e0] p-4"><div className="relative min-w-[220px] flex-1 sm:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa296]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${current.title.toLowerCase()}...`} className="w-full border border-[#e7e1d6] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#a88a50]" /></div><span className="text-xs text-[#999184]">{filtered.length} shown</span></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-[#faf8f4]"><tr>{current.columns.map((col) => <th key={col.key} className="px-5 py-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#8c8579]">{col.label}</th>)}<th className="px-5 py-3 text-right text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#8c8579]">Actions</th></tr></thead><tbody className="divide-y divide-[#eee9e0]">{filtered.map((row) => <tr key={row.id} className="hover:bg-[#fdfcf9]">{current.columns.map((col) => <td key={col.key} className="max-w-[240px] truncate px-5 py-4 text-sm text-[#5f5a51]">{["amount", "budget", "estimated_budget", "monthly_cost"].includes(col.key) ? money(row[col.key]) : col.key.includes("date") || col.key === "follow_up_at" || col.key === "valid_until" ? readableDate(row[col.key]) : String(row[col.key] ?? "—")}</td>)}<td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(row)} aria-label="Edit record" className="border border-[#e7e1d6] p-2 hover:border-[#a88a50] hover:text-[#a88a50]"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => void removeRecord(row)} aria-label="Delete record" className="border border-[#e7e1d6] p-2 hover:border-red-300 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div>
                {!filtered.length && <div className="px-5 py-14 text-center"><p className="font-serif text-2xl">Nothing here yet</p><p className="mt-2 text-sm text-[#999184]">Add your first {current.singular.toLowerCase()} to get started.</p></div>}
              </div>
            </>
          ) : null}
        </main>
      </div>

      {modalOpen && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#211f1b]/55 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <form onSubmit={saveRecord} className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#eee9e0] bg-white px-6 py-5"><div><p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#a88a50]">Ancon Interio · {current.title}</p><h2 className="mt-1 font-serif text-2xl">{editing ? "Edit" : "Add"} {current.singular}</h2></div><button type="button" onClick={() => setModalOpen(false)} aria-label="Close" className="p-2 text-[#777168] hover:text-black"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-5 p-6 sm:grid-cols-2">{current.fields.map((field) => <label key={field.key} className={`block text-[0.65rem] uppercase tracking-[0.15em] text-[#777168] ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>{field.label}{field.options ? <select required={field.required} value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="mt-2 w-full border border-[#ded8cc] bg-white px-3 py-3 text-sm normal-case tracking-normal text-[#282620] outline-none focus:border-[#a88a50]"><option value="">Select...</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea rows={3} value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="mt-2 w-full border border-[#ded8cc] px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#a88a50]" /> : <input required={field.required} type={field.type ?? "text"} value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="mt-2 w-full border border-[#ded8cc] px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#a88a50]" />}</label>)}</div>
            <div className="flex justify-end gap-3 border-t border-[#eee9e0] px-6 py-5"><button type="button" onClick={() => setModalOpen(false)} className="border border-[#ded8cc] px-5 py-3 text-xs uppercase tracking-widest">Cancel</button><button disabled={busy} className="flex items-center gap-2 bg-[#282620] px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-[#a88a50] disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Create record"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
