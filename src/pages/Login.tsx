import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, Lock, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "gestor" | "admin";

const demoCreds: Record<Mode, { email: string; password: string; label: string }> = {
  gestor: { email: "gestor@agrogestor.com", password: "gestor123", label: "Acesso de Gestor" },
  admin: { email: "admin@agrogestor.com", password: "admin123", label: "Acesso de Administrador" },
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("gestor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = login(email, password);
    setLoading(false);
    if (!r.ok) {
      toast.error(r.error ?? "Falha ao entrar");
      return;
    }
    toast.success("Bem-vindo!");
    navigate(mode === "admin" ? "/admin" : "/");
  };

  const fillDemo = (m: Mode) => {
    setMode(m);
    setEmail(demoCreds[m].email);
    setPassword(demoCreds[m].password);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-earth opacity-90 dark:opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-4 py-10 lg:flex-row lg:gap-16">
        {/* Brand panel */}
        <div className="hidden max-w-md flex-1 text-white lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <Leaf className="h-3.5 w-3.5" /> AgroGestor • Versão demo
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            A gestão da sua fazenda começa aqui.
          </h1>
          <p className="mt-3 text-base text-white/85">
            Plataforma de gestão rural para controle financeiro, lavoura e rebanho — em uma só tela.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Dashboard com indicadores em tempo real",
              "Controle financeiro por safra e propriedade",
              "Acompanhamento de rebanho e patrimônio",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-sm text-white/90">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-elegant backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">AgroGestor</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Gestão rural</p>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-foreground">Entrar na plataforma</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecione o tipo de acesso para continuar.
            </p>

            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="mt-5">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-secondary p-1">
                <TabsTrigger value="gestor" className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <UserIcon className="mr-1.5 h-3.5 w-3.5" /> Gestor
                </TabsTrigger>
                <TabsTrigger value="admin" className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Administrador
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gestor" className="mt-5">
                <ModeHint
                  title="Acesso do Gestor"
                  description="Acesse o painel completo para administrar finanças, lavouras, propriedades e rebanho."
                />
              </TabsContent>
              <TabsContent value="admin" className="mt-5">
                <ModeHint
                  title="Acesso do Administrador"
                  description="Cadastre e gerencie os gestores que terão acesso ao AgroGestor."
                />
              </TabsContent>
            </Tabs>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email" type="email" autoComplete="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com" className="h-11 pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password" type={show ? "text" : "password"} autoComplete="current-password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" className="h-11 pl-9 pr-10"
                  />
                  <button
                    type="button" onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                    aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="h-11 w-full rounded-full bg-gradient-primary text-primary-foreground hover:opacity-95">
                {loading ? "Entrando..." : `Entrar como ${mode === "admin" ? "Administrador" : "Gestor"}`}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Acessos de demonstração
              </p>
              <div className="space-y-2">
                {(["gestor", "admin"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => fillDemo(m)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 text-left text-xs transition hover:-translate-y-0.5 hover:shadow-card",
                      mode === m && "ring-2 ring-primary/30",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-semibold text-foreground">
                        {m === "admin"
                          ? <><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Administrador</>
                          : <><UserIcon className="h-3.5 w-3.5 text-primary" /> Gestor</>}
                      </p>
                      <p className="truncate text-muted-foreground">{demoCreds[m].email}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-primary">Preencher</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-snug text-muted-foreground">
                Protótipo demonstrativo — autenticação 100% mockada em memória.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeHint({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-3">
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{description}</p>
    </div>
  );
}
