
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Play,
  Square,
  Save,
  PlusCircle,
  FileDown,
  Clock,
  ChevronRight
} from 'lucide-react';

// Mock data
const programData = [
  {
    id: 1,
    name: 'Programa Básico',
    progress: 52,
    members: 23,
    color: '#32CD32',
    updates: [
      { date: '10/05', value: 48 },
      { date: '11/05', value: 52 },
      { date: '12/05', value: 49 },
      { date: '13/05', value: 51 },
      { date: '14/05', value: 54 },
      { date: '15/05', value: 56 },
      { date: '16/05', value: 52 },
    ]
  },
  {
    id: 2,
    name: 'Hipertrofia 90',
    progress: 75,
    members: 15,
    color: '#FF4500',
    updates: [
      { date: '10/05', value: 69 },
      { date: '11/05', value: 72 },
      { date: '12/05', value: 74 },
      { date: '13/05', value: 75 },
      { date: '14/05', value: 71 },
      { date: '15/05', value: 73 },
      { date: '16/05', value: 75 },
    ]
  },
  {
    id: 3,
    name: 'Emagrecimento Express',
    progress: 60,
    members: 18,
    color: '#4169E1',
    updates: [
      { date: '10/05', value: 55 },
      { date: '11/05', value: 57 },
      { date: '12/05', value: 58 },
      { date: '13/05', value: 62 },
      { date: '14/05', value: 59 },
      { date: '15/05', value: 58 },
      { date: '16/05', value: 60 },
    ]
  }
];

const updatesFeed = [
  { time: '14:30', message: 'Programa "Força Máxima" atualizado (v2.1)' },
  { time: '14:45', message: 'Novo membro no "Hipertrofia 90" (Carlos)' },
  { time: '15:00', message: 'Alerta: 2 membros abaixo da meta no "Básico"' },
  { time: '15:15', message: 'Atualizando métricas do "Emagrecimento Express"' },
  { time: '15:30', message: 'Backup automático completo (2.4MB)' },
  { time: '15:45', message: 'Check-in de 5 membros no "Hipertrofia 90"' },
];

const metaData = [
  { name: 'Ativo', value: 56 },
  { name: 'Inativo', value: 44 },
];

const COLORS = ['#00FF00', '#d3d3d3'];

const Programas: React.FC = () => {
  const { toast } = useToast();
  const [activeProgram, setActiveProgram] = useState<number | null>(null);
  const [programsActive, setProgramsActive] = useState(3);
  const [totalHours, setTotalHours] = useState(1230);
  const [newAdhesions, setNewAdhesions] = useState(85);
  const [selectedProgramName, setSelectedProgramName] = useState('');

  const handleAction = (action: string) => {
    let message = '';
    switch(action) {
      case 'start':
        setActiveProgram(1);
        message = 'Ciclo de programas iniciado!';
        break;
      case 'stop':
        setActiveProgram(null);
        message = 'Todos os programas foram interrompidos!';
        break;
      case 'export':
        message = 'Dados exportados para o seu dispositivo!';
        break;
      default:
        message = `Ação "${action}" executada!`;
    }
    
    toast({
      title: message,
      className: "bg-green-500 text-white border-none",
    });
  };

  const handleProgramClick = (program: any) => {
    setSelectedProgramName(program.name);
    toast({
      title: `Detalhes de "${program.name}" abertos`,
      description: `${program.members} membros ativos | Progresso: ${program.progress}%`,
      className: "bg-black text-green-400 border-green-500 border-2",
    });
  };

  // Simulate ASCII bar chart
  const getASCIIProgress = (progress: number) => {
    const fullBlocks = Math.floor(progress / 10);
    let result = '';
    for (let i = 0; i < 10; i++) {
      if (i < fullBlocks) {
        result += '▓';
      } else {
        result += '░';
      }
    }
    return result;
  };

  // Simulate cursor blink
  const [showCursor, setShowCursor] = useState(true);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout pageTitle="Programas de Treino" pageSubtitle="Gestão dos programas de treino da academia">
      {/* Header with vintage fitness image */}
      <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1598136490937-f77b0ce520fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80')`,
            filter: 'sepia(70%) contrast(130%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent calc(100% - 1px), #00BFFF calc(100% - 1px)), linear-gradient(90deg, transparent calc(100% - 1px), #00BFFF calc(100% - 1px))',
            backgroundSize: '20% 20%'
          }}
        />
        <div className="absolute bottom-6 left-6 text-silver">
          <motion.h1 
            className="text-4xl font-bold mb-2"
            style={{ 
              fontFamily: 'monospace',
              color: '#C0C0C0',
              textShadow: '2px 2px 0px #000000'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            PROGRAMAS ATIVOS • 2024
          </motion.h1>
          <div className="w-48 h-1 bg-[#32CD32]" />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {programData.map((program) => (
          <motion.div
            key={program.id}
            className="bg-black p-6 rounded-xl text-green-500 border-2 border-gray-800"
            whileHover={{ 
              borderColor: program.color,
              boxShadow: `0 0 15px ${program.color}40`
            }}
            onClick={() => handleProgramClick(program)}
            style={{ fontFamily: 'monospace', cursor: 'pointer' }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">{program.name}</h3>
            
            {program.id === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Barra de progresso horizontal:</p>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full"
                    style={{ 
                      width: `${program.progress}%`,
                      backgroundColor: program.color
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${program.progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="flex justify-between">
                  <span>{program.progress}% Concluído</span>
                  <span>{program.members} Membros</span>
                </div>
              </div>
            )}

            {program.id === 2 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Medidor circular tipo relógio:</p>
                <div className="relative h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: program.progress },
                          { name: 'Remaining', value: 100 - program.progress }
                        ]}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        <Cell fill={program.color} />
                        <Cell fill="#333333" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: program.progress * 3.6 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      style={{
                        height: '50%',
                        width: '2px',
                        backgroundColor: 'red',
                        transformOrigin: 'bottom center',
                        position: 'absolute',
                        bottom: '50%',
                      }}
                    />
                    <span className="text-xl font-bold">45min</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Média Diária</span>
                  <span>{program.members} Membros</span>
                </div>
              </div>
            )}

            {program.id === 3 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Gráfico de barras ASCII:</p>
                <div className="font-mono text-2xl text-center my-6">
                  {getASCIIProgress(program.progress)}
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span>Taxa Sucesso: {program.progress}%</span>
                    <span>{program.members} Membros</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Control Buttons */}
      <div 
        className="grid grid-cols-1 gap-4 mb-8 bg-gray-200 p-6 rounded-xl border-2 border-gray-400"
        style={{ 
          fontFamily: 'monospace',
          backgroundImage: 'url(/brushed-metal.png)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <h2 className="text-xl font-bold mb-4">Controles de Programa</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <motion.button
            className="bg-black p-4 rounded-md flex items-center justify-center gap-2 border-2 border-green-500 text-green-500"
            whileHover={{ scale: 1.05, backgroundColor: '#001100' }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => handleAction('start')}
          >
            <Play size={20} />
            <span>Iniciar Ciclo</span>
          </motion.button>

          <motion.button
            className="bg-black p-4 rounded-md flex items-center justify-center gap-2 border-2 border-red-500 text-red-500"
            whileHover={{ scale: 1.05, backgroundColor: '#110000' }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => handleAction('stop')}
          >
            <Square size={20} />
            <span>Parar Tudo</span>
          </motion.button>

          <motion.button
            className="bg-black p-4 rounded-md flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500"
            whileHover={{ scale: 1.05, backgroundColor: '#000011' }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => handleAction('export')}
          >
            <FileDown size={20} />
            <span>Exportar Dados</span>
          </motion.button>
        </div>
        
        <div className="relative">
          <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-gray-400 border border-gray-600" style={{ boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)' }}></div>
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gray-400 border border-gray-600" style={{ boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)' }}></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-gray-400 border border-gray-600" style={{ boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)' }}></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-gray-400 border border-gray-600" style={{ boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)' }}></div>
        </div>
      </div>

      {/* Stats and Editor */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Stats */}
        <motion.div
          className="bg-black p-6 rounded-xl text-green-500"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Estatísticas em Tempo Real</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-yellow-500 text-xl mb-1">Programas Ativos: {programsActive}</p>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metaData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      fill="#00FF00"
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {metaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Horas Totais/Mês: {totalHours}h</p>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={programData[0].updates}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#32CD32" 
                      strokeWidth={2}
                      dot={{ fill: '#32CD32' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Novas Adesões:</p>
              <div className="flex items-center">
                <div className="text-xl font-mono tracking-widest">
                  {Array(10).fill(0).map((_, i) => (
                    <span key={i} className={i < Math.floor(newAdhesions/10) ? "text-green-500" : "text-gray-700"}>
                      ▒
                    </span>
                  ))}
                </div>
                <span className="ml-2">{newAdhesions}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor */}
        <motion.div
          className="bg-gray-100 p-6 rounded-xl border-2 border-gray-300"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Editor de Programas</h2>
            <div className="flex gap-4">
              <span className="text-sm">⌘ + N: Novo Bloco</span>
              <span className="text-sm">⌘ + S: Salvar na Fita</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-400 p-4 rounded-md h-40 mb-4 font-courier text-sm overflow-auto">
            <p>{selectedProgramName || 'Clique em um programa para editar'}</p>
            {selectedProgramName && (
              <>
                <p className="mt-2">// Configurações do programa</p>
                <p>duração = 12 semanas;</p>
                <p>frequência = 4x por semana;</p>
                <p>intensidade = progressiva;</p>
                <p>método = "periodização linear";</p>
                <p className="text-green-600">// Edite os valores acima para ajustar o programa</p>
                <span className={`inline-block w-2 h-4 bg-black ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
              </>
            )}
          </div>
          
          <div className="flex justify-between">
            <motion.button
              className="bg-black text-white px-4 py-2 rounded-md font-mono flex items-center gap-2"
              whileHover={{ backgroundColor: '#333' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (selectedProgramName) {
                  toast({
                    title: "Programa salvo!",
                    description: `Alterações em "${selectedProgramName}" salvas com sucesso`,
                    className: "bg-green-500 text-white",
                  });
                }
              }}
              disabled={!selectedProgramName}
            >
              <Save size={16} />
              <span>Salvar</span>
            </motion.button>
            
            <motion.button
              className="bg-black text-white px-4 py-2 rounded-md font-mono flex items-center gap-2"
              whileHover={{ backgroundColor: '#333' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedProgramName('Novo Programa');
                toast({
                  title: "Novo programa criado",
                  description: "Configure os parâmetros do novo programa",
                  className: "bg-blue-500 text-white",
                });
              }}
            >
              <PlusCircle size={16} />
              <span>Novo</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Updates Feed and System Status */}
      <div className="grid grid-cols-1 gap-8 mb-4">
        {/* Updates Feed */}
        <motion.div
          className="bg-black p-6 rounded-xl text-green-500 border border-green-900"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4 border-b border-green-900 pb-2">Feed de Atualizações</h2>
          
          <div className="space-y-2">
            {updatesFeed.map((update, index) => (
              <motion.div
                key={index}
                className="flex"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-gray-500 mr-2">{update.time} •</span>
                <span>{update.message}</span>
              </motion.div>
            ))}
            <div className="flex">
              <span className="text-gray-500 mr-2">16:00 •</span>
              <span className="flex">
                Aguardando novas atualizações
                <span className={`inline-block w-2 h-4 bg-green-500 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          className="bg-gray-100 p-4 rounded-xl border border-gray-300"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>💾</span>
                <span className="text-sm">1.2MB Livres</span>
                <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <span>📶</span>
                <span className="text-sm">85% Uso da Rede</span>
                <div className="relative w-6 h-6">
                  <motion.div
                    className="absolute bottom-0 left-0 w-1 bg-green-500 rounded-t"
                    animate={{ height: ['60%', '85%', '70%', '85%'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ height: '85%' }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-2 w-1 bg-green-500 rounded-t"
                    animate={{ height: ['70%', '90%', '85%', '75%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ height: '75%' }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-4 w-1 bg-green-500 rounded-t"
                    animate={{ height: ['80%', '65%', '85%', '80%'] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    style={{ height: '85%' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span>🕒</span>
              <span className="text-sm">Último Backup: 24/06 23:59</span>
              <motion.div 
                className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Programas;
