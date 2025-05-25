import { supabase } from '../index.js';

// Get conversation history
export const getConversationHistory = async (req, res, next) => {
  try {
    // In a real implementation, this would fetch conversation history from a database
    // For now, we'll return mock data
    
    const mockHistory = [
      {
        id: 1,
        from: 'bot',
        text: "Olá Daiane! Tenho 3 alertas para você:\n1. 5 alunos com risco de evasão alta\n2. 2 pagamentos atrasados\n3. Turma das 19h com baixa adesão\n\nComo posso ajudar?",
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    ];
    
    res.status(200).json(mockHistory);
  } catch (error) {
    next(error);
  }
};

// Send message to chatbot
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    // In a real implementation, this would process the message with an NLP service
    // For now, we'll use simple pattern matching
    
    let response = {
      text: "Como posso ajudar você a gerenciar a academia hoje? Posso mostrar alertas, gerar relatórios ou sugerir ações baseadas em tendências.",
      buttons: ["Ver alertas", "Análise financeira", "Previsão de evasão"]
    };
    
    if (message.toLowerCase().includes("aluno") || message.toLowerCase().includes("risco")) {
      response = {
        text: "Analisando padrões...\n→ 3 alunos com >80% risco:\n1. Ana (5 faltas)\n2. Carlos (feedback 2/5)\n3. Pedro (inadimplente)\n\nAção recomendada: pacote de retenção!",
        buttons: ["Criar pacote", "Ver perfis completos"]
      };
    } else if (message.toLowerCase().includes("cobran") || message.toLowerCase().includes("pagamento")) {
      response = {
        text: "Encontrei 7 pagamentos pendentes totalizando R$ 2.350,00.\nDeseja gerar cobranças automáticas via PIX ou enviar mensagens de lembrete?",
        buttons: ["Cobrar via PIX", "Enviar lembretes"]
      };
    } else if (message.toLowerCase().includes("turma") || message.toLowerCase().includes("19h")) {
      response = {
        text: "A turma das 19h está com ocupação de 65% (queda de 15% em 2 semanas).\nMotivos identificados:\n- 30% citam \"lotação\"\n- 25% \"horário inconveniente\"\n\nSugestão: Oferecer horário alternativo às 20h?",
        buttons: ["Criar horário", "Pesquisar alunos"]
      };
    } else if (message.toLowerCase().includes("relatório")) {
      response = {
        text: "Gerando relatório mensal...\n\nPrevisão para Junho:\n↑ Receita: R$ 31.200 (+8%)\n↓ Evasão: 12 alunos (vs 15 em maio)\n→ Pontos de atenção: turma da manhã, equipamentos",
        buttons: ["Exportar PDF", "Visualizar detalhes"]
      };
    }
    
    // Create user message
    const userMessage = {
      id: Date.now(),
      from: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    // Create bot response
    const botMessage = {
      id: Date.now() + 1,
      from: 'bot',
      text: response.text,
      buttons: response.buttons,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      userMessage,
      botMessage
    });
  } catch (error) {
    next(error);
  }
};

// Get suggested queries
export const getSuggestedQueries = async (req, res, next) => {
  try {
    // In a real implementation, these would be personalized based on user behavior
    const suggestedQueries = [
      "Mostrar alunos em risco",
      "Gerar cobranças",
      "Ver relatório mensal",
      "Sugestões para turma das 19h",
    ];
    
    res.status(200).json(suggestedQueries);
  } catch (error) {
    next(error);
  }
};

// Get chatbot settings
export const getChatbotSettings = async (req, res, next) => {
  try {
    // In a real implementation, these would be fetched from a database
    const settings = {
      mode: 'gestao',
      responseStyle: 'detailed',
      enabledFeatures: ['alerts', 'reports', 'predictions', 'recommendations']
    };
    
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// Update chatbot settings
export const updateChatbotSettings = async (req, res, next) => {
  try {
    const { mode, responseStyle, enabledFeatures } = req.body;
    
    // In a real implementation, these would be saved to a database
    const settings = {
      mode: mode || 'gestao',
      responseStyle: responseStyle || 'detailed',
      enabledFeatures: enabledFeatures || ['alerts', 'reports', 'predictions', 'recommendations']
    };
    
    res.status(200).json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};

// Execute action from chatbot
export const executeAction = async (req, res, next) => {
  try {
    const { action, parameters } = req.body;
    
    // In a real implementation, this would execute different actions based on the request
    // For now, we'll return mock responses
    
    let result;
    
    switch (action) {
      case 'getAlerts':
        result = {
          success: true,
          data: {
            alerts: [
              { id: 1, message: 'Aluno João Silva com 5 faltas consecutivas', severity: 'high' },
              { id: 2, message: 'Pagamento de Maria Santos atrasado há 7 dias', severity: 'medium' }
            ]
          }
        };
        break;
        
      case 'generateReport':
        result = {
          success: true,
          data: {
            reportUrl: 'https://example.com/reports/123',
            generatedAt: new Date().toISOString()
          }
        };
        break;
        
      case 'sendMessage':
        if (!parameters || !parameters.userId || !parameters.message) {
          return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        result = {
          success: true,
          data: {
            messageSent: true,
            recipient: parameters.userId,
            timestamp: new Date().toISOString()
          }
        };
        break;
        
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};