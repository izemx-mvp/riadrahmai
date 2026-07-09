import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Briefcase, Bot, Sparkles, CheckCircle2, CalendarPlus, XCircle,
  MessageSquarePlus, Download, Flame, FileText, ThumbsUp, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge, TempBadge } from "@/components/badges";
import { SimulationDialog } from "@/components/simulation-dialog";
import { candidats, postesOuverts, tempFromScore, type Candidat } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/rh")({
  component: RhPage,
});

const scoringGrid = [
  { critere: "Expérience dans le domaine scolaire", points: 30 },
  { critere: "Diplôme adapté", points: 25 },
  { critere: "Disponibilité", points: 15 },
  { critere: "Langues", points: 15 },
  { critere: "Qualité du CV et motivation", points: 15 },
];

const convExample = [
  { from: "user", text: "Bonjour, je souhaite postuler comme enseignante de français." },
  { from: "ia", text: "Bonjour, merci pour votre intérêt pour G.S Riad Rahma. Pouvez-vous me préciser votre expérience, votre diplôme, votre disponibilité et joindre votre CV ?" },
  { from: "user", text: "J'ai 6 ans d'expérience en primaire, licence en études françaises, disponible en septembre." },
  { from: "ia", text: "Merci. Votre candidature pour le poste d'enseignante de français a bien été enregistrée. Votre profil sera transmis à la direction pour étude. Si votre candidature est retenue, vous serez contactée pour un entretien." },
];

function RhPage() {
  const [poste, setPoste] = useState("all");
  const [statut, setStatut] = useState("all");
  const [selected, setSelected] = useState<Candidat | null>(null);

  const filtered = useMemo(() => candidats.filter((c) =>
    (poste === "all" || c.poste === poste) && (statut === "all" || c.statut === statut)
  ), [poste, statut]);

  return (
    <div>
      <PageHeader
        icon={Briefcase}
        title="Agent — Recrutement RH"
        description="L'IA répond aux candidats, collecte les informations, reçoit les CV, classe les profils et aide à présélectionner."
        actions={<SimulationDialog trigger={<Button variant="gold" className="gap-1.5"><Sparkles className="h-4 w-4" /> Simuler une candidature</Button>} />}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniKpi label="Candidatures reçues" value="9" icon={Briefcase} />
        <MiniKpi label="Candidats HOT" value="3" icon={Flame} tone="text-destructive bg-destructive/10" />
        <MiniKpi label="Postes ouverts" value="7" icon={FileText} tone="text-royal bg-royal/10" />
        <MiniKpi label="Entretiens à planifier" value="2" icon={CalendarPlus} tone="text-gold-foreground bg-gold/20" />
      </div>

      <Tabs defaultValue="candidats">
        <TabsList>
          <TabsTrigger value="candidats">Candidatures</TabsTrigger>
          <TabsTrigger value="postes">Postes ouverts</TabsTrigger>
          <TabsTrigger value="scoring">Scoring IA</TabsTrigger>
          <TabsTrigger value="conv">Exemple conversation</TabsTrigger>
        </TabsList>

        <TabsContent value="candidats">
          <Card><CardContent className="p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              <Filter label="Poste" options={postesOuverts} value={poste} onChange={setPoste} wide />
              <Filter label="Statut" options={["Présélectionné", "Entretien à planifier", "À revoir"]} value={statut} onChange={setStatut} />
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste souhaité</TableHead>
                    <TableHead>Expérience</TableHead>
                    <TableHead>Diplôme</TableHead>
                    <TableHead>Disponibilité</TableHead>
                    <TableHead>Score IA</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const t = tempFromScore(c.score);
                    return (
                      <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                        <TableCell className="font-semibold text-royal">#{c.id}</TableCell>
                        <TableCell>{c.nom}</TableCell>
                        <TableCell className="text-xs">{c.poste}</TableCell>
                        <TableCell>{c.experience}</TableCell>
                        <TableCell className="text-xs">{c.diplome}</TableCell>
                        <TableCell>{c.disponibilite}</TableCell>
                        <TableCell><span className="flex items-center gap-1.5"><span className="font-semibold">{c.score}</span><TempBadge value={t.variant} /></span></TableCell>
                        <TableCell><StatusBadge value={c.statut} /></TableCell>
                        <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(c); }}>Ouvrir</Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="postes">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {postesOuverts.map((p) => (
              <Card key={p}><CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Briefcase className="h-4 w-4" /></span>
                <div><p className="text-sm font-semibold">{p}</p><p className="text-xs text-muted-foreground">Poste ouvert</p></div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scoring">
          <Card>
            <CardHeader><CardTitle className="text-base">Grille de scoring RH (sur 100)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {scoringGrid.map((s) => (
                <div key={s.critere}>
                  <div className="mb-1 flex items-center justify-between text-sm"><span>{s.critere}</span><span className="font-semibold">{s.points} pts</span></div>
                  <Progress value={s.points / 30 * 100} />
                </div>
              ))}
              <Separator />
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5"><TempBadge value="hot" /> 80 à 100</span>
                <span className="flex items-center gap-1.5"><TempBadge value="warm" /> 50 à 79</span>
                <span className="flex items-center gap-1.5"><TempBadge value="cold" /> moins de 50</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conv">
          <Card>
            <CardHeader><CardTitle className="text-base">Simulation — collecte d'une candidature</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {convExample.map((m, i) => <ChatBubble key={i} from={m.from as "user" | "ia"} text={m.text} />)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CandidatDetail c={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CandidatDetail({ c, onClose }: { c: Candidat | null; onClose: () => void }) {
  if (!c) return null;
  const t = tempFromScore(c.score);
  const act = (m: string) => { toast.success(m); onClose(); };
  return (
    <Dialog open={!!c} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><span className="text-royal">#{c.id}</span> — {c.nom} <TempBadge value={t.variant} /> <StatusBadge value={c.statut} /></DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Téléphone" value={c.telephone} />
          <Field label="Email" value={c.email} />
          <Field label="Poste souhaité" value={c.poste} />
          <Field label="Expérience" value={c.experience} />
          <Field label="Diplôme" value={c.diplome} />
          <Field label="Langues" value={c.langues} />
          <Field label="Disponibilité" value={c.disponibilite} />
          <Field label="CV" value="CV_" />
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
          <span className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-royal" /> CV_{c.nom.replace(/\s/g, "_")}.pdf</span>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("CV téléchargé (simulé).")}><Download className="h-3.5 w-3.5" /> Télécharger</Button>
        </div>

        <div className="rounded-xl border border-royal/20 bg-royal/5 p-4 space-y-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal"><Bot className="h-4 w-4" /> Résumé IA</p>
          <p className="text-sm">{c.resumeIA}</p>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs"><span className="text-muted-foreground">Score IA</span><span className="font-semibold">{c.score} / 100</span></div>
            <Progress value={c.score} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-success"><ThumbsUp className="h-3.5 w-3.5" /> Points forts</p>
              <ul className="space-y-1 text-sm">{c.pointsForts.map((p) => <li key={p} className="flex gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" /> {p}</li>)}</ul>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-warning-foreground"><AlertCircle className="h-3.5 w-3.5" /> Points à vérifier</p>
              <ul className="space-y-1 text-sm">{c.pointsAVerifier.map((p) => <li key={p} className="flex gap-1.5"><AlertCircle className="h-3.5 w-3.5 shrink-0 text-warning-foreground" /> {p}</li>)}</ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="gold" className="gap-1.5" onClick={() => act("Candidat présélectionné.")}><CheckCircle2 className="h-3.5 w-3.5" /> Présélectionner</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => act("Entretien planifié.")}><CalendarPlus className="h-3.5 w-3.5" /> Planifier entretien</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast("Commentaire ajouté.")}><MessageSquarePlus className="h-3.5 w-3.5" /> Commenter</Button>
          <Button size="sm" variant="ghost" className="gap-1.5 text-destructive" onClick={() => act("Candidature refusée.")}><XCircle className="h-3.5 w-3.5" /> Refuser</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Filter({ label, options, value, onChange, wide }: { label: string; options: string[]; value: string; onChange: (v: string) => void; wide?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-9 ${wide ? "w-[260px]" : "w-[190px]"}`}><SelectValue placeholder={label} /></SelectTrigger>
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
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isIa ? "rounded-tl-sm bg-royal/10" : "rounded-tr-sm bg-primary text-primary-foreground"}`}>
        {isIa && <p className="mb-1 flex items-center gap-1 text-[0.7rem] font-semibold text-royal"><Bot className="h-3 w-3" /> Agent IA</p>}
        {text}
      </div>
    </div>
  );
}
