
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageCircle, Star, Flame, AlertTriangle, 
  FileText, Search, Share2, PlusCircle, Archive,
  MessageSquare, Heart, ThumbsUp, ThumbsDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Tooltip, LineChart, Line 
} from 'recharts';

// Placeholder data
const satisfactionData = [
  { name: "5 estrelas", value: 45, color: "#4CAF50" },
  { name: "4 estrelas", value: 30, color: "#8BC34A" },
  { name: "3 estrelas", value: 15, color: "#FFC107" },
  { name: "2 estrelas", value: 7, color: "#FF9800" },
  { name: "1 estrela", value: 3, color: "#F44336" }
];

const topicsData = [
  { name: "Equipamentos", value: 45, color: "#9b87f5" },
  { name: "Horários", value: 30, color: "#64B5F6" },
  { name: "Limpeza", value: 25, color: "#81C784" }
];

const trendData = [
  { month: 'Jan', rating: 4.0 },
  { month: 'Fev', rating: 4.1 },
  { month: 'Mar', rating: 3.9 },
  { month: 'Abr', rating: 4.2 },
  { month: 'Mai', rating: 4.3 }
];

// Sample feedback data
const feedbackItems = [
  {
    id: 1,
    name: "Ana Silva",
    age: 32,
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment: "Adorei a nova aula de spinning! O professor é muito motivador e a playlist estava incrível. Senti que realmente superei meus limites hoje.",
    date: "2024-05-15T14:30:00",
    tags: ["spinning", "aulas", "positivo"]
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    age: 28,
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 2,
    comment: "Esteira 5 quebrada há 2 semanas. Já reportei três vezes na recepção e continua sem manutenção. Está afetando meu treino.",
    date: "2024-05-14T09:15:00",
    tags: ["manutenção", "equipamentos", "crítico"]
  },
  {
    id: 3,
    name: "Marta Rocha",
    age: 41,
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 3,
    comment: "Faltam aulas noturnas de yoga. Muitos alunos que trabalham no horário comercial não conseguem participar das sessões atuais.",
    date: "2024-05-12T18:22:00",
    tags: ["yoga", "horários", "sugestão"]
  },
  {
    id: 4,
    name: "Pedro Santos",
    age: 35,
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 4,
    comment: "O novo instrutor de musculação é excelente! Muito atencioso e dá dicas personalizadas. Senti evolução na minha técnica.",
    date: "2024-05-11T11:05:00",
    tags: ["instrutores", "musculação", "positivo"]
  },
  {
    id: 5,
    name: "Julia Mendes",
    age: 27,
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 1,
    comment: "Ar-condicionado do salão principal não está funcionando bem. Nas últimas aulas estava muito quente, tornando o treino desconfortável.",
    date: "2024-05-10T16:45:00",
    tags: ["infraestrutura", "ar-condicionado", "crítico"]
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: { 
    duration: 2, 
    repeat: Infinity,
    ease: "easeInOut" 
  }
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const FeedbackAlunos = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState(feedbackItems);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    toast({
      title: "Filtro aplicado",
      description: `Mostrando feedbacks ${newFilter === 'positive' ? 'positivos' : newFilter === 'critical' ? 'críticos' : 'todos'}.`
    });
  };

  const handleFeedbackAction = (id, action) => {
    if (action === 'respond') {
      toast({
        title: "Resposta enviada",
        description: "O aluno receberá sua mensagem."
      });
    } else if (action === 'pin') {
      toast({
        title: "Feedback fixado",
        description: "Este feedback será destacado no mural."
      });
    } else if (action === 'resolve') {
      toast({
        title: "Problema marcado como resolvido",
        description: "O aluno será notificado da solução."
      });
    } else if (action === 'contact') {
      toast({
        title: "Contato iniciado",
        description: "Enviando mensagem direta para o aluno."
      });
    } else if (action === 'archive') {
      // Remove from list with animation
      setFeedbacks(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Feedback arquivado",
        description: "Item movido para arquivos."
      });
    }
  };

  const handleNewForm = () => {
    setShowFormDialog(true);
  };

  const handleExportData = () => {
    toast({
      title: "Exportando dados",
      description: "Preparando relatório de feedbacks..."
    });
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "O relatório foi salvo na sua área de downloads."
      });
    }, 2000);
  };

  const handleShareInsights = () => {
    toast({
      title: "Compartilhamento preparado",
      description: "Escolha como deseja compartilhar este relatório."
    });
  };

  const handleOpenDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailDialog(true);
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  // Filter feedbacks based on current filter
  const filteredFeedbacks = feedbacks.filter(item => {
    if (filter === 'positive') return item.rating >= 4;
    if (filter === 'critical') return item.rating <= 2;
    return true; // 'all'
  });

  return (
    <MainLayout
      pageTitle="Feedback dos Alunos"
      pageSubtitle="Ouça a voz dos seus clientes e tome decisões estratégicas"
      headerImage="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=2000&q=80"
    >
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-sm animate-pulse">Analisando feedbacks dos alunos...</p>
          </div>
        </div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header with filters */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-between gap-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">87 respostas coletadas</h2>
                <p className="text-sm text-muted-foreground">
                  Satisfação média: 4.2/5 estrelas
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('all')}
              >
                Todos
              </Button>
              <Button 
                variant={filter === 'positive' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('positive')}
                className="text-green-600"
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                Positivos
              </Button>
              <Button 
                variant={filter === 'critical' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('critical')}
                className="text-orange-600"
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                Críticos
              </Button>
            </div>
          </motion.div>

          {/* Analytics Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Satisfaction Chart */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">SATISFAÇÃO MÉDIA</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded border shadow-lg text-xs">
                              <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold">4.2/5</div>
                <div className="text-sm text-green-500">+0.3 vs mês passado</div>
                <div className="text-xs mt-1">Top Elogio: "Professores atenciosos"</div>
              </div>
            </motion.div>

            {/* Topics Breakdown */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">TÓPICOS FREQUENTES</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topicsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded border shadow-lg text-xs">
                              <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">45% mencionam "Equipamentos"</span>
                </div>
              </div>
            </motion.div>

            {/* Critical Alert */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">ALERTA CRÍTICO</h3>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm">3 reclamações: "Ar-condicionado"</h4>
                    <p className="text-xs mt-1 text-gray-700">
                      Múltiplos alunos reportaram problemas com temperatura na sala principal.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-28 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[3, 5]} />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#9b87f5" 
                      strokeWidth={2}
                      dot={{ fill: '#9b87f5', strokeWidth: 1 }} 
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded border shadow-lg text-xs">
                              <p>{`${label}: ${payload[0].value} estrelas`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2">
                <Button variant="outline" size="sm" className="w-full text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  Resolver Urgente
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Feedback List */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Feedbacks Recentes
              </h3>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="w-48 pl-8 h-8 text-xs" placeholder="Buscar feedbacks..." />
              </div>
            </div>

            <AnimatePresence>
              {filteredFeedbacks.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-secondary/10 p-4 rounded-xl ${feedback.rating <= 2 ? 'border-l-4 border-orange-500' : feedback.rating >= 4 ? 'border-l-4 border-green-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={feedback.avatar} />
                      <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{feedback.name} <span className="text-sm font-normal text-muted-foreground">({feedback.age} anos)</span></div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={feedback.rating} />
                            <span className="text-xs text-muted-foreground">{getFormattedDate(feedback.date)}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(feedback)}>
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="mt-2 text-sm">{
                        feedback.comment.length > 100 
                          ? feedback.comment.substring(0, 100) + '...' 
                          : feedback.comment
                      }</p>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {feedback.tags.map(tag => (
                          <span key={tag} className="bg-secondary py-0.5 px-2 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {feedback.rating >= 4 && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleFeedbackAction(feedback.id, 'respond')}
                            >
                              <MessageCircle className="h-3.5 w-3.5 mr-1" /> Responder
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleFeedbackAction(feedback.id, 'pin')}
                            >
                              <Heart className="h-3.5 w-3.5 mr-1" /> Fixar
                            </Button>
                          </>
                        )}
                        
                        {feedback.rating <= 2 && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleFeedbackAction(feedback.id, 'resolve')}
                            >
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Resolver
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleFeedbackAction(feedback.id, 'contact')}
                            >
                              <MessageCircle className="h-3.5 w-3.5 mr-1" /> Contatar
                            </Button>
                          </>
                        )}
                        
                        {feedback.rating === 3 && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs"
                            onClick={() => handleFeedbackAction(feedback.id, 'respond')}
                          >
                            <MessageCircle className="h-3.5 w-3.5 mr-1" /> Responder
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs"
                          onClick={() => handleFeedbackAction(feedback.id, 'archive')}
                        >
                          <Archive className="h-3.5 w-3.5 mr-1" /> Arquivar
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Action Bar */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleNewForm} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Formulário
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleExportData} variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Exportar Dados
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleShareInsights} variant="outline" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" /> Compartilhar Insights
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer Stats */}
          <motion.div variants={itemVariants} className="text-center text-xs text-muted-foreground">
            <p>Última análise de sentimentos: hoje 07:00</p>
            <p className="text-green-500">IA detectou: 82% positivo (▲5%)</p>
          </motion.div>
        </motion.div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        {selectedFeedback && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedFeedback.avatar} />
                  <AvatarFallback>{selectedFeedback.name.charAt(0)}</AvatarFallback>
                </Avatar>
                Feedback de {selectedFeedback.name}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={selectedFeedback.rating} />
                  <span className="text-xs">{getFormattedDate(selectedFeedback.date)}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-2">
              <p>{selectedFeedback.comment}</p>
              
              <div className="border-t pt-2">
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedFeedback.tags.map(tag => (
                    <span key={tag} className="bg-secondary py-0.5 px-2 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-2">
                <h4 className="text-sm font-medium mb-1">Histórico do Aluno</h4>
                <div className="text-sm">
                  <p>Membro desde: Jan/2023</p>
                  <p>Frequência média: 3x por semana</p>
                  <p>Outros feedbacks: 2 positivos, 1 neutro</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <div className="flex flex-wrap gap-2 w-full">
                <Button onClick={() => {
                  handleFeedbackAction(selectedFeedback.id, 'respond');
                  setShowDetailDialog(false);
                }}>
                  <MessageCircle className="h-4 w-4 mr-1" /> Responder
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleFeedbackAction(selectedFeedback.id, 'archive');
                    setShowDetailDialog(false);
                  }}
                >
                  <Archive className="h-4 w-4 mr-1" /> Arquivar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* New Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Formulário</DialogTitle>
            <DialogDescription>
              Crie um novo formulário para coletar feedback dos alunos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="form-title" className="text-sm font-medium">Título do Formulário</label>
              <Input id="form-title" placeholder="Ex: Satisfação com as Aulas" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="form-desc" className="text-sm font-medium">Descrição</label>
              <Input id="form-desc" placeholder="Explique o objetivo do formulário" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="form-audience" className="text-sm font-medium">Público-alvo</label>
                <select className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                  <option>Todos os alunos</option>
                  <option>Novos alunos</option>
                  <option>Alunos recorrentes</option>
                  <option>Alunos de musculação</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="form-expiry" className="text-sm font-medium">Expira em</label>
                <Input id="form-expiry" type="date" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFormDialog(false)}>Cancelar</Button>
            <Button onClick={() => {
              toast({
                title: "Formulário criado",
                description: "O novo formulário foi publicado com sucesso."
              });
              setShowFormDialog(false);
            }}>Criar Formulário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default FeedbackAlunos;
