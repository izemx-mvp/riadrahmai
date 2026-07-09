import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("direction@riadrahma.ma");
  const [password, setPassword] = useState("demo123");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-10">
      {/* decorative */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-royal/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="G.S Riad Rahma" width={96} height={96} className="h-24 w-24 rounded-2xl bg-white/95 p-2 shadow-xl" />
          <h1 className="mt-5 text-2xl font-bold text-primary-foreground">Plateforme IA — G.S Riad Rahma</h1>
          <p className="mt-1.5 text-sm text-primary-foreground/70">
            Communication parents · Admissions · Recrutement RH
          </p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-card p-6 shadow-2xl">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" />
              </div>
            </div>
            <Button type="submit" className="w-full gap-1.5" size="lg">
              Se connecter <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-4 rounded-lg bg-muted/60 p-2.5 text-center text-xs text-muted-foreground">
            Démo : <span className="font-medium text-foreground">direction@riadrahma.ma</span> · <span className="font-medium text-foreground">demo123</span>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-primary-foreground/60">
          Riad Rahma AI Desk — Une communication scolaire plus rapide, plus claire et mieux organisée.
        </p>
      </div>
    </div>
  );
}
