import React, { useState } from 'react';
import { Globe, ArrowUpRight, RefreshCw, Layers, ShieldCheck, Heart, Sparkles, Smartphone, Award } from 'lucide-react';

export default function KayaMozView() {
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12 select-none">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-[#22d3ee] mb-2">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest font-black">Ecossistema Integração Parceiro</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          KayaMoz: Habitação & Conectividade Integrada
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl leading-relaxed">
          O **KayaMoz** é uma iniciativa moçambicana transformadora, que redefine o ecossistema de acesso à habitação, arrendamento, mapeamento residencial e conectividade. Integrado diretamente na Netek Services para maximizar o empoderamento técnico e pessoal do cidadão.
        </p>
      </div>

      {/* Intro Partnership Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/20 transition group">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-[#22d3ee] group-hover:bg-[#22d3ee] group-hover:text-slate-950 transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Ecossistema Unificado</h3>
            <p className="text-xs text-slate-405 leading-relaxed">
              O KayaMoz visa fundir a inteligência imobiliária com facilidades tecnológicas, permitindo aos usuários encontrar espaços com conexões de dados rápidas recomendadas pela Netek.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-4 block">Parceria Estratégica Ativa</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-purple-500/20 transition group">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-[#c084fc] group-hover:bg-[#c084fc] group-hover:text-slate-950 transition-colors">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Acesso Descomplicado</h3>
            <p className="text-xs text-slate-405 leading-relaxed">
              Consulte listagens residenciais, planos de urbanização locais e tutoriais habitacionais em tempo recorde utilizando a interface otimizada para baixíssimo consumo de megas.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-4 block">100% Otimizado Para Telemóvel</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition group bg-gradient-to-br from-emerald-500/[0.02] to-transparent">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Ativação de Direitos</h3>
            <p className="text-xs text-slate-405 leading-relaxed">
              Selo de autenticidade tecnológica: O KayaMoz promove inovação social desenhada e desenvolvida para responder às prioridades estruturais moçambicanas.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#22d3ee] mt-4 block">Autoridade Parceira Oficial</span>
        </div>
      </div>

      {/* Browser Simulator Frame containing the Live Iframe */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono text-slate-400">Ligação Integrada: <strong className="text-white">https://jonsonjb.github.io/kayamoz/page1</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto self-end">
            <button
              onClick={handleRefresh}
              className="p-2 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl transition text-slate-300 font-bold text-[10px] flex items-center gap-1.5 cursor-pointer"
              title="Recarregar KayaMoz"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Recarregar</span>
            </button>

            <a
              href="https://jonsonjb.github.io/kayamoz/page1"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#22d3ee] hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-sm hover:scale-105 transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/15"
            >
              <span>Abrir Numa Nova Aba</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Browser Mock Frame */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d1118]/80 shadow-2xl">
          {/* Top Address Bar simulator */}
          <div className="bg-[#05070a] border-b border-white/10 px-4 py-3.5 flex items-center gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
            </div>
            
            <div className="flex-grow bg-[#0c0f16] border border-white/10 rounded-lg px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-350 select-text font-sans">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-[10px] font-mono">🔒 SECURE</span>
                <span className="text-slate-400">https://jonsonjb.github.io/kayamoz/page1</span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono">HTML5 / CSS / JS</span>
            </div>
          </div>

          {/* Actual content inside */}
          <div className="relative w-full aspect-[4/3] max-h-[600px] overflow-hidden bg-slate-900 border-none">
            <iframe
              key={iframeKey}
              src="https://jonsonjb.github.io/kayamoz/page1"
              title="KayaMoz Live Frame integration"
              referrerPolicy="no-referrer"
              className="w-full h-full border-none rounded-b-xl"
              style={{ minHeight: '520px' }}
            ></iframe>
          </div>
        </div>

        {/* Notice of Frame policies */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 text-amber-300 rounded-xl text-xs flex items-start gap-3 leading-relaxed">
          <span className="font-bold text-sm shrink-0">⚠️</span>
          <div>
            <strong>Nota de Compatibilidade:</strong> Se verificar que a janela do KayaMoz acima se mantém em branco, isto deve-se às restrições de segurança de iFrames ativas no seu navegador para ligações de origens externas. Carregue no botão <strong>"Abrir Numa Nova Aba"</strong> acima para navegar livremente sem impedimentos de rede!
          </div>
        </div>
      </div>
    </div>
  );
}
