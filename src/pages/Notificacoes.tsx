
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Settings, DownloadCloud, Repeat, Filter, Trash, MessageCircle, DollarSign, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample notification data
const initialNotifications = [
  {
    id: 1,
    type: 'critical',
    title: 'RISCO DE CANCELAMENTO',
    icon: '‼️',
    description: 'Joana Silva (5 faltas seguidas)',
    date: '15/05',
    detail: 'Última presença: 15/05',
    chance: '92% chance de evasão',
    actions: ['Mensagem Personalizada', 'Oferecer 10% Desconto'],
    actionIcons: [<MessageCircle key="message" size={14} />, <DollarSign key="discount" size={14} />]
  },
  {
    id: 2,
    type: 'warning',
    title: 'PAGAMENTO ATRASADO',
    icon: '💸',
    description: 'Carlos Oliveira: R$ 150 (3 dias)',
    date: '16/05',
    detail: 'Método: Pix',
    actions: ['Lembrar por WhatsApp', 'Enviar Boleto'],
    actionIcons: [<MessageCircle key="whatsapp" size={14} />, <DownloadCloud key="download" size={14} />]
  },
  {
    id: 3,
    type: 'info',
    title: 'BACKUP CONCLUÍDO',
    icon: '🔄',
    description: '16/05 às 02:00',
    date: '16/05',
    detail: '1.2GB de dados seguros',
    actions: ['Marcar como Lida'],
    actionIcons: [<Eye key="view" size={14} />]
  },
  {
    id: 4,
    type: 'critical',
    title: 'ALUNO INATIVO',
    icon: '⚠️',
    description: 'Pedro Santos (sem acesso há 15 dias)',
    date: '14/05',
    detail: 'Último login: 01/05',
    chance: '78% chance de evasão',
    actions: ['Entrar em Contato', 'Oferecer Aula Grátis'],
    actionIcons: [<MessageCircle key="contact" size={14} />, <DollarSign key="free" size={14} />]
  },
  {
    id: 5,
    type: 'warning',
    title: 'CAPACIDADE MÁXIMA',
    icon: '🔔',
    description: 'Turma de 19h: 95% ocupada',
    date: '13/05',
    detail: 'Considere abrir novo horário',
    actions: ['Analisar Horários', 'Ignorar'],
    actionIcons: [<Settings key="settings" size={14} />, <X key="ignore" size={14} />]
  }
];

// Data for pie chart
const statsData = [
  { name: 'Resolvidos', value: 85, color: '#10B981' },
  { name: 'Pendentes', value: 15, color: '#F97316' }
];

// Animated counters for stats
const AnimatedCounter = ({ value, duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const totalMilSecDuration = duration * 1000;
    const incrementTime = (totalMilSecDuration / end) * 1.1;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

const Notificacoes = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('Todos');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter notifications based on selected filter
  const filteredNotifications = filter === 'Todos' 
    ? notifications 
    : notifications.filter(n => {
        if (filter === 'Não Lidos') return true; // All are unread in this example
        if (filter === 'Financeiro') return n.title.includes('PAGAMENTO');
        if (filter === 'Evasão') return n.title.includes('CANCELAMENTO') || n.title.includes('INATIVO');
        return true;
      });
    
  // Handle notification action
  const handleAction = (notificationId, action) => {
    toast({
      title: "Ação executada",
      description: `${action} para a notificação #${notificationId}`
    });
  };
  
  // Handle remove notification
  const handleRemove = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi arquivada com sucesso."
    });
  };
  
  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: "Notificações limpas",
      description: "Todas as notificações foram arquivadas com sucesso."
    });
  };
  
  // Export notifications report
  const handleExport = (format) => {
    toast({
      title: "Relatório exportado",
      description: `Relatório de notificações exportado em formato ${format}.`
    });
    setShowExportDialog(false);
  };
  
  // Sync notifications
  const handleSync = () => {
    toast({
      title: "Sincronizando...",
      description: "Buscando novas notificações..."
    });
    
    // Simulate sync delay
    setTimeout(() => {
      toast({
        title: "Sincronização concluída",
        description: "Não há novas notificações."
      });
    }, 2000);
  };
  
  return (
    <MainLayout
      pageTitle="Notificações"
      pageSubtitle="Monitore alertas e mensagens importantes em tempo real"
      headerImage="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=2000&q=80"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-3xl mx-auto"
      >
        {/* Animation and chart section at top */}
        <motion.div 
          className="relative overflow-hidden bg-background rounded-xl p-6 border border-border shadow-sm"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-medium mb-1">Estatísticas de Notificações</h3>
              <p className="text-muted-foreground mb-4">Resumo das atividades recentes</p>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span>Alertas hoje</span>
                  <span className="font-medium">
                    <AnimatedCounter value={filteredNotifications.length} />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Resolvidos</span>
                  <span className="font-medium text-green-500">
                    <AnimatedCounter value="85" />%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tempo de resposta</span>
                  <span className="font-medium">
                    <AnimatedCounter value="23" /> min
                  </span>
                </div>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Filter bar */}
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="relative">
            <motion.button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 py-2 pl-3 pr-8 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter size={16} />
              <span>{filter}</span>
              <svg className="w-4 h-4 absolute right-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </motion.button>
            
            <AnimatePresence>
              {filterOpen && (
                <motion.div 
                  className="absolute mt-1 w-40 bg-background border border-border rounded-lg shadow-lg z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {['Todos', 'Não Lidos', 'Financeiro', 'Evasão'].map((option) => (
                    <motion.button
                      key={option}
                      className="w-full text-left px-3 py-2 hover:bg-secondary"
                      onClick={() => {
                        setFilter(option);
                        setFilterOpen(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.div 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredNotifications.length} notificação(ões)
          </motion.div>
        </motion.div>
        
        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-secondary/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.5
              }}
            >
              <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            </motion.div>
            <h3 className="text-lg font-medium">Nenhuma notificação</h3>
            <p className="text-muted-foreground">Você está com tudo em dia!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, idx) => (
              <motion.div 
                key={notification.id} 
                className={`
                  relative overflow-hidden rounded-xl border shadow-sm
                  ${notification.type === 'critical' ? 'bg-red-500/10 border-red-500/30' : 
                    notification.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' : 
                    'bg-blue-500/10 border-blue-500/30'}
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <motion.div 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + (0.1 * idx) }}
                    >
                      <div className="text-xl mr-3">{notification.icon}</div>
                      <div>
                        <div className="font-semibold text-sm">{notification.title}</div>
                        <div className="text-base mt-1">{notification.description}</div>
                        <div className="text-sm text-muted-foreground mt-2">
                          {notification.detail}
                        </div>
                        {notification.chance && (
                          <motion.div 
                            className="text-sm font-medium mt-1 text-red-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.7, 1] }}
                            transition={{ delay: 0.4 + (0.1 * idx), times: [0, 0.5, 0.8, 1], duration: 2 }}
                          >
                            {notification.chance}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    <motion.button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemove(notification.id)}
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {notification.actions.map((action, idx) => (
                      <motion.div key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant={idx === 0 ? "default" : "outline"}
                          onClick={() => handleAction(notification.id, action)}
                          className="flex items-center gap-1.5"
                        >
                          {notification.actionIcons && notification.actionIcons[idx]}
                          {action}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Quick actions */}
        <motion.div 
          className="fixed bottom-6 right-6 flex flex-col gap-3 items-end"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div 
            className="bg-background glass-morphism rounded-lg p-1.5 flex gap-1 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button size="icon" variant="ghost" onClick={handleClearAll} title="Limpar tudo">
                <Trash className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button size="icon" variant="ghost" onClick={() => setShowConfigDialog(true)} title="Configurar">
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button size="icon" variant="ghost" onClick={() => setShowExportDialog(true)} title="Exportar">
                <DownloadCloud className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.15 }} 
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: [0, 0, 360] }}
              transition={{ 
                rotate: { repeat: Infinity, repeatDelay: 20, duration: 1.5 },
                scale: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <Button size="icon" variant="ghost" onClick={handleSync} title="Sincronizar">
                <Repeat className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Config Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Alertas</DialogTitle>
            <DialogDescription>
              Personalize quais notificações você deseja receber e como.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="space-y-4 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="flex justify-between items-center"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px', padding: '4px' }}
            >
              <div>
                <div className="font-medium">Alertas de evasão</div>
                <div className="text-sm text-muted-foreground">Notificações sobre alunos em risco</div>
              </div>
              <motion.button 
                className="w-12 h-6 rounded-full relative bg-primary"
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute top-1 w-4 h-4 rounded-full bg-background"
                  initial={{ x: 28 }}
                  whileHover={{ scale: 1.1 }}
                />
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="flex justify-between items-center"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px', padding: '4px' }}
            >
              <div>
                <div className="font-medium">Alertas financeiros</div>
                <div className="text-sm text-muted-foreground">Pagamentos e faturas</div>
              </div>
              <motion.button 
                className="w-12 h-6 rounded-full relative bg-primary"
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute top-1 w-4 h-4 rounded-full bg-background"
                  initial={{ x: 28 }}
                  whileHover={{ scale: 1.1 }}
                />
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="flex justify-between items-center"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px', padding: '4px' }}
            >
              <div>
                <div className="font-medium">Alertas de sistema</div>
                <div className="text-sm text-muted-foreground">Backups e atualizações</div>
              </div>
              <motion.button 
                className="w-12 h-6 rounded-full relative bg-primary"
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute top-1 w-4 h-4 rounded-full bg-background"
                  initial={{ x: 28 }}
                  whileHover={{ scale: 1.1 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setShowConfigDialog(false)}>Salvar</Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Relatório</DialogTitle>
            <DialogDescription>
              Escolha o formato para exportar o relatório de notificações.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="grid grid-cols-2 gap-4 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleExport('PDF')} className="w-full">PDF</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleExport('Excel')} className="w-full">Excel</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleExport('CSV')} variant="outline" className="w-full">CSV</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleExport('JSON')} variant="outline" className="w-full">JSON</Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Notificacoes;
