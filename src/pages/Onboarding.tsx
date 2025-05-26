import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  Upload, 
  Building, 
  Users, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  {
    id: 'welcome',
    title: 'Bem-vindo à Academia Força Local',
    description: 'Vamos configurar sua academia em poucos passos simples. Não é necessário conhecimento técnico!'
  },
  {
    id: 'basic-info',
    title: 'Informações Básicas',
    description: 'Conte-nos um pouco sobre sua academia'
  },
  {
    id: 'import-data',
    title: 'Importar Dados',
    description: 'Importe seus dados de alunos e pagamentos'
  },
  {
    id: 'plans',
    title: 'Planos e Preços',
    description: 'Configure os planos oferecidos pela sua academia'
  },
  {
    id: 'schedule',
    title: 'Horários e Aulas',
    description: 'Configure os horários e aulas da sua academia'
  },
  {
    id: 'finish',
    title: 'Tudo Pronto!',
    description: 'Sua academia está configurada e pronta para uso'
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [academyData, setAcademyData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    logo: null,
    plans: [
      { name: 'Mensal', price: '', description: '' },
      { name: 'Trimestral', price: '', description: '' },
      { name: 'Anual', price: '', description: '' }
    ],
    classes: [
      { name: 'Musculação', capacity: '', schedule: '' },
      { name: 'Funcional', capacity: '', schedule: '' },
      { name: 'Yoga', capacity: '', schedule: '' }
    ]
  });
  const [importMethod, setImportMethod] = useState('manual');
  const [excelFile, setExcelFile] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (currentStep === 1) {
      // Validate basic info
      if (!academyData.name || !academyData.email || !academyData.phone) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 2) {
      // Simulate data import
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Dados importados com sucesso",
          description: importMethod === 'manual' 
            ? "Configuração manual selecionada" 
            : "Seus dados foram importados com sucesso"
        });
        setCurrentStep(currentStep + 1);
      }, 1500);
      return;
    }

    if (currentStep === 3) {
      // Validate plans
      const hasEmptyPlan = academyData.plans.some(plan => !plan.name || !plan.price);
      if (hasEmptyPlan) {
        toast({
          title: "Planos incompletos",
          description: "Por favor, preencha todos os planos ou remova os não utilizados",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 4) {
      // Validate classes
      const hasEmptyClass = academyData.classes.some(cls => !cls.name || !cls.capacity);
      if (hasEmptyClass) {
        toast({
          title: "Aulas incompletas",
          description: "Por favor, preencha todas as aulas ou remova as não utilizadas",
          variant: "destructive"
        });
        return;
      }
      
      // Save all data to Supabase
      saveAcademyData();
      return;
    }

    if (currentStep === 5) {
      // Finish onboarding and redirect to dashboard
      localStorage.setItem('onboarding_completed', 'true');
      navigate('/dashboard');
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAcademyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanChange = (index, field, value) => {
    setAcademyData(prev => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        [field]: value
      };
      return {
        ...prev,
        plans: updatedPlans
      };
    });
  };

  const handleClassChange = (index, field, value) => {
    setAcademyData(prev => {
      const updatedClasses = [...prev.classes];
      updatedClasses[index] = {
        ...updatedClasses[index],
        [field]: value
      };
      return {
        ...prev,
        classes: updatedClasses
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} selecionado para importação`
      });
    }
  };

  const handleRemovePlan = (index) => {
    setAcademyData(prev => {
      const updatedPlans = [...prev.plans];
      updatedPlans.splice(index, 1);
      return {
        ...prev,
        plans: updatedPlans
      };
    });
    
    toast({
      description: "Plano removido com sucesso"
    });
  };

  const saveAcademyData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would save the data to Supabase
      // For now, we'll just simulate a successful save
      
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Configuração concluída",
          description: "Sua academia foi configurada com sucesso!"
        });
        setCurrentStep(currentStep + 1);
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-academy-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-12 h-12 text-academy-purple" />
              </div>
              <h1 className="text-3xl font-bold">Bem-vindo à Academia Força Local</h1>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                A plataforma inteligente que vai transformar a gestão da sua academia com previsão de evasão, retenção de alunos e muito mais.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
              <div className="space-y-2">
                <Users className="w-8 h-8 text-academy-purple mb-2" />
                <h3 className="font-medium">Gestão de Alunos</h3>
                <p className="text-sm text-muted-foreground">Controle completo dos seus alunos e suas atividades</p>
              </div>
              <div className="space-y-2">
                <DollarSign className="w-8 h-8 text-academy-purple mb-2" />
                <h3 className="font-medium">Controle Financeiro</h3>
                <p className="text-sm text-muted-foreground">Gerencie pagamentos e mensalidades facilmente</p>
              </div>
              <div className="space-y-2">
                <Calendar className="w-8 h-8 text-academy-purple mb-2" />
                <h3 className="font-medium">Agendamento</h3>
                <p className="text-sm text-muted-foreground">Organize aulas e horários de forma eficiente</p>
              </div>
            </div>
          </div>
        );
      
      case 'basic-info':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nome da Academia *</label>
                <Input 
                  id="name" 
                  name="name" 
                  value={academyData.name} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Academia Fitness Plus"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Endereço</label>
                <Input 
                  id="address" 
                  name="address" 
                  value={academyData.address} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Rua das Flores, 123"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone *</label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={academyData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={academyData.email} 
                    onChange={handleInputChange} 
                    placeholder="Ex: contato@academia.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={academyData.description} 
                  onChange={handleInputChange} 
                  placeholder="Descreva sua academia em poucas palavras"
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="logo" className="block text-sm font-medium mb-1">Logo da Academia</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    {academyData.logo ? (
                      <img 
                        src={URL.createObjectURL(academyData.logo)} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Input 
                    id="logo" 
                    name="logo" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAcademyData(prev => ({
                          ...prev,
                          logo: e.target.files[0]
                        }));
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Recomendado: 200x200px, formato PNG ou JPG</p>
              </div>
            </div>
          </div>
        );
      
      case 'import-data':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Escolha como deseja importar seus dados</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input 
                    type="radio" 
                    id="manual" 
                    name="importMethod" 
                    value="manual" 
                    checked={importMethod === 'manual'} 
                    onChange={() => setImportMethod('manual')}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="manual" className="font-medium">Configuração Manual</label>
                    <p className="text-sm text-muted-foreground">Você irá inserir os dados manualmente no sistema</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="radio" 
                    id="excel" 
                    name="importMethod" 
                    value="excel" 
                    checked={importMethod === 'excel'} 
                    onChange={() => setImportMethod('excel')}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="excel" className="font-medium">Importar do Excel</label>
                    <p className="text-sm text-muted-foreground">Importe seus dados a partir de uma planilha Excel</p>
                  </div>
                </div>
              </div>
              
              {importMethod === 'excel' && (
                <div className="mt-6 p-4 border border-dashed border-border rounded-lg">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-center">
                      Arraste e solte sua planilha aqui ou clique para selecionar
                    </p>
                    <Input 
                      type="file" 
                      accept=".xlsx,.xls,.csv" 
                      onChange={handleFileChange}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Formatos suportados: .xlsx, .xls, .csv
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open('/templates/importacao_alunos.xlsx')}
                    >
                      Baixar modelo de planilha
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">O que será importado?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Dados dos alunos (nome, contato, plano)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Histórico de pagamentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Frequência e check-ins</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      case 'plans':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Configure os planos da sua academia</h3>
              
              <div className="space-y-6">
                {academyData.plans.map((plan, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Plano {index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleRemovePlan(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome do Plano *</label>
                        <Input 
                          value={plan.name} 
                          onChange={(e) => handlePlanChange(index, 'name', e.target.value)} 
                          placeholder="Ex: Plano Mensal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço (R$) *</label>
                        <Input 
                          value={plan.price} 
                          onChange={(e) => handlePlanChange(index, 'price', e.target.value)} 
                          placeholder="Ex: 99,90"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Descrição</label>
                      <Textarea 
                        value={plan.description} 
                        onChange={(e) => handlePlanChange(index, 'description', e.target.value)} 
                        placeholder="Descreva os benefícios deste plano"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAcademyData(prev => ({
                      ...prev,
                      plans: [...prev.plans, { name: '', price: '', description: '' }]
                    }));
                  }}
                >
                  Adicionar Plano
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Configure as aulas da sua academia</h3>
              
              <div className="space-y-6">
                {academyData.classes.map((cls, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome da Aula *</label>
                        <Input 
                          value={cls.name} 
                          onChange={(e) => handleClassChange(index, 'name', e.target.value)} 
                          placeholder="Ex: Musculação"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Capacidade *</label>
                        <Input 
                          value={cls.capacity} 
                          onChange={(e) => handleClassChange(index, 'capacity', e.target.value)} 
                          placeholder="Ex: 20"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Horários</label>
                      <Input 
                        value={cls.schedule} 
                        onChange={(e) => handleClassChange(index, 'schedule', e.target.value)} 
                        placeholder="Ex: Segunda e Quarta, 18h-19h"
                      />
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAcademyData(prev => ({
                      ...prev,
                      classes: [...prev.classes, { name: '', capacity: '', schedule: '' }]
                    }));
                  }}
                >
                  Adicionar Aula
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'finish':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold">Configuração Concluída!</h1>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Sua academia está configurada e pronta para uso. Você pode começar a usar o sistema agora mesmo!
              </p>
            </motion.div>
            
            <div className="bg-secondary/20 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-medium mb-2">Resumo da Configuração</h3>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Academia: {academyData.name}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{academyData.plans.length} planos configurados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{academyData.classes.length} aulas configuradas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Sistema de previsão de evasão ativado</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-secondary/20 h-1">
        <div 
          className="h-1 bg-academy-purple transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        {/* Steps indicator */}
        <div className="flex justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center ${index > currentStep ? 'text-muted-foreground' : ''}`}
              style={{ width: `${100 / steps.length}%` }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep 
                    ? 'bg-academy-purple text-white' 
                    : index === currentStep 
                    ? 'bg-academy-purple/20 text-academy-purple border-2 border-academy-purple' 
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs text-center hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        
        {/* Step content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-2">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground text-center mb-8">{steps[currentStep].description}</p>
          
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || loading}
          >
            Voltar
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Processando...
              </>
            ) : currentStep === steps.length - 1 ? (
              'Ir para o Dashboard'
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;