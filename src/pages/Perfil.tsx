
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
  Bell
} from 'lucide-react';

// Mock data for the dashboard
const frequencyData = [
  { day: 'Seg', value: 45 },
  { day: 'Ter', value: 52 },
  { day: 'Qua', value: 38 },
  { day: 'Qui', value: 61 },
  { day: 'Sex', value: 70 },
  { day: 'Sáb', value: 85 },
  { day: 'Dom', value: 42 },
];

const vipMembers = [
  { name: 'Maria Silva', plan: 'Premium', lastAccess: '2h atrás' },
  { name: 'João Santos', plan: 'VIP', lastAccess: '1h atrás' },
  { name: 'Ana Costa', plan: 'Premium', lastAccess: '3h atrás' },
  { name: 'Carlos Lima', plan: 'VIP', lastAccess: '45min' },
  { name: 'Lucia Rocha', plan: 'Premium', lastAccess: '1h atrás' },
];

const Perfil: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('agendamentos');

  const handleAction = (action: string) => {
    toast({
      title: `${action} executado!`,
      description: `Ação "${action}" realizada com sucesso.`,
      className: "bg-green-500 text-white border-none",
    });
  };

  const actionButtons = [
    { icon: UserPlus, label: 'Adicionar Aluno', action: 'adicionar-aluno' },
    { icon: Bell, label: 'Enviar Notificação', action: 'enviar-notificacao' },
    { icon: TrendingUp, label: 'Relatório Diário', action: 'relatorio-diario' },
    { icon: Settings, label: 'Config. Equipamentos', action: 'config-equipamentos' },
  ];

  const tabs = [
    { id: 'agendamentos', label: 'Agendamentos' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'alertas', label: 'Alertas' },
  ];

  return (
    <MainLayout pageTitle="Perfil da Academia" pageSubtitle="Gestão completa da sua academia">
      {/* Header with vintage academy image */}
      <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            filter: 'sepia(30%) contrast(110%) grayscale(20%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <motion.h1 
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: 'Monaco, "Lucida Console", monospace', textShadow: '2px 2px 0px #000000' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            POWER FITNESS
          </motion.h1>
          <motion.p 
            className="text-xl text-red-500 font-bold"
            style={{ fontFamily: 'Monaco, "Lucida Console", monospace' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Desde 1992
          </motion.p>
        </div>
      </div>

      {/* Stats Section - No Cards */}
      <div className="grid grid-cols-3 gap-8 mb-8 p-6 bg-black/5 rounded-xl border-b-2 border-gray-300" style={{ fontFamily: 'Monaco, "Lucida Console", monospace' }}>
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-3xl font-bold text-black mb-1">45</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">Clientes Hoje</div>
        </motion.div>
        <motion.div 
          className="text-center border-l border-r border-gray-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-3xl font-bold text-black mb-1">R$ 2.300</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">Faturamento</div>
        </motion.div>
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-3xl font-bold text-black mb-1">3</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">Novos Cadastros</div>
        </motion.div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {actionButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <motion.div
              key={button.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleAction(button.label)}
                className="w-full h-24 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-sm"
                style={{
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  transform: 'none',
                  boxShadow: '4px 4px 0px #000000'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px #000000';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #000000';
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon size={24} />
                  <span className="text-xs leading-tight">{button.label}</span>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Highlights */}
      <div className="grid grid-cols-2 gap-8 mb-8" style={{ fontFamily: 'Monaco, "Lucida Console", monospace' }}>
        {/* Frequency Chart */}
        <motion.div
          className="bg-black p-6 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lime-400 text-lg mb-4 uppercase tracking-wider">
            Frequência Semanal
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={frequencyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#32CD32', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#32CD32', fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#32CD32" 
                strokeWidth={3}
                dot={{ fill: '#32CD32', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* VIP Members Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">
            Membros VIP
          </h3>
          <div className="space-y-1">
            {vipMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className={`p-3 flex justify-between items-center text-sm ${
                  index % 2 === 0 ? 'bg-green-50' : 'bg-pink-50'
                } border-l-4 border-gray-300`}
                whileHover={{ backgroundColor: '#f0f0f0', scale: 1.02 }}
              >
                <div>
                  <div className="font-bold text-black">{member.name}</div>
                  <div className="text-gray-600">{member.plan}</div>
                </div>
                <div className="text-gray-500 text-xs">{member.lastAccess}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Control Panel Tabs */}
      <div className="bg-gray-100 rounded-xl p-6" style={{ fontFamily: 'Monaco, "Lucida Console", monospace' }}>
        <div className="flex space-x-1 mb-6 border-b-2 border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm uppercase tracking-wide transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-black text-white border-b-4 border-red-500'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[200px]"
        >
          {activeTab === 'agendamentos' && (
            <div className="grid grid-cols-7 gap-2 text-sm">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((day) => (
                <div key={day} className="bg-white p-4 text-center border border-gray-300">
                  <div className="font-bold mb-2">{day}</div>
                  <div className="text-xs text-gray-600">08:00 - HIIT</div>
                  <div className="text-xs text-gray-600">10:00 - Yoga</div>
                  <div className="text-xs text-gray-600">18:00 - Crossfit</div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'financeiro' && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-green-100 p-4 border-l-4 border-green-500">
                  <div className="font-bold">Entradas</div>
                  <div className="text-lg">R$ 15.420,00</div>
                </div>
                <div className="bg-red-100 p-4 border-l-4 border-red-500">
                  <div className="font-bold">Saídas</div>
                  <div className="text-lg">R$ 8.230,00</div>
                </div>
                <div className="bg-blue-100 p-4 border-l-4 border-blue-500">
                  <div className="font-bold">Lucro</div>
                  <div className="text-lg">R$ 7.190,00</div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'alertas' && (
            <div className="space-y-3">
              {[
                'João Silva - Pagamento em atraso há 5 dias',
                'Equipamento Esteira 03 - Manutenção necessária',
                'Maria Santos - 15 dias sem treinar'
              ].map((alert, index) => (
                <div key={index} className="bg-yellow-200 p-3 border-l-4 border-yellow-500 text-sm">
                  ⚠️ {alert}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Perfil;
