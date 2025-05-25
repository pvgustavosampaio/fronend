import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vinda de volta à plataforma.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password, name);
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Não foi possível criar sua conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(resetEmail);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
      setActiveTab('login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email de redefinição. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Academia Força Local</h1>
            <h2 className="text-xl text-foreground">Plataforma de Gestão Inteligente</h2>
            <p className="text-muted-foreground mt-2">Gerencie sua academia com inteligência artificial.</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                      Lembrar de mim
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <button 
                      type="button" 
                      className="text-academy-purple hover:underline"
                      onClick={() => setActiveTab('reset')}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-academy-purple hover:bg-academy-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <button 
                    type="button" 
                    className="text-academy-purple hover:underline"
                    onClick={() => setActiveTab('register')}
                  >
                    Registre-se
                  </button>
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Nome
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
                    Confirmar Senha
                  </label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-academy-purple hover:bg-academy-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
                
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <button 
                    type="button" 
                    className="text-academy-purple hover:underline"
                    onClick={() => setActiveTab('login')}
                  >
                    Faça login
                  </button>
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="reset" className="space-y-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-academy-purple hover:bg-academy-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Email de Redefinição"}
                </Button>
                
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  <button 
                    type="button" 
                    className="text-academy-purple hover:underline"
                    onClick={() => setActiveTab('login')}
                  >
                    Voltar para o login
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Right side - image */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80')",
          backgroundPosition: "center 30%"
        }}
      >
        <div className="h-full w-full bg-gradient-to-r from-background to-transparent flex flex-col justify-center pl-12 pr-20">
          <div className="glass-morphism p-8 max-w-lg rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Transforme sua academia com IA</h2>
            <p className="text-white/80 mb-6">
              O sistema inteligente que prevê evasão, aumenta a retenção e 
              potencializa seus resultados, especialmente no inverno.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <div className="rounded-full bg-academy-purple/20 p-2 mr-3">
                  <svg className="w-5 h-5 text-academy-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-white">Reduza a evasão em até 20%</p>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-academy-purple/20 p-2 mr-3">
                  <svg className="w-5 h-5 text-academy-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-white">Alertas automáticos de risco</p>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-academy-purple/20 p-2 mr-3">
                  <svg className="w-5 h-5 text-academy-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-white">Dados e análises em tempo real</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;