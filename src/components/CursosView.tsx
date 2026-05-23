import React, { useState } from 'react';
import { FreeCourseSite } from '../types';
import { BookOpen, Search, Globe, ArrowUpRight, HelpCircle, ShieldCheck, Heart, AlertCircle, Sparkles, Star, Languages, GraduationCap, CheckCircle2 } from 'lucide-react';

const FREE_SITES_DATA: (FreeCourseSite & { avatarLetter: string })[] = [
  {
    id: 's1',
    name: 'Google Atelier Digital (Skillshop)',
    provider: 'Google e Parceiros',
    description: 'Cursos altamente requisitados de Marketing Digital, Inteligência Artificial, Fundamentos de Cloud e análise de dados. Oferece certificação oficial do Google reconhecida em qualquer empresa moçambicana de excelência.',
    category: 'IA e Produtividade',
    languages: ['Português', 'Inglês'],
    disciplines: ['Fundamentos de IA', 'Marketing Digital', 'Análise de Dados', 'Google Cloud'],
    url: 'https://skillshop.exceedlms.com/student/catalog/list?category_ids=7762-google-atelier-digital',
    isPopularInMozambique: true,
    avatarLetter: 'G'
  },
  {
    id: 's2',
    name: 'freeCodeCamp',
    provider: 'Comunidade Global Sem Fins Lucrativos',
    description: 'Uma das melhores e mais completas plataformas de ensino técnico online. Oferece milhares de horas de aulas de codificação interativa 100% grátis. Você pode obter certificados construindo projetos práticos para o seu portfólio de trabalho.',
    category: 'Programação',
    languages: ['Português', 'Inglês', 'Espanhol'],
    disciplines: ['Desenvolvimento Web (React, HTML/CSS)', 'Python para Dados', 'Segurança Cibernética', 'Bases de Dados'],
    url: 'https://www.freecodecamp.org/portuguese/',
    isPopularInMozambique: true,
    avatarLetter: 'F'
  },
  {
    id: 's3',
    name: 'Coursera (Cursos Gratuitos)',
    provider: 'Principais Universidades Globais (Yale, Stanford, etc.)',
    description: 'Aceda a milhares de cursos profissionais de altíssima reputação lecionados por universidades de prestígio internacional. Embora alguns certificados exijam pagamento, é possível assistir a todas as aulas de graça ("Modo Ouvinte") ou solicitar Assistência Financeira (Financial Aid) para obter o diploma grátis.',
    category: 'Negócios & Cloud',
    languages: ['Inglês', 'Português (Legendas)', 'Francês'],
    disciplines: ['Ciência de Dados', 'Gestão de Projetos', 'Inteligência Artificial', 'Programação Avançada'],
    url: 'https://www.coursera.org/courses?query=free',
    isPopularInMozambique: true,
    avatarLetter: 'C'
  },
  {
    id: 's4',
    name: 'Khan Academy',
    provider: 'Khan Academy Foundation',
    description: 'Excelente para quem quer dominar as bases fundamentais de matemática, programação de computadores, química e economia. 100% gratuita para sempre, sem qualquer tipo de publicidade ou barreira comercial.',
    category: 'IA e Produtividade',
    languages: ['Português', 'Inglês'],
    disciplines: ['Algoritmos', 'Lógica de Programação', 'Matemática Aplicada', 'Ciências Téoricas'],
    url: 'https://pt.khanacademy.org/',
    isPopularInMozambique: false,
    avatarLetter: 'K'
  },
  {
    id: 's5',
    name: 'Microsoft Learn',
    provider: 'Microsoft Corporation',
    description: 'Perfeito para dominar as tecnologias oficiais da Microsoft como Azure, Power BI, Windows Server e ferramentas de Inteligência Artificial empresarial. Inclui caminhos de preparação completos para exames oficiais de certificação.',
    category: 'Negócios & Cloud',
    languages: ['Português', 'Inglês'],
    disciplines: ['Inteligência Artificial Generativa', 'Administração de Sistemas', 'Power Platform', 'Azure DevOps'],
    url: 'https://learn.microsoft.com/pt-pt/',
    isPopularInMozambique: true,
    avatarLetter: 'M'
  },
  {
    id: 's6',
    name: 'Harvard University Free Learning',
    provider: 'Universidade de Harvard (EUA)',
    description: 'Cursos abertos e gratuitos da prestigiada universidade americana de Harvard através da plataforma edX. Cobrem desde tópicos de programação famosos (como o CS50 - Introdução à Ciência da Computação) até humanidades e negócios.',
    category: 'Programação',
    languages: ['Inglês (Legendas)', 'Espanhol'],
    disciplines: ['CS50 Computação', 'Desenvolvimento de Jogos', 'Gestão Financeira', 'Direito e Direitos de Autor'],
    url: 'https://pll.harvard.edu/catalog/free',
    isPopularInMozambique: false,
    avatarLetter: 'H'
  },
  {
    id: 's7',
    name: 'Duolingo',
    provider: 'Duolingo Inc.',
    description: 'Sabemos que a maioria dos cursos globais avançados estão em Inglês. O Duolingo é a ferramenta mais leve e divertida do mundo para começar a compreender inglês técnico de forma gratuita. Ideal para programadores e freelancers de Moçambique que querem aceder a mercados internacionais.',
    category: 'Idiomas',
    languages: ['Português', 'Inglês'],
    disciplines: ['Inglês Técnico', 'Vocabulário Profissional', 'Gramática Prática', 'Expressões de Trabalho'],
    url: 'https://www.duolingo.com/',
    isPopularInMozambique: true,
    avatarLetter: 'D'
  },
  {
    id: 's8',
    name: 'Oracle University Training',
    provider: 'Oracle',
    description: 'Caminhos de capacitação técnica grátis para Java, Oracle Cloud Infrastructure (OCI) e bases de dados relacionais avançadas. A Oracle frequentemente lança campanhas anuais oferecendo exames de certificação oficial de forma inteiramente gratuita.',
    category: 'Negócios & Cloud',
    languages: ['Inglês', 'Espanhol'],
    disciplines: ['Programação Java', 'Oracle Cloud (OCI)', 'Bases de Dados SQL', 'Segurança de Cloud'],
    url: 'https://education.oracle.com/oracle-university-free-training',
    isPopularInMozambique: false,
    avatarLetter: 'O'
  }
];

export default function CursosView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Tutoring Request interactive forms state
  const [showTutoringModal, setShowTutoringModal] = useState(false);
  const [tutoringForm, setTutoringForm] = useState({
    name: '',
    phone: '',
    courseInterest: '',
    difficulty: 'Falta de computador próprio / internet móvel instável'
  });
  const [tutoringSubmitted, setTutoringSubmitted] = useState(false);

  // Filtered sites
  const filteredSites = FREE_SITES_DATA.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.disciplines.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || site.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleTutoringChange = (field: string, value: string) => {
    setTutoringForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTutoringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutoringForm.name || !tutoringForm.phone) return;
    setTutoringSubmitted(true);
  };

  const getWhatsAppTutoringLink = () => {
    const officialPhone = '258835109190';
    const message = `Olá Netek, gostaria de solicitar apoio de tutoria facilitadora técnica!\n` +
      `*Nome:* ${tutoringForm.name}\n` +
      `*Telefone:* ${tutoringForm.phone}\n` +
      `*Área de Interesse:* ${tutoringForm.courseInterest || 'Geral (IA / Programação)'}\n` +
      `*Principal Dificuldade:* ${tutoringForm.difficulty}\n\n` +
      `Gostava de entender como funciona o vosso modelo de acompanhamento de baixo custo em Moçambique. Kanimambo!`;
    return `https://api.whatsapp.com/send?phone=${officialPhone}&text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-12 select-none">
      
      {/* Page Header - Explaining the Facilitator Model */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-[#22d3ee] mb-2">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest font-black">Portal Facilitador Universidades Globais</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Cursos Grátis & Certificações Globais Facilitadas
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl leading-relaxed">
          <strong>A Netek Services não ministra cursos proprietários diretamente.</strong> Nós acreditamos na democratização. Facilitamos a sua vida mapeando, avaliando e indicando as melhores plataformas do mundo contendo milhares de cursos oficiais gratuitos de altíssima qualidade com selo Google, Harvard, Microsoft e Coursera.
        </p>
      </div>

      {/* Mozambique ecosystem service callout */}
      <div className="bg-gradient-to-r from-purple-500/5 to-[#22d3ee]/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c084fc]/15 text-[#c084fc] text-[10px] font-mono uppercase rounded-full border border-[#c084fc]/20">
            <Star className="h-3 w-3 fill-current" /> Dificuldades em Estudar Sozinho?
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">Oferecemos Tutoria e Facilitação Local</h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Muitos destes portais excelentes estão em inglês, exigem verificação complexa ou requerem computadores para os exercícios. <strong>A equipa Netek atua de forma fiduciária:</strong> fornecemos laboratórios físicos em Maputo, explicamos termos de inglês em português local, auxiliamos no pedido de bolsas de estudo Coursera e damos suporte de dúvidas técnicas por uma taxa simbólica de tutoria via M-Pesa.
          </p>
        </div>
        <button
          onClick={() => {
            setTutoringSubmitted(false);
            setShowTutoringModal(true);
          }}
          className="w-full md:w-auto px-6 py-3.5 bg-[#c084fc] text-slate-950 font-black tracking-wider uppercase text-xs hover:scale-[1.03] hover:bg-[#a855f7] rounded-sm transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#c084fc]/10 cursor-pointer"
        >
          <GraduationCap className="h-4 w-4" />
          <span>Solicitar Apoio Técnico</span>
        </button>
      </div>

      {/* Interactive Controls Panel */}
      <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar site por competência ou tecnologia (ex: Python, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05070a] border border-white/10 focus:border-[#22d3ee] text-xs rounded-xl pl-9 pr-4 py-3.5 placeholder-slate-500 focus:outline-none transition text-white"
          />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 mr-2 block lg:inline">Temas:</span>
          {[
            { id: 'All', label: 'Todos os Recursos' },
            { id: 'Programação', label: 'Programação Web & Dados' },
            { id: 'IA e Produtividade', label: 'Inteligência Artificial' },
            { id: 'Negócios & Cloud', label: 'Negócios & Cloud' },
            { id: 'Idiomas', label: 'Inglês Técnico' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg font-bold text-[9px] uppercase tracking-wider transition cursor-pointer select-none border ${
                selectedCategory === cat.id
                  ? 'bg-[#22d3ee] border-[#22d3ee] text-slate-950 font-black'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty States */}
      {filteredSites.length === 0 && (
        <div className="p-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">Nenhum diretório encontrado</h4>
          <p className="text-xs text-slate-500 mt-1">Limpando os seus termos de pesquisa para listar todas as opções disponíveis globalmente.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 bg-[#05070a] hover:bg-white/5 text-xs text-[#22d3ee] font-bold uppercase tracking-wider rounded-full border border-white/10 cursor-pointer transition"
          >
            Redefinir Filtros
          </button>
        </div>
      )}

      {/* Course sites grid selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className={`bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#22d3ee]/40 hover:shadow-lg hover:shadow-[#22d3ee]/5 transition duration-300 flex flex-col justify-between relative overflow-hidden group ${
              site.isPopularInMozambique ? 'border-emerald-500/15' : ''
            }`}
          >
            {/* Mozambique popularity tag banner */}
            {site.isPopularInMozambique && (
              <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-extrabold px-3 py-1 rounded-bl-lg border-l border-b border-emerald-500/20 uppercase tracking-widest select-none">
                🔥 Popular em Moçambique
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white font-display text-base group-hover:bg-gradient-to-br group-hover:from-[#22d3ee] group-hover:to-[#9333ea] group-hover:text-slate-950 transition-colors duration-300">
                  {site.avatarLetter}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#c084fc] font-bold block uppercase tracking-wider">{site.provider}</span>
                  <h3 className="text-base font-bold text-white leading-tight group-hover:text-[#22d3ee] transition duration-200">
                    {site.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[4rem]">
                {site.description}
              </p>

              {/* Languages & Subjects badges */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Languages className="h-3.5 w-3.5 text-[#22d3ee]" />
                  <span className="font-mono uppercase tracking-wider text-[8px] font-bold">Idiomas Oficiais:</span>
                  <span className="text-white font-medium">{site.languages.join(', ')}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {site.disciplines.map(disc => (
                    <span key={disc} className="text-[9px] font-mono bg-white/[0.03] text-slate-300 border border-white/5 px-2.5 py-0.5 rounded">
                      {disc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch action button */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#22d3ee] uppercase tracking-wider font-bold">100% Gratuito</span>
              
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#05070a] hover:bg-[#22d3ee] border border-white/10 hover:border-transparent text-slate-200 hover:text-slate-950 text-xs font-bold uppercase tracking-wider rounded-sm hover:scale-105 transition flex items-center gap-1 shadow-inner cursor-pointer"
              >
                <span>Aceder ao Site</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mozambique interactive tutoring request modal form */}
      {showTutoringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0d1118]/95 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#05070a]/80">
              <div className="flex items-center gap-2 text-[#c084fc]">
                <GraduationCap className="h-5 w-5" />
                <span className="font-bold text-sm text-white">Solicitar Tutoria & Auxílio</span>
              </div>
              <button
                onClick={() => setShowTutoringModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!tutoringSubmitted ? (
                <form onSubmit={handleTutoringSubmit} className="space-y-4">
                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-slate-350 leading-relaxed">
                      A Netek apoia estudantes, programadores e profissionais em Moçambique a contornarem barreiras técnicas em plataformas Globais. Explique abaixo a sua necessidade para organizarmos a sua mentoria.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">O Seu Nome *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome Sobrenome"
                      value={tutoringForm.name}
                      onChange={(e) => handleTutoringChange('name', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contacto de Telemóvel (Vodacom / Movitel) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 84 / 85 / 87 XXXXXXX"
                      value={tutoringForm.phone}
                      onChange={(e) => handleTutoringChange('phone', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Área ou Curso que Deseja Fazer</label>
                    <input
                      type="text"
                      placeholder="Ex: Programar em React, Redigir com Chat GPT, etc."
                      value={tutoringForm.courseInterest}
                      onChange={(e) => handleTutoringChange('courseInterest', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Qual é a sua Maior Dificuldade?</label>
                    <select
                      value={tutoringForm.difficulty}
                      onChange={(e) => handleTutoringChange('difficulty', e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#c084fc] cursor-pointer"
                    >
                      <option value="Falta de computador próprio / internet móvel instável">Falta de computador próprio / internet móvel instável</option>
                      <option value="Compreensão de termos técnicos em Inglês">Compreensão de termos técnicos em Inglês</option>
                      <option value="Dificuldade com exercícios práticos e códigos">Dificuldade com exercícios práticos e códigos</option>
                      <option value="Preciso de ajuda financeira para pagar certificado Coursera">Preciso de ajuda financeira para pagar certificado Coursera</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#c084fc] text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-[#a855f7] transition duration-200 mt-2 flex items-center justify-center gap-1 shadow-lg shadow-[#c084fc]/15 cursor-pointer"
                  >
                    <span>Gravar Pedido de Apoio</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="py-4 text-center space-y-4">
                  <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">Pedido Registrado!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                      Kanimambo, <strong>{tutoringForm.name}</strong>! O seu perfil de candidatura de tutoria foi gerado. Toque abaixo para abrir o WhatsApp oficial e finalizar o plano com a nossa equipa.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#05070a] border border-white/5 rounded-xl text-left text-xs space-y-1 font-mono text-slate-400">
                    <div><span>Estudante:</span> <strong className="text-white font-sans">{tutoringForm.name}</strong></div>
                    <div className="border-t border-white/5 pt-1 mt-1"><span>Área:</span> <strong className="text-white font-sans">{tutoringForm.courseInterest || 'Geral'}</strong></div>
                    <div className="border-t border-white/5 pt-1 mt-1"><span>Barreira:</span> <strong className="text-emerald-400 font-sans">{tutoringForm.difficulty}</strong></div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={getWhatsAppTutoringLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Conversar por WhatsApp</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setShowTutoringModal(false)}
                      className="text-xs text-slate-500 hover:text-white font-bold uppercase mt-1 tracking-wider"
                    >
                      Fechar Janela
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer warning badge info */}
      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center flex flex-col sm:flex-row items-center justify-center gap-3">
        <ShieldCheck className="h-5 w-5 text-[#22d3ee] flex-shrink-0" />
        <span className="text-xs text-slate-400 leading-normal">
          🏆 Os links acima apontam diretamente para portais autênticos de computação global. Evite portais de pirataria! O conhecimento compartilhado nestes canais possui valor técnico internacional de altíssima relevância intelectual.
        </span>
      </div>
    </div>
  );
}
