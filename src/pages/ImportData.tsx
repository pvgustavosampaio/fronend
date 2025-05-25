import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  RefreshCw,
  FileDown,
  FileUp,
  HelpCircle
} from 'lucide-react';

interface Student {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  [key: string]: any;
}

const ImportData = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('import');
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [mappings, setMappings] = useState<{[key: string]: string}>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Required fields for import
  const requiredFields = ['name', 'email', 'phone'];
  
  // Available fields for mapping
  const availableFields = [
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telefone' },
    { value: 'birthdate', label: 'Data de Nascimento' },
    { value: 'address', label: 'Endereço' },
    { value: 'plan', label: 'Plano' },
    { value: 'startDate', label: 'Data de Início' },
    { value: 'notes', label: 'Observações' }
  ];

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    
    // Read the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        // Get headers
        const headers = Object.keys(jsonData[0] || {});
        setHeaders(headers);
        
        // Try to automatically map fields
        const autoMappings: {[key: string]: string} = {};
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          
          if (lowerHeader.includes('nome') || lowerHeader === 'name') {
            autoMappings[header] = 'name';
          } else if (lowerHeader.includes('email') || lowerHeader.includes('e-mail')) {
            autoMappings[header] = 'email';
          } else if (lowerHeader.includes('telefone') || lowerHeader.includes('celular') || lowerHeader.includes('phone')) {
            autoMappings[header] = 'phone';
          } else if (lowerHeader.includes('nascimento') || lowerHeader.includes('birth')) {
            autoMappings[header] = 'birthdate';
          } else if (lowerHeader.includes('endereço') || lowerHeader.includes('address')) {
            autoMappings[header] = 'address';
          } else if (lowerHeader.includes('plano') || lowerHeader.includes('plan')) {
            autoMappings[header] = 'plan';
          } else if (lowerHeader.includes('início') || lowerHeader.includes('start')) {
            autoMappings[header] = 'startDate';
          } else if (lowerHeader.includes('observações') || lowerHeader.includes('notes')) {
            autoMappings[header] = 'notes';
          }
        });
        
        setMappings(autoMappings);
        
        // Preview the data
        setStudents(jsonData.slice(0, 5).map(row => {
          const student: Student = { name: '', email: '', phone: '' };
          
          // Apply mappings
          Object.keys(autoMappings).forEach(header => {
            const field = autoMappings[header];
            student[field] = row[header];
          });
          
          return student;
        }));
        
        toast({
          title: "Arquivo carregado com sucesso",
          description: `${jsonData.length} registros encontrados`
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          variant: "destructive",
          title: "Erro ao processar arquivo",
          description: "O arquivo não pôde ser lido. Verifique se é um arquivo Excel válido."
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  }, [toast]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  // Handle field mapping change
  const handleMappingChange = (header: string, field: string) => {
    setMappings(prev => ({
      ...prev,
      [header]: field
    }));
  };

  // Check if all required fields are mapped
  const areRequiredFieldsMapped = () => {
    return requiredFields.every(field => 
      Object.values(mappings).includes(field)
    );
  };

  // Process the import
  const processImport = async () => {
    if (!file || !areRequiredFieldsMapped()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios não mapeados",
        description: "Por favor, mapeie todos os campos obrigatórios (Nome, Email, Telefone)."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Read the Excel file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
          
          // Process each row
          let successCount = 0;
          let errorCount = 0;
          
          // In a real implementation, this would send the data to the server
          // For now, we'll simulate a successful import with a delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          successCount = jsonData.length;
          
          setImportedCount(successCount);
          setErrorCount(errorCount);
          setImportStatus(errorCount > 0 ? 'error' : 'success');
          
          toast({
            title: "Importação concluída",
            description: `${successCount} alunos importados com sucesso. ${errorCount} erros.`
          });
        } catch (error) {
          console.error('Error processing import:', error);
          setImportStatus('error');
          toast({
            variant: "destructive",
            title: "Erro na importação",
            description: "Ocorreu um erro ao processar os dados. Tente novamente."
          });
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setIsProcessing(false);
      setImportStatus('error');
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: "Ocorreu um erro ao ler o arquivo. Tente novamente."
      });
    }
  };

  // Download template
  const downloadTemplate = () => {
    // Create a template workbook
    const wb = XLSX.utils.book_new();
    
    // Create template data
    const templateData = [
      {
        'Nome': 'João Silva',
        'Email': 'joao.silva@example.com',
        'Telefone': '(11) 98765-4321',
        'Data de Nascimento': '1990-01-15',
        'Endereço': 'Rua Exemplo, 123',
        'Plano': 'Mensal',
        'Data de Início': '2023-06-01',
        'Observações': 'Aluno novo'
      }
    ];
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // Generate Excel file
    XLSX.writeFile(wb, 'template_importacao_alunos.xlsx');
    
    toast({
      title: "Template baixado",
      description: "O template para importação foi baixado com sucesso."
    });
  };

  return (
    <MainLayout pageTitle="Importação de Dados" pageSubtitle="Importe dados de alunos via planilha Excel">
      <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Importar Dados
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Histórico de Importações
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Ajuda
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Alunos</CardTitle>
              <CardDescription>
                Importe dados de alunos a partir de uma planilha Excel. 
                <Button variant="link" className="p-0 h-auto" onClick={downloadTemplate}>
                  Baixar template
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File upload area */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <input {...getInputProps()} />
                <FileSpreadsheet className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                {file ? (
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setHeaders([]);
                        setMappings({});
                        setStudents([]);
                        setImportStatus('idle');
                      }}
                    >
                      Remover arquivo
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Arraste e solte um arquivo Excel aqui, ou clique para selecionar</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Suporta arquivos .xlsx e .xls
                    </p>
                  </div>
                )}
              </div>
              
              {/* Field mappings */}
              {headers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Mapeamento de Campos</h3>
                  <p className="text-sm text-muted-foreground">
                    Mapeie as colunas da sua planilha para os campos do sistema. 
                    Os campos marcados com * são obrigatórios.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {headers.map(header => (
                      <div key={header} className="space-y-2">
                        <Label>
                          Coluna: <span className="font-medium">{header}</span>
                        </Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={mappings[header] || ''}
                          onChange={(e) => handleMappingChange(header, e.target.value)}
                        >
                          <option value="">Selecione um campo</option>
                          {availableFields.map(field => (
                            <option key={field.value} value={field.value}>
                              {field.label} {requiredFields.includes(field.value) ? '*' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  
                  {/* Preview */}
                  {students.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Pré-visualização</h3>
                      <div className="border rounded-lg overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome *</TableHead>
                              <TableHead>Email *</TableHead>
                              <TableHead>Telefone *</TableHead>
                              <TableHead>Outros Campos</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student, index) => (
                              <TableRow key={index}>
                                <TableCell>{student.name || <span className="text-red-500">Não mapeado</span>}</TableCell>
                                <TableCell>{student.email || <span className="text-red-500">Não mapeado</span>}</TableCell>
                                <TableCell>{student.phone || <span className="text-red-500">Não mapeado</span>}</TableCell>
                                <TableCell>
                                  {Object.entries(student)
                                    .filter(([key]) => !['name', 'email', 'phone'].includes(key))
                                    .map(([key, value]) => (
                                      <div key={key} className="text-xs">
                                        <span className="font-medium">{key}:</span> {value}
                                      </div>
                                    ))
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mostrando {students.length} de {file ? 'muitos' : '0'} registros
                      </p>
                    </div>
                  )}
                  
                  {/* Import button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={processImport} 
                      disabled={!areRequiredFieldsMapped() || isProcessing}
                      className="gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processando...
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
              )}
              
              {/* Import status */}
              {importStatus === 'success' && (
                <Alert className="bg-green-500/10 border-green-500 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Importação concluída com sucesso</AlertTitle>
                  <AlertDescription>
                    {importedCount} alunos foram importados com sucesso.
                  </AlertDescription>
                </Alert>
              )}
              
              {importStatus === 'error' && (
                <Alert className="bg-red-500/10 border-red-500 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro na importação</AlertTitle>
                  <AlertDescription>
                    {importedCount} alunos foram importados com sucesso. {errorCount} registros com erro.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Importações</CardTitle>
              <CardDescription>
                Veja o histórico de importações realizadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>alunos_maio_2024.xlsx</TableCell>
                    <TableCell>42 importados</TableCell>
                    <TableCell className="text-green-500">Concluído</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{new Date(Date.now() - 86400000).toLocaleDateString()}</TableCell>
                    <TableCell>novos_alunos.xlsx</TableCell>
                    <TableCell>15 importados</TableCell>
                    <TableCell className="text-green-500">Concluído</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajuda e Documentação</CardTitle>
              <CardDescription>
                Aprenda como importar dados de alunos para o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Como importar dados</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Baixe o template de importação clicando no link "Baixar template"</li>
                  <li>Preencha o template com os dados dos alunos</li>
                  <li>Arraste e solte o arquivo na área de upload ou clique para selecionar</li>
                  <li>Mapeie as colunas da planilha para os campos do sistema</li>
                  <li>Verifique a pré-visualização dos dados</li>
                  <li>Clique em "Importar Dados" para concluir</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Campos obrigatórios</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Nome:</strong> Nome completo do aluno</li>
                  <li><strong>Email:</strong> Endereço de email válido</li>
                  <li><strong>Telefone:</strong> Número de telefone com DDD</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Dicas</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Certifique-se de que não há linhas vazias na planilha</li>
                  <li>Verifique se os emails estão no formato correto</li>
                  <li>Números de telefone devem incluir o DDD</li>
                  <li>Datas devem estar no formato AAAA-MM-DD</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Suporte</h3>
                <p>
                  Se precisar de ajuda adicional, entre em contato com o suporte técnico:
                  <br />
                  <a href="mailto:suporte@academia.com" className="text-primary">suporte@academia.com</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ImportData;