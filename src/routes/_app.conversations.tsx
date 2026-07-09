import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MessagesSquare, Bot, Hand, Send, TicketPlus, ArrowUpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/badges";
import { conversations, type Conversation } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/conversations")({
  component: ConversationsPage,
});

function ConversationsPage() {
  const [type, setType] = useState("all");
  const [agent, setAgent] = useState("all");
  const [statut, setStatut] = useState("all");
  const [active, setActive] = useState<Conversation>(conversations[0]);
  const [draft, setDraft] = useState("");

  const list = useMemo(() => conversations.filter((c) =>
    (type === "all" || c.type === type) &&
    (agent === "all" || c.agent === agent) &&
    (statut === "all" || c.statut === statut)
  ), [type, agent, statut]);

  return (
    <div>
      <PageHeader
        icon={MessagesSquare}
        title="Conversations"
        description="Toutes les conversations parents, prospects et candidats gérées par les agents IA."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Filter label="Type" options={["Parent", "Prospect", "Candidat"]} value={type} onChange={setType} />
        <Filter label="Agent" options={["Réclamations", "Admissions", "RH"]} value={agent} onChange={setAgent} />
        <Filter label="Statut" options={["Ouverte", "Traitée par IA", "Escaladée", "Clôturée"]} value={statut} onChange={setStatut} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="max-h-[70vh] divide-y overflow-y-auto">
              {list.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-accent ${active.id === c.id ? "bg-accent" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{c.nom}</span>
                    <StatusBadge value={c.statut} />
                  </div>
                  <span className="text-xs text-muted-foreground">{c.type} · {c.canal}</span>
                  <span className="truncate text-xs text-muted-foreground">{c.sujet}</span>
                </button>
              ))}
              {list.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Aucune conversation.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <p className="font-semibold">{active.nom}</p>
              <p className="text-xs text-muted-foreground">{active.type} · {active.agent} · {active.canal}</p>
            </div>
            <StatusBadge value={active.statut} />
          </div>

          <div className="border-b bg-royal/5 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-royal"><Bot className="h-4 w-4" /> Résumé IA</p>
            <p className="mt-1 text-sm">{active.resumeIA}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {active.actions.map((a) => <span key={a} className="rounded-full bg-royal/10 px-2.5 py-0.5 text-xs font-medium text-royal">{a}</span>)}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "ia" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "ia" ? "rounded-tl-sm bg-royal/10" : "rounded-tr-sm bg-primary text-primary-foreground"}`}>
                  {m.from === "ia" && <p className="mb-1 flex items-center gap-1 text-[0.7rem] font-semibold text-royal"><Bot className="h-3 w-3" /> Agent IA</p>}
                  {m.text}
                  <p className={`mt-1 text-[0.65rem] ${m.from === "ia" ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />
          <div className="p-4">
            <div className="mb-2 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Vous avez pris la main sur la conversation.")}><Hand className="h-3.5 w-3.5" /> Prendre la main</Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Ticket créé depuis la conversation.")}><TicketPlus className="h-3.5 w-3.5" /> Créer ticket</Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-destructive" onClick={() => toast.success("Conversation escaladée.")}><ArrowUpCircle className="h-3.5 w-3.5" /> Escalader</Button>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Écrire un message ou utiliser une réponse IA…" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <Button variant="gold" className="gap-1.5 shrink-0" onClick={() => { toast.success("Réponse IA envoyée."); setDraft(""); }}><Bot className="h-4 w-4" /> Réponse IA</Button>
              <Button size="icon" className="shrink-0" onClick={() => { toast.success("Message envoyé."); setDraft(""); }}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
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
