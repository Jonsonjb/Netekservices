import React, { useState } from 'react';
import { JobVacancy } from '../types';
import { Search, MapPin, Briefcase, UserCheck, PlusCircle, ArrowUpRight, CheckCircle2, ChevronRight, Send, AlertTriangle, PhoneCall, Globe, DollarSign } from 'lucide-react';

const INITIAL_JOBS: JobVacancy[] = [
  {
    id: 'j1',
    title: 'Técnico de Redes e Infraestrutura Júnior',
    company: 'Logística de Moçambique LDA',
    location: 'Maputo',
    description: 'Procuramos jovem técnico para auxiliar na manutenção de cablagem estruturada, configuração de antenas TP-Link e routers Huawei. Essencial ter noções básicas de subnetting IP.',
    type: 'Full-time',
    salaryRange: '15.000 MT - 18.000 MT',
    contactEmailOrPhone: '+258 84 123 4567',
    skillsRequired: ['TP-Link Config', 'Cablagem', 'Redes LAN', 'Mikrotik Basico'],
    datePosted: '23/05/2026'
  },
  {
    id: 'j2',
    title: 'Operadora de WhatsApp Vendas & Atendimento',
    company: 'Moda Chic Maputo',
    location: 'Maputo',
    description: 'Empresa de retalho de moda em Maputo busca profissional para gerir encomendas via WhatsApp Business, catalogar clientes no Excel e responder a mensagens com simpatia.',
    type: 'Remoto',
    salaryRange: '10.000 MT',
    contactEmailOrPhone: 'vendas@modachic.co.mz',
    skillsRequired: ['WhatsApp Business', 'Excel', 'Atendimento ao Cliente'],
    datePosted: '22/05/2026'
  },
  {
    id: 'j3',
    title: 'Desenvolvedor Frontend Freelancer (React/HTML)',
    company: 'Agência Criativa Nampula',
    location: 'Nampula',
    description: 'Necessitamos de programador especialista em criar Landing Pages velozes em React e Tailwind CSS para PMEs locais. Trabalho estruturado por projeto.',
    type: 'Freelance',
    salaryRange: '25.000 MT por Projecto',
    contactEmailOrPhone: '+258 82 987 6543',
    skillsRequired: ['React JS', 'Tailwind CSS', 'Mobile Optimization'],
    datePosted: '20/05/2026'
  },
  {
    id: 'j4',
    title: 'Estagiário de Marketing Digital & Copywriting',
    company: 'Netek Partner Agency',
    location: 'Beira',
    description: 'Vaga de estágio para recém-formados ou entusiastas digitais interessados em gerar conteúdo, criar prompts de escrita profissionais e monitorar redes sociais.',
    type: 'Estágio',
    salaryRange: '8.000 MT Auxílio',
    contactEmailOrPhone: 'estagios@netek.co.mz',
    skillsRequired: ['Copywriting', 'Canva', 'Engenharia de Prompts'],
    datePosted: '19/05/2026'
  }
];

const INITIAL_PROFESSIONALS: JobVacancy[] = [
  {
    id: 'p1',
    title: 'Técnico Instalador de Redes e Wireless',
    company: 'Amadeu Massinga (Independente)',
    location: 'Gaza / Bilene',
    description: 'Disponível para instalar repetidores de sinal, configurar internet móvel lenta, fazer pontes rádio de longa distância e estruturar Wi-Fi de pequenas pensões turísticas.',
    type: 'Freelance',
    salaryRange: 'Sob Consulta',
    contactEmailOrPhone: '+258 84 555 1122',
    skillsRequired: ['Instalação Wireless', 'Configuração Router', 'Suporte Windows'],
    datePosted: '22/05/2026',
    isProfessionalProfile: true
  },
  {
    id: 'p2',
    title: 'Criadora de Conteúdo e Social Media',
    company: 'Elsa Macuácua (Candidata)',
    location: 'Sofala / Beira',
    description: 'Procuro emprego em regime de meio-período ou remoto para gerir canais institucionais de Facebook e Instagram. Experiência avançada em gerar legendas atrativas com ajuda de IA.',
    type: 'Part-time',
    salaryRange: '12.000 MT Minimo',
    contactEmailOrPhone: '+258 87 222 3344',
    skillsRequired: ['Gestão Redes Sociais', 'Canva Layouts', 'Prompting Textos'],
    datePosted: '21/05/2026',
    isProfessionalProfile: true
  }
];

export default function OportunidadesView() {
  const [activeSubTab, setActiveSubTab] = useState<'vagas' | 'profissionais'>('vagas');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  
  // State for dynamic job list
  const [vacancies, setVacancies] = useState<JobVacancy[]>(INITIAL_JOBS);
  const [professionals, setProfessionals] = useState<JobVacancy[]>(INITIAL_PROFESSIONALS);

  // Load dynamically published jobs from localStorage on mount
  React.useEffect(() => {
    try {
      const savedVacanciesStr = localStorage.getItem('netek_dynamic_vacancies');
      if (savedVacanciesStr) {
        const parsed = JSON.parse(savedVacanciesStr);
        setVacancies([...parsed, ...INITIAL_JOBS]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Publish Form State
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishingProfessional, setIsPublishingProfessional] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Maputo',
    type: 'Full-time' as any,
    salaryRange: '',
    contact: '',
    description: '',
    skills: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contact || !formData.description) return;

    const newEntry: JobVacancy = {
      id: 'dynamic-' + Math.random().toString(36).substr(2, 9),
      title: formData.title,
      company: isPublishingProfessional ? `${formData.company || 'Independente'} (Disponível)` : formData.company || 'Empresa Confidencial',
      location: formData.location,
      description: formData.description,
      type: formData.type,
      salaryRange: formData.salaryRange || 'A combinar',
      contactEmailOrPhone: formData.contact,
      skillsRequired: formData.skills ? formData.skills.split(',').map(s => s.trim()) : ['Geral'],
      datePosted: 'Hoje',
      isProfessionalProfile: isPublishingProfessional
    };

    if (isPublishingProfessional) {
      setProfessionals([newEntry, ...professionals]);
    } else {
      setVacancies([newEntry, ...vacancies]);
    }

    setPublishSuccess(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: 'Maputo',
      type: 'Full-time',
      salaryRange: '',
      contact: '',
      description: '',
      skills: ''
    });
    setPublishSuccess(false);
    setShowPublishForm(false);
  };

  const currentList = activeSubTab === 'vagas' ? vacancies : professionals;

  const filteredList = currentList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = filterLocation === 'All' || item.location === filterLocation;
    return matchesSearch && matchesLocation;
  });

  // Direct WhatsApp broadcat for jobs
  const getWhatsAppPublishText = () => {
    const operatorPhone = '258835109190';
    const contextType = isPublishingProfessional ? '*Perfil Profissional para Contratação*' : '*Publicação de Vaga de Emprego*';
    const message = `Olá Netek, gostaria de submeter oficialmentes estes dados para publicidade no vosso ecossistema de Moçambique:\n\n` +
      `*Tipo:* ${contextType}\n` +
      `*Título:* ${formData.title}\n` +
      `*Quem publica:* ${formData.company || 'N/A'}\n` +
      `*Cidade/Província:* ${formData.location}\n` +
      `*Regime:* ${formData.type}\n` +
      `*Valor/Remuneração:* ${formData.salaryRange || 'A Combinar'}\n` +
      `*Contacto Directo:* ${formData.contact}\n` +
      `*Competências:* ${formData.skills}\n` +
      `*Breve Sumário:* ${formData.description}\n\n` +
      `Solicito a ativação no simulador e redes de vagas de Moçambique! Kanimambo.`;
    return `https://api.whatsapp.com/send?phone=${operatorPhone}&text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-12 select-none">
      
      {/* View Header */}
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest block mb-2">Ecossistema de Empregabilidade</span>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">
            Vagas de Emprego & Contratação de Profissionais
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
            Ligamos talentos locais a oportunidades de trabalho reais em Moçambique. Procure vagas de emprego gratuitas, explore profissionais de tecnologia disponíveis para contratação freelance ou anuncie de forma simples!
          </p>
        </div>

        <button
          onClick={() => {
            setPublishSuccess(false);
            setShowPublishForm(true);
          }}
          className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-slate-950 text-xs font-black uppercase tracking-wider rounded shadow-lg shadow-cyan-500/10 hover:scale-[1.03] transition shrink-0 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" />
          <span>Publicar Anúncio Grátis</span>
        </button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Vagas de Tecnologias</span>
            <span className="block text-2xl font-black text-white">{vacancies.length} Ativas</span>
          </div>
          <div className="p-2.5 bg-cyan-500/5 rounded bg-white/5 text-[#22d3ee]">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Profissionais Cadastrados</span>
            <span className="block text-2xl font-black text-white">{professionals.length} Perfis</span>
          </div>
          <div className="p-2.5 bg-purple-500/5 rounded bg-white/5 text-[#c084fc]">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Províncias Representadas</span>
            <span className="block text-2xl font-black text-emerald-400">Maputo, Beira, Nampula</span>
          </div>
          <div className="p-2.5 bg-emerald-500/5 rounded bg-white/5 text-emerald-400">
            <MapPin className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Internal Sub-Tabs selection (Vagas vs Professionals) */}
      <div className="flex bg-[#05070a] p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-hidden self-start">
        <button
          onClick={() => {
            setActiveSubTab('vagas');
            setSearchQuery('');
          }}
          className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'vagas' ? 'bg-[#22d3ee] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="h-4.5 w-4.5" />
          <span>Vagas de Emprego</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('profissionais');
            setSearchQuery('');
          }}
          className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'profissionais' ? 'bg-[#c084fc] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="h-4.5 w-4.5" />
          <span>Contratar Profissionais</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder={activeSubTab === 'vagas' ? "Procurar vaga por cargo, empresa ou tec..." : "Procurar profissional por aptidão ou cidade..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05070a] border border-white/10 focus:border-[#22d3ee] text-xs rounded-xl pl-9 pr-4 py-3 placeholder-slate-500 focus:outline-none transition text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 shrink-0">Localidade:</span>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full sm:w-44 bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
          >
            <option value="All">Moçambique Inteiro</option>
            <option value="Maputo">Maputo</option>
            <option value="Beira">Beira (Sofala)</option>
            <option value="Nampula">Nampula</option>
            <option value="Gaza / Bilene">Gaza / Bilene</option>
          </select>
        </div>
      </div>

      {/* Results Listings Grid */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
          <Briefcase className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">Nenhum anúncio encontrado</h4>
          <p className="text-xs text-slate-500 mt-1">Experimente limpar a barra de pesquisa ou altere os filtros de cidade.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterLocation('All');
            }}
            className="mt-4 px-4 py-2 bg-[#05070a] hover:bg-white/5 text-xs text-[#22d3ee] font-bold uppercase tracking-wider rounded-full border border-white/10 cursor-pointer transition"
          >
            Mostrar Todos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-white/20 transition duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-grow max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-black ${
                    item.type === 'Full-time' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    item.type === 'Remoto' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.type === 'Freelance' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Publicado em: {item.datePosted}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white hover:text-[#22d3ee] transition duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#22d3ee] mt-0.5">{item.company}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Skills indicators */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.skillsRequired.map(skill => (
                    <span key={skill} className="text-[9px] font-mono bg-white/5 text-slate-300 border border-white/5 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Geographic and financial / contact block inside card */}
              <div className="w-full md:w-56 flex flex-col justify-between items-start md:items-end gap-3 shrink-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <div className="text-left md:text-right space-y-1">
                  <div className="flex items-center md:justify-end gap-1 text-[11px] text-slate-400 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#22d3ee]" />
                    <span>Província: <strong>{item.location}</strong></span>
                  </div>
                  {item.salaryRange && (
                    <div className="text-xs text-slate-300 font-mono">
                      Remuneração: <strong className="text-white font-bold">{item.salaryRange}</strong>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full md:w-auto">
                  <a
                    href={item.contactEmailOrPhone.includes('@') ? `mailto:${item.contactEmailOrPhone}` : `https://api.whatsapp.com/send?phone=${item.contactEmailOrPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded border border-white/10 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Contactar</span>
                    <PhoneCall className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Publish Modal Drawer Framework */}
      {showPublishForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1118]/95 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#05070a]/80">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[#22d3ee]" />
                <span className="font-bold text-sm text-white">Publicar Anúncio no Ecossistema</span>
              </div>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {!publishSuccess ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  {/* Selector: Job Vacancy vs Freelancer Profile */}
                  <div className="bg-[#05070a] p-1 rounded-xl border border-white/10 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsPublishingProfessional(false)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${
                        !isPublishingProfessional ? 'bg-[#22d3ee] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pretendo Publicar Emprego/Vaga
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublishingProfessional(true)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${
                        isPublishingProfessional ? 'bg-[#c084fc] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pretendo Oferecer Serviços (Pro)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {isPublishingProfessional ? 'Título da sua Profissão *' : 'Título do Cargo / Vaga *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isPublishingProfessional ? "Ex: Eletricista Instalador, Web Designer" : "Ex: Técnico de Redes LAN"}
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {isPublishingProfessional ? 'Nome Profissional (Ou Empresa) *' : 'Nome da Empresa / Recrutador *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: João Tembe Consultoria ou Empresa LDA"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Cidade / Província</label>
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#22d3ee]"
                      >
                        <option value="Maputo">Maputo</option>
                        <option value="Beira">Beira</option>
                        <option value="Nampula">Nampula</option>
                        <option value="Gaza / Bilene">Gaza / Bilene</option>
                        <option value="Inhambane">Inhambane</option>
                        <option value="Tete">Tete</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Modalidade</label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#22d3ee]"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Estágio">Estágio</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Remoto">Remoto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Sálario / Remuneração</label>
                      <input
                        type="text"
                        placeholder="Ex: 15.000 MT ou A Combinar"
                        value={formData.salaryRange}
                        onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contacto Directo (Email ou Telefone) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: +258 84 000 0000 ou recrutamento@empresa.co.mz"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Competências Recomendadas (Separadas por Vírgula)</label>
                    <input
                      type="text"
                      placeholder="Ex: Word, Excel, Redes LAN, Atendimento"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Descrição Detalhada do seu Perfil / Requisitos *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={isPublishingProfessional ? "Diga o que sabe fazer, quais as suas competências principais, ferramentas e disponibilidade..." : "Requisitos mínimos da vaga de emprego, rotinas e objetivos para o candidato..."}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee] resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 justify-end border-t border-white/5 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#22d3ee] text-slate-950 font-black rounded text-xs uppercase tracking-wider hover:bg-cyan-400 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Publicar Transação</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-5">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">Publicado com Sucesso!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                      Kanimambo! A sua atividade foi publicada no ecrã interativo com sucesso. Quer alcançar mais pessoas em Moçambique enviando uma cópia estruturada para o WhatsApp da equipa Netek?
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-2.5 max-w-sm mx-auto">
                    <a
                      href={getWhatsAppPublishText()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Transmitir Para Redes WhatsApp</span>
                    </a>
                    <button
                      onClick={resetForm}
                      className="text-xs text-slate-500 hover:text-white transition font-bold uppercase tracking-wider p-2 cursor-pointer"
                    >
                      Fechar Visualizar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mozambique Job Guidelines Block */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Conselhos Importantes de Empregabilidade em Moçambique
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
          <div className="p-3 bg-[#05070a] rounded-xl border border-white/5 space-y-1">
            <h4 className="font-bold text-white">1. Jamais pague para obter entrevistas</h4>
            <p className="text-slate-405">
              Empresas legítimas nunca solicitam pagamentos móveis (via M-Pesa ou e-Mola) para avaliar currículos ou convocar candidatos para entrevistas de emprego.
            </p>
          </div>
          <div className="p-3 bg-[#05070a] rounded-xl border border-white/5 space-y-1">
            <h4 className="font-bold text-white">2. Prepare o seu portfólio prático de trabalho</h4>
            <p className="text-slate-405">
              Técnicos, programadores e marketers ganham posições com projetos reais construídos. Liste no seu currículo os sites que criou ou prompts que domina de forma prática.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
