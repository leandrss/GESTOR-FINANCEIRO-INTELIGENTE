"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  User,
  Building2,
  Menu,
  X,
  Shield,
  LogOut,
  MessageSquare
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  accountType?: 'cpf' | 'cnpj';
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

export default function DashboardLayout({ children, accountType = 'cpf' }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999"
  });

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Função para obter primeiro nome
  const getFirstName = (name: string) => {
    return name.trim().split(' ')[0];
  };

  // Função para navegar sem prefetch
  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: MessageSquare },
    { name: 'Boletos', href: '/dashboard/boletos', icon: FileText },
    { name: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3 },
    { name: 'Perfil', href: '/dashboard/perfil', icon: User },
  ];

  if (accountType === 'cnpj') {
    navigation.splice(1, 0, { name: 'Empresarial', href: '/dashboard/cnpj', icon: Building2 });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <button 
              onClick={() => handleNavigate('/')} 
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-[#0D7377]" strokeWidth={2.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#14FFEC]" strokeWidth={3} />
                </div>
              </div>
              <span className="text-xl font-bold text-[#0D7377]">FINZ</span>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Account Type Badge */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0D7377]/10 rounded-lg">
              {accountType === 'cpf' ? (
                <User className="w-4 h-4 text-[#0D7377]" />
              ) : (
                <Building2 className="w-4 h-4 text-[#0D7377]" />
              )}
              <span className="text-sm font-medium text-[#0D7377]">
                {accountType === 'cpf' ? 'Conta Pessoal' : 'Conta Empresarial'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                    isActive
                      ? 'bg-[#0D7377] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* WhatsApp Integration */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-[#0D7377] to-[#14FFEC] rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold text-sm">WhatsApp Conectado</span>
              </div>
              <p className="text-xs opacity-90">
                Envie mensagens para registrar automaticamente
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{getFirstName(userData.name)}</p>
                <p className="text-xs text-gray-500">Assinante Ativo</p>
              </div>
              <div className="w-10 h-10 bg-[#0D7377] rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(userData.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
