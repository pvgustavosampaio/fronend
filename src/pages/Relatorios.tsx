
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BarChart2, 
  FileText, 
  Share2, 
  Target, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LineChart from '@/components/charts/LineChart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data
const revenueData = [
  { name: 'Jan', 2023: 22500, 2024: 24800 },
  { name: 'Fev', 2023: 21000, 2024: 23500 },
  { name: 'Mar', 2023: 23000, 2024: 26000 },
  { name: 'Abr', 2023: 25800, 2024: 28950 },
  { name: 'Mai', 2023: 24200, 2024: 28950 },
];

const heatmapData = [
  { day: 'Seg', '8h': 35, '10h': 45, '12h': 30, '14h': 25, '16h': 55, '18h': 92, '20h': 65 },
  { day: 'Ter', '8h': 45, '10h': 65, '12h': 40, '14h': 30, '16h': 60, '18h': 88, '20h': 70 },
  { day: 'Qua', '8h': 50, '10h': 70, '12h': 45, '14h': 40, '16h': 65, '18h': 90, '20h': 75 },
  { day: 'Qui', '8h': 40, '10h': 60, '12h': 35, '14h': 30, '16h': 58, '18h': 85, '20h': 68 },
  { day: 'Sex', '8h': 55, '10h': 75, '12h': 50, '14h': 45, '16h': 70, '18h': 91, '20h': 80 },
  { day: 'Sáb', '8h': 60, '10h': 80, '12h': 55, '14h': 50, '16h': 75, '18h': 75, '20h': 60 },
  { day: 'Dom', '8h': 20, '10h': 30, '12h': 15, '14h': 10, '16h': 25, '18h': 40, '20h': 30 },
];

const getColorForValue = (value) => {
  if (value < 30) return '#FF3B30';
  if (value < 60) return '#FF9500';
  if (value < 80) return '#FFCC00';
  return '#34C759';
};

const Relatorios = () => {
  const [period, setPeriod] = useState('Mensal');
  const [currentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    revenue: { value: 'R$ 28.950', change: '+12%', target: '92%' },
    occupation: { value: '78%', peak: '18h (92%)', low: 'Seg (58%)' },
    risk: { value: '15 (12%)', absent: '5 com +3 faltas' },
    newStudents: { value: '42 alunos', referral: '68% por indicação', daily: '1.4/dia' }
  });

  // Simulate a data refresh
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <MainLayout 
      pageTitle="Relatórios" 
      pageSubtitle={`Período: ${format(currentDate, 'MMMM yyyy', { locale: ptBR })}`}
      headerImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2400&h=600"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Relatórios</h2>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {period}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-1">
              {['Diário', 'Semanal', 'Mensal', 'Personalizado'].map((p) => (
                <Button 
                  key={p}
                  variant={p === period ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1 - Receita */}
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>RECEITA BRUTA</span>
          </div>
          <div className="text-3xl font-bold mb-1">{metrics.revenue.value}</div>
          <div className="flex flex-col gap-1">
            <div className="text-sm flex items-center gap-1">
              <span className="text-green-500">▲{metrics.revenue.change}</span> vs abril
            </div>
            <div className="text-sm flex items-center gap-1">
              💡 {metrics.revenue.target} da meta
            </div>
          </div>
        </div>

        {/* Card 2 - Ocupação */}
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <BarChart2 className="h-4 w-4 text-blue-500" />
            <span>TAXA DE OCUPAÇÃO</span>
          </div>
          <div className="text-3xl font-bold mb-1">{metrics.occupation.value}</div>
          <div className="flex flex-col gap-1">
            <div className="text-sm flex items-center gap-1">
              📉 Pico: {metrics.occupation.peak}
            </div>
            <div className="text-sm flex items-center gap-1">
              ⚠️ Baixa: {metrics.occupation.low}
            </div>
          </div>
        </div>

        {/* Card 3 - Evasão */}
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span>ALUNOS EM RISCO</span>
          </div>
          <div className="text-3xl font-bold mb-1">{metrics.risk.value}</div>
          <div className="flex flex-col gap-1">
            <div className="text-sm flex items-center gap-1">
              📌 {metrics.risk.absent}
            </div>
            <div className="text-sm flex items-center gap-1">
              💡 IA sugere ações
            </div>
          </div>
        </div>

        {/* Card 4 - Novos Alunos */}
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <Activity className="h-4 w-4 text-purple-500" />
            <span>CAPTAÇÃO</span>
          </div>
          <div className="text-3xl font-bold mb-1">{metrics.newStudents.value}</div>
          <div className="flex flex-col gap-1">
            <div className="text-sm flex items-center gap-1">
              🌟 {metrics.newStudents.referral}
            </div>
            <div className="text-sm flex items-center gap-1">
              📅 Média: {metrics.newStudents.daily}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos interativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico 1 - Tendência de Receita */}
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Tendência de Receita</h3>
          <div className="h-[300px]">
            <LineChart 
              title=""
              data={revenueData}
              lines={[
                { dataKey: '2023', color: '#8E9196', name: '2023' },
                { dataKey: '2024', color: '#007AFF', name: '2024' }
              ]}
              height={270}
              className="border-none shadow-none"
            />
          </div>
        </div>

        {/* Gráfico 2 - Mapa de Calor de Frequência */}
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ocupação por Horário</h3>
          <div className="h-[300px]">
            <div className="flex flex-col h-full">
              <div className="flex mb-2">
                <div className="w-[60px]"></div>
                {['8h', '10h', '12h', '14h', '16h', '18h', '20h'].map(time => (
                  <div key={time} className="flex-1 text-center text-xs text-muted-foreground">
                    {time}
                  </div>
                ))}
              </div>
              {heatmapData.map((row) => (
                <div key={row.day} className="flex mb-2">
                  <div className="w-[60px] text-sm font-medium">{row.day}</div>
                  {['8h', '10h', '12h', '14h', '16h', '18h', '20h'].map(time => (
                    <div key={`${row.day}-${time}`} className="flex-1 px-1">
                      <div 
                        className="h-8 rounded-md flex items-center justify-center text-xs text-white font-medium"
                        style={{ backgroundColor: getColorForValue(row[time]) }}
                      >
                        {row[time]}%
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Insights Acionáveis */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Insights Acionáveis</h3>
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <h4 className="font-medium">ALERTA: Turma das 19h caiu 25%</h4>
            </div>
            <div className="pl-5 space-y-1 text-sm">
              <p className="text-muted-foreground">→ Reduzir horários?</p>
              <p className="text-muted-foreground">→ Oferecer pacote promocional</p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <h4 className="font-medium">OPORTUNIDADE: Novas alunas 30-40 anos</h4>
            </div>
            <div className="pl-5 space-y-1 text-sm">
              <p className="text-muted-foreground">→ Criar campanha "Mães Ativas"</p>
              <p className="text-muted-foreground">→ Aula experimental grátis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ferramentas Rápidas */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Exportar PDF/CSV
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
        <Button variant="outline" className="gap-2">
          <Target className="h-4 w-4" />
          Comparar com Meta
        </Button>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={refreshData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </Button>
      </div>

      {/* Rodapé Inteligente */}
      <div className="text-xs text-muted-foreground border-t pt-4 mt-8">
        <div className="flex flex-wrap justify-between gap-2">
          <div>📊 Dados processados em 1.2s | IA: 92% de precisão</div>
          <div>🔒 Criptografia de ponta a ponta | Atualizado: hoje {format(new Date(), 'HH:mm')}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Relatorios;
