import React, { useState, useEffect } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  Download, 
  Plus, 
  Filter, 
  CalendarCheck, 
  DollarSign,
  Trash,
  Edit,
  AlertTriangle
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';

// Dados de exemplo para a tabela
const studentData = [
  { 
    id: 1, 
    name: "Ana Silva", 
    photo: "https://i.pravatar.cc/150?img=1", 
    attendance: 85, 
    lastPayment: "2024-05-10", 
    status: "Ativo", 
    value: 120, 
    nextPayment: "2024-06-10",
    expanded: false
  },
  { 
    id: 2, 
    name: "Carlos Oliveira", 
    photo: "https://i.pravatar.cc/150?img=2", 
    attendance: 62, 
    lastPayment: "2024-04-05", 
    status: "Atrasado", 
    value: 80, 
    nextPayment: "2024-05-05",
    expanded: false
  },
  { 
    id: 3, 
    name: "Mariana Costa", 
    photo: "https://i.pravatar.cc/150?img=3", 
    attendance: 93, 
    lastPayment: "2024-05-15", 
    status: "Ativo", 
    value: 100, 
    nextPayment: "2024-06-15",
    expanded: false
  },
  { 
    id: 4, 
    name: "Pedro Santos", 
    photo: "https://i.pravatar.cc/150?img=4", 
    attendance: 70, 
    lastPayment: "2024-04-20", 
    status: "Pendente", 
    value: 120, 
    nextPayment: "2024-05-20",
    expanded: false
  },
  { 
    id: 5, 
    name: "Juliana Mendes", 
    photo: "https://i.pravatar.cc/150?img=5", 
    attendance: 95, 
    lastPayment: "2024-01-10", 
    status: "Ativo", 
    value: 1100, 
    nextPayment: "2025-01-10",
    expanded: false
  },
  { 
    id: 6, 
    name: "Roberto Almeida", 
    photo: "https://i.pravatar.cc/150?img=6", 
    attendance: 45, 
    lastPayment: "2024-02-15", 
    status: "Inativo", 
    value: 280, 
    nextPayment: "2024-05-15",
    expanded: false
  },
  { 
    id: 7, 
    name: "Fernanda Lima", 
    photo: "https://i.pravatar.cc/150?img=7", 
    attendance: 88, 
    lastPayment: "2024-05-08", 
    status: "Ativo", 
    value: 100, 
    nextPayment: "2024-06-08",
    expanded: false
  },
];

// Dados de exemplo para o gráfico
const revenueData = [
  { month: 'Jan', value: 22000 },
  { month: 'Fev', value: 24000 },
  { month: 'Mar', value: 26000 },
  { month: 'Abr', value: 25000 },
  { month: 'Mai', value: 28000 },
  { month: 'Jun', value: 30000 },
];

// Dados de exemplo para o gráfico de pagamentos por status
const paymentStatusData = [
  { name: 'Pagos', value: 75 },
  { name: 'Atrasados', value: 15 },
  { name: 'Pendentes', value: 10 },
];

const PlanilhaFaturamento = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    description: '',
    duration_days: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch payment plans on component mount
  useEffect(() => {
    fetchPaymentPlans();
  }, []);

  const fetchPaymentPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPaymentPlans(data || []);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar planos",
        description: "Não foi possível carregar os planos de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para filtrar e ordenar os dados
  const filteredAndSortedData = studentData
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'value') {
        return sortDirection === 'asc' 
          ? a.value - b.value 
          : b.value - a.value;
      }
      return 0;
    });

  // Função para mudar a ordenação
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Função para formatar data
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Função para exportar dados
  const exportData = () => {
    toast({
      title: "Dados exportados",
      description: "Os dados foram exportados com sucesso.",
    });
  };

  // Função para adicionar novo aluno
  const addNewStudent = () => {
    toast({
      title: "Novo aluno",
      description: "Formulário para adicionar novo aluno aberto.",
    });
  };

  // Função para gerenciar pagamento
  const managePayment = (studentId) => {
    toast({
      title: "Gerenciar pagamento",
      description: `Gerenciando pagamento do aluno #${studentId}`,
    });
  };

  // Calcular métricas
  const totalRevenue = studentData.reduce((sum, student) => sum + student.value, 0);
  const activeStudents = studentData.filter(student => student.status === 'Ativo').length;
  const pendingPayments = studentData.filter(student => student.status === 'Atrasado' || student.status === 'Pendente').length;

  // Função para formatar valores como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Customização do tooltip do gráfico
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Fix for TypeScript error - check if payload[0].value is a number before calling toFixed
      const value = payload[0].value;
      const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
      
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-md">
          <p className="text-sm font-medium">{`${payload[0].name}: ${formatCurrency(Number(formattedValue))}`}</p>
        </div>
      );
    }
    return null;
  };

  // Handle creating a new payment plan
  const handleCreatePlan = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!newPlan.name || !newPlan.price || !newPlan.duration_days) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios."
        });
        setIsLoading(false);
        return;
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create new plan
      const { data, error } = await supabase
        .from('payment_plans')
        .insert({
          name: newPlan.name,
          price: parseFloat(newPlan.price),
          description: newPlan.description,
          duration_days: parseInt(newPlan.duration_days),
          academy_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      // Reset form and close dialog
      setNewPlan({
        name: '',
        price: '',
        description: '',
        duration_days: ''
      });
      setShowPlanDialog(false);
      
      // Refresh plans list
      fetchPaymentPlans();
      
      toast({
        title: "Plano criado",
        description: "O plano de pagamento foi criado com sucesso."
      });
    } catch (error) {
      console.error('Error creating payment plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar plano",
        description: error.message || "Não foi possível criar o plano de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a payment plan
  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setNewPlan({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description || '',
      duration_days: plan.duration_days.toString()
    });
    setShowPlanDialog(true);
  };

  // Handle updating a payment plan
  const handleUpdatePlan = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!newPlan.name || !newPlan.price || !newPlan.duration_days) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios."
        });
        setIsLoading(false);
        return;
      }
      
      // Update plan
      const { data, error } = await supabase
        .from('payment_plans')
        .update({
          name: newPlan.name,
          price: parseFloat(newPlan.price),
          description: newPlan.description,
          duration_days: parseInt(newPlan.duration_days),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPlan.id)
        .select();
      
      if (error) throw error;
      
      // Reset form and close dialog
      setNewPlan({
        name: '',
        price: '',
        description: '',
        duration_days: ''
      });
      setSelectedPlan(null);
      setShowPlanDialog(false);
      
      // Refresh plans list
      fetchPaymentPlans();
      
      toast({
        title: "Plano atualizado",
        description: "O plano de pagamento foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating payment plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar plano",
        description: error.message || "Não foi possível atualizar o plano de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a payment plan
  const handleDeletePlan = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', selectedPlan.id);
      
      if (error) throw error;
      
      // Reset and close dialog
      setSelectedPlan(null);
      setShowDeleteDialog(false);
      
      // Refresh plans list
      fetchPaymentPlans();
      
      toast({
        title: "Plano excluído",
        description: "O plano de pagamento foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir plano",
        description: error.message || "Não foi possível excluir o plano de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirming plan deletion
  const confirmDeletePlan = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteDialog(true);
  };

  return (
    <MainLayout
      pageTitle="Planilha e Faturamento"
      pageSubtitle="Gerencie pagamentos e monitore receitas da sua academia"
      headerImage="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    >
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-transparent glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-academy-purple" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-muted-foreground text-sm mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarCheck className="mr-2 h-5 w-5 text-academy-purple" />
              Alunos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-muted-foreground text-sm mt-1">de {studentData.length} alunos</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-academy-red" />
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-muted-foreground text-sm mt-1">Necessitam atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Planos de Pagamento */}
      <Card className="mb-6 bg-transparent glass-morphism">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-academy-purple" />
              Planos de Pagamento
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => {
                setSelectedPlan(null);
                setNewPlan({
                  name: '',
                  price: '',
                  description: '',
                  duration_days: ''
                });
                setShowPlanDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : paymentPlans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum plano de pagamento encontrado</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setSelectedPlan(null);
                  setNewPlan({
                    name: '',
                    price: '',
                    description: '',
                    duration_days: ''
                  });
                  setShowPlanDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Plano
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{plan.name}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => confirmDeletePlan(plan)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xl font-bold mb-1">{formatCurrency(plan.price)}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Duração: {plan.duration_days} dias
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico 1 - Tendência de Receita */}
        <Card className="lg:col-span-2 bg-transparent glass-morphism">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fill: '#f1f1f1' }} />
                <YAxis tick={{ fill: '#f1f1f1' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="Valor"
                  stroke="#9b87f5" 
                  fill="#9b87f550" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico 2 - Status de Pagamentos */}
        <Card className="bg-transparent glass-morphism">
          <CardHeader>
            <CardTitle>Status de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                <XAxis type="number" tick={{ fill: '#f1f1f1' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#f1f1f1' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name="Porcentagem"
                  fill="#9b87f5" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de alunos e pagamentos */}
      <Card className="bg-transparent glass-morphism">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Planilha de Pagamentos</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
              <Button size="sm" onClick={addNewStudent}>
                <Plus className="h-4 w-4 mr-1" />
                Novo Aluno
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, plano ou status..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchTerm('Ativo')}>
                  Somente Ativos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm('Atrasado')}>
                  Somente Atrasados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm('Pendente')}>
                  Somente Pendentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm('')}>
                  Limpar Filtros
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer" 
                      onClick={() => handleSort('name')}
                    >
                      Nome
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Pagamento</TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer" 
                      onClick={() => handleSort('value')}
                    >
                      Valor
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Próximo Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Nenhum aluno encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={student.photo} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.plan}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === 'Ativo' ? 'default' :
                            student.status === 'Atrasado' ? 'destructive' :
                            student.status === 'Pendente' ? 'outline' : 'secondary'
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(student.lastPayment)}</TableCell>
                      <TableCell>{formatCurrency(student.value)}</TableCell>
                      <TableCell>{formatDate(student.nextPayment)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => managePayment(student.id)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Gerenciar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for creating/editing payment plans */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano de Pagamento'}</DialogTitle>
            <DialogDescription>
              {selectedPlan 
                ? 'Edite as informações do plano de pagamento' 
                : 'Preencha as informações para criar um novo plano de pagamento'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome do Plano *</label>
              <Input 
                id="name" 
                value={newPlan.name} 
                onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} 
                placeholder="Ex: Plano Mensal"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Preço (R$) *</label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                min="0" 
                value={newPlan.price} 
                onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} 
                placeholder="Ex: 99.90"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Duração (dias) *</label>
              <Input 
                id="duration" 
                type="number" 
                min="1" 
                value={newPlan.duration_days} 
                onChange={(e) => setNewPlan({...newPlan, duration_days: e.target.value})} 
                placeholder="Ex: 30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Descrição</label>
              <Input 
                id="description" 
                value={newPlan.description} 
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})} 
                placeholder="Ex: Acesso ilimitado por 30 dias"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPlanDialog(false);
                setSelectedPlan(null);
                setNewPlan({
                  name: '',
                  price: '',
                  description: '',
                  duration_days: ''
                });
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={selectedPlan ? handleUpdatePlan : handleCreatePlan}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : selectedPlan ? (
                'Atualizar Plano'
              ) : (
                'Criar Plano'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for deleting plans */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o plano "{selectedPlan?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <p className="font-medium text-red-500">Atenção</p>
              <p className="text-sm">A exclusão deste plano pode afetar alunos que já o utilizam.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedPlan(null);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeletePlan}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                'Excluir Plano'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PlanilhaFaturamento;