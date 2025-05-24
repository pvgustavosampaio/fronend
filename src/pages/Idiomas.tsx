
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";

// Language data for the page
const availableLanguages = [
  { code: 'EN', name: 'Inglês', flag: '🇺🇸', usage: 62 },
  { code: 'ES', name: 'Espanhol', flag: '🇪🇸', usage: 25 },
  { code: 'FR', name: 'Francês', flag: '🇫🇷', usage: 8 },
  { code: 'DE', name: 'Alemão', flag: '🇩🇪', usage: 5 },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹', usage: 0 },
  { code: 'JP', name: 'Japonês', flag: '🇯🇵', usage: 0 },
  { code: 'RU', name: 'Russo', flag: '🇷🇺', usage: 0 },
  { code: 'CH', name: 'Chinês', flag: '🇨🇳', usage: 0 },
];

// Recent activity logs
const activityLogs = [
  { time: '15:30', message: 'PT-BR adicionado ao perfil 23' },
  { time: '14:45', message: 'EN-US removido de 2 alunos' },
  { time: '13:20', message: 'ES-ES adicionado a 5 perfis' },
  { time: '11:15', message: 'Interface atualizada para FR-FR' },
];

const Idiomas: React.FC = () => {
  const { toast: uiToast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('PT');
  const [displayText, setDisplayText] = useState('Bem-vindo');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '> Sistema de idiomas carregado.',
    '> Digite /help para ver os comandos disponíveis.'
  ]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangName, setNewLangName] = useState('');

  // Handle language selection
  const handleLanguageSelect = (code: string) => {
    setLoading(true);
    
    setTimeout(() => {
      setSelectedLanguage(code);
      
      // Update welcome text based on language
      switch(code) {
        case 'EN': setDisplayText('Welcome'); break;
        case 'ES': setDisplayText('Bienvenido'); break;
        case 'FR': setDisplayText('Bienvenue'); break;
        case 'DE': setDisplayText('Willkommen'); break;
        case 'IT': setDisplayText('Benvenuto'); break;
        case 'JP': setDisplayText('ようこそ'); break;
        case 'RU': setDisplayText('Добро пожаловать'); break;
        case 'CH': setDisplayText('欢迎'); break;
        default: setDisplayText('Bem-vindo');
      }
      
      setLoading(false);
      
      // Show success message
      toast.success(`Idioma alterado para ${code}`, {
        position: "top-center"
      });
    }, 800);
  };

  // Handle terminal commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terminalInput.trim()) return;
    
    const commandHistory = `> ${terminalInput}`;
    let response = '';
    
    // Process commands
    if (terminalInput.startsWith('/setlang')) {
      const lang = terminalInput.split(' ')[1]?.toUpperCase();
      if (lang && availableLanguages.some(l => l.code === lang)) {
        handleLanguageSelect(lang);
        response = `> Idioma padrão alterado para ${lang}`;
      } else {
        response = '> ERRO: Código de idioma inválido. Use /help para ver os códigos disponíveis.';
      }
    } 
    else if (terminalInput === '/help') {
      response = `
> Comandos disponíveis:
> /setlang [CÓDIGO] - Define o idioma (ex: /setlang EN)
> /export - Exporta dados de idioma
> /stats - Mostra estatísticas de uso
> /clear - Limpa o terminal`;
    }
    else if (terminalInput === '/clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    }
    else if (terminalInput === '/export') {
      response = '> Exportando dados... Arquivo idiomas.csv gerado.';
      setTimeout(() => {
        uiToast({
          title: "Exportação completa",
          description: "Arquivo salvo na pasta Downloads",
        });
      }, 1500);
    }
    else if (terminalInput === '/stats') {
      response = `
> Estatísticas de Uso de Idioma:
> Português: 100%
> Inglês: ${availableLanguages[0].usage}%
> Espanhol: ${availableLanguages[1].usage}%
> Francês: ${availableLanguages[2].usage}%
> Alemão: ${availableLanguages[3].usage}%`;
    }
    else {
      response = '> Comando não reconhecido. Digite /help para ver a lista de comandos.';
    }
    
    setTerminalHistory(prev => [...prev, commandHistory, response]);
    setTerminalInput('');
    
    // Auto-scroll terminal to bottom
    setTimeout(() => {
      const terminal = document.getElementById('terminal-output');
      if (terminal) terminal.scrollTop = terminal.scrollHeight;
    }, 100);
  };

  // Handle "Add Language" button
  const handleAddLanguageClick = () => {
    setShowModal(true);
  };
  
  // Handle adding a new language
  const handleAddLanguage = () => {
    if (newLangCode && newLangName) {
      toast.success(`Idioma ${newLangName} (${newLangCode}) adicionado`, {
        position: "top-center",
      });
      setShowModal(false);
      setNewLangCode('');
      setNewLangName('');
      
      // Add to terminal history
      setTerminalHistory(prev => [
        ...prev, 
        `> Novo idioma adicionado: ${newLangCode} (${newLangName})`
      ]);
    }
  };
  
  // Sound effect for button clicks
  const playKeySound = () => {
    try {
      const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {
      console.error("Audio playback failed:", e);
    }
  };

  return (
    <MainLayout 
      pageTitle="Idiomas" 
      pageSubtitle="Configurações de idioma e preferências regionais para o sistema"
      headerImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    >
      {/* Title with retro styling */}
      <motion.h1 
        className="text-3xl font-bold mb-6 text-transparent bg-clip-text"
        style={{ 
          fontFamily: 'monospace', 
          textShadow: '3px 3px 0px #FF0000, -3px -3px 0px #0000FF',
          color: '#00BFFF'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        IDIOMAS & PREFERÊNCIAS
      </motion.h1>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language selection grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black p-6 rounded-lg border-2 border-[#32CD32]"
        >
          <h2 className="text-[#00FF00] font-mono text-xl mb-4 uppercase tracking-wider">
            Seleção de Idioma
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {availableLanguages.map((lang) => (
              <motion.button
                key={lang.code}
                className={`p-3 border-2 ${
                  selectedLanguage === lang.code 
                    ? 'bg-[#000033] border-[#00FF00] text-[#00FF00]' 
                    : 'bg-black border-[#32CD32] text-white hover:border-[#00FF00]'
                } font-mono text-left flex items-center justify-between relative`}
                style={{ 
                  boxShadow: selectedLanguage === lang.code ? '0 0 10px #00FF00' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  playKeySound();
                  handleLanguageSelect(lang.code);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <span className="text-2xl mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                
                {selectedLanguage === lang.code && (
                  <span className="text-[#00FF00] font-bold">✓</span>
                )}
                
                {lang.usage > 0 && (
                  <span className="absolute top-0 right-0 text-xs bg-[#333333] px-2 py-0.5 rounded-bl">
                    {lang.usage}%
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Statistics and real-time display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#111111] p-6 rounded-lg border-2 border-[#C0C0C0]"
        >
          <h2 className="text-[#FFD700] font-mono text-xl mb-4">
            Estatísticas em Tempo Real
          </h2>
          
          <div className="mb-4">
            <div className="text-white font-mono">Alunos Multilíngues Hoje:</div>
            <div className="text-[#FFD700] font-mono text-3xl mt-1 font-bold">23</div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-6">
            <div className="text-white font-mono text-sm mb-1">Progresso de Internacionalização:</div>
            <div className="w-full bg-black h-5 border border-[#C0C0C0] relative">
              <div 
                className="h-full bg-[#C0C0C0]" 
                style={{ width: '45%' }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-black font-mono font-bold">
                45%
              </div>
            </div>
          </div>
          
          {/* Activity log */}
          <div>
            <div className="text-white font-mono text-sm mb-2">Últimas Atualizações:</div>
            <div className="font-mono text-[#00FF00] text-xs space-y-1 max-h-[100px] overflow-y-auto">
              {activityLogs.map((log, index) => (
                <div key={index} className="flex">
                  <span className="text-[#C0C0C0] mr-2">{log.time}:</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          {[
            { label: "Adicionar Idioma", icon: "🌐", action: handleAddLanguageClick },
            { label: "Exportar Dados", icon: "💾", action: () => {
              playKeySound();
              setTerminalHistory(prev => [...prev, "> /export", "> Exportando dados... Arquivo idiomas.csv gerado."]);
              toast.success("Dados exportados para idiomas.csv", {
                position: "top-center"
              });
            }},
            { label: "Sincronizar", icon: "🔄", action: () => {
              playKeySound();
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                toast.success("Sincronização completa", {
                  position: "top-center"
                });
              }, 2000);
            }},
            { label: "Ajuda", icon: "❓", action: () => {
              playKeySound();
              setTerminalHistory(prev => [...prev, "> /help", `
> Comandos disponíveis:
> /setlang [CÓDIGO] - Define o idioma (ex: /setlang EN)
> /export - Exporta dados de idioma
> /stats - Mostra estatísticas de uso
> /clear - Limpa o terminal`]);
            }}
          ].map((button, index) => (
            <motion.button
              key={index}
              className="py-3 px-6 bg-[#222222] text-white border-2 border-[#0000FF] rounded-none flex items-center gap-2 font-mono"
              style={{ 
                boxShadow: '4px 4px 0px #000080',
                background: 'linear-gradient(145deg, #444444, #222222)'
              }}
              onClick={() => {
                playKeySound();
                button.action();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ 
                scale: 0.95,
                boxShadow: '2px 2px 0px #000080',
                translateY: '2px'
              }}
            >
              <span className="text-xl">{button.icon}</span>
              {button.label}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Interface preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-black border-4 border-[#666666] rounded-lg p-6 relative overflow-hidden"
          style={{ 
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.2) inset',
            backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAEklEQVQImWNgYGD4z0AswK4SAFXuAf8EPy+xAAAAAElFTkSuQmCC")',
            backgroundRepeat: 'repeat'
          }}
        >
          {/* Scanlines effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-10" 
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 4px'
            }}
          ></div>
          
          <h2 className="text-[#00FF00] font-mono text-xl mb-4">
            Pré-visualização
          </h2>
          
          <div className="bg-[#222222] border border-[#666666] p-4 mb-6">
            <div className="mb-4">
              <label className="text-[#C0C0C0] font-mono text-sm block mb-1">
                Idioma:
              </label>
              <select 
                className="w-full bg-black text-[#00FF00] font-mono border border-[#444444] py-1 px-2 focus:outline-none focus:border-[#00FF00]"
                value={selectedLanguage}
                onChange={(e) => handleLanguageSelect(e.target.value)}
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <div className="text-[#C0C0C0] font-mono text-sm block mb-2">
                Texto de Amostra:
              </div>
              <motion.div 
                className="text-[#00FF00] font-mono text-xl p-3 border border-[#444444] bg-black text-center"
                key={displayText} // Forces animation on change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {loading ? (
                  <span className="inline-block animate-pulse">Carregando...</span>
                ) : (
                  displayText
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Function keys row */}
          <div className="flex justify-between text-[#FFFF00] text-xs font-mono mb-2">
            <span>F1=Ajuda</span>
            <span>F2=Salvar</span>
            <span>F3=Carregar</span>
            <span>F4=Sair</span>
          </div>
        </motion.div>
      </div>
      
      {/* Terminal section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 bg-black rounded-lg border-2 border-[#00FF00] p-4"
      >
        <h2 className="text-[#00FF00] font-mono text-xl mb-4">
          Terminal de Comando
        </h2>
        
        <div 
          id="terminal-output"
          className="bg-black text-[#00FF00] font-mono text-sm p-3 mb-2 h-40 overflow-y-auto whitespace-pre-line"
        >
          {terminalHistory.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        
        <form onSubmit={handleTerminalSubmit} className="flex">
          <span className="text-[#00FF00] font-mono">$</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-grow bg-black text-[#00FF00] font-mono border-none outline-none px-2"
            autoComplete="off"
            placeholder="Digite um comando ou /help"
          />
        </form>
      </motion.div>
      
      {/* Status bar footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-6 bg-[#333333] border-t border-[#666666] p-2 flex justify-between items-center text-xs font-mono"
      >
        <div className="flex items-center gap-4">
          <span className="text-green-500 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span> Conexão: Ativa
          </span>
          <span className="text-blue-400 flex items-center gap-1">
            <span className="inline-block">🕒</span> Último backup: 24h
          </span>
        </div>
        <div className="text-[#FF0000]" style={{ fontFamily: 'monospace' }}>
          {new Date().toLocaleTimeString()}
        </div>
      </motion.div>
      
      {/* Modal for adding new language */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <motion.div 
            className="bg-black border-4 border-[#32CD32] p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-[#00FF00] font-mono text-xl mb-6 flex items-center">
              <span className="text-2xl mr-2">➕</span> Adicionar novo idioma
            </h2>
            
            <div className="space-y-4 font-mono">
              <div>
                <label className="text-[#00FF00] block mb-1">Código ISO:</label>
                <input 
                  type="text" 
                  maxLength={2}
                  className="w-full bg-black border-2 border-[#444444] p-2 text-[#00FF00] focus:border-[#00FF00] focus:outline-none"
                  placeholder="Ex: PT"
                  value={newLangCode}
                  onChange={(e) => setNewLangCode(e.target.value.toUpperCase())}
                />
              </div>
              
              <div>
                <label className="text-[#00FF00] block mb-1">Nome:</label>
                <input 
                  type="text" 
                  className="w-full bg-black border-2 border-[#444444] p-2 text-[#00FF00] focus:border-[#00FF00] focus:outline-none"
                  placeholder="Ex: Português"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="font-mono border-[#FF0000] text-[#FF0000] hover:bg-[#330000]"
                  onClick={() => {
                    playKeySound();
                    setShowModal(false);
                  }}
                >
                  CANCELAR
                </Button>
                <Button
                  type="button"
                  className="font-mono bg-[#007700] text-white hover:bg-[#006600]"
                  onClick={() => {
                    playKeySound();
                    handleAddLanguage();
                  }}
                  disabled={!newLangCode || !newLangName}
                >
                  CONFIRMAR
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Idiomas;
