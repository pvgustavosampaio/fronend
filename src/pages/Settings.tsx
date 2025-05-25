import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  Bell, 
  DollarSign, 
  Calendar, 
  Settings as SettingsIcon,
  Save,
  Upload,
  Trash2,
  HelpCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('academy');
  const [isSaving, setIsSaving] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [academySettings, setAcademySettings] = useState({
    name: 'Academia Força Local',
    address: 'Rua das Flores, 123',
    phone: '(11) 99999-9999',
    email: 'contato@academiaforce.com',
    description: 'Academia com foco em saúde e bem-estar',
    logo: null
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    attendanceAlerts: true,
    marketingEmails: false,
    retentionAlerts: true
  });
  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'BRL',
    paymentDays: [5, 10, 15],
    gracePeriod: 3,
    lateFee: 2,
    acceptCreditCard: true,
    acceptPix: true,
    acceptBankSlip: true
  });
  const [attendanceSettings, setAttendanceSettings] = useState({
    checkInMethod: 'qrcode',
    allowSelfCheckIn: true,
    trackDuration: true,
    absenceThreshold: 3,
    sendAbsenceAlerts: true
  });
  const [aiSettings, setAiSettings] = useState({
    enablePredictions: true,
    predictionSensitivity: 75,
    autoGenerateAlerts: true,
    dataCollectionConsent: true
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso."
      });
    }, 1500);
  };

  const handleInputChange = (settingsType, field, value) => {
    switch (settingsType) {
      case 'academy':
        setAcademySettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'notification':
        setNotificationSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'payment':
        setPaymentSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'attendance':
        setAttendanceSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'ai':
        setAiSettings(prev => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAcademySettings(prev => ({ ...prev, logo: file }));
    }
  };

  const handlePaymentDaysChange = (e) => {
    const days = e.target.value.split(',').map(day => parseInt(day.trim())).filter(day => !isNaN(day));
    setPaymentSettings(prev => ({ ...prev, paymentDays: days }));
  };

  return (
    <MainLayout
      pageTitle="Configurações"
      pageSubtitle="Personalize o sistema de acordo com suas necessidades"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHelpDialog(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Ajuda
            </Button>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="academy" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Academia
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Frequência
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              IA e Previsões
            </TabsTrigger>
          </TabsList>
          
          {/* Academy Settings */}
          <TabsContent value="academy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Academia</CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua academia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Nome da Academia *</label>
                  <Input 
                    id="name" 
                    value={academySettings.name} 
                    onChange={(e) => handleInputChange('academy', 'name', e.target.value)} 
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Endereço</label>
                  <Input 
                    id="address" 
                    value={academySettings.address} 
                    onChange={(e) => handleInputChange('academy', 'address', e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone *</label>
                    <Input 
                      id="phone" 
                      value={academySettings.phone} 
                      onChange={(e) => handleInputChange('academy', 'phone', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={academySettings.email} 
                      onChange={(e) => handleInputChange('academy', 'email', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
                  <Textarea 
                    id="description" 
                    value={academySettings.description} 
                    onChange={(e) => handleInputChange('academy', 'description', e.target.value)} 
                    rows={4}
                  />
                </div>
                
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium mb-1">Logo da Academia</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                      {academySettings.logo ? (
                        <img 
                          src={URL.createObjectURL(academySettings.logo)} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input 
                        id="logo" 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recomendado: 200x200px, formato PNG ou JPG
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Defina como e quando as notificações serão enviadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por Email</h4>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificações por email para alunos e administradores
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications} 
                    onCheckedChange={(checked) => handleInputChange('notification', 'emailNotifications', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por SMS</h4>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificações por SMS para alunos (taxas adicionais podem ser aplicadas)
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.smsNotifications} 
                    onCheckedChange={(checked) => handleInputChange('notification', 'smsNotifications', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Lembretes de Pagamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Enviar lembretes automáticos de pagamento
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.paymentReminders} 
                    onCheckedChange={(checked) => handleInputChange('notification', 'paymentReminders', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Frequência</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando alunos ficarem ausentes por muitos dias
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.attendanceAlerts} 
                    onCheckedChange={(checked) => handleInputChange('notification', 'attendanceAlerts', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Emails de Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Enviar emails promocionais e de marketing
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails} 
                    onCheckedChange={(checked) => handleInputChange('notification', 'marketingEmails', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Retenção</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre alunos com alto risco de evasão
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.retentionAlerts} 
                    onCheckedChange={(checked) => handleInputChange('notification', 'retentionAlerts', checked)} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pagamento</CardTitle>
                <CardDescription>
                  Configure como os pagamentos serão processados e gerenciados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium mb-1">Moeda</label>
                  <select 
                    id="currency" 
                    className="w-full p-2 border border-border rounded-md bg-background"
                    value={paymentSettings.currency}
                    onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="paymentDays" className="block text-sm font-medium mb-1">Dias de Pagamento</label>
                  <Input 
                    id="paymentDays" 
                    value={paymentSettings.paymentDays.join(', ')} 
                    onChange={handlePaymentDaysChange} 
                    placeholder="Ex: 5, 10, 15"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separe os dias com vírgulas. Ex: 5, 10, 15
                  </p>
                </div>
                
                <div>
                  <label htmlFor="gracePeriod" className="block text-sm font-medium mb-1">Período de Carência (dias)</label>
                  <Input 
                    id="gracePeriod" 
                    type="number" 
                    min="0" 
                    value={paymentSettings.gracePeriod} 
                    onChange={(e) => handleInputChange('payment', 'gracePeriod', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label htmlFor="lateFee" className="block text-sm font-medium mb-1">Multa por Atraso (%)</label>
                  <Input 
                    id="lateFee" 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={paymentSettings.lateFee} 
                    onChange={(e) => handleInputChange('payment', 'lateFee', parseFloat(e.target.value))} 
                  />
                </div>
                
                <div className="space-y-4 mt-4">
                  <h4 className="font-medium">Métodos de Pagamento Aceitos</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Cartão de Crédito</h4>
                    </div>
                    <Switch 
                      checked={paymentSettings.acceptCreditCard} 
                      onCheckedChange={(checked) => handleInputChange('payment', 'acceptCreditCard', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">PIX</h4>
                    </div>
                    <Switch 
                      checked={paymentSettings.acceptPix} 
                      onCheckedChange={(checked) => handleInputChange('payment', 'acceptPix', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Boleto Bancário</h4>
                    </div>
                    <Switch 
                      checked={paymentSettings.acceptBankSlip} 
                      onCheckedChange={(checked) => handleInputChange('payment', 'acceptBankSlip', checked)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attendance Settings */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Frequência</CardTitle>
                <CardDescription>
                  Configure como a frequência dos alunos será registrada e monitorada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="checkInMethod" className="block text-sm font-medium mb-1">Método de Check-in</label>
                  <select 
                    id="checkInMethod" 
                    className="w-full p-2 border border-border rounded-md bg-background"
                    value={attendanceSettings.checkInMethod}
                    onChange={(e) => handleInputChange('attendance', 'checkInMethod', e.target.value)}
                  >
                    <option value="qrcode">QR Code</option>
                    <option value="manual">Check-in Manual</option>
                    <option value="card">Cartão de Acesso</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Permitir Auto Check-in</h4>
                    <p className="text-sm text-muted-foreground">
                      Permitir que alunos façam check-in sem intervenção da recepção
                    </p>
                  </div>
                  <Switch 
                    checked={attendanceSettings.allowSelfCheckIn} 
                    onCheckedChange={(checked) => handleInputChange('attendance', 'allowSelfCheckIn', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Rastrear Duração</h4>
                    <p className="text-sm text-muted-foreground">
                      Registrar o tempo que o aluno permanece na academia
                    </p>
                  </div>
                  <Switch 
                    checked={attendanceSettings.trackDuration} 
                    onCheckedChange={(checked) => handleInputChange('attendance', 'trackDuration', checked)} 
                  />
                </div>
                
                <div>
                  <label htmlFor="absenceThreshold" className="block text-sm font-medium mb-1">Limite de Faltas para Alerta</label>
                  <Input 
                    id="absenceThreshold" 
                    type="number" 
                    min="1" 
                    value={attendanceSettings.absenceThreshold} 
                    onChange={(e) => handleInputChange('attendance', 'absenceThreshold', parseInt(e.target.value))} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Número de faltas consecutivas que acionará um alerta
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enviar Alertas de Ausência</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um aluno atingir o limite de faltas
                    </p>
                  </div>
                  <Switch 
                    checked={attendanceSettings.sendAbsenceAlerts} 
                    onCheckedChange={(checked) => handleInputChange('attendance', 'sendAbsenceAlerts', checked)} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* AI Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de IA e Previsões</CardTitle>
                <CardDescription>
                  Configure como o sistema de inteligência artificial irá analisar seus dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ativar Previsões de IA</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilizar inteligência artificial para prever evasão de alunos
                    </p>
                  </div>
                  <Switch 
                    checked={aiSettings.enablePredictions} 
                    onCheckedChange={(checked) => handleInputChange('ai', 'enablePredictions', checked)} 
                  />
                </div>
                
                <div>
                  <label htmlFor="predictionSensitivity" className="block text-sm font-medium mb-1">
                    Sensibilidade das Previsões: {aiSettings.predictionSensitivity}%
                  </label>
                  <input 
                    id="predictionSensitivity" 
                    type="range" 
                    min="50" 
                    max="95" 
                    value={aiSettings.predictionSensitivity} 
                    onChange={(e) => handleInputChange('ai', 'predictionSensitivity', parseInt(e.target.value))} 
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Menos alertas</span>
                    <span>Mais alertas</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Gerar Alertas Automaticamente</h4>
                    <p className="text-sm text-muted-foreground">
                      Criar alertas automáticos baseados nas previsões da IA
                    </p>
                  </div>
                  <Switch 
                    checked={aiSettings.autoGenerateAlerts} 
                    onCheckedChange={(checked) => handleInputChange('ai', 'autoGenerateAlerts', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Consentimento de Coleta de Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Permitir coleta de dados para melhorar as previsões (dados anonimizados)
                    </p>
                  </div>
                  <Switch 
                    checked={aiSettings.dataCollectionConsent} 
                    onCheckedChange={(checked) => handleInputChange('ai', 'dataCollectionConsent', checked)} 
                  />
                </div>
                
                <div className="p-4 bg-secondary/20 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Sobre o Sistema de IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Nosso sistema de inteligência artificial analisa padrões de comportamento dos alunos para prever 
                    possíveis evasões. Quanto maior a sensibilidade, mais alertas serão gerados, mas alguns podem ser 
                    falsos positivos. Recomendamos começar com 75% e ajustar conforme necessário.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ajuda com as Configurações</DialogTitle>
            <DialogDescription>
              Aprenda como configurar o sistema para melhor atender às necessidades da sua academia
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-medium mb-2">Configurações da Academia</h3>
              <p className="text-sm text-muted-foreground">
                Nesta seção, você pode configurar as informações básicas da sua academia, como nome, 
                endereço, contato e logo. Estas informações serão exibidas em relatórios e comunicações 
                com os alunos.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Configurações de Notificações</h3>
              <p className="text-sm text-muted-foreground">
                Aqui você pode definir como e quando as notificações serão enviadas para você e seus alunos. 
                Você pode ativar ou desativar diferentes tipos de notificações, como lembretes de pagamento 
                e alertas de frequência.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Configurações de Pagamento</h3>
              <p className="text-sm text-muted-foreground">
                Configure como os pagamentos serão processados, incluindo a moeda, dias de pagamento, 
                período de carência e métodos de pagamento aceitos. Estas configurações afetam como 
                o sistema gerencia e processa os pagamentos dos alunos.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Configurações de Frequência</h3>
              <p className="text-sm text-muted-foreground">
                Defina como a frequência dos alunos será registrada e monitorada. Você pode configurar 
                o método de check-in, se os alunos podem fazer check-in sozinhos, e quando alertas de 
                ausência devem ser enviados.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Configurações de IA e Previsões</h3>
              <p className="text-sm text-muted-foreground">
                Controle como o sistema de inteligência artificial analisa seus dados para prever evasão 
                de alunos. Você pode ajustar a sensibilidade das previsões e decidir se alertas devem ser 
                gerados automaticamente.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Settings;