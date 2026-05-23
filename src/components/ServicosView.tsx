import React, { useState } from 'react';
import { SERVICES_DATA } from '../data';
import { ServiceItem } from '../types';
import { CreditCard, Globe, Wifi, MessageSquare, Check, CheckSquare, Square, Smartphone, ArrowRight, HelpCircle, ShieldCheck, Sparkles, AlertCircle, ExternalLink, CalendarDays } from 'lucide-react';

interface OfficialPortal {
  id: string;
  name: string;
  acronym: string;
  link: string;
  serviceDescription: string;
  simulatedStatus: 'estavel' | 'instavel' | 'manutencao';
  typicalWaitingDays: string;
}

const OFFICIAL_PORTALS: OfficialPortal[] = [
  {
    id: 'op1',
    name: 'Direção Nacional de Identificação Civil',
    acronym: 'DNIC (Bilhete de Identidade - BI)',
    link: 'https://www.dnic.gov.mz',
    serviceDescription: 'Pré-marcação online obrigatória para emissão ou renovação de Bilhete de Identidade (BI) em postos oficiais.',
    simulatedStatus: 'instavel',
    typicalWaitingDays: '3 a 5 dias de espera'
  },
  {
    id: 'op2',
    name: 'Serviço Nacional de Migração de Moçambique',
    acronym: 'SENAMI (Passaporte de Viagem)',
    link: 'https://www.senami.gov.mz',
    serviceDescription: 'Pré-registo, submissão de dados biométricos e agendamento para emissão de Passaporte Nacional e DIRE.',
    simulatedStatus: 'instavel',
    typicalWaitingDays: '5 a 8 dias de espera'
  },
  {
    id: 'op3',
    name: 'Instituto Nacional dos Transportes Rodoviários',
    acronym: 'INATRO (Carta de Condução)',
    link: 'https://www.inatro.gov.mz',
    serviceDescription: 'Portal de marcação e acompanhamento de exames de condução, emissão de cartas provisórias e definitivas.',
    simulatedStatus: 'manutencao',
    typicalWaitingDays: 'Guia sob consulta'
  },
  {
    id: 'op4',
    name: 'Autoridade Tributária de Moçambique',
    acronym: 'AT (Registo Único de NUIT)',
    link: 'https://www.at.gov.mz',
    serviceDescription: 'Submissão de declarações de início de atividade individual e emissão do Número Único de Identificação Tributária.',
    simulatedStatus: 'estavel',
    typicalWaitingDays: '1 a 2 dias'
  }
];

export default function ServicosView() {
  const [selectedServices, setSelectedServices] = useState<string[]>(['s1']); // Landing page selected by default
  const [clientName, setClientName] = useState('');
  const [clientProvince, setClientProvince] = useState('Maputo');
  
  // Custom project scope state
  const [customUrgent, setCustomUrgent] = useState(false);

  // Portal facilitation custom support state
  const [consultingModalOpen, setConsultingModalOpen] = useState(false);
  const [selectedPortalForConsult, setSelectedPortalForConsult] = useState<OfficialPortal | null>(null);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [consultingSuccess, setConsultingSuccess] = useState(false);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(sId => sId !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="h-5 w-5 text-[#22d3ee]" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5 text-[#c084fc]" />;
      case 'Wifi':
        return <Wifi className="h-5 w-5 text-emerald-400" />;
      case 'MessageSquareText':
        return <MessageSquare className="h-5 w-5 text-amber-400" />;
      default:
        return <Globe className="h-5 w-5 text-slate-300" />;
    }
  };

  const baseTotal = selectedServices.reduce((sum, id) => {
    const service = SERVICES_DATA.find(s => s.id === id);
    return sum + (service?.basePrice || 0);
  }, 0);

  const finalTotal = customUrgent ? Math.round(baseTotal * 1.2) : baseTotal;

  const getSimulatedWhatsAppLink = () => {
    const phone = '258835109190';
    const chosenObjects = selectedServices.map(id => SERVICES_DATA.find(s => s.id === id)).filter(Boolean) as ServiceItem[];
    const chosenTitles = chosenObjects.map(s => ` - ${s.title} (${s.basePrice.toLocaleString()} MT)`).join('\n');
    
    const urgencyText = customUrgent ? '\n*Solicitação de Carácter Urgente (+20% taxa de prioridade)*' : '';
    
    const message = `Olá Netek, fiz uma simulação de orçamento no vosso site para os meus requisitos:\n` +
      `*Cliente:* ${clientName || 'Invalido/Não especificado'}\n` +
      `*Província:* ${clientProvince}\n` +
      `*Serviços Selecionados:*\n${chosenTitles}\n` +
      `${urgencyText}\n` +
      `*Total Estimado:* ${finalTotal.toLocaleString()} MT\n\n` +
      `Gostava de agendar uma reunião técnica para analisar a viabilidade. Kanimambo!`;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  };

  const getWhatsAppPortalConsultLink = (portal: OfficialPortal) => {
    const phone = '258835109190';
    const message = `Olá Netek, solicito assistência de consultoria técnica para portais oficiais!\n` +
      `*Cidadão:* ${userName}\n` +
      `*Contacto Directo:* ${userPhone}\n` +
      `*Portal e Candidatura:* ${portal.acronym}\n` +
      `*Detalhes / Notas:* ${extraInstructions || 'N/A'}\n\n` +
      `Não consegui resolver sozinho no portal oficial devido a instabilidades. Solicito agendamento ou guias emitidas pela vossa equipa fiduciária. Kanimambo!`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  };

  const handlePortalConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || !selectedPortalForConsult) return;
    setConsultingSuccess(true);
  };

  return (
    <div className="space-y-12">
      
      {/* View Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-xs font-mono text-[#c084fc] uppercase tracking-widest block mb-2">Presença e Automatização</span>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Prestação de Serviços & Consultoria Digital
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl leading-relaxed">
          Desenvolvemos software moderno de baixo consumo e ligamos soluções. Abaixo, explore o nosso catálogo de serviços inteligentes de engenharia, estime orçamentos de e-commerce e, adicionalmente, consulte a nossa <strong>Central de Apoio a Portais Oficiais</strong> para Moçambique.
        </p>
      </div>

      {/* NEW SECTION: Central de Apoio a Portais Oficiais */}
      <div className="space-y-6">
        <div className="p-4 bg-[#22d3ee]/5 border border-[#22d3ee]/20 rounded-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#22d3ee] uppercase tracking-widest font-black flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Serviços de Consultoria Fiduciária - Moçambique
              </span>
              <h3 className="text-lg font-bold text-white">Central de Agendamento & Marcação Técnica Facilitada</h3>
              <p className="text-xs text-slate-350 max-w-3xl leading-relaxed">
                Os portais governamentais de Moçambique são fundamentais, mas frequentemente enfrentam instabilidades de carregamento ou mostram-se muito difíceis de operar em conexões móveis lentas. <strong>A nossa equipa técnica atua quando você não consegue realizar os seus cadastros ou emissão de guias nos sites oficiais.</strong> Prepararemos toda a papelada, emitiremos as taxas e marcaremos a sua ida física oficial!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFICIAL_PORTALS.map((portal) => {
            return (
              <div key={portal.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition duration-300 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#c084fc]">{portal.acronym}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                      portal.simulatedStatus === 'estavel' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      portal.simulatedStatus === 'instavel' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/25'
                    }`}>
                      {portal.simulatedStatus === 'estavel' ? 'Portal Online ✅' :
                       portal.simulatedStatus === 'instavel' ? 'Muito Instável ⚠️' : 'Em Manutenção 🔧'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition duration-200">{portal.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed min-h-[3rem]">{portal.serviceDescription}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 text-[#22d3ee]" />
                    <span>Marcação Média: <strong>{portal.typicalWaitingDays}</strong></span>
                  </div>
                </div>

                {/* External links and facilitate button calls */}
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={portal.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <span>Abrir Portal Oficial</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    onClick={() => {
                      setSelectedPortalForConsult(portal);
                      setConsultingSuccess(false);
                      setConsultingModalOpen(true);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-[#22d3ee] hover:text-slate-950 border border-white/10 hover:border-transparent rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Facilitar pela Netek
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-10">
        <span className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest block mb-2">Engenharia Web & E-Commerce</span>
        <h3 className="text-xl font-display font-black text-white">Serviços Web Exclusivos & Automatização</h3>
        <p className="text-xs text-slate-400 mt-1">
          Precisa de uma landing page para impulsionar as suas vendas ou ligar pagamentos de M-Pesa? Adicione os componentes ao simulador inteligente abaixo.
        </p>
      </div>

      {/* Services Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES_DATA.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#22d3ee]/5 border-[#22d3ee] shadow-lg shadow-[#22d3ee]/5'
                  : 'bg-white/5 border border-white/10 hover:border-[#22d3ee]/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    {renderServiceIcon(service.iconName)}
                  </div>
                  <div>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Check className="h-3 w-3" /> Selecionado para Cálculo
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                        Toque para selecionar
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#c084fc] uppercase tracking-wider">{service.category}</span>
                  <h3 className="text-lg font-display font-semibold text-white mt-0.5">{service.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{service.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono">Entrega Prevista</span>
                  <span className="font-semibold text-white">{service.deliveryTime}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-mono">A partir de</span>
                  <span className="font-mono text-sm font-bold text-white">{service.basePrice.toLocaleString()} MT</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Budget Simulator Widget */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden lg:block">
          <Smartphone className="h-56 w-56 text-[#22d3ee]" />
        </div>

        <div className="relative space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="inline-block px-2 py-0.5 bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[10px] font-mono uppercase rounded mb-2">
              Ferramenta Comercial Local Exclusiva
            </span>
            <h3 className="text-xl font-display font-bold text-white">
              Simulador Integrado de Orçamentos Digitais
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Escolha os serviços desejados na listagem de cartões acima. Preencha os seus dados de contacto abaixo e envie uma proposta detalhada contendo o orçamento exato para a Netek via WhatsApp imediatamente. Evite o "preço sob consulta"!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-305 font-medium mb-1.5" htmlFor="client-name">
                  O Seu Nome ou Nome da Empresa *
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="Ex: João Tembe ou Mercearia do Sol"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-505 focus:outline-none focus:border-[#22d3ee] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-305 font-medium mb-1.5" htmlFor="client-province">
                    Província de Moçambique
                  </label>
                  <select
                    id="client-province"
                    value={clientProvince}
                    onChange={(e) => setClientProvince(e.target.value)}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-[#22d3ee] transition appearance-none cursor-pointer"
                  >
                    <option value="Maputo">Maputo</option>
                    <option value="Gaza">Gaza</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Sofala">Sofala</option>
                    <option value="Manica">Manica</option>
                    <option value="Tete">Tete</option>
                    <option value="Zambézia">Zambézia</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Cabo Delgado">Cabo Delgado</option>
                    <option value="Niassa">Niassa</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUrgent(!customUrgent);
                    }}
                    className={`w-full border rounded-xl py-3 px-1 text-center font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      customUrgent
                        ? 'bg-amber-500/10 border-amber-500/80 text-amber-300'
                        : 'bg-[#05070a] border-white/10 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {customUrgent ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span>Projecto Urgente (+20%)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculations Dashboard summary */}
            <div className="bg-[#05070a] p-4 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wide">Orçamento Resumido</span>
                <div className="space-y-2 mt-2">
                  {selectedServices.map(id => {
                    const ser = SERVICES_DATA.find(s => s.id === id);
                    if (!ser) return null;
                    return (
                      <div key={id} className="flex justify-between text-xs">
                        <span className="text-slate-300 truncate max-w-[180px]">{ser.title}</span>
                        <span className="font-mono text-slate-200">{ser.basePrice.toLocaleString()} MT</span>
                      </div>
                    );
                  })}
                  {customUrgent && (
                    <div className="flex justify-between text-xs text-amber-400 font-semibold border-t border-white/10 pt-1.5">
                      <span>Taxa de Urgência</span>
                      <span>+20%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 mt-3 flex items-end justify-between">
                <div>
                  <span className="block text-[10px] text-slate-450 font-mono uppercase">Total Estimado</span>
                  <span className="text-xl font-display font-extrabold text-[#22d3ee]">{finalTotal.toLocaleString()} MT</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Sem custos ocultos</span>
              </div>
            </div>
          </div>

          {/* Action Call for Whatsapp */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <span className="flex-shrink-0 w-5 h-5 bg-[#c084fc]/10 text-[#c084fc] rounded-full flex items-center justify-center font-bold">!</span>
              <p>
                Este orçamento é gerado instantaneamente na moeda local (Meticais). Ao carregar abaixo, irá abrir um canal seguro de atendimento direto para o seu WhatsApp pessoal.
              </p>
            </div>

            <a
              href={getSimulatedWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className={`w-full sm:w-auto px-6 py-3.5 bg-[#22d3ee] text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-cyan-500/20 ${
                !clientName ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <span>Submeter Proposta via WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          {!clientName && (
            <p className="text-[10px] text-amber-400 font-mono text-right">
              ⚠️ Introduza o seu Nome/Empresa acima para ativar o botão de submissão do WhatsApp.
            </p>
          )}
        </div>
      </div>

      {/* Mozambique Connective Services Details FAQ */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Perguntas Frequentes sobre os Nossos Serviços</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
          <div className="space-y-2 p-3 bg-[#05070a] rounded-xl border border-white/5">
            <h4 className="font-bold text-white">Como é feito o pagamento dos serviços?</h4>
            <p className="text-slate-405">
              Inicia com um sinal de 50% após adjudicação e aprovação técnica da proposta e 50% no ato de entrega e formação técnica. Aceitamos transferência bancária, M-Pesa ou e-Mola diretamente.
            </p>
          </div>
          <div className="space-y-2 p-3 bg-[#05070a] rounded-xl border border-white/5">
            <h4 className="font-bold text-white">Não percebo nada de código, vou conseguir gerir o site?</h4>
            <p className="text-slate-405">
              Sim! Todas as nossas soluções vêm acompanhadas por uma mini-formação em vídeo de 20 minutos focada na administração, explicando-lhe como mudar textos, produtos e observar contactos de forma simples.
            </p>
          </div>
        </div>
      </div>

      {/* Modal segment for Portal facilitation consulting request */}
      {consultingModalOpen && selectedPortalForConsult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1118]/95 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#05070a]/80">
              <div className="flex items-center gap-2 text-[#22d3ee]">
                <CalendarDays className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm text-white">Assistência Técnica Fiduciária</span>
              </div>
              <button
                onClick={() => setConsultingModalOpen(false)}
                className="text-slate-405 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!consultingSuccess ? (
                <form onSubmit={handlePortalConsultSubmit} className="space-y-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[10px] font-mono text-[#c084fc] block uppercase font-bold">{selectedPortalForConsult.acronym}</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      A nossa equipa opera fiduciariamente quando o portal estiver instável para si. Preencha os dados e geraremos toda a sua candidatura técnica!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-405 mb-1">O Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome Sobrenome"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1">Contacto de Telemóvel (M-Pesa/e-Mola) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 84 / 85 / 87 XXXXXXX"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1">Instruções Extra ou Erro que deparou no portal</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Não consigo gerar a Guia do NUIT ou carregar documentos..."
                      value={extraInstructions}
                      onChange={(e) => setExtraInstructions(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee] resize-none"
                    ></textarea>
                  </div>

                  <div className="p-2.5 bg-[#05070a] rounded-lg border border-white/5 text-[9px] font-mono text-slate-400">
                    💡 <strong>Taxa Simbólica:</strong> A Netek cobrará uma pequena taxa administrativa de facilitação por agendamento via operadoras nacionais móveis.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#22d3ee] text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-cyan-400 transition duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-cyan-500/15"
                  >
                    <span>Submeter Pedido de Facilitação</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="py-4 text-center space-y-4">
                  <div className="h-10 w-10 bg-emerald-500/5 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">Pedido Recebido!</h4>
                    <p className="text-xs text-slate-405 max-w-sm mx-auto leading-relaxed mt-1">
                      Tudo pronto! Carregue abaixo para abrir a ligação direta ao WhatsApp técnico preenchido e daremos seguimento ao seu agendamento biométrico imediatamente.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={getWhatsAppPortalConsultLink(selectedPortalForConsult)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Conversar no WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setConsultingModalOpen(false)}
                      className="text-xs text-slate-500 hover:text-white font-bold uppercase mt-1 tracking-wider cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
