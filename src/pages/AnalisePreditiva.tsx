
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Download, Settings, RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Line, LineChart, Legend } from 'recharts';

// Sample data for the predictive chart
const predictiveData = [
  { month: 'Jan', actual: 5, prediction: 6 },
  { month: 'Fev', actual: 7, prediction: 8 },
  { month: 'Mar', actual: 10, prediction: 9 },
  { month: 'Abr', actual: 8, prediction: 9 },
  { month: 'Mai', actual: 12, prediction: 14 },
  { month: 'Jun', actual: null, prediction: 18 },
  { month: 'Jul', actual: null, prediction: 15 },
  { month: 'Ago', actual: null, prediction: 11 },
];

// Sample data for students at risk
const studentsAtRisk = [
  { id: 1, name: 'Ana Silva', risk: 92, factor: 'Faltas consecutivas', lastAttendance: '15/05' },
  { id: 2, name: 'Carlos Oliveira', risk: 87, factor: 'Feedback negativo', lastAttendance: '18/05' },
  { id: 3, name: 'Pedro Santos', risk: 85, factor: 'Inadimplência', lastAttendance: '12/05' },
  { id: 4, name: 'Julia Martins', risk: 79, factor: 'Baixa frequência', lastAttendance: '20/05' },
];

// Sample insights
const insights = [
  {
    id: 1,
    icon: '🔥',
    title: 'ALTA EVASÃO EM:',
    description: 'Mulheres 30-35 anos',
    detail: '(72% mais chances no inverno)',
    recommendation: 'Sugere campanha "Desafio de Inverno"'
  },
  {
    id: 2,
    icon: '📉',
    title: 'TURMA DAS 19H:',
    description: 'Adesão caindo 15% semanal',
    detail: '',
    recommendation: 'Oferecer pacote "Amigo Traz Amigo"'
  },
  {
    id: 3,
    icon: '⚠️',
    title: 'PRÓXIMOS 7 DIAS:',
    description: 'R$ 2.800 em risco',
    detail: '(4 alunos com >80% chance de sair)',
    recommendation: 'Contatar individualmente'
  }
];

const AnalisePreditiva = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('30d');
  const [showFactorsDialog, setShowFactorsDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showRecalculateDialog, setShowRecalculateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  
  // Handle export report
  const handleExport = (format) => {
    toast({
      title: "Relatório exportado",
      description: `Relatório de análise preditiva exportado em formato ${format}.`
    });
    setShowExportDialog(false);
  };
  
  // Handle recalculate model
  const handleRecalculate = () => {
    toast({
      title: "Recalculando modelo",
      description: "Este processo pode levar alguns minutos..."
    });
    
    // Simulate process
    setTimeout(() => {
      toast({
        title: "Modelo atualizado",
        description: "Análise preditiva recalculada com sucesso."
      });
      setShowRecalculateDialog(false);
    }, 3000);
  };
  
  // Handle contact student
  const handleContactStudent = (studentId) => {
    const student = studentsAtRisk.find(s => s.id === studentId);
    toast({
      title: "Contato iniciado",
      description: `Iniciando contato com ${student.name}.`
    });
  };
  
  // Handle offer discount
  const handleOfferDiscount = (studentId) => {
    const student = studentsAtRisk.find(s => s.id === studentId);
    toast({
      title: "Desconto oferecido",
      description: `Oferta de desconto enviada para ${student.name}.`
    });
  };
  
  return (
    <MainLayout
      pageTitle="Análise Preditiva"
      pageSubtitle="Previsão de evasão com 87% de precisão"
      headerImage="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Main predictive chart */}
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">Tendência de Cancelamentos</div>
              <div className="flex bg-secondary/20 rounded-lg overflow-hidden">
                <button 
                  className={`px-3 py-1 text-sm ${activeTimeframe === '7d' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTimeframe('7d')}
                >
                  7d
                </button>
                <button 
                  className={`px-3 py-1 text-sm ${activeTimeframe === '30d' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTimeframe('30d')}
                >
                  30d
                </button>
                <button 
                  className={`px-3 py-1 text-sm ${activeTimeframe === '90d' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTimeframe('90d')}
                >
                  90d
                </button>
              </div>
            </div>
            
            <div className="h-72">
              <ChartContainer config={{ actual: { color: '#007AFF' }, prediction: { color: '#FF9500' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictiveData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007AFF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9500" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF9500" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      name="Dados reais"
                      stroke="#007AFF" 
                      fillOpacity={1} 
                      fill="url(#colorActual)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="prediction" 
                      name="Previsão IA"
                      stroke="#FF9500" 
                      fillOpacity={1}
                      fill="url(#colorPrediction)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Toque para detalhes diários • Pinça para zoom temporal • Toque longo para comparar com anos anteriores
            </div>
          </CardContent>
        </Card>
        
        {/* Insights Panel */}
        <div className="flex flex-col md:flex-row gap-4">
          {insights.map(insight => (
            <div 
              key={insight.id} 
              className="flex-1 bg-secondary/10 rounded-xl p-4 hover:bg-secondary/20 transition-colors cursor-pointer"
              onClick={() => toast({
                title: insight.title,
                description: insight.recommendation
              })}
            >
              <div className="text-xl mb-2">{insight.icon}</div>
              <div className="font-semibold text-sm">{insight.title}</div>
              <div className="text-base mt-1">{insight.description}</div>
              {insight.detail && (
                <div className="text-sm text-muted-foreground mt-1">{insight.detail}</div>
              )}
              <div className="text-primary text-sm font-medium mt-3">→ {insight.recommendation}</div>
            </div>
          ))}
        </div>
        
        {/* Students at risk */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">Alunos em Risco de Evasão</div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Buscar aluno..." 
                  className="pl-8 py-1 pr-4 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Aluno</th>
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Risco</th>
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Fator Principal</th>
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Última Presença</th>
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsAtRisk.map(student => (
                    <tr key={student.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{student.name}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-5 rounded-full bg-gray-700 mr-2 overflow-hidden"
                          >
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${student.risk}%` }}
                            ></div>
                          </div>
                          <span className="text-red-500 font-medium">{student.risk}%</span>
                        </div>
                      </td>
                      <td className="py-3">{student.factor}</td>
                      <td className="py-3">{student.lastAttendance}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs"
                            onClick={() => handleContactStudent(student.id)}
                          >
                            Contatar
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleOfferDiscount(student.id)}
                          >
                            Oferecer Desconto
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Control buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowFactorsDialog(true)}
          >
            <Search className="mr-2 h-4 w-4" /> Detalhar Fatores
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar Relatório
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowRecalculateDialog(true)}
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Recalcular Modelo
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="mr-2 h-4 w-4" /> Ajustar Sensibilidade
          </Button>
        </div>
        
        {/* Footer */}
        <div className="text-xs text-center text-muted-foreground py-4 border-t border-border">
          Modelo treinado em 12.500 registros | Atualizado: {new Date().toLocaleDateString()} | 
          Dados protegidos por criptografia AES-256
        </div>
      </div>
      
      {/* Detail Factors Dialog */}
      <Dialog open={showFactorsDialog} onOpenChange={setShowFactorsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Fatores de Evasão</DialogTitle>
            <DialogDescription>
              Análise detalhada dos principais fatores que contribuem para evasão.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">Fatores por Gênero</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    {month: 'Jan', mulheres: 52, homens: 48},
                    {month: 'Fev', mulheres: 58, homens: 45},
                    {month: 'Mar', mulheres: 62, homens: 47},
                    {month: 'Abr', mulheres: 70, homens: 50},
                    {month: 'Mai', mulheres: 72, homens: 53},
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="mulheres" stroke="#FF9500" />
                    <Line type="monotone" dataKey="homens" stroke="#007AFF" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="font-medium mb-2">Razões de Cancelamento</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    {month: 'Jan', preço: 30, horário: 20, atendimento: 15},
                    {month: 'Fev', preço: 35, horário: 25, atendimento: 12},
                    {month: 'Mar', preço: 32, horário: 30, atendimento: 18},
                    {month: 'Abr', preço: 40, horário: 28, atendimento: 15},
                    {month: 'Mai', preço: 45, horário: 30, atendimento: 20},
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="preço" stroke="#FF3B30" />
                    <Line type="monotone" dataKey="horário" stroke="#34C759" />
                    <Line type="monotone" dataKey="atendimento" stroke="#5856D6" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="font-medium mb-2">Principais Fatores Preditivos (Peso no Modelo)</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mr-2">
                    <div className="h-full bg-red-500" style={{ width: '85%' }}></div>
                  </div>
                  <div className="min-w-[120px] text-sm">Faltas consecutivas (85%)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mr-2">
                    <div className="h-full bg-orange-500" style={{ width: '72%' }}></div>
                  </div>
                  <div className="min-w-[120px] text-sm">Inadimplência (72%)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mr-2">
                    <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
                  </div>
                  <div className="min-w-[120px] text-sm">Feedback negativo (65%)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mr-2">
                    <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
                  </div>
                  <div className="min-w-[120px] text-sm">Distância da academia (45%)</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Relatório</DialogTitle>
            <DialogDescription>
              Escolha o formato para exportar a análise preditiva.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={() => handleExport('PDF')}>PDF</Button>
            <Button onClick={() => handleExport('Excel')}>Excel</Button>
            <Button onClick={() => handleExport('CSV')} variant="outline">CSV</Button>
            <Button onClick={() => handleExport('JSON')} variant="outline">JSON</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Recalculate Dialog */}
      <Dialog open={showRecalculateDialog} onOpenChange={setShowRecalculateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recalcular Modelo</DialogTitle>
            <DialogDescription>
              Atualizar o modelo de previsão com os dados mais recentes?
              Este processo pode levar alguns minutos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 py-4">
            <Button variant="outline" onClick={() => setShowRecalculateDialog(false)}>Cancelar</Button>
            <Button onClick={handleRecalculate}>Recalcular</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Sensibilidade</DialogTitle>
            <DialogDescription>
              Configure a sensibilidade do modelo de previsão.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Limiar de Alerta</label>
                <span className="text-sm">70%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="90" 
                defaultValue="70"
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-muted-foreground">
                Um limiar mais baixo resultará em mais alertas de risco
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Período de Análise</label>
                <span className="text-sm">30 dias</span>
              </div>
              <input 
                type="range" 
                min="7" 
                max="90" 
                defaultValue="30"
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-muted-foreground">
                Período histórico usado para previsões
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Peso dos Fatores</label>
                <span className="text-sm">Equilibrado</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="py-1 px-2 text-xs rounded-lg bg-primary text-primary-foreground">Equilibrado</button>
                <button className="py-1 px-2 text-xs rounded-lg bg-secondary">Financeiro</button>
                <button className="py-1 px-2 text-xs rounded-lg bg-secondary">Frequência</button>
              </div>
              <div className="text-xs text-muted-foreground">
                Enfatiza diferentes fatores preditivos
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => {
              setShowSettingsDialog(false);
              toast({
                title: "Configurações salvas",
                description: "As novas configurações de sensibilidade foram aplicadas."
              });
            }}>
              Salvar Configurações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AnalisePreditiva;
