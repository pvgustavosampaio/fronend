
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Users,
  Bell,
  Calendar,
  RefreshCcw,
  TrendingDown,
  MessageSquare,
  FileText,
  Settings,
} from 'lucide-react';
import PieChart from '@/components/charts/PieChart';

// Sample data for attendance chart
const frequencyData = [
  { name: 'Segunda', frequencia: 78 },
  { name: 'Terça', frequencia: 82 },
  { name: 'Quarta', frequencia: 90 },
  { name: 'Quinta', frequencia: 85 },
  { name: 'Sexta', frequencia: 80 },
  { name: 'Sábado', frequencia: 70 },
  { name: 'Domingo', frequencia: 40 },
];

// Sample data for students at risk
const alunosRiscoData = [
  { 
    id: 1, 
    nome: 'Ana Silva', 
    foto: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop',
    risco: 'Faltou 3x na semana',
  },
  { 
    id: 2, 
    nome: 'Carlos Oliveira', 
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    risco: 'Feedback negativo',
  },
  { 
    id: 3, 
    nome: 'Mariana Santos', 
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    risco: 'Pagamento atrasado',
  }
];

// Sample data for evasion trend
const evasionTrendData = [
  { month: 'Jan', cancelamentos: 5, previsao: 6 },
  { month: 'Fev', cancelamentos: 7, previsao: 6 },
  { month: 'Mar', cancelamentos: 8, previsao: 7 },
  { month: 'Abr', cancelamentos: 6, previsao: 7 },
  { month: 'Mai', cancelamentos: 9, previsao: 8 },
  { month: 'Jun', cancelamentos: null, previsao: 7 },
  { month: 'Jul', cancelamentos: null, previsao: 6 },
];

// Sample data for gender distribution
const genderData = [
  { name: 'Mulheres', value: 65, color: '#9b87f5' },
  { name: 'Homens', value: 35, color: '#6E59A5' },
];

// Sample data for age distribution
const womenAgeData = [
  { name: '18-25', value: 30, color: '#9b87f5' },
  { name: '26-35', value: 40, color: '#8B5CF6' },
  { name: '36-45', value: 20, color: '#7E69AB' },
  { name: '46+', value: 10, color: '#D6BCFA' },
];

// Sample data for line charts
const lineChartsData = [
  {
    title: "Frequência vs Resultados",
    data: [
      { name: 'Jan', frequencia: 75, resultados: 65 },
      { name: 'Fev', frequencia: 78, resultados: 72 },
      { name: 'Mar', frequencia: 82, resultados: 80 },
      { name: 'Abr', frequencia: 85, resultados: 85 },
      { name: 'Mai', frequencia: 80, resultados: 82 },
      { name: 'Jun', frequencia: 88, resultados: 90 },
    ],
    lines: [
      { dataKey: 'frequencia', color: '#f97316' },
      { dataKey: 'resultados', color: '#22c55e' }
    ]
  },
  {
    title: "Indicadores de Satisfação",
    data: [
      { name: 'Jan', satisfacao: 80, recomendacao: 70 },
      { name: 'Fev', satisfacao: 82, recomendacao: 75 },
      { name: 'Mar', satisfacao: 85, recomendacao: 80 },
      { name: 'Abr', satisfacao: 90, recomendacao: 85 },
      { name: 'Mai', satisfacao: 88, recomendacao: 88 },
      { name: 'Jun', satisfacao: 92, recomendacao: 90 },
    ],
    lines: [
      { dataKey: 'satisfacao', color: '#9b87f5' },
      { dataKey: 'recomendacao', color: '#1EAEDB' }
    ]
  },
  {
    title: "Inscrições vs Evasão",
    data: [
      { name: 'Jan', inscricoes: 12, evasao: 5 },
      { name: 'Fev', inscricoes: 15, evasao: 7 },
      { name: 'Mar', inscricoes: 18, evasao: 8 },
      { name: 'Abr', inscricoes: 14, evasao: 6 },
      { name: 'Mai', inscricoes: 20, evasao: 9 },
      { name: 'Jun', inscricoes: 22, evasao: 6 },
    ],
    lines: [
      { dataKey: 'inscricoes', color: '#22c55e' },
      { dataKey: 'evasao', color: '#ef4444' }
    ]
  },
  {
    title: "Receita vs Despesas",
    data: [
      { name: 'Jan', receita: 25000, despesas: 18000 },
      { name: 'Fev', receita: 27500, despesas: 19000 },
      { name: 'Mar', receita: 28000, despesas: 19500 },
      { name: 'Abr', receita: 29000, despesas: 20000 },
      { name: 'Mai', receita: 30500, despesas: 21000 },
      { name: 'Jun', receita: 32000, despesas: 21500 },
    ],
    lines: [
      { dataKey: 'receita', color: '#3b82f6' },
      { dataKey: 'despesas', color: '#f97316' }
    ]
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      description: "Atualizando dashboard..."
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard atualizado",
        description: "Dados atualizados com sucesso"
      });
    }, 1500);
  };

  const handleAction = (action: string, target: string) => {
    switch (action) {
      case 'notificar':
        toast({
          title: "Notificação enviada",
          description: `Uma mensagem foi enviada para ${target}`
        });
        break;
      case 'desconto':
        toast({
          title: "Desconto oferecido",
          description: `Um desconto foi oferecido para ${target}`
        });
        break;
      default:
        toast({
          description: `Ação ${action} para ${target}`
        });
    }
  };

  const nextChart = () => {
    setCurrentChartIndex((prev) => (prev + 1) % lineChartsData.length);
  };

  const prevChart = () => {
    setCurrentChartIndex((prev) => (prev - 1 + lineChartsData.length) % lineChartsData.length);
  };

  return (
    <MainLayout 
      pageTitle="Dashboard" 
      pageSubtitle="Visão geral da sua academia"
      headerImage="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {/* Overview metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <h3 className="text-sm text-muted-foreground">Alunos Ativos</h3>
            <div className="text-3xl font-bold mt-2">87/120</div>
            <div className="text-green-500 text-sm">+5% vs semana passada</div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm text-muted-foreground">Risco de Evasão</h3>
            <div className="text-3xl font-bold mt-2">12%</div>
            <div className="flex mt-2">
              <div className="h-2 bg-amber-500 rounded-full" style={{ width: '12%' }}></div>
              <div className="h-2 bg-muted rounded-full" style={{ width: '88%' }}></div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm text-muted-foreground">Pagamentos Pendentes</h3>
            <div className="text-3xl font-bold mt-2">R$ 2.450</div>
            <Button variant="link" className="p-0 h-auto mt-2" onClick={() => handleAction('cobrar', 'pagamentos')}>
              Cobrar
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm text-muted-foreground">Frequência Hoje</h3>
            <div className="text-3xl font-bold mt-2">73%</div>
            <div className="text-amber-500 text-sm">-2% vs média</div>
          </Card>
        </div>

        {/* Pie charts - Gender and Age Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChart 
            title="Distribuição por Gênero" 
            data={genderData}
            height={300}
            colors={['#9b87f5', '#6E59A5']} 
          />
          
          <PieChart 
            title="Distribuição de Idade (Mulheres)" 
            data={womenAgeData}
            height={300}
            colors={['#9b87f5', '#8B5CF6', '#7E69AB', '#D6BCFA']} 
          />
        </div>

        {/* Sliding Line Charts */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{lineChartsData[currentChartIndex].title}</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={prevChart}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={nextChart}>
                Próximo
              </Button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartsData[currentChartIndex].data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {lineChartsData[currentChartIndex].lines.map((line, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    name={line.dataKey.charAt(0).toUpperCase() + line.dataKey.slice(1)}
                    stroke={line.color}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Frequency heat map */}
        <Card className="p-5">
          <h3 className="text-lg font-medium mb-4">Mapa de Calor da Frequência</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar 
                  dataKey="frequencia" 
                  name="Frequência" 
                  fill="#9b87f5"
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-muted-foreground mt-4">
            Toque em um dia para ver detalhes dos alunos ausentes
          </div>
        </Card>

        {/* Two columns layout for Students at Risk and Evasion Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students at risk */}
          <Card className="p-5">
            <h3 className="text-lg font-medium mb-4">Lista de Alunos em Risco</h3>
            <div className="space-y-4">
              {alunosRiscoData.map((aluno) => (
                <div key={aluno.id} className="flex items-center p-3 rounded-lg bg-muted/30">
                  <img 
                    src={aluno.foto}
                    alt={aluno.nome}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium">{aluno.nome}</div>
                    <div className="text-sm text-muted-foreground">{aluno.risco}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction('notificar', aluno.nome)}
                    >
                      Notificar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleAction('desconto', aluno.nome)}
                    >
                      Oferecer Desconto
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="link" className="w-full" onClick={() => handleAction('ver', 'todos os alunos em risco')}>
                Ver todos →
              </Button>
            </div>
          </Card>

          {/* Evasion trend */}
          <Card className="p-5">
            <h3 className="text-lg font-medium mb-4">Gráfico de Tendência de Evasão</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evasionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cancelamentos"
                    name="Cancelamentos reais"
                    stroke="#0369a1"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previsao"
                    name="Previsão IA"
                    stroke="#f97316"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom action bar */}
        <div className="fixed bottom-6 right-6 flex space-x-3">
          <Button 
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={handleRefresh}
          >
            <RefreshCcw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Atualizar</span>
          </Button>
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => handleAction('ver', 'alertas')}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Alertas</span>
          </Button>
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => handleAction('ver', 'alunos')}
          >
            <Users className="h-5 w-5" />
            <span className="sr-only">Alunos</span>
          </Button>
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => handleAction('ver', 'configurações')}
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
