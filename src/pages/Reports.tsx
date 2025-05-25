import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart2, 
  FileText, 
  Share2, 
  Target, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Download,
  Mail,
  Printer,
  Settings
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Sample data for charts
const attendanceData = [
  { day: 'Seg', value: 65 },
  { day: 'Ter', value: 72 },
  { day: 'Qua', value: 68 },
  { day: 'Qui', value: 75 },
  { day: 'Sex', value: 85 },
  { day: 'Sáb', value: 78 },
  { day: 'Dom', value: 70 },
];

const revenueData = [
  { month: 'Jan', value: 22500 },
  { month: 'Fev', value: 21000 },
  { month: 'Mar', value: 23000 },
  { month: 'Abr', value: 25800 },
  { month: 'Mai', value: 24200 },
];

const Reports = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState('Mensal');
  const [currentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Metrics data
  const metrics = {
    revenue: { value: 'R$ 28.950', change: '+12%', target: '92%' },
    occupation: { value: '78%', peak: '18h (92%)', low: 'Seg (58%)' },
    risk: { value: '15 (12%)', absent: '5 com +3 faltas' },
    newStudents: { value: '42 alunos', referral: '68% por indicação', daily: '1.4/dia' }
  };

  // Simulate a data refresh
  const refreshData = () => {
    setLoading(true);
    toast({
      description: "Atualizando dados dos relatórios..."
    });
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os relatórios foram atualizados com sucesso."
      });
    }, 1200);
  };

  // Handle export
  const handleExport = (format) => {
    toast({
      title: "Relatório exportado",
      description: `O relatório foi exportado em formato ${format}.`
    });
    setShowExportDialog(false);
  };

  // Handle share
  const handleShare = (method) => {
    toast({
      title: "Relatório compartilhado",
      description: `O relatório foi compartilhado via ${method}.`
    });
    setShowShareDialog(false);
  };

  return (
    <MainLayout 
      pageTitle="Relatórios" 
      pageSubtitle={`Período: ${format(currentDate, 'MMMM yyyy', { locale: ptBR })}`}
      headerImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2400&h=600"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Frequência
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="retention" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Retenção
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-4 gap-2">
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

        {/* Main content based on active tab */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Métricas principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 - Receita */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>RECEITA BRUTA</span>
                </div>
                <div className="text-3xl font-bold mb-1">{metrics.revenue.value}</div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm flex items-center gap-1">
                    <span className="text-green-500">▲{metrics.revenue.change}</span> vs mês anterior
                  </div>
                  <div className="text-sm flex items-center gap-1">
                    💡 {metrics.revenue.target} da meta
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Ocupação */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>

            {/* Card 3 - Evasão */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>

            {/* Card 4 - Novos Alunos */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequência Semanal</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Gráfico de frequência semanal será exibido aqui
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Gráfico de receita mensal será exibido aqui
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Acionáveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Frequência</CardTitle>
              <CardDescription>
                Análise detalhada da frequência dos alunos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Gráfico detalhado de frequência será exibido aqui
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Média de Frequência</h3>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-sm text-muted-foreground mt-1">+3% vs. mês anterior</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Horário Mais Popular</h3>
                  <div className="text-2xl font-bold">18:00 - 20:00</div>
                  <p className="text-sm text-muted-foreground mt-1">92% de ocupação</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Alunos Regulares</h3>
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-sm text-muted-foreground mt-1">Frequentam 3+ vezes por semana</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alunos com Baixa Frequência</CardTitle>
              <CardDescription>
                Alunos que não frequentam a academia regularmente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Aluno</th>
                    <th className="text-left py-2">Última Presença</th>
                    <th className="text-left py-2">Frequência</th>
                    <th className="text-left py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Carlos Oliveira</td>
                    <td className="py-3">10/05/2024</td>
                    <td className="py-3">45%</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline">Contatar</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Pedro Santos</td>
                    <td className="py-3">20/04/2024</td>
                    <td className="py-3">30%</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline">Contatar</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Financeiro</CardTitle>
              <CardDescription>
                Análise detalhada das finanças da academia.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Gráfico financeiro será exibido aqui
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Receita Total</h3>
                  <div className="text-2xl font-bold">R$ 28.950</div>
                  <p className="text-sm text-muted-foreground mt-1">+12% vs. mês anterior</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Ticket Médio</h3>
                  <div className="text-2xl font-bold">R$ 120</div>
                  <p className="text-sm text-muted-foreground mt-1">Plano mensal mais popular</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Taxa de Inadimplência</h3>
                  <div className="text-2xl font-bold">8%</div>
                  <p className="text-sm text-muted-foreground mt-1">-2% vs. mês anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
              <CardDescription>
                Alunos com pagamentos pendentes ou atrasados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Aluno</th>
                    <th className="text-left py-2">Valor</th>
                    <th className="text-left py-2">Vencimento</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Carlos Oliveira</td>
                    <td className="py-3">R$ 120,00</td>
                    <td className="py-3">15/05/2024</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-500/10 text-red-500">
                        Atrasado
                      </span>
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="outline">Cobrar</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Pedro Santos</td>
                    <td className="py-3">R$ 120,00</td>
                    <td className="py-3">20/05/2024</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500">
                        Pendente
                      </span>
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="outline">Lembrar</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Retenção</CardTitle>
              <CardDescription>
                Métricas e insights sobre retenção de alunos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Gráfico de retenção será exibido aqui
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Taxa de Retenção</h3>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-sm text-muted-foreground mt-1">+3% vs. mês anterior</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Tempo Médio</h3>
                  <div className="text-2xl font-bold">8 meses</div>
                  <p className="text-sm text-muted-foreground mt-1">Permanência dos alunos</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Alunos em Risco</h3>
                  <div className="text-2xl font-bold">15 (12%)</div>
                  <p className="text-sm text-muted-foreground mt-1">Previsão de IA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alunos em Risco</CardTitle>
              <CardDescription>
                Alunos com alta probabilidade de cancelamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Aluno</th>
                    <th className="text-left py-2">Risco</th>
                    <th className="text-left py-2">Motivo</th>
                    <th className="text-left py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Ana Silva</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-500/10 text-red-500">
                        Alto (85%)
                      </span>
                    </td>
                    <td className="py-3">5 faltas consecutivas</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline">Contatar</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Carlos Oliveira</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500">
                        Médio (65%)
                      </span>
                    </td>
                    <td className="py-3">Pagamento atrasado</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline">Contatar</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowExportDialog(true)}
          >
            <FileText className="h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              toast({
                title: "Comparando com metas",
                description: "Analisando desempenho em relação às metas..."
              });
            }}
          >
            <Target className="h-4 w-4" />
            Comparar com Metas
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
        
        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exportar Relatório</DialogTitle>
              <DialogDescription>
                Escolha o formato para exportar o relatório.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button 
                className="flex items-center justify-center gap-2"
                onClick={() => handleExport('PDF')}
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button 
                className="flex items-center justify-center gap-2"
                onClick={() => handleExport('Excel')}
              >
                <FileText className="h-4 w-4" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleExport('CSV')}
              >
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleExport('JSON')}
              >
                <FileText className="h-4 w-4" />
                JSON
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartilhar Relatório</DialogTitle>
              <DialogDescription>
                Escolha como deseja compartilhar o relatório.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button 
                className="flex items-center justify-center gap-2"
                onClick={() => handleShare('Email')}
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button 
                className="flex items-center justify-center gap-2"
                onClick={() => handleShare('WhatsApp')}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleShare('Link')}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Copiar Link
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleShare('Print')}
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Reports;