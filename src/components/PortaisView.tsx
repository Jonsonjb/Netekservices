import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Film, Music, Code2, ExternalLink, Star, Bookmark, Compass,
  Search, Share2, Sparkles, CheckCircle2, Heart, ShieldAlert, WifiOff, HelpCircle, 
  ArrowUpRight, Plus, Check, Trash, Shield, AlertTriangle
} from 'lucide-react';

interface PortalItem {
  id: string;
  name: string;
  url: string;
  category: 'jogos' | 'filmes' | 'musicas' | 'builders' | 'vpns';
  description: string;
  highlights: string[];
  isOculto: boolean;
  dataRating: 'Baixo (Económico)' | 'Médio' | 'Alto (Requer Wi-Fi)';
  rating: number; // 1 to 5 stars
  officialStatus: string;
}

export default function PortaisView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('netek_portal_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPortal, setSelectedPortal] = useState<PortalItem | null>(null);

  // User ratings/heart states
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('netek_portal_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // User custom contributions
  const [contributions, setContributions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('netek_portal_contributions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Star Ratings & Written Reviews Local Storage
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('netek_portal_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Interaction Form State for submitting a Review
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Reporting System (Sistema de Denúncia)
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingReason, setReportingReason] = useState('Link Quebrado / Não Funciona');
  const [reportingDetails, setReportingDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Interactive Form State for proposing a portal
  const [newPortalName, setNewPortalName] = useState('');
  const [newPortalUrl, setNewPortalUrl] = useState('');
  const [newPortalCategory, setNewPortalCategory] = useState<'jogos' | 'filmes' | 'musicas' | 'builders' | 'vpns'>('jogos');
  const [newPortalDesc, setNewPortalDesc] = useState('');
  const [contributionSuccess, setContributionSuccess] = useState(false);

  // Curated dataset representing the best "hidden/unfamiliar" resources for Mozambique
  const PORTAIS_DATA: PortalItem[] = [
    // === GAMES (JOGOS) ===
    {
      id: 'g1',
      name: 'Itch.io',
      url: 'https://itch.io',
      category: 'jogos',
      description: 'O maior refúgio de videojogos independentes do mundo. Milhares de criadores carregam jogos inteiramente gratuitos para jogar direto no navegador ou descarregar, além de assets de arte e bandas sonoras 100% livres.',
      highlights: ['Sem anúncios irritantes', 'Jogos jogáveis direto no telemóvel/portátil', 'Projetos experimentais inovadores'],
      isOculto: true,
      dataRating: 'Médio',
      rating: 4.9,
      officialStatus: 'Plataforma Aberta'
    },
    {
      id: 'g2',
      name: 'MyAbandonware',
      url: 'https://www.myabandonware.com',
      category: 'jogos',
      description: 'Um museu/arquivo virtual incrível que preserva mais de 28.000 jogos clássicos de PC e consolas retro, que já não são vendidos comercialmente. Pode baixar ou até jogar clássicos antigos diretamente pelo seu próprio browser de internet.',
      highlights: ['Arquivo histórico de 1980 a 2010', 'Instaladores limpos e seguros', 'Jogos leves perfeitos para PCs modestos'],
      isOculto: true,
      dataRating: 'Baixo (Económico)',
      rating: 4.8,
      officialStatus: 'Preservação Digital'
    },
    {
      id: 'g3',
      name: 'CrazyGames',
      url: 'https://www.crazygames.com',
      category: 'jogos',
      description: 'Excelente para quem quer jogar na hora sem precisar de descarregar ficheiros pesados ou ter consolas. Uma coleção fantástica de jogos de ação, estratégia e simuladores de alta qualidade totalmente otimizados para web.',
      highlights: ['Excelente no telemóvel ou tablet', 'Secção de multijogador em tempo real', 'Sem registo obrigatório'],
      isOculto: false,
      dataRating: 'Alto (Requer Wi-Fi)',
      rating: 4.6,
      officialStatus: 'Jogos Web Instantâneos'
    },
    
    // === MOVIES (FILMES) ===
    {
      id: 'f1',
      name: 'Archive.org (Moving Image Archive)',
      url: 'https://archive.org/details/movies',
      category: 'filmes',
      description: 'Uma enorme biblioteca virtual descentralizada e gratuita que contém milhares de filmes clássicos, curtas de animação histórica, cinema mudo, ficção científica dos anos 70 e documentários premiados de livre acesso público.',
      highlights: ['Filmes de domínio público legal', 'Download direto em MP4 ou Torrents', 'Zero anúncios durante a reprodução'],
      isOculto: true,
      dataRating: 'Alto (Requer Wi-Fi)',
      rating: 4.7,
      officialStatus: 'Biblioteca Sem Fins Lucrativos'
    },
    {
      id: 'f2',
      name: 'Tubi TV',
      url: 'https://tubitv.com',
      category: 'filmes',
      description: 'Uma gigantesca plataforma legal de streaming mantida por estúdios de Hollywood. Oferece milhares de filmes e séries conhecidas de forma 100% gratuita. Embora exiba anúncios ocasionais no início, o acervo é formidável.',
      highlights: ['Aplicações oficiais para telemóveis e Smart TV', 'Resolução em Full HD', 'Catálogo sempre atualizado de filmes de ação/terror'],
      isOculto: false,
      dataRating: 'Alto (Requer Wi-Fi)',
      rating: 4.5,
      officialStatus: 'Serviço Oficial Licenciado'
    },
    {
      id: 'f3',
      name: 'Kino Cult',
      url: 'https://www.kinocult.com',
      category: 'filmes',
      description: 'O canal definitivo para amantes de cinema alternativo, retro retro-horror, clássicos vintage e documentários de arte excêntricos. Uma pérola desconhecida do grande público que disponibiliza obras fantásticas gratuitamente.',
      highlights: ['Estéticas únicas e raras', 'Streaming de alto desempenho', 'Ótima curadoria cinematográfica'],
      isOculto: true,
      dataRating: 'Médio',
      rating: 4.4,
      officialStatus: 'Cinema de Culto Livre'
    },

    // === MUSIC (MÚSICAS) ===
    {
      id: 'm1',
      name: 'Free Music Archive (FMA)',
      url: 'https://freemusicarchive.org',
      category: 'musicas',
      description: 'A biblioteca de músicas gratuitas mais conceituada para criadores de conteúdo e entusiastas. Milhares de faixas de músicos independentes do mundo todo distribuídas sob licenças Creative Commons, prontas para o seu projeto comercial ou uso casual.',
      highlights: ['Pesquisa refinada por género e ritmo', 'Excelente para música de fundo em vídeos', 'Downloads ilimitados de alta qualidade'],
      isOculto: true,
      dataRating: 'Baixo (Económico)',
      rating: 4.8,
      officialStatus: 'Coleção sob Licenças Livres'
    },
    {
      id: 'm2',
      name: 'Bandcamp (Explorador Livre)',
      url: 'https://bandcamp.com',
      category: 'musicas',
      description: 'O santuário dos músicos independentes. Muitas bandas e produtores de beats excelentes disponibilizam os seus álbuns inteiros no formato "pague o que quiser" (podendo colocar 0 MT/grátis para baixar de forma legal).',
      highlights: ['Contacto direto com artistas', 'Formatos de áudio profissional (FLAC, WAV)', 'Descoberta de novos ritmos de África e do mundo'],
      isOculto: false,
      dataRating: 'Médio',
      rating: 4.9,
      officialStatus: 'Mercado de Música Livre'
    },

    // === FREE BUILDERS ===
    {
      id: 'b1',
      name: 'Carrd.co',
      url: 'https://carrd.co',
      category: 'builders',
      description: 'O construtor de sites de página única mais rápido, simples e otimizado do planeta. É perfeito para criar portfólios profissionais, landing pages de negócios locais, links para redes sociais e cartazes virtuais totalmente gratuitos.',
      highlights: ['Carrega instantaneamente com ligações móveis lentas', 'Interface de arrastar e soltar intuitiva', 'Hospedagem gratuita vitalícia com domínio .carrd.co'],
      isOculto: false,
      dataRating: 'Baixo (Económico)',
      rating: 4.9,
      officialStatus: 'Web Builder Acelerado'
    },
    {
      id: 'b2',
      name: 'Glide Apps',
      url: 'https://www.glideapps.com',
      category: 'builders',
      description: 'Transforme uma simples folha de dados do Google Sheets ou Excel numa aplicação telemóvel e web totalmente interativa no espaço de 5 minutos, sem escrever uma única linha de código. Ideal para catalogar lojas, cardápios ou painéis escolares.',
      highlights: ['Integração direta com bases de dados que já domina', 'Formatação mobile impecável e elegante', 'Plano gratuito genial para pequenos inventários'],
      isOculto: true,
      dataRating: 'Médio',
      rating: 4.8,
      officialStatus: 'Plataforma No-Code Líder'
    },

    // === WORKING VPNS FOR MOZAMBIQUE ===
    {
      id: 'v1',
      name: 'Windscribe VPN',
      url: 'https://windscribe.com',
      category: 'vpns',
      description: 'Oferece até 10 GB de tráfego mensal gratuito e servidores estáveis de alta largura. É excelente para circular flutuações e bloqueios de canais digitais, mantendo uma navegação veloz e limpa mesmo em conexões móveis condicionadas de Moçambique.',
      highlights: ['10 GB grátis por mês', 'Firewall integrado (Kill Switch)', 'Ótima encriptação e protocolo WireGuard'],
      isOculto: false,
      dataRating: 'Médio',
      rating: 4.9,
      officialStatus: 'Recomendado para Uso Diário'
    },
    {
      id: 'v2',
      name: 'Proton VPN',
      url: 'https://protonvpn.com',
      category: 'vpns',
      description: 'Verdadeiramente ilimitado de banda larga e livre de qualquer publicidade intrusiva. Com sede na Suíça, oferece criptografia ultra-forte e servidores gratuitos rápidos, perfeito para profissionais que requerem estabilidade total sem limite de volume de megas.',
      highlights: ['Sem limite mensal de dados', 'Foco estrito em privacidade', 'Banda larga estável'],
      isOculto: false,
      dataRating: 'Alto (Requer Wi-Fi)',
      rating: 4.9,
      officialStatus: 'Melhor Escolha Ilimitada'
    },
    {
      id: 'v3',
      name: 'Psiphon Pro',
      url: 'https://psiphon.ca',
      category: 'vpns',
      description: 'A ferramenta de contorno de bloqueios digitais mais famosa e querida de Moçambique. Funciona como um túnel VPN que adapta e optimiza de forma inteligente caminhos de rede locais para manter o fluxo de navegação resiliente.',
      highlights: ['Excelente contornando restrições de rede', 'Navegação resiliente em 3G e 4G instáveis', 'Acesso gratuito flexível de base'],
      isOculto: true,
      dataRating: 'Baixo (Económico)',
      rating: 4.8,
      officialStatus: 'Resiliência Digital Ativa'
    },
    {
      id: 'v4',
      name: 'Cloudflare WARP (1.1.1.1)',
      url: 'https://1.1.1.1',
      category: 'vpns',
      description: 'Uma solução moderna que substitui a ligação tradicional do telemóvel por um protocolo moderno e otimizado da Cloudflare. É fantástico para estabilizar o ping e acelerar o carregamento de sites em Moçambique sem consumir dados extras.',
      highlights: ['Ativação ultra leve num único clique', 'Não consome bateria nem megas adicionais', 'Estabilização ágil de rotas DNS'],
      isOculto: false,
      dataRating: 'Baixo (Económico)',
      rating: 4.7,
      officialStatus: 'Otimizador de Conexão'
    }
  ];

  const handleShare = (portal: PortalItem) => {
    const text = `Olha para este portal espetacular: ${portal.name} - ${portal.description} (${portal.url})`;
    navigator.clipboard.writeText(text);
    setCopiedId(portal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem('netek_portal_bookmarks', JSON.stringify(updated));
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentLikes = likes[id] || 0;
    const updated = {
      ...likes,
      [id]: currentLikes + 1
    };
    setLikes(updated);
    localStorage.setItem('netek_portal_likes', JSON.stringify(updated));
  };

  // Submit Star rating and typed review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal) return;

    const newReview = {
      id: `review_${Date.now()}`,
      portalId: selectedPortal.id,
      portalName: selectedPortal.name,
      starRating: ratingStars,
      comment: reviewComment,
      date: new Date().toLocaleDateString('pt-PT') + ' ' + new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('netek_portal_reviews', JSON.stringify(updated));

    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // Submit Reporting
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal) return;

    const savedReports = localStorage.getItem('netek_reports');
    const existingReports = savedReports ? JSON.parse(savedReports) : [];

    const newReport = {
      id: `report_${Date.now()}`,
      portalId: selectedPortal.id,
      portalName: selectedPortal.name,
      reason: reportingReason,
      details: reportingDetails || 'Relatado por utilizador local.',
      date: new Date().toLocaleDateString('pt-PT')
    };

    localStorage.setItem('netek_reports', JSON.stringify([newReport, ...existingReports]));

    setReportingDetails('');
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
    }, 2000);
  };

  const handleProposePortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalName.trim() || !newPortalUrl.trim()) return;

    const proposed = {
      id: `proposed_${Date.now()}`,
      name: newPortalName,
      url: newPortalUrl,
      category: newPortalCategory,
      description: newPortalDesc || 'Propriedade sugerida por utilizador interessado.',
      highlights: ['Sugerido pela comunidade', 'Em revisão técnica'],
      isOculto: true,
      dataRating: 'Médio',
      rating: 4.0,
      officialStatus: 'Rascunho de Utilizador'
    };

    const updated = [...contributions, proposed];
    setContributions(updated);
    localStorage.setItem('netek_portal_contributions', JSON.stringify(updated));

    // Reset fields
    setNewPortalName('');
    setNewPortalUrl('');
    setNewPortalDesc('');
    setContributionSuccess(true);
    setTimeout(() => setContributionSuccess(false), 4000);
  };

  const handleDeleteContribution = (id: string) => {
    const updated = contributions.filter(c => c.id !== id);
    setContributions(updated);
    localStorage.setItem('netek_portal_contributions', JSON.stringify(updated));
  };

  // Combine standard and user proposed data
  const combinedPortals = [...PORTAIS_DATA, ...contributions];

  // Filters
  const filteredPortals = combinedPortals.filter(portal => {
    const matchesCategory = activeCategory === 'all' || 
                            activeCategory === 'bookmarks' && bookmarks.includes(portal.id) ||
                            portal.category === activeCategory;

    const matchesSearch = portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          portal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          portal.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      
      {/* Jumbotron Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c142c] via-[#05070a] to-[#0d071b] border border-white/5 p-8 md:p-12 space-y-6">
        <div className="absolute right-0 top-0 w-80 h-85 bg-[#22d3ee]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative space-y-4 max-w-3xl">
          <span className="p-1 px-3 bg-[#c084fc]/10 text-[#c084fc] rounded border border-[#c084fc]/20 font-mono tracking-widest uppercase text-[10px] font-bold">
            Curadoria & Ferramentas Moçambique
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight leading-none uppercase">
            Portais Secretos & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#c084fc]">VPNs Eficazes</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Consulte sites gratuitos de utilidade pública e descubra as melhores <strong>VPNs que funcionam e economizam os seus dados móveis</strong> em Moçambique. Também pode avaliar e denunciar portais enganosos para benefício de toda a comunidade!
          </p>
        </div>

        {/* Micro connectivity awareness tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <Gamepad2 className="h-5 w-5 text-[#22d3ee] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">Jogos Otimizados:</strong>
              Evite gastos massivos de gigas em descarregamentos. Corra web-games leves na hora.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Film className="h-5 w-5 text-[#c084fc] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">Segurança & Moderação:</strong>
              O nosso sistema colaborativo permite denunciar links falsos para auditoria de Peniel Dinis.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Code2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">No-Code & Builders:</strong>
              Hospede o seu portfólio profissional para sempre a custo zero sem complicações.
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="space-y-6">
        
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
            {[
              { id: 'all', label: 'Todos', icon: Compass },
              { id: 'vpns', label: 'VPNs Ativas', icon: Shield, color: 'text-cyan-400' },
              { id: 'jogos', label: 'Jogos Grátis', icon: Gamepad2 },
              { id: 'filmes', label: 'Cinema', icon: Film },
              { id: 'musicas', label: 'Áudio Livre', icon: Music },
              { id: 'builders', label: 'Criadores Web', icon: Code2 },
              { id: 'bookmarks', label: `Marcadores (${bookmarks.length})`, icon: Bookmark }
            ].map((cat) => {
              const IconComp = cat.icon;
              const isSel = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedPortal(null); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSel 
                      ? 'bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComp className="h-4 w-4 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-550" />
            <input
              type="text"
              placeholder="Pesquisar portais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full xl:w-72 bg-[#05070a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#22d3ee]/60 transition"
            />
          </div>
        </div>

        {/* Selected Portal Detail panel */}
        {selectedPortal ? (
          <div className="bg-[#0c142c]/20 border border-[#22d3ee]/20 rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-1 text-[9px] font-mono font-bold bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 uppercase rounded-full">
                  {selectedPortal.category === 'jogos' ? '🎮 Jogo Grátis' :
                   selectedPortal.category === 'filmes' ? '🎬 Filmes & Canal' :
                   selectedPortal.category === 'musicas' ? '🎵 Som & Audio' :
                   selectedPortal.category === 'vpns' ? '🛡️ VPN Que Funciona' :
                   '💻 Construtor Web/App'}
                </span>
                <h3 className="text-2xl font-display font-black text-white">{selectedPortal.name}</h3>
                <span className="text-xs text-slate-400 font-mono block">Classificação Oficial: <strong className="text-[#c084fc]">{selectedPortal.officialStatus}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleBookmark(selectedPortal.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    bookmarks.includes(selectedPortal.id)
                      ? 'bg-red-500/10 border-red-500/40 text-red-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title="Marcar nas suas preferências"
                >
                  <Bookmark className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => handleLike(selectedPortal.id)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500/20" />
                  <span>Agradecer ({likes[selectedPortal.id] || 0})</span>
                </button>
                
                {/* Red Denunciar button */}
                <button
                  onClick={() => {
                    setReportingDetails('');
                    setReportSuccess(false);
                    setShowReportModal(true);
                  }}
                  className="px-4 py-2.5 bg-red-650/10 hover:bg-red-500 hover:text-[#05070a] border border-red-500/20 rounded-xl text-xs text-red-400 transition flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Denunciar</span>
                </button>

                <button
                  onClick={() => setSelectedPortal(null)}
                  className="px-4 py-2.5 bg-[#22d3ee] hover:bg-cyan-400 text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Fechar Detalhes</span>
                </button>
              </div>
            </div>

            {/* Reporting Popup form embedded dynamically inside details */}
            {showReportModal && (
              <div className="p-5 bg-red-950/10 border border-red-500/20 rounded-xl space-y-4 animate-fadeIn text-xs text-left">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <h4 className="font-bold text-white uppercase tracking-wider">Sistema de Denúncia Associativa (Segurança Netek)</h4>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Encontrou esquemas falsos, links inseguros ou cobranças abusivas neste portal? Ajude a manter o diretório livre de fraudes digitais de recrutamento em Moçambique.
                </p>

                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Motivo principal *</label>
                      <select 
                        value={reportingReason} 
                        onChange={(e) => setReportingReason(e.target.value)}
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl p-2.5 block text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Link Quebrado / Não Funciona">Link Quebrado / Não Funciona</option>
                        <option value="Contém Esquema / Publicidade Falsa">Contém Esquema / Publicidade Falsa</option>
                        <option value="Consome Megas Excessivos">Consome Megas Excessivos</option>
                        <option value="Solicita Pagamentos Coagidos">Solicita Pagamentos Coagidos</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Detalhes da Denúncia *</label>
                      <input 
                        type="text"
                        required
                        value={reportingDetails}
                        onChange={(e) => setReportingDetails(e.target.value)}
                        placeholder="Ex: O site agora redireciona para um app de apostas que pede pagamentos rápidos."
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => setShowReportModal(false)}
                      className="px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 font-bold hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-red-650 hover:bg-red-500 font-black text-white hover:text-[#05070a] rounded-lg tracking-wide uppercase text-[10px]"
                    >
                      Enviar Denúncia Segura
                    </button>
                  </div>
                </form>

                {reportSuccess && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✓ Denúncia enviada para a equipa liderada por Peniel Dinis Mucavel! Obrigado pelo alerta.</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono text-[#c084fc]">O que é esta ferramenta?</h4>
                <p className="text-slate-300 leading-relaxed text-xs md:text-sm">
                  {selectedPortal.description}
                </p>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <WifiOff className="h-4.5 w-4.5 text-yellow-500" />
                    <span><strong>Consumo de dados móveis:</strong> <span className="text-[#22d3ee] font-mono font-bold">{selectedPortal.dataRating}</span></span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    *Para poupar dados móveis em Moçambique, aceda preferencialmente a estas ferramentas ativando a configuração de <strong>"Ligação Medida"</strong> ou aproveite os pacotes de dados notívagos acessíveis.
                  </p>
                </div>

                {/* Interactive Review Form (Avaliação com Estrela) */}
                <div className="p-4 bg-white/[0.015] border border-white/5 rounded-xl space-y-4">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-purple-400 fill-purple-400/25" />
                    <span>Deixar a sua Avaliação (Estrelas)</span>
                  </h5>

                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Pontuação de Estrelas:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRatingStars(s)}
                            className="p-1 focus:outline-none cursor-pointer"
                          >
                            <Star 
                              className={`h-4.5 w-4.5 transition ${
                                s <= ratingStars 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-slate-650 hover:text-yellow-600'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <textarea
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Escreva brevemente o seu veredicto do portal (ex: Rápido e de facto gratuito!)."
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#22d3ee]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-white/5 hover:bg-[#22d3ee] text-slate-300 hover:text-slate-950 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:border-transparent transition cursor-pointer"
                    >
                      Submeter Avaliação
                    </button>
                  </form>

                  {reviewSuccess && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px]">
                      ✓ Avaliação local registada na consola com sucesso!
                    </div>
                  )}

                  {/* Render reviews nested */}
                  {reviews.filter(v => v.portalId === selectedPortal.id).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Feedbacks Recentes:</span>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {reviews.filter(v => v.portalId === selectedPortal.id).map((v, idx) => (
                          <div key={idx} className="p-2 bg-black/45 rounded-lg border border-white/5 text-[11px] space-y-0.5">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-400">Anónimo Moçambique</span>
                              <div className="flex items-center text-yellow-500">
                                <Star className="h-2.5 w-2.5 fill-yellow-500 mr-0.5" />
                                <strong>{v.starRating}</strong>
                              </div>
                            </div>
                            <p className="text-slate-350 italic">"{v.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono text-[#c084fc]">Funcionalidades Principais</h4>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {selectedPortal.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-white/5">
                  <a
                    href={selectedPortal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#0891b2] hover:scale-[1.01] transition text-slate-950 font-black uppercase tracking-wider text-xs font-sans text-center flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#22d3ee]/20 shrink-0"
                  >
                    <span>Fazer Visita Oficial</span>
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  </a>
                  <span className="text-[9px] text-center text-slate-500 block mt-2 font-mono">Ligação segura para: {selectedPortal.url}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Cards Grid List */
          <div className="space-y-8">
            {filteredPortals.length === 0 ? (
              <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
                <ShieldAlert className="h-10 w-10 text-yellow-500 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-white">Nenhum portal encontrado</h4>
                <p className="text-xs text-slate-450 max-w-sm mx-auto">Tente ajustar o termo de pesquisa ou marque mais portais preferidos para os ver listados aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortals.map((portal) => {
                  const isBookmarked = bookmarks.includes(portal.id);
                  const numLikes = likes[portal.id] || 0;
                  return (
                    <div
                      key={portal.id}
                      onClick={() => setSelectedPortal(portal)}
                      className="bg-white/5 border border-white/10 hover:border-[#22d3ee]/40 rounded-2xl p-5 hover:bg-[#0c142c]/10 transition duration-300 cursor-pointer flex flex-col justify-between group space-y-4 shadow-sm"
                    >
                      <div className="space-y-3 text-left">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            portal.category === 'jogos' ? 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/10' :
                            portal.category === 'filmes' ? 'bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/10' :
                            portal.category === 'musicas' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10' :
                            portal.category === 'vpns' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                          }`}>
                            {portal.category === 'jogos' ? 'Jogos' :
                             portal.category === 'filmes' ? 'Filmes' :
                             portal.category === 'musicas' ? 'Músicas' :
                             portal.category === 'vpns' ? 'VPN Ativa' :
                             'Web Builder'}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => toggleBookmark(portal.id, e)}
                              className={`p-1.5 rounded-lg border transition ${
                                isBookmarked 
                                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                  : 'border-white/5 text-slate-455 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <Bookmark className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleLike(portal.id, e)}
                              className="p-1.5 rounded-lg border border-white/5 text-slate-455 hover:text-white hover:bg-white/5 flex items-center gap-1 text-[10px]"
                            >
                              <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400/10" />
                              <span className="font-mono">{numLikes > 0 ? numLikes : ''}</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-display font-semibold text-white tracking-tight group-hover:text-[#22d3ee] transition flex items-center gap-1.5">
                            {portal.name}
                            {portal.isOculto && (
                              <span className="text-[8px] font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-1 rounded border border-purple-500/10">Secret</span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 font-sans">
                            {portal.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="text-[9px] text-[#22d3ee]">Megas: {portal.dataRating}</span>
                        <span className="text-[#22d3ee] group-hover:underline flex items-center gap-1 font-sans font-bold">
                          Ver Detalhes →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Submit Oportunidade Form simulation */}
      <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="max-w-xl text-left space-y-2">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#22d3ee]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Conhece algum outro site útil ou VPN fantástica?</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ajude a enriquecer esta lista proposta pelos utilizadores da Netek. Submeta o endereço e um rascunho. A equipa de Peniel Dinis Mucavel irá testar a velocidade e integridade.
          </p>
        </div>

        <form onSubmit={handleProposePortal} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1 md:col-span-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Nome da ferramenta</label>
            <input
              type="text"
              required
              placeholder="Ex: ProtonVPN"
              value={newPortalName}
              onChange={(e) => setNewPortalName(e.target.value)}
              className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#22d3ee] transition"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Endereço Link (URL)</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={newPortalUrl}
              onChange={(e) => setNewPortalUrl(e.target.value)}
              className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#22d3ee] transition"
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Categoria</label>
            <select
              value={newPortalCategory}
              onChange={(e) => setNewPortalCategory(e.target.value as any)}
              className="w-full bg-[#05070a] border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#22d3ee] transition"
            >
              <option value="vpns">VPNs que funcionam</option>
              <option value="jogos">Jogos Grátis</option>
              <option value="filmes">Filmes & Cinema</option>
              <option value="musicas">Músicas & Áudio</option>
              <option value="builders">Criação Web/Apps</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-1 flex flex-col justify-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-white/5 hover:bg-[#22d3ee] hover:text-slate-950 border border-white/10 hover:border-transparent rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer text-center"
            >
              Contribuir Link
            </button>
          </div>
          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Breve descrição</label>
            <input
              type="text"
              placeholder="Ex: Uma VPN bastante rápida e estável para ligações móveis..."
              value={newPortalDesc}
              onChange={(e) => setNewPortalDesc(e.target.value)}
              className="w-full bg-[#05070a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#22d3ee] transition"
            />
          </div>
        </form>

        {contributionSuccess && (
          <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Sugestão guardada localmente de forma temporária sob o rótulo "Rascunho de Utilizador"! Obrigado pela partilha.</span>
          </div>
        )}

        {/* Display private contributions */}
        {contributions.length > 0 && (
          <div className="border-t border-white/5 pt-6 space-y-3">
            <span className="block text-[10px] font-mono text-[#c084fc] font-bold uppercase tracking-widest">As Suas Contribuições Pessoais ({contributions.length})</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributions.map((c) => (
                <div key={c.id} className="p-3.5 bg-white/[0.02] border border-[#c084fc]/20 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-1 overflow-hidden">
                    <span className="block text-xs font-bold text-white truncate max-w-[150px]">{c.name}</span>
                    <span className="block text-[9px] text-[#22d3ee] truncate max-w-[150px] font-mono">{c.url}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteContribution(c.id)}
                    className="p-1.5 hover:bg-red-500/10 text-slate-450 hover:text-red-400 rounded-lg transition"
                    title="Remover"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
