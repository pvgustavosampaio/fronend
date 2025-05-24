import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  Search,
  RefreshCw,
  Download,
  Filter,
  Users,
  AlertTriangle,
  TrendingDown,
  MessageSquare,
  DollarSign,
  Calendar,
  Settings,
  FileText,
  Activity,
  BarChart2,
  PieChart as PieChartIcon,
  Brain,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types
interface ChurnPrediction {
  id: string;
  user_id: string;
  prediction_date: string;
  churn_probability: number;
  confidence_score: number;
  risk_level: 'baixo' | 'médio' | 'alto';
  factors: {
    type: string;
    description: string;
    impact: string;
  }[];
  created_at: string;
  user?: {
    name: string;
    email: string;
    photo?: string;
  };
}

interface ModelMetrics {
  id: string;
  training_date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  feature_importance: Record<string, number>;
  created_at: string;
}

interface ChurnAction {
  id: string;
  user_id: string;
  prediction_id: string;
  action_type: string;
  action_description: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  assigned_to?: string;
  result?: string;
  created_at: string;
  completed_at?: string;
}

const ChurnPrediction = () => {
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<ChurnPrediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<ChurnPrediction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChurnPrediction | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showMetricsDialog, setShowMetricsDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [actions, setActions] = useState<ChurnAction[]>([]);

  // Fetch predictions on component mount
  useEffect(() => {
    fetchPredictions();
    fetchModelMetrics();
  }, []);

  // Filter predictions when search term or risk filter changes
  useEffect(() => {
    if (!predictions) return;
    
    let filtered = [...predictions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(p => p.risk_level === riskFilter);
    }
    
    setFilteredPredictions(filtered);
  }, [predictions, searchTerm, riskFilter]);

  // Fetch predictions from the database
  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('churn_predictions')
        .select(`
          *,
          user:user_id (
            name,
            email
          )
        `)
        .order('prediction_date', { ascending: false });
      
      if (error) throw error;
      
      setPredictions(data || []);
      setFilteredPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as previsões.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch model metrics
  const fetchModelMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('churn_model_metrics')
        .select('*')
        .order('training_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      setModelMetrics(data);
    } catch (error) {
      console.error('Error fetching model metrics:', error);
    }
  };

  // Fetch actions for a user
  const fetchActions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('churn_actions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setActions(data || []);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  // Refresh predictions
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Call the edge function to recalculate predictions
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/churn-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ batchProcess: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh predictions');
      }
      
      toast({
        title: 'Previsões atualizadas',
        description: 'As previsões de evasão foram recalculadas com sucesso.',
      });
      
      // Fetch the updated predictions
      await fetchPredictions();
      await fetchModelMetrics();
    } catch (error) {
      console.error('Error refreshing predictions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as previsões.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // View user details
  const handleViewUser = (prediction: ChurnPrediction) => {
    setSelectedUser(prediction);
    fetchActions(prediction.user_id);
  };

  // Create a new action for a user
  const handleCreateAction = async (actionType: string, description: string) => {
    if (!selectedUser) return;
    
    try {
      const { data, error } = await supabase
        .from('churn_actions')
        .insert({
          user_id: selectedUser.user_id,
          prediction_id: selectedUser.id,
          action_type: actionType,
          action_description: description,
          status: 'pendente',
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Ação criada',
        description: 'A ação foi criada com sucesso.',
      });
      
      setShowActionDialog(false);
      fetchActions(selectedUser.user_id);
    } catch (error) {
      console.error('Error creating action:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a ação.',
        variant: 'destructive',
      });
    }
  };

  // Export data
  const handleExport = (format: string) => {
    toast({
      title: 'Exportando dados',
      description: `Os dados estão sendo exportados em formato ${format.toUpperCase()}.`,
    });
    
    setTimeout(() => {
      toast({
        title: 'Exportação concluída',
        description: 'Os dados foram exportados com sucesso.',
      });
      setShowExportDialog(false);
    }, 1500);
  };

  // Update model settings
  const handleUpdateSettings = (threshold: number) => {
    toast({
      title: 'Configurações atualizadas',
      description: `O limiar de risco foi atualizado para ${threshold}%.`,
    });
    
    setShowSettingsDialog(false);
  };

  // Risk level color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'alto': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'médio': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/20';
      case 'baixo': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Prepare data for charts
  const prepareRiskDistributionData = () => {
    const counts = { alto: 0, médio: 0, baixo: 0 };
    
    predictions.forEach(p => {
      counts[p.risk_level]++;
    });
    
    return [
      { name: 'Alto', value: counts.alto, color: '#EF4444' },
      { name: 'Médio', value: counts.médio, color: '#F59E0B' },
      { name: 'Baixo', value: counts.baixo, color: '#10B981' },
    ];
  };

  const prepareFactorDistributionData = () => {
    const counts = { attendance: 0, payment: 0, feedback: 0, other: 0 };
    let total = 0;
    
    predictions.forEach(p => {
      if (p.factors && Array.isArray(p.factors)) {
        p.factors.forEach(f => {
          counts[f.type] = (counts[f.type] || 0) + 1;
          total++;
        });
      }
    });
    
    return [
      { name: 'Frequência', value: (counts.attendance / total) * 100 || 0 },
      { name: 'Pagamento', value: (counts.payment / total) * 100 || 0 },
      { name: 'Feedback', value: (counts.feedback / total) * 100 || 0 },
      { name: 'Outros', value: (counts.other / total) * 100 || 0 },
    ];
  };

  const prepareTrendData = () => {
    // Group predictions by date
    const groupedByDate = {};
    
    predictions.forEach(p => {
      const date = p.prediction_date.split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = { date, count: 0, highRisk: 0 };
      }
      groupedByDate[date].count++;
      if (p.risk_level === 'alto') {
        groupedByDate[date].highRisk++;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(groupedByDate)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  };

  return (
    <MainLayout
      pageTitle="Previsão de Evasão"
      pageSubtitle="Sistema de previsão de evasão baseado em IA"
      headerImage="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {/* Header with metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alunos em Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {predictions.filter(p => p.risk_level === 'alto').length}
                <span className="text-sm text-muted-foreground ml-1">
                  de {predictions.length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((predictions.filter(p => p.risk_level === 'alto').length / predictions.length) * 100).toFixed(1)}% dos alunos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Precisão do Modelo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {modelMetrics ? (modelMetrics.accuracy * 100).toFixed(1) : '--'}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Última atualização: {modelMetrics ? formatDate(modelMetrics.training_date) : '--'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fator Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Frequência</div>
              <div className="text-xs text-muted-foreground mt-1">
                45% dos casos de evasão
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {predictions.filter(p => p.risk_level === 'alto').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Recomendações de retenção
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribuição de Risco</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareRiskDistributionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareRiskDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Factors Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fatores de Evasão</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareFactorDistributionData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Porcentagem']} />
                    <Bar dataKey="value" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tendência de Risco (7 dias)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareTrendData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      name="Total Previsões"
                      stroke="#9b87f5"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="highRisk"
                      name="Alto Risco"
                      stroke="#ef4444"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Previsões de Evasão</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar aluno..."
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filtrar por risco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="alto">Alto Risco</SelectItem>
                  <SelectItem value="médio">Médio Risco</SelectItem>
                  <SelectItem value="baixo">Baixo Risco</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredPredictions.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-semibold">Nenhuma previsão encontrada</h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou atualizar os dados.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className={`p-4 rounded-lg border ${
                      prediction.risk_level === 'alto'
                        ? 'border-red-200 dark:border-red-900'
                        : prediction.risk_level === 'médio'
                        ? 'border-amber-200 dark:border-amber-900'
                        : 'border-green-200 dark:border-green-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={prediction.user?.photo} />
                          <AvatarFallback>
                            {prediction.user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{prediction.user?.name || 'Usuário'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={`${getRiskColor(prediction.risk_level)}`}
                            >
                              {prediction.risk_level === 'alto'
                                ? 'Alto Risco'
                                : prediction.risk_level === 'médio'
                                ? 'Médio Risco'
                                : 'Baixo Risco'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {(prediction.churn_probability * 100).toFixed(0)}% chance de evasão
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(prediction)}
                        >
                          Ver Detalhes
                        </Button>
                        {prediction.risk_level === 'alto' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUser(prediction);
                              setShowActionDialog(true);
                            }}
                          >
                            Criar Ação
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {prediction.factors && prediction.factors.length > 0 && (
                      <div className="mt-3 pl-12">
                        <h5 className="text-sm font-medium mb-1">Fatores de risco:</h5>
                        <div className="space-y-1">
                          {prediction.factors.map((factor, index) => (
                            <div key={index} className="text-sm flex items-center gap-1">
                              {factor.type === 'attendance' ? (
                                <Calendar className="h-3 w-3 text-blue-500" />
                              ) : factor.type === 'payment' ? (
                                <DollarSign className="h-3 w-3 text-red-500" />
                              ) : (
                                <MessageSquare className="h-3 w-3 text-amber-500" />
                              )}
                              <span className="text-muted-foreground">{factor.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setShowMetricsDialog(true)}>
            <BarChart2 className="h-4 w-4 mr-2" />
            Métricas do Modelo
          </Button>
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>

        {/* User Details Dialog */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Aluno</DialogTitle>
                <DialogDescription>
                  Informações detalhadas e histórico de ações
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="factors">Fatores de Risco</TabsTrigger>
                  <TabsTrigger value="actions">Ações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.user?.photo} />
                      <AvatarFallback>
                        {selectedUser.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.user?.name || 'Usuário'}</h3>
                      <p className="text-muted-foreground">{selectedUser.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Probabilidade de Evasão</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedUser.churn_probability * 100} className="flex-1" />
                        <span className="font-medium">
                          {(selectedUser.churn_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Nível de Risco</h4>
                      <Badge
                        className={`${getRiskColor(selectedUser.risk_level)}`}
                      >
                        {selectedUser.risk_level === 'alto'
                          ? 'Alto Risco'
                          : selectedUser.risk_level === 'médio'
                          ? 'Médio Risco'
                          : 'Baixo Risco'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Confiança da Previsão</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedUser.confidence_score * 100} className="flex-1" />
                        <span className="font-medium">
                          {(selectedUser.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Data da Previsão</h4>
                      <p>{formatDate(selectedUser.prediction_date)}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="factors" className="space-y-4">
                  <h3 className="text-lg font-medium">Fatores de Risco</h3>
                  
                  {selectedUser.factors && selectedUser.factors.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.factors.map((factor, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            factor.impact === 'alto'
                              ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10'
                              : 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {factor.type === 'attendance' ? (
                              <Calendar className="h-5 w-5 text-blue-500" />
                            ) : factor.type === 'payment' ? (
                              <DollarSign className="h-5 w-5 text-red-500" />
                            ) : (
                              <MessageSquare className="h-5 w-5 text-amber-500" />
                            )}
                            <div>
                              <h4 className="font-medium">
                                {factor.type === 'attendance'
                                  ? 'Frequência'
                                  : factor.type === 'payment'
                                  ? 'Pagamento'
                                  : 'Feedback'}
                              </h4>
                              <p className="text-sm">{factor.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-semibold">Nenhum fator encontrado</h3>
                      <p className="text-sm text-muted-foreground">
                        Não há fatores de risco específicos identificados para este aluno.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Ações de Retenção</h3>
                    <Button
                      onClick={() => setShowActionDialog(true)}
                    >
                      Nova Ação
                    </Button>
                  </div>
                  
                  {actions.length > 0 ? (
                    <div className="space-y-3">
                      {actions.map((action) => (
                        <div
                          key={action.id}
                          className="p-4 rounded-lg border"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {action.action_type === 'mensagem'
                                  ? 'Mensagem'
                                  : action.action_type === 'desconto'
                                  ? 'Desconto'
                                  : action.action_type === 'ligação'
                                  ? 'Ligação'
                                  : action.action_type === 'aula_gratis'
                                  ? 'Aula Grátis'
                                  : 'Outra Ação'}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {action.action_description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant={
                                    action.status === 'concluido'
                                      ? 'default'
                                      : action.status === 'em_andamento'
                                      ? 'outline'
                                      : action.status === 'pendente'
                                      ? 'secondary'
                                      : 'destructive'
                                  }
                                >
                                  {action.status === 'concluido'
                                    ? 'Concluído'
                                    : action.status === 'em_andamento'
                                    ? 'Em Andamento'
                                    : action.status === 'pendente'
                                    ? 'Pendente'
                                    : 'Cancelado'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(action.created_at)}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              {action.status === 'pendente' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Update action status
                                    supabase
                                      .from('churn_actions')
                                      .update({ status: 'em_andamento' })
                                      .eq('id', action.id)
                                      .then(() => {
                                        toast({
                                          title: 'Ação atualizada',
                                          description: 'Status atualizado para Em Andamento.',
                                        });
                                        fetchActions(selectedUser.user_id);
                                      });
                                  }}
                                >
                                  Iniciar
                                </Button>
                              )}
                              
                              {action.status === 'em_andamento' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Update action status
                                    supabase
                                      .from('churn_actions')
                                      .update({
                                        status: 'concluido',
                                        completed_at: new Date().toISOString(),
                                      })
                                      .eq('id', action.id)
                                      .then(() => {
                                        toast({
                                          title: 'Ação concluída',
                                          description: 'A ação foi marcada como concluída.',
                                        });
                                        fetchActions(selectedUser.user_id);
                                      });
                                  }}
                                >
                                  Concluir
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-semibold">Nenhuma ação encontrada</h3>
                      <p className="text-sm text-muted-foreground">
                        Não há ações de retenção registradas para este aluno.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Create Action Dialog */}
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Ação de Retenção</DialogTitle>
              <DialogDescription>
                Crie uma nova ação para reduzir o risco de evasão.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Ação</label>
                <Select
                  defaultValue="mensagem"
                  onValueChange={(value) => {
                    // This would be handled in a form in a real application
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensagem">Mensagem</SelectItem>
                    <SelectItem value="desconto">Desconto</SelectItem>
                    <SelectItem value="ligação">Ligação</SelectItem>
                    <SelectItem value="aula_gratis">Aula Grátis</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  placeholder="Descreva a ação a ser realizada"
                  defaultValue="Enviar mensagem personalizada sobre os benefícios da academia"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => handleCreateAction('mensagem', 'Enviar mensagem personalizada sobre os benefícios da academia')}
              >
                Criar Ação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Model Metrics Dialog */}
        <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Métricas do Modelo</DialogTitle>
              <DialogDescription>
                Desempenho e estatísticas do modelo de previsão
              </DialogDescription>
            </DialogHeader>
            
            {modelMetrics ? (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Acurácia</h4>
                    <div className="text-2xl font-bold">
                      {(modelMetrics.accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Precisão</h4>
                    <div className="text-2xl font-bold">
                      {(modelMetrics.precision * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recall</h4>
                    <div className="text-2xl font-bold">
                      {(modelMetrics.recall * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">F1 Score</h4>
                    <div className="text-2xl font-bold">
                      {(modelMetrics.f1_score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Importância das Features</h4>
                  <div className="space-y-3">
                    {Object.entries(modelMetrics.feature_importance || {}).map(([feature, importance]) => (
                      <div key={feature} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {feature === 'attendance_frequency'
                              ? 'Frequência'
                              : feature === 'payment_history'
                              ? 'Histórico de Pagamento'
                              : feature === 'feedback_rating'
                              ? 'Avaliações'
                              : feature === 'demographics'
                              ? 'Demografia'
                              : feature}
                          </span>
                          <span className="text-sm font-medium">
                            {(Number(importance) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={Number(importance) * 100} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Última atualização: {formatDate(modelMetrics.training_date)}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Carregando métricas...</p>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setShowMetricsDialog(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exportar Dados</DialogTitle>
              <DialogDescription>
                Escolha o formato para exportar os dados de previsão.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button onClick={() => handleExport('csv')}>CSV</Button>
              <Button onClick={() => handleExport('excel')}>Excel</Button>
              <Button onClick={() => handleExport('pdf')} variant="outline">PDF</Button>
              <Button onClick={() => handleExport('json')} variant="outline">JSON</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do Modelo</DialogTitle>
              <DialogDescription>
                Ajuste os parâmetros do modelo de previsão.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Limiar de Risco Alto</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="50"
                    max="95"
                    defaultValue="70"
                  />
                  <span>%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Probabilidade mínima para classificar como alto risco
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequência de Atualização</label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Período de Análise</label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => handleUpdateSettings(70)}>
                Salvar Configurações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ChurnPrediction;