
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrevisaoEvasao from "./pages/PrevisaoEvasao";
import AulasTematicasRetro from "./pages/AulasTematicasRetro";
import NotFound from "./pages/NotFound";
import DesignIntuitivo from "./pages/DesignIntuitivo";
import PlanilhaFaturamento from "./pages/PlanilhaFaturamento";
import Nutricao from "./pages/Nutricao";
import Pagamentos from "./pages/Pagamentos";
import Relatorios from "./pages/Relatorios";
import AlertasAutomaticos from "./pages/AlertasAutomaticos";
import PainelGestao from "./pages/PainelGestao";
import Chatbot from "./pages/Chatbot";
import GestaoDatabase from "./pages/GestaoDatabase";
import AnalisePreditiva from "./pages/AnalisePreditiva";
import Configuracoes from "./pages/Configuracoes";
import Notificacoes from "./pages/Notificacoes";
import ControleFrequencia from "./pages/ControleFrequencia";
import FeedbackAlunos from "./pages/FeedbackAlunos";
import CronogramaTreinos from "./pages/CronogramaTreinos";
import AulasSalvas from "./pages/AulasSalvas";
import IntegracaoAPIs from "./pages/IntegracaoAPIs";
import Perfil from "./pages/Perfil";
import ProgramaFidelidade from "./pages/ProgramaFidelidade";
import Idiomas from "./pages/Idiomas";
import Atividades from "./pages/Atividades";
import Programas from "./pages/Programas";

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-medium">Carregando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/previsao-evasao" 
        element={
          <ProtectedRoute>
            <PrevisaoEvasao />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/aulas-tematicas" 
        element={
          <ProtectedRoute>
            <AulasTematicasRetro />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/design-intuitivo" 
        element={
          <ProtectedRoute>
            <DesignIntuitivo />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/planilha-faturamento" 
        element={
          <ProtectedRoute>
            <PlanilhaFaturamento />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pagamentos" 
        element={
          <ProtectedRoute>
            <Pagamentos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/nutricao" 
        element={
          <ProtectedRoute>
            <Nutricao />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/relatorios" 
        element={
          <ProtectedRoute>
            <Relatorios />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/alertas" 
        element={
          <ProtectedRoute>
            <AlertasAutomaticos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/painel-gestao" 
        element={
          <ProtectedRoute>
            <PainelGestao />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chatbot" 
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestao-dados" 
        element={
          <ProtectedRoute>
            <GestaoDatabase />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analise-preditiva" 
        element={
          <ProtectedRoute>
            <AnalisePreditiva />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/configuracoes" 
        element={
          <ProtectedRoute>
            <Configuracoes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notificacoes" 
        element={
          <ProtectedRoute>
            <Notificacoes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/controle-frequencia" 
        element={
          <ProtectedRoute>
            <ControleFrequencia />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/feedback" 
        element={
          <ProtectedRoute>
            <FeedbackAlunos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cronograma-treinos" 
        element={
          <ProtectedRoute>
            <CronogramaTreinos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/aulas-salvas" 
        element={
          <ProtectedRoute>
            <AulasSalvas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/integracao-apis" 
        element={
          <ProtectedRoute>
            <IntegracaoAPIs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/idiomas" 
        element={
          <ProtectedRoute>
            <Idiomas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/programa-fidelidade" 
        element={
          <ProtectedRoute>
            <ProgramaFidelidade />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/atividades" 
        element={
          <ProtectedRoute>
            <Atividades />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/programas" 
        element={
          <ProtectedRoute>
            <Programas />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
