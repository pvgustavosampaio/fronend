
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, FileSpreadsheet, Users, Trash2, AlertCircle, Settings, 
  Download, Upload, BarChart2, ChevronRight, PieChart, RefreshCcw,
  FileText, Search, CheckCircle, CloudOff, Cloud
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

// Placeholder data for visualizations
const integrityData = [
  { name: 'Completo', value: 98 },
  { name: 'Problemas', value: 2 },
];

const storageUsageData = [
  { name: 'Usado', value: 15 },
  { name: 'Livre', value: 85 },
];

const COLORS = ['#9b87f5', '#E0E0E0'];
const AREA_COLORS = ['rgba(155, 135, 245, 0.8)', 'rgba(25, 118, 210, 0.6)', 'rgba(255, 152, 0, 0.6)'];

const accessHistoryData = [
  { date: '10/05', users: 15, records: 120 },
  { date: '11/05', users: 20, records: 180 },
  { date: '12/05', users: 18, records: 150 },
  { date: '13/05', users: 25, records: 210 },
  { date: '14/05', users: 22, records: 190 },
  { date: '15/05', users: 30, records: 230 },
  { date: '16/05', users: 28, records: 220 },
];

const dataGrowthData = [
  { month: 'Jan', alunos: 800, financeiro: 300, frequencia: 200 },
  { month: 'Fev', alunos: 900, financeiro: 400, frequencia: 300 },
  { month: 'Mar', alunos: 1000, financeiro: 500, frequencia: 400 },
  { month: 'Abr', alunos: 1100, financeiro: 600, frequencia: 500 },
  { month: 'Mai', alunos: 1200, financeiro: 700, frequencia: 600 },
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

// Interactive Database Element Component
const DataModule = ({ icon: Icon, title, subtitle, action, animated = true }) => (
  <motion.div 
    variants={animated ? itemVariants : {}}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="flex justify-between items-center py-3 px-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
  >
    <div className="flex items-center">
      <Icon className="mr-3 h-5 w-5 text-primary" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
    </div>
    <Button variant="ghost" size="sm" className="gap-1">
      {action} <ChevronRight className="h-4 w-4" />
    </Button>
  </motion.div>
);

const GestaoDatabase = () => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showCleanDialog, setShowCleanDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('online');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate cloud sync status
  useEffect(() => {
    const interval = setInterval(() => {
      setCloudStatus(prev => prev === 'online' ? 'syncing' : 'online');
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate actions
  const handleExport = (format) => {
    toast({
      title: "Exportação iniciada",
      description: `Exportando dados em formato ${format}...`,
    });
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Dados exportados com sucesso.",
      });
    }, 2000);
    setShowExportDialog(false);
  };

  const handleBackup = () => {
    toast({
      title: "Backup iniciado",
      description: "Realizando backup dos dados...",
    });
    setTimeout(() => {
      toast({
        title: "Backup concluído",
        description: `Backup realizado em ${new Date().toLocaleTimeString()}.`,
      });
    }, 3000);
    setShowBackupDialog(false);
  };

  const handleCleanCache = () => {
    toast({
      title: "Limpeza iniciada",
      description: "Removendo dados temporários...",
    });
    setTimeout(() => {
      toast({
        title: "Limpeza concluída",
        description: "Cache removido com sucesso.",
      });
    }, 2000);
    setShowCleanDialog(false);
  };

  const handleAudit = () => {
    toast({
      title: "Auditoria iniciada",
      description: "Analisando integridade dos dados...",
    });
    setTimeout(() => {
      toast({
        title: "Auditoria concluída",
        description: "Relatório de auditoria gerado com sucesso.",
      });
    }, 4000);
    setShowAuditDialog(false);
  };

  const cloudStatusIcon = () => {
    if (cloudStatus === 'online') return <Cloud className="text-green-500 animate-pulse" />;
    return <RefreshCcw className="text-blue-500 animate-spin" />;
  };

  return (
    <MainLayout
      pageTitle="Gestão de Dados"
      pageSubtitle="Gerencie os dados da sua academia"
      headerImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80"
    >
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <Database className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-sm animate-pulse">Carregando dados da academia...</p>
          </div>
        </div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header with dynamic data */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-3 rounded-lg">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Seus Dados: 1.2K alunos | 45MB</h2>
                <p className="text-sm text-muted-foreground">
                  Última atualização: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary/20 rounded-full">
              {cloudStatusIcon()}
              <span className="text-sm ml-1">
                {cloudStatus === 'online' ? 'Sincronizado' : 'Sincronizando...'}
              </span>
            </div>
          </motion.div>
          
          {/* Visualizations Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Integrity Chart */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">INTEGRIDADE</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie
                      data={integrityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {integrityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">98% completos</div>
                <div className="text-xs text-destructive">▼2% problemas</div>
              </div>
            </motion.div>

            {/* Backup Status */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">BACKUP</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="relative">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="#9b87f5" 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="50.24" 
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cloud className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">Último: hoje 02:00</div>
                <div className="text-sm">3 versões disponíveis</div>
              </div>
            </motion.div>

            {/* Privacy */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">PRIVACIDADE</h3>
              <div className="h-32 flex flex-col items-center justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div className="mt-2 flex gap-1.5 items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">GDPR compliant</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">0 compartilhamentos</div>
                <div className="text-sm text-green-500">Dados protegidos</div>
              </div>
            </motion.div>

            {/* Storage */}
            <motion.div 
              className="bg-secondary/10 rounded-xl p-4" 
              animate={pulseAnimation}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">ESPAÇO</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie
                      data={storageUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {storageUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">15% utilizado</div>
                <div className="text-sm">85GB livres</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Data Growth Chart */}
          <motion.div variants={itemVariants} className="bg-secondary/10 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Crescimento de Dados por Mês
              </h3>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-1" /> Filtrar
              </Button>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dataGrowthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background p-2 rounded border shadow-lg">
                            <p className="text-sm font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
                                {entry.name}: {entry.value} registros
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="alunos" stackId="1" stroke="#9b87f5" fill={AREA_COLORS[0]} />
                  <Area type="monotone" dataKey="financeiro" stackId="1" stroke="#1976d2" fill={AREA_COLORS[1]} />
                  <Area type="monotone" dataKey="frequencia" stackId="1" stroke="#ff9800" fill={AREA_COLORS[2]} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-2 gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9b87f5' }}></div>
                <span className="text-xs">Alunos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1976d2' }}></div>
                <span className="text-xs">Financeiro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff9800' }}></div>
                <span className="text-xs">Frequência</span>
              </div>
            </div>
          </motion.div>

          {/* Usage Analytics */}
          <motion.div variants={itemVariants} className="bg-secondary/10 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Acesso aos Dados (Últimos 7 Dias)
              </h3>
              <Button variant="ghost" size="sm" className="gap-1">
                <FileText className="h-4 w-4" /> Relatório Completo
              </Button>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={accessHistoryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background p-2 rounded border shadow-lg">
                            <p className="text-sm font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="users" name="Usuários" fill="#9b87f5" />
                  <Bar dataKey="records" name="Registros acessados" fill="#e0e0e0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Data modules */}
          <motion.div 
            variants={itemVariants}
            className="bg-secondary/10 p-4 rounded-xl"
          >
            <div className="flex items-center mb-4">
              <Database className="mr-2 h-5 w-5 text-primary" /> 
              <h3 className="font-medium">Módulos de Dados</h3>
            </div>
            <div className="space-y-4">
              <DataModule 
                icon={Users}
                title="Dados de Alunos"
                subtitle="1.2K registros • Atualizado há 2h"
                action="Detalhes"
              />

              <DataModule 
                icon={FileSpreadsheet}
                title="Financeiro"
                subtitle="12 meses históricos"
                action="Exportar"
              />

              <DataModule 
                icon={AlertCircle}
                title="Métricas de Evasão"
                subtitle="85 padrões detectados"
                action="Treinar novamente"
              />

              <DataModule 
                icon={Settings}
                title="Fontes de Dados"
                subtitle="App (primário), Planilha (secundário)"
                action="Gerenciar"
              />
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setShowExportDialog(true)} className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Exportar Tudo
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setShowCleanDialog(true)} variant="outline" className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" /> Limpar Cache
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setShowBackupDialog(true)} variant="outline" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" /> Backup Agora
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setShowAuditDialog(true)} variant="outline" className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" /> Auditoria
              </Button>
            </motion.div>
          </motion.div>

          {/* System info */}
          <motion.div variants={itemVariants} className="text-xs text-muted-foreground mt-8 text-center">
            v4.2.1 | Modelo IA v3.1 | Última análise: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </motion.div>
        </motion.div>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Dados</DialogTitle>
            <DialogDescription>
              Escolha o formato para exportar todos os dados da academia.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={() => handleExport('CSV')}>Exportar como CSV</Button>
            <Button onClick={() => handleExport('JSON')}>Exportar como JSON</Button>
            <Button onClick={() => handleExport('Excel')} variant="outline">Exportar como Excel</Button>
            <Button onClick={() => handleExport('PDF')} variant="outline">Exportar como PDF</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Backup de Dados</DialogTitle>
            <DialogDescription>
              Realizar backup completo de todos os dados da academia?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 py-4">
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>Cancelar</Button>
            <Button onClick={handleBackup}>Confirmar Backup</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clean Cache Dialog */}
      <Dialog open={showCleanDialog} onOpenChange={setShowCleanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar Cache</DialogTitle>
            <DialogDescription>
              Esta ação irá remover todos os dados temporários. Os dados importantes não serão afetados.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 py-4">
            <Button variant="outline" onClick={() => setShowCleanDialog(false)}>Cancelar</Button>
            <Button onClick={handleCleanCache}>Confirmar Limpeza</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Dialog */}
      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auditoria de Dados</DialogTitle>
            <DialogDescription>
              Realizar auditoria completa para verificar integridade e segurança dos dados?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 py-4">
            <Button variant="outline" onClick={() => setShowAuditDialog(false)}>Cancelar</Button>
            <Button onClick={handleAudit}>Iniciar Auditoria</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default GestaoDatabase;
