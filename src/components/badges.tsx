import { cn } from "@/lib/utils";

const priorityMap: Record<string, string> = {
  Urgente: "bg-destructive/12 text-destructive border-destructive/25",
  "Élevée": "bg-warning/15 text-warning-foreground border-warning/30",
  Normale: "bg-info/12 text-info border-info/25",
  Faible: "bg-muted text-muted-foreground border-border",
};

const statusMap: Record<string, string> = {
  Nouveau: "bg-info/12 text-info border-info/25",
  "En cours": "bg-royal/12 text-royal border-royal/25",
  "Escaladé": "bg-destructive/12 text-destructive border-destructive/25",
  "Escaladée": "bg-destructive/12 text-destructive border-destructive/25",
  "Résolu": "bg-success/12 text-success border-success/25",
  "Clôturé": "bg-muted text-muted-foreground border-border",
  "Clôturée": "bg-muted text-muted-foreground border-border",
  "Traitée par IA": "bg-royal/12 text-royal border-royal/25",
  Ouverte: "bg-info/12 text-info border-info/25",
  "En attente parent": "bg-warning/15 text-warning-foreground border-warning/30",
  "En attente administration": "bg-warning/15 text-warning-foreground border-warning/30",
  "Rendez-vous demandé": "bg-gold/20 text-gold-foreground border-gold/40",
  "Rendez-vous confirmé": "bg-success/12 text-success border-success/25",
  "À rappeler": "bg-warning/15 text-warning-foreground border-warning/30",
  "Information envoyée": "bg-info/12 text-info border-info/25",
  "Dossier en cours": "bg-royal/12 text-royal border-royal/25",
  Inscrit: "bg-success/12 text-success border-success/25",
  "Non intéressé": "bg-muted text-muted-foreground border-border",
  "Présélectionné": "bg-success/12 text-success border-success/25",
  "Entretien à planifier": "bg-royal/12 text-royal border-royal/25",
  "À revoir": "bg-warning/15 text-warning-foreground border-warning/30",
  Actif: "bg-success/12 text-success border-success/25",
  Inactif: "bg-muted text-muted-foreground border-border",
  Brouillon: "bg-warning/15 text-warning-foreground border-warning/30",
};

const tempMap: Record<string, string> = {
  hot: "bg-destructive/12 text-destructive border-destructive/25",
  Chaud: "bg-destructive/12 text-destructive border-destructive/25",
  warm: "bg-warning/15 text-warning-foreground border-warning/30",
  Moyen: "bg-warning/15 text-warning-foreground border-warning/30",
  cold: "bg-info/12 text-info border-info/25",
  Froid: "bg-info/12 text-info border-info/25",
};

function base(className?: string) {
  return cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
    className,
  );
}

export function PriorityBadge({ value }: { value: string }) {
  return <span className={base(priorityMap[value] ?? statusMap.Faible)}>{value}</span>;
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={base(statusMap[value] ?? "bg-muted text-muted-foreground border-border")}>{value}</span>;
}

export function TempBadge({ value }: { value: string }) {
  return <span className={base(tempMap[value] ?? "bg-muted text-muted-foreground border-border")}>{value}</span>;
}
