import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  AlertTriangle,
  TrendingDown,
  DollarSign,
  FileText,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';

// Sample student data
const initialStudents = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '(11) 98765-4321',
    status: 'active',
    plan: 'Mensal',
    joinDate: '2023-10-15',
    lastAttendance: '2024-05-15',
    attendanceRate: 85,
    paymentStatus: 'paid',
    riskScore: 12,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    phone: '(11) 97654-3210',
    status: 'active',
    plan: 'Trimestral',
    joinDate: '2023-08-22',
    lastAttendance: '2024-05-10',
    attendanceRate: 62,
    paymentStatus: 'overdue',
    riskScore: 78,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Mariana Costa',
    email: 'mariana.costa@example.com',
    phone: '(11) 96543-2109',
    status: 'active',
    plan: 'Anual',
    joinDate: '2023-05-10',
    lastAttendance: '2024-05-16',
    attendanceRate: 93,
    paymentStatus: 'paid',
    riskScore: 5,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    phone: '(11) 95432-1098',
    status: 'inactive',
    plan: 'Mensal',
    joinDate: '2023-11-05',
    lastAttendance: '2024-04-20',
    attendanceRate: 45,
    paymentStatus: 'pending',
    riskScore: 65,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Juliana Mendes',
    email: 'juliana.mendes@example.com',
    phone: '(11) 94321-0987',
    status: 'active',
    plan: 'Semestral',
    joinDate: '2023-07-18',
    lastAttendance: '2024-05-14',
    attendanceRate: 78,
    paymentStatus: 'paid',
    riskScore: 18,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
  }
];

// Alert templates
const alertTemplates = [
  {
    id: 'absence',
    name: 'Alerta de Ausência',
    subject: 'Sentimos sua falta na academia',
    body: `Olá {nome},

Notamos que você não compareceu à academia nos últimos {dias} dias. Está tudo bem?

Queremos ajudar você a manter sua rotina de exercícios. Se estiver enfrentando alguma dificuldade, estamos à disposição para ajudar.

Que tal agendar uma aula com um de nossos professores para retomar os treinos?

Atenciosamente,
Equipe da Academia`
  },
  {
    id: 'payment',
    name: 'Lembrete de Pagamento',
    subject: 'Lembrete: Sua mensalidade está próxima do vencimento',
    body: `Olá {nome},

Este é um lembrete amigável de que sua mensalidade no valor de R$ {valor} vence em {dias} dias.

Para sua comodidade, você pode efetuar o pagamento através do nosso aplicativo ou site.

Caso já tenha efetuado o pagamento, por favor desconsidere esta mensagem.

Atenciosamente,
Equipe da Academia`
  },
  {
    id: 'retention',
    name: 'Retenção de Aluno',
    subject: 'Uma oferta especial para você',
    body: `Olá {nome},

Valorizamos muito sua presença em nossa academia e queremos oferecer uma condição especial para você continuar conosco.

Preparamos um desconto de 15% na sua próxima mensalidade, além de uma sessão gratuita com um personal trainer.

Entre em contato conosco para aproveitar esta oferta exclusiva!

Atenciosamente,
Equipe da Academia`
  }
];

const Students = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(alertTemplates[0].id);
  const [customMessage, setCustomMessage] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Mensal'
  });
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter students based on search term and active tab
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && student.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && student.status === 'inactive';
    if (activeTab === 'risk') return matchesSearch && student.riskScore > 50;
    if (activeTab === 'payment') return matchesSearch && student.paymentStatus !== 'paid';
    
    return matchesSearch;
  });

  // Handle adding a new student
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.phone) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    const newId = (students.length + 1).toString();
    const student = {
      id: newId,
      ...newStudent,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastAttendance: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      paymentStatus: 'paid',
      riskScore: 0,
      photo: ''
    };
    
    setStudents([...students, student]);
    setShowAddDialog(false);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      plan: 'Mensal'
    });
    
    toast({
      title: "Aluno adicionado",
      description: `${newStudent.name} foi adicionado com sucesso.`
    });
  };

  // Handle editing a student
  const handleEditStudent = () => {
    if (!selectedStudent) return;
    
    setStudents(students.map(student => 
      student.id === selectedStudent.id ? selectedStudent : student
    ));
    
    setShowEditDialog(false);
    
    toast({
      title: "Aluno atualizado",
      description: `${selectedStudent.name} foi atualizado com sucesso.`
    });
  };

  // Handle deleting a student
  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    
    setStudents(students.filter(student => student.id !== selectedStudent.id));
    setShowDeleteDialog(false);
    
    toast({
      title: "Aluno removido",
      description: `${selectedStudent.name} foi removido com sucesso.`
    });
  };

  // Handle sending alert
  const handleSendAlert = () => {
    if (!selectedStudent) return;
    
    const template = alertTemplates.find(t => t.id === selectedTemplate);
    
    if (!template) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Template não encontrado."
      });
      return;
    }
    
    // In a real implementation, this would send an email or notification
    toast({
      title: "Alerta enviado",
      description: `${template.name} enviado para ${selectedStudent.name}.`
    });
    
    setShowAlertDialog(false);
  };

  // Handle payment action
  const handlePaymentAction = (action: string) => {
    if (!selectedStudent) return;
    
    if (action === 'pay') {
      setStudents(students.map(student => 
        student.id === selectedStudent.id ? { ...student, paymentStatus: 'paid' } : student
      ));
      
      toast({
        title: "Pagamento registrado",
        description: `Pagamento de ${selectedStudent.name} registrado com sucesso.`
      });
    } else if (action === 'remind') {
      toast({
        title: "Lembrete enviado",
        description: `Lembrete de pagamento enviado para ${selectedStudent.name}.`
      });
    } else if (action === 'generate') {
      toast({
        title: "Boleto gerado",
        description: `Boleto gerado para ${selectedStudent.name}.`
      });
    }
    
    setShowPaymentDialog(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "A lista de alunos foi atualizada."
      });
    }, 1500);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get risk badge
  const getRiskBadge = (score: number) => {
    if (score < 30) {
      return <Badge className="bg-green-500">Baixo</Badge>;
    } else if (score < 70) {
      return <Badge className="bg-amber-500">Médio</Badge>;
    } else {
      return <Badge className="bg-red-500">Alto</Badge>;
    }
  };

  return (
    <MainLayout pageTitle="Alunos" pageSubtitle="Gerencie os alunos da sua academia">
      <div className="space-y-4">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="inactive">Inativos</TabsTrigger>
              <TabsTrigger value="risk">Em Risco</TabsTrigger>
              <TabsTrigger value="payment">Pagamento Pendente</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 ml-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Exportando dados",
                  description: "Os dados dos alunos estão sendo exportados."
                });
              }}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Novo Aluno
            </Button>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, email ou telefone..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Importar alunos",
                  description: "Redirecionando para a página de importação..."
                });
                window.location.href = '/import';
              }}
              className="gap-1"
            >
              <Upload className="h-4 w-4" />
              Importar
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
        
        {/* Students table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum aluno encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.photo} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {getStatusBadge(student.status)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {student.email}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {student.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{student.plan}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Desde {formatDate(student.joinDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{student.attendanceRate}%</span>
                          </div>
                          <Progress 
                            value={student.attendanceRate} 
                            className="h-2"
                            indicatorClassName={
                              student.attendanceRate > 75 ? "bg-green-500" :
                              student.attendanceRate > 50 ? "bg-amber-500" :
                              "bg-red-500"
                            }
                          />
                          <div className="text-xs text-muted-foreground">
                            Última: {formatDate(student.lastAttendance)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(student.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRiskBadge(student.riskScore)}
                          <span className="text-sm">{student.riskScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudent(student);
                              setShowEditDialog(true);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudent(student);
                              setShowAlertDialog(true);
                            }}>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar Alerta
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudent(student);
                              setShowPaymentDialog(true);
                            }}>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Gerenciar Pagamento
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Alunos</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                  <p className="text-2xl font-bold">{students.filter(s => s.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Risco</p>
                  <p className="text-2xl font-bold">{students.filter(s => s.riskScore > 50).length}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pagamentos Pendentes</p>
                  <p className="text-2xl font-bold">{students.filter(s => s.paymentStatus !== 'paid').length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo aluno. Os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input 
                id="name" 
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input 
                id="phone" 
                value={newStudent.phone}
                onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan">Plano</Label>
              <select
                id="plan"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newStudent.plan}
                onChange={(e) => setNewStudent({...newStudent, plan: e.target.value})}
              >
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddStudent}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Dialog */}
      {selectedStudent && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Aluno</DialogTitle>
              <DialogDescription>
                Atualize os dados do aluno.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input 
                  id="edit-name" 
                  value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input 
                  id="edit-phone" 
                  value={selectedStudent.phone}
                  onChange={(e) => setSelectedStudent({...selectedStudent, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plano</Label>
                <select
                  id="edit-plan"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedStudent.plan}
                  onChange={(e) => setSelectedStudent({...selectedStudent, plan: e.target.value})}
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedStudent.status}
                  onChange={(e) => setSelectedStudent({...selectedStudent, status: e.target.value})}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
              <Button onClick={handleEditStudent}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Student Dialog */}
      {selectedStudent && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Aluno</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p>
                Você está prestes a excluir <strong>{selectedStudent.name}</strong>.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteStudent}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Send Alert Dialog */}
      {selectedStudent && (
        <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Alerta</DialogTitle>
              <DialogDescription>
                Envie um alerta personalizado para {selectedStudent.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    const template = alertTemplates.find(t => t.id === e.target.value);
                    if (template) {
                      let message = template.body;
                      message = message.replace('{nome}', selectedStudent.name);
                      
                      if (template.id === 'absence') {
                        const lastAttendance = new Date(selectedStudent.lastAttendance);
                        const today = new Date();
                        const diffTime = Math.abs(today.getTime() - lastAttendance.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        message = message.replace('{dias}', diffDays.toString());
                      } else if (template.id === 'payment') {
                        message = message.replace('{valor}', '120,00');
                        message = message.replace('{dias}', '3');
                      }
                      
                      setCustomMessage(message);
                    }
                  }}
                >
                  {alertTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Mensagem</Label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px]"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Canais de Envio</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="send-email" defaultChecked />
                    <Label htmlFor="send-email" className="text-sm">Email ({selectedStudent.email})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="send-sms" />
                    <Label htmlFor="send-sms" className="text-sm">SMS ({selectedStudent.phone})</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Agendamento</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="schedule" />
                  <Label htmlFor="schedule" className="text-sm">Agendar envio</Label>
                </div>
                <div className="flex space-x-2">
                  <Input type="date" className="flex-1" disabled />
                  <Input type="time" className="w-32" disabled />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAlertDialog(false)}>Cancelar</Button>
              <Button onClick={handleSendAlert}>Enviar Alerta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Payment Dialog */}
      {selectedStudent && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar Pagamento</DialogTitle>
              <DialogDescription>
                Gerencie o pagamento de {selectedStudent.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Status atual</h3>
                  <div className="mt-1">
                    {getPaymentStatusBadge(selectedStudent.paymentStatus)}
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-medium">Plano</h3>
                  <div className="mt-1 text-sm">{selectedStudent.plan}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ações Disponíveis</Label>
                <div className="space-y-2">
                  {selectedStudent.paymentStatus !== 'paid' && (
                    <Button 
                      className="w-full justify-start"
                      onClick={() => handlePaymentAction('pay')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Registrar Pagamento
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handlePaymentAction('remind')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Lembrete
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handlePaymentAction('generate')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Boleto
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Histórico de Pagamentos</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{formatDate('2024-04-10')}</TableCell>
                        <TableCell>R$ 120,00</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Pago</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{formatDate('2024-03-10')}</TableCell>
                        <TableCell>R$ 120,00</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Pago</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

// Helper component for the Users icon
const Users = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Students;