
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, QrCode, ClipboardList, DownloadCloud, Settings, ArrowUpRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample student attendance data
const initialStudents = [
  { id: 1, name: 'Ana Silva', time: '07:30', status: 'present', streak: 5 },
  { id: 2, name: 'Carlos Oliveira', time: '18:15', status: 'absent', streak: 0 },
  { id: 3, name: 'Marta Rocha', time: '12:00', status: 'late', streak: 3, lateMinutes: 15 },
  { id: 4, name: 'João Souza', time: '19:30', status: 'present', streak: 8 },
  { id: 5, name: 'Luiza Costa', time: '08:45', status: 'present', streak: 2 },
  { id: 6, name: 'Roberto Alves', time: '17:00', status: 'absent', streak: 0 },
  { id: 7, name: 'Paula Santos', time: '14:30', status: 'present', streak: 4 },
  { id: 8, name: 'André Martins', time: '20:45', status: 'late', streak: 1, lateMinutes: 5 },
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

const ControleFrequencia = () => {
  const [students, setStudents] = useState(initialStudents);
  const [showQrCodeDialog, setShowQrCodeDialog] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  
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
  
  return (
    <MainLayout
      pageTitle="Controle de Frequência"
      pageSubtitle="Monitore a presença dos seus alunos"
      headerImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-6">
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

        {/* Heat Map */}
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-4">MAPA DE FREQUÊNCIA SEMANAL</div>
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

        {/* Students List */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-4">LISTA DE ALUNOS</div>
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
                  {students.map(student => (
                    <tr key={student.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{student.name}</div>
                        {student.streak > 0 && (
                          <div className="text-xs text-green-500">✓ {student.streak} dias seguidos</div>
                        )}
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

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">
          <div className="bg-background glass-morphism rounded-lg p-1.5 flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setShowQrCodeDialog(true)}>
              <QrCode className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowWaitlistDialog(true)}>
              <ClipboardList className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowExportDialog(true)}>
              <DownloadCloud className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowConfigDialog(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
    </MainLayout>
  );
};

export default ControleFrequencia;
