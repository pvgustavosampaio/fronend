
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Filter,
  Settings,
  Clock,
  Archive,
  RefreshCcw,
  MessageSquare,
  FileText,
  Tag,
  ArrowUpDown
} from 'lucide-react';

// Sample data for alerts
const alertasIniciais = [
  {
    id: 1,
    tipo: 'evasao',
    prioridade: 'alta',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    titulo: 'Ana Silva (32 anos)',
    descricao: 'RISCO ALTO: 85% chance de cancelamento',
    detalhes: '5 faltas nos últimos 14 dias',
    feedback: 'Feedback recente: 2/5 estrelas',
    acoes: ['mensagem', 'aula']
  },
  {
    id: 2,
    tipo: 'financeiro',
    prioridade: 'alta',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    titulo: 'Carlos Oliveira',
    descricao: 'PAGAMENTO ATRASADO: R$ 150 (5 dias)',
    detalhes: 'Próximo vencimento: 20/05',
    acoes: ['whatsapp', 'boleto']
  },
  {
    id: 3,
    tipo: 'sistema',
    prioridade: 'media',
    icone: 'IA',
    titulo: 'RECOMENDAÇÃO AUTOMÁTICA',
    descricao: 'Turma das 18h com 30% menos alunos',
    detalhes: 'Sugere: "Oferecer pacote promocional"',
    acoes: ['promocao', 'ignorar']
  },
  {
    id: 4,
    tipo: 'evasao',
    prioridade: 'media',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    titulo: 'Mariana Costa (28 anos)',
    descricao: 'RISCO MÉDIO: 65% chance de cancelamento',
    detalhes: '3 faltas nas últimas 3 semanas',
    feedback: 'Sem feedback recente',
    acoes: ['mensagem', 'aula']
  },
  {
    id: 5,
    tipo: 'financeiro',
    prioridade: 'baixa',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    titulo: 'José Santos',
    descricao: 'PAGAMENTO A VENCER: R$ 185 (em 2 dias)',
    detalhes: 'Cliente normalmente pontual',
    acoes: ['lembrete', 'ignorar']
  },
  {
    id: 6,
    tipo: 'sistema',
    prioridade: 'baixa',
    icone: 'IA',
    titulo: 'MANUTENÇÃO RECOMENDADA',
    descricao: 'Equipamento da sala 2 com uso intenso',
    detalhes: '120% acima do uso médio nos últimos 30 dias',
    acoes: ['agendar', 'ignorar']
  },
];

const AlertasAutomaticos = () => {
  const { toast } = useToast();
  const [alertas, setAlertas] = useState(alertasIniciais);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle alert actions
  const handleAction = (alertaId: number, acao: string) => {
    // Find the alert
    const alerta = alertas.find(a => a.id === alertaId);
    if (!alerta) return;

    // Define action behaviors
    switch (acao) {
      case 'mensagem':
        toast({
          title: "Mensagem enviada",
          description: `Uma mensagem personalizada foi enviada para ${alerta.titulo}.`
        });
        break;
      case 'aula':
        toast({
          title: "Aula experimental agendada",
          description: `Aula experimental oferecida para ${alerta.titulo}.`
        });
        break;
      case 'whatsapp':
        toast({
          title: "Cobrança enviada",
          description: `Mensagem de cobrança enviada via WhatsApp para ${alerta.titulo}.`
        });
        break;
      case 'boleto':
        toast({
          title: "Boleto gerado",
          description: `Uma nova 2ª via de boleto foi gerada para ${alerta.titulo}.`
        });
        break;
      case 'promocao':
        toast({
          title: "Promoção criada",
          description: "Nova promoção criada para a turma das 18h."
        });
        break;
      case 'lembrete':
        toast({
          title: "Lembrete enviado",
          description: `Lembrete de pagamento enviado para ${alerta.titulo}.`
        });
        break;
      case 'agendar':
        toast({
          title: "Manutenção agendada",
          description: "Manutenção do equipamento da sala 2 agendada."
        });
        break;
      case 'ignorar':
        toast({
          title: "Alerta ignorado",
          description: "Este alerta não será mostrado novamente."
        });
        break;
    }

    // Remove the alert after action
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setFiltroAtivo(filter);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      description: "Atualizando alertas..."
    });
    
    setTimeout(() => {
      // Restore original alerts and add one new
      setAlertas([
        ...alertasIniciais,
        {
          id: 7,
          tipo: 'evasao',
          prioridade: 'alta',
          foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          titulo: 'Ricardo Mendes (NOVO)',
          descricao: 'RISCO ALTO: 92% chance de cancelamento',
          detalhes: 'Reclamou do professor 2 vezes',
          feedback: 'Feedback recente: 1/5 estrelas',
          acoes: ['mensagem', 'aula']
        }
      ]);
      
      setIsRefreshing(false);
      toast({
        title: "Alertas atualizados",
        description: "Novos alertas foram encontrados."
      });
    }, 1500);
  };

  // Filter alerts
  const alertasFiltrados = filtroAtivo === 'Todos' 
    ? alertas 
    : alertas.filter(alerta => alerta.tipo === filtroAtivo.toLowerCase());

  // Render action buttons based on the action type
  const renderActionButton = (alertaId: number, acao: string) => {
    switch (acao) {
      case 'mensagem':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            className="flex-1"
            size="sm"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Enviar Mensagem
          </Button>
        );
      case 'aula':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            Oferecer Aula
          </Button>
        );
      case 'whatsapp':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            className="flex-1"
            size="sm"
          >
            Cobrar via WhatsApp
          </Button>
        );
      case 'boleto':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            Gerar 2ª via
          </Button>
        );
      case 'promocao':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            className="flex-1"
            size="sm"
          >
            Criar Promoção
          </Button>
        );
      case 'ignorar':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            Ignorar
          </Button>
        );
      case 'lembrete':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            className="flex-1"
            size="sm"
          >
            Enviar Lembrete
          </Button>
        );
      case 'agendar':
        return (
          <Button 
            onClick={() => handleAction(alertaId, acao)}
            className="flex-1"
            size="sm"
          >
            Agendar Manutenção
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout 
      pageTitle="Alertas Automáticos" 
      pageSubtitle="Notificações inteligentes e ações recomendadas"
      headerImage="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {/* Filter bar */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              variant={filtroAtivo === 'Todos' ? "default" : "outline"} 
              onClick={() => handleFilterChange('Todos')}
              size="sm"
            >
              Todos
            </Button>
            <Button 
              variant={filtroAtivo === 'Evasao' ? "default" : "outline"} 
              onClick={() => handleFilterChange('Evasao')}
              size="sm"
            >
              Evasão
            </Button>
            <Button 
              variant={filtroAtivo === 'Financeiro' ? "default" : "outline"} 
              onClick={() => handleFilterChange('Financeiro')}
              size="sm"
            >
              Financeiro
            </Button>
            <Button 
              variant={filtroAtivo === 'Sistema' ? "default" : "outline"} 
              onClick={() => handleFilterChange('Sistema')}
              size="sm"
            >
              Sistema
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Filtros avançados",
                  description: "Configurando filtros de alerta..."
                });
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Ordenando alertas",
                  description: "Alertas ordenados por prioridade."
                });
              }}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Ordenar
            </Button>
          </div>
        </div>

        {/* Alert counter */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{alertasFiltrados.length}</span> alertas encontrados
          </div>
        </div>

        {/* Alerts list */}
        <div className="space-y-4">
          {alertasFiltrados.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Tudo tranquilo</h3>
                <p className="text-muted-foreground mt-2">
                  Não há alertas ativos no momento. Toque em atualizar para verificar novamente.
                </p>
              </div>
            </Card>
          ) : (
            alertasFiltrados.map((alerta) => (
              <Card 
                key={alerta.id} 
                className={`border-l-4 ${
                  alerta.prioridade === 'alta' ? 'border-l-red-500' : 
                  alerta.prioridade === 'media' ? 'border-l-amber-500' : 
                  'border-l-blue-500'
                } overflow-hidden animate-fade-in`}
              >
                <div className="p-5">
                  <div className="flex items-center space-x-4">
                    {alerta.foto ? (
                      <img 
                        src={alerta.foto} 
                        alt={alerta.titulo} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-semibold">{alerta.icone}</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{alerta.titulo}</h3>
                      <p className="font-semibold text-sm mt-1">
                        {alerta.descricao}
                      </p>
                    </div>
                    
                    <Tag 
                      className={`h-5 w-5 ${
                        alerta.tipo === 'evasao' ? 'text-red-500' : 
                        alerta.tipo === 'financeiro' ? 'text-amber-500' : 
                        'text-blue-500'
                      }`} 
                    />
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>{alerta.detalhes}</p>
                    {alerta.feedback && <p className="mt-1">{alerta.feedback}</p>}
                  </div>
                  
                  <div className="border-t border-border mt-4 pt-4 flex space-x-3">
                    {alerta.acoes.map((acao) => (
                      <React.Fragment key={acao}>
                        {renderActionButton(alerta.id, acao)}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom action bar */}
        <div className="fixed bottom-6 right-6 flex space-x-3">
          <Button 
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Previsões Semanais",
                description: "Carregando análises de tendências..."
              });
            }}
          >
            <span className="sr-only">Previsões Semanais</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Button>
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Configurar Alertas",
                description: "Configurando seus alertas automáticos..."
              });
            }}
          >
            <span className="sr-only">Configurar Alertas</span>
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              toast({
                title: "Alertas Resolvidos",
                description: "Visualizando histórico de alertas anteriores..."
              });
            }}
          >
            <span className="sr-only">Alertas Resolvidos</span>
            <Archive className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AlertasAutomaticos;
