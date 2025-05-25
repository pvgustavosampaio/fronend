import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  QrCode, 
  ClipboardList, 
  DownloadCloud, 
  Settings, 
  ArrowUpRight,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample student attendance data
const initialStudents = [
  { 
    id: 1, 
    name: 'Ana Silva', 
    photo: 'https://i.pravatar.cc/150?img=1', 
    time: '07:30', 
    status: 'present', 
    streak: 5 
  },
  { 
    id: 2, 
    name: 'Carlos Oliveira', 
    photo: 'https://i.pravatar.cc/150?img=8', 
    time: '18:15', 
    status: 'absent', 
    streak: 0 
  },
  { 
    id: 3, 
    name: 'Marta Rocha', 
    photo: 'https://i.pravatar.cc/150?img=5', 
    time: '12:00', 
    status: 'late', 
    streak: 3, 
    lateMinutes: 15 
  },
  { 
    id: 4, 
    name: 'João Souza', 
    photo: 'https://i.pravatar.cc/150?img=12', 
    time: '19:30', 
    status: 'present', 
    streak: 8 
  },
  { 
    id: 5, 
    name: 'Luiza Costa', 
    photo: 'https://i.pravatar.cc/150?img=9', 
    time: '08:45', 
    status: 'present', 
    streak: 2 
  },
  { 
    id: 6, 
    name: 'Roberto Alves', 
    photo: 'https://i.pravatar.cc/150?img=3', 
    time: '17:00', 
    status: 'absent', 
    streak: 0 
  },
  { 
    id: 7, 
    name: 'Paula Santos', 
    photo: 'https://i.pravatar.cc/150?img=6', 
    time: '14:30', 
    status: 'present', 
    streak: 4 
  },
  { 
    id: 8, 
    name: 'André Martins', 
    photo: 'https://i.pravatar.cc/150?img=4', 
    time: '20:45', 
    status: 'late', 
    streak: 1, 
    lateMinutes: 5 
  },
];

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const attendanceByDay = [65, 72, 68, 75, 85, 78, 70]; // Percentages

const metricsData = {
  presencesToday: 87,
  totalToday: 120,
  percentageToday: 72,
  increaseFromYesterday: 5,
  newToday: 15,
  criticalAbsences: 5,
  peakTime: '18h-19h',
  peakAttendees: 42,
  peakCapacity: 92,
  weeklyAverage: 78,
  bestDay: 'Sex',
  bestDayPercentage: 85,
  worstDay: 'Seg',
  worstDayPercentage: 65
};

const Attendance = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState(initialStudents);
  const [showQrCodeDialog, setShowQrCodeDialog] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('daily');
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle marking attendance
  const handleAttendance = (id, newStatus) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
    
    const student = students.find(s => s.id === id);
    toast({
      title: `Presença atualizada`,
      description: `${student.name} marcado como ${newStatus === 'present' ? 'presente' : newStatus === 'late' ? 'atrasado' : 'ausente'}.`
    });
  };
  
  // Handle contact student
  const handleContact = (id) => {
    const student = students.find(s => s.id === id);
    toast({
      title: `Contato iniciado`,
      description: `Enviando mensagem para ${student.name}.`
    });
  };
  
  // Generate QR code for check-in
  const handleGenerateQrCode = () => {
    toast({
      title: "QR Code gerado",
      description: "QR Code para check-in disponível para compartilhamento."
    });
  };
  
  // Export attendance report
  const handleExport = (format) => {
    toast({
      title: "Relatório exportado",
      description: `Relatório de frequência exportado em formato ${format}.`
    });
    setShowExportDialog(false);
  };

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    toast({
      description: `Carregando dados para ${new Date(e.target.value).toLocaleDateString()}`
    });
  };
  
  return (
    <MainLayout
      pageTitle="Controle de Frequência"
      pageSubtitle="Monitore a presença dos seus alunos"
      headerImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Diário
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Semanal
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Mensal
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Input 
                type="date" 
                value={selectedDate}
                onChange={handleDateChange}
                className="w-40"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowQrCodeDialog(true)}
              >
                <QrCode className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowExportDialog(true)}
              >
                <DownloadCloud className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="daily" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Presenças Hoje */}
              <Card className="bg-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">PRESENÇAS HOJE</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-3xl font-bold text-green-500">
                        {metricsData.presencesToday}
                        <span className="text-lg text-muted-foreground">/{metricsData.totalToday}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm">
                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-500">{metricsData.increaseFromYesterday}% vs ontem</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-500">{metricsData.percentageToday}%</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {metricsData.newToday} novos hoje
                  </div>
                </CardContent>
              </Card>

              {/* Faltas Críticas */}
              <Card className="bg-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">FALTAS CRÍTICAS</div>
                  <div className="text-3xl font-bold text-red-500">{metricsData.criticalAbsences}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Alunos com 3+ faltas seguidas
                  </div>
                </CardContent>
              </Card>

              {/* Horário de Pico */}
              <Card className="bg-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">HORÁRIO PICO</div>
                  <div className="text-3xl font-bold">{metricsData.peakTime}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {metricsData.peakAttendees} alunos ({metricsData.peakCapacity}% capacidade)
                  </div>
                </CardContent>
              </Card>

              {/* Tendência Semanal */}
              <Card className="bg-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">TENDÊNCIA SEMANAL</div>
                  <div className="text-3xl font-bold">{metricsData.weeklyAverage}%</div>
                  <div className="text-xs flex justify-between mt-2">
                    <span className="text-green-500">⭐ Melhor: {metricsData.bestDay} ({metricsData.bestDayPercentage}%)</span>
                    <span className="text-red-500">⚠️ Pior: {metricsData.worstDay} ({metricsData.worstDayPercentage}%)</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar aluno..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowWaitlistDialog(true)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Lista de Espera
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    toast({
                      title: "Filtros",
                      description: "Configurando filtros avançados..."
                    });
                  }}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Students List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Lista de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Nome</th>
                        <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Hora</th>
                        <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={student.photo} 
                                alt={student.name} 
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-medium">{student.name}</div>
                                {student.streak > 0 && (
                                  <div className="text-xs text-green-500">✓ {student.streak} dias seguidos</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3">{student.time}</td>
                          <td className="py-3">
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${student.status === 'present' ? 'bg-green-500/10 text-green-500' : 
                                  student.status === 'late' ? 'bg-yellow-500/10 text-yellow-500' : 
                                  'bg-red-500/10 text-red-500'}
                              `}
                            >
                              {student.status === 'present' && '✅ Presente'}
                              {student.status === 'late' && `⚠️ Atraso ${student.lateMinutes}'`}
                              {student.status === 'absent' && '❌ Falta'}
                            </span>
                          </td>
                          <td className="py-3 flex gap-1">
                            {student.status !== 'present' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs"
                                onClick={() => handleAttendance(student.id, 'present')}
                              >
                                Marcar Presença
                              </Button>
                            )}
                            {student.status === 'absent' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs"
                                onClick={() => handleContact(student.id)}
                              >
                                Contatar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-6">
            {/* Heat Map */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Mapa de Frequência Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  {daysOfWeek.map((day, index) => (
                    <div key={day} className="text-center w-10">
                      <div className="text-xs font-medium text-muted-foreground">{day}</div>
                      <div 
                        className={`w-10 h-10 rounded-full mx-auto mt-2 flex items-center justify-center text-white text-sm font-medium
                          ${attendanceByDay[index] > 80 ? 'bg-green-500' : 
                            attendanceByDay[index] > 60 ? 'bg-yellow-500' : 
                            'bg-red-500'}
                        `}
                      >
                        {attendanceByDay[index]}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 text-xs text-muted-foreground gap-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>&gt;80%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span>60-80%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>&lt;60%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Média Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metricsData.weeklyAverage}%</div>
                  <p className="text-sm text-muted-foreground">vs. 75% semana anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Melhor Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metricsData.bestDay} ({metricsData.bestDayPercentage}%)</div>
                  <p className="text-sm text-muted-foreground">18:00 - 20:00</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pior Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metricsData.worstDay} ({metricsData.worstDayPercentage}%)</div>
                  <p className="text-sm text-muted-foreground">06:00 - 08:00</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tendência Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de tendência mensal será exibido aqui</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Alunos com Baixa Frequência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students
                    .filter(s => s.status === 'absent')
                    .map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.photo} 
                            alt={student.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-red-500">3 faltas consecutivas</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContact(student.id)}
                        >
                          Contatar
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Code Dialog */}
        <Dialog open={showQrCodeDialog} onOpenChange={setShowQrCodeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code para Check-in</DialogTitle>
              <DialogDescription>
                Gere um QR code para facilitar o check-in dos alunos.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col items-center">
              <div className="w-64 h-64 bg-secondary flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-muted-foreground" />
              </div>
              <Button onClick={handleGenerateQrCode}>Gerar Novo QR Code</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Waitlist Dialog */}
        <Dialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lista de Espera</DialogTitle>
              <DialogDescription>
                Veja os alunos na lista de espera para as próximas aulas.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Nome</th>
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Turma</th>
                    <th className="text-left pb-2 text-xs font-medium text-muted-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Fernanda Lima</td>
                    <td className="py-3">Pilates 19h</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Adicionar</Button>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Ricardo Gomes</td>
                    <td className="py-3">Funcional 20h</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Adicionar</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exportar Relatório</DialogTitle>
              <DialogDescription>
                Escolha o formato para exportar o relatório de frequência.
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

        {/* Config Dialog */}
        <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Alertas</DialogTitle>
              <DialogDescription>
                Personalize os alertas de frequência.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Alerta de faltas consecutivas</div>
                  <div className="text-sm text-muted-foreground">Após 3 faltas</div>
                </div>
                <button className="w-12 h-6 rounded-full relative bg-primary">
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-background transform translate-x-7" />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Notificação por WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Para faltas críticas</div>
                </div>
                <button className="w-12 h-6 rounded-full relative bg-primary">
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-background transform translate-x-7" />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Relatório semanal</div>
                  <div className="text-sm text-muted-foreground">Enviado por e-mail</div>
                </div>
                <button className="w-12 h-6 rounded-full relative bg-primary">
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-background transform translate-x-7" />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowConfigDialog(false)}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* IA Alert Footer */}
        <div className="bg-secondary/10 rounded-lg p-4 text-center">
          <div className="text-sm font-medium mb-1">📌 Alerta IA</div>
          <div className="text-muted-foreground">
            "Turma das 19h com 30% menos alunos"
          </div>
          <div className="text-primary text-sm mt-1">
            💡 Sugere: "Oferecer aula experimental grátis"
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;