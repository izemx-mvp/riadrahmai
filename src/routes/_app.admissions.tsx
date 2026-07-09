import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  UserPlus, Bot, Sparkles, Phone, CalendarPlus, Send, Flame, HelpCircle, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatusBadge, TempBadge } from "@/components/badges";
import { SimulationDialog } from "@/components/simulation-dialog";
import { prospects, faq, CYCLES, type Prospect } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/admissions")({
  component: AdmissionsPage,
});

const STATUTS = ["Nouveau", "À rappeler", "Rendez-vous demandé", "Rendez-vous confirmé", "Dossier en cours", "Information envoyée", "Inscrit", "Non intéressé"];
const SOURCES = ["WhatsApp", "Site web", "Facebook", "Instagram", "Appel"];
const TEMPS = ["Chaud", "Moyen", "Froid"];

const convExample = [
  { from: "user", text: "Bonjour, je veux inscrire ma fille en primaire." },
  { from: "ia", text: "Bonjour et bienvenue à G.S Riad Rahma. Avec plaisir. Pouvez-vous me préciser le niveau souhaité pour votre fille, son âge, ainsi que votre numéro de téléphone afin que l'administration puisse vous accompagner ?" },
  { from: "user", text: "Elle a 7 ans, je cherche CE1. Mon numéro est 0612457890." },
  { from: "ia", text: "Merci. Votre demande d'inscription pour le niveau CE1 a bien été enregistrée. Souhaitez-vous également des informations sur le transport scolaire ou la cantine ?" },
  { from: "user", text: "Oui les deux." },
  { from: "ia", text: "Très bien. Votre fiche a été transmise à l'administration avec une demande concernant le transport et la cantine. Un membre de l'équipe vous contactera pour confirmer les disponibilités et vous proposer un rendez-vous." },
];

function AdmissionsPage() {
  const [cycle, setCycle] = useState("all");
  const [statut, setStatut] = useState("all");
  const [source, setSource] = useState("all");
  const [temp, setTemp] = useState("all");
  const [selected, setSelected] = useState<Prospect | null>(null);

  const filtered = useMemo(() => prospects.filter((p) =>
    (cycle === "all" || p.cycle === cycle) &&
    (statut === "all" || p.statut === statut) &&
    (source === "all" || p.source === source) &&
    (temp === "all" || p.temperature === temp)
  ), [cycle, statut, source, temp]);

  return (
    <div>
      <PageHeader
        icon={UserPlus}
        title="Agent — Service Client & Admissions"
        description="L'IA répond aux questions fréquentes et qualifie les nouveaux prospects intéressés par l'école."
        actions={<SimulationDialog trigger={<Button variant="gold" className="gap-1.5"><Sparkles className="h-4 w-4" /> Simuler une demande parent</Button>} />}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniKpi label="Prospects actifs" value="11" icon={UserPlus} />
        <MiniKpi label="Prospects chauds" value="4" icon={Flame} tone="text-destructive bg-destructive/10" />
        <MiniKpi label="Rendez-vous demandés" value="6" icon={CalendarPlus} tone="text-gold-foreground bg-gold/20" />
        <MiniKpi label="Questions traitées IA" value="53" icon={Bot} tone="text-royal bg-royal/10" />
      </div>

      <Tabs defaultValue="prospects">
        <TabsList>
          <TabsTrigger value="prospects">Demandes d'admission</TabsTrigger>
          <TabsTrigger value="faq">Questions fréquentes</TabsTrigger>
          <TabsTrigger value="conv">Exemple de conversation</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <Filter label="Cycle" options={[...CYCLES]} value={cycle} onChange={setCycle} />
                <Filter label="Statut" options={STATUTS} value={statut} onChange={setStatut} />
                <Filter label="Source" options={SOURCES} value={source} onChange={setSource} />
                <Filter label="Température" options={TEMPS} value={temp} onChange={setTemp} />
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Prospect</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Élève</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Transport</TableHead>
                      <TableHead>Cantine</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                        <TableCell className="font-semibold text-royal">#{p.id}</TableCell>
                        <TableCell>{p.parent}</TableCell>
                        <TableCell className="text-xs">{p.telephone}</TableCell>
                        <TableCell>{p.eleve}</TableCell>
                        <TableCell>{p.niveau}</TableCell>
                        <TableCell>{p.transport ? "Oui" : "Non"}</TableCell>
                        <TableCell>{p.cantine ? "Oui" : "Non"}</TableCell>
                        <TableCell><StatusBadge value={p.statut} /></TableCell>
                        <TableCell><span className="flex items-center gap-1.5"><span className="font-semibold">{p.score}</span><TempBadge value={p.temperature} /></span></TableCell>
                        <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(p); }}>Ouvrir</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="h-4 w-4 text-royal" /> Base de connaissances de l'agent</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faq.map((f, i) => (
                  <AccordionItem key={i} value={`q${i}`}>
                    <AccordionTrigger className="text-sm font-medium">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conv">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4 text-royal" /> Simulation — qualification d'un prospect</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {convExample.map((m, i) => <ChatBubble key={i} from={m.from as "user" | "ia"} text={m.text} />)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProspectDetail p={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ProspectDetail({ p, onClose }: { p: Prospect | null; onClose: () => void }) {
  if (!p) return null;
  const act = (m: string) => { toast.success(m); onClose(); };
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><span className="text-royal">#{p.id}</span> — {p.parent} <TempBadge value={p.temperature} /></DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Téléphone" value={p.telephone} />
          <Field label="Email" value={p.email} />
          <Field label="Enfant" value={`${p.eleve} · ${p.age} ans`} />
          <Field label="Niveau souhaité" value={`${p.niveau} (${p.cycle})`} />
          <Field label="Besoin transport" value={p.transport ? "Oui" : "Non"} />
          <Field label="Besoin cantine" value={p.cantine ? "Oui" : "Non"} />
          <Field label="Source" value={p.source} />
          <Field label="Statut" value={p.statut} />
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message reçu</p>
          <p className="mt-1 text-sm">« {p.message} »</p>
        </div>

        <div className="rounded-xl border border-royal/20 bg-royal/5 p-4 space-y-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal"><Bot className="h-4 w-4" /> Résumé IA</p>
          <p className="text-sm">{p.resumeIA}</p>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs"><span className="text-muted-foreground">Score d'intérêt</span><span className="font-semibold">{p.score} / 100</span></div>
            <Progress value={p.score} />
          </div>
          <Separator />
          <p className="text-sm"><span className="font-semibold">Prochaine action recommandée :</span> {p.prochaineAction}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="gold" className="gap-1.5" onClick={() => act("Réponse IA envoyée au prospect.")}><Send className="h-3.5 w-3.5" /> Répondre avec IA</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => act("Rappel programmé.")}><Phone className="h-3.5 w-3.5" /> Rappeler</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => act("Rendez-vous proposé au parent.")}><CalendarPlus className="h-3.5 w-3.5" /> Proposer un RDV</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Filter({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[170px]"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label} : tous</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function MiniKpi({ label, value, icon: Icon, tone = "text-primary bg-primary/10" }: { label: string; value: string; icon: any; tone?: string }) {
  return (
    <Card><CardContent className="flex items-center gap-3 p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4.5 w-4.5" /></span>
      <div><p className="text-xl font-bold leading-none">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
    </CardContent></Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-semibold">{value}</p></div>;
}

function ChatBubble({ from, text }: { from: "user" | "ia"; text: string }) {
  const isIa = from === "ia";
  return (
    <div className={`flex ${isIa ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isIa ? "rounded-tl-sm bg-royal/10 text-foreground" : "rounded-tr-sm bg-primary text-primary-foreground"}`}>
        {isIa && <p className="mb-1 flex items-center gap-1 text-[0.7rem] font-semibold text-royal"><Bot className="h-3 w-3" /> Agent IA</p>}
        {text}
      </div>
    </div>
  );
}
