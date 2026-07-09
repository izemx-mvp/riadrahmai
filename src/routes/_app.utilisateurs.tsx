import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { users, roles } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/utilisateurs")({
  component: UsersPage,
});

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function UsersPage() {
  return (
    <div>
      <PageHeader
        icon={Users}
        title="Utilisateurs & Rôles"
        description="Gérez les accès de l'équipe selon leur périmètre de responsabilité."
        actions={<Button variant="gold" className="gap-1.5" onClick={() => toast.success("Invitation utilisateur envoyée (simulé).")}><Plus className="h-4 w-4" /> Inviter un utilisateur</Button>}
      />

      <Card className="mb-6">
        <CardHeader className="pb-2"><CardTitle className="text-base">Membres de l'équipe</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Périmètre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.nom}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials(u.nom)}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{u.nom}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.acces}</TableCell>
                    <TableCell><Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Actif</Badge></TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => toast("Édition des accès.")}>Gérer</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Rôles & permissions</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.nom}>
            <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal/10 text-royal"><Shield className="h-4 w-4" /></div>
              <CardTitle className="text-base">{r.nom}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{r.desc}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
