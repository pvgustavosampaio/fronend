
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  Edit, 
  Share2, 
  Play, 
  Clock, 
  Award,
  Filter,
  Plus,
  MoreHorizontal
} from 'lucide-react';

interface SavedClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  type: 'HIIT' | 'Força' | 'Cardio' | 'Yoga' | 'Dança';
  completed: boolean;
  dateAdded: string;
}

const mockClasses: SavedClass[] = [
  {
    id: '1',
    name: 'HIIT Intenso',
    instructor: 'Carla',
    time: '08:00',
    duration: 45,
    level: 'Avançado',
    type: 'HIIT',
    completed: false,
    dateAdded: '2024-05-20'
  },
  {
    id: '2',
    name: 'Força e Resistência',
    instructor: 'Marcus',
    time: '14:00',
    duration: 60,
    level: 'Intermediário',
    type: 'Força',
    completed: true,
    dateAdded: '2024-05-19'
  },
  {
    id: '3',
    name: 'Yoga Relaxante',
    instructor: 'Ana',
    time: '18:00',
    duration: 30,
    level: 'Iniciante',
    type: 'Yoga',
    completed: false,
    dateAdded: '2024-05-18'
  },
  {
    id: '4',
    name: 'Cardio Explosivo',
    instructor: 'Roberto',
    time: '07:00',
    duration: 50,
    level: 'Avançado',
    type: 'Cardio',
    completed: false,
    dateAdded: '2024-05-17'
  },
  {
    id: '5',
    name: 'Dança Latina',
    instructor: 'Sofia',
    time: '19:30',
    duration: 40,
    level: 'Intermediário',
    type: 'Dança',
    completed: false,
    dateAdded: '2024-05-16'
  }
];

const AulasSalvas = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<SavedClass[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'aulas' | 'conquistas'>('aulas');

  const completedCount = classes.filter(c => c.completed).length;
  const totalCount = classes.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const filteredClasses = classes.filter(classe => {
    const matchesSearch = classe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classe.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'completed' && classe.completed) ||
                         (selectedFilter === 'pending' && !classe.completed) ||
                         classe.type.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleToggleComplete = (id: string) => {
    setClasses(prev => prev.map(classe => 
      classe.id === id ? { ...classe, completed: !classe.completed } : classe
    ));
    
    const classe = classes.find(c => c.id === id);
    if (classe) {
      toast({
        description: classe.completed ? 
          `"${classe.name}" marcada como pendente` : 
          `"${classe.name}" marcada como concluída!`
      });
    }
  };

  const handleDeleteClass = (id: string) => {
    const classe = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    
    toast({
      title: "Aula removida",
      description: `"${classe?.name}" foi excluída das aulas salvas`
    });
  };

  const handleEditClass = (id: string) => {
    toast({
      description: "Editando aula..."
    });
  };

  const handleShareClass = (id: string) => {
    const classe = classes.find(c => c.id === id);
    toast({
      description: `Compartilhando "${classe?.name}"`
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return 'text-green-500 bg-green-500/10';
      case 'Intermediário': return 'text-yellow-500 bg-yellow-500/10';
      case 'Avançado': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HIIT': return 'text-purple-500 bg-purple-500/10';
      case 'Força': return 'text-blue-500 bg-blue-500/10';
      case 'Cardio': return 'text-red-500 bg-red-500/10';
      case 'Yoga': return 'text-green-500 bg-green-500/10';
      case 'Dança': return 'text-pink-500 bg-pink-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <MainLayout
      pageTitle="Controle Total"
      pageSubtitle="Gerencie suas aulas salvas e conquistas"
      headerImage="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {/* Header with Counter */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aulas Salvas</h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'aulas' ? `${totalCount} treinos salvos` : `${completionPercentage}% completas`}
            </p>
          </div>
          
          {/* Segment Control */}
          <div className="flex bg-secondary rounded-lg p-1">
            <Button
              variant={activeTab === 'aulas' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('aulas')}
              className="relative"
            >
              {activeTab === 'aulas' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Aulas</span>
            </Button>
            <Button
              variant={activeTab === 'conquistas' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('conquistas')}
              className="relative"
            >
              {activeTab === 'conquistas' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Conquistas</span>
            </Button>
          </div>
        </div>

        {/* Progress Banner */}
        <motion.div
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative z-10">
            <h2 className="text-xl font-medium text-white mb-2">
              {activeTab === 'aulas' ? 'Progresso Gera Resultados' : 'Conquistas Desbloqueadas'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 rounded-full h-2 flex-1">
                <motion.div 
                  className="bg-white rounded-full h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-white font-medium">{completionPercentage}%</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        {activeTab === 'aulas' && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Buscar em ${totalCount} aulas...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {['all', 'pending', 'completed', 'HIIT', 'Força', 'Cardio', 'Yoga', 'Dança'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="whitespace-nowrap"
                >
                  {filter === 'all' ? 'Todas' : 
                   filter === 'pending' ? 'Pendentes' :
                   filter === 'completed' ? 'Concluídas' : filter}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'aulas' ? (
            <motion.div
              key="aulas"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {filteredClasses.map((classe) => (
                <motion.div
                  key={classe.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-all duration-200 ${
                    classe.completed ? 'bg-muted/30' : 'bg-background/50'
                  }`}
                >
                  <Checkbox
                    checked={classe.completed}
                    onCheckedChange={() => handleToggleComplete(classe.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${classe.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {classe.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(classe.type)}`}>
                        {classe.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {classe.time} • {classe.instructor}
                      </span>
                      <span>{classe.duration} min</span>
                      <span className={`px-2 py-1 rounded text-xs ${getLevelColor(classe.level)}`}>
                        {classe.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShareClass(classe.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClass(classe.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClass(classe.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {filteredClasses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma aula encontrada</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="conquistas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {[
                { id: 1, title: '10 Aulas', progress: 10, max: 10, unlocked: true },
                { id: 2, title: '25 Aulas', progress: 10, max: 25, unlocked: false },
                { id: 3, title: '50 Aulas', progress: 10, max: 50, unlocked: false },
                { id: 4, title: '1ª Semana', progress: 7, max: 7, unlocked: true },
                { id: 5, title: '1º Mês', progress: 20, max: 30, unlocked: false },
                { id: 6, title: 'Consistente', progress: 5, max: 10, unlocked: false },
              ].map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className={`p-4 rounded-lg border text-center ${
                    achievement.unlocked 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-muted/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Award 
                    className={`h-8 w-8 mx-auto mb-2 ${
                      achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <h4 className="font-medium text-sm mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {achievement.progress}/{achievement.max}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button size="lg" className="rounded-full shadow-lg">
            <Plus className="h-5 w-5 mr-2" />
            Nova Aula
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AulasSalvas;
