
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Star,
  Gift,
  TrendingUp,
  Award,
  Plus,
  History,
  Settings as SettingsIcon
} from 'lucide-react';

// Mock data
const loyaltyStats = {
  totalPoints: 12450,
  activeMembers: 85,
  totalMembers: 100,
  redemptionRate: 73
};

const tiers = [
  { name: 'Bronze', emoji: '🥉', threshold: 0, benefits: ['Desconto 5%', 'Acesso básico'] },
  { name: 'Prata', emoji: '🥈', threshold: 5000, benefits: ['Desconto 10%', 'Aula experimental grátis'] },
  { name: 'Ouro', emoji: '🏅', threshold: 15000, benefits: ['Desconto 20%', 'Acesso à sauna grátis', 'Personal trainer 1x/mês'] }
];

const members = [
  { name: 'Ana Silva', points: 8420, tier: 'Prata', lastActivity: '2h atrás', nextTier: 6580 },
  { name: 'Carlos Lima', points: 15680, tier: 'Ouro', lastActivity: '1h atrás', nextTier: 0 },
  { name: 'Maria Santos', points: 3200, tier: 'Bronze', lastActivity: '3h atrás', nextTier: 1800 },
  { name: 'João Costa', points: 12100, tier: 'Prata', lastActivity: '45min', nextTier: 2900 },
  { name: 'Lucia Rocha', points: 18900, tier: 'Ouro', lastActivity: '30min', nextTier: 0 }
];

const prizes = [
  { name: 'Camiseta Vintage', points: 2000, image: '👕', available: true },
  { name: 'Mês Grátis', points: 5000, image: '🏋️', available: true },
  { name: 'Personal Trainer', points: 8000, image: '💪', available: true },
  { name: 'Kit Suplementos', points: 3500, image: '🥤', available: false },
];

const ProgramaFidelidade: React.FC = () => {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const handleAddPoints = () => {
    const member = prompt('Digite o ID do membro:');
    const points = prompt('Digite a quantidade de pontos:');
    
    if (member && points) {
      toast({
        title: "Pontos adicionados! ⭐",
        description: `${points} pontos adicionados para ${member}`,
        className: "bg-yellow-500 text-black border-none font-mono",
      });
    }
  };

  const handleRedeemPrize = (prizeName: string, points: number) => {
    toast({
      title: "Prêmio resgatado! 🎁",
      description: `${prizeName} resgatado por ${points} pontos`,
      className: "bg-green-500 text-white border-none font-mono",
    });
  };

  const handleHistory = () => {
    toast({
      title: "Carregando histórico... 📜",
      description: "Visualizando atividades recentes",
      className: "bg-blue-500 text-white border-none font-mono",
    });
  };

  const handleConfigRules = () => {
    toast({
      title: "Configurações abertas ⚙️",
      description: "Editando regras do programa",
      className: "bg-purple-500 text-white border-none font-mono",
    });
  };

  return (
    <MainLayout pageTitle="Programa de Fidelidade" pageSubtitle="Sistema de recompensas da sua academia">
      {/* Header with vintage 80s gym image */}
      <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            filter: 'sepia(30%) contrast(110%) grayscale(20%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center px-8 py-4 bg-black/70 rounded-lg border-2 border-cyan-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-5xl font-bold text-white mb-2 tracking-wider uppercase"
              style={{ 
                fontFamily: 'Chicago, monospace', 
                textShadow: '2px 2px 0px #000000, 0 0 10px #00BFFF' 
              }}
            >
              PROGRAMA FIDELIDADE
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Points System Stats */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <motion.div 
          className="text-center p-6 bg-black rounded-lg border-2 border-lime-400"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px #32CD32' }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="text-4xl font-bold text-lime-400 mb-2 font-mono"
            style={{ textShadow: '0 0 10px #32CD32' }}
          >
            {loyaltyStats.totalPoints.toLocaleString()}
          </div>
          <div className="text-gray-300 uppercase tracking-wide text-sm font-mono">
            Total de Pontos
          </div>
        </motion.div>

        <motion.div 
          className="text-center p-6 bg-black rounded-lg border-2 border-yellow-400"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px #FFD700' }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="text-4xl font-bold text-yellow-400 mb-2 font-mono"
            style={{ textShadow: '0 0 10px #FFD700' }}
          >
            {loyaltyStats.activeMembers}/{loyaltyStats.totalMembers}
          </div>
          <div className="text-gray-300 uppercase tracking-wide text-sm font-mono">
            Membros Ativos
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(loyaltyStats.activeMembers / loyaltyStats.totalMembers) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div 
          className="text-center p-6 bg-black rounded-lg border-2 border-red-400"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px #FF0000' }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="text-4xl font-bold text-red-400 mb-2 font-mono"
            style={{ textShadow: '0 0 10px #FF0000' }}
          >
            {loyaltyStats.redemptionRate}% ↑
          </div>
          <div className="text-gray-300 uppercase tracking-wide text-sm font-mono">
            Taxa de Resgate
          </div>
        </motion.div>
      </div>

      {/* Loyalty Tiers */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-600 hover:border-cyan-400 transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(0, 191, 255, 0.5)',
              rotateY: 5
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{tier.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase">
                {tier.name}
              </h3>
              <div className="text-cyan-400 text-sm mb-4 font-mono">
                {tier.threshold > 0 ? `${tier.threshold}+ pontos` : 'Inicial'}
              </div>
              <div className="space-y-1">
                {tier.benefits.map((benefit, idx) => (
                  <div key={idx} className="text-gray-300 text-xs font-mono">
                    • {benefit}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: Plus, label: 'Adicionar Pontos', action: handleAddPoints, color: 'border-yellow-400' },
          { icon: Gift, label: 'Resgatar Prêmio', action: () => {}, color: 'border-green-400' },
          { icon: History, label: 'Histórico', action: handleHistory, color: 'border-blue-400' },
          { icon: SettingsIcon, label: 'Configurar Regras', action: handleConfigRules, color: 'border-purple-400' },
        ].map((button, index) => {
          const Icon = button.icon;
          return (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                onClick={button.action}
                className={`w-full h-20 bg-black text-white border-2 ${button.color} hover:bg-gray-900 transition-all duration-300 font-mono text-sm`}
                style={{
                  transform: 'none',
                  boxShadow: '4px 4px 0px #00BFFF'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px #00BFFF';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #00BFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #00BFFF';
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon size={20} />
                  <span className="text-xs leading-tight">{button.label}</span>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Members List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 font-mono uppercase tracking-wider text-white bg-black p-3 rounded-t-lg">
          Lista de Membros
        </h3>
        <div className="bg-gray-100 rounded-b-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-3 bg-gray-800 text-white font-mono text-sm font-bold">
            <div>Nome</div>
            <div>Pontos</div>
            <div>Nível</div>
            <div>Última Atividade</div>
          </div>
          <div className="space-y-1">
            {members.map((member, index) => (
              <motion.div
                key={member.name}
                className={`grid grid-cols-4 gap-4 p-3 font-mono text-sm cursor-pointer transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-green-50' : 'bg-pink-50'
                } ${member.nextTier > 0 && member.nextTier < 3000 ? 'border-l-4 border-orange-500' : ''}`}
                whileHover={{ 
                  backgroundColor: '#f0f0f0', 
                  scale: 1.02,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                onClick={() => setSelectedMember(selectedMember === member.name ? null : member.name)}
              >
                <div className="font-bold text-black">{member.name}</div>
                <div className="text-blue-600 font-bold">{member.points.toLocaleString()}</div>
                <div className="text-gray-700">{member.tier}</div>
                <div className="text-gray-500">{member.lastActivity}</div>
                
                {selectedMember === member.name && (
                  <motion.div 
                    className="col-span-4 mt-2 p-3 bg-gray-200 rounded text-xs"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {member.nextTier > 0 ? (
                      <div>Faltam <strong>{member.nextTier}</strong> pontos para o próximo nível</div>
                    ) : (
                      <div>Nível máximo atingido! 🏆</div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Prize Gallery */}
      <div>
        <h3 className="text-xl font-bold mb-4 font-mono uppercase tracking-wider text-white bg-black p-3 rounded-t-lg">
          Galeria de Prêmios
        </h3>
        <div className="grid grid-cols-4 gap-6 p-6 bg-gray-100 rounded-b-lg">
          {prizes.map((prize, index) => (
            <motion.div
              key={prize.name}
              className={`relative p-4 bg-white rounded-lg shadow-lg transform transition-all duration-300 ${
                prize.available ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                transform: `rotate(${(index % 2 === 0 ? -2 : 2)}deg)`,
                filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
              }}
              whileHover={prize.available ? {
                rotate: 0,
                scale: 1.1,
                zIndex: 10
              } : {}}
              onClick={() => prize.available && handleRedeemPrize(prize.name, prize.points)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{prize.image}</div>
                <h4 className="font-bold text-sm mb-1 font-mono">{prize.name}</h4>
                <div className="text-xs text-gray-600 font-mono">
                  {prize.points.toLocaleString()} pontos
                </div>
                {!prize.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <span className="text-white font-bold text-xs">ESGOTADO</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProgramaFidelidade;
