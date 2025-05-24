
import React, { useState } from 'react';
import { Search, Plus, FileUp, Camera, BarChart2, Heart, Filter, Edit } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados de exemplo para os clientes
const clientsData = [
  { 
    id: 1, 
    name: 'Ana Silva', 
    photo: 'https://i.pravatar.cc/150?img=1', 
    status: 'Ativo', 
    planDays: 15, 
    lastLog: '3 dias sem registro', 
    dietType: 'Hipertrofia', 
    restrictions: ['Glúten']
  },
  { 
    id: 2, 
    name: 'Carlos Santos', 
    photo: 'https://i.pravatar.cc/150?img=8', 
    status: 'Vencido', 
    planDays: 0, 
    lastLog: '7 dias sem registro', 
    dietType: 'Emagrecimento', 
    restrictions: ['Lactose', 'Açúcar']
  },
  { 
    id: 3, 
    name: 'Mariana Lima', 
    photo: 'https://i.pravatar.cc/150?img=5', 
    status: 'Ativo', 
    planDays: 27, 
    lastLog: 'Hoje', 
    dietType: 'Manutenção', 
    restrictions: []
  },
  { 
    id: 4, 
    name: 'Paulo Mendes', 
    photo: 'https://i.pravatar.cc/150?img=12', 
    status: 'Ativo', 
    planDays: 8, 
    lastLog: 'Ontem', 
    dietType: 'Low Carb', 
    restrictions: ['Vegano']
  },
  { 
    id: 5, 
    name: 'Juliana Costa', 
    photo: 'https://i.pravatar.cc/150?img=9', 
    status: 'Ativo', 
    planDays: 21, 
    lastLog: '2 dias sem registro', 
    dietType: 'Cetogênica', 
    restrictions: ['Amendoim', 'Frutos do Mar']
  },
];

// Dados de exemplo para os alimentos
const foodLibrary = [
  { id: 1, name: 'Omelete', calories: 320, protein: 20, carbs: 2, fat: 24, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { id: 2, name: 'Salada Verde', calories: 120, protein: 3, carbs: 10, fat: 7, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { id: 3, name: 'Frango Grelhado', calories: 220, protein: 32, carbs: 0, fat: 10, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { id: 4, name: 'Shake Proteico', calories: 150, protein: 24, carbs: 5, fat: 2, image: 'https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { id: 5, name: 'Salada de Frutas', calories: 95, protein: 1, carbs: 22, fat: 0, image: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { id: 6, name: 'Arroz Integral', calories: 110, protein: 2.5, carbs: 23, fat: 1, image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
];

// Dados de exemplo para o plano alimentar
const mealPlan = [
  { time: '07:00', meal: 'Café da manhã', food: 'Omelete', calories: 320, protein: 20, carbs: 2, fat: 24, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { time: '10:00', meal: 'Lanche da manhã', food: 'Shake Proteico', calories: 150, protein: 24, carbs: 5, fat: 2, image: 'https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { time: '12:30', meal: 'Almoço', food: 'Frango com Salada Verde', calories: 340, protein: 35, carbs: 10, fat: 17, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { time: '16:00', meal: 'Lanche da tarde', food: 'Salada de Frutas', calories: 95, protein: 1, carbs: 22, fat: 0, image: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
  { time: '19:30', meal: 'Jantar', food: 'Frango Grelhado com Arroz Integral', calories: 330, protein: 34, carbs: 23, fat: 11, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80' },
];

// Dados de exemplo para o gráfico
const adherenceData = [
  {
    name: 'Seg',
    real: 90,
    meta: 100,
  },
  {
    name: 'Ter',
    real: 85,
    meta: 100,
  },
  {
    name: 'Qua',
    real: 95,
    meta: 100,
  },
  {
    name: 'Qui',
    real: 78,
    meta: 100,
  },
  {
    name: 'Sex',
    real: 88,
    meta: 100,
  },
  {
    name: 'Sáb',
    real: 70,
    meta: 100,
  },
  {
    name: 'Dom',
    real: 65,
    meta: 100,
  },
];

// Configuração personalizada do tooltip para o gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-md">
        <p className="text-sm font-semibold">{`${label}`}</p>
        <p className="text-xs text-academy-green">{`Meta: ${payload[0].payload.meta}%`}</p>
        <p className="text-xs text-academy-purple">{`Real: ${payload[0].payload.real}%`}</p>
      </div>
    );
  }

  return null;
};

const Nutricao = () => {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClient, setActiveClient] = useState(clientsData[0]);
  const [activeTab, setActiveTab] = useState('plano');
  const { toast } = useToast();

  // Filtrar clientes com base na busca
  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.dietType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções de ação
  const handleNewPlan = () => {
    toast({
      title: "Novo plano alimentar",
      description: "Criando novo plano para " + activeClient.name,
    });
  };

  const handleExportPlan = () => {
    toast({
      title: "Plano exportado",
      description: "Plano alimentar enviado para o nutricionista",
    });
  };

  const handleScanFood = () => {
    toast({
      title: "Scanner ativado",
      description: "Aponte a câmera para um alimento",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Relatório semanal de nutrição disponível",
    });
  };

  // Calcular totais nutricionais do dia
  const dailyTotals = mealPlan.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Função para renovar plano
  const handleRenewPlan = (clientId: number) => {
    toast({
      title: "Plano renovado",
      description: `Plano do cliente #${clientId} renovado com sucesso`,
    });
  };

  // Função para editar refeição
  const handleEditMeal = (time: string) => {
    toast({
      title: "Editar refeição",
      description: `Editando refeição das ${time}`,
    });
  };

  return (
    <MainLayout
      pageTitle="Nutrição"
      pageSubtitle="Gerencie planos alimentares e acompanhe a evolução nutricional dos alunos"
      headerImage="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seção esquerda - Lista de clientes */}
        <div className="md:col-span-1">
          <Card className="bg-black border-white/10 overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Clientes</CardTitle>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar cliente ou dieta..." 
                  className="pl-10 bg-secondary" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3 mb-2">
                <Button variant="outline" size="sm" className="text-xs flex-1">Todos</Button>
                <Button variant="outline" size="sm" className="text-xs flex-1" onClick={() => setSearchTerm('Vegano')}>Veganos</Button>
                <Button variant="outline" size="sm" className="text-xs flex-1" onClick={() => setSearchTerm('Dia')}>Diabéticos</Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {filteredClients.map((client) => (
                  <div 
                    key={client.id}
                    className={`p-3 rounded-lg transition-all cursor-pointer ${
                      activeClient.id === client.id ? 'bg-academy-purple/30 border border-academy-purple/50' : 'bg-secondary/20 hover:bg-secondary/40 border border-transparent'
                    }`}
                    onClick={() => setActiveClient(client)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={client.photo} alt={client.name} />
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{client.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge 
                              variant={client.status === 'Ativo' ? 'default' : 'destructive'}
                              className="text-[10px] h-5"
                            >
                              {client.status === 'Ativo' ? `${client.planDays} dias` : 'Vencido'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{client.dietType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {client.lastLog.includes('sem') ? (
                          <span className="text-academy-red">{client.lastLog}</span>
                        ) : (
                          client.lastLog
                        )}
                      </span>
                      {client.status !== 'Ativo' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleRenewPlan(client.id)}
                        >
                          Renovar Plano
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção direita - Conteúdo dinâmico */}
        <div className="md:col-span-2">
          {/* Informações do cliente ativo */}
          <Card className="mb-6 glass-morphism">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-academy-purple">
                    <AvatarImage src={activeClient.photo} />
                    <AvatarFallback>{activeClient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{activeClient.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{activeClient.dietType}</span>
                      {activeClient.restrictions.length > 0 && (
                        <div className="flex items-center gap-1">
                          {activeClient.restrictions.map((restriction, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {restriction}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Adesão</div>
                  <div className="text-2xl font-bold text-academy-green">78%</div>
                  <div className="text-xs text-academy-green">▲2% vs semana passada</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas-chave */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-black border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Adesão Geral</p>
                    <p className="text-xl font-bold">78% <span className="text-xs text-academy-green">▲2%</span></p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-academy-purple/20 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-academy-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Déficit Comum</p>
                    <p className="text-xl font-bold">Proteína <span className="text-xs text-academy-red">23%↓</span></p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-academy-red/20 flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 text-academy-red" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Meta Atingida</p>
                    <p className="text-xl font-bold">45 <span className="text-xs">clientes</span></p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-academy-green/20 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-academy-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo via Tabs */}
          <Tabs 
            defaultValue="plano" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="bg-black border border-white/10 rounded-lg p-4"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="plano">Plano Alimentar</TabsTrigger>
              <TabsTrigger value="grafico">Adesão</TabsTrigger>
              <TabsTrigger value="alimentos">Alimentos</TabsTrigger>
            </TabsList>

            {/* Tab - Plano Alimentar */}
            <TabsContent value="plano" className="mt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Plano Alimentar</h3>
                  <div className="text-sm text-muted-foreground">
                    Total: {dailyTotals.calories} kcal | Proteína: {dailyTotals.protein}g
                  </div>
                </div>

                {/* Linha do Tempo de Refeições */}
                <div className="space-y-4">
                  {mealPlan.map((meal, index) => (
                    <div key={index} className="flex gap-4 items-center p-4 rounded-lg bg-black border border-white/10 hover:border-academy-purple/50 transition-all">
                      <div className="text-center min-w-[60px]">
                        <div className="text-xl font-bold">{meal.time}</div>
                        <div className="text-xs text-muted-foreground">{meal.meal}</div>
                      </div>
                      
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                        <img 
                          src={meal.image} 
                          alt={meal.food} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">{meal.food}</div>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{meal.calories} kcal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>G: {meal.fat}g</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditMeal(meal.time)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Tab - Gráfico de Adesão */}
            <TabsContent value="grafico" className="mt-2 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" tick={{ fill: '#f1f1f1' }} />
                  <YAxis tick={{ fill: '#f1f1f1' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#00FF88" 
                    strokeWidth={2} 
                    dot={false} 
                    strokeDasharray="5 5" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="real" 
                    stroke="#9b87f5" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            {/* Tab - Biblioteca de Alimentos */}
            <TabsContent value="alimentos" className="mt-2">
              <div className="grid grid-cols-2 gap-4">
                {foodLibrary.map((food) => (
                  <div key={food.id} className="flex items-center gap-3 p-3 rounded-lg bg-black border border-white/10 hover:border-academy-purple/50 transition-all cursor-move">
                    <div className="flex-shrink-0 h-14 w-14 rounded-md overflow-hidden">
                      <img 
                        src={food.image} 
                        alt={food.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{food.calories} kcal</span>
                        <span>P: {food.protein}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Barra de ações rápidas - Flutuante na parte inferior */}
          <div className="fixed bottom-6 right-6 flex gap-2 z-10">
            <Button 
              size="sm" 
              className="h-12 w-12 rounded-full shadow-lg bg-academy-purple hover:bg-academy-purple/90"
              onClick={handleNewPlan}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              className="h-12 w-12 rounded-full shadow-lg bg-academy-green hover:bg-academy-green/90"
              onClick={handleExportPlan}
            >
              <FileUp className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              className="h-12 w-12 rounded-full shadow-lg bg-academy-blue hover:bg-academy-blue/90"
              onClick={handleScanFood}
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              className="h-12 w-12 rounded-full shadow-lg bg-academy-orange hover:bg-academy-orange/90"
              onClick={handleGenerateReport}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Nutricao;
