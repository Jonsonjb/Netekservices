import React, { useState, useEffect } from 'react';
import { 
  User, Bookmark, Clock, CheckCircle2, ShieldCheck, Heart, 
  ChevronRight, Smartphone, AlertTriangle, Scale, Lock, HelpCircle
} from 'lucide-react';
import { AppUser } from '../firebase';

interface ProfileViewProps {
  user: AppUser | null;
  onLogin: () => void;
}

export default function ProfileView({ user, onLogin }: ProfileViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'premarcao' | 'termos'>('perfil');
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [symbolicPrice, setSymbolicPrice] = useState<number>(150);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  
  const [portalName, setPortalName] = useState('');
  const [candidateName, setCandidateName] = useState(user?.displayName || '');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [extraDetails, setExtraDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'mkesh'>('mpesa');
  const [formSuccess, setFormSuccess] = useState(false);

  const finalPrice = isCustomMode ? (parseInt(customPrice) || 0) : symbolicPrice;

  useEffect(() => {
    // Load local storage bookings
    try {
      const savedBookings = localStorage.getItem('netek_pre_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    } catch (e) {
      console.error(e);
    }

    // Load bookmarks configuration
    try {
      const savedBookmarks = localStorage.getItem('netek_portal_bookmarks');
      const bookIds = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      setBookmarks(bookIds);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalName || !candidateName || !candidatePhone) return;

    const finalPrice = isCustomMode ? (parseInt(customPrice) || 0) : symbolicPrice;

    const newBooking = {
      id: `booking_${Date.now()}`,
      portalName,
      candidateName,
      candidatePhone,
      extraDetails,
      paymentMethod,
      price: finalPrice,
      status: 'Pendente (Aguardando Pagamento)',
      date: new Date().toLocaleDateString('pt-PT') + ' ' + new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      titular: 'Peniel Dinis Mucavel'
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('netek_pre_bookings', JSON.stringify(updated));

    // Construct direct WhatsApp URL for Peniel Dinis Mucavel with details
    const message = `Olá Peniel Dinis Mucavel (Netek Services),\n` +
      `Gostaria de solicitar o serviço de *Pré-Marcação Assistida* (Taxa: ${finalPrice} MT).\n` +
      `• *Serviço/Portal:* ${portalName}\n` +
      `• *Nome do Candidato:* ${candidateName}\n` +
      `• *Contacto:* ${candidatePhone}\n` +
      `• *Método de Pagamento:* ${paymentMethod.toUpperCase()}\n` +
      `• *Valor de Contribuição:* ${finalPrice} MT\n` +
      `• *Detalhes:* ${extraDetails || 'Nenhum'}\n` +
      `Por favor, me auxilie com a minha inscrição oficial!`;

    // Reset fields
    setPortalName('');
    setExtraDetails('');
    setFormSuccess(true);
    
    // Redirect to WhatsApp link
    const whatsappUrl = `https://api.whatsapp.com/send?phone=258835109190&text=${encodeURIComponent(message)}`;
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFormSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Profile Jumbotron Card representing Mozambique Localized Identity */}
      <div className="bg-gradient-to-br from-[#0c142c] via-[#05070a] to-[#0d071b] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#22d3ee]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Profile Avatar Spot */}
        <div className="flex flex-col md:flex-row items-center gap-5 relative z-10 text-center md:text-left">
          {user ? (
            <div className="relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="h-20 w-20 rounded-full border-2 border-[#22d3ee] object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-20 w-20 bg-[#22d3ee]/20 text-[#22d3ee] rounded-full flex items-center justify-center text-3xl font-bold font-mono uppercase">
                  {user.displayName.charAt(0)}
                </div>
              )}
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#05070a] shadow flex items-center justify-center" title="Sessão Ativa"></span>
            </div>
          ) : (
            <div className="h-20 w-20 bg-white/5 text-slate-400 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
              <User className="h-10 w-10 text-slate-550" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="text-xl md:text-2xl font-black text-white">
                {user ? user.displayName : 'Visitante Anónimo'}
              </h3>
              <span className="px-2 py-0.5 bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/10 text-[8px] uppercase tracking-widest font-mono font-bold rounded">
                {user ? 'Recrutador / Aluno' : 'Modo Convidado'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {user ? user.email : 'Entre com a sua conta Google para sincronizar as suas ações de recrutamento'}
            </p>
          </div>
        </div>

        {/* Login trigger if guest */}
        {!user && (
          <button
            onClick={onLogin}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-slate-950 font-black tracking-wider text-xs uppercase rounded-xl hover:scale-105 active:scale-95 transition cursor-pointer text-center relative z-10 shrink-0"
          >
            Iniciar Sessão com Google
          </button>
        )}
      </div>

      {/* Internal Navigation Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveSubTab('perfil')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'perfil' 
              ? 'bg-white/5 border border-white/10 text-white' 
              : 'text-slate-450 hover:text-white'
          }`}
        >
          <User className="h-4 w-4 text-[#22d3ee]" />
          <span>Visão Geral & Preferências</span>
        </button>
        <button
          onClick={() => setActiveSubTab('premarcao')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'premarcao' 
              ? 'bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee]' 
              : 'text-slate-450 hover:text-[#22d3ee]'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Pré-Marcação Assistida (Simbólico {finalPrice} MT)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('termos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'termos' 
              ? 'bg-white/5 border border-white/10 text-white' 
              : 'text-slate-450 hover:text-white'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Termos de Uso & Privacidade</span>
        </button>
      </div>

      {/* Details Area */}
      {activeSubTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column Local ID Widget */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4 col-span-1 lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#22d3ee]" />
              <span>Painel de Segurança do Candidato</span>
            </h4>
            
            <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
              <p>
                Os seus dados de currículo gerados localmente e preferências de portais úteis ficam salvos de forma estritamente segura no armazenamento seguro do seu próprio navegador web de internet (Offline State Engine).
              </p>
              <p>
                As submissões diretas estão sob a curadoria direta de <strong>Peniel Dinis Mucavel</strong>, titular oficial da Netek Services Moçambique.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#05070a]/60 rounded-xl border border-white/5 text-left">
                <span className="block text-[10px] uppercase text-slate-500 font-mono">Titular do Canal M-Pesa</span>
                <span className="text-white font-bold block mt-0.5">Peniel Dinis Mucavel</span>
                <span className="text-[#22d3ee] font-mono font-semibold block text-[10px] mt-0.5">Carteira Segura: 8401666592</span>
              </div>
              <div className="p-3 bg-[#05070a]/60 rounded-xl border border-white/5 text-left">
                <span className="block text-[10px] uppercase text-slate-500 font-mono">Titular do Canal e-Mola</span>
                <span className="text-white font-bold block mt-0.5">Peniel Dinis Mucavel</span>
                <span className="text-emerald-400 font-mono font-semibold block text-[10px] mt-0.5">Carteira Segura: 874786943</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-purple-400">Atividade Local</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Portais Marcados:</span>
                <span className="text-white font-mono font-bold">{bookmarks.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Pedidos de Pré-Marcação:</span>
                <span className="text-white font-mono font-bold">{bookings.length}</span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-400">Estado de Consentimento:</span>
                <span className="text-emerald-400 font-mono font-bold">Aceite ✓</span>
              </div>
            </div>

            <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-500 rounded-xl leading-relaxed flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Cuidado com burlas! Nós NUNCA enviamos mensagens privadas pedindo códigos PIN das suas carteiras móveis do telemóvel!</span>
            </div>
          </div>

        </div>
      )}

      {/* Assisted Pre-booking Service Screen */}
      {activeSubTab === 'premarcao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5 lg:col-span-7">
            <div>
              <span className="p-0.5 px-2 bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 uppercase rounded text-[8px] font-mono tracking-wider font-extrabold mb-1 inline-block">Filtro de Inclusão Financeira</span>
              <h4 className="text-lg font-bold text-white font-display">Solicitar apoio físico para Pré-Marcação</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Não consegue efetuar uma pré-inscrição num portal oficial, candidata de emprego, universidade pública ou concurso do Estado? A nossa equipa liderada por <strong>Peniel Dinis Mucavel</strong> cuida do processo manual para si por uma quota mínima simbólica à sua escolha de <strong>{finalPrice} MT</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Nome do Candidato / Estudante *</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Nome completo do candidato"
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Contacto de Telemóvel para WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="Ex: 8401666592"
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">O que pretende pré-marcar? (Portal/Escola/Vaga) *</label>
                <input
                  type="text"
                  required
                  value={portalName}
                  onChange={(e) => { setPortalName(e.target.value); setFormSuccess(false); }}
                  placeholder="Ex: Bolsa de Estudos UEM / Renovação de BI / Registo INSS"
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Informação de Acesso ou Notas Importantes</label>
                <textarea
                  rows={3}
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  placeholder="Introduza detalhes adicionais importantes para ajudar o especialista."
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition resize-none"
                />
              </div>

              {/* Multi-price selection selector as requested */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Sinal Simbólico de Serviço (Meticais/MT) *
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[10, 20, 50, 100, 150, 200].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSymbolicPrice(val);
                        setIsCustomMode(false);
                      }}
                      className={`px-3 py-1.5 border text-xs font-mono rounded-xl transition cursor-pointer ${
                        !isCustomMode && symbolicPrice === val
                          ? 'bg-[#22d3ee]/15 border-[#22d3ee]/40 text-[#22d3ee] font-bold'
                          : 'border-white/5 bg-white/[0.01] text-slate-450 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {val} MT
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMode(true);
                    }}
                    className={`px-3 py-1.5 border text-xs font-mono rounded-xl transition cursor-pointer ${
                      isCustomMode
                        ? 'bg-[#22d3ee]/15 border-[#22d3ee]/40 text-[#22d3ee] font-bold'
                        : 'border-white/5 bg-white/[0.01] text-slate-455 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Personalizar ou Aumentar...
                  </button>
                </div>

                {isCustomMode && (
                  <div className="pt-2 flex items-center gap-2 animate-fadeIn">
                    <span className="text-slate-550 text-xs font-mono font-bold">&gt;&gt;</span>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      value={customPrice}
                      placeholder="Indique o valor desejado (ex: 250, 300, 500)"
                      onChange={(e) => setCustomPrice(e.target.value.replace(/\D/g, ''))}
                      className="bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#22d3ee] focus:outline-none focus:border-[#22d3ee] w-64 font-mono font-extrabold"
                    />
                    <span className="text-slate-400 text-xs font-mono font-bold">MT</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <label className="text-[10px] uppercase font-bold text-slate-450 block">Método de Envio do Sinal Simbólico ({finalPrice} MT)</label>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`py-2 px-3.5 border rounded-xl transition font-mono ${
                      paymentMethod === 'mpesa'
                        ? 'bg-red-500/10 border-red-500/40 text-red-400 font-bold'
                        : 'border-white/5 bg-white/[0.01] text-slate-400'
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('emola')}
                    className={`py-2 px-3.5 border rounded-xl transition font-mono ${
                      paymentMethod === 'emola'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                        : 'border-white/5 bg-white/[0.01] text-slate-400'
                    }`}
                  >
                    e-Mola
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mkesh')}
                    className={`py-2 px-3.5 border rounded-xl transition font-mono ${
                      paymentMethod === 'mkesh'
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500 font-bold'
                        : 'border-white/5 bg-white/[0.01] text-slate-400'
                    }`}
                  >
                    mKesh
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-slate-950 font-black uppercase tracking-wider text-xs rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#22d3ee]/14"
              >
                <Smartphone className="h-4 w-4" />
                <span>Enviar para WhatsApp Peniel Dinis</span>
              </button>
            </form>

            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>✓ Solicitação gravada! Abrir link de chat com Peniel para validar o processamento...</span>
              </div>
            )}
          </div>

          {/* Guidelines & Recent requests */}
          <div className="space-y-6 lg:col-span-5">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-[#22d3ee]">DADOS OFICIAIS DE TRANSFERÊNCIA</h4>
              <p className="text-[11px] text-slate-410 leading-relaxed">
                Após enviar a sua mensagem pré-inicial, por favor envie o comprovante correspondente de <strong>{finalPrice} MT</strong> para o respetivo contacto liderado por <strong>Peniel Dinis Mucavel</strong> para agilizar a submissão física:
              </p>
              
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-red-400 font-bold">M-Pesa</span>
                  <span className="text-white font-bold">8401666592</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-emerald-400 font-bold">e-Mola</span>
                  <span className="text-white font-bold">874786943</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-yellow-500 font-bold">mKesh</span>
                  <span className="text-white font-bold">835109190</span>
                </div>
                <div className="flex items-center justify-between font-sans text-[10px] text-slate-500 pt-1">
                  <span>Nome do Titular Oficial das Contas:</span>
                  <span className="text-white font-mono font-bold">PENIEL DINIS MUCAVEL</span>
                </div>
              </div>
            </div>

            {/* List saved requests */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-purple-400">Histórico de Pré-Marcações Assistidas</h4>
              
              {bookings.length === 0 ? (
                <p className="text-[11px] text-slate-500 leading-normal italic text-center py-4">Nenhuma solicitação registada neste telemóvel até ao momento.</p>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-3 bg-[#05070a]/60 rounded-xl border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong className="text-white truncate block max-w-[150px]">{b.portalName}</strong>
                        <span className="px-1.5 py-0.5 bg-yellow-405/10 text-yellow-500 text-[8px] uppercase tracking-wider rounded font-bold font-mono">Pendente</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-450 font-mono">
                        <span>Candidato: {b.candidateName}</span>
                        <span>{b.price} MT ({b.paymentMethod.toUpperCase()})</span>
                      </div>
                      <span className="block text-[8px] text-slate-550 text-right font-mono">{b.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Terms of Use and Privacy Policy Sheet */}
      {activeSubTab === 'termos' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6 max-w-4xl">
          <div className="space-y-2 border-b border-white/5 pb-4">
            <h4 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Scale className="h-5 w-5 text-[#22d3ee]" />
              <span>Termos de Uso & Políticas de Privacidade</span>
            </h4>
            <p className="text-xs text-slate-450 font-mono">Última atualização: Julho de 2026 | Netek Services LDA</p>
          </div>

          <div className="space-y-4 text-xs text-slate-350 leading-relaxed overflow-y-auto max-h-96 pr-2">
            <section className="space-y-1.5">
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full"></span> 
                1. Introdução e Enquadramento Legal
              </h5>
              <p>
                Bem-vindo ao portal oficial da Netek Services. Este site é um ecossistema fiduciário destinado a potenciar as competências e acessos dos candidatos profissionais e estudantes em Moçambique. Ao navegar ou solicitar serviços, declara o seu consentimento pleno a estas diretrizes.
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full"></span> 
                2. Proteção de Dados e Privacidade
              </h5>
              <p>
                Os dados sensíveis relativos a CVs, documentos do cidadão, identificação biométrica ou detalhes de recrutamento introduzidos nos nossos geradores inteligentes e formulários de suporte permanecem alojados exclusivamente no armazenamento local temporário do seu dispositivo (localStorage). A Netek não armazena de forma permanente os seus dados de candidatura em servidores externos, salvaguardando a integridade legal da sua privacidade.
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full"></span> 
                3. Serviços de Pré-Marcação e Quotas de Serviço
              </h5>
              <p>
                A Netek disponibiliza um canal de facilitação física para preenchimento de inscrições difíceis por uma cota justa e de baixíssimo custo à escolha do utilizador e proporcional ao apoio prestado ({finalPrice} MT). Este serviço representa um compromisso de meios e não um resultado garantido de contratação ou entrada oficial de concurso, dependendo sempre da validade legal dos documentos que o candidato submeta ao canal M-Pesa/e-Mola oficial gerido por <strong>Peniel Dinis Mucavel</strong>.
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full"></span> 
                4. Segurança Anti-Burlar e Denúncias
              </h5>
              <p>
                Recomendamos vigilância total com comunicações externas. O nosso reporte é puramente administrativo e as denúncias submetidas no diretório de portais ocultos são geridas e avaliadas administrativamente pela coordenação de segurança técnica para garantir canais livres de fraudes digitais de recrutamento no país.
              </p>
            </section>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 shrink-0" />
              <span>
                <strong>Consentimento Legal Ativo:</strong> Ao utilizar este protótipo interactivo, declara que leu, entendeu e aceita voluntariamente estes termos.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
