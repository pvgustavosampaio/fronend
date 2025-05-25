import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  HelpCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ImportData = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [columnMapping, setColumnMapping] = useState({
    students: {
      name: '',
      email: '',
      phone: '',
      plan: '',
      startDate: ''
    },
    payments: {
      student: '',
      amount: '',
      date: '',
      status: ''
    },
    attendance: {
      student: '',
      date: '',
      class: ''
    }
  });
  
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // In a real implementation, this would parse the Excel file
      // For now, we'll just simulate preview data
      
      let mockData;
      if (activeTab === 'students') {
        mockData = [
          { A: 'João Silva', B: 'joao@email.com', C: '(11) 99999-9999', D: 'Mensal', E: '01/01/2023' },
          { A: 'Maria Oliveira', B: 'maria@email.com', C: '(11) 88888-8888', D: 'Trimestral', E: '15/02/2023' },
          { A: 'Carlos Santos', B: 'carlos@email.com', C: '(11) 77777-7777', D: 'Anual', E: '10/03/2023' }
        ];
      } else if (activeTab === 'payments') {
        mockData = [
          { A: 'João Silva', B: '99.90', C: '05/05/2023', D: 'Pago' },
          { A: 'Maria Oliveira', B: '269.90', C: '10/05/2023', D: 'Pendente' },
          { A: 'Carlos Santos', B: '999.90', C: '15/03/2023', D: 'Pago' }
        ];
      } else {
        mockData = [
          { A: 'João Silva', B: '02/05/2023 18:30', C: 'Musculação' },
          { A: 'Maria Oliveira', B: '03/05/2023 10:15', C: 'Yoga' },
          { A: 'Carlos Santos', B: '04/05/2023 19:00', C: 'Funcional' }
        ];
      }
      
      setPreviewData(mockData);
      setShowMappingDialog(true);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setPreviewData(null);
      
      toast({
        title: "Importação concluída",
        description: `Dados de ${getTabName(activeTab)} importados com sucesso!`
      });
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template baixado",
      description: `O modelo de importação para ${getTabName(activeTab)} foi baixado.`
    });
  };

  const getTabName = (tab) => {
    switch (tab) {
      case 'students': return 'alunos';
      case 'payments': return 'pagamentos';
      case 'attendance': return 'frequência';
      default: return tab;
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'students': return <Users className="h-4 w-4" />;
      case 'payments': return <DollarSign className="h-4 w-4" />;
      case 'attendance': return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleColumnMappingChange = (field, value) => {
    setColumnMapping(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const getFieldOptions = () => {
    // Get column letters from preview data
    if (!previewData || previewData.length === 0) return [];
    
    const firstRow = previewData[0];
    return Object.keys(firstRow).map(key => ({
      value: key,
      label: `Coluna ${key} (${firstRow[key]})`
    }));
  };

  return (
    <MainLayout
      pageTitle="Importação de Dados"
      pageSubtitle="Importe seus dados de planilhas para o sistema"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Importação de Dados</h2>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHelpDialog(true)}
            className="gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Ajuda
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Frequência
            </TabsTrigger>
          </TabsList>
          
          {['students', 'payments', 'attendance'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <div className="bg-secondary/10 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium mb-4">Importar {getTabName(tab)}</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg">
                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center mb-4">
                      Arraste e solte sua planilha Excel aqui ou clique para selecionar
                    </p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Selecionar Arquivo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Formatos suportados: .xlsx, .xls, .csv
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadTemplate}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Baixar Modelo
                    </Button>
                    
                    <Button 
                      onClick={handleUpload} 
                      disabled={!file || isUploading}
                      className="gap-2"
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Importando...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Importar Dados
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/10 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium mb-4">Instruções de Importação</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <p>Baixe o modelo de planilha clicando no botão "Baixar Modelo"</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <p>Preencha a planilha com seus dados seguindo o formato do modelo</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <p>Salve a planilha e faça o upload clicando em "Selecionar Arquivo"</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <p>Verifique os dados e clique em "Importar Dados"</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">Importante</p>
                      <p className="text-sm">
                        Certifique-se de que sua planilha segue exatamente o formato do modelo. 
                        Dados em formato incorreto podem causar erros na importação.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ajuda para Importação de Dados</DialogTitle>
            <DialogDescription>
              Aprenda como importar seus dados corretamente para o sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-medium mb-2">Formatos de Arquivo Suportados</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Excel (.xlsx, .xls) - Recomendado</li>
                <li>CSV (.csv) - Certifique-se de usar ponto e vírgula (;) como separador</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Requisitos para Cada Tipo de Importação</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Alunos
                  </h4>
                  <p className="text-sm mb-2">Colunas necessárias:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Nome (obrigatório)</li>
                    <li>Email (obrigatório)</li>
                    <li>Telefone</li>
                    <li>Plano</li>
                    <li>Data de início</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pagamentos
                  </h4>
                  <p className="text-sm mb-2">Colunas necessárias:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Aluno (nome ou email - obrigatório)</li>
                    <li>Valor (obrigatório)</li>
                    <li>Data (obrigatório)</li>
                    <li>Status (Pago, Pendente, Atrasado)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Frequência
                  </h4>
                  <p className="text-sm mb-2">Colunas necessárias:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Aluno (nome ou email - obrigatório)</li>
                    <li>Data e hora (obrigatório)</li>
                    <li>Aula ou atividade</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Dicas para uma Importação Bem-Sucedida</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use o modelo fornecido para garantir a compatibilidade</li>
                <li>Verifique se não há células em branco em campos obrigatórios</li>
                <li>Datas devem estar no formato DD/MM/AAAA</li>
                <li>Valores monetários devem usar ponto como separador decimal (ex: 99.90)</li>
                <li>Remova quaisquer formatações especiais da planilha</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Column Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Mapeamento de Colunas</DialogTitle>
            <DialogDescription>
              Associe as colunas da sua planilha aos campos do sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewData && previewData[0] && Object.keys(previewData[0]).map(key => (
                      <TableHead key={key}>Coluna {key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData && previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Mapeie as colunas para os campos do sistema</h3>
              
              {activeTab === 'students' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.students.name}
                      onChange={(e) => handleColumnMappingChange('name', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.students.email}
                      onChange={(e) => handleColumnMappingChange('email', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.students.phone}
                      onChange={(e) => handleColumnMappingChange('phone', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plano</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.students.plan}
                      onChange={(e) => handleColumnMappingChange('plan', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Início</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.students.startDate}
                      onChange={(e) => handleColumnMappingChange('startDate', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              {activeTab === 'payments' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Aluno *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.payments.student}
                      onChange={(e) => handleColumnMappingChange('student', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.payments.amount}
                      onChange={(e) => handleColumnMappingChange('amount', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.payments.date}
                      onChange={(e) => handleColumnMappingChange('date', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.payments.status}
                      onChange={(e) => handleColumnMappingChange('status', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              {activeTab === 'attendance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Aluno *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.attendance.student}
                      onChange={(e) => handleColumnMappingChange('student', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data e Hora *</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.attendance.date}
                      onChange={(e) => handleColumnMappingChange('date', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Aula/Atividade</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={columnMapping.attendance.class}
                      onChange={(e) => handleColumnMappingChange('class', e.target.value)}
                    >
                      <option value="">Selecione uma coluna</option>
                      {getFieldOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMappingDialog(false)}>Cancelar</Button>
            <Button 
              onClick={() => {
                setShowMappingDialog(false);
                handleUpload();
              }}
            >
              Confirmar e Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ImportData;