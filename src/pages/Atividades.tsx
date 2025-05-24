
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Users, 
  DollarSign, 
  UserPlus, 
  Calendar,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Square,
  Play,
  Plus,
  History
} from 'lucide-react';

// Mock data for the page
const activityData = [
  { hour: '06', value: 4 },
  { hour: '08', value: 12 },
  { hour: '10', value: 18 },
  { hour: '12', value: 15 },
  { hour: '14', value: 22 },
  { hour: '16', value: 30 },
  { hour: '18', value: 35 },
  { hour: '20', value: 25 },
  { hour: '22', value: 10 },
];

const equipmentStatus = [
  { name: 'Esteira #1', status: 'operational' },
  { name: 'Esteira #2', status: 'maintenance', timeRemaining: '45min' },
  { name: 'Esteira #3', status: 'operational' },
  { name: 'Bicicleta #1', status: 'partial', issue: 'Sensor de batimentos' },
  { name: 'Elíptico #1', status: 'operational' },
  { name: 'Remo #1', status: 'operational' },
  { name: 'Multi-força #1', status: 'maintenance', timeRemaining: '2h' },
];

const scheduleData = [
  { id: 1, name: 'Yoga', color: '#800080', day: 'Seg', time: '08:00', duration: 60, room: 'Sala A' },
  { id: 2, name: 'Boxe', color: '#FF0000', day: 'Seg', time: '10:00', duration: 45, room: 'Sala B' },
  { id: 3, name: 'Pilates', color: '#4169E1', day: 'Ter', time: '09:00', duration: 50, room: 'Sala A' },
  { id: 4, name: 'Spinning', color: '#FF8C00', day: 'Ter', time: '18:00', duration: 45, room: 'Sala B' },
  { id: 5, name: 'Funcional', color: '#008000', day: 'Qua', time: '07:00', duration: 60, room: 'Sala C' },
  { id: 6, name: 'Zumba', color: '#FF1493', day: 'Qua', time: '19:00', duration: 60, room: 'Sala A' },
  { id: 7, name: 'Muay Thai', color: '#8B0000', day: 'Qui', time: '20:00', duration: 60, room: 'Sala B' },
  { id: 8, name: 'Yoga', color: '#800080', day: 'Sex', time: '08:00', duration: 60, room: 'Sala A' },
  { id: 9, name: 'Crossfit', color: '#4B0082', day: 'Sex', time: '17:00', duration: 45, room: 'Sala C' },
];

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

const Atividades: React.FC = () => {
  const { toast } = useToast();
  const [activeClasses, setActiveClasses] = useState(3);
  const [freeEquipment, setFreeEquipment] = useState(15);
  const [checkIns, setCheckIns] = useState(activityData);

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Update check-ins with random data
      setCheckIns(prev => {
        return prev.map(item => ({
          ...item,
          value: Math.max(0, item.value + Math.floor(Math.random() * 7) - 3)
        }));
      });

      // Randomly update free equipment count
      setFreeEquipment(prev => Math.min(20, Math.max(5, prev + Math.floor(Math.random() * 3) - 1)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: string) => {
    let message = '';
    switch(action) {
      case 'start':
        message = 'Aula iniciada! Notificação enviada aos alunos.';
        break;
      case 'stop':
        message = 'Todas as atividades foram interrompidas!';
        break;
      case 'emergency':
        message = 'Protocolo de emergência ativado!';
        break;
      case 'export':
        message = 'Dados exportados com sucesso!';
        break;
      case 'history':
        message = 'Carregando histórico de 24h...';
        break;
      case 'new':
        message = 'Nova atividade adicionada com sucesso!';
        break;
    }
    
    toast({
      title: message,
      className: "bg-green-500 text-white border-none",
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'operational':
        return <span className="text-green-500">✅</span>;
      case 'maintenance':
        return <span className="text-red-500 animate-pulse">🛑</span>;
      case 'partial':
        return <span className="text-yellow-500 animate-pulse">⚠️</span>;
      default:
        return null;
    }
  };

  const getActivityForSlot = (day: string, time: string) => {
    return scheduleData.find(activity => activity.day === day && activity.time === time);
  };

  return (
    <MainLayout pageTitle="Atividades Ao Vivo" pageSubtitle="Monitoramento de atividades da academia">
      {/* Header with vintage gym image */}
      <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80')`,
            filter: 'blur(0.5px) hue-rotate(-10deg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)'
          }}
        />
        <div className="absolute bottom-6 left-6 text-white">
          <motion.h1 
            className="text-4xl font-bold mb-2"
            style={{ 
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #000000, 3px 3px 0px #0000FF'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ATIVIDADES AO VIVO
          </motion.h1>
        </div>
      </div>

      {/* Stats Section - LED Display */}
      <div 
        className="grid grid-cols-3 gap-8 mb-8 p-6 bg-black rounded-xl"
        style={{ fontFamily: 'monospace' }}
      >
        <motion.div 
          className="text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-2xl font-bold text-green-500 mb-1">
            Aulas em Andamento: {activeClasses}
          </div>
          <div className="text-sm text-green-400">
            Spinning (Sala B) | 15 alunos<br />
            Yoga (Sala A) | 8 alunos<br />
            Funcional (Sala C) | 12 alunos
          </div>
        </motion.div>

        <motion.div className="text-center flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-green-500 mb-1">
            Equipamentos Livres: {freeEquipment}/25
          </div>
          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-gray-500 to-gray-300"
              style={{ width: `${(freeEquipment/25) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${(freeEquipment/25) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-sm text-green-400 mt-2">
            🏋️ 5/10 | 🤸 8/10 | 🚶‍♂️ 2/5
          </div>
        </motion.div>

        <motion.div className="text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">Check-ins Última Hora</div>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={checkIns}>
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
        </motion.div>
      </div>

      {/* Schedule Grid */}
      <div 
        className="mb-8 bg-gray-100 p-4 rounded-xl border-2 border-black"
        style={{ fontFamily: 'monospace' }}
      >
        <h2 className="text-xl font-bold mb-4">Grade de Horários</h2>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => (
            <div key={day} className="font-bold text-center bg-black text-white p-2">
              {day}
            </div>
          ))}

          {daysOfWeek.map(day => (
            timeSlots.map(time => {
              const activity = getActivityForSlot(day, time);
              return (
                <motion.div 
                  key={`${day}-${time}`} 
                  className={`p-2 h-24 border text-xs ${activity ? 'border-2' : 'border-gray-300 bg-gray-200'}`}
                  style={{
                    backgroundColor: activity ? activity.color : '',
                    borderColor: activity ? `${activity.color}` : '',
                    color: activity ? 'white' : 'black',
                    cursor: activity ? 'pointer' : 'default'
                  }}
                  whileHover={activity ? { scale: 1.05, boxShadow: '0 0 8px rgba(0,0,0,0.3)' } : {}}
                  onClick={() => activity && handleAction('edit')}
                >
                  <div className="flex flex-col h-full justify-between">
                    <span>{time}</span>
                    {activity && (
                      <>
                        <span className="font-bold">{activity.name}</span>
                        <span>{activity.room} - {activity.duration}min</span>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>Controle de Aulas</h2>
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              className="bg-black text-green-500 border-2 border-green-500 p-4 rounded-md font-mono flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: '#003300' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('start')}
            >
              <Play size={20} />
              <span>Iniciar Aula</span>
            </motion.button>

            <motion.button
              className="bg-black text-red-500 border-2 border-red-500 p-4 rounded-md font-mono flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: '#330000' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('stop')}
            >
              <Square size={20} />
              <span>Encerrar Tudo</span>
            </motion.button>

            <motion.button
              className="bg-black text-yellow-500 border-2 border-yellow-500 p-4 rounded-md font-mono flex items-center justify-center gap-2 animate-pulse"
              whileHover={{ scale: 1.05, backgroundColor: '#332200' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('emergency')}
            >
              <Bell size={20} />
              <span>Emergência</span>
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>Gestão</h2>
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              className="bg-black text-blue-500 border-2 border-blue-500 p-4 rounded-md font-mono flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: '#000033' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('export')}
            >
              <DollarSign size={20} />
              <span>Exportar Dados</span>
            </motion.button>

            <motion.button
              className="bg-black text-purple-500 border-2 border-purple-500 p-4 rounded-md font-mono flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: '#220033' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('history')}
            >
              <History size={20} />
              <span>Histórico 24h</span>
            </motion.button>

            <motion.button
              className="bg-black text-green-300 border-2 border-green-300 p-4 rounded-md font-mono flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: '#003322' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('new')}
            >
              <Plus size={20} />
              <span>Nova Atividade</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div 
        className="mb-8 bg-black p-6 rounded-xl text-green-500"
        style={{ fontFamily: 'monospace' }}
      >
        <h2 className="text-xl font-bold mb-4 border-b border-green-500 pb-2">Monitoramento de Equipamentos</h2>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-auto pr-2 custom-scrollbar">
          {equipmentStatus.map((equip, index) => (
            <motion.div 
              key={equip.name}
              className="flex justify-between items-center p-2 border-l-4"
              style={{ 
                borderColor: 
                  equip.status === 'operational' ? '#00FF00' : 
                  equip.status === 'maintenance' ? '#FF0000' : 
                  '#FFFF00'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(equip.status)}
                <span>{equip.name}</span>
              </div>
              <div>
                {equip.status === 'maintenance' && (
                  <span className="text-red-500">Manutenção: {equip.timeRemaining}</span>
                )}
                {equip.status === 'partial' && (
                  <span className="text-yellow-500">{equip.issue}</span>
                )}
                {equip.status === 'operational' && (
                  <span className="text-green-500">Operacional</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer System Status */}
      <div 
        className="bg-gray-100 p-4 rounded-xl border-t-2 border-gray-300 flex justify-between items-center"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">🕒</span>
            <span>Última Sincronização: 15s</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">📶</span>
            <span>45 Dispositivos Conectados</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">🔋</span>
          <span>Bateria:</span>
          <div className="w-24 h-4 bg-gray-300 rounded overflow-hidden">
            <motion.div 
              className="h-full bg-green-500"
              style={{ width: '78%' }}
              animate={{
                width: ['78%', '75%', '78%']
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          <span>78%</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Atividades;
