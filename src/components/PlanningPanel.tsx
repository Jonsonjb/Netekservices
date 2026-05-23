import React, { useState } from 'react';
import { THEORETICAL_PLAN } from '../data';
import { Palette, Type, Volume2, LayoutGrid, FileText, Smartphone, CreditCard, CheckCircle2, Copy, Sparkles, BookOpen } from 'lucide-react';

export default function PlanningPanel() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="space-y-12">
      {/* Intro header inside planning */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center space-x-2 text-[#22d3ee] mb-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-mono uppercase tracking-widest">Documento de Engenharia UX & UI</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Planeamento Estratégico & Design System
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl leading-relaxed">
          Esta proposta foi estruturada especificamente para responder às necessidades de conectividade, acessibilidade e transações no ecossistema moçambicano. Abaixo encontra o blueprint de implementação e identidade da Netek Services.
        </p>
      </div>

      {/* 1. Identidade Visual e Design System */}
      <section id="doc-identidade" className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Palette className="h-40 w-40 text-[#c084fc]" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#c084fc]/10 text-[#c084fc] rounded-lg">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#c084fc] uppercase tracking-wider">Mapeamento Técnico</span>
            <h3 className="text-xl font-display font-semibold text-white">1. Identidade Visual & Design System</h3>
          </div>
        </div>

        {/* Cores */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-slate-200 mb-3 border-l-2 border-[#c084fc] pl-2">
            Paleta de Cores de Alta Conversão (WCAG Contrast Config)
          </h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Desenvolvida para máxima legibilidade sob luz solar e otimização de uso de dados em Moçambique. Toque numa cor para copiar o seu código HEX.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {THEORETICAL_PLAN.identidadeVisual.cores.map((c) => (
              <button
                key={c.hex}
                onClick={() => copyToClipboard(c.hex)}
                className="group relative flex flex-col items-start p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition"
              >
                <div 
                 className="w-full h-12 rounded-lg mb-2 relative transition duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundColor: c.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 bg-black/40 rounded-lg">
                    <Copy className="h-4 w-4 text-white" />
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-white flex items-center justify-between w-full">
                  {c.hex}
                  {copiedColor === c.hex && (
                    <span className="text-[10px] text-[#22d3ee] font-sans font-normal animate-pulse">Copiado!</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-300 font-semibold mt-1 leading-tight">{c.role}</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-snug">{c.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tipografia */}
        <div className="mb-8 border-t border-white/5 pt-6">
          <h4 className="text-sm font-semibold text-slate-200 mb-3 border-l-2 border-[#c084fc] pl-2">
            Tipografia Fluída para Mobile (Infinix, Tecno, Itel & Samsung Setup)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-[#c084fc]">
                <Type className="h-4 w-4" />
                <span className="text-xs font-semibold">Títulos de Secção</span>
              </div>
              <p className="font-display text-lg font-bold text-white mb-1">
                Space Grotesk
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {THEORETICAL_PLAN.identidadeVisual.tipografia.familiaDisplayDesc}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-[#c084fc]">
                <Type className="h-4 w-4" />
                <span className="text-xs font-semibold">Leitura e Textos</span>
              </div>
              <p className="font-sans text-lg font-medium text-white mb-1">
                Inter Sans-serif
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {THEORETICAL_PLAN.identidadeVisual.tipografia.familiaPrincipalDesc}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-[#c084fc]">
                <Type className="h-4 w-4" />
                <span className="text-xs font-semibold">Indicadores Métricos</span>
              </div>
              <p className="font-mono text-lg font-medium text-white mb-1">
                JetBrains Mono
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {THEORETICAL_PLAN.identidadeVisual.tipografia.familiaMonoDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Tom de Voz */}
        <div className="border-t border-white/5 pt-6">
          <h4 className="text-sm font-semibold text-slate-200 mb-3 border-l-2 border-[#c084fc] pl-2 flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-[#c084fc] animate-pulse" />
            Tom de Voz da Netek em Moçambique
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEORETICAL_PLAN.identidadeVisual.tomDeVoz.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <h5 className="text-xs font-bold text-[#22d3ee] mb-1">{item.titulo}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Arquitetura de Páginas */}
      <section id="doc-arquitectura" className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <LayoutGrid className="h-40 w-40 text-[#22d3ee]" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-lg">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#22d3ee] uppercase tracking-wider">Estruturação de Sistema</span>
            <h3 className="text-xl font-display font-semibold text-white">2. Arquitetura de Páginas & Fluxo de Navegação</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Homepage */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Homepage (Fluxo de Cima para Baixo)</span>
              <span className="text-[10px] text-[#22d3ee] font-mono">6 Zonas de Interação</span>
            </h4>
            <div className="space-y-2">
              {THEORETICAL_PLAN.arquitecturaPaginas.homepage.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-[#05070a] rounded-lg border border-white/5 text-xs">
                  <span className="text-[#22d3ee] font-mono font-bold select-none">{idx + 1}</span>
                  <div>
                    <strong className="text-slate-200">{h.sec}</strong>
                    <p className="text-slate-400 mt-0.5">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subpages logic */}
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5 text-slate-350" />
                Aba: Serviços de Internet
              </h4>
              <p className="text-xs text-slate-350 leading-relaxed">
                {THEORETICAL_PLAN.arquitecturaPaginas.servicosInternet}
              </p>
              <div className="mt-3 p-2 bg-[#c084fc]/5 rounded border border-[#c084fc]/20 text-[10px] text-slate-300 leading-tight">
                💡 <strong>Estratégia UX:</strong> Removemos "preços sob consulta" genéricos. O utilizador sabe no momento o custo estimado e envia na hora via WhatsApp.
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-slate-350" />
                Aba: Blog / Tutoriais
              </h4>
              <p className="text-xs text-slate-350 leading-relaxed">
                {THEORETICAL_PLAN.arquitecturaPaginas.blogTutoriais}
              </p>
              <div className="mt-3 p-2 bg-emerald-500/5 rounded border border-emerald-500/10 text-[10px] text-slate-300 leading-tight">
                🚀 <strong>Estratégia Técnica:</strong> Conteúdo servido em compressão extrema para evitar consumo desnecessário de megas.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Estrutura Detalhada da Aba "Cursos" */}
      <section id="doc-cursos" className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <BookOpen className="h-40 w-40 text-[#22d3ee]" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#22d3ee] uppercase tracking-wider">Estrutura Pedagógica</span>
            <h3 className="text-xl font-display font-semibold text-white">3. Especificações da Aba "Cursos"</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-1.5">
              Diretrizes do Layout Tecnológico
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {THEORETICAL_PLAN.estruturaCursos.layout}
            </p>
            <div className="p-3 bg-[#05070a] rounded-lg border border-white/10">
              <span className="text-xs font-bold text-[#22d3ee]">Diferenciação Grátis vs Pago:</span>
              <p className="text-[11px] text-slate-400 mt-1">
                {THEORETICAL_PLAN.estruturaCursos.organizacaoCursos}
              </p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-1.5 flex items-center gap-1.5">
              <span>Atributos Obrigatórios por Curso</span>
              <span className="text-[10px] text-zinc-450 font-mono">4 Pilares da Informação</span>
            </h4>
            <div className="space-y-3">
              {THEORETICAL_PLAN.estruturaCursos.elementosPorCurso.map((el, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-mono flex items-center justify-center font-bold">
                    {i+1}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white">{el.item}</h5>
                    <p className="text-[11px] text-slate-400 leading-snug">{el.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Logística Local e Conversão */}
      <section id="doc-logistica" className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <CreditCard className="h-40 w-40 text-[#c084fc]" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#c084fc]/10 text-[#c084fc] rounded-lg">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#c084fc] uppercase tracking-wider">Integração Financeira</span>
            <h3 className="text-xl font-display font-semibold text-white">4. Logística Moçambicana & Funil de Fecho</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp WhatsApp WhatsApp */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-xs font-bold text-[#22d3ee] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <Smartphone className="h-4 w-4" />
              Interação Rápida via WhatsApp Link
            </h4>
            <div className="space-y-3">
              {THEORETICAL_PLAN.logisticaConversao.whatsapp.map((w, index) => (
                <div key={index} className="p-2.5 bg-[#05070a] rounded-lg border border-white/5">
                  <span className="text-[10px] font-mono font-bold text-[#22d3ee] uppercase tracking-wider">{w.passo}</span>
                  <p className="text-xs text-slate-300 mt-1 font-medium">{w.texto}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagamentos Móveis e Confiança */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-xs font-bold text-[#c084fc] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <CreditCard className="h-4 w-4" />
              Desenho Fiduciário: Carteiras de Moçambique
            </h4>
            <div className="space-y-3">
              {THEORETICAL_PLAN.logisticaConversao.pagamentosLocais.map((p, index) => (
                <div key={index} className="p-2.5 bg-[#05070a] rounded-lg border border-white/5">
                  <span className="text-xs font-semibold text-white tracking-wide">{p.canal}</span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{p.instrucoess}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Local Verification code box display */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-[#c084fc] font-semibold">Exemplo Lógico: Montagem de Link Dinâmico de Inscrição</span>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3 leading-relaxed">
            Isto garante que ao carregar no botão, a mensagem segue estruturada. O utilizador final não precisa digitar.
          </p>
          <pre className="p-3 bg-[#05070a] rounded-lg text-[10px] text-[#22d3ee] font-mono overflow-x-auto whitespace-pre border border-white/5">
{`// Função nativa para formatar mensagem de Lead sem perdas de codificação
function getWhatsAppLink(courseTitle: string, price: string) {
  const phone = '258835109190'; // Contacto oficial Netek Services Moçambique
  const template = \`Olá Netek Services, pretendo inscrever-me no curso de *"\${courseTitle}"* \` +
                   \`no valor de *\${price}*. Como posso proceder com o pagamento via M-Pesa?\\nNome: \`;
  return \`https://api.whatsapp.com/send?phone=\${phone}&text=\${encodeURIComponent(template)}\`;
}`}
          </pre>
        </div>
      </section>

      {/* Trust Certification footer */}
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <span>
          <strong>UX/UI Validado:</strong> Todo o planeamento técnico e visual acima está 100% implementado de forma operacional no simulador interativo no separador ao lado. Explore as abas acima para testar o comportamento prático em tempo real!
        </span>
      </div>
    </div>
  );
}
