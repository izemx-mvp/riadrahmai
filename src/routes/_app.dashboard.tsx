import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquareWarning, AlertTriangle, Users2, UserPlus, CalendarClock,
  Briefcase, Bot, TrendingUp, TrendingDown, Sparkles, ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/badges";
import { SimulationDialog } from "@/components/simulation-dialog";
import {
  activityFeed, alerts, demandesParCategorie, demandesParCycle,
  statutTickets, volumeConversations,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

const kpis = [
  { label: "Réclamations ouvertes", value: "18", icon: MessageSquareWarning, trend: "+3", up: true, color: "text-royal bg-royal/10" },
  { label: "Réclamations urgentes", value: "4", icon: AlertTriangle, trend: "4 escaladées", up: false, color: "text-destructive bg-destructive/10" },
  { label: "Demandes parents aujourd'hui", value: "42", icon: Users2, trend: "+12%", up: true, color: "text-primary bg-primary/10" },
  { label: "Nouvelles inscriptions", value: "11", icon: UserPlus, trend: "+7 prospects", up: true, color: "text-success bg-success/10" },
  { label: "Rendez-vous à confirmer", value: "6", icon: CalendarClock, trend: "+2", up: true, color: "text-gold-foreground bg-gold/20" },
  { label: "Candidatures RH reçues", value: "9", icon: Briefcase, trend: "+4", up: true, color: "text-info bg-info/10" },
  { label: "Conversations traitées IA", value: "128", icon: Bot, trend: "-18% temps", up: true, color: "text-royal bg-royal/10" },
  { label: "Taux de résolution IA", value: "73%", icon: Sparkles, trend: "+5%", up: true, color: "text-success bg-success/10" },
];

const chartColors = ["oklch(0.395 0.093 250.5)", "oklch(0.49 0.13 254)", "oklch(0.83 0.15 88)", "oklch(0.63 0.15 155)"];

const alertStyles: Record<string, string> = {
  Urgente: "border-l-destructive",
  "Élevée": "border-l-warning",
  RH: "border-l-info",
  Admission: "border-l-success",
};

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">Vue globale de la communication scolaire pilotée par l'IA.</p>
        </div>
        <SimulationDialog
          trigger={<Button variant="gold" className="gap-1.5"><Sparkles className="h-4 w-4" /> Nouvelle simulation</Button>}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${k.color}`}>
                  <k.icon className="h-4.5 w-4.5" />
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.up ? "text-success" : "text-destructive"}`}>
                  {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {k.trend}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity + Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Activité en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l pl-5">
              {activityFeed.map((a, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.44rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-royal" />
                  <div className="flex gap-3">
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">{a.time}</span>
                    <span className="text-sm">{a.text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Alertes prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`rounded-lg border border-l-4 bg-muted/30 p-3 ${alertStyles[a.level]}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <PriorityBadge value={a.level === "RH" || a.level === "Admission" ? "Normale" : a.level} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Demandes par catégorie</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={demandesParCategorie}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.918 0.013 255.5)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "oklch(0.958 0.012 247.9)" }} contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.918 0.013 255.5)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="oklch(0.49 0.13 254)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Demandes par cycle</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={demandesParCycle} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {demandesParCycle.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.918 0.013 255.5)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {demandesParCycle.map((c, i) => (
                <span key={c.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartColors[i] }} /> {c.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Statut des tickets</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={statutTickets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.918 0.013 255.5)" />
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={70} />
                <Tooltip cursor={{ fill: "oklch(0.958 0.012 247.9)" }} contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.918 0.013 255.5)" }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="oklch(0.83 0.15 88)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Volume de conversations (7 jours)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={volumeConversations}>
                <defs>
                  <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.49 0.13 254)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.49 0.13 254)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.918 0.013 255.5)" />
                <XAxis dataKey="jour" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.918 0.013 255.5)" }} />
                <Area type="monotone" dataKey="value" stroke="oklch(0.49 0.13 254)" strokeWidth={2.5} fill="url(#conv)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
