import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign,
  CreditCard,
  Wallet,
  QrCode,
  BarChart,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  ArrowUpDown
} from 'lucide-react';

// Sample payment data
const paymentData = [
  {
    id: 1,
    student: 'Ana Silva',
    plan: 'Mensal',
    value: 120.00,
    dueDate: '2024-05-20',
    status: 'pending',
    paymentMethod: 'pix'
  },
  {
    id: 2,
    student: 'Carlos Oliveira',
    plan: 'Trimestral',
    value: 330.00,
    dueDate: '2024-05-15',
    status: 'overdue',
    paymentMethod: 'credit_card'
  },
  {
    id: 3,
    student: 'Mariana Costa',
    plan: 'Anual',
    value: 1100.00,
    dueDate: '2024-06-10',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paidDate: '2024-05-10'
  },
  {
    id: 4,
    student: 'Pedro Santos',
    plan: 'Mensal',
    value: 120.00,
    dueDate: '2024-05-25',
    status: 'pending',
    paymentMethod: 'pix'
  },
  {
    id: 5,
    student: 'Juliana Mendes',
    plan: 'Semestral',
    value: 650.00,
    dueDate: '2024-05-05',
    status: 'overdue',
    paymentMethod: 'bank_slip'
  }
];

// Payment gateway options
const paymentGateways = [
  { id: 'mercadopago', name: 'Mercado Pago', logo: '💲', description: 'Aceite PIX, cartões e boletos' },
  { id: 'pagseguro', name: 'PagSeguro', logo: '💳', description: 'Solução completa de pagamentos' },
  { id: 'paypal', name: 'PayPal', logo: '🅿️', description: 'Pagamentos internacionais' },
  { id: 'stripe', name: 'Stripe', logo: '🟣', description: 'Pagamentos online simplificados' }
];

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState(paymentData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('payments');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => 
    payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle payment action
  const handlePaymentAction = (id: number, action: string) => {
    if (action === 'pay') {
      setPayments(payments.map(payment => 
        payment.id === id ? { ...payment, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : payment
      ));
      
      toast({
        title: "Pagamento registrado",
        description: "O pagamento foi registrado com sucesso."
      });
    } else if (action === 'remind') {
      toast({
        title: "Lembrete enviado",
        description: "Um lembrete de pagamento foi enviado ao aluno."
      });
    } else if (action === 'generate') {
      toast({
        title: "Boleto gerado",
        description: "Um novo boleto foi gerado e enviado ao aluno."
      });
    }
  };

  // Handle payment gateway selection
  const handleGatewaySelection = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setIsConfiguring(true);
  };

  // Save payment gateway configuration
  const saveGatewayConfig = () => {
    if (!apiKey || !secretKey) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }
    
    toast({
      title: "Configuração salva",
      description: "A plataforma de pagamento foi configurada com sucesso."
    });
    
    setIsConfiguring(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout pageTitle="Pagamentos" pageSubtitle="Gerencie pagamentos e configure integrações">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Integração
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pagamentos</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar pagamentos..." 
                    className="pl-10 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Pagamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum pagamento encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.student}</TableCell>
                          <TableCell>{payment.plan}</TableCell>
                          <TableCell>{formatCurrency(payment.value)}</TableCell>
                          <TableCell>{formatDate(payment.dueDate)}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {payment.status !== 'paid' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePaymentAction(payment.id, 'pay')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Pago
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePaymentAction(payment.id, 'remind')}
                                  >
                                    <Clock className="h-4 w-4 mr-1" />
                                    Lembrar
                                  </Button>
                                </>
                              )}
                              {payment.status === 'paid' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "Recibo gerado",
                                      description: "O recibo foi gerado e enviado ao aluno."
                                    });
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Recibo
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>
                Visualize e exporte relatórios financeiros.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Recebido (Mês)</p>
                        <p className="text-2xl font-bold">{formatCurrency(1870)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pendente</p>
                        <p className="text-2xl font-bold">{formatCurrency(890)}</p>
                      </div>
                      <Clock className="h-8 w-8 text-amber-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Atrasado</p>
                        <p className="text-2xl font-bold">{formatCurrency(450)}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-4">
          {!isConfiguring ? (
            <Card>
              <CardHeader>
                <CardTitle>Integração com Plataforma de Pagamento</CardTitle>
                <CardDescription>
                  Escolha e configure uma plataforma de pagamento para processar as mensalidades.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentGateways.map((gateway) => (
                    <Card 
                      key={gateway.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleGatewaySelection(gateway.id)}
                    >
                      <CardContent className="p-6 flex items-center space-x-4">
                        <div className="text-4xl">{gateway.logo}</div>
                        <div>
                          <h3 className="font-medium">{gateway.name}</h3>
                          <p className="text-sm text-muted-foreground">{gateway.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuração Rápida
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecione uma plataforma de pagamento acima para configurar. Você precisará das chaves de API fornecidas pela plataforma.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Configurar {paymentGateways.find(g => g.id === selectedGateway)?.name}</CardTitle>
                <CardDescription>
                  Configure as credenciais da plataforma de pagamento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Key</label>
                    <Input 
                      placeholder="Insira sua API Key" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Encontre sua API Key no painel da plataforma de pagamento.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key</label>
                    <Input 
                      type="password"
                      placeholder="Insira sua Secret Key" 
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mantenha esta chave em segredo. Ela é usada para autenticar transações.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Métodos de Pagamento</label>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="pix" defaultChecked />
                        <label htmlFor="pix">PIX</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="credit_card" defaultChecked />
                        <label htmlFor="credit_card">Cartão de Crédito</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="bank_slip" defaultChecked />
                        <label htmlFor="bank_slip">Boleto</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsConfiguring(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={saveGatewayConfig}>
                    Salvar Configuração
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Webhooks e Notificações</CardTitle>
              <CardDescription>
                Configure webhooks para receber notificações de pagamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL de Callback</label>
                <div className="flex space-x-2">
                  <Input 
                    value="https://sua-academia.com/api/payments/webhook" 
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText("https://sua-academia.com/api/payments/webhook");
                      toast({
                        description: "URL copiada para a área de transferência"
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure esta URL no painel da sua plataforma de pagamento para receber notificações de pagamentos.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Eventos</label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="payment_received" defaultChecked />
                    <label htmlFor="payment_received">Pagamento Recebido</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="payment_failed" defaultChecked />
                    <label htmlFor="payment_failed">Pagamento Falhou</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="subscription_created" defaultChecked />
                    <label htmlFor="subscription_created">Assinatura Criada</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="subscription_cancelled" defaultChecked />
                    <label htmlFor="subscription_cancelled">Assinatura Cancelada</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => {
                  toast({
                    title: "Configurações salvas",
                    description: "As configurações de webhook foram salvas com sucesso."
                  });
                }}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Payments;