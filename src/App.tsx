import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./layouts/AppLayout";
import FinanceiroPage from "./pages/modules/Financeiro";
import PropriedadesPage from "./pages/modules/Propriedades";
import PlantacoesPage from "./pages/modules/Plantacoes";
import RebanhoPage from "./pages/modules/Rebanho";
import RelatoriosPage from "./pages/modules/Relatorios";
import CalendarioPage from "./pages/modules/Calendario";
import { FarmProvider } from "./context/FarmContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./pages/Login";
import AdminPage from "./pages/Admin";
import { RedirectIfAuthed, RequireAuth } from "./components/agro/RouteGuards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <FarmProvider>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route element={<RedirectIfAuthed />}>
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Admin only */}
                <Route element={<RequireAuth allow={["admin"]} />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>

                {/* Gestor only */}
                <Route element={<RequireAuth allow={["gestor"]} />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/financeiro" element={<FinanceiroPage />} />
                    <Route path="/propriedades" element={<PropriedadesPage />} />
                    <Route path="/plantacoes" element={<PlantacoesPage />} />
                    <Route path="/rebanho" element={<RebanhoPage />} />
                    <Route path="/calendario" element={<CalendarioPage />} />
                    <Route path="/relatorios" element={<RelatoriosPage />} />
                  </Route>
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FarmProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
