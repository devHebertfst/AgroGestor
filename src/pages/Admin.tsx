import { useMemo, useState } from "react";
import { LogOut, Plus, ShieldCheck, Trash2, User as UserIcon, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { fmtDate } from "@/context/FarmContext";
import type { LucideIcon } from "lucide-react";

export default function AdminPage() {
  const { users, user, logout, createGestor, removeGestor } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const gestores = useMemo(
    () => users.filter((u) => u.role === "gestor" &&
      (q ? u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()) : true)),
    [users, q],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-foreground">Painel Administrador</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">AgroGestor</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggle} aria-label="Alternar tema">
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </Button>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 sm:flex">
            <Avatar className="h-7 w-7"><AvatarFallback className="bg-accent text-xs text-accent-foreground">AD</AvatarFallback></Avatar>
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-foreground">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full" onClick={logout}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        {/* Hero */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-earth p-6 text-white shadow-elegant md:p-8">
          <Badge className="mb-3 bg-white/15 text-white hover:bg-white/15">
            <ShieldCheck className="mr-1 h-3 w-3" /> Acesso administrativo
          </Badge>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Gestão de acessos</h1>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            Cadastre e administre os gestores que utilizarão o AgroGestor para controlar suas operações rurais.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total de gestores" value={String(gestores.length)} icon={Users} />
          <Stat label="Administradores" value={String(users.filter(u => u.role === "admin").length)} icon={ShieldCheck} />
          <Stat label="Total de usuários" value={String(users.length)} icon={UserIcon} />
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Gestores cadastrados</h2>
              <p className="text-xs text-muted-foreground">Crie acessos para os produtores rurais</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="h-9 w-56 rounded-full bg-secondary/60" />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full"><Plus className="mr-1.5 h-4 w-4" /> Novo gestor</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>Cadastrar novo gestor</DialogTitle></DialogHeader>
                  <NewGestorForm
                    onSave={(data) => {
                      const r = createGestor(data);
                      if (!r.ok) { toast.error(r.error ?? "Erro ao cadastrar"); return; }
                      toast.success("Gestor cadastrado com sucesso");
                      setOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Gestor</th>
                  <th className="px-4 py-2.5 text-left">E-mail</th>
                  <th className="px-4 py-2.5 text-left">Fazenda</th>
                  <th className="px-4 py-2.5 text-left">Criado em</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {gestores.map((g) => (
                  <tr key={g.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {g.name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{g.name}</p>
                          <Badge variant="secondary" className="rounded-full text-[10px] font-normal">Gestor</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{g.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{g.farm ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(g.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { removeGestor(g.id); toast("Gestor removido"); }}>
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {gestores.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Nenhum gestor cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function NewGestorForm({ onSave }: { onSave: (d: { name: string; email: string; password: string; farm?: string }) => void }) {
  const [f, setF] = useState({ name: "", email: "", password: "", farm: "" });
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div><Label>Nome completo</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required placeholder="Ex: Maria Silva" /></div>
      <div><Label>E-mail</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required placeholder="maria@fazenda.com" /></div>
      <div><Label>Senha provisória</Label><Input value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required placeholder="Mínimo 6 caracteres" /></div>
      <div><Label>Fazenda / propriedade</Label><Input value={f.farm} onChange={(e) => setF({ ...f, farm: e.target.value })} placeholder="Ex: Fazenda Boa Vista" /></div>
      <DialogFooter><Button type="submit" className="w-full">Cadastrar gestor</Button></DialogFooter>
    </form>
  );
}
