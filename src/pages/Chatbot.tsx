
import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Hexagon, Mic, Settings, BarChart, FileText, AlertTriangle, DollarSign, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  from: 'bot' | 'user';
  timestamp: Date;
}

const suggestedQueries = [
  "Mostrar alunos em risco",
  "Gerar cobranças",
  "Ver relatório mensal",
  "Sugestões para turma das 19h",
];

// Simulate bot responses
const getBotResponse = (message: string) => {
  if (message.toLowerCase().includes("aluno") || message.toLowerCase().includes("risco")) {
    return {
      text: "Analisando padrões...\n→ 3 alunos com >80% risco:\n1. Ana (5 faltas)\n2. Carlos (feedback 2/5)\n3. Pedro (inadimplente)\n\nAção recomendada: pacote de retenção!",
      buttons: ["Criar pacote", "Ver perfis completos"]
    };
  } else if (message.toLowerCase().includes("cobran") || message.toLowerCase().includes("pagamento")) {
    return {
      text: "Encontrei 7 pagamentos pendentes totalizando R$ 2.350,00.\nDeseja gerar cobranças automáticas via PIX ou enviar mensagens de lembrete?",
      buttons: ["Cobrar via PIX", "Enviar lembretes"]
    };
  } else if (message.toLowerCase().includes("turma") || message.toLowerCase().includes("19h")) {
    return {
      text: "A turma das 19h está com ocupação de 65% (queda de 15% em 2 semanas).\nMotivos identificados:\n- 30% citam \"lotação\"\n- 25% \"horário inconveniente\"\n\nSugestão: Oferecer horário alternativo às 20h?",
      buttons: ["Criar horário", "Pesquisar alunos"]
    };
  } else if (message.toLowerCase().includes("relatório")) {
    return {
      text: "Gerando relatório mensal...\n\nPrevisão para Junho:\n↑ Receita: R$ 31.200 (+8%)\n↓ Evasão: 12 alunos (vs 15 em maio)\n→ Pontos de atenção: turma da manhã, equipamentos",
      buttons: ["Exportar PDF", "Visualizar detalhes"]
    };
  } else {
    return {
      text: "Como posso ajudar você a gerenciar a academia hoje? Posso mostrar alertas, gerar relatórios ou sugerir ações baseadas em tendências.",
      buttons: ["Ver alertas", "Análise financeira", "Previsão de evasão"]
    };
  }
};

const formatDate = (date: Date) => {
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return `Hoje ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
};

const Chatbot = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá Daiane! Tenho 3 alertas para você:\n1. 5 alunos com risco de evasão alta\n2. 2 pagamentos atrasados\n3. Turma das 19h com baixa adesão\n\nComo posso ajudar?",
      from: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentButtons, setCurrentButtons] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() && !isProcessing) return;
    
    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      from: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);
    setIsTyping(true);

    // Simulate typing
    setTimeout(() => {
      const response = getBotResponse(userMessage.text);
      setIsTyping(false);
      
      const botMessage = {
        id: Date.now(),
        text: response.text,
        from: 'bot' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setCurrentButtons(response.buttons);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleButtonResponse = (buttonText: string) => {
    const userMessage = {
      id: Date.now(),
      text: buttonText,
      from: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setIsTyping(true);
    setCurrentButtons([]);
    
    // Simulate typing
    setTimeout(() => {
      setIsTyping(false);
      let responseText = "";
      
      if (buttonText === "Criar pacote") {
        responseText = "Pacote de retenção criado com sucesso! 3 alunos receberão a oferta de 20% de desconto na próxima mensalidade + 2 aulas personalizadas.";
      } else if (buttonText === "Ver perfis completos") {
        responseText = "Carregando perfis detalhados...\n\nAna Silva\n- Frequência: 62% (↓15%)\n- Feedback: 4.2/5\n- Vence em: 5 dias\n\nCarlos Oliveira\n- Frequência: 45% (↓30%)\n- Feedback: 2/5 (insatisfeito)\n- Vence em: 12 dias";
      } else if (buttonText === "Ver alertas") {
        responseText = "Alertas prioritários:\n\n⚠️ Turma das 19h com queda de frequência\n⚠️ 2 equipamentos com manutenção pendente\n⚠️ Campanha de inverno com baixa adesão (5%)";
      } else {
        responseText = "Executando ação: " + buttonText + "\n\nAção realizada com sucesso! Alguma outra informação que você precisa hoje?";
      }
      
      const botMessage = {
        id: Date.now(),
        text: responseText,
        from: 'bot' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    toast({
      description: `Ação executada: ${action}`
    });
    
    if (action === 'relatório') {
      handleButtonResponse("Ver relatório mensal");
    } else if (action === 'alertas') {
      handleButtonResponse("Ver alertas");
    } else if (action === 'financeiro') {
      handleButtonResponse("Análise financeira");
    } else if (action === 'configurações') {
      toast({
        title: "Configurações",
        description: "Abrindo configurações do assistente IA"
      });
    }
  };

  const handleVoice = () => {
    toast({
      description: "Ouvindo comando de voz..."
    });
    
    setTimeout(() => {
      setCurrentMessage("Quem pode cancelar este mês?");
      
      setTimeout(() => {
        handleSendMessage();
      }, 500);
    }, 1500);
  };

  return (
    <MainLayout
      pageTitle="Assistente IA"
      pageSubtitle="Chatbot inteligente para gestão da academia"
      headerImage="https://images.unsplash.com/photo-1675275694224-5a9755defe7c?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="h-[calc(100vh-320px)] flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="rounded-full bg-academy-purple/20 p-2 mr-3">
              <Hexagon className="h-6 w-6 text-academy-purple" />
            </div>
            <div>
              <h3 className="font-medium">Assistente IA - Modo: Gestão</h3>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-gray-400' : 'bg-green-500'} mr-2`}></div>
                <span className="text-sm text-muted-foreground">{isProcessing ? 'Processando...' : 'Online'}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('configurações')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto bg-background/30 backdrop-blur-sm rounded-lg border border-border p-4 mb-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.from === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.from === 'user'
                    ? 'bg-academy-purple text-white rounded-tr-none'
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  <div className="flex-1 text-xs opacity-70">
                    {message.from === 'user' ? 'Você' : 'Assistente IA'} • {formatDate(message.timestamp)}
                  </div>
                </div>
                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center mb-4">
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Suggestion buttons */}
          {!isProcessing && currentButtons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {currentButtons.map((button, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  className="bg-muted/50"
                  onClick={() => handleButtonResponse(button)}
                >
                  {button}
                </Button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick action buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-3 h-auto"
            onClick={() => handleQuickAction('relatório')}
          >
            <BarChart className="h-5 w-5 mb-1" />
            <span className="text-xs">Relatório</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-3 h-auto"
            onClick={() => handleQuickAction('alertas')}
          >
            <AlertTriangle className="h-5 w-5 mb-1" />
            <span className="text-xs">Alertas</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-3 h-auto"
            onClick={() => handleQuickAction('financeiro')}
          >
            <DollarSign className="h-5 w-5 mb-1" />
            <span className="text-xs">Financeiro</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-3 h-auto"
            onClick={() => handleQuickAction('configurações')}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Configurações</span>
          </Button>
        </div>
        
        {/* Suggested queries */}
        <div className="flex flex-wrap gap-2 mb-4">
          {!isProcessing && messages.length < 3 && suggestedQueries.map((query, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm"
              onClick={() => {
                setCurrentMessage(query);
                setTimeout(handleSendMessage, 100);
              }}
            >
              {query}
            </Button>
          ))}
        </div>
        
        {/* Message input */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full h-10 w-10 flex-shrink-0"
            onClick={handleVoice}
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-1">
            <Input
              placeholder="Pergunte sobre alunos, financeiro ou evasão..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isProcessing}
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 absolute right-1 top-1"
              onClick={handleSendMessage}
              disabled={isProcessing || !currentMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
