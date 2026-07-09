import { useState } from "react";
import { Sparkles, MessageSquareWarning, UserPlus, Briefcase, Bot, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, PriorityBadge } from "@/components/badges";

type Scenario = "reclamation" | "admission" | "rh" | null;

const presets: Record<Exclude<Scenario, null>, { label: string; icon: any; message: string }> = {
  reclamation: {
    label: "Réclamation parent",
    icon: MessageSquareWarning,
    message:
      "Bonjour, mon fils Adam en CE2 est resté devant la maison car le chauffeur est arrivé avec beaucoup de retard. Je veux une explication rapidement.",
  },
  admission: {
    label: "Demande inscription",
    icon: UserPlus,
    message:
      "Bonjour, je veux inscrire ma fille en maternelle moyenne section. Je veux savoir les documents et si vous avez la cantine.",
  },
  rh: {
    label: "Candidature RH",
    icon: Briefcase,
    message:
      "Bonjour, je souhaite postuler comme enseignante de français. J'ai 6 ans d'expérience en primaire et une licence en études françaises.",
  },
};

interface Analysis {
  fields: { k: string; v: string; badge?: "status" | "priority" }[];
  reponse: string;
  escalade?: boolean;
}

const results: Record<Exclude<Scenario, null>, Analysis> = {
  reclamation: {
    fields: [
      { k: "Catégorie détectée", v: "Transport" },
      { k: "Priorité", v: "Urgente", badge: "priority" },
      { k: "Sentiment", v: "Parent inquiet / mécontent" },
      { k: "Ticket créé", v: "#REC-NEW" },
      { k: "Responsable", v: "Responsable Transport" },
      { k: "Escalade automatique", v: "Oui" },
    ],
    escalade: true,
    reponse:
      "Bonjour, nous avons bien reçu votre réclamation concernant le transport scolaire d'Adam. Votre demande a été transmise au responsable transport avec un niveau de priorité urgent. Nous revenons vers vous dès vérification auprès du chauffeur. Merci pour votre compréhension.",
  },
  admission: {
    fields: [
      { k: "Type", v: "Nouvelle admission" },
      { k: "Cycle", v: "Maternelle" },
      { k: "Niveau", v: "MS" },
      { k: "Besoin cantine", v: "Oui" },
      { k: "Prospect créé", v: "#ADM-NEW" },
      { k: "Score intérêt", v: "82 / 100" },
    ],
    reponse:
      "Bonjour et bienvenue à G.S Riad Rahma. Votre demande d'inscription en maternelle moyenne section a bien été enregistrée. Les documents demandés sont : acte de naissance, photos d'identité, copie CIN du parent et certificat de scolarité. Un service cantine est disponible. L'administration vous contactera pour finaliser votre dossier.",
  },
  rh: {
    fields: [
      { k: "Type", v: "Candidature RH" },
      { k: "Poste", v: "Enseignante Français" },
      { k: "Expérience", v: "6 ans" },
      { k: "Score IA", v: "86 / 100" },
      { k: "Statut", v: "Présélectionné", badge: "status" },
      { k: "Fiche candidat créée", v: "#RH-NEW" },
    ],
    reponse:
      "Bonjour, merci pour votre intérêt pour G.S Riad Rahma. Votre candidature pour le poste d'enseignante de français a bien été enregistrée. Votre profil sera transmis à la direction pour étude. Si votre candidature est retenue, vous serez contactée pour un entretien.",
  },
};

export function SimulationDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scenario, setScenario] = useState<Scenario>(null);
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setScenario(null);
    setMessage("");
    setAnalyzing(false);
    setDone(false);
  };

  const pick = (s: Exclude<Scenario, null>) => {
    setScenario(s);
    setMessage(presets[s].message);
    setDone(false);
  };

  const analyze = () => {
    setAnalyzing(true);
    setDone(false);
    setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
      toast.success("Analyse IA terminée — demande traitée et ticket créé.");
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" /> Nouvelle simulation IA
          </DialogTitle>
          <DialogDescription>
            Testez en direct comment un agent IA reçoit, comprend et traite une demande.
          </DialogDescription>
        </DialogHeader>

        {!scenario ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(presets) as Exclude<Scenario, null>[]).map((s) => {
              const P = presets[s];
              return (
                <button
                  key={s}
                  onClick={() => pick(s)}
                  className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center transition-all hover:border-royal hover:shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <P.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">{P.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{presets[scenario].label}</span>
              <Button variant="ghost" size="sm" onClick={reset}>Changer de scénario</Button>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Message reçu</label>
              <Textarea value={message} onChange={(e) => { setMessage(e.target.value); setDone(false); }} rows={3} />
            </div>

            <Button onClick={analyze} disabled={analyzing} className="w-full gap-2">
              <Bot className="h-4 w-4" />
              {analyzing ? "Analyse IA en cours…" : "Analyser avec l'IA"}
            </Button>

            {analyzing && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                <span className="h-2 w-2 animate-ping rounded-full bg-royal" />
                L'agent lit le message, détecte la catégorie et prépare une réponse…
              </div>
            )}

            {done && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {results[scenario].escalade && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/25 bg-destructive/8 p-3 text-sm font-medium text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Cas sensible détecté — escalade automatique vers un responsable humain.
                  </div>
                )}
                <div className="rounded-xl border bg-card p-4">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Analyse de l'agent IA
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {results[scenario].fields.map((f) => (
                      <div key={f.k} className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                        <span className="text-muted-foreground">{f.k}</span>
                        {f.badge === "priority" ? <PriorityBadge value={f.v} /> : f.badge === "status" ? <StatusBadge value={f.v} /> : <span className="font-semibold">{f.v}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-royal/20 bg-royal/5 p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal">
                    <MessageSquareIcon /> Réponse proposée par l'IA
                  </p>
                  <p className="text-sm leading-relaxed">{results[scenario].reponse}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="gold" className="gap-1" onClick={() => { toast.success("Réponse envoyée au demandeur."); setOpen(false); reset(); }}>
                      Envoyer la réponse <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast("Réponse modifiable avant envoi.")}>Modifier</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MessageSquareIcon() {
  return <Bot className="h-4 w-4" />;
}
