import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MessageSquareWarning, Bot, Sparkles, Send, Pencil, UserCog,
  ArrowUpCircle, CheckCircle2, XCircle, Clock, Heart,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { SimulationDialog } from "@/components/simulation-dialog";
import {
  reclamations, RECLAMATION_CATEGORIES, CYCLES, type Reclamation,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reclamations")({
  component: ReclamationsPage,
});

const PRIORITES = ["Faible", "Normale", "Élevée", "Urgente"];
const STATUTS = ["Nouveau", "En cours", "Escaladé", "Résolu", "Clôturé"];
const CANAUX = ["WhatsApp", "Site web", "Téléphone", "Facebook", "Instagram"];

function FilterSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label} : tous</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function ReclamationsPage() {
  const [search, setSearch] = useState("");
  const [cycle, setCycle] = useState("all");
  const [cat, setCat] = useState("all");
  const [prio, setPrio] = useState("all");
  const [statut, setStatut] = useState("all");
  const [canal, setCanal] = useState("all");
  const [selected, setSelected] = useState<Reclamation | null>(null);

  const filtered = useMemo(() => reclamations.filter((r) =>
    (cycle === "all" || r.cycle === cycle) &&
    (cat === "all" || r.categorie === cat) &&
    (prio === "all" || r.priorite === prio) &&
    (statut === "all" || r.statut === statut) &&
    (canal === "all" || r.canal === canal) &&
    (search === "" || `${r.parent} ${r.eleve} ${r.id}`.toLowerCase().includes(search.toLowerCase()))
  ), [search, cycle, cat, prio, statut, canal]);

  return (
    <div>
      <PageHeader
        icon={MessageSquareWarning}
        title="Agent — Communication Parents & Réclamations"
        description="L'IA reçoit, comprend, classe les messages des parents, crée des tickets et escalade les cas sensibles."
        actions={
          <SimulationDialog trigger={<Button variant="gold" className="gap-1.5"><Sparkles className="h-4 w-4" /> Simuler une réclamation</Button>} />
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Input placeholder="Rechercher parent, élève, ticket…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full max-w-xs" />
            <FilterSelect label="Cycle" options={[...CYCLES]} value={cycle} onChange={setCycle} />
            <FilterSelect label="Catégorie" options={RECLAMATION_CATEGORIES} value={cat} onChange={setCat} />
            <FilterSelect label="Priorité" options={PRIORITES} value={prio} onChange={setPrio} />
            <FilterSelect label="Statut" options={STATUTS} value={statut} onChange={setStatut} />
            <FilterSelect label="Canal" options={CANAUX} value={canal} onChange={setCanal} />
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Ticket</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Maj</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                    <TableCell className="font-semibold text-royal">#{r.id}</TableCell>
                    <TableCell>{r.parent}</TableCell>
                    <TableCell>{r.eleve}</TableCell>
                    <TableCell>{r.classe}</TableCell>
                    <TableCell>{r.categorie}</TableCell>
                    <TableCell><PriorityBadge value={r.priorite} /></TableCell>
                    <TableCell><StatusBadge value={r.statut} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.maj}</TableCell>
                    <TableCell className="text-xs">{r.responsable}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>Ouvrir</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">Aucune réclamation ne correspond aux filtres.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReclamationDetail rec={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ReclamationDetail({ rec, onClose }: { rec: Reclamation | null; onClose: () => void }) {
  const [reponse, setReponse] = useState("");
  if (!rec) return null;

  const act = (msg: string) => { toast.success(msg); onClose(); };

  return (
    <Dialog open={!!rec} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-royal">#{rec.id}</span> — {rec.categorie}
            <PriorityBadge value={rec.priorite} />
            <StatusBadge value={rec.statut} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard title="Parent" value={rec.parent} sub={rec.canal} />
          <InfoCard title="Élève" value={rec.eleve} sub={`${rec.cycle} · ${rec.classe}`} />
          <InfoCard title="Responsable" value={rec.responsable} sub={rec.maj} />
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message original</p>
          <p className="text-sm leading-relaxed">« {rec.message} »</p>
        </div>

        <div className="rounded-xl border border-royal/20 bg-royal/5 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal">
            <Bot className="h-4 w-4" /> Analyse IA
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <MiniStat label="Catégorie détectée" value={rec.categorie} />
            <MiniStat label="Urgence détectée" value={rec.priorite} />
            <MiniStat label="Sentiment" value={rec.sentiment} icon={Heart} />
          </div>
          <Separator className="my-3" />
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Réponse proposée par l'IA</p>
          <p className="text-sm leading-relaxed">{rec.reponseIA}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timeline de traitement</p>
          <ol className="relative space-y-3 border-l pl-5 text-sm">
            <TimelineItem time="Message reçu" text={`Reçu via ${rec.canal}`} />
            <TimelineItem time="Analyse IA" text={`Catégorie « ${rec.categorie} » et priorité « ${rec.priorite} » détectées`} />
            <TimelineItem time="Ticket créé" text={`Assigné à ${rec.responsable}`} />
            {(rec.statut === "Escaladé") && <TimelineItem time="Escalade" text="Cas sensible transmis à un responsable humain" />}
          </ol>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Modifier / rédiger une réponse</p>
          <Textarea placeholder={rec.reponseIA} value={reponse} onChange={(e) => setReponse(e.target.value)} rows={2} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="gold" className="gap-1.5" onClick={() => act("Réponse IA envoyée au parent.")}><Send className="h-3.5 w-3.5" /> Répondre avec IA</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast("Réponse enregistrée comme brouillon.")}><Pencil className="h-3.5 w-3.5" /> Modifier réponse</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => act("Ticket assigné à un responsable.")}><UserCog className="h-3.5 w-3.5" /> Assigner</Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-destructive" onClick={() => act("Ticket escaladé à la direction.")}><ArrowUpCircle className="h-3.5 w-3.5" /> Escalader direction</Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-success" onClick={() => act("Ticket marqué comme résolu.")}><CheckCircle2 className="h-3.5 w-3.5" /> Résolu</Button>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => act("Ticket clôturé.")}><XCircle className="h-3.5 w-3.5" /> Clôturer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="font-semibold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="rounded-lg bg-card px-3 py-2">
      <p className="text-[0.7rem] text-muted-foreground">{label}</p>
      <p className="flex items-center gap-1 text-sm font-semibold">{Icon && <Icon className="h-3.5 w-3.5" />}{value}</p>
    </div>
  );
}

function TimelineItem({ time, text }: { time: string; text: string }) {
  return (
    <li className="relative">
      <span className="absolute -left-[1.44rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-royal" />
      <p className="flex items-center gap-1.5 font-medium"><Clock className="h-3 w-3 text-muted-foreground" /> {time}</p>
      <p className="text-xs text-muted-foreground">{text}</p>
    </li>
  );
}
