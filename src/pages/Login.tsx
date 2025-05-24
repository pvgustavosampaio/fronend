
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Academia Força Local</h1>
            <h2 className="text-xl text-foreground">Plataforma de Gestão Inteligente</h2>
            <p className="text-muted-foreground mt-2">Entre para gerenciar sua academia com IA.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
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
                <a href="#" className="text-academy-purple hover:underline">
                  Esqueceu a senha?
                </a>
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
              Demonstração disponível - use qualquer email/senha
            </p>
          </form>
        </div>
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
