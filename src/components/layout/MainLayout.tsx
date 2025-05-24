
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  headerImage?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  pageTitle, 
  pageSubtitle,
  headerImage
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-8 py-1 pr-4 bg-secondary rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-academy-purple"
              />
            </div>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 bg-academy-purple">
                  <span className="sr-only">Perfil</span>
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page header with image */}
        {headerImage && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={headerImage} 
              alt={pageTitle} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
              {pageSubtitle && <p className="text-white/80 mt-1">{pageSubtitle}</p>}
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {!headerImage && pageSubtitle && (
            <div className="mb-6">
              <p className="text-muted-foreground">{pageSubtitle}</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
