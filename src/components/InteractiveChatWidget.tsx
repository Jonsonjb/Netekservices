import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, Smartphone, Sparkles, AlertCircle, Laptop, HelpCircle } from 'lucide-react';

export default function InteractiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: 'Olá! Bem-vindo ao Chat de Apoio em Tempo Real da Netek Services! 🇲🇿',
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'init-2',
      sender: 'agent',
      text: 'Eu sou o Isaías, o teu assistente técnico. Como posso te apoiar hoje? Posso ajudar com a criação do teu CV, ativação de modelos de cartas, inscrições em cursos de IA, ou dúvidas de conectividade.',
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages show up
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const cleanText = inputText.toLowerCase();
    setInputText('');

    // Trigger typing simulation
    setIsTyping(true);

    setTimeout(() => {
      let replyText = 'Entendido! Estou a preparar a vossa resposta de suporte. Gostaria de saber que as nossas taxas básicas de elaboração profissional para CV são de 250 MT e para as Cartas são de 150 MT, pagáveis via M-Pesa (8401666592), e-Mola (874786943) ou mKesh (835109190). Quer que eu lhe transfira diretamente para o WhatsApp do nosso orientador oficial?';

      if (cleanText.includes('olá') || cleanText.includes('bom dia') || cleanText.includes('boa tarde') || cleanText.includes('boa noite') || cleanText.includes('oi')) {
        replyText = 'Viva! Saudações da Netek Services. Como vai a sua jornada de estudos ou trabalho hoje? Em que sector da nossa consultoria gostaria de progredir?';
      } else if (cleanText.includes('cv') || cleanText.includes('curriculum') || cleanText.includes('currículo') || cleanText.includes('trabalho') || cleanText.includes('emprego')) {
        replyText = 'Maravilha! Pode elaborar os seus dados do CV de forma totalmente gratuita agora mesmo clicando na nova aba "Gerador de CV & Cartas" no topo do site. O preenchimento demora menos de 5 minutos, e gera um rascunho completo que enviamos por e-mail ou WhatsApp!';
      } else if (cleanText.includes('carta') || cleanText.includes('candidatura') || cleanText.includes('solicitação') || cleanText.includes('director')) {
        replyText = 'Excelente iniciativa! Cartas de apresentação profissional são o segredo para conseguir deferimento em Moçambique. Temos uma ferramenta de automação na aba "Gerador de CV & Cartas". Gostaria que eu lhe ajudasse a preencher?';
      } else if (cleanText.includes('preço') || cleanText.includes('quanto custa') || cleanText.includes('pagamento') || cleanText.includes('mpesa') || cleanText.includes('m-pesa') || cleanText.includes('meticais') || cleanText.includes('emola') || cleanText.includes('e-mola')) {
        replyText = 'As nossas taxas de assessoria técnica são extremamente populares em Moçambique! A formatação de um CV personalizado profissional custa 250 MT, as Cartas formais 150 MT, e temos cursos de IA gratuitos. Aceitamos pagamentos via M-Pesa (8401666592), e-Mola (874786943) ou mKesh (835109190) com ativação instantânea. Pode também contactar-nos em Netekservice@gmail.com.';
      } else if (cleanText.includes('curso') || cleanText.includes('estudar') || cleanText.includes('academia') || cleanText.includes('aula') || cleanText.includes('ia') || cleanText.includes('inteligência')) {
        replyText = 'Sensacional! Nós temos a "Academia Netek" onde listamos as melhores plataformas e recursos de Inteligência Artificial recomendados de acesso gratuito e de baixo consumo móvel. Verifique a aba de "Cursos" no menu para começar o seu aprendizado de borla!';
      } else if (cleanText.includes('net') || cleanText.includes('internet') || cleanText.includes('movitel') || cleanText.includes('vodacom') || cleanText.includes('sinal') || cleanText.includes('lenta')) {
        replyText = 'Questão fundamental! A Movitel e a Vodacom detêm óptimos pacotes, mas às vezes o saldo dissipa rápido. Recomendo ler o nosso manual exclusivo na aba "Dicas IA" no topo, onde ensinamos códigos oficiais de restrição de megas em segundo plano e formatação segura!';
      }

      const sysReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, sysReply]);
      setIsTyping(false);
    }, 1500);
  };

  const getWhatsAppHistoryLink = () => {
    const phone = '258835109190';
    let summaryHistory = `*CHAT TRANSFERIDO DESDE O PROTÓTIPO NETEK SERVICES*\n\n`;
    messages.forEach((m) => {
      const prefix = m.sender === 'user' ? '👤 Cliente' : '💻 Suporte Netek';
      summaryHistory += `[${m.timestamp}] ${prefix}: ${m.text}\n`;
    });
    summaryHistory += `\nOlá Netek! Estava a conversar com o assistente inteligente no portal e gostaria de dar continuidade com o especialista humano por aqui. Kanimambo!`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(summaryHistory)}`;
  };

  return (
    <>
      {/* 1. Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-slate-950 font-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition flex items-center gap-2.5 animate-bounce group cursor-pointer"
          style={{ animationDuration: '3s' }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="h-5 w-5 text-slate-950" />
          <span className="text-xs uppercase tracking-widest font-black pr-1 hidden md:inline">Falar Online (Netek)</span>
        </button>
      )}

      {/* 2. Chat Slider-Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-[#05070a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-[#22d3ee] to-[#c084fc] rounded-full flex items-center justify-center text-white font-extrabold text-xs">
                  N
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#05070a]"></div>
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-white leading-tight">Isaías - Suporte Netek</span>
                <span className="text-[9px] uppercase font-mono text-[#22d3ee] tracking-wider block font-bold">● Supervisor On-line</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/5 border border-white/5 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-[#22d3ee]/5 border-b border-[#22d3ee]/14 px-4 py-2 flex items-center gap-2 text-[9.5px] text-slate-350">
            <AlertCircle className="h-3 w-3 text-[#22d3ee] shrink-0" />
            <span>Este é um chat fiduciário de alta fidelidade em Moçambique.</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin select-text">
            {messages.map((m) => {
              const toRight = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[82%] text-left ${toRight ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div
                    className={`px-3 py-2.5 text-xs leading-relaxed ${
                      toRight
                        ? 'bg-gradient-to-br from-[#22d3ee] to-[#0891b2] text-slate-950 font-medium rounded-2xl rounded-tr-sm'
                        : 'bg-white/5 border border-white/5 text-slate-200 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono mt-1">{m.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex flex-col items-start max-w-[80%] mr-auto">
                <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl rounded-tl-sm text-xs text-slate-450 italic flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-[#22d3ee] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>Digitando resposta técnica...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Call-to-WhatsApp Shortcut overlaying input area */}
          <div className="p-2 border-t border-white/5 bg-slate-950/80 flex flex-col gap-1 text-center">
            <a
              href={getWhatsAppHistoryLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-650 hover:text-emerald-300 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-[9px] rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mudar para WhatsApp Directo</span>
            </a>
          </div>

          {/* Form input messaging */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-900 border-t border-white/5 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Pergunte sobre CV ou Cursos..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
            />
            <button
              type="submit"
              className="p-2 bg-[#22d3ee] text-slate-950 rounded-xl hover:bg-cyan-400 active:scale-95 transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
