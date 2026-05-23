import React, { useState } from 'react';
import { BLOG_DATA } from '../data';
import { BlogPost } from '../types';
import { ArrowLeft, BookOpen, Clock, Calendar, Eye, Share2, Copy, Check, MessageSquare, AlertCircle } from 'lucide-react';

export default function BlogView() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const categories = ['All', 'IA e Produtividade', 'Conectividade', 'Negócios e M-Pesa', 'Economia de Dados'];

  const filteredPosts = BLOG_DATA.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };
  return (
    <div className="space-y-12 select-none">
      
      {/* Page header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-xs font-mono text-[#c084fc] uppercase tracking-widest block mb-2">Conhecimento Aberto</span>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Blog de Dicas, Tutoriais & Inteligência Artificial
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl leading-relaxed">
          Artigos desmistificados, curtos e leves, pensados para o consumo ágil em Moçambique. Aprenda a tirar partido de ferramentas de IA, automatizar recebimentos e poupar saldo de dados móveis no dia a dia.
        </p>
      </div>

      {/* Main Container */}
      {selectedPost ? (
        /* Expanded Article Detail view */
        <div className="space-y-8 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#22d3ee] rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer transition w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Regressar aos Artigos</span>
          </button>

          {/* Title & Metadata details */}
          <div className="space-y-4">
            <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-bold bg-[#c084fc]/15 text-[#c084fc] rounded-full uppercase border border-[#c084fc]/30">
              {selectedPost.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              {selectedPost.title}
            </h1>

            {/* Micro details bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-sans border-y border-white/5 py-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[#c084fc]" />
                {selectedPost.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#c084fc]" />
                {selectedPost.readTime} de leitura
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-[#c084fc]" />
                {selectedPost.views} visualizações
              </span>
              <span className="font-semibold text-slate-200">
                Escrito por: <strong className="text-[#22d3ee] font-normal">{selectedPost.author}</strong>
              </span>
            </div>
          </div>

          {/* Actual markdown-like styled content */}
          <article className="prose prose-invert max-w-3xl text-slate-300 text-sm leading-relaxed space-y-6">
            {selectedPost.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('###')) {
                // Header style
                return (
                  <h3 key={index} className="text-lg font-display font-semibold text-white pt-3 border-l-2 border-[#c084fc] pl-2">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              if (paragraph.startsWith('*')) {
                // Bullet points
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-300">
                    {paragraph.split('\n').map((bullet, bIndex) => (
                      <li key={bIndex}>
                        {bullet.replace('*', '').trim()}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.includes('**Exemplo de prompt:**') || paragraph.includes('**Exemplo de prompt**')) {
                // Highlight prompts container helper
                return (
                  <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <div className="flex justify-between items-center bg-[#05070a] p-2 rounded-t-lg -mx-4 -mt-4 border-b border-white/10">
                      <span className="text-[10px] font-mono text-[#22d3ee] uppercase tracking-wider font-semibold">Prompt Sugerido</span>
                      <button
                        onClick={() => handleCopyPrompt("Atua como assistente de vendas em Maputo. Escreve uma resposta simpática e curta para o cliente que quer saber se aceitamos pagamentos eletrónicos, baseando-te no facto de aceitarmos M-Pesa (8401666592), e-Mola (874786943) ou mKesh (835109190).")}
                        className="text-[10px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedText ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-[#22d3ee] italic">{paragraph}</p>
                  </div>
                );
              }
              return (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Social and WhatsApp help */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <AlertCircle className="h-4.5 w-4.5 text-[#22d3ee]" />
              <span>Precisa de ajuda para automatizar estas dicas na sua empresa?</span>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=258835109190&text=${encodeURIComponent(`Olá Netek, li o vosso artigo de IA sobre "${selectedPost.title}" e gostava de implementar no meu negócio.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#22d3ee] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition duration-300"
            >
              Falar com Engenheiro Netek
            </a>
          </div>
        </div>
      ) : (
        /* Blog List view */
        <div className="space-y-8 animate-fadeIn">
          {/* Controls Bar: Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer border ${
                    activeCategory === cat
                      ? 'bg-[#22d3ee]/10 text-[#22d3ee] border-[#22d3ee] shadow-sm shadow-[#22d3ee]/5'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  {cat === 'All' ? 'Todos os Artigos' : cat}
                </button>
              ))}
            </div>

            {/* Inline search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar nos artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 bg-[#05070a] border border-white/10 focus:border-[#22d3ee] text-xs rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Empty state query blogs */}
          {filteredPosts.length === 0 && (
            <div className="p-8 text-center bg-white/5 border border-white/5 rounded-xl text-xs text-slate-500">
              <span>Nenhum artigo encontrado para o termo "{searchQuery}".</span>
            </div>
          )}

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white/5 border border-white/10 hover:border-[#22d3ee]/30 p-5 rounded-2xl transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono select-none">
                    <span className="text-[#c084fc] uppercase tracking-wider font-semibold">{post.category}</span>
                    <span className="text-slate-400">{post.readTime}</span>
                  </div>

                  <h3 className="text-sm font-display font-semibold text-white tracking-tight hover:text-[#22d3ee] transition">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{post.date}</span>
                  <span className="text-[#22d3ee] flex items-center gap-1 font-sans font-bold hover:underline">
                    Ler Artigo →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Partner Blogger Banner Integration */}
          <div className="bg-[#22d3ee]/5 border border-[#22d3ee]/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
            <div className="space-y-2 text-left">
              <span className="px-2.5 py-0.5 bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[9px] font-mono uppercase rounded-full">
                Parceiro de Conteúdo Técnico
              </span>
              <h4 className="text-base font-bold text-white tracking-tight">Blogspot de Tutoriais Avançados Activo!</h4>
              <p className="text-xs text-slate-305 max-w-xl leading-relaxed">
                Navegue pelas melhores dicas e tutoriais estendidos recomendados diretamente na plataforma oficial parceira: <strong>jonsonjb.blogspot.com</strong>. Truques de conectividade, códigos exclusivos de programação e guias práticos moçambicanos de acesso livre.
              </p>
            </div>
            <a
              href="https://jonsonjb.blogspot.com"
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto px-5 py-3 bg-white/5 hover:bg-[#22d3ee] hover:text-slate-950 border border-white/10 hover:border-transparent rounded-sm text-xs font-black uppercase tracking-widest text-center transition cursor-pointer flex items-center justify-center gap-1 shrink-0"
            >
              <span>Aceder ao Blogspot</span>
              <span>→</span>
            </a>
          </div>

          {/* Offline/Printed tip box */}
          <div className="bg-[#c084fc]/5 border border-[#c084fc]/30 text-[#e9d5ff] p-4 rounded-xl text-xs flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#c084fc]" />
            <span>
              ℹ️ <strong>Baixo Consumo Garantido:</strong> Este blog não carrega scripts de publicidade ou redirecionamentos lentos. Cada página pesa menos de 80 Kilobytes, economizando significativamente os seus megas de internet em ligações móveis!
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
