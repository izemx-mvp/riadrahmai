import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot, BookOpen, Pencil, Power, Plus, SlidersHorizontal,
  MessageSquareWarning, UserPlus, Briefcase, Save,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/badges";
import { knowledgeBase } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/configuration-ia")({
  component: ConfigurationIAPage,
});

function ConfigurationIAPage() {
  return (
    <div>
      <PageHeader
        icon={Bot}
        title="Configuration de l'IA"
        description="Gérez la base de connaissances et le paramétrage des agents IA depuis une seule interface."
      />
      <Tabs defaultValue="base">
        <TabsList>
          <TabsTrigger value="base" className="gap-1.5"><BookOpen className="h-4 w-4" /> Base de connaissances</TabsTrigger>
          <TabsTrigger value="agents" className="gap-1.5"><SlidersHorizontal className="h-4 w-4" /> Paramétrage Agents IA</TabsTrigger>
        </TabsList>

        <TabsContent value="base">
          <KnowledgeSection />
        </TabsContent>

        <TabsContent value="agents">
          <AgentsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Base de connaissances ---------- */

function KnowledgeSection() {
  const [search, setSearch] = useState("");
  const list = knowledgeBase.filter((k) => `${k.titre} ${k.contenu}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input placeholder="Rechercher dans la base…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Button variant="gold" className="gap-1.5" onClick={() => toast.success("Nouvelle carte ajoutée (brouillon).")}><Plus className="h-4 w-4" /> Ajouter une carte</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((k) => (
          <Card key={k.titre} className="flex flex-col">
            <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 pb-2">
              <h3 className="text-sm font-semibold leading-snug">{k.titre}</h3>
              <StatusBadge value={k.statut} />
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <p className="text-sm text-muted-foreground">{k.contenu}</p>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2 border-t pt-3">
              <p className="text-xs text-muted-foreground">Modifié : {k.maj}</p>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" className="gap-1" onClick={() => toast("Édition de la carte.")}><Pencil className="h-3.5 w-3.5" /> Modifier</Button>
                <Button size="sm" variant="ghost" className="gap-1" onClick={() => toast(`Carte ${k.statut === "Actif" ? "désactivée" : "activée"}.`)}><Power className="h-3.5 w-3.5" /> {k.statut === "Actif" ? "Désactiver" : "Activer"}</Button>
                <Button size="sm" variant="ghost" className="gap-1 text-royal" onClick={() => toast.success("Test IA : réponse générée à partir de cette carte.")}><Bot className="h-3.5 w-3.5" /> Tester avec IA</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Paramétrage des Agents IA ---------- */

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => <span key={i} className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium">{i}</span>)}
    </div>
  );
}

function Row({ label, children }: { label: string; children: any }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function AgentsSection() {
  const save = () => toast.success("Paramètres de l'agent enregistrés.");
  return (
    <Tabs defaultValue="parents">
      <TabsList>
        <TabsTrigger value="parents" className="gap-1.5"><MessageSquareWarning className="h-4 w-4" /> Parents</TabsTrigger>
        <TabsTrigger value="admissions" className="gap-1.5"><UserPlus className="h-4 w-4" /> Admissions</TabsTrigger>
        <TabsTrigger value="rh" className="gap-1.5"><Briefcase className="h-4 w-4" /> RH</TabsTrigger>
      </TabsList>

      <TabsContent value="parents">
        <Card>
          <CardHeader><CardTitle className="text-base">Agent Communication Parents & Réclamations</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><p className="text-sm font-medium">Agent activé</p><p className="text-xs text-muted-foreground">L'agent traite automatiquement les messages entrants.</p></div>
              <Switch defaultChecked />
            </div>
            <Row label="Canaux connectés"><Chips items={["WhatsApp", "Site web", "Téléphone", "Facebook", "Instagram"]} /></Row>
            <Row label="Message d'accueil"><Textarea rows={2} defaultValue="Bonjour et bienvenue à G.S Riad Rahma. Comment pouvons-nous vous aider aujourd'hui ?" /></Row>
            <Row label="Catégories de réclamations"><Chips items={["Transport", "Cantine", "Discipline", "Paiement", "Documents", "Absence", "Retard", "Pédagogie", "Santé", "Rendez-vous Direction"]} /></Row>
            <Row label="Mots-clés d'urgence (escalade automatique)"><Chips items={["danger", "oublié", "accident", "urgence", "directeur", "plainte", "sanction", "harcèlement"]} /></Row>
            <Row label="Règles d'escalade"><Textarea rows={3} defaultValue="Escalader automatiquement : sécurité enfant, santé, transport urgent, agression ou conflit, parent très mécontent, demande de direction, sujet financier sensible, problème disciplinaire grave." /></Row>
            <Row label="Responsables internes"><Chips items={["Responsable Transport", "Vie scolaire", "Administration", "Cantine", "Direction Pédagogique"]} /></Row>
            <Separator />
            <Button variant="gold" className="gap-1.5" onClick={save}><Save className="h-4 w-4" /> Enregistrer</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="admissions">
        <Card>
          <CardHeader><CardTitle className="text-base">Agent Service Client & Admissions</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Row label="Message d'accueil prospects"><Textarea rows={2} defaultValue="Bonjour et bienvenue à G.S Riad Rahma. Souhaitez-vous des informations sur nos cycles, l'inscription, le transport ou la cantine ?" /></Row>
            <Row label="Questions de qualification"><Chips items={["Niveau souhaité", "Âge de l'enfant", "Téléphone", "Besoin transport", "Besoin cantine", "Disponibilité RDV"]} /></Row>
            <Row label="Niveaux disponibles"><Chips items={["Maternelle", "Primaire", "Collège", "Lycée"]} /></Row>
            <Row label="Services disponibles"><Chips items={["Transport scolaire", "Cantine", "Accompagnement bac"]} /></Row>
            <Row label="Règles de scoring prospect"><Textarea rows={2} defaultValue="Score élevé si : demande de rendez-vous, niveau précis fourni, coordonnées complètes, besoin transport/cantine exprimé." /></Row>
            <Row label="Créneaux de rendez-vous"><Chips items={["Lun 10h", "Mar 14h", "Mer 11h", "Jeu 15h", "Ven 9h"]} /></Row>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><p className="text-sm font-medium">Notifier l'administration</p><p className="text-xs text-muted-foreground">Email envoyé à chaque nouveau prospect chaud.</p></div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <Button variant="gold" className="gap-1.5" onClick={save}><Save className="h-4 w-4" /> Enregistrer</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rh">
        <Card>
          <CardHeader><CardTitle className="text-base">Agent Recrutement RH</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <Row label="Postes ouverts"><Chips items={["Enseignant Français", "Enseignant Maths", "Éducatrice Maternelle", "Surveillant Vie Scolaire", "Assistant Administratif", "Chauffeur Transport", "Prof Physique-Chimie"]} /></Row>
            <Row label="Questions candidature"><Chips items={["Nom", "Téléphone", "Email", "Poste souhaité", "Diplôme", "Expérience", "Disponibilité", "Langues", "CV"]} /></Row>
            <Row label="Critères de scoring"><Textarea rows={2} defaultValue="Expérience scolaire (30), Diplôme adapté (25), Disponibilité (15), Langues (15), Qualité CV & motivation (15)." /></Row>
            <Row label="Email RH destinataire"><Input defaultValue="salma.rh@riadrahma.ma" /></Row>
            <Row label="Statuts candidats"><Chips items={["Reçu", "Présélectionné", "Entretien à planifier", "À revoir", "Refusé", "Recruté"]} /></Row>
            <Row label="Modèle de réponse candidat"><Textarea rows={3} defaultValue="Merci pour votre intérêt pour G.S Riad Rahma. Votre candidature a bien été enregistrée et sera transmise à la direction. Si votre profil est retenu, vous serez contacté(e) pour un entretien." /></Row>
            <Separator />
            <Button variant="gold" className="gap-1.5" onClick={save}><Save className="h-4 w-4" /> Enregistrer</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
