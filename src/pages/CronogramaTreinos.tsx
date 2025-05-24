
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, BarChart, Repeat, Target, ArrowRight, Edit, Trash, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

// Tipos
interface Treino {
  id: string;
  nome: string;
  instrutor: string;
  vagas: number;
  ocupacao: number;
  horario: string;
  dia: string;
  tipo: string;
  status: 'normal' | 'alerta' | 'critico';
}

interface DiaDaSemana {
  codigo: string;
  nome: string;
  diaNum: number;
}

// Dados iniciais
const diasDaSemana: DiaDaSemana[] = [
  { codigo: 'seg', nome: 'Seg', diaNum: 21 },
  { codigo: 'ter', nome: 'Ter', diaNum: 22 },
  { codigo: 'qua', nome: 'Qua', diaNum: 23 },
  { codigo: 'qui', nome: 'Qui', diaNum: 24 },
  { codigo: 'sex', nome: 'Sex', diaNum: 25 },
  { codigo: 'sab', nome: 'Sáb', diaNum: 26 },
  { codigo: 'dom', nome: 'Dom', diaNum: 27 },
];

const dadosIniciais: Treino[] = [
  { 
    id: '1', 
    nome: 'Spinning', 
    instrutor: 'Ricardo', 
    vagas: 20, 
    ocupacao: 12, 
    horario: '07:00', 
    dia: 'seg', 
    tipo: 'cardio',
    status: 'alerta' 
  },
  { 
    id: '2', 
    nome: 'Musculação', 
    instrutor: 'Ana', 
    vagas: 15, 
    ocupacao: 8, 
    horario: '07:00', 
    dia: 'ter', 
    tipo: 'força',
    status: 'normal' 
  },
  { 
    id: '3', 
    nome: 'Yoga', 
    instrutor: 'Paula', 
    vagas: 20, 
    ocupacao: 15, 
    horario: '08:00', 
    dia: 'ter', 
    tipo: 'flexibilidade',
    status: 'normal' 
  },
  { 
    id: '4', 
    nome: 'Funcional', 
    instrutor: 'Marcos', 
    vagas: 15, 
    ocupacao: 10, 
    horario: '08:00', 
    dia: 'qua', 
    tipo: 'resistência',
    status: 'normal' 
  },
  { 
    id: '5', 
    nome: 'Boxe', 
    instrutor: 'Carlos', 
    vagas: 12, 
    ocupacao: 7, 
    horario: '18:00', 
    dia: 'seg', 
    tipo: 'combate',
    status: 'normal' 
  },
  { 
    id: '6', 
    nome: 'Dança', 
    instrutor: 'Juliana', 
    vagas: 25, 
    ocupacao: 18, 
    horario: '18:00', 
    dia: 'qua', 
    tipo: 'ritmo',
    status: 'critico' 
  }
];

// Dados para o gráfico de ocupação por dia
const dadosGraficoOcupacao = [
  { dia: 'Seg', ocupacao: 78, meta: 85 },
  { dia: 'Ter', ocupacao: 82, meta: 85 },
  { dia: 'Qua', ocupacao: 65, meta: 85 },
  { dia: 'Qui', ocupacao: 90, meta: 85 },
  { dia: 'Sex', ocupacao: 85, meta: 85 },
  { dia: 'Sáb', ocupacao: 72, meta: 85 },
  { dia: 'Dom', ocupacao: 60, meta: 85 },
];

const horariosDisponiveis = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

// Componente principal
const CronogramaTreinos = () => {
  const [treinos, setTreinos] = useState<Treino[]>(dadosIniciais);
  const [diaAtual, setDiaAtual] = useState<string>('seg');
  const [modalNovoTreino, setModalNovoTreino] = useState(false);
  const [modalDetalhesTreino, setModalDetalhesTreino] = useState(false);
  const [treinoAtual, setTreinoAtual] = useState<Treino | null>(null);
  const [novoTreino, setNovoTreino] = useState({
    nome: '',
    instrutor: '',
    vagas: 15,
    horario: '08:00',
    dia: 'seg',
    tipo: 'cardio'
  });
  
  // Efeito visual para mostrar notificação de atualização
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Dados sincronizados",
        description: "Cronograma atualizado com sucesso"
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Manipuladores de eventos
  const handleSelecionarDia = (dia: string) => {
    setDiaAtual(dia);
  };

  const handleAbrirModalNovoTreino = () => {
    setModalNovoTreino(true);
  };

  const handleSalvarNovoTreino = () => {
    const novoId = (treinos.length + 1).toString();
    const novoTreinoCompleto: Treino = {
      ...novoTreino,
      id: novoId,
      ocupacao: 0,
      status: 'normal'
    };
    
    setTreinos([...treinos, novoTreinoCompleto]);
    setModalNovoTreino(false);
    
    // Resetar o formulário
    setNovoTreino({
      nome: '',
      instrutor: '',
      vagas: 15,
      horario: '08:00',
      dia: 'seg',
      tipo: 'cardio'
    });
    
    toast({
      title: "Treino adicionado",
      description: `${novoTreino.nome} adicionado ao cronograma com sucesso.`
    });
  };

  const handleVerDetalhesTreino = (treino: Treino) => {
    setTreinoAtual(treino);
    setModalDetalhesTreino(true);
  };
  
  const handleExcluirTreino = (id: string) => {
    setTreinos(treinos.filter(t => t.id !== id));
    setModalDetalhesTreino(false);
    
    toast({
      title: "Treino removido",
      description: "O treino foi removido do cronograma."
    });
  };
  
  const handlePromoverTreino = (id: string) => {
    toast({
      title: "Promoção enviada",
      description: "A promoção foi enviada para 30 alunos potenciais."
    });
    setModalDetalhesTreino(false);
  };
  
  // Funções auxiliares para renderização
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critico':
        return 'bg-red-500/20 border-red-500/40 text-red-700';
      case 'alerta':
        return 'bg-orange-500/20 border-orange-500/40 text-orange-700';
      default:
        return 'bg-green-500/20 border-green-500/40 text-green-700';
    }
  };
  
  // Renderização principal
  return (
    <MainLayout
      pageTitle="Cronograma de Treinos"
      pageSubtitle="Gerencie todas as aulas e turmas da academia"
      headerImage="https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=2000&q=80"
    >
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navegador de dias da semana */}
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            className="flex space-x-1 overflow-x-auto p-1 bg-secondary/30 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {diasDaSemana.map((dia) => (
              <motion.button
                key={dia.codigo}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  diaAtual === dia.codigo 
                    ? 'bg-academy-purple text-white shadow-lg shadow-academy-purple/20' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                onClick={() => handleSelecionarDia(dia.codigo)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {dia.nome} {dia.diaNum}
              </motion.button>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Button onClick={handleAbrirModalNovoTreino} className="bg-academy-purple">
              <Plus className="mr-1 h-4 w-4" />
              Nova Turma
            </Button>
          </motion.div>
        </div>
        
        {/* Container principal com duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Grade de horários */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Próxima Aula Crítica */}
            <motion.div
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="flex gap-4 items-start">
                <div className="bg-red-500 rounded-full p-2 mt-1">
                  <AlertCircle className="text-white h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="text-red-600 font-semibold"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      PRÓXIMA AULA CRÍTICA:
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-bold">Dança - 18h (Quarta-feira)</h3>
                  <div className="text-sm text-gray-600 mt-1">↓30% frequência vs última semana</div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm">Sugestão:</span>
                    <span className="text-sm font-medium">Oferecer aula experimental grátis</span>
                  </div>
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handlePromoverTreino('6')}
                    >
                      Promover Aula
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Grade de horários */}
            <motion.div 
              className="bg-background border border-border rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-academy-purple" />
                  <h2 className="text-lg font-medium">Grade Semanal</h2>
                </div>
              </div>
              
              <div className="p-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 text-muted-foreground font-medium">Hora</th>
                      {diasDaSemana.map(dia => (
                        <th 
                          key={dia.codigo} 
                          className={`pb-3 text-muted-foreground font-medium ${diaAtual === dia.codigo ? 'text-academy-purple' : ''}`}
                        >
                          {dia.nome}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {horariosDisponiveis.map(horario => (
                      <tr key={horario} className="border-t border-border">
                        <td className="py-3 pr-4 font-medium text-sm">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {horario}
                          </div>
                        </td>
                        {diasDaSemana.map(dia => {
                          const treinoNesteCelula = treinos.find(
                            t => t.horario === horario && t.dia === dia.codigo
                          );
                          
                          return (
                            <td key={`${horario}-${dia.codigo}`} className="py-2 px-1">
                              {treinoNesteCelula ? (
                                <motion.div
                                  className={`p-2 rounded-lg border ${getStatusColor(treinoNesteCelula.status)} cursor-pointer`}
                                  onClick={() => handleVerDetalhesTreino(treinoNesteCelula)}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <div className="font-medium text-sm">{treinoNesteCelula.nome}</div>
                                  <div className="text-xs mt-1 flex items-center justify-between">
                                    <span>
                                      {treinoNesteCelula.ocupacao}/{treinoNesteCelula.vagas}
                                    </span>
                                    <span>
                                      {Math.round(treinoNesteCelula.ocupacao / treinoNesteCelula.vagas * 100)}%
                                    </span>
                                  </div>
                                  <div className="mt-1 w-full bg-secondary/70 rounded-full h-1.5">
                                    <motion.div
                                      className="bg-academy-purple h-1.5 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: `${Math.round(treinoNesteCelula.ocupacao / treinoNesteCelula.vagas * 100)}%` 
                                      }}
                                      transition={{ delay: 0.7, duration: 1 }}
                                    />
                                  </div>
                                </motion.div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
          
          {/* Coluna lateral - Estatísticas e ferramentas */}
          <div className="space-y-6">
            {/* Ocupação semanal */}
            <motion.div 
              className="bg-background border border-border rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-academy-purple" />
                  <h2 className="text-lg font-medium">Ocupação Semanal</h2>
                </div>
              </div>
              
              <div className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={dadosGraficoOcupacao}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="dia" axisLine={false} tickLine={false} />
                      <YAxis 
                        axisLine={false}
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                      />
                      <Bar 
                        dataKey="ocupacao" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={40}
                      >
                        {dadosGraficoOcupacao.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.ocupacao >= entry.meta ? '#10B981' : '#9b87f5'}
                          />
                        ))}
                      </Bar>
                      {/* Linha de meta */}
                      <line
                        x1="0%"
                        y1="15%"
                        x2="100%"
                        y2="15%"
                        stroke="#FF9500"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <div className="h-3 w-3 rounded-full bg-academy-purple mr-1" />
                    <span>Ocupação</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#FF9500] mr-1" />
                    <span>Meta (85%)</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Ferramentas rápidas */}
            <motion.div 
              className="bg-background border border-border rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="p-4 border-b bg-muted/30">
                <h2 className="text-lg font-medium">Ferramentas Rápidas</h2>
              </div>
              
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button 
                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                        whileHover={{ y: -2, backgroundColor: 'rgba(0,0,0,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          toast({
                            title: "Replicando cronograma",
                            description: "O cronograma atual foi replicado para a próxima semana."
                          })
                        }}
                      >
                        <Repeat className="h-6 w-6 mb-2 text-academy-purple" />
                        <span className="text-sm font-medium">Replicar Semana</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Replica o cronograma atual para a próxima semana</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button 
                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                        whileHover={{ y: -2, backgroundColor: 'rgba(0,0,0,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          toast({
                            title: "Relatório gerado",
                            description: "O relatório de ocupação foi exportado com sucesso."
                          })
                        }}
                      >
                        <BarChart className="h-6 w-6 mb-2 text-academy-purple" />
                        <span className="text-sm font-medium">Relatório de Ocupação</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exportar relatório detalhado de ocupação das turmas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button 
                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                        whileHover={{ y: -2, backgroundColor: 'rgba(0,0,0,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          toast({
                            title: "Meta atualizada",
                            description: "A meta de ocupação foi atualizada para 90%."
                          })
                        }}
                      >
                        <Target className="h-6 w-6 mb-2 text-academy-purple" />
                        <span className="text-sm font-medium">Meta Semanal (85%)</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Definir meta de ocupação para as turmas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button 
                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                        whileHover={{ y: -2, backgroundColor: 'rgba(0,0,0,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAbrirModalNovoTreino}
                      >
                        <Plus className="h-6 w-6 mb-2 text-academy-purple" />
                        <span className="text-sm font-medium">Nova Turma</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Criar nova turma no cronograma</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
            
            {/* Estatísticas */}
            <motion.div 
              className="bg-background border border-border rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ocupação Média:</span>
                    <motion.span 
                      className="font-medium text-green-500"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      78%
                    </motion.span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Turma com menos adesão:</span>
                    <motion.span 
                      className="font-medium text-orange-500"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      Spinning (12/20)
                    </motion.span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Meta vs. semana passada:</span>
                    <motion.span 
                      className="font-medium text-academy-purple"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      +7%
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Modal - Novo treino */}
      <Dialog open={modalNovoTreino} onOpenChange={setModalNovoTreino}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Turma</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={novoTreino.nome}
                onChange={(e) => setNovoTreino({...novoTreino, nome: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instrutor" className="text-right">
                Instrutor
              </Label>
              <Input
                id="instrutor"
                value={novoTreino.instrutor}
                onChange={(e) => setNovoTreino({...novoTreino, instrutor: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vagas" className="text-right">
                Vagas
              </Label>
              <Input
                id="vagas"
                type="number"
                value={novoTreino.vagas}
                onChange={(e) => setNovoTreino({...novoTreino, vagas: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horario" className="text-right">
                Horário
              </Label>
              <select
                id="horario"
                value={novoTreino.horario}
                onChange={(e) => setNovoTreino({...novoTreino, horario: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {horariosDisponiveis.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dia" className="text-right">
                Dia
              </Label>
              <select
                id="dia"
                value={novoTreino.dia}
                onChange={(e) => setNovoTreino({...novoTreino, dia: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {diasDaSemana.map(d => (
                  <option key={d.codigo} value={d.codigo}>{d.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <select
                id="tipo"
                value={novoTreino.tipo}
                onChange={(e) => setNovoTreino({...novoTreino, tipo: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="cardio">Cardio</option>
                <option value="força">Força</option>
                <option value="flexibilidade">Flexibilidade</option>
                <option value="resistência">Resistência</option>
                <option value="combate">Combate</option>
                <option value="ritmo">Ritmo</option>
              </select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setModalNovoTreino(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSalvarNovoTreino}
              className="bg-academy-purple"
            >
              Adicionar Turma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal - Detalhes do treino */}
      <Dialog open={modalDetalhesTreino} onOpenChange={setModalDetalhesTreino}>
        <DialogContent className="sm:max-w-md">
          {treinoAtual && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    treinoAtual.status === 'critico' ? 'bg-red-500' : 
                    treinoAtual.status === 'alerta' ? 'bg-orange-500' : 
                    'bg-green-500'
                  }`}></span>
                  {treinoAtual.nome}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Instrutor</div>
                    <div className="font-medium">{treinoAtual.instrutor}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Horário</div>
                    <div className="font-medium">
                      {treinoAtual.horario} ({
                        diasDaSemana.find(d => d.codigo === treinoAtual.dia)?.nome
                      })
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Ocupação</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {treinoAtual.ocupacao} de {treinoAtual.vagas} vagas
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(treinoAtual.ocupacao / treinoAtual.vagas * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        treinoAtual.status === 'critico' ? 'bg-red-500' : 
                        treinoAtual.status === 'alerta' ? 'bg-orange-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.round(treinoAtual.ocupacao / treinoAtual.vagas * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <div className="bg-muted/30 px-3 py-1 rounded-full text-xs">
                    {treinoAtual.tipo}
                  </div>
                  {treinoAtual.status === 'critico' && (
                    <div className="bg-red-500/10 text-red-700 px-3 py-1 rounded-full text-xs">
                      Crítico
                    </div>
                  )}
                  {treinoAtual.status === 'alerta' && (
                    <div className="bg-orange-500/10 text-orange-700 px-3 py-1 rounded-full text-xs">
                      Alerta
                    </div>
                  )}
                </div>
                
                {treinoAtual.status === 'critico' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-red-700">Alerta de baixa ocupação</div>
                    <div className="text-xs text-red-700/80 mt-1">
                      Esta turma está com ocupação significativamente menor que o normal.
                      Sugestão: enviar promoção ou reagendar o horário.
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <div className="flex space-x-2 justify-between w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleExcluirTreino(treinoAtual.id)}
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    Excluir
                  </Button>
                  
                  <div className="space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalDetalhesTreino(false);
                        toast({
                          title: "Função não implementada",
                          description: "A edição de turmas será disponibilizada em breve."
                        });
                      }}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Editar
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="bg-academy-purple"
                      onClick={() => {
                        handlePromoverTreino(treinoAtual.id);
                        setModalDetalhesTreino(false);
                      }}
                    >
                      Promover
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CronogramaTreinos;
