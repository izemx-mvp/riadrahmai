import { Bell, FileDown, Search } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SimulationDialog } from "@/components/simulation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles } from "lucide-react";

const today = new Date().toLocaleDateString("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="hidden md:block">
        <h1 className="text-sm font-bold leading-tight">Plateforme IA — G.S Riad Rahma</h1>
        <p className="text-[0.7rem] capitalize text-muted-foreground">{today}</p>
      </div>

      <div className="relative ml-auto hidden max-w-xs flex-1 lg:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Recherche globale…" className="pl-9" />
      </div>

      <SimulationDialog
        trigger={
          <Button size="sm" className="gap-1.5">
            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">Nouvelle simulation</span>
          </Button>
        }
      />

      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Rapport exporté (PDF simulé).")}>
        <FileDown className="h-4 w-4" /> <span className="hidden sm:inline">Exporter rapport</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Réclamation transport urgente</span>
            <span className="text-xs text-muted-foreground">Élève non récupéré à l'heure</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Candidat HOT reçu</span>
            <span className="text-xs text-muted-foreground">Enseignant Maths — 8 ans d'expérience</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Prospect admission chaud</span>
            <span className="text-xs text-muted-foreground">Visite souhaitée demain</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 transition-colors hover:bg-accent">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              DG
            </span>
            <span className="hidden text-sm font-medium sm:inline">Direction</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            Directeur Général
            <p className="text-xs font-normal text-muted-foreground">direction@riadrahma.ma</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Mon profil</DropdownMenuItem>
          <DropdownMenuItem>Paramètres</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/">Se déconnecter</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
