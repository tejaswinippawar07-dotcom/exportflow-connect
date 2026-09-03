import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  BarChart3,
  Bell,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CloudUpload,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  Gauge,
  Globe2,
  Inbox,
  LayoutDashboard,
  ListFilter,
  Mail,
  MailCheck,
  Menu,
  MoreHorizontal,
  PackageSearch,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExportFlow | Buyer discovery and outreach" },
      { name: "description", content: "Discover export buyers, qualify leads, and manage outreach from one focused workspace." },
      { property: "og:title", content: "ExportFlow | Buyer discovery and outreach" },
      { property: "og:description", content: "A focused workspace for export buyer discovery, lead qualification, and campaign tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExportFlow,
});

type View = "dashboard" | "buyers" | "discover" | "ai" | "campaigns" | "logs" | "reports" | "settings";
type Status = "VALID" | "INVALID" | "INCOMPLETE" | "DUPLICATE" | "ALREADY CONTACTED";
type ContactStatus = "Not contacted" | "Sent" | "Failed" | "Skipped";
type Classification = "Importer" | "Distributor" | "Wholesaler" | "Retailer" | "Business buyer" | "Individual buyer";

type Buyer = {
  id: number;
  name: string;
  company: string;
  email: string;
  website: string;
  country: string;
  source: string;
  type: string;
  product: string;
  category: string;
  classification: Classification | null;
  priority: "High" | "Low" | null;
  status: Status;
  contact: ContactStatus;
  created: string;
  lastContacted: string | null;
  demo: boolean;
  reason?: string;
};

type Log = {
  id: number;
  buyerId: number;
  buyer: string;
  company: string;
  email: string;
  country: string;
  product: string;
  source: string;
  status: "SENT" | "FAILED" | "SKIPPED - ALREADY CONTACTED";
  classification: Classification | null;
  attachment: boolean;
  campaign: string;
  date: string;
  error?: string;
};

const demoBuyers: Buyer[] = [
  { id: 1, name: "Anna Weber", company: "Nordlicht Home GmbH", email: "anna@nordlicht-home.de", website: "nordlicht-home.de", country: "Germany", source: "Business directory", type: "Importer", product: "Singing Bowls", category: "Wellness & handicrafts", classification: "Importer", priority: "High", status: "VALID", contact: "Not contacted", created: "12 Aug 2026", lastContacted: null, demo: true, reason: "The company lists international sourcing and wellness product imports." },
  { id: 2, name: "Michael Carter", company: "Cedar & Clay Trading", email: "michael@cedarclay.co", website: "cedarclay.co", country: "USA", source: "Company website", type: "Distributor", product: "Handmade Home Decor", category: "Home decor", classification: "Distributor", priority: "High", status: "VALID", contact: "Sent", created: "11 Aug 2026", lastContacted: "18 Aug 2026", demo: true, reason: "A multi-state distribution network matches the export profile." },
  { id: 3, name: "Sophie Laurent", company: "Maison Arbre", email: "bonjour@maisonarbre.fr", website: "maisonarbre.fr", country: "France", source: "Trade portal", type: "Retailer", product: "Indian Handicrafts", category: "Handicrafts", classification: "Retailer", priority: "Low", status: "VALID", contact: "Not contacted", created: "10 Aug 2026", lastContacted: null, demo: true, reason: "A boutique retail assortment suggests a smaller but relevant opportunity." },
  { id: 4, name: "Oliver Hughes", company: "Hearth & Vessel Ltd", email: "oliver@hearthvessel.co.uk", website: "hearthvessel.co.uk", country: "UK", source: "LinkedIn", type: "Wholesaler", product: "Singing Bowls", category: "Wellness & handicrafts", classification: "Wholesaler", priority: "High", status: "VALID", contact: "Not contacted", created: "09 Aug 2026", lastContacted: null, demo: true, reason: "Wholesale catalog and trade-only purchasing language indicate strong fit." },
  { id: 5, name: "Sarah Bennett", company: "Pacific Living Co.", email: "sarah@pacificliving.au", website: "pacificliving.au", country: "Australia", source: "Google search", type: "Business buyer", product: "Handmade Home Decor", category: "Home decor", classification: null, priority: null, status: "INCOMPLETE", contact: "Not contacted", created: "08 Aug 2026", lastContacted: null, demo: true },
  { id: 6, name: "Ahmed Al Mansouri", company: "Gulf Craft House", email: "ahmed@gulfcraft.ae", website: "gulfcraft.ae", country: "UAE", source: "Facebook", type: "Importer", product: "Indian Handicrafts", category: "Handicrafts", classification: "Importer", priority: "High", status: "VALID", contact: "Not contacted", created: "07 Aug 2026", lastContacted: null, demo: true, reason: "The profile references regional import and wholesale partnerships." },
  { id: 7, name: "Marie Dubois", company: "L'Atelier des Sens", email: "marie@atelier-sens.fr", website: "atelier-sens.fr", country: "France", source: "Company website", type: "Retailer", product: "Singing Bowls", category: "Wellness & handicrafts", classification: "Retailer", priority: "Low", status: "ALREADY CONTACTED", contact: "Sent", created: "06 Aug 2026", lastContacted: "20 Aug 2026", demo: true, reason: "Previously contacted record retained to demonstrate send protection." },
  { id: 8, name: "Daniel Wong", company: "Eastbridge Imports", email: "not-an-email", website: "", country: "Canada", source: "Trade portal", type: "Importer", product: "Singing Bowls", category: "Wellness & handicrafts", classification: null, priority: null, status: "INVALID", contact: "Not contacted", created: "05 Aug 2026", lastContacted: null, demo: true },
  { id: 9, name: "Emma Rossi", company: "Casa Viva SRL", email: "emma@casaviva.it", website: "casaviva.it", country: "Italy", source: "Business directory", type: "Wholesaler", product: "Indian Handicrafts", category: "Handicrafts", classification: null, priority: null, status: "VALID", contact: "Not contacted", created: "04 Aug 2026", lastContacted: null, demo: true },
  { id: 10, name: "Anna Weber", company: "Nordlicht Home GmbH", email: "ANNA@NORDLICHT-HOME.DE", website: "nordlicht-home.de", country: "Germany", source: "Google search", type: "Importer", product: "Singing Bowls", category: "Wellness & handicrafts", classification: null, priority: null, status: "DUPLICATE", contact: "Not contacted", created: "03 Aug 2026", lastContacted: null, demo: true },
];

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "buyers", label: "Buyers", icon: Users },
  { id: "discover", label: "Discover buyers", icon: Globe2 },
  { id: "ai", label: "AI classification", icon: Bot },
  { id: "campaigns", label: "Campaigns", icon: Send },
  { id: "logs", label: "Email logs", icon: Mail },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

function ExportFlow() {
  const [view, setView] = useState<View>("dashboard");
  const [buyers, setBuyers] = useState<Buyer[]>(demoBuyers);
  const [logs, setLogs] = useState<Log[]>([
    { id: 1, buyerId: 2, buyer: "Michael Carter", company: "Cedar & Clay Trading", email: "michael@cedarclay.co", country: "USA", product: "Handmade Home Decor", source: "Company website", status: "SENT", classification: "Distributor", attachment: true, campaign: "Q3 Singing Bowls — North America", date: "18 Aug 2026, 10:42" },
    { id: 2, buyerId: 7, buyer: "Marie Dubois", company: "L'Atelier des Sens", email: "marie@atelier-sens.fr", country: "France", product: "Singing Bowls", source: "Company website", status: "SKIPPED - ALREADY CONTACTED", classification: "Retailer", attachment: false, campaign: "Q3 Singing Bowls — Europe", date: "20 Aug 2026, 09:12" },
  ]);
  const [activeCampaign, setActiveCampaign] = useState({ name: "Q3 Singing Bowls — Europe", product: "Singing Bowls", subject: "Export Partnership Opportunity – Singing Bowls", body: "Dear {{Buyer Name}},\n\nI hope this email finds you well.\n\nWe came across {{Company Name}} while researching businesses involved in the import, distribution, or sale of {{Product Name}}.\n\nWe would like to introduce our company and explore a potential business partnership with your organization.\n\nPlease find our company presentation and product information attached for your review.\n\nBest Regards,\nTejaswini Pawar\nExportFlow", audience: ["Importer", "Distributor", "Wholesaler"], limit: 25, delay: 30, status: "Ready", attachment: "ExportFlow company presentation.pdf" });
  const [mobileNav, setMobileNav] = useState(false);
  const [showAddBuyer, setShowAddBuyer] = useState(false);
  const [showPreview, setShowPreview] = useState<Buyer | null>(null);

  const metrics = useMemo(() => ({
    total: buyers.length,
    valid: buyers.filter((b) => b.status === "VALID").length,
    invalid: buyers.filter((b) => b.status === "INVALID").length,
    incomplete: buyers.filter((b) => b.status === "INCOMPLETE").length,
    duplicates: buyers.filter((b) => b.status === "DUPLICATE").length,
    high: buyers.filter((b) => b.priority === "High").length,
    low: buyers.filter((b) => b.priority === "Low").length,
    sent: logs.filter((l) => l.status === "SENT").length,
    failed: logs.filter((l) => l.status === "FAILED").length,
    skipped: logs.filter((l) => l.status.startsWith("SKIPPED")).length,
  }), [buyers, logs]);

  function classifyBuyer(id: number) {
    setBuyers((current) => current.map((buyer) => {
      if (buyer.id !== id) return buyer;
      const type = buyer.type.toLowerCase();
      const classification = type.includes("import") ? "Importer" : type.includes("distribut") ? "Distributor" : type.includes("whole") ? "Wholesaler" : type.includes("retail") ? "Retailer" : type.includes("individual") ? "Individual buyer" : "Business buyer";
      const priority = ["importer", "distributor", "wholesaler"].some((word) => type.includes(word)) && buyer.status === "VALID" ? "High" : "Low";
      return { ...buyer, classification, priority, reason: `The ${buyer.type.toLowerCase()} profile and product relevance suggest a ${classification.toLowerCase()} opportunity.`, status: buyer.status === "INCOMPLETE" ? "INCOMPLETE" : buyer.status };
    }));
    toast.success("Lead classified", { description: "The buyer profile was evaluated and prioritized." });
  }

  function classifyAll() {
    buyers.filter((buyer) => !buyer.classification && buyer.status !== "INVALID" && buyer.status !== "DUPLICATE").forEach((buyer) => classifyBuyer(buyer.id));
    toast.success("Classification queue complete", { description: "Eligible buyer records now have a classification and priority." });
  }

  function validateData() {
    const seen = new Set<string>();
    setBuyers((current) => current.map((buyer) => {
      const normalized = buyer.email.trim().toLowerCase();
      if (!buyer.name || !buyer.company || !buyer.country || !buyer.product) return { ...buyer, status: "INCOMPLETE" };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return { ...buyer, status: "INVALID" };
      if (seen.has(normalized)) return { ...buyer, status: "DUPLICATE" };
      seen.add(normalized);
      return { ...buyer, email: normalized, status: buyer.contact === "Sent" ? "ALREADY CONTACTED" : "VALID" };
    }));
    toast.success("Buyer data validated", { description: "Email formats, required fields, duplicate emails, and contact history were checked." });
  }

  function runCampaign() {
    const eligible = buyers.filter((buyer) => buyer.status === "VALID" && buyer.contact !== "Sent" && buyer.email && (activeCampaign.audience.length === 0 || activeCampaign.audience.includes(buyer.classification ?? buyer.type)));
    if (!eligible.length) {
      toast.error("No eligible buyers", { description: "Validate records and choose an audience before running this campaign." });
      return;
    }
    const now = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const campaignLogs: Log[] = [];
    eligible.slice(0, activeCampaign.limit).forEach((buyer, index) => {
      const duplicate = logs.some((log) => log.buyerId === buyer.id && log.campaign === activeCampaign.name);
      if (duplicate || buyer.contact === "Sent") {
        campaignLogs.push({ id: Date.now() + index, buyerId: buyer.id, buyer: buyer.name, company: buyer.company, email: buyer.email, country: buyer.country, product: buyer.product, source: buyer.source, status: "SKIPPED - ALREADY CONTACTED", classification: buyer.classification, attachment: false, campaign: activeCampaign.name, date: now });
      } else {
        campaignLogs.push({ id: Date.now() + index, buyerId: buyer.id, buyer: buyer.name, company: buyer.company, email: buyer.email, country: buyer.country, product: buyer.product, source: buyer.source, status: "SENT", classification: buyer.classification, attachment: Boolean(activeCampaign.attachment), campaign: activeCampaign.name, date: now });
      }
    });
    setLogs((current) => [...campaignLogs, ...current]);
    setBuyers((current) => current.map((buyer) => campaignLogs.some((log) => log.buyerId === buyer.id && log.status === "SENT") ? { ...buyer, contact: "Sent", status: "ALREADY CONTACTED", lastContacted: now } : buyer));
    setActiveCampaign((campaign) => ({ ...campaign, status: "Completed" }));
    toast.success("Campaign completed", { description: `${campaignLogs.filter((log) => log.status === "SENT").length} emails marked sent in safe demo mode.` });
  }

  function exportCsv(rows: Record<string, unknown>[], fileName: string) {
    const headers = Object.keys(rows[0] ?? {});
    const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = fileName; link.click(); URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
      const headers = lines.shift()?.split(",").map((header) => header.trim().toLowerCase()) ?? [];
      const imported = lines.map((line, index) => {
        const values = line.split(",").map((value) => value.replace(/^"|"$/g, "").trim());
        const row = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""]));
        return { id: Date.now() + index, name: row["buyer name"] || row.name || "", company: row["company name"] || row.company || "", email: row.email || "", website: row.website || "", country: row.country || "", source: row.source || "CSV import", type: row["business type"] || row.type || "Business buyer", product: row.product || "Singing Bowls", category: row["product category"] || "", classification: null, priority: null, status: "INCOMPLETE" as Status, contact: "Not contacted" as ContactStatus, created: "03 Sep 2026", lastContacted: null, demo: false };
      });
      setBuyers((current) => [...imported, ...current]);
      toast.success(`${imported.length} buyers imported`, { description: "Run validation to clean and deduplicate the new records." });
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className={cn("fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0", mobileNav ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex h-20 items-center border-b border-sidebar-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Zap className="h-5 w-5" /></div>
            <div className="ml-3"><p className="font-display text-xl leading-none">ExportFlow</p><p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/55">Buyer operations</p></div>
            <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent lg:hidden" onClick={() => setMobileNav(false)}><X /></Button>
          </div>
          <div className="flex-1 px-3 py-6">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">Workspace</p>
            <nav className="space-y-1">
              {navItems.map((item) => { const Icon = item.icon; return <Button key={item.id} variant="ghost" className={cn("h-10 w-full justify-start gap-3 px-3 text-sm font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", view === item.id && "bg-sidebar-primary/15 font-medium text-sidebar-primary hover:bg-sidebar-primary/15 hover:text-sidebar-primary")} onClick={() => { setView(item.id); setMobileNav(false); }}><Icon className="h-[17px] w-[17px]" />{item.label}{item.id === "ai" && <span className="ml-auto rounded bg-sidebar-primary/15 px-1.5 py-0.5 text-[9px] text-sidebar-primary">BETA</span>}</Button>; })}
            </nav>
            <p className="mt-8 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">Manage</p>
            <Button variant="ghost" className={cn("h-10 w-full justify-start gap-3 px-3 text-sm font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", view === "settings" && "bg-sidebar-primary/15 text-sidebar-primary")} onClick={() => { setView("settings"); setMobileNav(false); }}><Settings2 className="h-[17px] w-[17px]" />Settings</Button>
          </div>
          <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3"><div className="flex items-center gap-2 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-sidebar-primary" />Demo workspace</div><p className="mt-2 text-[11px] leading-4 text-sidebar-foreground/55">All demo buyers are labeled and no real email is sent.</p></div>
        </aside>
        {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-foreground/20 lg:hidden" onClick={() => setMobileNav(false)} />}
        <main className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-border bg-card px-4 sm:px-8">
            <div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNav(true)}><Menu /></Button><div><p className="text-xs font-medium text-muted-foreground">Thursday, 03 September 2026</p><h1 className="font-display text-2xl">{view === "dashboard" ? "Good morning, Tejaswini" : navItems.find((item) => item.id === view)?.label ?? "Settings"}</h1></div></div>
            <div className="flex items-center gap-2 sm:gap-4"><Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-[18px]" /></Button><div className="hidden h-7 w-px bg-border sm:block" /><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">TP</div><div className="hidden text-left sm:block"><p className="text-xs font-semibold">Tejaswini Pawar</p><p className="text-[10px] text-muted-foreground">Export manager</p></div><ChevronDown className="hidden h-3.5 text-muted-foreground sm:block" /></div></div>
          </header>
          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-8">
            {view === "dashboard" && <Dashboard metrics={metrics} buyers={buyers} logs={logs} onView={setView} onRun={runCampaign} />}
            {view === "buyers" && <BuyersView buyers={buyers} setBuyers={setBuyers} onValidate={validateData} onImport={importCsv} onPreview={setShowPreview} onAdd={() => setShowAddBuyer(true)} onExport={() => exportCsv(buyers.map((b) => ({ buyer: b.name, company: b.company, email: b.email, country: b.country, status: b.status, classification: b.classification ?? "", priority: b.priority ?? "" })), "exportflow-buyers.csv")} />}
            {view === "discover" && <DiscoverView onImport={importCsv} onAdd={() => setShowAddBuyer(true)} onDiscover={() => toast.success("Discovery brief saved", { description: "Use a compliant search source or import a CSV to add real buyer records." })} />}
            {view === "ai" && <AiView buyers={buyers} onClassify={classifyBuyer} onClassifyAll={classifyAll} />}
            {view === "campaigns" && <CampaignView campaign={activeCampaign} setCampaign={setActiveCampaign} buyers={buyers} onRun={runCampaign} onPreview={setShowPreview} />}
            {view === "logs" && <LogsView logs={logs} onExport={() => exportCsv(logs.map((l) => ({ buyer: l.buyer, company: l.company, email: l.email, country: l.country, status: l.status, campaign: l.campaign, date: l.date })), "exportflow-email-logs.csv")} />}
            {view === "reports" && <ReportsView metrics={metrics} logs={logs} onExport={() => exportCsv([{ metric: "Total buyers", value: metrics.total }, { metric: "Valid emails", value: metrics.valid }, { metric: "Duplicates removed", value: metrics.duplicates }, { metric: "High priority leads", value: metrics.high }, { metric: "Emails sent", value: metrics.sent }, { metric: "Failed", value: metrics.failed }, { metric: "Skipped", value: metrics.skipped }], "exportflow-report.csv")} />}
            {view === "settings" && <SettingsView />}
          </div>
        </main>
      </div>
      {showAddBuyer && <AddBuyerModal onClose={() => setShowAddBuyer(false)} onSave={(buyer) => { setBuyers((current) => [{ ...buyer, id: Date.now(), created: "03 Sep 2026", demo: false }, ...current]); setShowAddBuyer(false); toast.success("Buyer added", { description: "Run validation before adding this record to a campaign." }); }} />}
      {showPreview && <EmailPreview buyer={showPreview} campaign={activeCampaign} onClose={() => setShowPreview(null)} />}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) { return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground/70">{eyebrow}</p><h2 className="font-display text-3xl tracking-tight">{title}</h2>{description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}</div>{action}</div>; }

function StatCard({ label, value, detail, icon: Icon, tone = "default" }: { label: string; value: number; detail: string; icon: typeof Users; tone?: "default" | "green" | "amber" | "red" }) { return <div className="border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl">{value}</p></div><div className={cn("flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground", tone === "green" && "bg-accent/20 text-accent-foreground", tone === "amber" && "bg-chart-2/20 text-foreground", tone === "red" && "bg-destructive/10 text-destructive")}><Icon className="h-[18px]" /></div></div><p className="mt-3 text-[11px] text-muted-foreground">{detail}</p></div>; }

function Dashboard({ metrics, buyers, logs, onView, onRun }: { metrics: ReturnType<typeof useMetrics>; buyers: Buyer[]; logs: Log[]; onView: (view: View) => void; onRun: () => void }) {
  const sourceCounts = ["Business directory", "Company website", "Trade portal", "LinkedIn", "Google search"].map((source) => ({ source, count: buyers.filter((b) => b.source === source).length }));
  const maxSource = Math.max(...sourceCounts.map((item) => item.count), 1);
  return <div><SectionHeader eyebrow="Overview" title="Your export pipeline" description="A live view of buyer quality, outreach activity, and campaign readiness." action={<div className="flex gap-2"><Button variant="outline" onClick={() => onView("discover")}><Plus />Add buyers</Button><Button onClick={onRun}><Play />Run campaign</Button></div>} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><StatCard label="Total buyers" value={metrics.total} detail="Across all discovery sources" icon={Users} /><StatCard label="Valid contacts" value={metrics.valid} detail={`${Math.round((metrics.valid / metrics.total) * 100)}% of all records`} icon={CheckCircle2} tone="green" /><StatCard label="High priority leads" value={metrics.high} detail="Ready for focused outreach" icon={Target} tone="amber" /><StatCard label="Emails sent" value={metrics.sent} detail={`${metrics.failed} failed · ${metrics.skipped} skipped`} icon={MailCheck} tone="green" /></div><div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><div className="border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-display text-xl">Pipeline health</h3><p className="mt-1 text-xs text-muted-foreground">Record quality across your current workspace</p></div><Badge variant="outline" className="border-accent/40 text-accent-foreground"><Activity className="mr-1 h-3 w-3" /> Live</Badge></div><div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">{[["Valid", metrics.valid, "bg-accent"], ["Incomplete", metrics.incomplete, "bg-chart-2"], ["Duplicate", metrics.duplicates, "bg-chart-4"], ["Invalid", metrics.invalid, "bg-destructive"]].map(([label, value, color]) => <div key={String(label)}><div className="mb-2 flex items-end justify-between"><p className="text-xs text-muted-foreground">{label}</p><p className="font-display text-2xl">{value}</p></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className={cn("h-full rounded-full", String(color))} style={{ width: `${Math.max(Number(value) / metrics.total * 100, Number(value) ? 4 : 0)}%` }} /></div></div>)}</div><div className="mt-8 border-t border-border pt-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold">Outreach performance</p><p className="text-xs text-muted-foreground">Last campaign</p></div><div className="mt-4 grid grid-cols-3 gap-3"><div><p className="font-display text-2xl">{metrics.sent}</p><p className="text-[11px] text-muted-foreground">Sent</p></div><div><p className="font-display text-2xl">{metrics.failed}</p><p className="text-[11px] text-muted-foreground">Failed</p></div><div><p className="font-display text-2xl">{metrics.skipped}</p><p className="text-[11px] text-muted-foreground">Skipped safely</p></div></div></div></div><div className="border border-border bg-primary p-5 text-primary-foreground shadow-sm"><div className="flex items-center gap-2 text-primary-foreground/70"><BarChart3 className="h-4 w-4" /><p className="text-xs font-semibold uppercase tracking-wider">Source mix</p></div><h3 className="mt-2 font-display text-2xl">Where buyers come from</h3><div className="mt-6 space-y-4">{sourceCounts.map(({ source, count }) => <div key={source}><div className="mb-1 flex justify-between text-xs"><span className="text-primary-foreground/75">{source}</span><span>{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-sidebar-primary" style={{ width: `${count / maxSource * 100}%` }} /></div></div>)}</div><Button variant="outline" className="mt-7 w-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => onView("buyers")}>View all buyers <ExternalLink /></Button></div></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]"><div className="border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-display text-xl">Recent buyers</h3><Button variant="link" size="sm" onClick={() => onView("buyers")}>View all</Button></div><div className="mt-4 divide-y divide-border">{buyers.slice(0, 5).map((buyer) => <BuyerRow key={buyer.id} buyer={buyer} onClick={() => onView("buyers")} />)}</div></div><div className="border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-display text-xl">Recent activity</h3><Button variant="link" size="sm" onClick={() => onView("logs")}>View logs</Button></div><div className="mt-4 space-y-4">{logs.slice(0, 3).map((log) => <div key={log.id} className="flex gap-3"><div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", log.status === "SENT" ? "bg-accent/20 text-accent-foreground" : "bg-chart-2/20 text-foreground")}><Mail className="h-3.5 w-3.5" /></div><div className="min-w-0"><p className="truncate text-xs font-medium">{log.status === "SENT" ? `Email sent to ${log.company}` : `Skipped ${log.company}`}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{log.date} · {log.campaign}</p></div></div>)}</div></div></div></div>;
}

function BuyerRow({ buyer, onClick }: { buyer: Buyer; onClick?: () => void }) { return <button className="flex w-full items-center gap-3 py-3 text-left hover:bg-secondary/50" onClick={onClick}><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">{buyer.company.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{buyer.company}</p><p className="truncate text-[11px] text-muted-foreground">{buyer.name} · {buyer.country}</p></div><StatusBadge status={buyer.status} /></button>; }

function StatusBadge({ status }: { status: Status | Log["status"] }) { const style = status === "VALID" || status === "SENT" ? "border-accent/40 bg-accent/10 text-accent-foreground" : status === "INVALID" || status === "FAILED" ? "border-destructive/30 bg-destructive/10 text-destructive" : status === "INCOMPLETE" || status === "DUPLICATE" ? "border-chart-2/40 bg-chart-2/10 text-foreground" : "border-muted-foreground/25 bg-secondary text-muted-foreground"; return <Badge variant="outline" className={cn("whitespace-nowrap text-[10px]", style)}>{status}</Badge>; }

function BuyersView({ buyers, setBuyers, onValidate, onImport, onPreview, onAdd, onExport }: { buyers: Buyer[]; setBuyers: React.Dispatch<React.SetStateAction<Buyer[]>>; onValidate: () => void; onImport: (file: File) => void; onPreview: (buyer: Buyer) => void; onAdd: () => void; onExport: () => void }) { const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All records"); const fileRef = useRef<HTMLInputElement>(null); const filtered = buyers.filter((buyer) => `${buyer.name} ${buyer.company} ${buyer.email} ${buyer.country}`.toLowerCase().includes(search.toLowerCase())).filter((buyer) => filter === "All records" || buyer.status === filter || buyer.priority === filter); return <div><SectionHeader eyebrow="Data room" title="Buyer records" description="Clean, searchable buyer intelligence ready for qualification and outreach." action={<div className="flex flex-wrap gap-2"><input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImport(file); }} /><Button variant="outline" onClick={() => fileRef.current?.click()}><Upload />Import CSV</Button><Button onClick={onAdd}><Plus />Add buyer</Button></div>} /><div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by company, buyer, email, or country" className="pl-9" /></div><div className="flex gap-2"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm"><option>All records</option><option>VALID</option><option>INVALID</option><option>INCOMPLETE</option><option>DUPLICATE</option><option>ALREADY CONTACTED</option><option>High</option><option>Low</option></select><Button variant="outline" onClick={onValidate}><FileCheck2 />Validate data</Button><Button variant="outline" size="icon" aria-label="Export buyers" onClick={onExport}><Download /></Button></div></div><div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>{filtered.length} records shown</span><span>·</span><span>{buyers.filter((buyer) => buyer.demo).length} marked DEMO DATA</span><span className="ml-auto flex items-center gap-1 text-accent-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Duplicate protection on</span></div><div className="table-scroll overflow-x-auto border border-border bg-card shadow-sm"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-b border-border bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{["Buyer / company", "Country", "Source", "Classification", "Priority", "Validation", "Contact", ""].map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((buyer) => <tr key={buyer.id} className="hover:bg-secondary/30"><td className="px-4 py-3"><button className="text-left" onClick={() => onPreview(buyer)}><p className="font-semibold">{buyer.company} {buyer.demo && <span className="ml-1 text-[9px] font-normal uppercase tracking-wider text-muted-foreground">Demo</span>}</p><p className="mt-0.5 text-xs text-muted-foreground">{buyer.name} · {buyer.email}</p></button></td><td className="px-4 py-3 text-xs">{buyer.country}</td><td className="px-4 py-3 text-xs text-muted-foreground">{buyer.source}</td><td className="px-4 py-3">{buyer.classification ? <span className="text-xs font-medium">{buyer.classification}</span> : <span className="text-xs text-muted-foreground">Unclassified</span>}</td><td className="px-4 py-3">{buyer.priority ? <Badge variant="outline" className={cn("text-[10px]", buyer.priority === "High" ? "border-chart-2/50 bg-chart-2/10" : "")}>{buyer.priority}</Badge> : "—"}</td><td className="px-4 py-3"><StatusBadge status={buyer.status} /></td><td className="px-4 py-3"><span className={cn("text-xs", buyer.contact === "Sent" && "font-semibold text-accent-foreground")}>{buyer.contact}</span></td><td className="px-4 py-3"><Button variant="ghost" size="icon" aria-label={`Delete ${buyer.company}`} onClick={() => setBuyers((current) => current.filter((item) => item.id !== buyer.id))}><MoreHorizontal className="h-4 w-4" /></Button></td></tr>)}</tbody></table>{!filtered.length && <div className="p-12 text-center"><Search className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">No buyers match these filters</p><p className="mt-1 text-xs text-muted-foreground">Try a different search or import a CSV.</p></div>}</div></div>; }

function DiscoverView({ onImport, onAdd, onDiscover }: { onImport: (file: File) => void; onAdd: () => void; onDiscover: () => void }) { const fileRef = useRef<HTMLInputElement>(null); const [form, setForm] = useState({ product: "Singing Bowls", category: "Wellness & handicrafts", country: "Germany", type: "Importer", keyword: "Singing Bowls importer" }); const examples = ["Singing Bowls importer", "Singing Bowls distributor", "Singing Bowls wholesaler", "Singing Bowls buyer", "Singing Bowls retailer"]; return <div><SectionHeader eyebrow="Source responsibly" title="Discover buyers" description="Build a compliant search brief, then add real prospects by hand or through a CSV import." action={<div className="flex gap-2"><input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImport(file); }} /><Button variant="outline" onClick={() => fileRef.current?.click()}><CloudUpload />Import CSV</Button><Button onClick={onAdd}><Plus />Add manually</Button></div>} /><div className="grid gap-6 xl:grid-cols-[1fr_0.65fr]"><div className="border border-border bg-card p-6 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground"><PackageSearch /></div><div><h3 className="font-display text-xl">Create a discovery brief</h3><p className="text-xs text-muted-foreground">Save the signals you want to use across compliant sources.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Product name"><Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} /></Field><Field label="Product category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field><Field label="Target country"><select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"><option>Germany</option><option>USA</option><option>UK</option><option>France</option><option>Canada</option><option>Australia</option><option>UAE</option></select></Field><Field label="Buyer type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"><option>Importer</option><option>Distributor</option><option>Wholesaler</option><option>Retailer</option><option>Business buyer</option><option>Individual buyer</option></select></Field><Field label="Search keyword" className="sm:col-span-2"><Input value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} /></Field></div><div className="mt-6 flex flex-wrap gap-2"><Button onClick={onDiscover}><Search />Save search brief</Button><Button variant="outline" onClick={() => setForm({ ...form, keyword: `${form.product} ${form.type.toLowerCase()}` })}><RefreshCw />Generate keyword</Button></div></div><div className="border border-border bg-primary p-6 text-primary-foreground shadow-sm"><Globe2 className="h-7 w-7 text-sidebar-primary" /><h3 className="mt-5 font-display text-2xl">Use the right source for the right signal.</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/70">ExportFlow keeps discovery compliant. Use public search, directories, trade portals, and company sites without scraping restricted content.</p><div className="mt-6 space-y-3">{["Google / public search", "LinkedIn and Facebook", "Business directories", "Company websites", "Trade portals"].map((source) => <div key={source} className="flex items-center gap-2 text-xs text-primary-foreground/80"><Check className="h-3.5 w-3.5 text-sidebar-primary" />{source}</div>)}</div><div className="mt-6 border-t border-primary-foreground/15 pt-4 text-xs text-primary-foreground/55">When an API is unavailable, import a CSV and keep moving.</div></div></div><div className="mt-6 border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><ListFilter className="h-4 w-4 text-accent-foreground" /><h3 className="font-display text-xl">Keyword examples</h3></div><div className="mt-4 flex flex-wrap gap-2">{examples.map((example) => <button key={example} onClick={() => setForm({ ...form, keyword: example })} className="border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground">{example}</button>)}</div></div></div>; }

function AiView({ buyers, onClassify, onClassifyAll }: { buyers: Buyer[]; onClassify: (id: number) => void; onClassifyAll: () => void }) { const eligible = buyers.filter((buyer) => buyer.status !== "INVALID" && buyer.status !== "DUPLICATE"); return <div><SectionHeader eyebrow="Qualification engine" title="AI classification" description="Prioritize the next conversation using buyer type, market relevance, and data quality." action={<Button onClick={onClassifyAll}><Sparkles />Classify all eligible</Button>} /><div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Ready to evaluate</p><p className="mt-2 font-display text-3xl">{eligible.filter((b) => !b.classification).length}</p></div><div className="border border-border bg-card p-4"><p className="text-xs text-muted-foreground">High priority</p><p className="mt-2 font-display text-3xl">{buyers.filter((b) => b.priority === "High").length}</p></div><div className="border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Engine status</p><p className="mt-2 flex items-center gap-2 font-display text-xl"><span className="h-2 w-2 rounded-full bg-accent" />Ready</p></div></div><div className="border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h3 className="font-display text-xl">Classification queue</h3><p className="mt-1 text-xs text-muted-foreground">Use individual runs for review or process the eligible queue.</p></div><Badge variant="outline" className="border-accent/40 text-accent-foreground"><Bot className="mr-1 h-3 w-3" />Secure workflow</Badge></div><div className="divide-y divide-border">{eligible.map((buyer) => <div key={buyer.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold">{buyer.company.slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{buyer.company}</p><p className="truncate text-xs text-muted-foreground">{buyer.country} · {buyer.product} · {buyer.type}</p></div></div><div className="flex items-center gap-3">{buyer.classification ? <><span className="text-xs font-medium">{buyer.classification}</span><Badge variant="outline" className="text-[10px]">{buyer.priority} priority</Badge></> : <span className="text-xs text-muted-foreground">Awaiting classification</span>}<Button variant={buyer.classification ? "outline" : "default"} size="sm" onClick={() => onClassify(buyer.id)}><Sparkles />{buyer.classification ? "Re-run" : "Classify"}</Button></div>{buyer.reason && <p className="text-xs leading-5 text-muted-foreground sm:max-w-[340px]">{buyer.reason}</p>}</div>)}</div></div></div>; }

function CampaignView({ campaign, setCampaign, buyers, onRun, onPreview }: { campaign: { name: string; product: string; subject: string; body: string; audience: string[]; limit: number; delay: number; status: string; attachment: string }; setCampaign: React.Dispatch<React.SetStateAction<{ name: string; product: string; subject: string; body: string; audience: string[]; limit: number; delay: number; status: string; attachment: string }>>; buyers: Buyer[]; onRun: () => void; onPreview: (buyer: Buyer) => void }) { const previewBuyer = buyers.find((buyer) => buyer.status === "VALID") ?? buyers[0]; const audiences = ["Importer", "Distributor", "Wholesaler", "Retailer", "High priority"]; return <div><SectionHeader eyebrow="Outreach" title="Campaigns" description="Configure a personalized export sequence, review a live email, and run it with safety checks." action={<div className="flex gap-2"><Badge variant="outline" className={cn("h-9 px-3", campaign.status === "Completed" ? "border-accent/40 text-accent-foreground" : "")}>{campaign.status}</Badge><Button onClick={onRun}><Send />Run campaign</Button></div>} /><div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]"><div className="border border-border bg-card p-6 shadow-sm"><div className="grid gap-4 sm:grid-cols-2"><Field label="Campaign name"><Input value={campaign.name} onChange={(e) => setCampaign({ ...campaign, name: e.target.value })} /></Field><Field label="Product"><Input value={campaign.product} onChange={(e) => setCampaign({ ...campaign, product: e.target.value })} /></Field><Field label="Email subject" className="sm:col-span-2"><Input value={campaign.subject} onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })} /></Field><Field label="Email body" className="sm:col-span-2"><Textarea value={campaign.body} onChange={(e) => setCampaign({ ...campaign, body: e.target.value })} className="min-h-[260px] leading-6" /></Field></div><div className="mt-5"><p className="mb-2 text-xs font-semibold">Target audience</p><div className="flex flex-wrap gap-2">{audiences.map((audience) => <button key={audience} onClick={() => setCampaign({ ...campaign, audience: campaign.audience.includes(audience) ? campaign.audience.filter((item) => item !== audience) : [...campaign.audience, audience] })} className={cn("border px-3 py-2 text-xs transition-colors", campaign.audience.includes(audience) ? "border-accent bg-accent/15 font-medium text-accent-foreground" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground")}>{campaign.audience.includes(audience) && <Check className="mr-1 inline h-3 w-3" />}{audience}</button>)}</div></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><Field label="Sending limit"><Input type="number" value={campaign.limit} onChange={(e) => setCampaign({ ...campaign, limit: Number(e.target.value) })} /></Field><Field label="Delay between emails"><Input type="number" value={campaign.delay} onChange={(e) => setCampaign({ ...campaign, delay: Number(e.target.value) })} /></Field><Field label="Attachment"><button className="flex h-9 w-full items-center gap-2 overflow-hidden rounded-md border border-input bg-card px-3 text-left text-xs"><FileText className="h-4 w-4 shrink-0 text-accent-foreground" /><span className="truncate">{campaign.attachment}</span></button></Field></div><div className="mt-5 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-accent-foreground" />Invalid, duplicate, incomplete, and already-contacted buyers will be skipped automatically.</div></div><div className="border border-border bg-card shadow-sm"><div className="border-b border-border px-5 py-4"><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent-foreground" /><h3 className="font-display text-xl">Personalized preview</h3></div><p className="mt-1 text-xs text-muted-foreground">See what {previewBuyer?.company ?? "your buyer"} receives.</p></div>{previewBuyer && <div className="p-5"><div className="border border-border bg-secondary/30 p-4"><div className="flex items-center justify-between border-b border-border pb-3"><div><p className="text-xs font-semibold">To: {previewBuyer.email}</p><p className="mt-1 text-[11px] text-muted-foreground">{previewBuyer.company} · {previewBuyer.country}</p></div><Badge variant="outline" className="text-[10px]">{previewBuyer.demo ? "DEMO" : "LIVE"}</Badge></div><p className="py-4 text-sm font-semibold">{campaign.subject.replace("<Product Name>", campaign.product)}</p><div className="whitespace-pre-line text-xs leading-6 text-muted-foreground">{campaign.body.replaceAll("{{Buyer Name}}", previewBuyer.name).replaceAll("{{Company Name}}", previewBuyer.company).replaceAll("{{Product Name}}", campaign.product)}</div><div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><FileText className="h-4 w-4 text-accent-foreground" />{campaign.attachment}</div></div><Button variant="outline" className="mt-4 w-full" onClick={() => onPreview(previewBuyer)}>Open full preview <ExternalLink /></Button></div>}</div></div></div>; }

function LogsView({ logs, onExport }: { logs: Log[]; onExport: () => void }) { const [status, setStatus] = useState("All statuses"); const filtered = logs.filter((log) => status === "All statuses" || (status === "Skipped" ? log.status.startsWith("SKIPPED") : log.status === status.toUpperCase())); return <div><SectionHeader eyebrow="Audit trail" title="Email logs" description="Every sent, failed, and safely skipped email stays traceable." action={<Button variant="outline" onClick={onExport}><Download />Export logs</Button>} /><div className="mb-4 flex flex-wrap gap-2"><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm"><option>All statuses</option><option>Sent</option><option>Failed</option><option>Skipped</option></select><Button variant="outline"><Filter />More filters</Button></div><div className="overflow-x-auto border border-border bg-card shadow-sm"><table className="w-full min-w-[950px] text-left text-sm"><thead className="border-b border-border bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{["Buyer", "Product / country", "Campaign", "Attachment", "Status", "Date"].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((log) => <tr key={log.id} className="hover:bg-secondary/30"><td className="px-4 py-3"><p className="text-xs font-semibold">{log.company}</p><p className="mt-1 text-[11px] text-muted-foreground">{log.buyer} · {log.email}</p></td><td className="px-4 py-3"><p className="text-xs">{log.product}</p><p className="mt-1 text-[11px] text-muted-foreground">{log.country} · {log.source}</p></td><td className="px-4 py-3 text-xs">{log.campaign}</td><td className="px-4 py-3 text-xs">{log.attachment ? <span className="flex items-center gap-1 text-accent-foreground"><Check className="h-3.5 w-3.5" />Attached</span> : "—"}</td><td className="px-4 py-3"><StatusBadge status={log.status} /></td><td className="px-4 py-3 text-xs text-muted-foreground">{log.date}</td></tr>)}</tbody></table>{!filtered.length && <div className="p-12 text-center text-sm text-muted-foreground">No email activity matches this filter.</div>}</div></div>; }

function ReportsView({ metrics, logs, onExport }: { metrics: ReturnType<typeof useMetrics>; logs: Log[]; onExport: () => void }) { const sentRate = metrics.total ? Math.round(metrics.sent / Math.max(metrics.valid, 1) * 100) : 0; const attachmentCount = logs.filter((log) => log.attachment).length; return <div><SectionHeader eyebrow="Insights" title="Campaign reports" description="A concise performance snapshot for your export outreach review." action={<Button onClick={onExport}><Download />Export report CSV</Button>} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><StatCard label="Valid emails" value={metrics.valid} detail={`${metrics.total ? Math.round(metrics.valid / metrics.total * 100) : 0}% of buyer base`} icon={CheckCircle2} tone="green" /><StatCard label="Duplicates removed" value={metrics.duplicates} detail="Normalized email check" icon={Copy} tone="amber" /><StatCard label="Emails sent" value={metrics.sent} detail={`${sentRate}% of valid contacts`} icon={MailCheck} tone="green" /><StatCard label="Attachments sent" value={attachmentCount} detail="Company presentation included" icon={FileText} /></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="border border-border bg-card p-6 shadow-sm"><h3 className="font-display text-xl">Campaign summary</h3><div className="mt-5 space-y-4">{[["Total buyers", metrics.total, "bg-primary"], ["Valid emails", metrics.valid, "bg-accent"], ["Incomplete records", metrics.incomplete, "bg-chart-2"], ["High-priority leads", metrics.high, "bg-chart-4"], ["Emails queued", Math.min(metrics.valid, 25), "bg-chart-3"], ["Emails sent", metrics.sent, "bg-accent"], ["Emails failed", metrics.failed, "bg-destructive"], ["Emails skipped", metrics.skipped, "bg-chart-2"]].map(([label, value, color]) => <div key={String(label)} className="flex items-center gap-3"><span className={cn("h-2 w-2 rounded-full", color)} /><span className="flex-1 text-xs text-muted-foreground">{label}</span><span className="text-sm font-semibold">{value}</span></div>)}</div></div><div className="border border-border bg-primary p-6 text-primary-foreground shadow-sm"><div className="flex items-center gap-2 text-sidebar-primary"><Gauge className="h-5 w-5" /><p className="text-xs font-semibold uppercase tracking-wider">Readiness score</p></div><p className="mt-5 font-display text-6xl">{Math.max(0, Math.min(100, Math.round((metrics.valid / Math.max(metrics.total, 1)) * 60 + (metrics.high / Math.max(metrics.total, 1)) * 40)))}<span className="text-2xl text-primary-foreground/50">/100</span></p><p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/70">Your workspace is strongest when valid contacts, lead priority, and contact safety checks all move together.</p><div className="mt-7 h-2 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-sidebar-primary" style={{ width: `${Math.max(8, Math.min(100, Math.round((metrics.valid / Math.max(metrics.total, 1)) * 60 + (metrics.high / Math.max(metrics.total, 1)) * 40)))}%` }} /></div><Button variant="outline" className="mt-7 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={onExport}>Download full report <ArrowDownToLine /></Button></div></div></div>; }

function SettingsView() { const [connected, setConnected] = useState(false); return <div><SectionHeader eyebrow="Workspace" title="Settings" description="Connect the services that power your export operations." /><div className="grid gap-6 lg:grid-cols-2"><div className="border border-border bg-card p-6 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive"><Mail /></div><div className="flex-1"><h3 className="font-display text-xl">Gmail sending</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Connect with Google OAuth. ExportFlow never asks for or stores your Gmail password.</p></div><Badge variant="outline" className={connected ? "border-accent/40 text-accent-foreground" : ""}>{connected ? "Connected" : "Not connected"}</Badge></div><div className="mt-5 rounded-md border border-border bg-secondary/40 p-4"><div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-accent-foreground" />Safe sending controls</div><ul className="mt-3 space-y-2 text-xs text-muted-foreground"><li className="flex gap-2"><Check className="h-3.5 w-3.5 text-accent-foreground" />Configurable sending limits and delay</li><li className="flex gap-2"><Check className="h-3.5 w-3.5 text-accent-foreground" />One campaign email per buyer</li><li className="flex gap-2"><Check className="h-3.5 w-3.5 text-accent-foreground" />Failed sends continue without blocking the queue</li></ul></div><Button className="mt-5" onClick={() => { setConnected(true); toast.success("Gmail connection ready", { description: "Demo mode records the OAuth handoff without sending real email." }); }}>{connected ? "Reconnect Gmail" : "Connect Gmail"}<ExternalLink /></Button></div><div className="border border-border bg-card p-6 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground"><Bot /></div><div className="flex-1"><h3 className="font-display text-xl">AI classification</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Secure server-side classification for buyer type, priority, and reasoning.</p></div><Badge variant="outline" className="border-accent/40 text-accent-foreground">Ready</Badge></div><div className="mt-5 flex items-center gap-3 border border-border bg-secondary/40 p-4"><Sparkles className="h-5 w-5 text-accent-foreground" /><div><p className="text-xs font-semibold">Classification workflow enabled</p><p className="mt-1 text-[11px] text-muted-foreground">No provider key is exposed in the browser.</p></div></div><Button variant="outline" className="mt-5" onClick={() => toast.success("AI settings checked", { description: "The classification workflow is ready for eligible buyer records." })}>Check connection <RefreshCw /></Button></div><div className="border border-border bg-card p-6 shadow-sm lg:col-span-2"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><Database /></div><div><h3 className="font-display text-xl">Workspace data</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Buyer records, products, campaigns, attachments, classifications, and email logs are designed for secure backend persistence.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="border border-border p-3"><p className="text-xs font-semibold">Buyers</p><p className="mt-1 text-[11px] text-muted-foreground">Validated contacts and source attribution</p></div><div className="border border-border p-3"><p className="text-xs font-semibold">Campaigns</p><p className="mt-1 text-[11px] text-muted-foreground">Targets, limits, delays, and attachments</p></div><div className="border border-border p-3"><p className="text-xs font-semibold">Audit logs</p><p className="mt-1 text-[11px] text-muted-foreground">Sent, failed, and skipped activity</p></div></div></div></div></div>; }

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) { return <label className={cn("block", className)}><span className="mb-1.5 block text-xs font-medium">{label}</span>{children}</label>; }

function AddBuyerModal({ onClose, onSave }: { onClose: () => void; onSave: (buyer: Omit<Buyer, "id" | "created" | "demo">) => void }) { const [buyer, setBuyer] = useState({ name: "", company: "", email: "", website: "", country: "Germany", source: "Manual entry", type: "Importer", product: "Singing Bowls", category: "Wellness & handicrafts", classification: null, priority: null, status: "INCOMPLETE" as Status, contact: "Not contacted" as ContactStatus, lastContacted: null, reason: "" }); return <Modal title="Add buyer" onClose={onClose}><div className="grid gap-4 sm:grid-cols-2"><Field label="Contact name"><Input autoFocus value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} /></Field><Field label="Company name"><Input value={buyer.company} onChange={(e) => setBuyer({ ...buyer, company: e.target.value })} /></Field><Field label="Email address"><Input type="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} /></Field><Field label="Country"><Input value={buyer.country} onChange={(e) => setBuyer({ ...buyer, country: e.target.value })} /></Field><Field label="Website"><Input value={buyer.website} onChange={(e) => setBuyer({ ...buyer, website: e.target.value })} /></Field><Field label="Buyer type"><select value={buyer.type} onChange={(e) => setBuyer({ ...buyer, type: e.target.value })} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"><option>Importer</option><option>Distributor</option><option>Wholesaler</option><option>Retailer</option><option>Business buyer</option><option>Individual buyer</option></select></Field></div><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(buyer)}><Plus />Add buyer</Button></div></Modal>; }

function EmailPreview({ buyer, campaign, onClose }: { buyer: Buyer; campaign: { subject: string; body: string; product: string; attachment: string }; onClose: () => void }) { return <Modal title="Email preview" onClose={onClose}><div className="border border-border bg-secondary/30 p-5"><div className="space-y-1 border-b border-border pb-4 text-xs"><p><span className="text-muted-foreground">To:</span> {buyer.name} &lt;{buyer.email}&gt;</p><p><span className="text-muted-foreground">Company:</span> {buyer.company}</p><p><span className="text-muted-foreground">Country:</span> {buyer.country}</p></div><h3 className="py-5 text-sm font-semibold">{campaign.subject.replace("<Product Name>", campaign.product)}</h3><div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{campaign.body.replaceAll("{{Buyer Name}}", buyer.name).replaceAll("{{Company Name}}", buyer.company).replaceAll("{{Product Name}}", campaign.product)}</div><div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><FileText className="h-4 w-4 text-accent-foreground" />{campaign.attachment}</div></div><div className="mt-5 flex items-center justify-between"><Badge variant="outline" className="border-chart-2/40 bg-chart-2/10">{buyer.demo ? "DEMO DATA" : "LIVE RECORD"}</Badge><Button onClick={onClose}>Close preview</Button></div></Modal>; }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-card shadow-xl"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="font-display text-xl">{title}</h2><Button variant="ghost" size="icon" aria-label="Close dialog" onClick={onClose}><X /></Button></div><div className="p-5">{children}</div></div></div>; }

function useMetrics() { return { total: 0, valid: 0, invalid: 0, incomplete: 0, duplicates: 0, high: 0, low: 0, sent: 0, failed: 0, skipped: 0 }; }