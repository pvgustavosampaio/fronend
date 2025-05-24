
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Dados de exemplo para a tabela de alunos
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

// Dados para os gráficos
const revenueData = [
  { month: 'Jan', value: 22000 },
  { month: 'Fev', value: 24000 },
  { month: 'Mar', value: 26000 },
  { month: 'Abr', value: 25000 },
  { month: 'Mai', value: 28000 },
  { month: 'Jun', value: 30000 },
];

const attritionData = [
  { month: 'Jan', actual: 5, predicted: 7 },
  { month: 'Fev', actual: 7, predicted: 6 },
  { month: 'Mar', actual: 4, predicted: 5 },
  { month: 'Abr', actual: 6, predicted: 8 },
  { month: 'Mai', actual: 5, predicted: 7 },
  { month: 'Jun', actual: 6, predicted: 8 },
];

const Pagamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [students, setStudents] = useState(studentData);

  // Calcular métricas
  const activeStudents = studentData.filter(student => student.status === 'Ativo').length;
  const totalRevenue = studentData.reduce((sum, student) => sum + student.value, 0);
  const attritionRisk = 12; // Valor fixo para exemplo
  const averageAttendance = Math.round(studentData.reduce((sum, student) => sum + student.attendance, 0) / studentData.length);

  // Função para filtrar e ordenar os dados
  const getFilteredAndSortedData = () => {
    return students
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
        if (sortBy === 'attendance') {
          return sortDirection === 'asc' 
            ? a.attendance - b.attendance 
            : b.attendance - a.attendance;
        }
        if (sortBy === 'lastPayment') {
          return sortDirection === 'asc' 
            ? new Date(a.lastPayment).getTime() - new Date(b.lastPayment).getTime() 
            : new Date(b.lastPayment).getTime() - new Date(a.lastPayment).getTime();
        }
        return 0;
      });
  };

  // Função para mudar a ordenação
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Função para formatar data
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Função para expandir/colapsar detalhes do aluno
  const toggleExpand = (id: number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, expanded: !student.expanded } : student
    ));
  };

  // Função para exportar dados
  const exportData = () => {
    toast.success('Dados exportados com sucesso');
  };

  // Função para adicionar novo aluno
  const addNewStudent = () => {
    toast.success('Formulário para adicionar novo aluno aberto');
  };

  // Função para enviar notificação
  const sendNotification = (studentId: number) => {
    toast.success(`Notificação enviada para o aluno #${studentId}`);
  };

  // Função para formatar valores como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Customização do tooltip do gráfico
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = typeof value === 'number' ? formatCurrency(value) : value;
      
      return (
        <div className="bg-background/90 backdrop-blur-sm p-3 border border-border rounded-md shadow-md">
          <p className="text-sm font-medium">{`${payload[0].name}: ${formattedValue}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout
      pageTitle="Planilha e Faturamento"
      pageSubtitle="Gerencie pagamentos e monitore receitas da sua academia"
      headerImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    >
      {/* Header com métricas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-background/30 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col">
          <div className="text-sm text-muted-foreground mb-1 flex items-center">
            Alunos Ativos
          </div>
          <div className="text-3xl font-bold text-white animate-pulse">
            {activeStudents}
          </div>
          <div className="text-xs text-white/70 mt-1">
            de {studentData.length} alunos
          </div>
        </div>
        
        <div className="bg-background/30 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col">
          <div className="text-sm text-muted-foreground mb-1 flex items-center">
            Receita do Mês
          </div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="h-8 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData.slice(-5)}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00FF88" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-background/30 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col">
          <div className="text-sm text-muted-foreground mb-1 flex items-center">
            Risco de Evasão
            <AlertTriangle 
              className="ml-2 h-4 w-4 text-amber-500" 
            />
          </div>
          <div className="text-3xl font-bold text-white flex items-center">
            {attritionRisk}%
            <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full flex items-center">
              <span className="text-amber-500">▲</span> 2%
            </span>
          </div>
          <div className="text-xs text-white/70 mt-1">
            Último mês: 10%
          </div>
        </div>
        
        <div className="bg-background/30 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col">
          <div className="text-sm text-muted-foreground mb-1 flex items-center">
            Frequência Média
          </div>
          <div className="text-3xl font-bold text-white">
            {averageAttendance}%
          </div>
          <div className="mt-2">
            <Progress 
              value={averageAttendance} 
              className="h-2 bg-white/20" 
              indicatorClassName="bg-academy-purple"
            />
          </div>
        </div>
      </div>

      {/* Gráfico de tendência de evasão */}
      <div className="mb-6 bg-background/30 backdrop-blur-md border border-white/20 rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">Tendência de Evasão</h2>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={attritionData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" tick={{ fill: '#f1f1f1' }} />
              <YAxis tick={{ fill: '#f1f1f1' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                name="Cancelamentos Reais" 
                type="monotone" 
                dataKey="actual" 
                stroke="#3B82F6" 
                strokeWidth={2}
                activeDot={{ r: 6 }} 
              />
              <Line 
                name="Previsão da IA" 
                type="monotone" 
                dataKey="predicted" 
                stroke="#00FF88" 
                strokeWidth={2} 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de alunos */}
      <div className="bg-background/30 backdrop-blur-md border border-white/20 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Planilha de Pagamentos</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportData} className="bg-background/50">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            <Button 
              size="sm" 
              onClick={addNewStudent}
              className="rounded-full w-8 h-8 p-0 bg-[#00FF88] hover:bg-[#00FF88]/80"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome ou status..." 
              className="bg-background/50 border-white/10 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-background/50">
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

        {/* Tabela */}
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-background/50">
              <TableRow>
                <TableHead className="w-[60px]">Foto</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleSort('name')}
                  >
                    Nome
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleSort('attendance')}
                  >
                    Frequência
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleSort('lastPayment')}
                  >
                    Último Pagamento
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredAndSortedData().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              ) : (
                getFilteredAndSortedData().map((student) => (
                  <React.Fragment key={student.id}>
                    <TableRow 
                      className="transition-colors cursor-pointer hover:bg-white/5"
                      onClick={() => toggleExpand(student.id)}
                    >
                      <TableCell className="p-2">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src={student.photo} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress 
                            value={student.attendance} 
                            className="h-2 w-16 mr-2 bg-white/20"
                            indicatorClassName={
                              student.attendance > 75 ? "bg-green-500" :
                              student.attendance > 50 ? "bg-amber-500" :
                              "bg-red-500"
                            }
                          />
                          <span>{student.attendance}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center">
                        {formatDate(student.lastPayment)}
                        {new Date(student.lastPayment) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="ml-2 h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            student.status === 'Ativo' ? "bg-green-500/20 text-green-500 border-green-500/30" :
                            student.status === 'Atrasado' ? "bg-red-500/20 text-red-500 border-red-500/30" :
                            student.status === 'Pendente' ? "bg-amber-500/20 text-amber-500 border-amber-500/30" :
                            "bg-gray-500/20 text-gray-500 border-gray-500/30"
                          }
                        >
                          {student.status === 'Ativo' && "🟢 "}
                          {student.status === 'Atrasado' && "🔴 "}
                          {student.status === 'Pendente' && "🟠 "}
                          {student.status === 'Inativo' && "⚪ "}
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendNotification(student.id);
                          }}
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          Notificar
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Linha expandida com detalhes */}
                    {student.expanded && (
                      <TableRow className="bg-white/5 border-t-0">
                        <TableCell colSpan={6} className="p-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Valor do Plano</h4>
                              <p>{formatCurrency(student.value)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Próximo Pagamento</h4>
                              <p>{formatDate(student.nextPayment)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Ações Rápidas</h4>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Editar
                                </Button>
                                <Button variant="outline" size="sm">
                                  Histórico
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Botão flutuante para novo aluno em telas pequenas */}
        <Button 
          className="md:hidden fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 bg-[#00FF88] hover:bg-[#00FF88]/80 shadow-lg"
          onClick={addNewStudent}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </MainLayout>
  );
};

export default Pagamentos;
