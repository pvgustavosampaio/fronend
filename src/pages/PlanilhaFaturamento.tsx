
import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  Download, 
  Plus, 
  Filter, 
  CalendarCheck, 
  DollarSign 
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

// Dados de exemplo para a tabela
const studentData = [
  { 
    id: 1, 
    name: "Ana Silva", 
    photo: "https://i.pravatar.cc/150?img=1", 
    plan: "Premium", 
    status: "Ativo", 
    lastPayment: "2024-05-10", 
    value: 120, 
    nextPayment: "2024-06-10" 
  },
  { 
    id: 2, 
    name: "Carlos Oliveira", 
    photo: "https://i.pravatar.cc/150?img=2", 
    plan: "Básico", 
    status: "Atrasado", 
    lastPayment: "2024-04-05", 
    value: 80, 
    nextPayment: "2024-05-05" 
  },
  { 
    id: 3, 
    name: "Mariana Costa", 
    photo: "https://i.pravatar.cc/150?img=3", 
    plan: "Mensal", 
    status: "Ativo", 
    lastPayment: "2024-05-15", 
    value: 100, 
    nextPayment: "2024-06-15" 
  },
  { 
    id: 4, 
    name: "Pedro Santos", 
    photo: "https://i.pravatar.cc/150?img=4", 
    plan: "Premium", 
    status: "Pendente", 
    lastPayment: "2024-04-20", 
    value: 120, 
    nextPayment: "2024-05-20" 
  },
  { 
    id: 5, 
    name: "Juliana Mendes", 
    photo: "https://i.pravatar.cc/150?img=5", 
    plan: "Anual", 
    status: "Ativo", 
    lastPayment: "2024-01-10", 
    value: 1100, 
    nextPayment: "2025-01-10" 
  },
  { 
    id: 6, 
    name: "Roberto Almeida", 
    photo: "https://i.pravatar.cc/150?img=6", 
    plan: "Trimestral", 
    status: "Inativo", 
    lastPayment: "2024-02-15", 
    value: 280, 
    nextPayment: "2024-05-15" 
  },
  { 
    id: 7, 
    name: "Fernanda Lima", 
    photo: "https://i.pravatar.cc/150?img=7", 
    plan: "Mensal", 
    status: "Ativo", 
    lastPayment: "2024-05-08", 
    value: 100, 
    nextPayment: "2024-06-08" 
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
  { month: 'Jul', value: 32000 },
  { month: 'Ago', value: 31000 },
  { month: 'Set', value: 33000 },
  { month: 'Out', value: 35000 },
  { month: 'Nov', value: 37000 },
  { month: 'Dez', value: 40000 },
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
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // Função para filtrar e ordenar os dados
  const filteredAndSortedData = studentData
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const managePayment = (studentId: number) => {
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Customização do tooltip do gráfico
  const CustomTooltip = ({ active, payload }: any) => {
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
    </MainLayout>
  );
};

export default PlanilhaFaturamento;
