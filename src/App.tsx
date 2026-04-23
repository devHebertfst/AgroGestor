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
import EstoquePage from "./pages/modules/Estoque";
import TarefasPage from "./pages/modules/Tarefas";
import { FarmProvider } from "./context/FarmContext";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FarmProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/financeiro" element={<FinanceiroPage />} />
                <Route path="/estoque" element={<EstoquePage />} />
                <Route path="/tarefas" element={<TarefasPage />} />
                <Route path="/propriedades" element={<PropriedadesPage />} />
                <Route path="/plantacoes" element={<PlantacoesPage />} />
                <Route path="/rebanho" element={<RebanhoPage />} />
                <Route path="/calendario" element={<CalendarioPage />} />
                <Route path="/relatorios" element={<RelatoriosPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FarmProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
