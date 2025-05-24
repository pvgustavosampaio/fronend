
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Lock, 
  CreditCard, 
  Bell, 
  Smartphone, 
  Moon, 
  Sun, 
  Database, 
  Upload, 
  Download, 
  RefreshCcw, 
  FileText, 
  MessageSquare, 
  User, 
  Fingerprint, 
  Shield, 
  Clock, 
  Activity as ActivityIcon,
  Search,
  ChevronRight
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface ConfigItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'button' | 'info';
  icon?: React.ReactNode;
  value?: boolean | string;
  options?: { label: string; value: string }[];
  action?: () => void;
}

const securityItems: ConfigItem[] = [
  {
    id: 'faceId',
    title: 'Autenticação Biométrica',
    description: 'Usar Face ID para valores acima de R$ 500',
    type: 'toggle',
    icon: <Fingerprint className="h-4 w-4" />,
    value: true
  },
  {
    id: 'doubleTap',
    title: 'Confirmação por duplo toque',
    description: 'Maior segurança em operações críticas',
    type: 'toggle',
    icon: <Shield className="h-4 w-4" />,
    value: true
  },
  {
    id: 'backup',
    title: 'Backup Automático',
    description: 'Realizado diariamente às 2:00',
    type: 'info',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: 'lastBackup',
    title: 'Último backup',
    description: 'Hoje às 02:00',
    type: 'info',
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: 'manualBackup',
    title: 'Realizar backup manual',
    description: 'Salvar todos os dados agora',
    type: 'button',
    icon: <Download className="h-4 w-4" />,
    action: () => console.log('Manual backup initiated')
  },
];

const communicationItems: ConfigItem[] = [
  {
    id: 'notifications',
    title: 'Notificações críticas',
    description: 'Alertas sobre evasão e pagamentos',
    type: 'toggle',
    icon: <Bell className="h-4 w-4" />,
    value: true
  },
  {
    id: 'alertSound',
    title: 'Som de alerta',
    description: 'Tocar som ao receber notificações',
    type: 'toggle',
    icon: <MessageSquare className="h-4 w-4" />,
    value: false
  },
  {
    id: 'alertLevel',
    title: 'Sensibilidade de alertas',
    description: 'Define o limite para notificações',
    type: 'select',
    icon: <ActivityIcon className="h-4 w-4" />,
    value: 'medium',
    options: [
      { label: 'Baixa', value: 'low' },
      { label: 'Média', value: 'medium' },
      { label: 'Alta', value: 'high' }
    ]
  },
  {
    id: 'messageTemplates',
    title: 'Templates de mensagens',
    description: 'Gerenciar modelos pré-definidos',
    type: 'button',
    icon: <FileText className="h-4 w-4" />,
    action: () => console.log('Open message templates')
  }
];

const syncItems: ConfigItem[] = [
  {
    id: 'cloudSync',
    title: 'Sincronização com a nuvem',
    description: 'Manter dados atualizados em todos dispositivos',
    type: 'toggle',
    icon: <Upload className="h-4 w-4" />,
    value: true
  },
  {
    id: 'autoSync',
    title: 'Sincronização automática',
    description: 'Sincronizar a cada 30 minutos',
    type: 'toggle',
    icon: <RefreshCcw className="h-4 w-4" />,
    value: true
  },
  {
    id: 'syncNow',
    title: 'Sincronizar agora',
    description: 'Forçar sincronização imediata',
    type: 'button',
    icon: <RefreshCcw className="h-4 w-4" />,
    action: () => {
      console.log('Manual sync initiated');
      toast({
        title: "Sincronização iniciada",
        description: "Os dados estão sendo sincronizados agora."
      });
    }
  }
];

const personalItems: ConfigItem[] = [
  {
    id: 'theme',
    title: 'Tema',
    description: 'Escolher entre claro e escuro',
    type: 'select',
    icon: <Sun className="h-4 w-4" />,
    value: 'light',
    options: [
      { label: 'Claro', value: 'light' },
      { label: 'Escuro', value: 'dark' },
      { label: 'Sistema', value: 'system' }
    ]
  },
  {
    id: 'profile',
    title: 'Perfil',
    description: 'Gerenciar informações pessoais',
    type: 'button',
    icon: <User className="h-4 w-4" />,
    action: () => console.log('Open profile settings')
  }
];

// Categorias para o Grid estilo macOS
const categoryItems = [
  {
    id: 'security',
    title: 'Segurança',
    icon: <Lock className="h-6 w-6" />,
    description: 'Controles de acesso e backup',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500'
  },
  {
    id: 'communication',
    title: 'Comunicação',
    icon: <Bell className="h-6 w-6" />,
    description: 'Notificações e mensagens',
    color: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-500'
  },
  {
    id: 'sync',
    title: 'Sincronização',
    icon: <RefreshCcw className="h-6 w-6" />,
    description: 'Cloud e backups',
    color: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500'
  },
  {
    id: 'personal',
    title: 'Personalização',
    icon: <User className="h-6 w-6" />,
    description: 'Tema e preferências',
    color: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500'
  },
  {
    id: 'financial',
    title: 'Financeiro',
    icon: <CreditCard className="h-6 w-6" />,
    description: 'Pagamentos e taxas',
    color: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-500'
  },
  {
    id: 'ai',
    title: 'Inteligência Artificial',
    icon: <ActivityIcon className="h-6 w-6" />,
    description: 'Configurações de IA',
    color: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconColor: 'text-cyan-500'
  }
];

const ConfigSection = ({ 
  items, 
  onChange 
}: { 
  items: ConfigItem[], 
  onChange: (id: string, value: boolean | string) => void 
}) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <motion.div 
          key={item.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          whileHover={{ y: -2, backgroundColor: 'rgba(0,0,0,0.02)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="flex items-start gap-3">
            {item.icon && (
              <motion.div 
                className={`mt-0.5 bg-secondary p-2 rounded-md`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.div>
            )}
            <div>
              <h4 className="text-sm font-medium">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
          
          <div>
            {item.type === 'toggle' && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Switch 
                  checked={item.value as boolean} 
                  onCheckedChange={(checked) => onChange(item.id, checked)}
                  className="data-[state=checked]:bg-academy-purple"
                />
              </motion.div>
            )}
            
            {item.type === 'select' && (
              <Select 
                value={item.value as string}
                onValueChange={(value) => onChange(item.id, value)}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {item.options?.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {item.type === 'button' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={item.action}
                  className="transition-all"
                >
                  {item.title.split(' ').pop()}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CategoryGrid = ({
  categories,
  activeTab,
  setActiveTab
}: {
  categories: typeof categoryItems,
  activeTab: string,
  setActiveTab: (id: string) => void
}) => {
  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          className={`p-4 rounded-xl cursor-pointer transition-all ${
            activeTab === category.id ? 'ring-2 ring-academy-purple' : ''
          } ${category.color}`}
          onClick={() => setActiveTab(category.id)}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`rounded-full p-3 w-12 h-12 flex items-center justify-center mb-3 ${category.iconColor} bg-white/80`}>
            {category.icon}
          </div>
          <h3 className="font-medium mb-1">{category.title}</h3>
          <p className="text-xs text-muted-foreground">{category.description}</p>
          <motion.div 
            className="mt-2 flex items-center text-xs text-academy-purple"
            animate={{ x: activeTab === category.id ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className={activeTab === category.id ? "opacity-100" : "opacity-0"}>Visualizar</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const usageData = {
  storage: 65,
  notifications: 42,
  backups: 7
};

const UsageStats = () => {
  // Animate the counters
  const [counts, setCounts] = useState({
    storage: 0,
    notifications: 0,
    backups: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => ({
        storage: prev.storage < usageData.storage ? prev.storage + 1 : usageData.storage,
        notifications: prev.notifications < usageData.notifications ? prev.notifications + 1 : usageData.notifications,
        backups: prev.backups < usageData.backups ? prev.backups + 1 : usageData.backups
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="grid grid-cols-3 gap-4 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Armazenamento</h4>
        <div className="text-2xl font-bold mt-1 text-blue-700 dark:text-blue-300">{counts.storage}%</div>
        <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2">
          <motion.div 
            className="bg-blue-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${counts.storage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
        <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400">Notificações</h4>
        <div className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-300">{counts.notifications}</div>
        <p className="text-xs text-muted-foreground mt-2">Este mês</p>
      </div>
      
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Backups</h4>
        <div className="text-2xl font-bold mt-1 text-green-700 dark:text-green-300">{counts.backups}</div>
        <p className="text-xs text-muted-foreground mt-2">Última semana</p>
      </div>
    </motion.div>
  );
};

const Configuracoes = () => {
  const [securityConfig, setSecurityConfig] = useState<ConfigItem[]>(securityItems);
  const [communicationConfig, setCommunicationConfig] = useState<ConfigItem[]>(communicationItems);
  const [syncConfig, setSyncConfig] = useState<ConfigItem[]>(syncItems);
  const [personalConfig, setPersonalConfig] = useState<ConfigItem[]>(personalItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('security');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleConfigChange = (category: 'security' | 'communication' | 'sync' | 'personal') => {
    return (id: string, value: boolean | string) => {
      let setter;
      let items;
      
      switch (category) {
        case 'security':
          setter = setSecurityConfig;
          items = securityConfig;
          break;
        case 'communication':
          setter = setCommunicationConfig;
          items = communicationConfig;
          break;
        case 'sync':
          setter = setSyncConfig;
          items = syncConfig;
          break;
        case 'personal':
          setter = setPersonalConfig;
          items = personalConfig;
          break;
      }
      
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, value } : item
      );
      
      setter(updatedItems);
      
      // Animação de confirmação
      const item = items.find(item => item.id === id);
      toast({
        title: "Configuração atualizada",
        description: `${item?.title} foi atualizado com sucesso.`
      });
    };
  };
  
  const handleResetDefaults = () => {
    // Animação de reset
    setSecurityConfig(securityItems.map(item => ({...item})));
    setCommunicationConfig(communicationItems.map(item => ({...item})));
    setSyncConfig(syncItems.map(item => ({...item})));
    setPersonalConfig(personalItems.map(item => ({...item})));
    
    setShowResetDialog(false);
    
    toast({
      title: "Configurações restauradas",
      description: "Todas as configurações foram restauradas para os valores padrão."
    });
  };
  
  // Handle search/filtering
  const filteredItems = () => {
    if (!searchQuery) return null;
    
    const allItems = [
      ...securityConfig, 
      ...communicationConfig,
      ...syncConfig,
      ...personalConfig
    ];
    
    return allItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filtered = filteredItems();
  
  // Função para renderizar o conteúdo da tab ativa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <motion.div 
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-academy-purple" />
              Segurança
            </h3>
            <ConfigSection 
              items={securityConfig}
              onChange={handleConfigChange('security')}
            />
          </motion.div>
        );
      case 'communication':
        return (
          <motion.div 
            key="communication"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-academy-purple" />
              Comunicação
            </h3>
            <ConfigSection 
              items={communicationConfig}
              onChange={handleConfigChange('communication')}
            />
          </motion.div>
        );
      case 'sync':
        return (
          <motion.div 
            key="sync"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <RefreshCcw className="h-5 w-5 mr-2 text-academy-purple" />
              Sincronização
            </h3>
            <ConfigSection 
              items={syncConfig}
              onChange={handleConfigChange('sync')}
            />
          </motion.div>
        );
      case 'personal':
        return (
          <motion.div 
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-academy-purple" />
              Personalização
            </h3>
            <ConfigSection 
              items={personalConfig}
              onChange={handleConfigChange('personal')}
            />
          </motion.div>
        );
      default:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-muted-foreground">Selecione uma categoria para visualizar as configurações.</p>
          </motion.div>
        );
    }
  };
  
  return (
    <MainLayout
      pageTitle="Configurações"
      pageSubtitle="Personalize a aplicação de acordo com suas preferências"
      headerImage="https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=2000&q=80"
    >
      <motion.div 
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header icon com animação */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 180, 0] }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20, 
            delay: 0.3 
          }}
        >
          <motion.div 
            className="bg-secondary rounded-full p-6 relative"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(124, 58, 237, 0)", "0px 0px 20px rgba(124, 58, 237, 0.5)", "0px 0px 0px rgba(124, 58, 237, 0)"] 
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <Settings className="h-12 w-12 text-academy-purple" />
          </motion.div>
        </motion.div>
        
        {/* Estatísticas de uso animadas */}
        <UsageStats />
        
        {/* Search bar com animação */}
        <div className="relative">
          <motion.input
            type="text"
            placeholder="Buscar ajustes..."
            className="w-full py-2 pl-10 pr-4 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-academy-purple transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
            animate={{ 
              paddingLeft: isSearching ? "40px" : "40px",
              boxShadow: isSearching ? "0px 2px 15px rgba(0, 0, 0, 0.1)" : "none" 
            }}
          />
          <motion.div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            animate={{ scale: isSearching ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
        
        {/* Search results */}
        <AnimatePresence>
          {filtered && filtered.length > 0 && (
            <motion.div 
              className="bg-background border border-border rounded-lg p-4 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3 className="text-sm font-medium mb-2">Resultados da busca</h3>
              <div className="space-y-4">
                {filtered.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <div className="bg-secondary p-2 rounded-md">
                          {item.icon}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main settings grid */}
        {!searchQuery && (
          <motion.div 
            className="bg-background border border-border rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Grid de categorias de configuração */}
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-medium mb-4">Categorias</h3>
              <CategoryGrid 
                categories={categoryItems} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
              />
            </div>
            
            {/* Conteúdo da categoria selecionada */}
            <div className="p-6">
              <AnimatePresence mode='wait'>
                {renderActiveTabContent()}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        
        {/* Informações de cache e armazenamento */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Collapsible className="border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Informações do sistema</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transform transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-2">
                  <div className="flex justify-between items-center py-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Versão do app</span>
                    <span className="text-sm">4.2.1 (Build 20240516)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Cache de dados</span>
                    <span className="text-sm">256MB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Armazenamento usado</span>
                    <span className="text-sm">1.2GB / 5GB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Último login</span>
                    <span className="text-sm">Hoje, 14:32</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            versão 4.2.1 (Build 20240516)
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleResetDefaults}
              className="transition-colors"
            >
              Restaurar Padrões
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Configuracoes;

