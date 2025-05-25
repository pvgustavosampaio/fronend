import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Settings as SettingsIcon,
  Bell,
  Mail,
  CreditCard,
  User,
  Lock,
  Database,
  RefreshCw,
  Save,
  Upload,
  Download,
  MessageSquare,
  Calendar,
  Clock,
  Phone,
  FileText,
  CheckCircle
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    absenceThreshold: 3,
    paymentReminder: true,
    emailNotifications: true,
    smsNotifications: false,
    lowAttendanceAlert: true,
    autoGenerateAlerts: true,
    dailyDigest: true
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    senderName: 'Academia Fitness',
    senderEmail: 'contato@academia.com',
    replyToEmail: 'contato@academia.com',
    smtpServer: 'smtp.academia.com',
    smtpPort: '587',
    smtpUsername: 'smtp@academia.com',
    smtpPassword: '********',
    useSMTP: true
  });
  
  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    gateway: 'mercadopago',
    apiKey: 'TEST_API_KEY_123456',
    secretKey: '********',
    enablePix: true,
    enableCreditCard: true,
    enableBankSlip: true,
    autoSendInvoice: true,
    paymentDays: 5
  });
  
  // User settings
  const [userSettings, setUserSettings] = useState({
    name: 'Administrador',
    email: 'admin@academia.com',
    phone: '(11) 98765-4321',
    role: 'admin',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  });
  
  // Message templates
  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 'absence',
      name: 'Alerta de Ausência',
      subject: 'Sentimos sua falta na academia',
      body: `Olá {nome},

Notamos que você não compareceu à academia nos últimos {dias} dias. Está tudo bem?

Queremos ajudar você a manter sua rotina de exercícios. Se estiver enfrentando alguma dificuldade, estamos à disposição para ajudar.

Que tal agendar uma aula com um de nossos professores para retomar os treinos?

Atenciosamente,
Equipe da Academia`
    },
    {
      id: 'payment',
      name: 'Lembrete de Pagamento',
      subject: 'Lembrete: Sua mensalidade está próxima do vencimento',
      body: `Olá {nome},

Este é um lembrete amigável de que sua mensalidade no valor de R$ {valor} vence em {dias} dias.

Para sua comodidade, você pode efetuar o pagamento através do nosso aplicativo ou site.

Caso já tenha efetuado o pagamento, por favor desconsidere esta mensagem.

Atenciosamente,
Equipe da Academia`
    },
    {
      id: 'retention',
      name: 'Retenção de Aluno',
      subject: 'Uma oferta especial para você',
      body: `Olá {nome},

Valorizamos muito sua presença em nossa academia e queremos oferecer uma condição especial para você continuar conosco.

Preparamos um desconto de 15% na sua próxima mensalidade, além de uma sessão gratuita com um personal trainer.

Entre em contato conosco para aproveitar esta oferta exclusiva!

Atenciosamente,
Equipe da Academia`
    }
  ]);
  
  // Selected template for editing
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Handle notification settings change
  const handleNotificationSettingChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle email settings change
  const handleEmailSettingChange = (setting, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle payment settings change
  const handlePaymentSettingChange = (setting, value) => {
    setPaymentSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle user settings change
  const handleUserSettingChange = (setting, value) => {
    setUserSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle template selection for editing
  const handleTemplateSelect = (templateId) => {
    const template = messageTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template);
  };
  
  // Handle template update
  const handleTemplateUpdate = (field, value) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save template changes
  const handleTemplateSave = () => {
    if (!selectedTemplate) return;
    
    setMessageTemplates(prev => 
      prev.map(t => t.id === selectedTemplate.id ? selectedTemplate : t)
    );
    
    toast({
      title: "Template atualizado",
      description: `O template "${selectedTemplate.name}" foi atualizado com sucesso.`
    });
    
    setSelectedTemplate(null);
  };
  
  // Save all settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso."
      });
    }, 1500);
  };
  
  // Test email
  const handleTestEmail = () => {
    toast({
      title: "Email de teste enviado",
      description: "Um email de teste foi enviado para " + emailSettings.senderEmail
    });
  };
  
  // Test payment integration
  const handleTestPayment = () => {
    toast({
      title: "Teste de integração",
      description: "A integração com " + paymentSettings.gateway + " foi testada com sucesso."
    });
  };
  
  // Export settings
  const handleExportSettings = () => {
    toast({
      title: "Configurações exportadas",
      description: "Suas configurações foram exportadas com sucesso."
    });
  };
  
  // Import settings
  const handleImportSettings = () => {
    toast({
      title: "Configurações importadas",
      description: "Suas configurações foram importadas com sucesso."
    });
  };

  return (
    <MainLayout pageTitle="Configurações" pageSubtitle="Personalize o funcionamento do sistema">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <Tabs 
                orientation="vertical" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="space-y-2"
              >
                <TabsTrigger 
                  value="notifications" 
                  className="w-full justify-start gap-2 px-3"
                >
                  <Bell className="h-4 w-4" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger 
                  value="email" 
                  className="w-full justify-start gap-2 px-3"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className="w-full justify-start gap-2 px-3"
                >
                  <CreditCard className="h-4 w-4" />
                  Pagamentos
                </TabsTrigger>
                <TabsTrigger 
                  value="templates" 
                  className="w-full justify-start gap-2 px-3"
                >
                  <MessageSquare className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  className="w-full justify-start gap-2 px-3"
                >
                  <User className="h-4 w-4" />
                  Conta
                </TabsTrigger>
                <TabsTrigger 
                  value="backup" 
                  className="w-full justify-start gap-2 px-3"
                >
                  <Database className="h-4 w-4" />
                  Backup
                </TabsTrigger>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-medium">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={handleSaveSettings}
                >
                  <Save className="h-4 w-4" />
                  Salvar Configurações
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={handleExportSettings}
                >
                  <Download className="h-4 w-4" />
                  Exportar Configurações
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={handleImportSettings}
                >
                  <Upload className="h-4 w-4" />
                  Importar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Personalize como e quando as notificações são enviadas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alertas de Evasão</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="absenceThreshold">Limite de faltas consecutivas</Label>
                      <div className="text-sm text-muted-foreground">
                        Gerar alerta após este número de faltas
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="absenceThreshold"
                        type="number"
                        value={notificationSettings.absenceThreshold}
                        onChange={(e) => handleNotificationSettingChange('absenceThreshold', parseInt(e.target.value))}
                        className="w-16 text-center"
                        min={1}
                        max={10}
                      />
                      <span className="ml-2">faltas</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lowAttendanceAlert">Alerta de baixa frequência</Label>
                      <div className="text-sm text-muted-foreground">
                        Alertar quando a frequência cair abaixo de 50%
                      </div>
                    </div>
                    <Switch
                      id="lowAttendanceAlert"
                      checked={notificationSettings.lowAttendanceAlert}
                      onCheckedChange={(checked) => handleNotificationSettingChange('lowAttendanceAlert', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alertas Financeiros</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentReminder">Lembrete de pagamento</Label>
                      <div className="text-sm text-muted-foreground">
                        Enviar lembrete 3 dias antes do vencimento
                      </div>
                    </div>
                    <Switch
                      id="paymentReminder"
                      checked={notificationSettings.paymentReminder}
                      onCheckedChange={(checked) => handleNotificationSettingChange('paymentReminder', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Canais de Notificação</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Notificações por email
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Enviar alertas por email
                      </div>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Notificações por SMS
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Enviar alertas por SMS
                      </div>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('smsNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dailyDigest" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Resumo diário
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Receber um resumo diário de todos os alertas
                      </div>
                    </div>
                    <Switch
                      id="dailyDigest"
                      checked={notificationSettings.dailyDigest}
                      onCheckedChange={(checked) => handleNotificationSettingChange('dailyDigest', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Automação</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoGenerateAlerts">Geração automática de alertas</Label>
                      <div className="text-sm text-muted-foreground">
                        Gerar alertas automaticamente com base nas regras definidas
                      </div>
                    </div>
                    <Switch
                      id="autoGenerateAlerts"
                      checked={notificationSettings.autoGenerateAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange('autoGenerateAlerts', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
                <CardDescription>
                  Configure o servidor de email para envio de notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações do Remetente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Nome do Remetente</Label>
                      <Input
                        id="senderName"
                        value={emailSettings.senderName}
                        onChange={(e) => handleEmailSettingChange('senderName', e.target.value)}
                        placeholder="Nome da Academia"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Email do Remetente</Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        value={emailSettings.senderEmail}
                        onChange={(e) => handleEmailSettingChange('senderEmail', e.target.value)}
                        placeholder="contato@academia.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="replyToEmail">Email de Resposta</Label>
                      <Input
                        id="replyToEmail"
                        type="email"
                        value={emailSettings.replyToEmail}
                        onChange={(e) => handleEmailSettingChange('replyToEmail', e.target.value)}
                        placeholder="contato@academia.com"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Configurações SMTP</h3>
                    <Switch
                      id="useSMTP"
                      checked={emailSettings.useSMTP}
                      onCheckedChange={(checked) => handleEmailSettingChange('useSMTP', checked)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">Servidor SMTP</Label>
                      <Input
                        id="smtpServer"
                        value={emailSettings.smtpServer}
                        onChange={(e) => handleEmailSettingChange('smtpServer', e.target.value)}
                        placeholder="smtp.academia.com"
                        disabled={!emailSettings.useSMTP}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">Porta SMTP</Label>
                      <Input
                        id="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={(e) => handleEmailSettingChange('smtpPort', e.target.value)}
                        placeholder="587"
                        disabled={!emailSettings.useSMTP}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">Usuário SMTP</Label>
                      <Input
                        id="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => handleEmailSettingChange('smtpUsername', e.target.value)}
                        placeholder="usuario@academia.com"
                        disabled={!emailSettings.useSMTP}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Senha SMTP</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => handleEmailSettingChange('smtpPassword', e.target.value)}
                        placeholder="********"
                        disabled={!emailSettings.useSMTP}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleTestEmail}
                      disabled={!emailSettings.useSMTP}
                    >
                      Enviar Email de Teste
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Agendamento de Emails</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Resumo Diário
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Enviado todos os dias às 08:00
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Relatório Semanal
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Enviado toda segunda-feira às 09:00
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pagamento</CardTitle>
                <CardDescription>
                  Configure a integração com plataformas de pagamento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Gateway de Pagamento</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gateway">Plataforma</Label>
                    <select
                      id="gateway"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={paymentSettings.gateway}
                      onChange={(e) => handlePaymentSettingChange('gateway', e.target.value)}
                    >
                      <option value="mercadopago">Mercado Pago</option>
                      <option value="pagseguro">PagSeguro</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        value={paymentSettings.apiKey}
                        onChange={(e) => handlePaymentSettingChange('apiKey', e.target.value)}
                        placeholder="Chave de API"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secretKey">Secret Key</Label>
                      <Input
                        id="secretKey"
                        type="password"
                        value={paymentSettings.secretKey}
                        onChange={(e) => handlePaymentSettingChange('secretKey', e.target.value)}
                        placeholder="Chave secreta"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleTestPayment}
                    >
                      Testar Integração
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Métodos de Pagamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>PIX</Label>
                        <div className="text-sm text-muted-foreground">
                          Pagamento instantâneo
                        </div>
                      </div>
                      <Switch
                        checked={paymentSettings.enablePix}
                        onCheckedChange={(checked) => handlePaymentSettingChange('enablePix', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Cartão de Crédito</Label>
                        <div className="text-sm text-muted-foreground">
                          Pagamento parcelado
                        </div>
                      </div>
                      <Switch
                        checked={paymentSettings.enableCreditCard}
                        onCheckedChange={(checked) => handlePaymentSettingChange('enableCreditCard', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Boleto Bancário</Label>
                        <div className="text-sm text-muted-foreground">
                          Pagamento em até 3 dias
                        </div>
                      </div>
                      <Switch
                        checked={paymentSettings.enableBankSlip}
                        onCheckedChange={(checked) => handlePaymentSettingChange('enableBankSlip', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configurações de Faturamento</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoSendInvoice">Envio automático de faturas</Label>
                      <div className="text-sm text-muted-foreground">
                        Enviar faturas automaticamente aos alunos
                      </div>
                    </div>
                    <Switch
                      id="autoSendInvoice"
                      checked={paymentSettings.autoSendInvoice}
                      onCheckedChange={(checked) => handlePaymentSettingChange('autoSendInvoice', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentDays">Dias de antecedência para cobrança</Label>
                      <div className="text-sm text-muted-foreground">
                        Enviar cobrança com antecedência de X dias
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="paymentDays"
                        type="number"
                        value={paymentSettings.paymentDays}
                        onChange={(e) => handlePaymentSettingChange('paymentDays', parseInt(e.target.value))}
                        className="w-16 text-center"
                        min={1}
                        max={30}
                      />
                      <span className="ml-2">dias</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Templates de Mensagens</CardTitle>
                <CardDescription>
                  Personalize os templates de mensagens enviadas aos alunos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Editando: {selectedTemplate.name}</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Voltar
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Nome do Template</Label>
                      <Input
                        id="templateName"
                        value={selectedTemplate.name}
                        onChange={(e) => handleTemplateUpdate('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="templateSubject">Assunto</Label>
                      <Input
                        id="templateSubject"
                        value={selectedTemplate.subject}
                        onChange={(e) => handleTemplateUpdate('subject', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="templateBody">Corpo da Mensagem</Label>
                      <div className="text-xs text-muted-foreground mb-2">
                        Use {'{nome}'} para inserir o nome do aluno, {'{dias}'} para dias de ausência, {'{valor}'} para valor do pagamento.
                      </div>
                      <textarea
                        id="templateBody"
                        value={selectedTemplate.body}
                        onChange={(e) => handleTemplateUpdate('body', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px]"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleTemplateSave}>
                        Salvar Template
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Templates Disponíveis</h3>
                    
                    <div className="space-y-4">
                      {messageTemplates.map((template) => (
                        <Card key={template.id} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Assunto: {template.subject}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTemplateSelect(template.id)}
                              >
                                Editar
                              </Button>
                            </div>
                            <div className="mt-4 p-3 bg-background rounded-md text-sm max-h-32 overflow-y-auto">
                              <p className="whitespace-pre-line">{template.body}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => {
                        const newTemplate = {
                          id: `template-${Date.now()}`,
                          name: 'Novo Template',
                          subject: 'Assunto do Template',
                          body: 'Corpo da mensagem...'
                        };
                        setMessageTemplates([...messageTemplates, newTemplate]);
                        handleTemplateSelect(newTemplate.id);
                      }}>
                        Criar Novo Template
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Pessoais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Nome</Label>
                      <Input
                        id="userName"
                        value={userSettings.name}
                        onChange={(e) => handleUserSettingChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => handleUserSettingChange('email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userPhone">Telefone</Label>
                      <Input
                        id="userPhone"
                        value={userSettings.phone}
                        onChange={(e) => handleUserSettingChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userRole">Função</Label>
                      <select
                        id="userRole"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={userSettings.role}
                        onChange={(e) => handleUserSettingChange('role', e.target.value)}
                        disabled
                      >
                        <option value="admin">Administrador</option>
                        <option value="manager">Gerente</option>
                        <option value="staff">Funcionário</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferências</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userLanguage">Idioma</Label>
                      <select
                        id="userLanguage"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={userSettings.language}
                        onChange={(e) => handleUserSettingChange('language', e.target.value)}
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userTimezone">Fuso Horário</Label>
                      <select
                        id="userTimezone"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={userSettings.timezone}
                        onChange={(e) => handleUserSettingChange('timezone', e.target.value)}
                      >
                        <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                        <option value="America/Manaus">Manaus (GMT-4)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Segurança</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Digite a nova senha"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline">
                      Alterar Senha
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Backup e Restauração</CardTitle>
                <CardDescription>
                  Gerencie backups e restaure dados quando necessário.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Backup Automático</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoBackup">Backup automático diário</Label>
                      <div className="text-sm text-muted-foreground">
                        Realizar backup automático todos os dias às 02:00
                      </div>
                    </div>
                    <Switch
                      id="autoBackup"
                      defaultChecked
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="keepBackups">Manter backups por</Label>
                      <div className="text-sm text-muted-foreground">
                        Período de retenção dos backups
                      </div>
                    </div>
                    <div className="flex items-center">
                      <select
                        id="keepBackups"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="30"
                      >
                        <option value="7">7 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">30 dias</option>
                        <option value="90">90 dias</option>
                        <option value="365">1 ano</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Backup Manual</h3>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Backup Completo</h4>
                      <p className="text-sm text-muted-foreground">
                        Fazer backup de todos os dados do sistema
                      </p>
                    </div>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Iniciar Backup
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Backup Parcial</h4>
                      <p className="text-sm text-muted-foreground">
                        Selecionar quais dados incluir no backup
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Backup Personalizado
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Restauração</h3>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Restaurar Backup</h4>
                      <p className="text-sm text-muted-foreground">
                        Restaurar dados a partir de um arquivo de backup
                      </p>
                    </div>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Histórico de Backups</h3>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Data</th>
                          <th className="text-left p-3 text-sm font-medium">Tamanho</th>
                          <th className="text-left p-3 text-sm font-medium">Status</th>
                          <th className="text-left p-3 text-sm font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">16/05/2024 02:00</td>
                          <td className="p-3">24.5 MB</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Concluído
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">15/05/2024 02:00</td>
                          <td className="p-3">24.3 MB</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Concluído
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;