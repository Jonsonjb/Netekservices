import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, Shield, Clock, ShieldAlert, Award, Star, 
  Trash2, Check, RefreshCw, AlertTriangle, Users, Heart, KeyRound, 
  PlusCircle, BookOpen, Briefcase, FileText, Sparkles, CheckSquare, XCircle, ToggleLeft, ToggleRight
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  phone: string;
  isActive: boolean;
}

export default function ManagerView() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sub-tabs states
  const [activeSubTab, setActiveSubTab] = useState<'dados' | 'membros' | 'publicar'>('dados');

  const [bookings, setBookings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Team Members State
  const [members, setMembers] = useState<TeamMember[]>([]);
  // Form state for team member
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    role: '',
    location: 'Maputo',
    phone: '',
  });

  // Content publisher states
  const [publishType, setPublishType] = useState<'job' | 'blog'>('job');
  // Job Form
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Maputo',
    type: 'Full-time',
    salaryRange: '',
    contact: '',
    description: '',
    skills: ''
  });
  // Blog Form
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    category: 'IA e Produtividade',
    author: 'Equipa Netek',
    content: ''
  });

  const [publishSuccessMessage, setPublishSuccessMessage] = useState('');

  // Stats
  const [bookingStats, setBookingStats] = useState({ pendents: 0, completed: 0, total: 0 });

  const loadAllData = () => {
    // Check local auth session
    const authSession = sessionStorage.getItem('netek_admin_authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }

    // Booking
    try {
      const savedBookings = localStorage.getItem('netek_pre_bookings');
      const bList = savedBookings ? JSON.parse(savedBookings) : [];
      setBookings(bList);
      
      const pCount = bList.filter((b: any) => b.status.includes('Pendente') || b.status.includes('Aguardando')).length;
      setBookingStats({
        pendents: pCount,
        completed: bList.length - pCount,
        total: bList.length
      });
    } catch (e) { console.error(e); }

    // Reports (denúncias)
    try {
      const savedReports = localStorage.getItem('netek_reports');
      setReports(savedReports ? JSON.parse(savedReports) : []);
    } catch (e) { console.error(e); }

    // Contributions
    try {
      const savedContributions = localStorage.getItem('netek_portal_contributions');
      setContributions(savedContributions ? JSON.parse(savedContributions) : []);
    } catch (e) { console.error(e); }

    // Reviews
    try {
      const savedReviews = localStorage.getItem('netek_portal_reviews');
      setReviews(savedReviews ? JSON.parse(savedReviews) : []);
    } catch (e) { console.error(e); }

    // Team members
    try {
      const savedMembers = localStorage.getItem('netek_members');
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      } else {
        const defaultMembers: TeamMember[] = [
          { id: 'm1', name: 'Peniel Dinis Mucavel', role: 'Director Coordenador Geral', location: 'Maputo', phone: '+258 84 016 6592', isActive: true },
          { id: 'm2', name: 'Isaías Suporte', role: 'Assistente e Simulador Técnico', location: 'Maputo', phone: '+258 83 510 9190', isActive: true },
          { id: 'm3', name: 'Eng. Nelson Tamele', role: 'Engenheiro de Front-end', location: 'Sofala / Beira', phone: '+258 87 478 6943', isActive: true },
          { id: 'm4', name: 'Dra. Elsa Matusse', role: 'Gestora de Parcerias e Tráfego', location: 'Inhambane', phone: '+258 82 112 2334', isActive: false },
        ];
        localStorage.setItem('netek_members', JSON.stringify(defaultMembers));
        setMembers(defaultMembers);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Admin login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (adminEmail === 'netekservice@gmail.com' && adminPassword === 'netek2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('netek_admin_authenticated', 'true');
    } else {
      setLoginError('Acesso recusado. Por favor use as credenciais indicadas no painel.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('netek_admin_authenticated');
  };

  // Action methods
  const handleUpdateBookingStatus = (id: string, newStatus: string) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('netek_pre_bookings', JSON.stringify(updated));
    loadAllData();
  };

  const handleDeleteBooking = (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este registo de pré-marcação?')) return;
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('netek_pre_bookings', JSON.stringify(updated));
    loadAllData();
  };

  const handleResolveReport = (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('netek_reports', JSON.stringify(updated));
  };

  const handleClearAllReviews = () => {
    if (!window.confirm('Excluir todas as avaliações locais?')) return;
    localStorage.removeItem('netek_portal_reviews');
    setReviews([]);
  };

  // --- MEMBER MANAGEMENT ---
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.role) return;

    const newM: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMemberForm.name,
      role: newMemberForm.role,
      location: newMemberForm.location,
      phone: newMemberForm.phone || '+258 84 000 0000',
      isActive: true,
    };

    const updated = [...members, newM];
    setMembers(updated);
    localStorage.setItem('netek_members', JSON.stringify(updated));
    
    // reset form
    setNewMemberForm({
      name: '',
      role: '',
      location: 'Maputo',
      phone: '',
    });
    setPublishSuccessMessage('Membro da equipa adicionado e ativado com sucesso!');
    setTimeout(() => setPublishSuccessMessage(''), 4000);
  };

  const handleToggleMember = (id: string) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, isActive: !m.isActive };
      }
      return m;
    });
    setMembers(updated);
    localStorage.setItem('netek_members', JSON.stringify(updated));
  };

  const handleDeleteMember = (id: string) => {
    if (!window.confirm('Deseja excluir permanentemente este membro técnico da equipa?')) return;
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    localStorage.setItem('netek_members', JSON.stringify(updated));
  };

  // --- CONTENT PUBLISHING ---
  const handlePublishJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company || !jobForm.description) return;

    // Load existing jobs or fallback to empty
    const savedJobsStr = localStorage.getItem('netek_dynamic_vacancies');
    const existingList = savedJobsStr ? JSON.parse(savedJobsStr) : [];

    const newJob = {
      id: `published-job-${Date.now()}`,
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location,
      description: jobForm.description,
      type: jobForm.type,
      salaryRange: jobForm.salaryRange || 'A combinar',
      contactEmailOrPhone: jobForm.contact || 'Netekservice@gmail.com',
      skillsRequired: jobForm.skills ? jobForm.skills.split(',').map(s => s.trim()) : ['Geral'],
      datePosted: 'Hoje',
      isProfessionalProfile: false
    };

    const updated = [newJob, ...existingList];
    localStorage.setItem('netek_dynamic_vacancies', JSON.stringify(updated));

    setPublishSuccessMessage(`Oportunidade "${jobForm.title}" foi publicada e ativada em tempo real com sucesso!`);
    
    // Reset Form
    setJobForm({
      title: '',
      company: '',
      location: 'Maputo',
      type: 'Full-time',
      salaryRange: '',
      contact: '',
      description: '',
      skills: ''
    });

    setTimeout(() => setPublishSuccessMessage(''), 4000);
  };

  const handlePublishBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.summary || !blogForm.content) return;

    const savedBlogsStr = localStorage.getItem('netek_dynamic_blogs');
    const existingList = savedBlogsStr ? JSON.parse(savedBlogsStr) : [];

    const newBlog = {
      id: `published-blog-${Date.now()}`,
      title: blogForm.title,
      summary: blogForm.summary,
      content: blogForm.content,
      category: blogForm.category,
      date: 'Hoje',
      readTime: '4 min',
      author: blogForm.author || 'Equipa Netek',
      views: 12
    };

    const updated = [newBlog, ...existingList];
    localStorage.setItem('netek_dynamic_blogs', JSON.stringify(updated));

    setPublishSuccessMessage(`Artigo de Dicas IA "${blogForm.title}" foi publicado com sucesso!`);
    
    // Reset Form
    setBlogForm({
      title: '',
      summary: '',
      category: 'IA e Produtividade',
      author: 'Equipa Netek',
      content: ''
    });

    setTimeout(() => setPublishSuccessMessage(''), 4000);
  };


  // Render Login Lock Screen if NOT authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 py-10 px-8 bg-[#1b1b32] border border-[#3b3b4f] rounded-none shadow-2xl animate-fadeIn space-y-6 text-left font-mono">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-[#fecc4c]/10 text-[#fecc4c] border border-[#fecc4c]/30 rounded-none flex items-center justify-center mx-auto mb-2">
            <Shield className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-md uppercase font-bold text-white tracking-widest">
            Acesso Restrito Administrators
          </h3>
          <p className="text-[10px] text-slate-400">
            Guarde as vossas credenciais Netek em segurança de ficheiro medido.
          </p>
        </div>

        {/* Highlighted Credentials Tip Badge for Evaluators */}
        <div className="p-4 bg-[#0a0a23] border border-emerald-500/30 text-emerald-400 text-xs rounded-none space-y-1">
          <span className="block font-bold text-white uppercase text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> DICA DE TESTE DE PLATAFORMA
          </span>
          <p className="text-[11px] font-sans text-slate-300">
            Para avaliar as opções administrativas de adicionar equipa, activar e publicar conteúdos, use as credenciais oficiais Netek:
          </p>
          <div className="pt-2 text-[10.5px] space-y-0.5">
            <div><span className="text-slate-400">Email:</span> <strong className="text-white">netekservice@gmail.com</strong></div>
            <div><span className="text-slate-400">Senha:</span> <strong className="text-white">netek2026</strong></div>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">E-mail Corporativo</label>
            <input 
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="exemplo@netek.co.mz"
              className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Código PIN ou Senha</label>
            <input 
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Digite o código..."
              className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
            />
          </div>

          {loginError && (
            <div className="text-[11px] text-red-400 font-bold bg-red-950/20 p-2.5 border border-red-500/20 leading-relaxed font-mono flex items-start gap-1">
              <span className="text-red-400 font-black mr-1">✕</span> {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-black uppercase tracking-widest text-[11px] rounded-none cursor-pointer transition flex items-center justify-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            <span>Autenticar Consola</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-left select-none">
      
      {/* Console Header */}
      <div className="p-6 bg-[#1b1b32] border border-[#3b3b4f] rounded-none flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[#fecc4c]" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Consola Admins & Gestão Netek
            </h3>
          </div>
          <p className="text-[10.5px] text-slate-400 leading-normal max-w-2xl font-sans">
            Gerencie as submissões, publique vagas e dicas de inteligência artificial, adicione e ative permissões de membros técnicos moçambicanos. Supervisor: <strong>Peniel Dinis Mucavel</strong>.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={loadAllData}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-none text-[10px] transition flex items-center gap-1 cursor-pointer font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Atualizar</span>
          </button>
          
          <button 
            onClick={handleAdminLogout}
            className="px-3 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-[10px] transition font-bold uppercase rounded-none cursor-pointer border border-red-500/10"
          >
            Terminar Sessão
          </button>
        </div>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#1b1b32] border border-[#3b3b4f]">
          <span className="block text-[8.5px] uppercase text-slate-400 font-bold tracking-wider">Aguardando Validação</span>
          <span className="block text-xl font-bold text-yellow-500 mt-1">{bookingStats.pendents}</span>
        </div>
        <div className="p-4 bg-[#1b1b32] border border-[#3b3b4f]">
          <span className="block text-[8.5px] uppercase text-slate-400 font-bold tracking-wider">Membros Ativos</span>
          <span className="block text-xl font-bold text-emerald-400 mt-1">{members.filter(m => m.isActive).length} / {members.length}</span>
        </div>
        <div className="p-4 bg-[#1b1b32] border border-[#3b3b4f]">
          <span className="block text-[8.5px] uppercase text-slate-400 font-bold tracking-wider">Pedidos Registados</span>
          <span className="block text-xl font-bold text-white mt-1">{bookingStats.total}</span>
        </div>
        <div className="p-4 bg-[#1b1b32] border border-[#3b3b4f]">
          <span className="block text-[8.5px] uppercase text-slate-400 font-bold tracking-wider">Denúncias Ativas</span>
          <span className="block text-xl font-bold text-red-500 mt-1">{reports.length}</span>
        </div>
      </div>

      {/* Sub tabs selector */}
      <div className="flex border-b border-[#3b3b4f] font-mono">
        {[
          { id: 'dados', label: 'Pedidos & Alertas', icon: Clock },
          { id: 'membros', label: 'Equipa & Membros (' + members.length + ')', icon: Users },
          { id: 'publicar', label: 'Publicar Conteúdo', icon: PlusCircle }
        ].map((sub) => {
          const isSelected = activeSubTab === sub.id;
          const SubIcon = sub.icon;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubTab(sub.id as any);
                setPublishSuccessMessage('');
              }}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isSelected 
                  ? 'border-[#fecc4c] text-[#fecc4c] bg-white/[0.02]' 
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <SubIcon className="h-4 w-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic message popup banner */}
      {publishSuccessMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-tight rounded-none flex items-center gap-2 animate-fadeIn">
          <Check className="h-4.5 w-4.5 text-emerald-400" />
          <span>{publishSuccessMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER ACTIVE SUBTABS MAPPING */}
      <div className="grid grid-cols-1 gap-8 items-start">
        
        {/* TAB A: LOGS, BOOKINGS & NOTIFICATIONS */}
        {activeSubTab === 'dados' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left Column: bookings */}
            <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-4 lg:col-span-8">
              <div className="flex items-center justify-between border-b border-[#3b3b4f] pb-3">
                <h4 className="text-xs font-bold font-mono tracking-widest text-[#fecc4c] uppercase flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5" />
                  <span>Pedidos de Pré-Marcações Assistidas (Peniel Mucavel)</span>
                </h4>
              </div>

              {bookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2 font-mono">
                  <Users className="h-8 w-8 text-slate-600 mx-auto animate-pulse" />
                  <p>Nenhuma solicitação de apoio à pré-inscrição registada localmente.</p>
                  <p className="text-[10px] text-slate-500 font-mono">Simule como candidato na aba "Perfil" para ver estes dados em ação!</p>
                </div>
              ) : (
                <div className="space-y-4 font-mono">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-4 bg-[#0a0a23] border border-[#3b3b4f] rounded-none space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div>
                          <span className="block text-xs font-bold text-white">{b.portalName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Solicitante: <strong className="text-white">{b.candidateName}</strong> | Contacto: <strong className="text-white">{b.candidatePhone}</strong></span>
                        </div>
                        <span className={`px-2.5 py-1 text-[8px] tracking-wider uppercase font-extrabold font-mono rounded-none fit ${
                          b.status.includes('Concl') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                          b.status.includes('Proc') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' :
                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      {b.extraDetails && (
                        <div className="p-2.5 bg-[#05070a] text-[10.5px] text-slate-400 font-mono rounded-none border border-[#3b3b4f]">
                          <strong>Ficheiros / Detalhes:</strong> {b.extraDetails}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px]">
                        <span className="text-slate-550 font-mono">Preço: <strong className="text-white font-mono">{b.price} MT</strong> | Canal: <strong>{b.paymentMethod.toUpperCase()}</strong></span>
                        
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider">
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'Em Processamento (BI Validado)')}
                            className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-[#22d3ee] rounded-none transition border border-cyan-500/10 cursor-pointer"
                          >
                            Iniciar Registo
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'Concluído (Confirmado com Comprovativo)')}
                            className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-none transition border border-emerald-500/10 cursor-pointer"
                          >
                            Marcar Concluído
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1 px-2.5 hover:bg-red-500/10 text-red-400 rounded-none transition"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Reports and ratings */}
            <div className="space-y-6 lg:col-span-4 animate-fadeIn font-mono">
              
              {/* Reports Alert list */}
              <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-3">
                <h4 className="text-xs font-bold tracking-widest text-[#fecc4c] uppercase flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-yellow-500" />
                  <span>Denúncias Comunidade ({reports.length})</span>
                </h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Moderação das operadoras ou burlas denunciadas pelos utilizadores em Moçambique.
                </p>

                {reports.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic py-3 text-center">Nenhuma denúncia ativa no momento.</p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pt-1 pr-1">
                    {reports.map((r) => (
                      <div key={r.id} className="p-3 bg-red-950/10 border border-red-500/15 text-xs text-left space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <strong className="text-white uppercase tracking-wider">{r.portalName}</strong>
                          <span className="text-red-400 font-bold">{r.reason}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed">
                          "{r.details}"
                        </p>
                        <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[8.5px] font-mono text-slate-500">
                          <span>Data: {r.date}</span>
                          <button
                            onClick={() => handleResolveReport(r.id)}
                            className="text-[#fecc4c] hover:underline font-bold"
                          >
                            ✓ Descartar/Resolvido
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Star reviews evaluation feedback evaluation */}
              <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-3">
                <div className="flex justify-between items-center bg-transparent border-none">
                  <h4 className="text-xs font-bold tracking-widest text-slate-300 uppercase flex items-center gap-2">
                    <Star className="h-4.5 w-4.5 text-[#fecc4c]" />
                    <span>Estrelas Portais ({reviews.length})</span>
                  </h4>
                  {reviews.length > 0 && (
                    <button
                      onClick={handleClearAllReviews}
                      className="text-[9px] text-red-500 font-mono hover:underline font-semibold"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                {reviews.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic py-3 text-center">Nenhuma avaliação registada e deixada localmente.</p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {reviews.map((v: any, idx) => (
                      <div key={idx} className="p-3 bg-[#0a0a23] border border-[#3b3b4f] rounded-none space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[9.5px] font-mono">
                          <strong className="text-white">{v.portalName}</strong>
                          <div className="flex items-center text-[#fecc4c] gap-0.5">
                            <Star className="h-3 w-3 fill-current text-[#fecc4c]" />
                            <span className="font-bold">{v.starRating}</span>
                          </div>
                        </div>
                        {v.comment && <p className="text-[10.5px] text-slate-450 italic">"{v.comment}"</p>}
                        <span className="block text-[8px] text-slate-550 text-right font-mono">{v.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB B: TEAM MEMBERS DIRECTORY (ADD, TOGGLE ACTIVATION, DELETE) */}
        {activeSubTab === 'membros' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left Column: Team list */}
            <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-4 lg:col-span-8 font-mono">
              <div className="border-b border-[#3b3b4f] pb-3">
                <h4 className="text-xs font-bold tracking-widest text-[#fecc4c] uppercase">
                  Lista de Membros Ativos e Engenheiros Netek
                </h4>
                <p className="text-[10px] text-slate-450 mt-1">Clique para ativar ou mitigar contas e acessos de credenciais móveis corporativas.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#3b3b4f] text-slate-500 uppercase tracking-widest text-[9px]">
                      <th className="py-2.5">Nome Técnico</th>
                      <th>Perfil / Função</th>
                      <th>Local</th>
                      <th>Contacto</th>
                      <th>Estado</th>
                      <th className="text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-[#0a0a23]/30 transition text-[11px]">
                        <td className="py-3.5 font-bold text-white flex items-center gap-1.5 leading-tight">
                          <span className={`w-2 h-2 rounded-full ${m.isActive ? 'bg-emerald-400' : 'bg-red-500'} inline-block`}></span>
                          {m.name}
                        </td>
                        <td>{m.role}</td>
                        <td className="text-slate-400">{m.location}</td>
                        <td className="text-slate-400 font-mono text-[10.5px]">{m.phone}</td>
                        <td>
                          <button
                            onClick={() => handleToggleMember(m.id)}
                            className={`px-1.5 py-0.5 text-[8.5px] uppercase font-mono font-bold tracking-wider rounded-sm ${
                              m.isActive 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/10'
                            }`}
                            title="Alternar estado de ativação"
                          >
                            {m.isActive ? '✓ ACTIVO' : '✕ INACTIVO'}
                          </button>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="p-1 hover:bg-red-500/10 text-red-400 transition rounded-none text-[10.5px]"
                            title="Remover membro técnico da equipa"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Add member form */}
            <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-4 lg:col-span-4 font-mono">
              <div className="border-b border-[#3b3b4f] pb-2">
                <h4 className="text-xs font-bold tracking-widest text-[#fecc4c] uppercase flex items-center gap-1.5">
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Adicionar Novo Membro</span>
                </h4>
              </div>

              <form onSubmit={handleAddMember} className="space-y-3.5 text-xs text-left">
                <div>
                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alberto Mucavel"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-2.5 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Função / Cargo Técnico *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Suporte M-Pesa / Apoio Cartas"
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-2.5 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Localização</label>
                    <select
                      value={newMemberForm.location}
                      onChange={(e) => setNewMemberForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-2.5 text-slate-300 rounded-none focus:outline-none focus:border-[#fecc4c]"
                    >
                      <option value="Maputo">Maputo</option>
                      <option value="Beira">Beira</option>
                      <option value="Nampula">Nampula</option>
                      <option value="Tete">Tete</option>
                      <option value="Inhambane">Inhambane</option>
                      <option value="Gaza">Gaza</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Telemóvel *</label>
                    <input
                      type="text"
                      required
                      placeholder="+258 84..."
                      value={newMemberForm.phone}
                      onChange={(e) => setNewMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-2.5 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-none cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <Users className="h-4 w-4" />
                  <span>Registar Membro</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB C: CONTENT CREATOR (JOBS, DISCOS) */}
        {activeSubTab === 'publicar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn font-mono">
            
            {/* Left Column: Form to publish */}
            <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-4 lg:col-span-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3b3b4f] pb-3">
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-[#fecc4c] uppercase">
                    Publicar Nova Actividade Empresarial
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Disponibilize vagas ou dicas de suporte na plataforma em tempo real.</p>
                </div>
                
                {/* Switcher */}
                <div className="flex border border-[#3b3b4f]">
                  <button
                    onClick={() => setPublishType('job')}
                    className={`px-3 py-1.5 text-[9px] uppercase font-bold tracking-widest border-r border-[#3b3b4f] ${
                      publishType === 'job' ? 'bg-[#3b3b4f] text-[#fecc4c]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Oportunidade Vaga
                  </button>
                  <button
                    onClick={() => setPublishType('blog')}
                    className={`px-3 py-1.5 text-[9px] uppercase font-bold tracking-widest ${
                      publishType === 'blog' ? 'bg-[#3b3b4f] text-[#fecc4c]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dica IA Artigo
                  </button>
                </div>
              </div>

              {/* Form A: Job Vacancy */}
              {publishType === 'job' ? (
                <form onSubmit={handlePublishJob} className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Título da Ocupação / Vaga *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Gestor de Conta de M-Pesa"
                        value={jobForm.title}
                        onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Entidade Empregadora / Empresa *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Netek Partner Beira"
                        value={jobForm.company}
                        onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Província / Cidade</label>
                      <select
                        value={jobForm.location}
                        onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-slate-300 rounded-none focus:outline-none focus:border-[#fecc4c]"
                      >
                        <option value="Maputo">Maputo</option>
                        <option value="Beira">Beira</option>
                        <option value="Nampula">Nampula</option>
                        <option value="Quelimane">Quelimane</option>
                        <option value="Tete">Tete</option>
                        <option value="Pemba">Pemba</option>
                        <option value="Remoto">Remoto / Online</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Remuneração / Salário</label>
                      <input
                        type="text"
                        placeholder="Ex: 12.500 MT - 15.000 MT"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm(prev => ({ ...prev, salaryRange: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Telemóvel / Email de Envio *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: vagas@netek.co.mz"
                        value={jobForm.contact}
                        onChange={(e) => setJobForm(prev => ({ ...prev, contact: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Competências Requeridas (Separar com vírgula)</label>
                    <input
                      type="text"
                      placeholder="Ex: Word, Excel, Atendimento, M-Pesa"
                      value={jobForm.skills}
                      onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Descrição Detalhada e Requisitos *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Identifique aqui as atribuições diárias de trabalho..."
                      value={jobForm.description}
                      onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c] font-sans h-28"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-black uppercase text-[10.5px] tracking-widest rounded-none cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Briefcase className="h-4.5 w-4.5" />
                    <span>Publicar Oportunidade Vaga</span>
                  </button>
                </form>
              ) : (
                /* Form B: Blog Article */
                <form onSubmit={handlePublishBlog} className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Título do Artigo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Segredos para acelerar planilhas com ChatGPT"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Categoria</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-slate-300 rounded-none focus:outline-none focus:border-[#fecc4c]"
                      >
                        <option value="IA e Produtividade">IA e Produtividade</option>
                        <option value="Conectividade">Conectividade</option>
                        <option value="Negócios e M-Pesa">Negócios e M-Pesa</option>
                        <option value="Economia de Dados">Economia de Dados</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Nome Autor</label>
                      <input
                        type="text"
                        placeholder="Ex: Eng. Amadeu Banze"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1 font-mono">Resumo Curto *</label>
                      <input
                        type="text"
                        required
                        placeholder="Uma frase curta que resume o post..."
                        value={blogForm.summary}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                        className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1 font-mono">Conteúdo do Artigo (Suporta Linhas, Tópicos) *</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Use ### para destacar títulos de passos da dica prática..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3 text-white rounded-none focus:outline-none focus:border-[#fecc4c] font-sans h-44 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-black uppercase text-[10.5px] tracking-widest rounded-none cursor-pointer transition flex items-center gap-1.5"
                  >
                    <FileText className="h-4.5 w-4.5" />
                    <span>Publicar Artigo Educativo</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right column: Info notes */}
            <div className="lg:col-span-4 bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-4">
              <span className="block text-[9px] uppercase font-bold text-[#fecc4c] font-mono border-b border-[#3b3b4f] pb-1.5">Regras de Validação Netek</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                ⚠️ **Observação Técnica:** Todo o conteúdo publicado aqui ficará gravado e integrado na pilha do vosso navegador local. Isso permite-lhe simular de imediato e em tempo real a visualização de novas oportunidades de emprego, anúncios ou tutoriais de inteligência artificial de forma segura e offline.
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
