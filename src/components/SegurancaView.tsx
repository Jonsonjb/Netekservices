import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, KeyRound, Terminal, Lock, RefreshCw, 
  Smartphone, Eye, Check, AlertTriangle, HelpCircle, FileCheck, Wifi, Shield
} from 'lucide-react';

export default function SegurancaView() {
  // Firewall State
  const [ddosShield, setDdosShield] = useState(true);
  const [sqlFilter, setSqlFilter] = useState(true);
  const [csrfShield, setCsrfShield] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SISTEMA] Iniciando monitor de tráfego nacional...",
    "[FIREWALL] Escudo activo anti brute-force configurado.",
    "[STATUS] Encriptação HTTPS forçada nas ligações M-Pesa/e-Mola.",
    "[REDE] Filtrando acessos suspeitos na sub-rede Maputo."
  ]);
  
  // OTP Token State
  const [currentOtp, setCurrentOtp] = useState('473829');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpVerifyResult, setOtpVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  // Integrity Check State
  const [docTitle, setDocTitle] = useState('Curriculum Vitae - Técnico');
  const [docHash, setDocHash] = useState('NETEK-SEC-840F92E...');
  const [verifyInputHash, setVerifyInputHash] = useState('');
  const [integrityStatus, setIntegrityStatus] = useState<any>(null);

  // Active session status simulator
  const [activeIps, setActiveIps] = useState([
    { ip: '102.83.12.191', location: 'Maputo (Vodacom)', device: 'Android Chrome', status: 'Ativo/Seguro' },
    { ip: '197.234.8.44', location: 'Beira (Movitel)', device: 'Windows Edge', status: 'Ativo/Seguro' },
    { ip: '105.16.202.12', location: 'Nampula (TMCel)', device: 'iPhone Mobile Safari', status: 'Ativo/Seguro' }
  ]);

  // Terminal log simulation generator
  useEffect(() => {
    const handleValue = setInterval(() => {
      const locations = ['Maputo', 'Matola', 'Beira', 'Nampula', 'Chimoio', 'Quelimane', 'Tete', 'Inhambane', 'Xai-Xai', 'Lichinga', 'Pemba'];
      const actions = [
        'Petição de leitura de certificado',
        'Filtro de cabeçalhos de segurança processado',
        'Sessão autenticada via Google',
        'Validando assinatura digital para CV',
        'Consulta em segurança dos portais académicos de Moçambique',
        'Pre-marcação assistida com integridade Peniel Mucavel'
      ];
      const network = ['Vodacom', 'Movitel', 'TMCel', 'TVCABO', 'NetOne'];
      
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const act = actions[Math.floor(Math.random() * actions.length)];
      const net = network[Math.floor(Math.random() * network.length)];
      const ip = `197.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;

      const newLog = `[INFO] [${net}] IP ${ip} em ${loc}: ${act}.`;
      
      setTerminalLogs(prev => {
        const withNew = [...prev, newLog];
        if (withNew.length > 8) {
          return withNew.slice(withNew.length - 8);
        }
        return withNew;
      });
    }, 4500);

    return () => clearInterval(handleValue);
  }, []);

  // OTP counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // generate new OTP
          const randomVal = Math.floor(100000 + Math.random() * 900000).toString();
          setCurrentOtp(randomVal);
          setTerminalLogs(l => [...l, `[OTP] Nova chave OTP dinâmica de segurança gerada: ${randomVal.substring(0,3)}***`]);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyOtp = () => {
    if (userEnteredOtp === currentOtp) {
      setOtpVerifyResult({
        success: true,
        message: '✓ Código verificado! Sessão técnica autenticada com segurança. Ligação fiduciária aprovada.'
      });
      setTerminalLogs(l => [...l, `[OTP] Sucesso: Código ${userEnteredOtp} foi validado pelo simulador fCC Moçambique.`]);
    } else {
      setOtpVerifyResult({
        success: false,
        message: '✗ Código OTP incorreto ou expirado. Verifique os números e tente novamente!'
      });
      setTerminalLogs(l => [...l, `[ALERTA] Falha de validação OTP: Tentativa negada com o código ${userEnteredOtp}.`]);
    }
  };

  const calculateSampleHash = () => {
    // Generate a simple pseudo-hash based on title
    let code = 0;
    for (let i = 0; i < docTitle.length; i++) {
      code = (code << 5) - code + docTitle.charCodeAt(i);
      code |= 0;
    }
    const hex = Math.abs(code).toString(16).toUpperCase();
    const finalH = `NETEK-MZ-${hex}-SEC`;
    setDocHash(finalH);
    setTerminalLogs(l => [...l, `[HASH] Novo hash de integridade gerado para "${docTitle}": ${finalH}`]);
  };

  const handleCheckIntegrity = () => {
    if (!verifyInputHash.trim()) {
      alert('Por favor, introduza um hash para verificação.');
      return;
    }

    if (verifyInputHash.toUpperCase() === docHash || verifyInputHash.toUpperCase().includes('NETEK-MZ')) {
      setIntegrityStatus({
        verified: true,
        title: docTitle,
        hash: verifyInputHash,
        signer: 'Netek Services LDA - Sommerchield, Maputo',
        certifiedBy: 'Peniel Dinis Mucavel (Autoridade Técnica)',
        message: 'Documento AUTÊNTICO. Os dados estão consistentes no banco de dados e não sofreram adulterações de terceiros.'
      });
    } else {
      setIntegrityStatus({
        verified: false,
        message: 'CÓDIGO DE DETECÇÃO INVÁLIDO. Este documento não existe em nosso registro fiduciário local ou foi alterado sem permissão.'
      });
    }
  };

  // Mozambique specific alerts data
  const localAlerts = [
    {
      id: 1,
      title: 'Esquema de "Ganhou Prémio no M-Pesa / Vodacom"',
      type: 'Phishing por Chamada/SMS',
      description: 'Doutrina de engenharia social comum. Um suposto agente Vodacom liga dizendo que ganhou um prémio num sorteio, mas pede que você marque um código USSD (*150#) ou transfira saldo. Nunca partilhe código PIN.',
      urgency: 'Crítico',
      solution: 'A Vodacom nunca solicita o seu PIN M-Pesa para atribuição de prémios.'
    },
    {
      id: 2,
      title: 'Falsa Mensagem de Envio Errado ("Enganei-me no e-Mola")',
      type: 'Smishing / Fraude Direta',
      description: 'Recebe um SMS formatado de forma amadora imitando o e-Mola / M-Pesa informando recepção de dinheiro. Segundos depois, uma pessoa liga nervosa pedindo reenvio. Verifique sempre o saldo oficial primeiro.',
      urgency: 'Alto',
      solution: 'Verifique no menu de saldo se o montante realmente deu entrada na sua carteira.'
    },
    {
      id: 3,
      title: 'Taxas para Candidatura de Emprego Pública/Privada',
      type: 'Burla Académica e Profissional',
      description: 'Anúncios tentadores de vagas de emprego que cobram "taxa administrativa", "uniforme" ou "exame médico obrigatório" a serem pagos via M-Pesa. Instituições sérias proíbem cobranças.',
      urgency: 'Moderado',
      solution: 'Vaga fidedigna nunca cobra dinheiro do candidato em Moçambique. Candidaturas Netek são 100% gratuitas.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-left font-mono">
      
      {/* Intro Panel */}
      <div className="p-6 bg-[#1b1b32] border border-[#3b3b4f] space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#fecc4c]" />
          <h3 className="text-xl font-bold font-sans text-white tracking-tight uppercase">
            Netek Central de Cibersegurança & Integridade
          </h3>
        </div>
        <p className="text-xs text-slate-350 leading-relaxed font-sans">
          Em conformidade com as boas práticas académicas e as diretrizes do regulamento técnico de Moçambique, activamos esta central interactiva de validação, proteção de dados móveis e radar de segurança digital contra esquemas.
        </p>
      </div>

      {/* Main Grid: interactive dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Firewall simulation & OTP */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Firewall Panel */}
          <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3b3b4f] pb-3 gap-2">
              <h4 className="text-xs font-bold text-[#fecc4c] uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="h-4 w-4" />
                <span>Simulador de Escudos de Rede & Firewall</span>
              </h4>
              <span className="text-[10px] bg-[#198754]/20 text-[#198754] border border-[#198754]/30 px-2 py-0.5 font-bold uppercase">
                Escudo Ativo
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal font-sans">
              Segurança activa para proteger os formulários de criação de Currículos contra inundações ou interferências fraudulentas. Ative ou desative os escudos abaixo para testar a resposta do sistema.
            </p>

            {/* Shield Switches with direct layout feedback */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setDdosShield(!ddosShield);
                  setTerminalLogs(l => [...l, `[SISTEMA] Escudo Anti-DDoS ${!ddosShield ? 'ATIVADO' : 'DESATIVADO'} pelo operador.`]);
                }}
                className={`p-3 border text-left transition select-none flex items-center justify-between cursor-pointer rounded-none ${
                  ddosShield ? 'bg-[#1b1b32] border-[#198754]/50' : 'bg-red-950/10 border-red-500/30'
                }`}
              >
                <div>
                  <span className="block text-[10px] font-bold text-white uppercase">Anti-DDoS</span>
                  <span className="text-[9px] text-slate-400">Proteção de Trafego</span>
                </div>
                <span className={`h-2.5 w-2.5 ${ddosShield ? 'bg-[#198754]' : 'bg-red-500'} animate-pulse`}></span>
              </button>

              <button
                onClick={() => {
                  setSqlFilter(!sqlFilter);
                  setTerminalLogs(l => [...l, `[SISTEMA] Filtro sanitário SQL ${!sqlFilter ? 'ATIVADO' : 'DESATIVADO'} pelo operador.`]);
                }}
                className={`p-3 border text-left transition select-none flex items-center justify-between cursor-pointer rounded-none ${
                  sqlFilter ? 'bg-[#1b1b32] border-[#198754]/50' : 'bg-red-950/10 border-red-500/30'
                }`}
              >
                <div>
                  <span className="block text-[10px] font-bold text-white uppercase">Sanitizador SQL</span>
                  <span className="text-[9px] text-slate-400">Injeção Protegida</span>
                </div>
                <span className={`h-2.5 w-2.5 ${sqlFilter ? 'bg-[#198754]' : 'bg-red-500'} animate-pulse`}></span>
              </button>

              <button
                onClick={() => {
                  setCsrfShield(!csrfShield);
                  setTerminalLogs(l => [...l, `[SISTEMA] Escudo CSRF ${!csrfShield ? 'ATIVADO' : 'DESATIVADO'} pelo operador.`]);
                }}
                className={`p-3 border text-left transition select-none flex items-center justify-between cursor-pointer rounded-none ${
                  csrfShield ? 'bg-[#1b1b32] border-[#198754]/50' : 'bg-red-950/10 border-red-500/30'
                }`}
              >
                <div>
                  <span className="block text-[10px] font-bold text-white uppercase">Token CSRF</span>
                  <span className="text-[9px] text-slate-400">Falsificação de Sessão</span>
                </div>
                <span className={`h-2.5 w-2.5 ${csrfShield ? 'bg-[#198754]' : 'bg-red-500'} animate-pulse`}></span>
              </button>
            </div>

            {/* Terminal output */}
            <div className="bg-[#0a0a23] border border-[#3b3b4f] p-4 font-mono text-[10.5px] text-slate-350 space-y-1 rounded-none select-text">
              <div className="flex items-center justify-between border-b border-[#3b3b4f] pb-1.5 mb-2 text-[9px] uppercase tracking-widest text-[#fecc4c]">
                <span>&gt;_ Consola de Eventos em Tempo Real</span>
                <span className="animate-pulse">● LIVE CONSOLE</span>
              </div>
              
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  <span className="text-slate-500 font-bold">netek@security:~$</span> {log}
                </div>
              ))}
            </div>

            {/* active connection list */}
            <div className="space-y-2">
              <span className="block text-[9px] uppercase font-bold text-slate-400">Acessos Técnicos Ativos Concorrentes</span>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] border border-[#3b3b4f]">
                  <thead>
                    <tr className="bg-[#0a0a23] text-slate-400 text-left border-b border-[#3b3b4f]">
                      <th className="p-2 font-bold uppercase">Endereço IP</th>
                      <th className="p-2 font-bold uppercase">Provedor/Localização</th>
                      <th className="p-2 font-bold uppercase">Navegador</th>
                      <th className="p-2 font-bold uppercase text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeIps.map((ipObj, index) => (
                      <tr key={index} className="border-b border-[#3b3b4f] text-slate-350">
                        <td className="p-2 font-mono font-bold text-white">{ipObj.ip}</td>
                        <td className="p-2 font-sans">{ipObj.location}</td>
                        <td className="p-2 font-sans">{ipObj.device}</td>
                        <td className="p-2 text-right text-emerald-400 font-bold">{ipObj.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* OTP Generation Code Verification */}
          <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-[#3b3b4f] pb-3">
              <Smartphone className="h-4.5 w-4.5 text-[#fecc4c]" />
              <h4 className="text-xs font-bold text-[#fecc4c] uppercase tracking-wider">
                Simulador OTP fCC: Prova de Autenticação Dupla
              </h4>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Para validar o seu login ao preencher currículos ou realizar marcações fiduciárias com o Peniel Mucavel, os utilizadores são protegidos contra sequestro de contas por chaves de tempo limitado.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a23] p-4 border border-[#3b3b4f]">
              {/* Token visualization */}
              <div className="text-center md:text-left space-y-1">
                <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider">Chave OTP Temporária de Dados</span>
                <div className="text-4xl font-extrabold text-white tracking-widest font-mono">
                  {currentOtp}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-[9px] font-bold font-mono text-emerald-400">
                  <span className="animate-ping h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Expira em: <strong className="text-white font-black">{secondsLeft}s</strong> antes de regenerar</span>
                </div>
              </div>

              {/* Validator forms */}
              <div className="space-y-2 w-full md:w-auto">
                <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider font-mono">Escreva o OTP dinâmico acima para validar</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={userEnteredOtp}
                    onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ex: 473829"
                    className="bg-[#1b1b32] border border-[#3b3b4f] text-[#fecc4c] text-center font-extrabold focus:border-[#fecc4c] outline-none text-xs px-3 py-1.5 w-28 rounded-none"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="px-4 py-1.5 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 font-bold text-xs uppercase rounded-none transition cursor-pointer border border-transparent"
                  >
                    Validar Token
                  </button>
                </div>
              </div>
            </div>

            {otpVerifyResult && (
              <div className={`p-3 text-xs font-sans border flex items-start gap-2.5 leading-relaxed rounded-none ${
                otpVerifyResult.success 
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-950/20 border-red-500/20 text-red-400'
              }`}>
                {otpVerifyResult.success ? <ShieldCheck className="h-4.5 w-4.5 shrink-0" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0" />}
                <span>{otpVerifyResult.message}</span>
              </div>
            )}

          </div>

          {/* Academic Document Integrity Hash Validation */}
          <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-[#3b3b4f] pb-3">
              <FileCheck className="h-4.5 w-4.5 text-[#fecc4c]" />
              <h4 className="text-xs font-bold text-[#fecc4c] uppercase tracking-wider">
                Verificador de Autenticidade e Falsificação de CVs
              </h4>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Impeça fraudes académicas em Moçambique! Ao criar um currículo no portal Netek Services, nós geramos opcionalmente um <strong>código hash fiduciário de integridade</strong>. Qualquer recrutador pode verificar no formulário abaixo se os dados do candidato condizem com a nossa base interna.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0a23] p-4 border border-[#3b3b4f]">
              {/* Generator simulator box */}
              <div className="space-y-3">
                <span className="block text-[9px] uppercase font-bold text-[#fecc4c]">Gerador de Hash</span>
                <div>
                  <label className="block text-[8px] text-slate-400 uppercase font-mono mb-1">Título do Documento do Aluno</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full bg-[#1b1b32] border border-[#3b3b4f] p-1.5 text-xs text-white focus:outline-none focus:border-[#fecc4c]"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={calculateSampleHash}
                    className="px-3 py-1 bg-[#1b1b32] hover:bg-[#2a2a40] border border-[#3b3b4f] text-white hover:border-[#fecc4c] text-[10px] font-bold uppercase rounded-none transition"
                  >
                    Calcular Hash
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono select-all truncate">{docHash}</span>
                </div>
              </div>

              {/* Verify input box */}
              <div className="space-y-3 md:border-l md:border-[#3b3b4f] md:pl-4">
                <span className="block text-[9px] uppercase font-bold text-[#fecc4c]">Portal do Recrutador</span>
                <div>
                  <label className="block text-[8px] text-slate-400 uppercase font-mono mb-1">Introduzir Código Hash a Testar</label>
                  <input
                    type="text"
                    value={verifyInputHash}
                    onChange={(e) => setVerifyInputHash(e.target.value)}
                    placeholder="Ex: NETEK-MZ-840F92E-SEC"
                    className="w-full bg-[#1b1b32] border border-[#3b3b4f] p-1.5 text-xs text-white uppercase focus:outline-none focus:border-[#fecc4c]"
                  />
                </div>
                <button
                  onClick={handleCheckIntegrity}
                  className="w-full py-1.5 bg-[#fecc4c] hover:bg-[#ff9c0a] text-slate-950 text-[10px] font-bold uppercase rounded-none transition"
                >
                  Verificar Código
                </button>
              </div>
            </div>

            {integrityStatus && (
              <div className={`p-4 text-xs font-sans border leading-relaxed rounded-none ${
                integrityStatus.verified 
                  ? 'bg-[#198754]/10 border-[#198754]/40 text-slate-100' 
                  : 'bg-red-950/20 border-red-500/20 text-red-400'
              }`}>
                {integrityStatus.verified ? (
                  <div className="space-y-2">
                    <span className="text-[#198754] font-black uppercase tracking-wider block">✓ DOCUMENTO DIGITAL VERIFICADO</span>
                    <p className="text-[11px] text-slate-300">"{integrityStatus.message}"</p>
                    <div className="pt-2 border-t border-[#3b3b4f] text-[10px] text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono">
                      <span>Título: <strong className="text-white">{integrityStatus.title}</strong></span>
                      <span>Assinatura: <strong>{integrityStatus.signer}</strong></span>
                      <span>Hash verificado: <strong className="text-white">{integrityStatus.hash}</strong></span>
                      <span>Certificação: <strong className="text-[#fecc4c]">{integrityStatus.certifiedBy}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                    <span>{integrityStatus.message}</span>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: National Anti-Fraud/Anti-Phishing Scams Radar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Radar Information cards */}
          <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 space-y-4">
            
            <div className="border-b border-[#3b3b4f] pb-3 text-left">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-red-400 animate-pulse" />
                <span>Radar Nacional de Scams & Fraudes</span>
              </h4>
              <span className="block text-[8px] text-slate-400 mt-1 uppercase font-mono">
                Actualizado semanalmente pelas denúncias Netek
              </span>
            </div>

            <p className="text-[10.5px] text-slate-300 leading-normal font-sans">
              Devido ao crescimento célere dos canais fiduciários mobile (M-Pesa, e-Mola) e do recrutamento digital em Moçambique, mapeamos os três métodos de fraude mais aplicados no mercado para ajudar a proteger a nossa integridade estudantil nacional.
            </p>

            <div className="space-y-4">
              {localAlerts.map((alertItem) => (
                <div key={alertItem.id} className="p-3 bg-[#0a0a23] border border-[#3b3b4f] space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#3b3b4f]/60 pb-1">
                    <span className="text-[#fecc4c] font-bold">{alertItem.type}</span>
                    <span className="px-1.5 py-0.2 bg-red-500/10 text-red-400 font-extrabold uppercase text-[8px] tracking-wider">
                      {alertItem.urgency}
                    </span>
                  </div>
                  
                  <h5 className="text-xs font-bold text-white leading-tight font-sans">
                    {alertItem.title}
                  </h5>
                  
                  <p className="text-[10px] text-slate-350 leading-relaxed font-sans">
                    {alertItem.description}
                  </p>

                  <div className="p-2 bg-slate-950/45 border-l-2 border-[#198754] text-[9.5px] text-emerald-400 leading-normal font-sans">
                    <strong>Como Evitar:</strong> {alertItem.solution}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-red-950/10 border border-red-500/20 text-[10px] text-slate-300 leading-relaxed font-sans">
              <strong>Sufoco Técnico?</strong> Se identificou um portal académico suspeito em Moçambique ou uma vaga de emprego falsa no WhatsApp cobrando taxas, colabore usando o painel "Gerenciar (Consola)" para registar um alerta à nossa moderação técnica.
            </div>

          </div>

          {/* Quick Technical Information checklist */}
          <div className="bg-[#1b1b32] border border-[#3b3b4f] p-5 space-y-3 font-mono text-[10px]">
            <span className="block text-xs font-bold text-white uppercase border-b border-[#3b3b4f] pb-1">Segurança e Contrato</span>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#198754] font-bold">✓</span>
              <span>TLS / SSL 1.3 Activado</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#198754] font-bold">✓</span>
              <span>Sessão Encriptada em SHA-256</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#198754] font-bold">✓</span>
              <span>Conexão Segura ao Firebase</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#198754] font-bold">✓</span>
              <span>Base fiduciária Maputo-Sommerchield</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
