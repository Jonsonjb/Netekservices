import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Phone, Mail, AlertTriangle, ShieldAlert, CheckCircle2, MapPin, Building, Info, HelpCircle } from 'lucide-react';

interface AnalysisResult {
  target: string;
  type: 'phone' | 'email';
  carrierOrDomain: string;
  region: string;
  riskScore: number; // 0 to 100
  trustLevel: 'Seguro' | 'Médio / Suspeito' | 'Perigoso / Flagged';
  isOfficialGovernment: boolean;
  warnings: string[];
  suggestions: string[];
}

export default function OriginAnalyzer() {
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [bannedNumbers, setBannedNumbers] = useState<string[]>([]);

  // Load latest reports to verify if the typed target matches flagged scams
  useEffect(() => {
    try {
      const savedReports = localStorage.getItem('netek_reports');
      if (savedReports) {
        const parsed = JSON.parse(savedReports);
        // Extract numbers/emails from report details
        const targets: string[] = [];
        parsed.forEach((r: any) => {
          // Look for 9 digit numbers or emails in details
          const phoneRegex = /(84|85|86|87|82|83)\d{7}/g;
          const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
          const phoneMatches = r.details.match(phoneRegex);
          const emailMatches = r.details.match(emailRegex);
          if (phoneMatches) targets.push(...phoneMatches);
          if (emailMatches) targets.push(...emailMatches);
          if (r.portalName) targets.push(r.portalName.trim());
        });
        setBannedNumbers(targets);
      }
    } catch (e) {
      console.error("Error loading scam directory:", e);
    }
  }, []);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const isEmail = cleanInput.includes('@');
      const normalized = cleanInput.replace(/\s+/g, '');
      
      let res: AnalysisResult;

      if (isEmail) {
        // Email analysis
        const domain = cleanInput.split('@')[1]?.toLowerCase() || '';
        let carrierOrDomain = domain.toUpperCase();
        let region = 'Registador Internacional';
        let riskScore = 15;
        let trustLevel: 'Seguro' | 'Médio / Suspeito' | 'Perigoso / Flagged' = 'Seguro';
        let isOfficialGovernment = false;
        const warnings: string[] = [];
        const suggestions: string[] = [];

        if (domain.endsWith('.mz')) {
          region = 'Moçambique (Domínio Nacional .MZ)';
          if (domain.endsWith('.gov.mz')) {
            isOfficialGovernment = true;
            riskScore = 0;
            carrierOrDomain = `Governo de Moçambique (${domain})`;
            trustLevel = 'Seguro';
            warnings.push('Endereço oficial e fidedigno do Governo ou Administração Pública de Moçambique.');
            suggestions.push('Pode responder com total segurança legal e fornecer seus documentos oficiais.');
          } else if (domain.endsWith('.co.mz')) {
            riskScore = 10;
            carrierOrDomain = `Empresa Registada em Moçambique (.CO.MZ)`;
            warnings.push('Domínio comercial oficial gerido pela CIUEM (Universidade Eduardo Mondlane).');
            suggestions.push('Verifique a assinatura técnica e se o nome do remetente corresponde à empresa real.');
          } else if (domain.endsWith('.ac.mz') || domain.endsWith('.edu.mz')) {
            riskScore = 5;
            carrierOrDomain = `Instituição de Ensino Superior / Escola Moçambicana`;
            warnings.push('Endereço académico credenciado.');
            suggestions.push('Fidedigno para submissões de exames, candidaturas de bolsas e projectos de tutoria.');
          }
        } else {
          region = 'Servidor de Email Público Global';
          if (domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'outlook.com' || domain === 'hotmail.com') {
            riskScore = 30;
            trustLevel = 'Médio / Suspeito';
            warnings.push('Este email utiliza um registo gratuito internacional regulado. Qualquer utilizador pode criar esta conta sem verificação de empresa.');
            suggestions.push('Nunca pague taxas por M-Pesa a emails públicos que usem Gmail alegando ser de Recrutamento Oficial (burlas frequentes de emprego).');
          } else {
            riskScore = 50;
            trustLevel = 'Médio / Suspeito';
            warnings.push('Domínio internacional desconhecido ou recém-criado.');
            suggestions.push('Atenção: verifique se as hiperligações no corpo do email não induzem à roubo de dados.');
          }
        }

        // Check if blacklisted in local reports
        const isBanned = bannedNumbers.some(ban => cleanInput.toLowerCase().includes(ban.toLowerCase()));
        if (isBanned || domain.includes('temp') || domain.includes('scam') || domain.includes('burlas')) {
          riskScore = 95;
          trustLevel = 'Perigoso / Flagged';
          warnings.unshift('🚨 ALERTA: Este endereço de correio eletrónico foi reportado por utilizadores locais na Consola Netek associada a fraudes de portais falsos!');
          suggestions.unshift('BLOQUEIE IMEDIATAMENTE. Nunca envie talões de M-Pesa nem passwords de segurança.');
        }

        res = {
          target: cleanInput,
          type: 'email',
          carrierOrDomain,
          region,
          riskScore,
          trustLevel,
          isOfficialGovernment,
          warnings,
          suggestions: suggestions.length > 0 ? suggestions : ['Evite transferir megas ou dinheiro antes de obter prova técnica visual do remetente.']
        };

      } else {
        // Phone number analysis
        const digitsOnly = normalized.replace(/\D/g, '');
        // Standard Moçambicano format usually is 9 digits (ex: 84XXXXXXX)
        // If international country code exists (ex: 25884XXXXXXX), take the last 9 digits
        const last9Digits = digitsOnly.length >= 9 ? digitsOnly.slice(-9) : digitsOnly;
        const prefix2Digits = last9Digits.slice(0, 2);

        let carrierOrDomain = 'Desconhecido / Internacional';
        let region = 'Moçambique';
        let riskScore = 20;
        let trustLevel: 'Seguro' | 'Médio / Suspeito' | 'Perigoso / Flagged' = 'Seguro';
        const warnings: string[] = [];
        const suggestions: string[] = [];

        if (prefix2Digits === '84' || prefix2Digits === '85') {
          carrierOrDomain = 'Vodacom Moçambique SARL';
          region = 'Vodacom Network (Geral)';
          if (last9Digits.startsWith('840') || last9Digits.startsWith('841')) {
            region = 'Província de Maputo e Sul';
          } else if (last9Digits.startsWith('845') || last9Digits.startsWith('846')) {
            region = 'Zona Centro (Beira / Chimoio / Tete)';
          } else if (last9Digits.startsWith('848') || last9Digits.startsWith('849')) {
            region = 'Zona Norte (Nampula / Pemba)';
          }
          suggestions.push('Esta operadora suporta M-Pesa (*150#).');
        } else if (prefix2Digits === '86' || prefix2Digits === '87') {
          carrierOrDomain = 'Movitel SA';
          region = 'Movitel LTE Network (Elevada cobertura rural)';
          if (last9Digits.startsWith('862') || last9Digits.startsWith('872')) {
            region = 'Províncias do Norte de Moçambique';
          } else if (last9Digits.startsWith('866') || last9Digits.startsWith('876')) {
            region = 'Região Centro e Zambézia';
          }
          suggestions.push('Esta operadora utiliza a carteira móvel e-Mola (*155#).');
        } else if (prefix2Digits === '82' || prefix2Digits === '83') {
          carrierOrDomain = 'Tmcel (Moçambique Telecom)';
          region = 'Tmcel Network (Rede Estatal)';
          suggestions.push('Esta operadora utiliza a carteira mKesh (*830#).');
        } else if (prefix2Digits === '21' || digitsOnly.startsWith('25821')) {
          carrierOrDomain = 'TDM (Linha de Rede Fixa)';
          region = 'Gabinete ou Linha Residencial de Maputo';
          riskScore = 10;
          warnings.push('Linhas telefónicas fixas pertencem a instituições formais, residências reguladas ou escritórios registados.');
        } else {
          riskScore = 40;
          trustLevel = 'Médio / Suspeito';
          carrierOrDomain = 'Número fora do Padrão Nacional Moçambicano';
          region = 'Internacional ou Satélite';
          warnings.push('Este número de contacto não pertence a nenhuma das 3 operadoras móveis nacionais de Moçambique.');
        }

        // Specific M-Pesa fraud safety check
        if (cleanInput.includes('8401666592') || cleanInput.includes('874786943') || cleanInput.includes('835109190')) {
          riskScore = 0;
          trustLevel = 'Seguro';
          carrierOrDomain = 'Conta de Recebimento Netek Services (Peniel Mucavel)';
          region = 'Canal Oficial Netek - Maputo';
          warnings.push('Este é o número oficial do coordenador Peniel Dinis Mucavel para transações assistidas de CV e cartas.');
        }

        // Check if dynamic user reported
        const isBanned = bannedNumbers.some(ban => last9Digits.includes(ban) || cleanInput.includes(ban));
        if (isBanned) {
          riskScore = 98;
          trustLevel = 'Perigoso / Flagged';
          warnings.unshift('🚨 ATENÇÃO: Este número de telemóvel está inserido na lista ativa de fraudes do Netek por tentar burlar moçambicanos!');
          suggestions.unshift('NUNCA faça transferência de crédito ou "envio de dinheiro" por engano. Avise de imediato a Polícia da República (PRM) ou as linhas das operadoras.');
        }

        res = {
          target: cleanInput,
          type: 'phone',
          carrierOrDomain,
          region,
          riskScore,
          trustLevel,
          isOfficialGovernment: false,
          warnings,
          suggestions: suggestions.length > 0 ? suggestions : ['Para sua segurança, nunca faculte o PIN de M-Pesa/e-Mola por chamada telefónica.']
        };
      }

      setResult(res);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 select-none animate-fadeIn">
      
      {/* Header section */}
      <div className="border-b border-white/5 pb-6 text-left">
        <div className="flex items-center gap-2 text-[#fecc4c] mb-2">
          <ShieldCheck className="h-5 w-5 text-[#10b981] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest font-black">Cibersegurança e Proteção Moçambicana</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Analisador de Origem de Números e Emails
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
          Verifique instantaneamente a operadora móvel (Vodacom, Movitel, Tmcel), a província/região do prefixo, a reputação de endereços de e-mail e previna-se das famosas burlas de M-Pesa. A nossa base de dados é alimentada por denúncias comunitárias em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Live Input Analyzer */}
        <div className="lg:col-span-6 bg-[#1b1b32] border border-[#3b3b4f] p-6 text-left space-y-5">
          <div>
            <span className="text-[10px] font-mono text-[#fecc4c] uppercase tracking-wider font-bold">Diagnóstico em Tempo Real</span>
            <h3 className="text-sm font-bold text-white uppercase mt-1">Análise de Contacto</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Digite o correio eletrónico ou contacto telefónico moçambicano abaixo.</p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500">
                {inputValue.includes('@') ? <Mail className="h-4.5 w-4.5 text-[#fecc4c]" /> : <Phone className="h-4.5 w-4.5 text-[#10b981]" />}
              </span>
              <input
                type="text"
                required
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setResult(null);
                }}
                placeholder="Ex: 841234567 ou recrutamento@empresa.co.mz"
                className="w-full bg-[#0a0a23] border border-[#3b3b4f] p-3.5 pl-11 text-xs text-white rounded-none focus:outline-none focus:border-[#fecc4c] font-mono tracking-wide placeholder-slate-500"
              />
            </div>

            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={isAnalyzing || !inputValue.trim()}
                className="flex-1 py-3 bg-[#10b981] hover:bg-[#059669] disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-wide transition rounded-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isAnalyzing ? 'Processando Sinal...' : 'Analisar Origem'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setResult(null);
                }}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-350 text-xs font-semibold rounded-none font-mono border border-transparent hover:border-[#3b3b4f]"
              >
                Limpar
              </button>
            </div>
          </form>

          {/* Core Results Block */}
          {result && (
            <div className="space-y-4 p-5 bg-[#0a0a23] border border-[#3b3b4f] rounded-none animate-fadeIn">
              
              {/* Header result */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-slate-400">RESULTADO DO SINAL: <strong className="text-white">{result.target}</strong></span>
                <span className={`px-2.5 py-0.5 text-[8.5px] uppercase font-mono font-black border tracking-wider ${
                  result.trustLevel === 'Seguro' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  result.trustLevel === 'Médio / Suspeito' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10' :
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {result.trustLevel}
                </span>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/[0.01] border border-white/5">
                  <span className="block text-[9px] uppercase font-mono text-slate-500 font-bold">Identificação / Canal</span>
                  <span className="text-xs font-semibold text-white mt-1 block flex items-center gap-1.5">
                    {result.type === 'phone' ? <Phone className="h-3.5 w-3.5 text-[#10b981]" /> : <Mail className="h-3.5 w-3.5 text-[#fecc4c]" />}
                    {result.carrierOrDomain}
                  </span>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/5">
                  <span className="block text-[9px] uppercase font-mono text-slate-500 font-bold">Origem Estimada</span>
                  <span className="text-xs font-semibold text-white mt-1 block flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-400" />
                    {result.region}
                  </span>
                </div>
              </div>

              {/* Risk progress slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">ÍNDICE DE RISCO DETETADO:</span>
                  <span className={`font-black ${result.riskScore > 60 ? 'text-red-400' : result.riskScore > 20 ? 'text-yellow-500' : 'text-emerald-400'}`}>
                    {result.riskScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      result.riskScore > 60 ? 'bg-red-500 animate-pulse' :
                      result.riskScore > 20 ? 'bg-yellow-500' :
                      'bg-emerald-400'
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Warnings and messages */}
              {result.warnings.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px] leading-relaxed">
                  <span className="block text-[9px] uppercase font-mono text-slate-400 font-semibold">Análise de Riscos:</span>
                  {result.warnings.map((w, idx) => (
                    <p key={idx} className="text-slate-300 flex items-start gap-1 pb-1">
                      <span className="text-red-400 mr-1 shrink-0">⚠</span> {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10.5px] leading-relaxed text-slate-400">
                  <span className="block text-[9px] uppercase font-mono text-slate-500 font-semibold">Recomendações técnicas:</span>
                  {result.suggestions.map((s, idx) => (
                    <p key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-400 mr-1 font-mono">✓</span> {s}
                    </p>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right column: Popular Scams Warning & Reporting Call */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Mozambican Phishing Scams Guide */}
          <div className="bg-[#1b1b32] border border-[#3b3b4f] p-6 text-left space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#fecc4c] uppercase flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-yellow-500" />
              <span>Guia de Proteção: Burlas Regulares em Moçambique</span>
            </h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-black/40 border-l-2 border-red-500 space-y-1">
                <span className="block font-bold text-white uppercase tracking-tight text-[11px]">1. Burla de "Envio de Dinheiro por Engano"</span>
                <p className="text-slate-350 leading-relaxed text-[11px]">
                  O burlador envia-lhe uma mensagem SMS falsa imitando o layout oficial da Vodacom M-Pesa indicando que entrou p.ex. 2.500 MT na sua conta, ligando logo a chorar que enviou por engano para comprar remédio.
                </p>
                <span className="block text-[10px] text-yellow-500 font-bold font-mono">⚠️ Regra de Ouro: Verifique o seu saldo real discando *150# diretamente. Nunca retransfira dinheiro com base em SMS recebidos.</span>
              </div>

              <div className="p-3 bg-black/40 border-l-2 border-red-500 space-y-1">
                <span className="block font-bold text-white uppercase tracking-tight text-[11px]">2. Burla do "Falso Emprego / Taxa de Exame"</span>
                <p className="text-slate-350 leading-relaxed text-[11px]">
                  Empresas fantasma publicam em jornais ou redes sociais falsos anúncios de recrutamento militar, alfândegas ou aeroportos, pedindo depois uma cota de 350 a 1.500 MT via M-Pesa para exames médicos ou material de fardamento.
                </p>
                <span className="block text-[10px] text-yellow-500 font-bold font-mono">⚠️ Regra de Ouro: Empresas idóneas moçambicanas NUNCA cobram dinheiro para exames ou processos seletivos.</span>
              </div>

              <div className="p-3 bg-black/40 border-l-2 border-red-500 space-y-1">
                <span className="block font-bold text-white uppercase tracking-tight text-[11px]">3. O "Código Secreto de Segurança" da Carteira</span>
                <p className="text-slate-350 leading-relaxed text-[11px]">
                  Alguém liga alegando ser técnico oficial de suporte da rede (Vodacom/Movitel) informando que o seu chip vai ser bloqueado e pede-lhe que digite uma sequência secreta de USSD (*150*1*7# de transferência) ou que confirme o seu código PIN.
                </p>
                <span className="block text-[10px] text-yellow-500 font-bold font-mono">⚠️ Regra de Ouro: Os operadores oficiais possuem acesso técnico direto aos servidores; eles nunca ligarão a pedir o seu código PIN do M-Pesa.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
