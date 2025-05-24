
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  RefreshCcw,
  Bell,
  TrendingDown,
  Users,
  FileText,
  Settings,
  Calendar,
  MessageSquare,
  ChartBar
} from 'lucide-react';

// Sample data for metrics
const metricsData = [
  {
    title: "Alunos Ativos",
    value: "142",
    change: "+12%",
    trend: "up",
    sparkline: [40, 35, 50, 45, 60, 55, 65]
  },
  {
    title: "Risco de Evasão",
    value: "18%",
    change: "+2%",
    trend: "down",
    progress: 18
  },
  {
    title: "Receita Mensal",
    value: "R$ 28.950",
    target: "R$ 30.000",
    progress: 96.5
  },
  {
    title: "Frequência Média",
    value: "73%",
    change: "-3%",
    trend: "down",
    progress: 73
  }
];

// Sample data for attendance heatmap
const frequencyData = [
  { name: 'Segunda', '06h': 40, '08h': 75, '10h': 60, '12h': 30, '14h': 45, '16h': 80, '18h': 95, '20h': 85 },
  { name: 'Terça', '06h': 50, '08h': 60, '10h': 45, '12h': 25, '14h': 50, '16h': 70, '18h': 90, '20h': 80 },
  { name: 'Quarta', '06h': 55, '08h': 80, '10h': 65, '12h': 35, '14h': 55, '16h': 75, '18h': 95, '20h': 90 },
  { name: 'Quinta', '06h': 45, '08h': 65, '10h': 55, '12h': 30, '14h': 50, '16h': 85, '18h': 90, '20h': 80 },
  { name: 'Sexta', '06h': 35, '08h': 70, '10h': 60, '12h': 25, '14h': 40, '16h': 70, '18h': 85, '20h': 75 },
  { name: 'Sábado', '06h': 65, '08h': 85, '10h': 70, '12h': 10, '14h': 20, '16h': 40, '18h': 50, '20h': 30 },
  { name: 'Domingo', '06h': 10, '08h': 15, '10h': 20, '12h': 5, '14h': 10, '16h': 20, '18h': 30, '20h': 15 },
];

// Sample data for evasion trend
const evasionData = [
  { name: 'Jan', atual: 8, previsao: 8 },
  { name: 'Fev', atual: 12, previsao: 11 },
  { name: 'Mar', atual: 10, previsao: 9 },
  { name: 'Abr', atual: 15, previsao: 14 },
  { name: 'Mai', atual: 12, previsao: 13 },
  { name: 'Jun', atual: null, previsao: 10 },
  { name: 'Jul', atual: null, previsao: 9 },
];

// Sample data for alerts
const alertsData = [
  {
    id: 1,
    title: "Joana Silva - 5 faltas consecutivas",
    action: "Enviar mensagem",
    priority: "high"
  },
  {
    id: 2,
    title: "Turma das 18h com 40% menos alunos",
    action: "Ver detalhes",
    priority: "medium"
  },
  {
    id: 3,
    title: "3 pagamentos atrasados",
    action: "Cobrar",
    priority: "high"
  },
  {
    id: 4,
    title: "Equipamento da sala 2 requer manutenção",
    action: "Agendar",
    priority: "low"
  }
];

const PainelGestao = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [heatmapType, setHeatmapType] = useState('semanal');
  const [alerts, setAlerts] = useState(alertsData);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      description: "Atualizando dados do painel..."
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Painel atualizado",
        description: "Dados atualizados com sucesso"
      });
    }, 1500);
  };

  const handleAlertAction = (id: number, action: string) => {
    toast({
      description: `Ação '${action}' será executada`
    });
    
    // Remove the alert from the list
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Use a color function to determine cell color based on value
  const getCellColor = (value: number) => {
    if (value < 30) return '#ef4444';  // Red for low attendance
    if (value < 60) return '#f97316';  // Orange for medium attendance
    if (value < 80) return '#eab308';  // Yellow for good attendance
    return '#22c55e';                   // Green for excellent attendance
  };

  return (
    <MainLayout
      pageTitle="Painel de Gestão"
      pageSubtitle="Visão geral unificada dos indicadores da academia"
      headerImage="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {/* Control bar */}
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric, idx) => (
            <Card key={idx} className="p-5">
              <div className="flex flex-col justify-between h-full">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                
                <div className="my-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  
                  {metric.change && (
                    <div className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change} vs mês passado
                    </div>
                  )}
                  
                  {metric.target && (
                    <div className="text-sm text-muted-foreground">
                      Meta: {metric.target}
                    </div>
                  )}
                </div>
                
                {metric.progress && (
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.title === 'Risco de Evasão'
                          ? 'bg-amber-500'
                          : 'bg-academy-purple'
                      }`}
                      style={{ width: `${metric.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {metric.sparkline && (
                  <div className="h-8 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.sparkline.map((value, i) => ({ name: i, value }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#9b87f5" 
                          strokeWidth={2} 
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Attendance heatmap */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Frequência Semanal</h3>
            <div className="flex space-x-2">
              <Button 
                variant={heatmapType === 'semanal' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setHeatmapType('semanal')}
              >
                Semanal
              </Button>
              <Button 
                variant={heatmapType === 'mensal' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => {
                  setHeatmapType('mensal');
                  toast({
                    description: "Visualização mensal carregada"
                  });
                }}
              >
                Mensal
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-sm"></th>
                  {['06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h'].map((hour) => (
                    <th key={hour} className="py-2 px-4 text-center font-medium text-sm">{hour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {frequencyData.map((day) => (
                  <tr key={day.name}>
                    <td className="py-2 px-4 font-medium">{day.name}</td>
                    {['06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h'].map((hour) => (
                      <td key={`${day.name}-${hour}`} className="py-1 px-2">
                        <div 
                          className="w-full h-8 rounded flex items-center justify-center text-xs text-white font-medium"
                          style={{ backgroundColor: getCellColor(day[hour]) }}
                        >
                          {day[hour]}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                toast({
                  description: "Visualizando detalhes da frequência..."
                });
              }}
            >
              Ver por horário
            </Button>
          </div>
        </Card>

        {/* Two-column layout for Alert Stream and Evasion Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert stream */}
          <Card className="p-5">
            <h3 className="text-lg font-medium mb-4">Alertas Prioritários</h3>
            
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Não há alertas ativos</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === 'high' ? 'border-l-red-500' : 
                      alert.priority === 'medium' ? 'border-l-amber-500' : 
                      'border-l-blue-500'
                    } bg-muted/30`}
                  >
                    <div className="flex justify-between items-center">
                      <p>{alert.title}</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleAlertAction(alert.id, alert.action)}
                      >
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))
              )}
              
              <Button 
                variant="link" 
                className="w-full mt-2"
                onClick={() => {
                  toast({
                    description: "Redirecionando para página de alertas..."
                  });
                }}
              >
                Ver todos os alertas →
              </Button>
            </div>
          </Card>
          
          {/* Evasion graph */}
          <Card className="p-5">
            <h3 className="text-lg font-medium mb-4">Tendência de Evasão</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evasionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="atual" 
                    name="Cancelamentos reais" 
                    stroke="#1D4ED8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previsao" 
                    name="Previsão de IA" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <Button 
              variant="link" 
              className="mt-4"
              onClick={() => {
                toast({
                  description: "Redirecionando para previsão detalhada..."
                });
              }}
            >
              Prever próximo mês →
            </Button>
          </Card>
        </div>

        {/* Bottom dock */}
        <div className="fixed bottom-6 right-6 flex space-x-3">
          <Button 
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Dashboard",
                description: "Você já está na página do Dashboard"
              });
            }}
          >
            <span className="sr-only">Dashboard</span>
            <ChartBar className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Lista de Alunos",
                description: "Carregando lista de alunos..."
              });
            }}
          >
            <span className="sr-only">Alunos</span>
            <Users className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Relatórios",
                description: "Carregando relatórios detalhados..."
              });
            }}
          >
            <span className="sr-only">Relatórios</span>
            <FileText className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Configurações",
                description: "Abrindo configurações do sistema..."
              });
            }}
          >
            <span className="sr-only">Configurações</span>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PainelGestao;
