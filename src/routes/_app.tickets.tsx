import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ClipboardList, Plus, FileDown, LayoutGrid, List, Bot, UserCog, ArrowUpCircle,
  CheckCircle2, XCircle, Clock, MessageSquare, Sparkles, AlertTriangle,
  Timer, CheckCheck, Flame, Send,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { PriorityBadge, StatusBadge } from "@/components/badges";

export const Route = createFileRoute("/_app/tickets")({
  component: TicketsPage,
});

// ---------- Types & mock data ----------
type TicketStatut = "Nouveau" | "En cours" | "En attente" | "Escaladé" | "Traité" | "Clôturé";
type TicketPriorite = "Faible" | "Normale" | "Élevée" | "Urgente";

interface TicketRow {
  id: string;
  type: string;
  demandeur: string;
  telephone: string;
  eleve: string;
  cycle: string;
  classe?: string;
  sujet: string;
  message: string;
  resumeIA: string;
  priorite: TicketPriorite;
  statut: TicketStatut;
  responsable: string;
  source: string;
  creation: string;
  creePar: string;
  reponseIA: string;
  commentaires: { auteur: string; texte: string; time: string }[];
  timeline: { time: string; text: string }[];
}

const INITIAL_TICKETS: TicketRow[] = [
  {
    id: "TCK-1001", type: "Réclamation parent", demandeur: "Mme Benali", telephone: "06 12 34 56 78",
    eleve: "Adam Benali", cycle: "Primaire", classe: "CE2",
    sujet: "Retard transport scolaire", message: "Le chauffeur est arrivé très en retard aujourd'hui, mon fils est resté longtemps devant la maison.",
    resumeIA: "Le parent signale un retard important du chauffeur scolaire.",
    priorite: "Urgente", statut: "Escaladé", responsable: "Responsable Transport",
    source: "WhatsApp", creation: "Aujourd'hui, 09:15", creePar: "Agent Parents & Réclamations",
    reponseIA: "Bonjour Mme Benali, nous avons bien reçu votre réclamation. Votre demande a été transmise au responsable transport en priorité urgente. Nous revenons vers vous rapidement.",
    commentaires: [
      { auteur: "Vie scolaire", texte: "À vérifier avec le chauffeur avant 12h.", time: "09:20" },
      { auteur: "Direction", texte: "Sujet sensible, garder la direction en copie.", time: "09:25" },
    ],
    timeline: [
      { time: "09:15", text: "Ticket créé automatiquement par Agent Parents & Réclamations" },
      { time: "09:16", text: "Priorité détectée : Urgente" },
      { time: "09:17", text: "Ticket assigné au Responsable Transport" },
      { time: "09:18", text: "Réponse IA proposée au parent" },
      { time: "09:20", text: "Ticket escaladé" },
    ],
  },
  {
    id: "TCK-1002", type: "Demande document", demandeur: "Mme Alaoui", telephone: "06 55 43 21 09",
    eleve: "Yassine Alaoui", cycle: "Primaire", classe: "CP",
    sujet: "Attestation de scolarité", message: "Je n'ai pas reçu l'attestation de scolarité demandée la semaine dernière.",
    resumeIA: "Le parent demande une attestation de scolarité pour son enfant.",
    priorite: "Normale", statut: "En cours", responsable: "Administration",
    source: "WhatsApp", creation: "Aujourd'hui, 09:42", creePar: "Agent Parents & Réclamations",
    reponseIA: "Bonjour Mme Alaoui, votre demande d'attestation pour Yassine a bien été prise en compte et transmise à l'administration.",
    commentaires: [{ auteur: "Administration", texte: "Attestation en préparation, envoi ce matin.", time: "10:00" }],
    timeline: [
      { time: "09:42", text: "Ticket créé par Agent Parents & Réclamations" },
      { time: "09:43", text: "Assigné à Administration" },
    ],
  },
  {
    id: "TCK-1003", type: "Discipline", demandeur: "M. El Amrani", telephone: "06 78 90 12 34",
    eleve: "Lina El Amrani", cycle: "Collège", classe: "6ème",
    sujet: "Conflit entre élèves", message: "Ma fille m'a dit qu'elle a eu un problème avec une autre élève pendant la récréation.",
    resumeIA: "Le parent signale un problème entre sa fille et une autre élève.",
    priorite: "Élevée", statut: "En cours", responsable: "Vie scolaire",
    source: "Site web", creation: "Aujourd'hui, 10:05", creePar: "Agent Parents & Réclamations",
    reponseIA: "Bonjour M. El Amrani, la vie scolaire a été informée et se penche sur la situation. Un retour vous sera donné dès vérification.",
    commentaires: [{ auteur: "Vie scolaire", texte: "Entretien prévu avec les deux élèves cet après-midi.", time: "10:15" }],
    timeline: [
      { time: "10:05", text: "Ticket créé par Agent Parents & Réclamations" },
      { time: "10:07", text: "Priorité détectée : Élevée" },
      { time: "10:08", text: "Assigné à Vie scolaire" },
    ],
  },
  {
    id: "TCK-1004", type: "Demande inscription", demandeur: "Mme Sara Lahlou", telephone: "06 12 45 78 90",
    eleve: "Rayan Lahlou", cycle: "Primaire", classe: "CE1",
    sujet: "Inscription en CE1", message: "Bonjour, je souhaite inscrire mon fils en CE1 avec transport et cantine.",
    resumeIA: "Prospect intéressé par une inscription en CE1 avec transport et cantine.",
    priorite: "Élevée", statut: "Nouveau", responsable: "Service Admissions",
    source: "Facebook", creation: "Aujourd'hui, 10:18", creePar: "Agent Service Client & Admissions",
    reponseIA: "Bonjour Mme Lahlou, merci pour votre intérêt pour G.S Riad Rahma. Notre service admissions vous recontacte pour organiser une visite.",
    commentaires: [{ auteur: "Service Admissions", texte: "Parent à rappeler après confirmation de disponibilité.", time: "10:20" }],
    timeline: [
      { time: "10:18", text: "Ticket créé par Agent Service Client & Admissions" },
      { time: "10:19", text: "Prospect qualifié Chaud" },
    ],
  },
  {
    id: "TCK-1005", type: "Sujet RH", demandeur: "Hind Bakkali", telephone: "06 45 12 33 20",
    eleve: "Candidate RH", cycle: "Non concerné",
    sujet: "Candidature éducatrice maternelle", message: "Je souhaite postuler comme éducatrice de maternelle, 5 ans d'expérience.",
    resumeIA: "Candidature reçue pour un poste d'éducatrice maternelle.",
    priorite: "Normale", statut: "En attente", responsable: "Responsable RH",
    source: "Site web", creation: "Hier, 16:30", creePar: "Agent Recrutement RH",
    reponseIA: "Bonjour, merci pour votre candidature. Votre dossier a été présélectionné et sera étudié par le responsable RH.",
    commentaires: [{ auteur: "Responsable RH", texte: "Profil intéressant, entretien à planifier.", time: "17:10" }],
    timeline: [
      { time: "16:30", text: "Ticket créé par Agent Recrutement RH" },
      { time: "16:32", text: "Score IA : 88 — Présélectionnée" },
    ],
  },
  {
    id: "TCK-1006", type: "Rendez-vous direction", demandeur: "Mme Idrissi", telephone: "06 33 22 11 44",
    eleve: "Omar Idrissi", cycle: "Lycée", classe: "1ère Bac",
    sujet: "Demande de rendez-vous pédagogique", message: "Je souhaite rencontrer la direction concernant les résultats scolaires de mon fils.",
    resumeIA: "Le parent souhaite rencontrer la direction concernant les résultats scolaires de son fils.",
    priorite: "Élevée", statut: "Escaladé", responsable: "Direction",
    source: "WhatsApp", creation: "Hier, 14:10", creePar: "Agent Parents & Réclamations",
    reponseIA: "Bonjour Mme Idrissi, votre demande de rendez-vous a été transmise à la direction pédagogique qui vous contactera rapidement.",
    commentaires: [],
    timeline: [
      { time: "14:10", text: "Ticket créé par Agent Parents & Réclamations" },
      { time: "14:12", text: "Escaladé à la Direction" },
    ],
  },
  {
    id: "TCK-1007", type: "Cantine", demandeur: "M. Berrada", telephone: "06 70 88 99 10",
    eleve: "Salma Berrada", cycle: "Maternelle", classe: "GS",
    sujet: "Allergie alimentaire", message: "Je souhaite confirmer la prise en compte d'une allergie alimentaire pour ma fille.",
    resumeIA: "Le parent souhaite confirmer la prise en compte d'une allergie alimentaire.",
    priorite: "Élevée", statut: "Traité", responsable: "Administration",
    source: "Téléphone", creation: "Hier, 11:25", creePar: "Ajout manuel",
    reponseIA: "Bonjour M. Berrada, la cantine a bien pris en compte l'allergie alimentaire de Salma. Un menu adapté lui est réservé.",
    commentaires: [{ auteur: "Cantine", texte: "Allergie enregistrée dans la fiche élève.", time: "11:40" }],
    timeline: [
      { time: "11:25", text: "Ticket créé manuellement" },
      { time: "11:40", text: "Marqué comme traité" },
    ],
  },
  {
    id: "TCK-1008", type: "Demande administrative", demandeur: "M. Karim Tazi", telephone: "06 33 22 11 44",
    eleve: "Noura Tazi", cycle: "Maternelle", classe: "MS",
    sujet: "Informations inscription MS", message: "Quels sont les documents nécessaires pour une inscription en maternelle ?",
    resumeIA: "Le parent demandait les documents nécessaires pour une inscription en maternelle.",
    priorite: "Normale", statut: "Clôturé", responsable: "Service Admissions",
    source: "Instagram", creation: "Il y a 2 jours", creePar: "Agent Service Client & Admissions",
    reponseIA: "Bonjour, voici la liste des documents nécessaires : acte de naissance, photos d'identité, copie CIN du parent.",
    commentaires: [],
    timeline: [
      { time: "J-2 10:00", text: "Ticket créé par Agent Service Client & Admissions" },
      { time: "J-2 10:05", text: "Information envoyée au parent" },
      { time: "J-1 09:00", text: "Ticket clôturé" },
    ],
  },
];

const TYPES = [
  "Réclamation parent", "Demande inscription", "Demande administrative", "Demande document",
  "Sujet RH", "Rendez-vous direction", "Transport", "Cantine", "Discipline",
];
const STATUTS: TicketStatut[] = ["Nouveau", "En cours", "En attente", "Escaladé", "Traité", "Clôturé"];
const PRIORITES: TicketPriorite[] = ["Faible", "Normale", "Élevée", "Urgente"];
const RESPONSABLES = [
  "Administration", "Direction", "Vie scolaire", "Responsable Transport",
  "Responsable RH", "Service Admissions",
];
const CYCLES = ["Maternelle", "Primaire", "Collège", "Lycée", "Non concerné"];
const CANAUX = ["WhatsApp", "Site web", "Facebook", "Instagram", "Téléphone", "Saisie manuelle"];

// ---------- Component ----------
function TicketsPage() {
  const [tickets, setTickets] = useState<TicketRow[]>(INITIAL_TICKETS);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [search, setSearch] = useState("");
  const [ftype, setFtype] = useState("all");
  const [fstatut, setFstatut] = useState("all");
  const [fprio, setFprio] = useState("all");
  const [fresp, setFresp] = useState("all");
  const [fcycle, setFcycle] = useState("all");
  const [fsource, setFsource] = useState("all");
  const [selected, setSelected] = useState<TicketRow | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => tickets.filter((t) =>
    (ftype === "all" || t.type === ftype) &&
    (fstatut === "all" || t.statut === fstatut) &&
    (fprio === "all" || t.priorite === fprio) &&
    (fresp === "all" || t.responsable === fresp) &&
    (fcycle === "all" || t.cycle === fcycle) &&
    (fsource === "all" || t.source === fsource) &&
    (search === "" || `${t.id} ${t.demandeur} ${t.eleve} ${t.sujet}`.toLowerCase().includes(search.toLowerCase()))
  ), [tickets, ftype, fstatut, fprio, fresp, fcycle, fsource, search]);

  const updateTicket = (id: string, patch: Partial<TicketRow>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  return (
    <div>
      <PageHeader
        icon={ClipboardList}
        title="Tickets & Assignation"
        description="Centralisation, suivi et traitement des demandes nécessitant une intervention humaine."
        actions={
          <>
            <Button variant="gold" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Nouveau ticket
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Export tickets (CSV simulé).")}>
              <FileDown className="h-4 w-4" /> Exporter
            </Button>
            <div className="flex overflow-hidden rounded-md border">
              <Button size="sm" variant={view === "list" ? "default" : "ghost"} className="gap-1.5 rounded-none" onClick={() => setView("list")}>
                <List className="h-4 w-4" /> Liste
              </Button>
              <Button size="sm" variant={view === "kanban" ? "default" : "ghost"} className="gap-1.5 rounded-none" onClick={() => setView("kanban")}>
                <LayoutGrid className="h-4 w-4" /> Kanban
              </Button>
            </div>
          </>
        }
      />

      {/* KPIs */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi icon={ClipboardList} label="Tickets ouverts" value="24" hint="+8% cette semaine" tone="royal" />
        <Kpi icon={Flame} label="Tickets urgents" value="5" hint="5 urgents à traiter" tone="destructive" />
        <Kpi icon={Timer} label="Tickets en cours" value="12" hint="12 suivis actifs" tone="warning" />
        <Kpi icon={CheckCheck} label="Clôturés (semaine)" value="38" hint="+14 clôturés" tone="success" />
        <Kpi icon={Clock} label="Temps moyen" value="4h 20min" hint="-22% temps de réponse" tone="info" />
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Rechercher demandeur, élève, sujet, #ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full max-w-xs" />
            <FSel label="Type" options={TYPES} value={ftype} onChange={setFtype} />
            <FSel label="Statut" options={STATUTS} value={fstatut} onChange={setFstatut} />
            <FSel label="Priorité" options={PRIORITES} value={fprio} onChange={setFprio} />
            <FSel label="Responsable" options={RESPONSABLES} value={fresp} onChange={setFresp} />
            <FSel label="Cycle" options={CYCLES} value={fcycle} onChange={setFcycle} />
            <FSel label="Canal" options={CANAUX} value={fsource} onChange={setFsource} />
          </div>
        </CardContent>
      </Card>

      {view === "list" ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Demandeur</TableHead>
                    <TableHead>Élève / Candidat</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Créé</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id} className="cursor-pointer" onClick={() => setSelected(t)}>
                      <TableCell className="font-semibold text-royal">#{t.id}</TableCell>
                      <TableCell className="text-xs">{t.type}</TableCell>
                      <TableCell>{t.demandeur}</TableCell>
                      <TableCell>{t.eleve}</TableCell>
                      <TableCell className="text-xs">{t.cycle}</TableCell>
                      <TableCell className="max-w-[220px] truncate">{t.sujet}</TableCell>
                      <TableCell><PriorityBadge value={t.priorite} /></TableCell>
                      <TableCell><StatusBadge value={t.statut} /></TableCell>
                      <TableCell className="text-xs">{t.responsable}</TableCell>
                      <TableCell className="text-xs">{t.source}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.creation}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(t); }}>Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={12} className="py-10 text-center text-sm text-muted-foreground">Aucun ticket ne correspond aux filtres.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <KanbanView tickets={filtered} onOpen={setSelected} />
      )}

      <TicketDetail
        ticket={selected}
        onClose={() => setSelected(null)}
        onAssign={() => setAssignOpen(true)}
        onUpdate={updateTicket}
      />
      <AssignDialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        ticket={selected}
        onConfirm={(resp, prio) => {
          if (selected) updateTicket(selected.id, { responsable: resp, priorite: prio });
          setAssignOpen(false);
          toast.success("Ticket assigné avec succès.");
        }}
      />
      <CreateTicketDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(t) => {
          setTickets((prev) => [t, ...prev]);
          setCreateOpen(false);
          toast.success("Ticket créé avec succès.");
        }}
      />
    </div>
  );
}

// ---------- Sub components ----------
function Kpi({ icon: Icon, label, value, hint, tone }: { icon: any; label: string; value: string; hint: string; tone: "royal" | "gold" | "destructive" | "warning" | "success" | "info" }) {
  const toneMap: Record<string, string> = {
    royal: "bg-royal/10 text-royal",
    gold: "bg-gold/20 text-gold-foreground",
    destructive: "bg-destructive/12 text-destructive",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/12 text-success",
    info: "bg-info/12 text-info",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold leading-tight">{value}</p>
          <p className="truncate text-[0.7rem] text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FSel({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label} : tous</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function KanbanView({ tickets, onOpen }: { tickets: TicketRow[]; onOpen: (t: TicketRow) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      {STATUTS.map((col) => {
        const items = tickets.filter((t) => t.statut === col);
        return (
          <div key={col} className="flex flex-col rounded-xl border bg-muted/30 p-2">
            <div className="mb-2 flex items-center justify-between px-1">
              <StatusBadge value={col} />
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onOpen(t)}
                  className="rounded-lg border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-semibold text-royal">#{t.id}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-medium">{t.sujet}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.demandeur}</p>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <PriorityBadge value={t.priorite} />
                    <span className="truncate text-[0.65rem] text-muted-foreground">{t.responsable}</span>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground">{t.type}</p>
                </button>
              ))}
              {items.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">—</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TicketDetail({ ticket, onClose, onAssign, onUpdate }: {
  ticket: TicketRow | null;
  onClose: () => void;
  onAssign: () => void;
  onUpdate: (id: string, patch: Partial<TicketRow>) => void;
}) {
  const [comment, setComment] = useState("");
  if (!ticket) return null;

  const changeStatut = (s: TicketStatut) => {
    onUpdate(ticket.id, { statut: s });
    toast.success("Statut du ticket mis à jour.");
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    onUpdate(ticket.id, {
      commentaires: [...ticket.commentaires, { auteur: "Direction", texte: comment.trim(), time: now }],
    });
    setComment("");
    toast.success("Commentaire ajouté.");
  };

  return (
    <Dialog open={!!ticket} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="text-royal">#{ticket.id}</span> — {ticket.sujet}
            <PriorityBadge value={ticket.priorite} />
            <StatusBadge value={ticket.statut} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-4">
          <Info title="Type" value={ticket.type} />
          <Info title="Source" value={ticket.source} />
          <Info title="Responsable" value={ticket.responsable} />
          <Info title="Créé le" value={ticket.creation} />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Info title="Demandeur" value={ticket.demandeur} sub={ticket.telephone} />
          <Info title="Élève / Candidat" value={ticket.eleve} sub={`${ticket.cycle}${ticket.classe ? ` · ${ticket.classe}` : ""}`} />
          <Info title="Créé par" value={ticket.creePar} />
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message initial</p>
          <p className="text-sm leading-relaxed">« {ticket.message} »</p>
        </div>

        <div className="rounded-xl border border-royal/20 bg-royal/5 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal">
            <Bot className="h-4 w-4" /> Analyse & réponse IA
          </p>
          <p className="mb-1 text-xs text-muted-foreground">Résumé IA</p>
          <p className="mb-2 text-sm">{ticket.resumeIA}</p>
          <Separator className="my-2" />
          <p className="mb-1 text-xs text-muted-foreground">Réponse proposée par l'IA</p>
          <p className="text-sm leading-relaxed">{ticket.reponseIA}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Historique</p>
            <ol className="relative space-y-3 border-l pl-5 text-sm">
              {ticket.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.44rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-royal" />
                  <p className="flex items-center gap-1.5 font-medium"><Clock className="h-3 w-3 text-muted-foreground" /> {t.time}</p>
                  <p className="text-xs text-muted-foreground">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> Commentaires internes
            </p>
            <div className="mb-2 space-y-2">
              {ticket.commentaires.map((c, i) => (
                <div key={i} className="rounded-lg border bg-card p-2.5 text-sm">
                  <p className="text-xs font-semibold text-royal">{c.auteur} <span className="font-normal text-muted-foreground">· {c.time}</span></p>
                  <p>{c.texte}</p>
                </div>
              ))}
              {ticket.commentaires.length === 0 && <p className="text-xs text-muted-foreground">Aucun commentaire pour le moment.</p>}
            </div>
            <Textarea placeholder="Ajouter un commentaire interne…" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />
            <Button size="sm" className="mt-2" onClick={addComment}>Ajouter</Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onAssign}>
            <UserCog className="h-3.5 w-3.5" /> Assigner
          </Button>
          <Select value={ticket.statut} onValueChange={(v) => changeStatut(v as TicketStatut)}>
            <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUTS.map((s) => <SelectItem key={s} value={s}>Statut : {s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" variant="gold" className="gap-1.5" onClick={() => toast.success("Réponse IA envoyée au demandeur.")}>
            <Send className="h-3.5 w-3.5" /> Répondre avec IA
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-destructive" onClick={() => { changeStatut("Escaladé"); toast.success("Ticket escaladé à la direction."); }}>
            <ArrowUpCircle className="h-3.5 w-3.5" /> Escalader
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-success" onClick={() => changeStatut("Traité")}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Marquer traité
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => changeStatut("Clôturé")}>
            <XCircle className="h-3.5 w-3.5" /> Clôturer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="font-semibold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function AssignDialog({ open, onClose, ticket, onConfirm }: {
  open: boolean; onClose: () => void; ticket: TicketRow | null;
  onConfirm: (resp: string, prio: TicketPriorite) => void;
}) {
  const [resp, setResp] = useState("Administration");
  const [prio, setPrio] = useState<TicketPriorite>("Normale");
  const [message, setMessage] = useState("");
  const [deadline, setDeadline] = useState("");

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UserCog className="h-5 w-5 text-royal" /> Assigner le ticket #{ticket.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-xs">Responsable ou service</Label>
            <Select value={resp} onValueChange={setResp}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RESPONSABLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Priorité</Label>
            <Select value={prio} onValueChange={(v) => setPrio(v as TicketPriorite)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Date limite (optionnel)</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Message interne (optionnel)</Label>
            <Textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Contexte à transmettre au responsable…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant="gold" onClick={() => onConfirm(resp, prio)}>Confirmer assignation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateTicketDialog({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void; onCreate: (t: TicketRow) => void;
}) {
  const [form, setForm] = useState({
    type: TYPES[0], demandeur: "", telephone: "", eleve: "", cycle: "Primaire", classe: "",
    sujet: "", message: "", priorite: "Normale" as TicketPriorite, responsable: "Administration",
    source: "Saisie manuelle",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.demandeur || !form.sujet) {
      toast.error("Merci de renseigner le demandeur et le sujet.");
      return;
    }
    const id = `TCK-${1009 + Math.floor(Math.random() * 900)}`;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    onCreate({
      id, ...form,
      resumeIA: form.message.slice(0, 120) || "Ticket créé manuellement.",
      statut: "Nouveau",
      creation: `Aujourd'hui, ${now}`,
      creePar: "Ajout manuel",
      reponseIA: "Réponse à rédiger par le responsable assigné.",
      commentaires: [],
      timeline: [{ time: now, text: "Ticket créé manuellement" }],
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-gold" /> Nouveau ticket</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Type de ticket"><Select value={form.type} onValueChange={(v) => set("type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TYPES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Source"><Select value={form.source} onValueChange={(v) => set("source", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CANAUX.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Nom du demandeur"><Input value={form.demandeur} onChange={(e) => set("demandeur", e.target.value)} /></Field>
          <Field label="Téléphone"><Input value={form.telephone} onChange={(e) => set("telephone", e.target.value)} /></Field>
          <Field label="Élève / Candidat"><Input value={form.eleve} onChange={(e) => set("eleve", e.target.value)} /></Field>
          <Field label="Cycle"><Select value={form.cycle} onValueChange={(v) => set("cycle", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CYCLES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Classe"><Input value={form.classe} onChange={(e) => set("classe", e.target.value)} placeholder="ex. CE1" /></Field>
          <Field label="Priorité"><Select value={form.priorite} onValueChange={(v) => set("priorite", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PRIORITES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Responsable"><Select value={form.responsable} onValueChange={(v) => set("responsable", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{RESPONSABLES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></Field>
          <div className="md:col-span-2"><Field label="Sujet"><Input value={form.sujet} onChange={(e) => set("sujet", e.target.value)} /></Field></div>
          <div className="md:col-span-2"><Field label="Message"><Textarea rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} /></Field></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant="gold" onClick={submit} className="gap-1.5"><Plus className="h-4 w-4" /> Créer ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs">{label}</Label>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _iconRef = AlertTriangle;
