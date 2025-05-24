
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BarChart2, 
  Bell, 
  MessageCircle, 
  Calendar, 
  BookOpen,
  Play, 
  HeartPulse, 
  FileText, 
  Award, 
  Settings,
  User, 
  Globe, 
  Utensils,
  PanelRight,
  Activity,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  ChartBar,
  Database,
  Hexagon,
  Clock,
  Save,
  Puzzle,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';

type SidebarItem = {
  title: string;
  path: string;
  icon: React.ElementType;
};

const mainItems: SidebarItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Painel de Gestão', path: '/painel-gestao', icon: PanelRight },
  { title: 'Alertas Automáticos', path: '/alertas', icon: Bell },
  { title: 'Previsão de Evasão (IA)', path: '/previsao-evasao', icon: TrendingDown },
  { title: 'Análise Preditiva', path: '/analise-preditiva', icon: Activity },
  { title: 'Controle de Frequência', path: '/controle-frequencia', icon: Clock },
  { title: 'Notificações', path: '/notificacoes', icon: Bell },
  { title: 'Gestão de Dados', path: '/gestao-dados', icon: Database },
  { title: 'Chatbot Inteligente', path: '/chatbot', icon: Hexagon },
  { title: 'Plataforma de Pagamentos', path: '/pagamentos', icon: FileSpreadsheet },
  { title: 'Feedback de Alunos', path: '/feedback', icon: HeartPulse },
  { title: 'Integração com APIs', path: '/integracao-apis', icon: Puzzle },
  { title: 'Programa de Fidelidade', path: '/programa-fidelidade', icon: Gift },
  { title: 'Comunicação', path: '/chatbot', icon: MessageCircle },
  { title: 'Treinos e Aulas Temáticas', path: '/aulas-tematicas', icon: Award },
  { title: 'Cronograma de Treinos', path: '/cronograma-treinos', icon: Calendar },
  { title: 'Aulas Salvas', path: '/aulas-salvas', icon: Save },
  { title: 'Atividades', path: '/atividades', icon: Play },
  { title: 'Programas', path: '/programas', icon: Award },
  { title: 'Relatórios', path: '/relatorios', icon: ChartBar },
  { title: 'Planilha e Faturamento', path: '/planilha-faturamento', icon: DollarSign },
  { title: 'Idiomas', path: '/idiomas', icon: Globe },
];

const bottomItems: SidebarItem[] = [
  { title: 'Configurações', path: '/configuracoes', icon: Settings },
  { title: 'Perfil', path: '/perfil', icon: User },
  { title: 'Nutrição', path: '/nutricao', icon: Utensils },
];

const SidebarItem: React.FC<{ item: SidebarItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {isActive && (
              <motion.div 
                className="absolute inset-0 bg-academy-purple rounded-lg z-0"
                layoutId="activeItem"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Link
              to={item.path}
              className={cn(
                "flex items-center py-3 px-3 my-1 rounded-lg transition-colors relative z-10",
                isActive 
                  ? "text-white" 
                  : "text-foreground/70 hover:bg-secondary"
              )}
            >
              <Icon size={20} className={collapsed ? "mx-auto" : "mr-2"} />
              {!collapsed && (
                <motion.span 
                  initial={false}
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                </motion.span>
              )}
            </Link>
          </div>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (value: boolean) => void }> = ({
  collapsed,
  setCollapsed
}) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <motion.div 
      className={cn(
        "h-screen bg-background border-r border-border p-4 transition-all duration-300 flex flex-col",
      )}
      initial={false}
      animate={{ width: collapsed ? "4rem" : "16rem" }}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <motion.div 
            className="text-xl font-bold text-gradient"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {user?.academyName || "Academia"}
          </motion.div>
        )}
        <motion.button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-secondary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {collapsed ? "→" : "←"}
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {mainItems.map((item) => (
            <SidebarItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border mt-4">
        {bottomItems.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
