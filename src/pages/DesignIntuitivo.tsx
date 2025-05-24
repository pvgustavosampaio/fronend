
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Brush, 
  Palette, 
  Type, 
  Layers, 
  Sliders, 
  Download, 
  RefreshCw,
  Settings, 
  Grid, 
  Save,
  MoveLeft,
  Monitor,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DesignIntuitivo = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <MainLayout
      pageTitle="Design Intuitivo"
      pageSubtitle="Personalize a aparência da sua academia"
      headerImage="https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2336&q=80"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brush className="h-5 w-5 text-academy-purple" />
            <h2 className="text-xl font-semibold">Design da Sua Academia</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-secondary rounded-full flex items-center p-1">
              <button 
                className={cn(
                  "p-1.5 rounded-full", 
                  !isDarkMode ? "bg-white text-black" : "text-muted-foreground"
                )}
                onClick={() => setIsDarkMode(false)}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button 
                className={cn(
                  "p-1.5 rounded-full", 
                  isDarkMode ? "bg-gray-800 text-white" : "text-muted-foreground"
                )}
                onClick={() => setIsDarkMode(true)}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <span>Pesquisar elementos</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Personalização
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Componentes
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Paleta de Cores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Primária</span>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-academy-purple" />
                        <span className="text-xs text-muted-foreground">#9b87f5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Secundária</span>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-academy-blue" />
                        <span className="text-xs text-muted-foreground">#1EAEDB</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Acento</span>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-academy-pink" />
                        <span className="text-xs text-muted-foreground">#D946EF</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">Personalizar</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Tipografia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Títulos</span>
                      <span className="text-sm font-semibold">SF Pro Display</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Corpo</span>
                      <span className="text-sm font-normal">SF Pro Text</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dados</span>
                      <span className="text-sm font-mono">SF Mono</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">Personalizar</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Elementos UI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Botões</span>
                      <div className="h-6 rounded-md bg-academy-purple px-2 flex items-center">
                        <span className="text-xs text-white">Raio 12px</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cards</span>
                      <div className="h-6 rounded-md border px-2 flex items-center">
                        <span className="text-xs">Sombra 0.3pt</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ícones</span>
                      <span className="text-xs text-muted-foreground">Preenchimento 85%</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">Personalizar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Pré-Visualização em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Dashboard</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">Filtrar</Button>
                      <Button size="sm">Novo Aluno</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Alunos Ativos</div>
                      <div className="text-2xl font-bold">142</div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Ocupação</div>
                      <div className="text-2xl font-bold">78%</div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Receita</div>
                      <div className="text-2xl font-bold">R$ 28.950</div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Evasão</div>
                      <div className="text-2xl font-bold">12%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Biblioteca de Componentes</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-md p-4 text-center hover:bg-secondary cursor-pointer">
                      <div className="text-sm">Cards de Métricas</div>
                    </div>
                    <div className="border rounded-md p-4 text-center hover:bg-secondary cursor-pointer">
                      <div className="text-sm">Gráficos</div>
                    </div>
                    <div className="border rounded-md p-4 text-center hover:bg-secondary cursor-pointer">
                      <div className="text-sm">Sliders</div>
                    </div>
                    <div className="border rounded-md p-4 text-center hover:bg-secondary cursor-pointer">
                      <div className="text-sm">Ícones</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Baixar Template "Fitness Pro"
                    </span>
                    <MoveLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Sincronizar com Adobe Color
                    </span>
                    <MoveLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Exportar Tema (.fig)
                    </span>
                    <MoveLeft className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Barra de Ferramentas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Ajustes Avançados
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Captura de Tela
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Grades e Alinhamento
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Tutoriais
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Exportar Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Formato</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">JSON</Button>
                      <Button variant="outline" size="sm">CSS</Button>
                      <Button variant="outline" size="sm">Figma</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Escopo</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Tema Completo</Button>
                      <Button variant="outline" size="sm">Cores</Button>
                      <Button variant="outline" size="sm">Tipografia</Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Tema
                </Button>
                
                <div className="text-xs text-muted-foreground text-center">
                  v4.2.1 | Suporte a Dark Mode | Cores WCAG 2.1<br />
                  🔒 Alterações salvas automaticamente a cada 5s
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DesignIntuitivo;
