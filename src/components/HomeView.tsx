import React from 'react';
import { 
  ArrowRight, Code, GraduationCap, Smartphone, ShieldCheck, Zap, Laptop, 
  FileText, Compass, Briefcase, Globe, Flame, Search, QrCode, User, 
  Calendar, Award, Check, Phone, Mail, MapPin, Sparkles, Clock, Star, 
  Users, ChevronRight, MessageSquare, ExternalLink, ThumbsUp, Layers
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  // Layout mode state: 'wix' (Wix Corporate wh-1071) or 'fcc' (freeCodeCamp Terminal Console)
  const [layoutMode, setLayoutMode] = React.useState<'wix' | 'fcc'>('wix');

  // QR Code generator state
  const [qrPhone, setQrPhone] = React.useState('8401666592');
  const [qrAmount, setQrAmount] = React.useState('250');
  const [qrRef, setQrRef] = React.useState('NETEK-QT-9');
  const [generatedUrl, setGeneratedUrl] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Wix WH-1071 Booking Consultation State
  const [bookingService, setBookingService] = React.useState('Consultoria Estratégica & Diagnóstico de Negócio');
  const [bookingDate, setBookingDate] = React.useState('2026-05-26');
  const [bookingTime, setBookingTime] = React.useState('10:00');
  const [bookingName, setBookingName] = React.useState('');
  const [bookingContact, setBookingContact] = React.useState('');
  const [bookingNote, setBookingNote] = React.useState('');
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  // Active testimonial index for corporate slider
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);

  const handleGenerateCode = () => {
    setIsGenerating(true);
    const payload = `MPESA:CHG:${qrPhone.replace(/\s+/g, '')};AMT:${qrAmount};REF:${qrRef};`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=0-0-0&bgcolor=255-255-255&data=${encodeURIComponent(payload)}`;
    
    setTimeout(() => {
      setGeneratedUrl(url);
      setIsGenerating(false);
    }, 800);
  };

  const currentMozTime = () => {
    try {
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const maputoTime = new Date(utc + (3600000 * 2)); // UTC + 2
      return maputoTime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) + ' (Maputo GMT+2)';
    } catch {
      return 'Disponível Online';
    }
  };

  // Wix WH-1071 Consultation Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingContact) {
      alert('Por favor preencha o seu nome e contacto de WhatsApp.');
      return;
    }
    setBookingSuccess(true);
  };

  // WhatsApp payload generator for corporate consultation
  const getWhatsAppBookingUrl = () => {
    const text = `Olá Peniel/Netek, gostaria de reservar uma sessão de Consultoria:\n\n` +
      `🌐 *Serviço:* ${bookingService}\n` +
      `📅 *Data:* ${bookingDate}\n` +
      `⏰ *Hora:* ${bookingTime}\n` +
      `👤 *Cliente:* ${bookingName}\n` +
      `📱 *Contacto:* ${bookingContact}\n` +
      `📝 *Notas:* ${bookingNote || 'N/A'}\n\n` +
      `*Pedido via Layout Wix WH-1071 Corporativo*`;
    return `https://wa.me/258840166659?text=${encodeURIComponent(text)}`;
  };

  // freeCodeCamp Style List of Sections as "Certifications"
  const fccCertifications = [
    {
      id: 'cursos',
      title: 'Curso Prático de Inteligência Artificial Generativa & Prompts',
      duration: 'Gratuito - 15 horas de autoaprendizado',
      icon: GraduationCap,
      color: 'text-[#fecc4c]'
    },
    {
      id: 'cvcartas',
      title: 'Criador de Currículos e Cartas Gratuitas de Candidatura',
      duration: 'Formatador Automático nas normas de Moçambique',
      icon: FileText,
      color: 'text-emerald-400'
    },
    {
      id: 'portais',
      title: 'Diretório Académico de Portais Secretos e VPNs Ativas',
      duration: 'Otimização com foco em poupança de dados móveis',
      icon: Compass,
      color: 'text-[#fecc4c]'
    },
    {
      id: 'servicos',
      title: 'Integração de Pagamento Mobile M-Pesa & e-Mola',
      duration: 'Checkout simplificado e faturamento fiduciário local',
      icon: Laptop,
      color: 'text-cyan-400'
    },
    {
      id: 'oportunidades',
      title: 'Oportunidades, Vagas Técnicas e Recrutamento Ativo',
      duration: 'Conexões diretas de trabalho para profissionais moçambicanos',
      icon: Briefcase,
      color: 'text-purple-400'
    },
    {
      id: 'kayamoz',
      title: 'KayaMoz Integração & Protocolos Especiais',
      duration: 'Facilitador de serviços e documentações simplificadas',
      icon: Globe,
      color: 'text-[#fecc4c]'
    },
    {
      id: 'blog',
      title: 'Blog de Dicas Inteligentes de Redução de Custos com Dados',
      duration: 'Aprenda a fazer prompts inteligentes sem queimar o seu saldo',
      icon: Flame,
      color: 'text-orange-400'
    },
    {
      id: 'seguranca',
      title: 'Central de Cibersegurança & Radar de Fraudes (OTP)',
      duration: 'Escudo anti-fraude, simulação 2FA e radar nacional de segurança digital',
      icon: ShieldCheck,
      color: 'text-[#fecc4c]'
    }
  ];

  // Testimonials data representing local corporate feedback mimicking Wix WH-1071
  const testimonials = [
    {
      quote: "A assessoria estratégica da Netek e o desenho do fluxo fiduciário com código QR M-Pesa transformou o faturamento da nossa agência em Maputo. Suporte premium incomparável.",
      author: "Dra. Amina Sengo",
      role: "Diretora de Operações",
      company: "Sengo Logística & Transportes"
    },
    {
      quote: "Graças ao suporte integrado de criação de perfis legais e formatador de propostas, fechamos contratações em conformidade com o Artigo 55 da LTM sem incorrer em falhas de conformidade.",
      author: "Manuel Tembe",
      role: "Coordenador de Recursos Humanos",
      company: "Moz-Inovação Tecnologias"
    },
    {
      quote: "O curso de IA generativa com foco em economia de dados permitiu à nossa equipa comercial responder com prompts cirúrgicos no terreno sem consumir pacotes pesados.",
      author: "Eng. Tomás Langa",
      role: "Fundador",
      company: "Langa & Associados Lda"
    }
  ];

  // Corporate partners listing
  const corporatePartners = [
    "Vodacom Moçambique", "M-Pesa", "e-Mola", "Netek Lab", "Mcel/Tmcel", "Standard Bank", "BCI S.A."
  ];

  return (
    <div className="space-y-12 select-text font-sans text-left">
      
      {/* PERSISTENT LAYOUT CONTROLLER - Allows switching between Wix WH-1071 and freeCodeCamp styles */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
            <Layers className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Seletor de Layout de Interface</h4>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Alterne entre o layout corporativo do site <strong className="text-amber-500">Wix WH-1071 (Consultoria)</strong> ou a consola de estudante <strong className="text-amber-400">freeCodeCamp Style</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center bg-slate-950 p-1.5 border border-white/10 rounded-xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setLayoutMode('wix')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              layoutMode === 'wix' 
                ? 'bg-amber-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Wix WH-1071 Corporativo</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('fcc')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              layoutMode === 'fcc' 
                ? 'bg-[#1b1b32] text-[#fecc4c] border border-[#3b3b4f]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Consola freeCodeCamp</span>
          </button>
        </div>
      </div>

      {layoutMode === 'wix' ? (
        // ==========================================
        // 🌟 WIX WH-1071 CORPORATE CONSULTANT LAYOUT
        // ==========================================
        <div className="space-y-14 animate-fadeIn">
          
          {/* 1. HERO SECTION (Wix Wh-1071 Elegant Strategy Hero) */}
          <section className="relative overflow-hidden bg-slate-950 border border-white/5 rounded-3xl p-8 md:p-14 lg:p-16 space-y-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl space-y-6 text-left relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full">
                <Award className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase font-black tracking-widest font-mono">Design de Prestígio • Wix Template WH-1071</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight">
                Conselhos Estratégicos, <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Tecnologia & Integração de IA
                </span> <br />
                para Líderes de Negócios.
              </h1>
              
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-sans">
                Apoiamos PMEs moçambicanas na transição digital com ferramentas leves, conformidade fiduciária e automações para impulsionar fluxos de receita instantaneamente. Liderado pelo arquiteto de sistemas <strong className="text-white">Peniel Dinis Mucavel</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="#agendamento"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm tracking-wide uppercase rounded-xl shadow-lg shadow-amber-500/15 text-center transition cursor-pointer"
                >
                  Agendar Diagnóstico Gratuito
                </a>
                <button
                  type="button"
                  onClick={() => setActiveTab('servicos')}
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm tracking-wide uppercase rounded-xl transition cursor-pointer"
                >
                  Ver Nossos Serviços
                </button>
              </div>
            </div>

            {/* Microstats embedded inside the hero */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-white">01</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Sede em Maputo, MZ</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-amber-500">120+</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Microempresas Assessoradas</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-emerald-400">99.8%</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Uptime Sistemas Ativos</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-cyan-400">Consola</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Otimização móvel leve</span>
              </div>
            </div>
          </section>

          {/* 2. OUR CONSULTING SERVICES (Wix Grid Structure) */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">ÁREAS DE ATUAÇÃO</span>
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
                Soluções Direcionadas ao Sucesso Organizacional
              </h2>
              <p className="text-xs text-slate-400">
                Ajudamos empreendedores e empresas de Moçambique a contornar limites de infraestrutura e redefinir a produtividade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Service Box 1 */}
              <div className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-amber-500/30 p-6 rounded-2xl transition duration-200 text-left space-y-4 group">
                <div className="p-3 bg-amber-500/10 text-amber-500 w-fit rounded-xl">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-500 transition">
                  Consultoria Estratégica
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Avaliação detalhada de gargalos de processos nas PMEs moçambicanas ordinárias, controle analítico de custos operacionais e plano de crescimento.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('servicos')}
                  className="text-xs font-bold text-amber-500 flex items-center gap-1 group-hover:underline cursor-pointer"
                >
                  <span>Saber mais</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Service Box 2 */}
              <div className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-amber-500/30 p-6 rounded-2xl transition duration-200 text-left space-y-4 group">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 w-fit rounded-xl">
                  <Laptop className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition">
                  Integração M-Pesa API
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Desenho de fluxos fiduciários móveis diretos (M-Pesa e e-Mola) com integração ao Checkout do seu e-commerce para automação financeira instantânea.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('servicos')}
                  className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:underline cursor-pointer"
                >
                  <span>Saber mais</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Service Box 3 */}
              <div className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-amber-500/30 p-6 rounded-2xl transition duration-200 text-left space-y-4 group">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 w-fit rounded-xl">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition">
                  RH & Conformidade LTM
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Conselhos em contratações de força laboral, atração de talentos de engenharia e modelagem mecânica de contratos de acordo com a Lei 23/2007.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('cvcartas')}
                  className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:underline cursor-pointer"
                >
                  <span>Saber mais</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Service Box 4 */}
              <div className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-amber-500/30 p-6 rounded-2xl transition duration-200 text-left space-y-4 group">
                <div className="p-3 bg-purple-500/10 text-purple-400 w-fit rounded-xl">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition">
                  Formação IA e Prompts
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Capacitação prática corporativa no uso de IA generativa para redução drástica de gastos analíticos, sem desperdiçar saldo móvel em repetições.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('cursos')}
                  className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:underline cursor-pointer"
                >
                  <span>Saber mais</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

            </div>
          </section>

          {/* 3. BIOGRAPHY FOCUS (O Seu Consultor Líder) */}
          <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Profile Card mimicking Wix WH-1071 Frame image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative p-6 bg-[#05070a] border border-white/10 rounded-2xl shadow-xl w-full max-w-sm group">
                  <div className="absolute top-0 right-0 m-4 p-2 bg-amber-500 rounded-lg text-slate-950">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 rounded-xl flex flex-col items-center justify-center p-6 border border-white/5 relative overflow-hidden">
                    <User className="h-28 w-28 text-amber-500/60 mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur border border-white/10 p-3 rounded-xl text-center">
                      <h4 className="font-bold text-white text-sm">Peniel Dinis Mucavel</h4>
                      <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono">Arquiteto de Soluções</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-center">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "Utilizando a excelência cognitiva e arquiteturas resilientes para facilitar o crescimento de PMEs."
                    </p>
                    <div className="flex justify-center gap-3 pt-1">
                      <a href="mailto:netekservice@gmail.com" className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition">
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                      <a href="tel:+258840166659" className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition">
                        <Phone className="h-3.5 w-3.5 animate-bounce" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio description info */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">PERFIL EXECUTIVO</span>
                <h2 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
                  Construindo Pontes entre Tecnologia & Eficiência Global
                </h2>
                <p className="text-xs leading-relaxed text-slate-300 font-sans">
                  Com forte histórico no ecossistema tecnológico moçambicano desde 2026, Peniel Mucavel fundou a <strong>Netek Services</strong> com a premissa de que a tecnologia de ponta não deve exigir servidores sob custos pesados que drenam a tesouraria corporativa.
                </p>
                <div className="space-y-3 font-sans text-xs text-slate-400">
                  <div className="flex items-start gap-3">
                    <span className="p-1 bg-amber-500/10 text-amber-500 rounded-md shrink-0">✓</span>
                    <p>Especialista em conformidade e regras do mercado fiduciário moçambicano.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1 bg-amber-500/10 text-amber-500 rounded-md shrink-0">✓</span>
                    <p>Desenvolvimento focado em economia severa de dados com suporte offline e de rede defasada.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1 bg-amber-500/10 text-amber-500 rounded-md shrink-0">✓</span>
                    <p>Formador académico certificado em Engenharia de Prompts e Modelagem de Linguagem IA.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 4. M-PESA QR QR-CODE INTEGRATION LAB (Repurposed and styled elegantly inside the Wix layout) */}
          <section className="bg-slate-950 border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase rounded">
                  Experiência Tecnológica Ativa • Netek Lab
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Simulador de Código QR Fiduciário M-Pesa</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-sans">
                Uma demonstração real de como construímos automações financeiras locais. Introduza os dados de recepção abaixo para compilar a string móvel.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Form Input Block */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">Telefone Recebedor (Carteira)</label>
                    <input
                      type="text"
                      value={qrPhone}
                      onChange={(e) => setQrPhone(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">Montante (em MT)</label>
                    <input
                      type="number"
                      value={qrAmount}
                      onChange={(e) => setQrAmount(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">Referência Única</label>
                    <input
                      type="text"
                      value={qrRef}
                      onChange={(e) => setQrRef(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-between">
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Compilar Código QR</span>
                  </button>
                  <p className="text-[10px] text-slate-400 italic">
                    Utiliza cadeias de strings fiduciárias para acionar o leitor do cliente.
                  </p>
                </div>
              </div>

              {/* QR Output Block */}
              <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-white/5 h-px lg:h-32" />

              <div className="lg:col-span-4 bg-[#05070a] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[180px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 text-xs italic space-y-2">
                    <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full" />
                    <span>Construindo Matriz QR...</span>
                  </div>
                ) : generatedUrl ? (
                  <div className="flex flex-col items-center space-y-3 animate-fadeIn">
                    <div className="p-3 bg-white rounded-xl border border-amber-500/20">
                      <img
                        src={generatedUrl}
                        alt="M-Pesa QR Code"
                        referrerPolicy="no-referrer"
                        className="h-28 w-28 object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Checkout Gerado ✓</span>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-xs p-4 space-y-1">
                    <QrCode className="h-6 w-6 text-slate-600 mx-auto animate-pulse" />
                    <p>Configure os campos e clique para carregar o código QR</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 5. INTERACTIVE SCHEDULER (Wix wh-1071 Online Appointments integration) */}
          <section id="agendamento" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 relative">
            <div className="absolute top-0 left-1/3 -mt-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
            
            <div className="max-w-xl text-left space-y-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">MARCAÇÃO DE CONSULTA ONLINE</span>
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
                Agende a sua Sessão de Diagnóstico de PME
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Reserve uma videochamada de 15 minutos gratuita com o arquiteto técnico Peniel Mucavel. Validamos as vossas maiores barreiras operacionais e sugerimos correções estratégicas imediatas.
              </p>
            </div>

            {bookingSuccess ? (
              <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-2xl text-center space-y-4 max-w-2xl mx-auto py-12 animate-fadeIn">
                <div className="mx-auto h-12 w-12 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">Sua Pré-Reserva foi Registada Localmente!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Para selar o bloqueio no calendário executivo internacional e emitir o convite eletrónico Google Meet, por favor envie uma mensagem via WhatsApp de confirmação de 1-toque.
                </p>
                <div className="pt-2">
                  <a
                    href={getWhatsAppBookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Confirmar via WhatsApp</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingSuccess(false)}
                  className="text-slate-400 hover:text-white text-[11px] underline block mx-auto pt-2"
                >
                  Fazer outro agendamento
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs text-left max-w-4xl">
                
                {/* Inputs left */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">1. Escolha a Especialidade de Diagnóstico *</label>
                    <select
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 px-3 py-2.5 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Consultoria Estratégica & Diagnóstico de Negócio">Consultoria Estratégica & Diagnóstico de Negócio</option>
                      <option value="Arquitetura de API M-Pesa & Pagamentos Móveis">Arquitetura de API M-Pesa & Pagamentos Móveis</option>
                      <option value="Conformidade Laboral e Minutagem (Lei 23/2007)">Conformidade Laboral e Minutagem (Lei 23/2007)</option>
                      <option value="Produtividade Inteligente de IA & Consultivo">Produtividade Inteligente de IA & Consultivo</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">2. Escolher Data *</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 px-3 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">3. Escolher Hora *</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 px-3 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="09:00">09:00 (Maputo)</option>
                        <option value="10:00">10:00 (Maputo)</option>
                        <option value="11:00">11:00 (Maputo)</option>
                        <option value="14:00">14:00 (Maputo)</option>
                        <option value="15:00">15:00 (Maputo)</option>
                        <option value="16:00">16:00 (Maputo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inputs right */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">Seu Nome Completo *</label>
                      <input
                        type="text"
                        placeholder="Ex: Clara de Sousa"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 px-3 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">WhatsApp para Contacto *</label>
                      <input
                        type="text"
                        placeholder="Ex: +258 84..."
                        value={bookingContact}
                        onChange={(e) => setBookingContact(e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 px-3 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase font-mono">Conte-nos sobre as vossas maiores dificuldades de negócio</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Preciso automatizar o recebimento de faturas ou regularizar contratos de funcionários..."
                      value={bookingNote}
                      onChange={(e) => setBookingNote(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 px-3 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold uppercase rounded-xl tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      Reservar Sessão de Orientação
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>

          {/* 6. TESTIMONIALS & PARtNERS WALL (Wix Wh-1071 Social proof) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Col - Partners logo carousel / wall */}
            <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-4 text-left">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CONSTITUIDO COM CONFIANÇA</span>
                <h4 className="text-base font-bold text-white mt-1">Nossa Rede Corporativa</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Lideramos integradores que acionam sinergias com operadoras nacionais.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {corporatePartners.map((p, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col - Interactive testimonial widget */}
            <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-between text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-amber-500 uppercase font-black tracking-widest flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500 animate-pulse" />
                  <span>DEPOIMENTOS CORPORATIVOS</span>
                </span>
                <div className="flex gap-1">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-2 w-2 rounded-full cursor-pointer transition ${activeTestimonial === idx ? 'bg-amber-500 w-4' : 'bg-slate-700'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 min-h-[90px] animate-fadeIn">
                <p className="text-sm text-slate-200 italic leading-relaxed font-sans">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div>
                  <strong className="text-xs text-white block">{testimonials[activeTestimonial].author}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {testimonials[activeTestimonial].role} — {testimonials[activeTestimonial].company}
                  </span>
                </div>
              </div>
            </div>

          </section>

          {/* 7. WIX TEMPLATE OUTRO CALL TO ACTION */}
          <section className="p-8 bg-[#0a0a23] border border-white/5 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
            <h4 className="text-lg font-bold text-white">Pronto para levar a sua PME ao Próximo Nível?</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-md mx-auto">
              Nossa consola de alta velocidade de dados e o formatador de licitações fiduciárias estão operando perfeitamente. Faça o seu currículo oficial ou configure uma API rápida.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setActiveTab('servicos')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase rounded-xl transition cursor-pointer"
              >
                Explorar Serviços Técnicos
              </button>
            </div>
          </section>

        </div>
      ) : (
        // ==========================================
        // 💻 FREECODECAMP TRADITIONAL CONSOLE LAYOUT
        // ==========================================
        <div className="space-y-12 animate-fadeIn font-mono">
          
          {/* Hero Section - Strict freeCodeCamp Landing Page Style */}
          <section className="py-14 text-center max-w-4xl mx-auto space-y-8 bg-[#0a0a23] border border-[#3b3b4f] p-8 md:p-14">
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold leading-tight text-white select-none">
              Aprenda Tecnologia e IA <br className="hidden md:inline" />
              <span className="text-[#fecc4c] underline decoration-[#fecc4c]" style={{ textDecorationThickness: '4px' }}>— de graça.</span>
            </h1>

            <div className="space-y-3 max-w-2xl mx-auto font-mono text-left text-sm md:text-base text-slate-300">
              <p className="flex items-start gap-2.5">
                <span className="text-[#fecc4c] font-black shrink-0">&gt;</span>
                <span>Construa projetos reais adaptados a Moçambique.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-[#fecc4c] font-black shrink-0">&gt;</span>
                <span>Gere o seu currículo e cartas de apresentação.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-[#fecc4c] font-black shrink-0">&gt;</span>
                <span>Apoio fiduciário com Peniel Dinis Mucavel desde 2026.</span>
              </p>
            </div>

            <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-sans">
              Nossa missão é impulsionar a inclusão tecnológica nacional por meio de ferramentas leves que carregam instantaneamente mesmo no pacote mais básico da Vodacom ou Movitel.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setActiveTab('cursos')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-bold text-sm tracking-tight transition duration-200 cursor-pointer rounded-none inline-flex items-center justify-center gap-2 border border-transparent shadow shadow-[#fecc4c]/10"
              >
                <span>Começar (é grátis)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Graduated Trust Icons */}
            <div className="pt-8 border-t border-[#3b3b4f] space-y-3">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Formandos Netek ativos nas marcas líderes nacionais e globais:</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-bold font-mono text-slate-300 text-xs tracking-widest uppercase opacity-75">
                <span>Google</span>
                <span>Vodacom</span>
                <span>M-Pesa</span>
                <span>e-Mola</span>
                <span>STB</span>
                <span>Standard</span>
              </div>
            </div>

          </section>

          {/* Mozambique Local Stats Bar */}
          <section className="bg-[#1b1b32] border border-[#3b3b4f] p-6 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-center font-mono">
              <div className="p-3 border border-[#3b3b4f] bg-[#0a0a23]">
                <span className="block text-xl font-bold text-[#fecc4c]">99.8%</span>
                <span className="text-[10px] uppercase text-slate-400 tracking-wide font-sans">Uptime Sistemas</span>
              </div>
              <div className="p-3 border border-[#3b3b4f] bg-[#0a0a23]">
                <span className="block text-xl font-bold text-white">Nacional</span>
                <span className="text-[10px] uppercase text-slate-400 tracking-wide font-sans">Moçambique Sede</span>
              </div>
              <div className="p-3 border border-[#3b3b4f] bg-[#0a0a23]">
                <span className="block text-xl font-bold text-emerald-400">100% Mobile</span>
                <span className="text-[10px] uppercase text-slate-400 tracking-wide font-sans">Consumo Leve</span>
              </div>
            </div>
          </section>

          {/* freeCodeCamp Certifications / Navigation Blocks Index */}
          <section className="space-y-6">
            <div className="text-left space-y-2 border-b border-[#3b3b4f] pb-3">
              <h2 className="text-xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
                <Code className="h-5 w-5 text-[#fecc4c]" />
                <span>Módulos Académicos e Ferramentas Práticas</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Selecione uma das "Certificações" abaixo para iniciar imediatamente o seu formulário ou lição sem carregar páginas novas pesadas:
              </p>
            </div>

            <div className="space-y-3 select-none">
              {fccCertifications.map((cert) => {
                const IconComp = cert.icon;
                return (
                  <button
                    key={cert.id}
                    onClick={() => setActiveTab(cert.id)}
                    className="w-full p-4 bg-[#1b1b32] hover:bg-[#2a2a40] border border-[#3b3b4f] hover:border-[#fecc4c] text-left transition duration-150 flex items-center justify-between gap-4 cursor-pointer rounded-none group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-2.5 bg-[#0a0a23] border border-[#3b3b4f] group-hover:border-[#fecc4c] transition text-[#fecc4c]">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs md:text-sm font-bold text-white tracking-tight leading-tight group-hover:underline truncate">
                          {cert.title}
                        </h3>
                        <span className="block text-[10px] text-slate-400 mt-1 font-mono truncate">
                          {cert.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-[#fecc4c] transition font-bold shrink-0 text-xs font-mono">
                      [ Abrir ]
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Featured Challenge Playground Widget: M-Pesa QR checkout simulating freeCodeCamp sandbox */}
          <section className="bg-[#1b1b32] border border-[#3b3b4f] p-6 md:p-8 space-y-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0a0a23] border border-[#3b3b4f] text-[#fecc4c] text-[10px] font-mono uppercase">
                🚀 Laboratório Prático fCC-Netek
              </div>
              <h3 className="text-lg font-sans font-bold text-white">
                Desafio de Automação Financeira: Simulador de Código QR M-Pesa
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Este mini laboratório simula a geração das cordas binárias fiduciárias usadas por aplicativos bancários e pelo <strong>&gt; Meu M-Pesa</strong> em Moçambique para executar Checkouts rápidos! Configure os inputs abaixo e veja os códigos faturados em tempo real.
              </p>
            </div>

            {/* Inputs panel styled in terminal look */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Número do Recebedor (Carteira)</label>
                <input
                  type="text"
                  value={qrPhone}
                  onChange={(e) => setQrPhone(e.target.value)}
                  placeholder="Ex: 8401666592"
                  className="w-full bg-[#0a0a23] border border-[#3b3b4f] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#fecc4c] rounded-none"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Montante (em Meticais/MT)</label>
                <input
                  type="number"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  placeholder="Ex: 250"
                  className="w-full bg-[#0a0a23] border border-[#3b3b4f] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#fecc4c] rounded-none"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Referência Única</label>
                <input
                  type="text"
                  value={qrRef}
                  onChange={(e) => setQrRef(e.target.value)}
                  placeholder="Ex: NETEK-TEST-1"
                  className="w-full bg-[#0a0a23] border border-[#3b3b4f] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#fecc4c] rounded-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#3b3b4f]">
              <button
                type="button"
                onClick={handleGenerateCode}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-bold text-xs uppercase rounded-none transition cursor-pointer flex items-center justify-center gap-2 border border-transparent"
              >
                <QrCode className="h-4 w-4" />
                <span>Gerar QR Code Técnico</span>
              </button>
              
              <span className="text-[10px] text-slate-400 leading-normal font-mono">
                &gt; Titular do Simulador: Peniel Mucavel para liquidação célere.
              </span>
            </div>

            {/* Output Screen */}
            <div className="bg-[#0a0a23] border border-[#3b3b4f] p-4 flex flex-col items-center justify-center text-center space-y-4">
              {isGenerating ? (
                <div className="h-40 w-full flex flex-col items-center justify-center text-slate-400 text-xs italic space-y-2 font-mono">
                  <div className="animate-spin h-5 w-5 border-2 border-[#fecc4c] border-t-transparent rounded-none"></div>
                  <span>Construindo matriz de pontos QR...</span>
                </div>
              ) : generatedUrl ? (
                <div className="flex flex-col items-center space-y-3 py-3 animate-fadeIn">
                  <div className="p-3 bg-white rounded-none border-2 border-[#fecc4c]">
                    <img
                      src={generatedUrl}
                      alt="M-Pesa QR Code"
                      referrerPolicy="no-referrer"
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                  <p className="text-[10px] text-slate-300 max-w-md leading-normal">
                    <span className="text-[#198754] font-bold block mb-1">✓ PAYLOAD DE CHECKOUT GERADO COM SUCESSO:</span>
                    O leitor integrado do app <strong className="text-white">Meu M-Pesa</strong> ou banco móvel em Moçambique identificará o montante de <strong className="text-[#fecc4c]">{qrAmount} MT</strong> destinado à carteira técnica.
                  </p>
                </div>
              ) : (
                <div className="h-40 w-full flex flex-col items-center justify-center text-slate-500 text-xs p-4 font-mono">
                  <QrCode className="h-7 w-7 text-slate-600 mb-2 animate-pulse" />
                  <span>&gt; Introduza os dados de recepção acima e ordene a simulação de Checkout para testar a string bancária</span>
                </div>
              )}
            </div>
          </section>

          {/* Mozambique Low Data and Technical Optimization */}
          <section className="bg-[#1b1b32] border border-[#3b3b4f] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-3 max-w-xl text-left">
              <span className="inline-block px-2 py-0.5 bg-[#0a0a23] border border-[#3b3b4f] text-[#198754] text-[10px] font-mono tracking-wider font-bold">
                ARQUITETURA DE DADOS OTIMIZADA
              </span>
              <h3 className="text-base font-sans font-bold text-white tracking-tight">
                Navegação Limpa que economiza o seu Saldo Móvel
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Compreendemos que em Moçambique a internet móvel exige eficiência e controlo estrito do consumo de dados. O portal da **Netek Services** foi reprogramado utilizando pure CSS com zero dependências pesadas de rastreio ou imagens redundantes. Carrega de forma ultraveloz mesmo sob conetividade 3G em zonas recônditas, ocupando menos de 95Kb por tela!
              </p>
            </div>
            <div className="bg-[#0a0a23] border border-[#3b3b4f] p-4 space-y-2 shrink-0 w-full md:w-64 font-mono text-[10px]">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-[#198754] font-bold">✓</span>
                <span>Sem Cookies invasivos</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-[#198754] font-bold">✓</span>
                <span>Assets limitados a 75Kb</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-[#198754] font-bold">✓</span>
                <span>Estilo Brutalista fCC</span>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* Mozambique Local Connection Banner inside layout wrapper */}
      <div className="p-3 bg-[#1b1b32] border border-[#3b3b4f] flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#198754] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#198754]"></span>
          </span>
          <span className="text-xs text-slate-300 font-mono">
            &gt; Consola de Monitoramento: <strong className="text-[#fecc4c]">{currentMozTime()}</strong>
          </span>
        </div>
        <div className="flex gap-4 text-xs text-slate-400 font-mono">
          <span>📶 Redes Nacionais Moçambicanas</span>
          <span className="text-emerald-400">✓ Baixo Consumo Móvel</span>
        </div>
      </div>

    </div>
  );
}
