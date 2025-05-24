
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  Puzzle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Zap, 
  RefreshCw,
  Settings,
  Copy,
  ExternalLink,
  FileText,
  Activity
} from 'lucide-react';

interface APIConnection {
  id: string;
  name: string;
  type: 'payment' | 'calendar' | 'communication' | 'crm';
  status: 'connected' | 'warning' | 'disconnected';
  lastSync: string;
  monthlyUsage: number;
  description: string;
  icon: string;
}

const mockConnections: APIConnection[] = [
  {
    id: '1',
    name: 'PagBank',
    type: 'payment',
    status: 'connected',
    lastSync: '2 min atrás',
    monthlyUsage: 142,
    description: 'Pagamentos',
    icon: '💳'
  },
  {
    id: '2',
    name: 'Google Calendar',
    type: 'calendar',
    status: 'warning',
    lastSync: '30 min atrás',
    monthlyUsage: 89,
    description: 'Agendamento',
    icon: '📅'
  },
  {
    id: '3',
    name: 'WhatsApp Business',
    type: 'communication',
    status: 'disconnected',
    lastSync: 'Nunca',
    monthlyUsage: 0,
    description: 'Comunicação',
    icon: '📱'
  }
];

const IntegracaoAPIs = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<APIConnection[]>(mockConnections);
  const [selectedConnection, setSelectedConnection] = useState<APIConnection | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [callbackUrl] = useState('https://academia.app/webhook/callback');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'disconnected': return XCircle;
      default: return XCircle;
    }
  };

  const handleTestConnection = (connection: APIConnection) => {
    toast({
      title: "Testando Conexão",
      description: `Verificando ${connection.name}...`
    });

    // Simulate test
    setTimeout(() => {
      toast({
        title: "Teste Concluído",
        description: `${connection.name} está respondendo corretamente`,
      });
    }, 2000);
  };

  const handleConnect = (connection: APIConnection) => {
    setSelectedConnection(connection);
    setIsConfiguring(true);
  };

  const handleSaveConfiguration = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma API Key válida",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Configuração Salva",
      description: `${selectedConnection?.name} foi configurado com sucesso`
    });

    // Update connection status
    if (selectedConnection) {
      setConnections(prev => prev.map(conn => 
        conn.id === selectedConnection.id 
          ? { ...conn, status: 'connected' as const, lastSync: 'agora' }
          : conn
      ));
    }

    setIsConfiguring(false);
    setSelectedConnection(null);
    setApiKey('');
  };

  const handleSyncAll = () => {
    toast({
      title: "Sincronizando",
      description: "Atualizando todas as conexões..."
    });

    setTimeout(() => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        lastSync: 'agora'
      })));
      
      toast({
        title: "Sincronização Completa",
        description: "Todas as conexões foram atualizadas"
      });
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "URL copiada para a área de transferência"
    });
  };

  return (
    <MainLayout
      pageTitle="Conectores"
      pageSubtitle="Integração com APIs e serviços externos"
      headerImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2000&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full bg-green-500 animate-pulse`}></div>
            <span className="text-sm text-muted-foreground">Sincronizado há 2min</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSyncAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar Tudo
            </Button>
            <Button onClick={() => setIsConfiguring(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Integração
            </Button>
          </div>
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            const StatusIcon = getStatusIcon(connection.status);
            
            return (
              <motion.div
                key={connection.id}
                className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:bg-background/70 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{connection.icon}</div>
                    <div>
                      <h3 className="font-medium">{connection.name}</h3>
                      <p className="text-sm text-muted-foreground">{connection.description}</p>
                    </div>
                  </div>
                  <StatusIcon className={`h-5 w-5 ${getStatusColor(connection.status)}`} />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Última sync:</span>
                    <span>{connection.lastSync}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uso mensal:</span>
                    <span>{connection.monthlyUsage} {connection.type === 'payment' ? 'transações' : 'eventos'}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {connection.status === 'connected' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleTestConnection(connection)}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Testar
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleConnect(connection)}
                    >
                      {connection.status === 'warning' ? 'Renovar' : 'Conectar'}
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Configuration Panel */}
        {isConfiguring && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-6"
          >
            <h3 className="text-lg font-medium mb-4">
              {selectedConnection ? `Configurar ${selectedConnection.name}` : 'Nova Integração'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">1️⃣ URL de Callback</label>
                <div className="flex space-x-2">
                  <Input value={callbackUrl} readOnly className="font-mono text-sm" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(callbackUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">2️⃣ API Key</label>
                <Input
                  type="password"
                  placeholder="Insira sua API Key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveConfiguration}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Salvar Configuração
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsConfiguring(false);
                    setSelectedConnection(null);
                    setApiKey('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <FileText className="h-6 w-6 mb-2" />
            <span className="text-sm">Logs de Erro</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <ExternalLink className="h-6 w-6 mb-2" />
            <span className="text-sm">Webhooks</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Activity className="h-6 w-6 mb-2" />
            <span className="text-sm">Monitoramento</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Settings className="h-6 w-6 mb-2" />
            <span className="text-sm">Configurações</span>
          </Button>
        </div>

        {/* Technical Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <div>v3.1.2 | Última auditoria: 16/05/2024</div>
          <div>🔒 Criptografia TLS 1.3 | Latência média: 128ms</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IntegracaoAPIs;
