
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  TrendingDown, 
  MessageCircle, 
  RefreshCcw, 
  Filter, 
  Calendar, 
  Settings,
  FileText,
  Zap, 
  CircleCheck,
  CirclePlus,
  Search,
  Share,
  FileDown,
  Hexagon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for the chart
const chartData = [
  { data: '01/05', cancelamentos: 3, previsao: 3 },
  { data: '02/05', cancelamentos: 2, previsao: 2 },
  { data: '03/05', cancelamentos: 5, previsao: 4 },
  { data: '04/05', cancelamentos: 4, previsao: 5 },
  { data: '05/05', cancelamentos: 3, previsao: 4 },
  { data: '06/05', cancelamentos: 2, previsao: 3 },
  { data: '07/05', cancelamentos: 1, previsao: 2 },
  { data: '08/05', cancelamentos: 3, previsao: 3 },
  { data: '09/05', cancelamentos: 4, previsao: 3 },
  { data: '10/05', cancelamentos: 6, previsao: 5 },
  { data: '11/05', cancelamentos: 5, previsao: 6 },
  { data: '12/05', cancelamentos: 4, previsao: 5 },
  { data: '13/05', cancelamentos: 3, previsao: 4 },
  { data: '14/05', cancelamentos: 5, previsao: 5 },
  // Future prediction
  { data: '15/05', cancelamentos: null, previsao: 4 },
  { data: '16/05', cancelamentos: null, previsao: 3 },
  { data: '17/05', cancelamentos: null, previsao: 5 },
  { data: '18/05', cancelamentos: null, previsao: 4 },
  { data: '19/05', cancelamentos: null, previsao: 3 },
  { data: '20/05', cancelamentos: null, previsao: 2 },
];

// Sample data for area chart
const areaChartData = [
  { month: 'Jan', cancelados: 20, previsao: 25, novos: 45 },
  { month: 'Fev', cancelados: 15, previsao: 20, novos: 40 },
  { month: 'Mar', cancelados: 25, previsao: 30, novos: 38 },
  { month: 'Abr', cancelados: 22, previsao: 20, novos: 50 },
  { month: 'Mai', cancelados: 30, previsao: 35, novos: 45 },
  { month: 'Jun', cancelados: 28, previsao: 25, novos: 40 },
];

// Sample data for multi-line chart
const multiLineChartData = [
  { month: 'Jan', musculacao: 70, natacao: 45, funcional: 30, pilates: 20 },
  { month: 'Fev', musculacao: 65, natacao: 50, funcional: 35, pilates: 25 },
  { month: 'Mar', musculacao: 75, natacao: 40, funcional: 40, pilates: 30 },
  { month: 'Abr', musculacao: 80, natacao: 55, funcional: 35, pilates: 25 },
  { month: 'Mai', musculacao: 85, natacao: 60, funcional: 45, pilates: 30 },
  { month: 'Jun', musculacao: 90, natacao: 65, funcional: 50, pilates: 35 },
];

// Gender distribution data
const genderData = [
  { name: 'Masculino', value: 65, color: '#9b87f5' },
  { name: 'Feminino', value: 35, color: '#e57ad3' },
];

// Age distribution data
const ageData = [
  { name: '18-25', value: 30, color: '#9b87f5' },
  { name: '26-35', value: 45, color: '#b19ef7' },
  { name: '36-45', value: 15, color: '#c7b5f9' },
  { name: '46+', value: 10, color: '#dccbfb' },
];

// Sample data for students at risk
const alunosEmRisco = [
  { 
    id: 1, 
    nome: 'Ana Silva', 
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    risco: 85,
    padrao: 'frequencia', 
    razao: 'Faltou 5 vezes nas últimas 2 semanas' 
  },
  { 
    id: 2, 
    nome: 'João Pereira', 
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    risco: 72,
    padrao: 'pagamento', 
    razao: 'Atrasou pagamento por 7 dias' 
  },
  { 
    id: 3, 
    nome: 'Maria Oliveira', 
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    risco: 68,
    padrao: 'feedback', 
    razao: 'Avaliou treino recente com 2/5 estrelas' 
  },
  { 
    id: 4, 
    nome: 'Carlos Santos', 
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    risco: 65,
    padrao: 'frequencia', 
    razao: 'Frequência irregular nos últimos 20 dias' 
  },
  { 
    id: 5, 
    nome: 'Lúcia Ferreira', 
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    risco: 60,
    padrao: 'feedback', 
    razao: 'Reclamou do horário das aulas 2 vezes' 
  }
];

// Risk distribution data
const riskDistributionData = [
  { name: 'Baixo', value: 65, color: '#34C759' },
  { name: 'Médio', value: 20, color: '#FF9500' },
  { name: 'Alto', value: 15, color: '#FF3B30' },
];

// Pattern distribution
const patternData = [
  { name: 'Frequência', value: 45 },
  { name: 'Pagamento', value: 25 },
  { name: 'Feedback', value: 20 },
  { name: 'Motivação', value: 10 },
];

// Icon renderer based on pattern
const renderPatternIcon = (padrao: string) => {
  switch (padrao) {
    case 'frequencia':
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    case 'pagamento':
      return <span className="text-amber-500">💰</span>;
    case 'feedback':
      return <span className="text-blue-500">😞</span>;
    default:
      return <span className="text-gray-500">⚠️</span>;
  }
};

const PrevisaoEvasao = () => {
  const { toast } = useToast();
  const [periodo, setPeriodo] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState('area');
  const [modelSensitivity, setModelSensitivity] = useState(85);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('30d');

  // Function to handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: "Atualizando previsões",
      description: "Recalculando análises de risco...",
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Previsões atualizadas",
        description: "Dados de risco atualizados com sucesso",
      });
    }, 1500);
  };

  // Function to handle period change
  const handleChangePeriod = (newPeriod: string) => {
    setPeriodo(newPeriod);
    toast({
      description: `Período alterado para: ${newPeriod}`,
    });
  };

  // Function to send message to student
  const handleSendMessage = (id: number, nome: string) => {
    toast({
      title: "Mensagem enviada",
      description: `Uma mensagem personalizada foi enviada para ${nome}.`,
    });
  };

  // Function to offer discount
  const handleOfferDiscount = (id: number, nome: string) => {
    toast({
      title: "Desconto oferecido",
      description: `Um desconto promocional foi oferecido para ${nome}.`,
    });
  };

  // Toggle student details
  const toggleStudentDetails = (id: number) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  // Function to handle exporting report
  const handleExportReport = (format: string) => {
    setShowExportOptions(false);
    toast({
      title: "Exportando relatório",
      description: `Preparando relatório em formato ${format.toUpperCase()}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Relatório pronto",
        description: `Seu relatório foi exportado como ${format.toUpperCase()}`,
      });
    }, 2000);
  };

  // Function to adjust model sensitivity
  const handleAdjustSensitivity = (value: number) => {
    setModelSensitivity(value);
    toast({
      title: "Sensibilidade ajustada",
      description: `A sensibilidade do modelo foi alterada para ${value}%`,
    });
  };

  // Function to handle zoom level change
  const handleZoomChange = (level: string) => {
    setZoomLevel(level);
    toast({
      description: `Visualização ajustada para: ${level}`,
    });
  };

  // Function to handle detailed factors
  const handleDetailFactors = () => {
    toast({
      title: "Fatores de Evasão",
      description: "Analisando os principais fatores de evasão...",
    });
    
    setTimeout(() => {
      toast({
        title: "Análise completa",
        description: "Os principais fatores são: frequência (45%), pagamento (25%), feedback (20%)",
      });
    }, 1500);
  };

  // Function to recalculate model
  const handleRecalculateModel = () => {
    toast({
      title: "Recalculando modelo",
      description: "Iniciando novo treinamento com dados atualizados...",
    });
    
    setTimeout(() => {
      toast({
        title: "Modelo recalculado",
        description: "Nova precisão: 89% (↑2%)",
      });
    }, 3000);
  };

  return (
    <MainLayout 
      pageTitle="Previsão de Evasão (IA)" 
      pageSubtitle="Análise preditiva para retenção de alunos"
      headerImage="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-8 animate-fade-in">
        {/* Top metrics section with Apple-like design */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glassmorphism p-6 backdrop-blur-xl bg-black/40 border border-white/10 text-white rounded-xl">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <Hexagon className="text-academy-purple animate-pulse" />
                <h3 className="text-sm font-medium text-gray-300">ALUNOS EM RISCO HOJE</h3>
              </div>
              <div className="text-3xl font-bold">18/120 (15%)</div>
              <div className="text-green-400 flex items-center text-sm">
                ↓2% vs ontem
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 backdrop-blur-xl bg-black/40 border border-white/10 text-white rounded-xl">
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium text-gray-300">PREDIÇÃO MENSAL</h3>
              <div className="text-3xl font-bold">R$ 8.200</div>
              <div className="text-amber-400 text-sm">
                em receita em risco (7 cancelamentos previstos)
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 backdrop-blur-xl bg-black/40 border border-white/10 text-white rounded-xl">
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium text-gray-300">EFETIVIDADE DA IA</h3>
              <div className="text-3xl font-bold">87%</div>
              <div className="text-blue-400 text-sm">
                de precisão (baseado em dados históricos)
              </div>
              <div className="flex items-center mt-1">
                <div className="flex-1 h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-2 rounded-full bg-academy-purple"
                    style={{width: "87%"}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Control bar - Apple inspired */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant={zoomLevel === "7d" ? "default" : "outline"} 
              onClick={() => handleZoomChange("7d")}
              size="sm"
              className="transition-all"
            >
              7 dias
            </Button>
            <Button 
              variant={zoomLevel === "30d" ? "default" : "outline"} 
              onClick={() => handleZoomChange("30d")}
              size="sm"
              className="transition-all"
            >
              30 dias
            </Button>
            <Button 
              variant={zoomLevel === "90d" ? "default" : "outline"} 
              onClick={() => handleZoomChange("90d")}
              size="sm"
              className="transition-all"
            >
              90 dias
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="transition-all">
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" className="transition-all" onClick={() => toast({ description: "Abrindo calendário..." })}>
              <Calendar className="h-4 w-4 mr-2" />
              Personalizar
            </Button>
            <Button variant="outline" size="sm" className="transition-all" onClick={() => toast({ description: "Abrindo filtros..." })}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Main content - Charts in tabs - Apple style */}
        <Tabs defaultValue="mainChart" className="w-full">
          <TabsList className="mb-4 flex justify-center">
            <TabsTrigger value="mainChart">Gráfico Principal</TabsTrigger>
            <TabsTrigger value="demographics">Demografia</TabsTrigger>
            <TabsTrigger value="patterns">Padrões</TabsTrigger>
            <TabsTrigger value="modality">Modalidades</TabsTrigger>
          </TabsList>
          
          {/* Main Chart Tab */}
          <TabsContent value="mainChart" className="animate-fade-in">
            <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
              <h3 className="text-lg font-medium mb-4">Gráfico Preditivo de Evasão</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorCancelados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrevisao" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9500" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF9500" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNovos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34C759" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1F2C', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="cancelados" stroke="#FF3B30" fillOpacity={1} fill="url(#colorCancelados)" name="Cancelamentos" />
                    <Area type="monotone" dataKey="previsao" stroke="#FF9500" fillOpacity={1} fill="url(#colorPrevisao)" name="Previsão IA" />
                    <Area type="monotone" dataKey="novos" stroke="#34C759" fillOpacity={1} fill="url(#colorNovos)" name="Novos alunos" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                <strong>Padrão detectado:</strong> Alunos com +3 faltas em 15 dias têm 78% de chance de cancelar
              </p>
            </div>
          </TabsContent>
          
          {/* Demographics Tab */}
          <TabsContent value="demographics" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender distribution pie chart */}
              <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
                <h3 className="text-lg font-medium mb-4">Distribuição por Gênero</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  Mulheres têm 15% mais chances de evasão no inverno
                </p>
              </div>
              
              {/* Age distribution pie chart */}
              <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
                <h3 className="text-lg font-medium mb-4">Distribuição por Idade</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  Grupo 26-35 anos apresenta maior retenção quando oferecido plano familiar
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Patterns Tab */}
          <TabsContent value="patterns" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk distribution */}
              <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
                <h3 className="text-lg font-medium mb-4">Distribuição de Risco</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  15% dos alunos requerem atenção imediata
                </p>
              </div>
              
              {/* Pattern distribution */}
              <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
                <h3 className="text-lg font-medium mb-4">Causas de Evasão</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={patternData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" stroke="#ccc" />
                      <YAxis dataKey="name" type="category" stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1F2C', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Bar dataKey="value" fill="#9b87f5" radius={[0, 5, 5, 0]}>
                        {patternData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 ? '#9b87f5' : '#8B5CF6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  Frequência irregular é o principal indicador de possível evasão
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Modality Tab */}
          <TabsContent value="modality" className="animate-fade-in">
            <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
              <h3 className="text-lg font-medium mb-4">Evasão por Modalidade</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={multiLineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <XAxis dataKey="month" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1F2C', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="musculacao" stroke="#9b87f5" strokeWidth={2} dot={{ r: 4 }} name="Musculação" />
                    <Line type="monotone" dataKey="natacao" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 4 }} name="Natação" />
                    <Line type="monotone" dataKey="funcional" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} name="Funcional" />
                    <Line type="monotone" dataKey="pilates" stroke="#34C759" strokeWidth={2} dot={{ r: 4 }} name="Pilates" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                Natação apresenta maior crescimento nos últimos 3 meses (+35%)
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actionable Insights Panel - Apple Wallet style */}
        <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white">
          <h3 className="text-lg font-medium mb-4">Insights Acionáveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <span className="text-lg">🔥</span>
                </div>
                <h4 className="text-lg font-medium">Alta Evasão</h4>
              </div>
              <p className="text-sm text-gray-300">
                <strong>Mulheres 30-35 anos</strong><br />
                72% mais chances no inverno<br />
                → Sugere campanha "Desafio de Inverno"
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-3 w-full border-white/20 hover:bg-white/10"
                onClick={() => toast({description: "Criando campanha de desafio de inverno..."})}
              >
                Criar Campanha
              </Button>
            </div>
            
            <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-600/20 flex items-center justify-center mr-3">
                  <span className="text-lg">📉</span>
                </div>
                <h4 className="text-lg font-medium">Turma das 19h</h4>
              </div>
              <p className="text-sm text-gray-300">
                <strong>Adesão caindo 15% semanal</strong><br />
                Principal motivo: lotação<br />
                → Oferecer pacote "Amigo Traz Amigo"
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-3 w-full border-white/20 hover:bg-white/10"
                onClick={() => toast({description: "Visualizando detalhes da turma das 19h..."})}
              >
                Ver Detalhes
              </Button>
            </div>
            
            <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-orange-600/20 flex items-center justify-center mr-3">
                  <span className="text-lg">⚠️</span>
                </div>
                <h4 className="text-lg font-medium">Alerta Financeiro</h4>
              </div>
              <p className="text-sm text-gray-300">
                <strong>Próximos 7 dias:</strong><br />
                R$ 2.800 em risco<br />
                (4 alunos com &gt;80% chance de sair)
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-3 w-full border-white/20 hover:bg-white/10"
                onClick={() => toast({description: "Enviando mensagem aos 4 alunos em risco..."})}
              >
                Contatar Alunos
              </Button>
            </div>
          </div>
        </div>

        {/* Students at risk section - Apple Health style */}
        <div>
          <h3 className="text-lg font-medium mb-4">Lista de Alunos Prioritários</h3>
          <div className="space-y-3">
            {alunosEmRisco.map((aluno) => (
              <div 
                key={aluno.id} 
                className="neo-blur overflow-hidden transition-all duration-300 backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl text-white"
                onClick={() => toggleStudentDetails(aluno.id)}
              >
                <div className="p-4 cursor-pointer hover:bg-white/5">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={aluno.foto} 
                      alt={aluno.nome} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{aluno.nome}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${aluno.risco}%`,
                              background: `linear-gradient(90deg, #4ade80 0%, #facc15 50%, #f87171 100%)`
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{aluno.risco}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      {renderPatternIcon(aluno.padrao)}
                      <span className="text-xs">
                        {aluno.padrao === 'frequencia' ? 'Frequência baixa' : 
                         aluno.padrao === 'pagamento' ? 'Pagamento' : 'Feedback negativo'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedStudent === aluno.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                      <p className="text-sm mb-4 text-gray-300">{aluno.razao}</p>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendMessage(aluno.id, aluno.nome);
                          }}
                          size="sm"
                          className="transition-all"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Enviar mensagem
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOfferDiscount(aluno.id, aluno.nome);
                          }}
                          size="sm"
                          className="transition-all"
                        >
                          Oferecer desconto
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Settings Dialog */}
        {showAISettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Ajustes da IA</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAISettings(false)} className="text-gray-400">
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Sensibilidade do modelo: {modelSensitivity}%</label>
                  <input 
                    type="range" 
                    min="50" 
                    max="99" 
                    value={modelSensitivity} 
                    onChange={(e) => setModelSensitivity(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Menos alertas</span>
                    <span>Mais alertas</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm text-gray-300">Fatores considerados:</label>
                  <div className="flex items-center">
                    <input type="checkbox" id="factor-freq" className="mr-2" defaultChecked />
                    <label htmlFor="factor-freq" className="text-sm">Frequência</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="factor-pay" className="mr-2" defaultChecked />
                    <label htmlFor="factor-pay" className="text-sm">Pagamentos</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="factor-feed" className="mr-2" defaultChecked />
                    <label htmlFor="factor-feed" className="text-sm">Feedback</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="factor-class" className="mr-2" defaultChecked />
                    <label htmlFor="factor-class" className="text-sm">Frequência das aulas</label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAISettings(false)}>Cancelar</Button>
                  <Button onClick={() => {
                    handleAdjustSensitivity(modelSensitivity);
                    setShowAISettings(false);
                  }}>Salvar</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Export Options Dialog */}
        {showExportOptions && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="neo-blur p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Exportar Relatório</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowExportOptions(false)} className="text-gray-400">
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExportReport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF (Relatório completo)
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExportReport('csv')}>
                  <FileText className="mr-2 h-4 w-4" />
                  CSV (Dados para análise)
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExportReport('xlsx')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Excel (Planilha detalhada)
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExportReport('ppt')}>
                  <FileText className="mr-2 h-4 w-4" />
                  PowerPoint (Apresentação)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom control panel - iPadOS style*/}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 items-end">
          <div className={`flex space-x-3 transition-all duration-300 ${showExportOptions || showAISettings ? 'opacity-0' : 'opacity-100'}`}>
            <Button 
              className="h-12 w-12 rounded-full shadow-lg hover:bg-white/20 transition-all"
              onClick={handleDetailFactors}
              variant="outline"
            >
              <span className="sr-only">Detalhar Fatores</span>
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg hover:bg-white/20 transition-all"
              onClick={() => setShowExportOptions(true)}
            >
              <span className="sr-only">Exportar Relatório</span>
              <FileDown className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg hover:bg-white/20 transition-all"
              onClick={handleRecalculateModel}
            >
              <span className="sr-only">Recalcular Modelo</span>
              <RefreshCcw className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg hover:bg-white/20 transition-all"
              onClick={() => setShowAISettings(true)}
            >
              <span className="sr-only">Ajustar Sensibilidade</span>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 border-t border-white/10">
          <p className="text-gray-400 text-sm text-center">
            Modelo treinado em 12.500 registros | Atualizado: {new Date().toLocaleDateString()} | Dados protegidos por criptografia AES-256
          </p>
        </footer>
      </div>
    </MainLayout>
  );
};

export default PrevisaoEvasao;
