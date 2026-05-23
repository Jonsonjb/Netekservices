import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import ServicosView from './components/ServicosView';
import CursosView from './components/CursosView';
import OportunidadesView from './components/OportunidadesView';
import KayaMozView from './components/KayaMozView';
import BlogView from './components/BlogView';
import CvCartasView from './components/CvCartasView';
import PortaisView from './components/PortaisView';
import ProfileView from './components/ProfileView';
import ManagerView from './components/ManagerView';
import SegurancaView from './components/SegurancaView';
import InteractiveChatWidget from './components/InteractiveChatWidget';

import { 
  Smartphone, BookOpen, User, Flame, Laptop, Wifi, Globe, LayoutGrid, Search,
  CheckCircle, FileText, Menu, X, ArrowRight, ShieldCheck, Heart, LogIn, LogOut, Check,
  SlidersHorizontal, Home, Compass, BookOpenCheck, Briefcase, KeyRound, ServerCrash
} from 'lucide-react';
import { AppUser, loginWithGoogle, logoutUser, checkAuthStatus, isFirebaseLive } from './firebase';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Real or Simulated User State
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync Auth with Firebase / Local Storage fallback
  useEffect(() => {
    let active = true;
    const loadAuth = async () => {
      const unsub = await checkAuthStatus((u) => {
        if (active) {
          setUser(u);
          setAuthLoading(false);
        }
      });
      return unsub;
    };
    
    const unsubPromise = loadAuth();
    return () => {
      active = false;
      unsubPromise.then(unsub => unsub && unsub());
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const u = await loginWithGoogle();
      setUser(u);
    } catch (e) {
      console.error("Google Auth error:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Render proper subpage inside live website
  const renderPrototypeTab = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomeView setActiveTab={setActiveTab} />;
      case 'servicos':
        return <ServicosView />;
      case 'cursos':
        return <CursosView />;
      case 'oportunidades':
        return <OportunidadesView />;
      case 'kayamoz':
        return <KayaMozView />;
      case 'cvcartas':
        return <CvCartasView user={user} onLogin={handleGoogleLogin} />;
      case 'portais':
        return <PortaisView />;
      case 'blog':
        return <BlogView />;
      case 'perfil':
        return <ProfileView user={user} onLogin={handleGoogleLogin} />;
      case 'gerenciar':
        return <ManagerView />;
      case 'seguranca':
        return <SegurancaView />;
      default:
        return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  // Main navigation link lists mapped
  const navLinks = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'servicos', label: 'Serviços Netek', icon: Laptop },
    { id: 'cursos', label: 'Cursos', icon: BookOpenCheck },
    { id: 'cvcartas', label: 'Criar CV & Cartas', icon: FileText },
    { id: 'portais', label: 'Portais & VPNs', icon: Compass },
    { id: 'oportunidades', label: 'Oportunidades', icon: Briefcase },
    { id: 'kayamoz', label: 'KayaMoz Integração', icon: Globe },
    { id: 'blog', label: 'Dicas IA', icon: Flame },
    { id: 'seguranca', label: 'Cibersegurança (OTP)', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-brand-teal selection:text-slate-950">
      
      {/* Top dynamic micro status bar */}
      <div className="w-full bg-[#05070a] border-b border-white/5 text-[10px] px-4 py-2 flex items-center justify-between z-50 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400 font-mono uppercase tracking-wider">Netek Cloud Engine ativo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono">
            Ligação Firebase: {isFirebaseLive ? (
              <span className="text-emerald-400 font-bold uppercase">PRODUÇÃO LIVE</span>
            ) : (
              <span className="text-cyan-400 font-bold uppercase">SIMULADOR CONSOLA</span>
            )}
          </span>
          {!isFirebaseLive && (
            <span className="text-slate-505 text-[9px] italic hidden md:inline">
              (Aguardando aprovação do wizard na plataforma)
            </span>
          )}
        </div>
      </div>

      {/* Main Site Header/Navbar in freeCodeCamp Style */}
      <header className="sticky top-0 bg-[#0a0a23] border-b border-[#3b3b4f] z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Brand Logo - freeCodeCamp Style */}
          <div 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <Flame className="h-5 w-5 text-[#fecc4c] group-hover:scale-110 transition duration-200" />
            <span className="text-lg font-mono font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
              netekServices<span className="text-[#fecc4c] font-bold tracking-tighter">( )</span>
            </span>
          </div>

          {/* Center Search Input - freeCodeCamp Signature Style */}
          <div className="hidden md:block relative w-96 max-w-md mx-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Pesquise por cursos de IA, modelos de CV, portais..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#1b1b32] border border-[#3b3b4f] outline-none text-slate-100 text-xs px-9 py-1.5 focus:border-[#fecc4c] focus:ring-1 focus:ring-[#fecc4c] transition duration-150 rounded-none font-mono placeholder:text-slate-500"
            />
          </div>

          {/* Action Tools & Authenticators - freeCodeCamp Style */}
          <div className="hidden xl:flex items-center space-x-3">
            
            {/* Quick action access keys */}
            <div className="flex items-center gap-1 bg-[#1b1b32] border border-[#3b3b4f] p-0.5 rounded-none">
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`px-3 py-1 text-xs font-mono tracking-tight transition cursor-pointer rounded-none border ${
                  activeTab === 'perfil' ? 'bg-[#3b3b4f] border-[#fecc4c] text-[#fecc4c]' : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                <span>[ O Meu Perfil ]</span>
              </button>
              <button 
                onClick={() => setActiveTab('gerenciar')}
                className={`px-3 py-1 text-xs font-mono tracking-tight transition cursor-pointer rounded-none border ${
                  activeTab === 'gerenciar' ? 'bg-[#3b3b4f] border-[#fecc4c] text-[#fecc4c]' : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                <span>[ Consola ]</span>
              </button>
            </div>

            {/* Google Authentication */}
            {authLoading ? (
              <div className="h-5 w-5 border border-[#fecc4c] animate-spin border-t-transparent rounded-none"></div>
            ) : user ? (
              <div className="flex items-center bg-[#1b1b32] border border-[#3b3b4f] py-1 px-3 rounded-none gap-3 font-mono">
                <div className="text-left font-mono">
                  <span className="block text-[10px] font-bold text-white leading-none tracking-tight">{user.displayName}</span>
                  <span className="text-[8px] text-slate-400 leading-none block mt-0.5">{user.email}</span>
                </div>
                {user.photoURL && (
                  <img src={user.photoURL} alt={user.displayName} className="h-5 w-5 object-cover border border-[#3b3b4f] rounded-none" referrerPolicy="no-referrer" />
                )}
                <button
                  onClick={handleLogout}
                  title="Terminar Sessão"
                  className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent hover:border-[#3b3b4f] transition cursor-pointer rounded-none"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="px-4 py-1.5 bg-[#1b1b32] hover:bg-[#2a2a40] border border-[#3b3b4f] text-white hover:border-[#fecc4c] text-[10px] font-mono uppercase tracking-wider rounded-none transition flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 text-[#fecc4c]" />
                <span>Entrar (Google)</span>
              </button>
            )}

            <a
              href="https://api.whatsapp.com/send?phone=258835109190&text=Olá%20Netek%20Services%2C%20gostava%20de%20solicitar%20uma%20reunião%20rápida%20conforme%20site."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 text-[10px] font-mono uppercase font-bold tracking-tight rounded-none transition flex items-center gap-1.5 shadow-sm border border-transparent"
            >
              <Smartphone className="h-3 w-3" />
              <span>WhatsApp Peniel</span>
            </a>
          </div>

          {/* Mobile Menu Actions */}
          <div className="xl:hidden flex items-center gap-3">
            {user && (
              <div className="h-6 w-6 border border-[#3b3b4f] overflow-hidden shrink-0 rounded-none">
                {user.photoURL && (
                  <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-2.5 bg-[#1b1b32] text-slate-300 hover:text-white border border-[#3b3b4f] rounded-none text-xs font-mono cursor-pointer"
            >
              {mobileMenuOpen ? 'Fechar' : 'Menu'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#3b3b4f] bg-[#0a0a23] p-5 space-y-3 max-h-[85vh] overflow-y-auto font-mono text-[10px] tracking-tight font-bold">
            
            {/* Mobile login */}
            <div className="border-b border-[#3b3b4f] pb-4 mb-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="h-6 w-6 border border-[#3b3b4f]" referrerPolicy="no-referrer" />}
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white uppercase tracking-tight">{user.displayName}</span>
                      <span className="text-[9px] text-slate-400 normal-case block mt-0.5">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#1b1b32] border border-red-500 text-red-400 rounded-none text-[9px] font-bold"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleGoogleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-[#1b1b32] border border-[#3b3b4f] rounded-none flex items-center justify-center gap-2 text-white text-[10px]"
                >
                  <LogIn className="h-4 w-4 text-[#fecc4c]" />
                  <span>Entrar com o Google</span>
                </button>
              )}
            </div>

            {/* Mobile navigation items grouped in freeCodeCamp style */}
            <div className="space-y-1">
              <span className="block text-[8px] text-slate-400 font-mono tracking-widest uppercase mb-2 px-1">Navegação Geral</span>
              {navLinks.map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs font-mono rounded-none flex items-center gap-2 border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#1b1b32] border-[#fecc4c] text-[#fecc4c]'
                        : 'bg-transparent border-transparent text-slate-300 hover:text-white hover:bg-[#1b1b32]'
                    }`}
                  >
                    <IconComp className="h-4 w-4 text-slate-400" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 pt-4 border-t border-[#3b3b4f]">
              <span className="block text-[8px] text-slate-400 font-mono tracking-widest uppercase mb-2 px-1">Área de Membros</span>
              <button
                onClick={() => {
                  setActiveTab('perfil');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-xs font-mono rounded-none flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === 'perfil'
                    ? 'bg-[#1b1b32] border-[#fecc4c] text-[#fecc4c]'
                    : 'bg-transparent border-transparent text-slate-300 hover:text-white hover:bg-[#1b1b32]'
                }`}
              >
                <User className="h-4 w-4" />
                <span>O Meu Perfil & Marcações</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('gerenciar');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-xs font-mono rounded-none flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === 'gerenciar'
                    ? 'bg-[#1b1b32] border-[#fecc4c] text-[#fecc4c]'
                    : 'bg-transparent border-transparent text-slate-300 hover:text-white hover:bg-[#1b1b32]'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Gerenciar Consola</span>
              </button>
            </div>
            
            <div className="border-t border-[#3b3b4f] pt-4 mt-3">
              <a
                href="https://api.whatsapp.com/send?phone=258835109190"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#fecc4c] text-slate-950 font-mono font-bold tracking-tight text-[10px] rounded-none hover:bg-[#ff9c0a] transition flex items-center justify-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                <span>WhatsApp Direto (+258)</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Layout containing Collapsible Interactive Sidebar on Desktop */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex flex-col lg:flex-row gap-8">
        
        {/* Collapsible Interactive Desktop Sidebar Nav in freeCodeCamp Style */}
        <aside className="lg:w-64 xl:w-72 shrink-0 hidden lg:block select-none text-left">
          <div className="sticky top-24 bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-6">
            
            {/* Title / Collapser */}
            <div className="flex items-center justify-between border-b border-[#3b3b4f] pb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#fecc4c] font-mono">Menu Lateral</span>
              <span className="px-1.5 py-0.5 bg-[#3b3b4f] text-[#fecc4c] border border-[#fecc4c]/30 rounded-none text-[8px] font-mono font-bold">fCC Layout</span>
            </div>

            {/* Links list */}
            <nav className="space-y-1">
              {navLinks.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-3 py-2 rounded-none text-xs font-mono font-bold border transition flex items-center gap-2.5 cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#3b3b4f] text-[#fecc4c] border-[#fecc4c]'
                        : 'bg-transparent text-slate-300 border-transparent hover:text-white hover:bg-[#2a2a40]'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#fecc4c]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Accounts Segment */}
            <div className="pt-5 border-t border-[#3b3b4f] space-y-1">
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono px-1">Portal Admins / Perfis</span>
              
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`w-full px-3 py-2 rounded-none text-xs font-mono font-bold border transition flex items-center gap-2.5 cursor-pointer text-left ${
                  activeTab === 'perfil'
                    ? 'bg-[#3b3b4f] text-[#fecc4c] border-[#fecc4c]'
                    : 'bg-transparent text-slate-300 border-transparent hover:text-white hover:bg-[#2a2a40]'
                }`}
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>O Meu Perfil</span>
              </button>

              <button 
                onClick={() => setActiveTab('gerenciar')}
                className={`w-full px-3 py-2 rounded-none text-xs font-mono font-bold border transition flex items-center gap-2.5 cursor-pointer text-left ${
                  activeTab === 'gerenciar'
                    ? 'bg-[#3b3b4f] text-[#fecc4c] border-[#fecc4c]'
                    : 'bg-transparent text-slate-300 border-transparent hover:text-white hover:bg-[#2a2a40]'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                <span>Consola Gerenciar</span>
              </button>
            </div>

            {/* Quick contact mini widget */}
            <div className="p-4 bg-[#0a0a23] border border-[#3b3b4f] rounded-none text-[11px] text-slate-300 space-y-2 text-center lg:text-left font-mono">
              <span className="block text-[9px] uppercase font-bold text-slate-400">suporte fiduciário</span>
              <p className="leading-relaxed">Suporte assistido nacional (Cota à escolha: 10 a 200 MT+).</p>
              <div className="pt-1 text-center border-t border-[#3b3b4f] text-[10px]">
                <strong className="text-[#fecc4c]">Peniel Mucavel</strong>
              </div>
            </div>

          </div>
        </aside>

        {/* Content Display Spot */}
        <main className="flex-grow min-w-0 min-h-[75vh]">
          {renderPrototypeTab()}
        </main>
      </div>

      {/* Interactive footer in freeCodeCamp Style */}
      <footer className="bg-[#0a0a23] border-t border-[#3b3b4f] py-14 px-4 select-none font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 col-span-1 md:col-span-2 text-left">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-[#fecc4c]" />
              <span className="font-mono font-bold text-white text-lg tracking-tight uppercase">netekServices<span className="text-[#fecc4c]">( )</span></span>
            </div>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed font-sans">
              Capacitamos profissionais moçambicanos com as competências tecnológicas mais exigidas: de infraestrutura de rede à Inteligência Artificial Generativa.
            </p>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              Sede Oficial: Maputo, Moçambique. Sommerchield.
            </div>
          </div>

          <div className="text-left font-mono">
            <span className="block text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-4 border-b border-[#3b3b4f] pb-1">Serviços Académicos</span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => setActiveTab('servicos')} className="hover:text-[#fecc4c] hover:underline transition text-left cursor-pointer">
                  &gt; Consultar Preçários Digitais
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('cursos')} className="hover:text-[#fecc4c] hover:underline transition text-left cursor-pointer">
                  &gt; Cursos Gratuitos de IA
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[#fecc4c] hover:underline transition text-left cursor-pointer">
                  &gt; Dicas para Economizar Dados
                </button>
              </li>
            </ul>
          </div>

          <div className="text-left font-mono">
            <span className="block text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-4 border-b border-[#3b3b4f] pb-1">Pagamentos & Suporte</span>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4 font-sans">
              Métodos de pagamento integrados (Titular: Peniel Dinis Mucavel):
            </p>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5 text-[11px] text-slate-350 font-mono bg-[#1b1b32] p-2.5 border border-[#3b3b4f]">
                <div className="flex items-center justify-between border-b border-[#3b3b4f] pb-1">
                  <span className="text-red-400 font-bold">M-Pesa</span>
                  <span className="text-white">8401666592</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#3b3b4f] pb-1">
                  <span className="text-emerald-400 font-bold">e-Mola</span>
                  <span className="text-white">874786943</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#3b3b4f] pb-1">
                  <span className="text-yellow-500 font-bold">mKesh</span>
                  <span className="text-white">835109190</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[#fecc4c] font-bold">WhatsApp</span>
                  <span className="text-white">835109190</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-300 font-mono hover:text-[#fecc4c] transition">
                Suporte: <a href="mailto:Netekservice@gmail.com" className="underline font-bold text-white normal-case">Netekservice@gmail.com</a>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#3b3b4f] pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <span>© {new Date().getFullYear()} Netek Services LDA. Autoridade Técnica: Peniel Dinis Mucavel.</span>
          <div className="flex items-center gap-4 text-xs font-semibold tracking-wider font-mono">
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-[#fecc4c] mr-2"></span> Infraestrutura Ativa</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-[#198754] mr-2"></span> Canal Fiduciário Ativo</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Chat Widget */}
      <InteractiveChatWidget />

    </div>
  );
}
