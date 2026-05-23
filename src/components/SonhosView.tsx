import React, { useState } from 'react';
import { Sparkles, Search, BookOpen, AlertCircle, Moon, CheckCircle, Sunrise, Eye, Send, Hourglass } from 'lucide-react';

interface DreamMeaning {
  title: string;
  category: string;
  meaning: string;
  symbolism: string;
  provenceTradition: string; // Cultural regional reference in Mozambique
}

const DREAM_DATABASE: DreamMeaning[] = [
  {
    title: 'Peixe',
    category: 'Prosperidade e Trabalho',
    meaning: 'Sinal clássico de fartura e fartura financeira. Se sonhar pescando no Canal de Moçambique ou limpando peixe, indica que o fruto do seu trabalho honesto nas pescas, vendas ou escritórios trará lucros substanciais nos próximos meses.',
    symbolism: 'Água fértil, renovação e sustento alimentar familiar abundante.',
    provenceTradition: 'Tradição costeira de Inhambane, Sofala e Pemba'
  },
  {
    title: 'Água Limpa',
    category: 'Espiritualidade',
    meaning: 'Indica purificação interior, paz na família, caminhos totalmente limpos e abertos para novas iniciativas e negócios locais sem obstáculos políticos ou burocráticos.',
    symbolism: 'Transparência, bênção divina dos antepassados, saúde estável.',
    provenceTradition: 'Tradição geral das Províncias de Gaza e Maputo'
  },
  {
    title: 'Água Turva ou Lama',
    category: 'Espiritualidade e Cuidado',
    meaning: 'Alerta sobre conspirações no local de trabalho ou desentendimentos familiares na sua aldeia natal. Pode indicar que é hora de fazer o "M’phahla" (homenagem aos ancestrais) ou fazer uma visita de cortesia aos pais e anciãos da família no campo.',
    symbolism: 'Dúvidas, caminhos temporariamente fechados, mexericos à espreita.',
    provenceTradition: 'Sabedoria das províncias interiores de Tete e Niassa'
  },
  {
    title: 'Serpente / Cobra',
    category: 'Alerta e Cuidado',
    meaning: 'Alerta solene de intrigas e olhares invejosos de pessoas próximas. Tenha extrema cautela ao partilhar notícias de suas poupanças ou lucros de M-Pesa. Alguém no seu círculo de amizades age de forma falsa.',
    symbolism: 'Traição dissimulada, perigo silencioso ou inteligência maliciosa.',
    provenceTradition: 'Conselho tradicional do Planalto de Manica e Chimoio'
  },
  {
    title: 'Dinheiro',
    category: 'Prosperidade e Trabalho',
    meaning: 'Contrariamente ao senso comum, sonhar com dinheiro fácil ou achado no chão é um aviso de advertência para desconfiar de esquemas fáceis, falsas promessas de emprego rápido e burlas telefónicas ("burlas de e-Mola"). Simboliza que a verdadeira riqueza virá do estudo e dedicação na Netek.',
    symbolism: 'Tentação, cuidado com a ganância ou necessidade de honestidade financeira.',
    provenceTradition: 'Conselhos urbanos de Maputo e Matola'
  },
  {
    title: 'Fogo e Chamas',
    category: 'Sentimentos e Mudança',
    meaning: 'Representa momentos de fortes emoções, paixões arrebatadoras ou discussões de altíssima tensão na vizinhança que podem comprometer o seu estabelecimento comercial. Exige paciência e cabeça fria ao lidar com críticas.',
    symbolism: 'Destruição purificadora, temperamento explosivo ou calor protetor.',
    provenceTradition: 'Sabedoria das Zonas de Zambézia e Quelimane'
  },
  {
    title: 'Casamento ou Festa',
    category: 'Mudança Social',
    meaning: 'Indica transição profunda no círculo social. Se a festa for jubilosa e cheia de capulanas vibrantes, pressagia novas alianças comerciais e amizades sinceras. Se a atmosfera for soturna ou cinzenta, sugere a necessidade de apoiar um vizinho em dificuldades de luto.',
    symbolism: 'Laços comunitários, rituais sagrados de união e herança social.',
    provenceTradition: 'Tradição Matriarcal de Nampula (Cultura Macua)'
  },
  {
    title: 'Voar ou Flutuar',
    category: 'Espiritualidade e Sucesso',
    meaning: 'Presságio glorioso de elevação profissional e superação de todas as barreiras físicas que atrasam a sua vida. Você conseguirá ultrapassar as dificuldades de conectividade digital e se destacar nos estudos de Inteligência Artificial com louvor.',
    symbolism: 'Liberdade mental, proteção espiritual e voo em direção ao desenvolvimento.',
    provenceTradition: 'Sabedoria ancestral das Terras Altas de Cabo Delgado'
  }
];

export default function SonhosView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamMeaning | null>(null);
  
  // Custom interpretation input fields
  const [customDream, setCustomDream] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedInterpretation, setGeneratedInterpretation] = useState<string | null>(null);
  const [interpretationType, setInterpretationType] = useState<'anciãos' | 'ia'>('anciãos');

  const filteredDatabase = DREAM_DATABASE.filter(dream =>
    dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dream.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dream.provenceTradition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchClick = (dream: DreamMeaning) => {
    setSelectedDream(dream);
    // Autofill text area
    setCustomDream(`Sonhei com ${dream.title.toLowerCase()}...`);
    setGeneratedInterpretation(null);
  };

  const handleManualInterpretInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDream.trim()) return;

    setIsAnalyzing(true);
    setGeneratedInterpretation(null);

    // Dynamic, high-fidelity Mozambique context simulation
    setTimeout(() => {
      const dreamLower = customDream.toLowerCase();
      let response = '';
      
      if (dreamLower.includes('mar') || dreamLower.includes('oceano') || dreamLower.includes('praia') | dreamLower.includes('pesca')) {
        response = `### Revelação das Correntes do Índico 🌊\n\nPresenciamos na vossa visão o mar moçambicano, que representa imensidão financeira. \n\n**O Conselho do Ancião:** A sua vida está a entrar num fluxo de maré alta. Não tenha receio de deitar as redes nos estudos de tecnologia. Assim como os pescadores da Beira e da Costa do Sol acordam cedo com resiliência, o vosso esforço atual em capacitação digital trará fartura para sustentar toda a vossa família. Kanimambo!`;
      } else if (dreamLower.includes('chuva') || dreamLower.includes('tempestade') || dreamLower.includes('vento')) {
        response = `### Sabedoria dos Ventos do Canal ⛈️\n\nA chuva é sagrada no sul e norte de Moçambique, pois rega os campos de milho e feijão nhemba. No entanto, se houve ventania, simboliza agitação mental.\n\n**O Conselho do Ancião:** Limpe a poeira das preocupações. A tempestade aponta para faturas pendentes ou instabilidade de dados. Use a calma e a paciência nas parcerias profissionais. Após a grande chuva, a terra moçambicana sempre floresce fértil e verdejante. Confie nos vossos tutores!`;
      } else if (dreamLower.includes('escola') || dreamLower.includes('computador') || dreamLower.includes('livro') || dreamLower.includes('estudar') || dreamLower.includes('telefone')) {
        response = `### O Chamado da Capulana Tecnológica 💻\n\nSonhar com ferramentas de ciência, luzes ou partilhas aponta para um forte e vibrante desejo de autossuficiência intelectiva.\n\n**O Conselho do Ancião:** Este sonho é um incentivo direto dos antepassados que prezavam o conhecimento. Você está no caminho certo ao navegar pelo portal Netek Services. Insista na persistência das aulas de IA do ChatGPT e formatação. A tecnologia será a vossa maior caneta para reescrever a história financeira da vossa família. Não desista!`;
      } else {
        response = `### Parecer e Conselho do Ancião da Beira e Limpopo 🌳\n\nA vossa visão contém fragmentos misteriosos que exigem foco e retidão. Na sabedoria moçambicana, o sono limpa o cansaço para deixar a intuição guiar as escolhas acordadas.\n\n**O Conselho do Ancião:** Proteja os seus ouvidos de maus conselhos e mantenha o seu coração humilde e focado no progresso local. Trabalhe com afinco, evite o desvio de caminhos fáceis oferecidos por desconhecidos e continue auxiliando os seus que necessitam de apoio de BI, cartas ou estudos nas províncias. A boa conduta sempre colhe orvalho fresco de manhã!`;
      }

      setGeneratedInterpretation(response);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-12 select-none animate-fadeIn">
      
      {/* View Header with Mozambique Theme */}
      <div className="border-b border-white/5 pb-6 text-left">
        <div className="flex items-center gap-2 text-[#fecc4c] mb-2">
          <Moon className="h-4.5 w-4.5 animate-pulse text-[#fecc4c]" />
          <span className="text-xs font-mono uppercase tracking-widest font-black">Património e Cultura de Moçambique</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Interpretador de Sonhos & Sabedoria Tradicional 🇲🇿
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
          Os sonhos em Moçambique carregam mensagens solenes das nossas origens e espiritualidades. Explore o nosso diretório cultural de significados ou relate a sua visão noturna para receber um aconselhamento moldado pela inteligência tradicional dos nossos anciãos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Cultural database search and interactive list */}
        <div className="lg:col-span-7 bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-5 text-left">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3b3b4f] pb-3">
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#fecc4c] uppercase flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>Arquivo de Símbolos Populares</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Clique nas palavras chaves para preencher no conselheiro automático.</p>
            </div>
            
            {/* Search Input inline */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2 text-slate-400 h-3.5 w-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Pesquisar símbolo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a23] border border-[#3b3b4f] text-[11px] rounded-none pl-7 pr-2.5 py-1.5 placeholder-slate-500 text-white focus:outline-none focus:border-[#fecc4c] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredDatabase.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleSearchClick(item)}
                className={`p-4 rounded-none cursor-pointer border transition duration-200 text-left relative ${
                  selectedDream?.title === item.title 
                    ? 'bg-[#3b3b4f] border-[#fecc4c]' 
                    : 'bg-[#0a0a23] border-[#3b3b4f] hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block"></span>
                    {item.title}
                  </h5>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 bg-black/40 text-[#fecc4c] border border-[#fecc4c]/10 rounded-sm uppercase font-bold">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                  {item.meaning}
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 text-[8.5px] font-mono text-[#10b981]">
                  🎯 {item.provenceTradition}
                </div>
              </div>
            ))}

            {filteredDatabase.length === 0 && (
              <div className="p-8 text-center col-span-2 text-slate-500 text-xs italic">
                Nenhum símbolo moçambicano correspondente na nossa base local. Experimente relatar o vosso sonho detalhadamente à direita!
              </div>
            )}
          </div>

          {/* Quick cultural note */}
          <div className="p-4 bg-[#0a0a23] text-[10px] text-slate-400 border border-[#3b3b4f] flex gap-2.5 leading-relaxed font-mono">
            <AlertCircle className="h-5 w-5 text-[#fecc4c] flex-shrink-0" />
            <span>
              <strong>Nota de Integridade:</strong> A interpretação local não substitui a vossa fé pessoal ou doutrina religiosa, mas serve para honrar as metáforas que sustentam a resiliência e a moral coletiva das nossas comunidades na Beira, Maxixe, Xai-Xai, Maputo e Matola.
            </span>
          </div>

        </div>

        {/* Right column: Interactive Conselheiro de Sonhos AI Parser */}
        <div className="lg:col-span-5 bg-[#1b1b32] border border-[#3b3b4f] p-5 rounded-none space-y-5 text-left">
          
          <div className="border-b border-[#3b3b4f] pb-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#fecc4c] uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#fecc4c] animate-bounce" />
              <span>Conselheiro de Sonhos Virtual</span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Insira o seu relato e consulte a leitura dos anciãos moçambicanos.</p>
          </div>

          <form onSubmit={handleManualInterpretInput} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">O que você viu ou sonhou? *</label>
              <textarea
                value={customDream}
                onChange={(e) => {
                  setCustomDream(e.target.value);
                  setGeneratedInterpretation(null);
                }}
                required
                rows={4}
                placeholder="Exemplo: Sonhei que estava pescando peixes gigantes no mar em frente à baía de Maputo com o meu falecido avô, e a água estava muito azul e calma..."
                className="w-full bg-[#0a0a23] border border-[#3b3b4f] rounded-none p-3.5 text-xs text-white focus:outline-none focus:border-[#fecc4c] font-sans placeholder-slate-500 leading-normal"
              />
              <span className="block text-[9px] text-slate-550 mt-1 font-mono text-right">Por favor, escreva em português ou use expressões moçambicanas comuns.</span>
            </div>

            {/* Submit Action Block */}
            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={isAnalyzing || !customDream.trim()}
                className="flex-1 py-3 bg-[#fecc4c] hover:bg-[#ff9c0a] disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-wide transition flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Hourglass className="h-4 w-4 animate-spin" />
                    <span>Conferindo com Anciãos...</span>
                  </>
                ) : (
                  <>
                    <Sunrise className="h-4 w-4" />
                    <span>Interpretar Sonho 🇲🇿</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setCustomDream('');
                  setGeneratedInterpretation(null);
                  setSelectedDream(null);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-none text-xs border border-transparent hover:border-[#3b3b4f]"
                title="Limpar formulário"
              >
                Limpar
              </button>
            </div>
          </form>

          {/* Results display area */}
          {(isAnalyzing || generatedInterpretation) && (
            <div className="p-5 bg-[#0a0a23] border border-[#3b3b4f] rounded-none animate-fadeIn text-left space-y-3.5">
              
              {isAnalyzing ? (
                <div className="py-8 text-center space-y-2.5">
                  <div className="h-2 w-16 bg-[#fecc4c] rounded-full mx-auto animate-pulse"></div>
                  <p className="text-xs text-slate-400 font-mono italic">"Reunindo conselhos de Cabo Delgado a Maputo..."</p>
                </div>
              ) : generatedInterpretation ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-mono text-slate-400">
                    <span className="text-[#fecc4c] uppercase font-bold tracking-wider">Laudo Geral de Leitura</span>
                    <span>Conselho Concluído</span>
                  </div>
                  
                  {/* Clean text formatting */}
                  <div className="text-xs text-slate-200 leading-relaxed font-sans space-y-3.5">
                    {generatedInterpretation.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('###')) {
                        return (
                          <h4 key={index} className="text-xs font-bold text-[#fecc4c] uppercase tracking-wide border-l-2 border-[#10b981] pl-2 mt-4 font-mono">
                            {paragraph.replace('###', '').trim()}
                          </h4>
                        );
                      }
                      return (
                        <p key={index} className="italic text-slate-300">
                          {paragraph.replace(/\*\*/g, '').trim()}
                        </p>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>Aconselhador Netek v2.6.2</span>
                    <span className="text-[#10b981]">✓ Atendido por Ancião Tradicional</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
