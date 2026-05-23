import React, { useState, useEffect } from 'react';
import { CvProfile, LetterRequest } from '../types';
import { 
  User, PlusCircle, Trash2, Send, FileText, Sparkles, Languages, Download, 
  Award, CheckCircle2, MessageSquare, MapPin, Calendar, Briefcase, GraduationCap, Copy, ChevronRight, HelpCircle,
  Cloud, Save, Trash, ArrowUpRight, FolderOpen, LogIn, Key, Loader2, Sparkle
} from 'lucide-react';
import { AppUser, saveDocument, fetchDocuments, deleteDocument } from '../firebase';

interface CvCartasViewProps {
  user: AppUser | null;
  onLogin: () => void;
}

export default function CvCartasView({ user, onLogin }: CvCartasViewProps) {
  const [activeSegment, setActiveSegment] = useState<'cv' | 'cartas' | 'propostas' | 'contratos'>('cv');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Database / State for User Documents in Cloud Database
  const [savedDocs, setSavedDocs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [docTitleInput, setDocTitleInput] = useState('');
  const [cloudMessage, setCloudMessage] = useState<{ text: string; type: 'success' | 'err' | 'info' } | null>(null);

  // ==================== 1. CV CREATOR STATE & LOGIC ====================
  const [cvForm, setCvForm] = useState<CvProfile>({
    fullName: '',
    professionTitle: '',
    phone: '',
    email: '',
    location: 'Maputo',
    gender: 'Masculino',
    birthDate: '',
    objective: 'Desejo integrar a vossa equipa para contribuir com os meus conhecimentos práticos nas tecnologias digitais, promovendo dedicação, aprendizagem contínua e resultados de alta excelência.',
    education: [
      { institution: 'Escola Secundária Josina Machel', course: 'Ensino Geral (12ª Classe)', yearStarted: '2022', yearEnded: '2024' }
    ],
    experience: [
      { company: 'Loja Soluções Maputo', position: 'Assistente Técnico Geral', duration: '6 Meses', mainTasks: 'Atendimento ao cliente, inventariado de mercadorias no Excel e auxílio na instalação de softwares.' }
    ],
    skills: ['Manutenção Computadores', 'Operação de Excel', 'Formatação Windows', 'Internet de Baixo Consumo'],
    languages: ['Português (Fluente)', 'Inglês Basico']
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  // Education dynamics
  const handleAddEducation = () => {
    setCvForm({
      ...cvForm,
      education: [...cvForm.education, { institution: '', course: '', yearStarted: '', yearEnded: '' }]
    });
  };

  const handleRemoveEducation = (index: number) => {
    if (cvForm.education.length === 1) return;
    setCvForm({
      ...cvForm,
      education: cvForm.education.filter((_, idx) => idx !== index)
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updated = cvForm.education.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setCvForm({ ...cvForm, education: updated });
  };

  // Experience dynamics
  const handleAddExperience = () => {
    setCvForm({
      ...cvForm,
      experience: [...cvForm.experience, { company: '', position: '', duration: '', mainTasks: '' }]
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (cvForm.experience.length === 1) return;
    setCvForm({
      ...cvForm,
      experience: cvForm.experience.filter((_, idx) => idx !== index)
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updated = cvForm.experience.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setCvForm({ ...cvForm, experience: updated });
  };

  // Add skill or language
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setCvForm({
      ...cvForm,
      skills: [...cvForm.skills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCvForm({
      ...cvForm,
      skills: cvForm.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return;
    setCvForm({
      ...cvForm,
      languages: [...cvForm.languages, newLanguage.trim()]
    });
    setNewLanguage('');
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setCvForm({
      ...cvForm,
      languages: cvForm.languages.filter(l => l !== langToRemove)
    });
  };

  // Sync state transitions when an authenticated user is identified
  useEffect(() => {
    if (user) {
      loadDocuments();
    } else {
      setSavedDocs([]);
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    setIsLoadingDocs(true);
    try {
      const docs = await fetchDocuments(user.uid);
      setSavedDocs(docs);
    } catch (e) {
      console.error("Erro ao ler documentos: ", e);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!user) return;
    setIsSaving(true);
    const cleanTitle = docTitleInput.trim() || (
      activeSegment === 'cv' ? 'O Meu Curriculum Vitae' :
      activeSegment === 'cartas' ? 'A Minha Carta de Apresentação' :
      activeSegment === 'propostas' ? 'A Minha Proposta de Emprego' : 'O Meu Contrato Registado'
    );
    
    showCloudMsg("A registar o documento na sua base de dados...", "info");

    const docId = `doc_${user.uid}_${Date.now()}`;
    const docData = {
      id: docId,
      userId: user.uid,
      type: activeSegment,
      title: cleanTitle,
      content: activeSegment === 'cv' ? cvForm : (activeSegment === 'cartas' ? letterForm : (activeSegment === 'propostas' ? proposalForm : contractForm)),
      updatedAt: new Date().toISOString()
    };

    try {
      await saveDocument(docData);
      setDocTitleInput('');
      showCloudMsg("Guardado perfeitamente! Disponível em qualquer dispositivo.", "success");
      await loadDocuments();
    } catch (e) {
      showCloudMsg("Falha ao sincronizar com a nuvem.", "err");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDocument = (doc: any) => {
    if (doc.type === 'cv') {
      setCvForm(doc.content);
      setActiveSegment('cv');
      showCloudMsg(`Curriculum "${doc.title}" carregado e pronto!`, "success");
    } else if (doc.type === 'cartas') {
      setLetterForm(doc.content);
      setActiveSegment('cartas');
      showCloudMsg(`Carta "${doc.title}" carregada e pronta!`, "success");
    } else if (doc.type === 'propostas') {
      setProposalForm(doc.content);
      setActiveSegment('propostas');
      showCloudMsg(`Proposta "${doc.title}" carregada e pronta!`, "success");
    } else if (doc.type === 'contratos') {
      setContractForm(doc.content);
      setActiveSegment('contratos');
      showCloudMsg(`Contrato "${doc.title}" carregado e pronto!`, "success");
    }
  };

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Deseja apagar este rascunho guardado permanentemente?")) return;
    try {
      await deleteDocument(id);
      showCloudMsg("Rascunho descartado da base de dados.", "info");
      await loadDocuments();
    } catch (err) {
      showCloudMsg("Incapaz de apagar registo.", "err");
    }
  };

  const showCloudMsg = (message: string, type: 'success' | 'err' | 'info') => {
    setCloudMessage({ text: message, type });
    setTimeout(() => setCloudMessage(null), 4000);
  };


  // WhatsApp CV submission
  const getWhatsAppCvPayload = () => {
    const phone = '258835109190';
    let payload = `*SOLICITAÇÃO DE ELABORAÇÃO DE CV PROFISSIONAL - NETEK*\n\n`;
    payload += `*DADOS PESSOAIS:*\n`;
    payload += `• *Nome Completo:* ${cvForm.fullName || 'Não preenchido'}\n`;
    payload += `• *Profissão Pretendida:* ${cvForm.professionTitle || 'Não preenchido'}\n`;
    payload += `• *Contacto Móvel:* ${cvForm.phone || 'Não preenchido'}\n`;
    payload += `• *Email:* ${cvForm.email || 'Não preenchido'}\n`;
    payload += `• *Província/Cidade:* ${cvForm.location}\n`;
    payload += `• *Género:* ${cvForm.gender}\n`;
    payload += `• *Data de Nascimento:* ${cvForm.birthDate || 'Não especificada'}\n\n`;

    payload += `*OBJETIVO PROFISSIONAL:*\n_${cvForm.objective}_\n\n`;

    payload += `*HISTÓRIA ACADÉMICA:*\n`;
    cvForm.education.forEach((edu, idx) => {
      payload += `${idx + 1}. *Curso:* ${edu.course || 'N/A'}\n   *Instituição:* ${edu.institution || 'N/A'} (${edu.yearStarted} - ${edu.yearEnded || 'Presente'})\n`;
    });
    payload += `\n`;

    payload += `*EXPERIÊNCIA PROFISSIONAL:*\n`;
    cvForm.experience.forEach((exp, idx) => {
      payload += `${idx + 1}. *Cargo:* ${exp.position || 'N/A'} - *Empresa:* ${exp.company || 'N/A'}\n   *Duração:* ${exp.duration}\n   *Tarefas:* ${exp.mainTasks || 'N/A'}\n`;
    });
    payload += `\n`;

    payload += `*HABILIDADES TÉCNICAS:*\n${cvForm.skills.join(', ')}\n\n`;
    payload += `*IDIOMAS:*\n${cvForm.languages.join(', ')}\n\n`;
    payload += `Olá Netek, acabei de submeter os meus dados estruturados no vosso formulário. Solicito que avaliem e elaborem a versão final em PDF Premium estilizado por WhatsApp. Kanimambo!`;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(payload)}`;
  };


  // ==================== 2. LETTER CONTEXTS & PRESETS ====================
  const [letterForm, setLetterForm] = useState<LetterRequest>({
    senderName: '',
    senderAddress: 'Bairro Central, Cidade de Maputo',
    senderContact: '',
    recipientName: 'Exmo. Senhor Director dos Recursos Humanos',
    recipientAddress: 'Vodacom Moçambique, S.A.\nRua do Sol, Sommerchield\nMaputo',
    positionTitle: 'Técnico Administrador de Sistemas de Dados',
    reasonForApplication: 'candidatar-me formalmente à vaga de estágio técnico anunciada recentemente nas vossas redes sociais oficiais',
    skillsToHighlight: 'forte orientação para solução de problemas técnicos, domínio elementar de Excel, facilidade no manuseamento de impressoras e redes e certificado em IA de produtividade digital pela Netek Services',
    letterType: 'pedido'
  });

  const LETTER_PRESETS = [
    {
      id: 'pedido',
      label: 'Carta de Pedido de Emprego',
      description: 'Modelo tradicional com fecho de deferimento, amplamente aceito no setor público e privado.'
    },
    {
      id: 'espontanea',
      label: 'Candidatura Espontânea',
      description: 'Apresentação pró-ativa das suas habilidades, mesmo sem vaga oficialmente publicada.'
    },
    {
      id: 'estagio',
      label: 'Solicitação de Estágio',
      description: 'Foco em potencial académico, dedicação e vontade de estagiar de forma remunerada ou voluntária.'
    }
  ];

  const handlePresetSelect = (typeId: any) => {
    let reason = '';
    let objTitle = '';
    if (typeId === 'pedido') {
      reason = 'candidatar-me formalmente à oportunidade de Emprego para Técnico Geral, colocando à vossa disposição o meu currículo e forte empenho técnico';
      objTitle = 'Técnico de Redes e Apoio Geral';
    } else if (typeId === 'espontanea') {
      reason = 'apresentar a minha candidatura espontânea para fazer parte do vosso banco de dados técnico. Tenho profunda admiração pelos vossos serviços e gostava de colaborar';
      objTitle = 'Assistente de Suporte Tecnológico';
    } else if (typeId === 'estagio') {
      reason = 'solicitar uma vaga de Estágio Profissional sob a vossa supervisão, visando aplicar na prática os meus estudos teóricos de sistemas informáticos e impulsionar resultados';
      objTitle = 'Estagiário de Tecnologias Digitais';
    }

    setLetterForm({
      ...letterForm,
      letterType: typeId,
      reasonForApplication: reason,
      positionTitle: objTitle
    });
  };

  const getComputedLetterContent = () => {
    const sender = letterForm.senderName || '[O Seu Nome Completo]';
    const senderAddr = letterForm.senderAddress || '[O Seu Endereço/Bairro]';
    const senderPhone = letterForm.senderContact || '[O Seu Contacto]';
    const recipient = letterForm.recipientName || 'Exmo. Senhor Director Geral';
    const recipientAddr = letterForm.recipientAddress || '[Endereço do Destinatário/Empresa]';
    const position = letterForm.positionTitle || '[Cargo Desejado]';
    const reason = letterForm.reasonForApplication || '[Motivo do requerimento]';
    const skills = letterForm.skillsToHighlight || '[Competências para destacar]';

    const localDate = new Date();
    const formattedDate = `Maputo, ${localDate.getDate()} de Maio de 2026`;

    return `De:\n${sender}\n${senderAddr}\nContacto: ${senderPhone}\n\nPara:\n${recipient}\n${recipientAddr}\n\nAssunto: Pedido de Emprego para a vaga de ${position}\n\n${formattedDate}\n\nExmo. Senhor,\n\nVenho por meio desta carta com o devido respeito ${reason}.\n\nTendo o privilégio de me candidatar, sublinho que detenho competências em ${skills}. Considero-me um profissional dedicado, disciplinado e focado na resolução ágil de desafios sob pressão.\n\nAcredito que a vossa instituição oferece o ecossistema ideal para aprimorar os meus conhecimentos práticos, ao passo que garanto total responsabilidade e prontidão em cumprir com zelo as metas traçadas.\n\nAnexo a este pedido o meu Curriculum Vitae para a vossa apreciação pormenorizada. Estou disponível para uma entrevista pessoal ou avaliação de aptidões a qualquer momento conveniente.\n\nSem mais de momento, apresento os meus mais respeitosos cumprimentos.\n\nNestes termos,\n\nPede Deferimento e Atenciosamente,\n\n___________________________________\n${sender}`;
  };

  const getWhatsAppLetterPayload = () => {
    const phone = '258835109190';
    let payload = `*SOLICITAÇÃO DE ELABORAÇÃO DE CARTA DE CANDIDATURA - NETEK*\n\n`;
    payload += `*DADOS DO REMETENTE (CLIENTE):*\n`;
    payload += `• *Nome Completo:* ${letterForm.senderName || 'Não preenchido'}\n`;
    payload += `• *Contacto Directo:* ${letterForm.senderContact || 'Não preenchido'}\n`;
    payload += `• *Bairro/Morada:* ${letterForm.senderAddress}\n\n`;

    payload += `*DESTINATÁRIO E VAGA:*\n`;
    payload += `• *Para Quem Dirige:* ${letterForm.recipientName}\n`;
    payload += `• *Morada da Empresa:* ${letterForm.recipientAddress}\n`;
    payload += `• *Cargo Almejado:* ${letterForm.positionTitle}\n\n`;

    payload += `*DETALHES DA CANDIDATURA:*\n`;
    payload += `• *Razão do Pedido:* ${letterForm.reasonForApplication}\n`;
    payload += `• *Destaques de Aptidão:* ${letterForm.skillsToHighlight}\n\n`;

    payload += `*TEXTO DA CARTA GERADO AUTOMATICAMENTE:*\n`;
    payload += `\`\`\`${getComputedLetterContent()}\`\`\`\n\n`;
    payload += `Olá Netek, gerei a minha carta através do vosso portal de automação. Peço que criem este documento em suporte PDF timbrado formal para eu submeter. Kanimambo!`;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(payload)}`;
  };

  // ==================== 3. PROPOSALS FORM STATE & LOGIC ====================
  const [proposalForm, setProposalForm] = useState({
    companyName: 'Netek Services LDA',
    companyContact: 'netekservice@gmail.com',
    candidateName: '',
    candidateContact: '',
    positionTitle: 'Técnico de Suporte TI & Operações M-Pesa',
    salary: '18.500 MT / Mês',
    workLocation: 'Sommerchield, Maputo, Moçambique',
    startDate: '01 de Junho de 2026',
    benefits: 'Acesso grátis aos laboratórios Netek, comissões de transação fiduciária, seguro de acidentes de trabalho e subsídio de refeição.',
    responsibilities: '1. Dar suporte local de computação a estudantes e munícipes;\n2. Realizar conciliações diárias de quotas de serviço;\n3. Executar tarefas administrativas de correio físico.'
  });

  const getComputedProposalContent = () => {
    const comp = proposalForm.companyName || '[Nome da Organização]';
    const compContact = proposalForm.companyContact || '[Contacto da Organização]';
    const cand = proposalForm.candidateName || '[Nome do Candidato Selecionado]';
    const candContact = proposalForm.candidateContact || '[Contacto do Candidato]';
    const pos = proposalForm.positionTitle || '[Cargo / Função]';
    const sal = proposalForm.salary || '[Oferta Salarial]';
    const loc = proposalForm.workLocation || '[Local de Trabalho]';
    const dateStart = proposalForm.startDate || '[Data de Início]';
    const ben = proposalForm.benefits || '[Benefícios Adicionais / Regalias]';
    const resp = proposalForm.responsibilities || '[Principais Deveres e Atribuições]';

    return `PROPOSTA FORMAL DE CONTRATAÇÃO DE EMPREGO\n\nEmitido por: ${comp}\nContacto: ${compContact}\nPara: ${cand}\nContacto do Candidato: ${candContact}\n\nPrezado(a) ${cand},\n\nTemos o enorme prazer de apresentar esta proposta formal de contratação para integrar a nossa equipa de trabalho em Moçambique no cargo de ${pos}.\n\nAbaixo discriminamos os termos e condições estruturais desta oferta de emprego:\n\n• Cargo / Função: ${pos}\n• Local de Trabalho: ${loc}\n• Data de Início das Funções: ${dateStart}\n• Compensação Salarial Base: ${sal}\n\n• Regalias & Benefícios Propostos:\n${ben}\n\n• Responsabilidades & Atribuições Clínicas do Posto:\n${resp}\n\nEsta proposta está sujeita à apresentação dos seus documentos oficiais de identificação em vigor (BI, NUIT, Declaração de Residência) e à assinatura do respetivo instrumento de contrato de trabalho legal.\n\nFicamos a aguardar a sua confirmação e manifestação de interesse face a esta oportunidade profissional.\n\nAtenciosamente,\n\n___________________________________\nRecursos Humanos e Administração\n${comp}`;
  };

  const getWhatsAppProposalPayload = () => {
    const phone = '258835109190';
    let payload = `*SOLICITAÇÃO DE ELABORAÇÃO DE PROPOSTA DE EMPREGO - NETEK*\n\n`;
    payload += `• *Empresa Emitente:* ${proposalForm.companyName}\n`;
    payload += `• *Candidato Alvo:* ${proposalForm.candidateName || 'Não preenchido'}\n`;
    payload += `• *Cargo Proposto:* ${proposalForm.positionTitle}\n`;
    payload += `• *Salário Oferecido:* ${proposalForm.salary}\n`;
    payload += `• *Início Previsto:* ${proposalForm.startDate}\n\n`;
    payload += `*TEXTO DA PROPOSTA GERADO:*\n`;
    payload += `\`\`\`${getComputedProposalContent()}\`\`\`\n\n`;
    payload += `Olá Netek, elaborei uma proposta de contratação no vosso sistema. Peço que gerem o documento PDF elegante para emissão formal. Kanimambo!`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(payload)}`;
  };

  // ==================== 4. CONTRACTS FORM STATE & LOGIC ====================
  const [contractForm, setContractForm] = useState({
    employerName: 'Netek Services LDA',
    employerAddress: 'Avenida Julius Nyerere, Sommerchield, Maputo, Moçambique',
    employeeName: '',
    employeeId: 'BI nº 109283120 M',
    employeeAddress: 'Bairro Central, Cidade de Maputo',
    duration: '12 Meses (Prazo Certo Renovável)',
    clauseSalary: '20.000 MT (Vinte Mil Meticais pagos via M-Pesa / Banco)',
    clauseSchedule: 'Segunda a Sexta-Feira, Das 08h00 às 17h00',
    probationPeriod: '3 Meses (Noventa Dias de Período de Experiência)'
  });

  const getComputedContractContent = () => {
    const emp = contractForm.employerName || '[Nome da Entidade Contratante]';
    const empAddr = contractForm.employerAddress || '[Morada/Morada Completa do Empregador]';
    const worker = contractForm.employeeName || '[Nome Completo do Trabalhador/Técnico]';
    const workerId = contractForm.employeeId || '[Número de Documento / BI / NUIT]';
    const workerAddr = contractForm.employeeAddress || '[Residência / Bairro]';
    const dur = contractForm.duration || '[Vigência do Contrato]';
    const salClause = contractForm.clauseSalary || '[Salário Base por Cláusula]';
    const sched = contractForm.clauseSchedule || '[Horário Semanal de Trabalho]';
    const prob = contractForm.probationPeriod || '[Período de Experiência]';

    const localDate = new Date();
    const formattedDate = `${localDate.getDate()} de Maio de 2026`;

    return `CONTRATO INDIVIDUAL DE TRABALHO COM PRAZO DETERMINADO\n\nEntre as partes abaixo assinadas:\n\nPRIMEIRA PARTE (Empregador): ${emp}\nCom sede em: ${empAddr}\n\nSEGUNDA PARTE (Trabalhador): ${worker}\nIdentificado por: ${workerId}\nResidente em: ${workerAddr}\n\nAs partes celebram, de mútuo acordo, este contrato de trabalho sujeito às seguintes cláusulas fundamentais:\n\nCLÁUSULA PRIMEIRA (Objeto & Duração):\nEste contrato destina-se a regular o rácio de colaboração onde o Trabalhador desempenhará funções subordinadas sob a égide do Empregador pelo período de ${dur}.\n\nCLÁUSULA SEGUNDA (Período de Experiência):\nFica estipulado um período de experiência correspondente a ${prob}, durante o qual qualquer das partes pode revogar o presente acordo sem aviso prévio.\n\nCLÁUSULA TERCEIRA (Horário de Trabalho):\nO Trabalhador obriga-se a prestar serviço semanal cumprindo o seguinte horário: ${sched}.\n\nCLÁUSULA QUARTA (Vencimento & Remuneração):\nComo contraprestação do trabalho realizado, o Empregador pagará de forma regular o salário mensal líquido de ${salClause}.\n\nCLÁUSULA QUINTA (Legislação Aplicável):\nPara todos os efeitos omissos neste documento, aplicar-se-ão estritamente as regras vigentes da Lei do Trabalho de Moçambique (Lei nº 23/2007).\n\nFeito em duplicado na Cidade de Maputo, aos ${formattedDate}.\n\nAssinaturas:\n\n___________________________________\nPelo Empregador (${emp})\n\n___________________________________\nPelo Trabalhador (${worker})`;
  };

  const getWhatsAppContractPayload = () => {
    const phone = '258835109190';
    let payload = `*SOLICITAÇÃO DE ELABORAÇÃO DE CONTRATO DE TRABALHO - NETEK*\n\n`;
    payload += `• *Empregador:* ${contractForm.employerName}\n`;
    payload += `• *Trabalhador:* ${contractForm.employeeName || 'Não preenchido'}\n`;
    payload += `• *Salário Cláusula:* ${contractForm.clauseSalary}\n`;
    payload += `• *Vigência:* ${contractForm.duration}\n\n`;
    payload += `*TEXTO DO CONTRATO GERADO:*\n`;
    payload += `\`\`\`${getComputedContractContent()}\`\`\`\n\n`;
    payload += `Olá Netek, preenchi os dados do contrato profissional sob a vossa assessoria técnica. Solicito a revisão jurídica de redação moçambicana e emissão do PDF final. Kanimambo!`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(payload)}`;
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(type);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="space-y-12 select-none">
      
      {/* Banner Header */}
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#22d3ee]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest font-black">Empregabilidade Inteligente Netek</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">
            Gerador de Curriculum Vitae (CV) & Cartas Formais
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            Aqui você não precisa preencher templates difíceis. Introduza os seus dados no formulário interactivo simples ao lado, veja o resultado ser desenhado em tempo real no visualizador de alta fidelidade e submeta-o ao nosso técnico via <strong>WhatsApp</strong> para receber um PDF perfeito na hora!
          </p>
        </div>
      </div>

      {/* Main Mode Toggle Tabs */}
      <div className="flex flex-wrap bg-[#05070a]/90 p-1.5 rounded-xl border border-white/10 w-full sm:w-auto self-start overflow-hidden gap-1">
        <button
          onClick={() => setActiveSegment('cv')}
          className={`px-4 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'cv' ? 'bg-[#22d3ee] text-slate-1000 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Criar Currículo (CV)</span>
        </button>
        <button
          onClick={() => setActiveSegment('cartas')}
          className={`px-4 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'cartas' ? 'bg-[#c084fc] text-slate-1000 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Cartas de Candidatura</span>
        </button>
        <button
          onClick={() => setActiveSegment('propostas')}
          className={`px-4 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'propostas' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>Propostas de Emprego</span>
        </button>
        <button
          onClick={() => setActiveSegment('contratos')}
          className={`px-4 py-2 rounded-lg font-bold uppercase text-[9px] tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'contratos' ? 'bg-emerald-400 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Contratos & Acordos</span>
        </button>
      </div>

      {/* Cloud Integration Dashboard Banner */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#22d3ee]/14 text-[#22d3ee] rounded-xl border border-[#22d3ee]/20 shrink-0 mt-1">
              <Cloud className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                Base de Dados Netek Cloud
                {user ? (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-bold">LIGADO</span>
                ) : (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase font-bold">DISPONÍVEL</span>
                )}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                Guarde, atualize e consulte as suas cartas de apresentação, currículos estruturados, propostas e contratos individuais a partir de qualquer dispositivo a qualquer hora.
              </p>
            </div>
          </div>

          {!user ? (
            <button
              onClick={onLogin}
              className="px-5 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <LogIn className="h-4 w-4" />
              <span>Autenticar com Google</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder={
                  activeSegment === 'cv' ? 'Ex: Currículo Assistente Redes' :
                  activeSegment === 'cartas' ? 'Ex: Carta para Vodacom' :
                  activeSegment === 'propostas' ? 'Ex: Proposta Especialista' : 'Ex: Contrato de Tiago'
                }
                value={docTitleInput}
                onChange={(e) => setDocTitleInput(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50 font-sans min-w-[200px]"
              />
              <button
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Salvar Rascunho</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Cloud Toast micro alerts */}
        {cloudMessage && (
          <div className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            cloudMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
            cloudMessage.type === 'err' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
            'bg-cyan-500/10 border border-[#22d3ee]/20 text-[#22d3ee]'
          }`}>
            <Sparkle className="h-3 w-3 animate-pulse" />
            <span>{cloudMessage.text}</span>
          </div>
        )}

        {/* List of Loaded Documents */}
        {user && (
          <div className="border-t border-white/5 pt-4 mt-2">
            <span className="text-[10px] font-mono text-[#c084fc] font-bold uppercase tracking-widest block mb-3">Os Seus Documentos Guardados ({savedDocs.length})</span>
            
            {isLoadingDocs ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#22d3ee]" />
                <span>A ler registos do banco de dados...</span>
              </div>
            ) : savedDocs.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">Sem rascunhos guardados ainda. Preencha o formulário e clique em "Salvar Rascunho" acima para registar.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {savedDocs.map((docItem) => (
                  <div
                    key={docItem.id}
                    onClick={() => handleLoadDocument(docItem)}
                    className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#22d3ee]/30 transition duration-300 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="space-y-1 overflow-hidden pr-2">
                      <div className="flex items-center gap-1.5">
                        {docItem.type === 'cv' ? (
                          <span className="text-[8px] font-mono font-bold bg-[#22d3ee]/10 text-[#22d3ee] px-1.5 py-0.5 rounded border border-[#22d3ee]/10 uppercase">CV</span>
                        ) : docItem.type === 'cartas' ? (
                          <span className="text-[8px] font-mono font-bold bg-[#c084fc]/10 text-[#c084fc] px-1.5 py-0.5 rounded border border-[#c084fc]/10 uppercase font-mono">CARTA</span>
                        ) : docItem.type === 'propostas' ? (
                          <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/10 uppercase">PROPOSTA</span>
                        ) : (
                          <span className="text-[8px] font-mono font-bold bg-emerald-555 bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-400/10 uppercase">CONTRATO</span>
                        )}
                        <span className="text-[11px] text-slate-400 hover:text-white font-bold tracking-tight truncate block max-w-[130px] font-sans">{docItem.title}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block font-mono">Atualizado {new Date(docItem.updatedAt).toLocaleDateString('pt-MZ')}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteDocument(docItem.id, e)}
                      title="Apagar registo na nuvem"
                      className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {copiedNotification && (
        <div className="bg-emerald-500/10 border border-emerald-555 text-emerald-300 p-4 rounded-xl text-xs flex items-center justify-between -mb-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>O seu rascunho de {copiedNotification === 'cv' ? 'Curriculum' : 'Carta de Candidatura'} foi copiado para a área de transferência!</span>
          </div>
          <button onClick={() => setCopiedNotification(null)} className="font-bold underline uppercase tracking-wider text-[10px]">Fechar</button>
        </div>
      )}

      {activeSegment === 'cv' ? (
        // ==================== CV INTERFACE ====================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CV INPUT FORM - Spans 5 cols */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[9px] font-mono text-[#22d3ee] uppercase font-black tracking-widest block">Passo-a-Passo Fácil</span>
              <h3 className="text-base font-bold text-white">Introduza os seus Dados Técnicos</h3>
              <p className="text-[11.5px] text-slate-400 mt-1">
                Todas as alterações são refletidas na folha de visualização do lado direito de forma imediata.
              </p>
            </div>

            {/* General Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Isaías Amadeu Langa"
                  value={cvForm.fullName}
                  onChange={(e) => setCvForm({ ...cvForm, fullName: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Profissão Pretendida / Área de Domínio *</label>
                <input
                  type="text"
                  placeholder="Ex: Operador de Caixa, Programador Júnior, Técnico de Redes"
                  value={cvForm.professionTitle}
                  onChange={(e) => setCvForm({ ...cvForm, professionTitle: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contacto Telefónico *</label>
                  <input
                    type="text"
                    placeholder="Ex: +258 84 999 1111"
                    value={cvForm.phone}
                    onChange={(e) => setCvForm({ ...cvForm, phone: e.target.value })}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contacto de Email</label>
                  <input
                    type="email"
                    placeholder="langa@gmail.com"
                    value={cvForm.email}
                    onChange={(e) => setCvForm({ ...cvForm, email: e.target.value })}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Província / Cidade *</label>
                  <select
                    value={cvForm.location}
                    onChange={(e) => setCvForm({ ...cvForm, location: e.target.value })}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#22d3ee] cursor-pointer"
                  >
                    <option value="Maputo">Maputo</option>
                    <option value="Beira">Beira (Sofala)</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Gaza / Xai-Xai">Gaza / Xai-Xai</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Tete">Tete</option>
                    <option value="Zambézia / Quelimane">Zambézia / Quelimane</option>
                    <option value="Cabo Delgado / Pemba">Cabo Delgado / Pemba</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Data de Nascimento</label>
                  <input
                    type="text"
                    placeholder="Ex: 24/09/2004"
                    value={cvForm.birthDate}
                    onChange={(e) => setCvForm({ ...cvForm, birthDate: e.target.value })}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Objetivo Curricular Breve</label>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={cvForm.objective}
                  onChange={(e) => setCvForm({ ...cvForm, objective: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#22d3ee] resize-none"
                />
              </div>
            </div>

            {/* Education Sub-section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#22d3ee]">Formação Académica</h4>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="text-[10px] text-[#22d3ee] hover:underline flex items-center gap-1 font-bold uppercase cursor-pointer"
                >
                  <PlusCircle className="h-3 w-3" /> Adicionar formação
                </button>
              </div>

              {cvForm.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2 relative">
                  {cvForm.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition text-[10px]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Curso / Grau (Ex: 12ª Classe, Licenciatura)"
                      value={edu.course}
                      onChange={(e) => handleEducationChange(idx, 'course', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Escola / Universidade"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Ano de Início"
                      value={edu.yearStarted}
                      onChange={(e) => handleEducationChange(idx, 'yearStarted', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Ano de Término (ou Presente)"
                      value={edu.yearEnded}
                      onChange={(e) => handleEducationChange(idx, 'yearEnded', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Sub-section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#22d3ee]">Experiência Profissional</h4>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="text-[10px] text-[#22d3ee] hover:underline flex items-center gap-1 font-bold uppercase cursor-pointer"
                >
                  <PlusCircle className="h-3 w-3" /> Adicionar Experiência
                </button>
              </div>

              {cvForm.experience.map((exp, idx) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2 relative">
                  {cvForm.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Cargo ocupado (Ex: Balconista)"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(idx, 'position', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Empresa (Ex: Pastelaria Maputo)"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Duração (Ex: 3 Meses, 1 Ano)"
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Breves tarefas executadas"
                      value={exp.mainTasks}
                      onChange={(e) => handleExperienceChange(idx, 'mainTasks', e.target.value)}
                      className="bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Dynamics */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#22d3ee]">Habilidades & Aptidões</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Word Avançado, Redes, Vendas"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-grow bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-[#22d3ee] hover:text-slate-950 font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {cvForm.skills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 text-[10px] text-slate-300 rounded font-mono">
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-400 hover:text-white font-bold ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Dynamics */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#22d3ee]">Idiomas</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Changana (Básico), Inglês (Médio)"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
                  className="flex-grow bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-[#22d3ee] hover:text-slate-950 font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {cvForm.languages.map((lang, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 text-[10px] text-slate-300 rounded font-mono">
                    <span>{lang}</span>
                    <button
                      onClick={() => handleRemoveLanguage(lang)}
                      className="text-red-400 hover:text-white font-bold ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Send Trigger Warning */}
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-amber-300 text-[10.5px] rounded-xl leading-relaxed">
              ⚠️ Certifique-se de carregar pelo menos o seu <strong>Nome</strong> e <strong>Telemóvel</strong> antes de clicar para enviar. Ao carregar, o seu WhatsApp se abrirá com os dados formatados!
            </div>
          </div>

          {/* RIGHT: PREMIUM VISUAL CV PREVIEW - Spans 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono">🔍 PRÉ-VISUALIZAÇÃO EM TEMPO REAL (PADRÃO PDF)</span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const txt = `CURRICULUM VITAE\n\nNOME: ${cvForm.fullName}\nPROFISSÃO: ${cvForm.professionTitle}\nTELEFONE: ${cvForm.phone}\nEMAIL: ${cvForm.email}\nPROVÍNCIA: ${cvForm.location}\nGÉNERO: ${cvForm.gender}\nNASCIMENTO: ${cvForm.birthDate}\n\nOBJETIVO:\n${cvForm.objective}\n\nFORMAÇÃO:\n` + cvForm.education.map(e => ` - ${e.course} | ${e.institution} (${e.yearStarted}-${e.yearEnded})`).join('\n') + `\n\nEXPERIÊNCIA:\n` + cvForm.experience.map(e => ` - ${e.position} | ${e.company} (${e.duration})\n   Tarefas: ${e.mainTasks}`).join('\n') + `\n\nHABILIDADES:\n${cvForm.skills.join(', ')}\n\nIDIOMAS:\n${cvForm.languages.join(', ')}`;
                    handleCopyText(txt, 'cv');
                  }}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copiar Rascunho</span>
                </button>
              </div>
            </div>

            {/* Premium Paper Simulator */}
            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-2xl p-8 space-y-8 select-text text-slate-300 relative overflow-hidden font-sans text-left">
              <div className="absolute top-0 left-0 w-2.5 h-full bg-[#22d3ee]"></div>
              
              {/* Profile Header */}
              <div className="border-b border-white/10 pb-6 pl-4">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">
                  {cvForm.fullName || '[Nome Completo do Candidato]'}
                </h2>
                <p className="text-[#22d3ee] font-mono text-xs mt-1.5 tracking-wider uppercase font-black">
                  {cvForm.professionTitle || '[Profissão Almejada]'}
                </p>

                {/* Sub-details line */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-slate-400 mt-4 pt-4 border-t border-white/5">
                  <div>
                    <span className="block text-[8px] uppercase font-mono text-[#22d3ee]">Contacto</span>
                    <span className="font-semibold text-white">{cvForm.phone || 'Pendência'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-mono text-[#22d3ee]">Correio Electrónico</span>
                    <span className="font-semibold text-white truncate max-w-[120px] inline-block">{cvForm.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-mono text-[#22d3ee]">Residência</span>
                    <span className="font-semibold text-white">{cvForm.location}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-mono text-[#22d3ee]">Nascimento</span>
                    <span className="font-semibold text-white">{cvForm.birthDate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Grid content inside simulated CV */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pl-4">
                {/* Left Mini Column (Objective, Skills, Languages) */}
                <div className="md:col-span-5 space-y-6 md:border-r border-white/5 md:pr-4">
                  
                  {/* Objective */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#22d3ee] font-mono">Objetivo</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed italic pr-2">
                      "{cvForm.objective || 'Desejo atuar como técnico focado na promoção de valor informático...'}"
                    </p>
                  </div>

                  {/* Skills/Habilidades */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#22d3ee] font-mono">Habilidades</h3>
                    <div className="flex flex-col gap-1.5 text-[11px]">
                      {cvForm.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-250">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]"></span>
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Idiomas */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#22d3ee] font-mono">Idiomas</h3>
                    <div className="flex flex-col gap-1.5 text-[11px]">
                      {cvForm.languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-250">
                          <span className="h-1 w-2 bg-[#c084fc]"></span>
                          <span>{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Major Column (Education, Experience) */}
                <div className="md:col-span-7 space-y-6">
                  
                  {/* Formacao */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#22d3ee] font-mono border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>Formação Académica</span>
                    </h3>
                    
                    <div className="space-y-3.5">
                      {cvForm.education.map((edu, idx) => (
                        <div key={idx} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-white">
                            <span>{edu.course || '[Nome do Curso]'}</span>
                            <span className="text-[#22d3ee] font-mono">{edu.yearStarted} - {edu.yearEnded || 'Presente'}</span>
                          </div>
                          <p className="text-[11px] text-[#c084fc] font-semibold">{edu.institution || '[Nome da Escola/Instituição]'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experiencia */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#22d3ee] font-mono border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>Percurso Profissional</span>
                    </h3>
                    
                    <div className="space-y-3.5">
                      {cvForm.experience.map((exp, idx) => (
                        <div key={idx} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-white">
                            <span>{exp.position || '[Cargo ocupado]'}</span>
                            <span className="text-[#c084fc] font-mono">{exp.duration}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-semibold">{exp.company || '[Nome da Empresa]'}</p>
                          {exp.mainTasks && (
                            <p className="text-[10px] text-slate-205 pl-2 border-l border-white/5 bg-white/[0.01] p-1.5 rounded">
                              {exp.mainTasks}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer certification badge standard */}
              <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 pl-4">
                <span>REQUISITO PREVISTO EM MOÇAMBIQUE</span>
                <span>DESENVOLVIDO FIDUCIARIAMENTE POR NETEK</span>
              </div>
            </div>

            {/* Launch Call to technical operator action */}
            <div className="p-4 bg-gradient-to-r from-[#22d3ee]/10 to-transparent border border-[#22d3ee]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-350 text-left">
                Os seus dados introduzidos serão compilados para o WhatsApp da Netek. O nosso especialista irá revisar a coerência, traduzir termos se necessário, diagramar o ficheiro PDF de forma premium e lhe mandar direto pelo chat por uma quota mínima de facilitação por M-Pesa.
              </p>
              <a
                href={getWhatsAppCvPayload()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:bg-emerald-400 font-black tracking-widest uppercase text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar para WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      ) : activeSegment === 'cartas' ? (
        // ==================== COVERS / LETTERS INTERFACE ====================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: LETTER TEMPLATES FORM - Spans 5 cols */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[9px] font-mono text-[#c084fc] uppercase font-black tracking-widest block">Formatador de Correspondência</span>
              <h3 className="text-base font-bold text-white">Criador de Cartas Formais</h3>
              <p className="text-[11.5px] text-slate-400 mt-1">
                Escolha o modelo predefinido ideal para iniciar rápido e altere os campos obrigatórios abaixo.
              </p>
            </div>

            {/* Selector Presets Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">1. Escolha o Modelo de Carta:</span>
              <div className="grid grid-cols-1 gap-2">
                {LETTER_PRESETS.map((p) => {
                  const isSel = letterForm.letterType === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetSelect(p.id)}
                      className={`w-full text-left p-3 rounded-xl border transition text-xs flex items-start gap-2.5 ${
                        isSel
                          ? 'bg-[#c084fc]/5 border-[#c084fc] text-[#c084fc]'
                          : 'bg-[#05070a] border-white/10 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isSel}
                        readOnly
                        className="mt-1 cursor-pointer accent-[#c084fc]"
                      />
                      <div>
                        <span className="font-bold block text-[11px] leading-tight text-white mb-0.5">{p.label}</span>
                        <span className="text-[9.5px] text-slate-400 font-normal leading-normal">{p.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs grid form */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">2. Personalize as suas Informações:</span>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">O Seu Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Isaías Amadeu Langa"
                  value={letterForm.senderName}
                  onChange={(e) => setLetterForm({ ...letterForm, senderName: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contacto Telefónico *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: +258 84 999 1111"
                    value={letterForm.senderContact}
                    onChange={(e) => setLetterForm({ ...letterForm, senderContact: e.target.value })}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">A sua Morada (Bairro/Província)</label>
                  <input
                    type="text"
                    placeholder="Ex: Sommerchield, Maputo"
                    value={letterForm.senderAddress}
                    onChange={(e) => setLetterForm({ ...letterForm, senderAddress: e.target.value })}
                    className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Destinatário Principal (Cargo/Empresa) *</label>
                <input
                  type="text"
                  placeholder="Ex: Exmo. Senhor Director dos Recursos Humanos"
                  value={letterForm.recipientName}
                  onChange={(e) => setLetterForm({ ...letterForm, recipientName: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Morada da Empresa de Destino</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Vodacom Moçambique, S.A. Sommerchield, Maputo"
                  value={letterForm.recipientAddress}
                  onChange={(e) => setLetterForm({ ...letterForm, recipientAddress: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Vaga / Cargo que pretende concorrer</label>
                <input
                  type="text"
                  placeholder="Ex: Técnico Geral de Software"
                  value={letterForm.positionTitle}
                  onChange={(e) => setLetterForm({ ...letterForm, positionTitle: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Justificativa da candidatura (Razão)</label>
                <textarea
                  rows={2}
                  value={letterForm.reasonForApplication}
                  onChange={(e) => setLetterForm({ ...letterForm, reasonForApplication: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Habilidades para destacar no parágrafo médio</label>
                <textarea
                  rows={3}
                  value={letterForm.skillsToHighlight}
                  onChange={(e) => setLetterForm({ ...letterForm, skillsToHighlight: e.target.value })}
                  className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc] resize-none"
                />
              </div>
            </div>

            <div className="p-3 bg-[#c084fc]/5 border border-[#c084fc]/20 text-indigo-300 text-[10px] rounded-xl font-mono leading-relaxed">
              💡 <strong>Regras Formais:</strong> O sistema monta o cabeçalho moçambicano padronizado, fechando com o tradicional pedido de Deferimento.
            </div>
          </div>

          {/* RIGHT COLUMN: PRE-VIEW THE PRINT-READY FORMAL LETTER - Spans 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-505 font-mono">📋 CARTA FORMAL GERADA AUTOMATICAMENTE (PRIMEIRA VIA)</span>
              
              <button
                type="button"
                onClick={() => handleCopyText(getComputedLetterContent(), 'carta')}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Carta Completa</span>
              </button>
            </div>

            {/* Paper Simulator */}
            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-2xl p-8 space-y-6 select-text text-xs leading-relaxed text-slate-200 text-left font-sans whitespace-pre-wrap relative">
              <div className="absolute top-0 right-0 p-3 opacity-15">
                <FileText className="h-10 w-10 text-white" />
              </div>

              {/* Formatted body */}
              <div className="font-mono text-[10.5px] text-slate-300 bg-white/[0.01] p-6 rounded-xl border border-white/5">
                {getComputedLetterContent()}
              </div>

              <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 text-[10.5px] text-slate-300 leading-normal font-sans">
                📌 <strong>Conselho Técnico:</strong> Em Moçambique, anexar uma carta de apresentação formal bem escrita junto com o seu curriculum vitae na DNIC ou por email aumenta a credibilidade junto do departamento de Recursos Humanos em até 80%!
              </div>
            </div>

            {/* Action triggering layout link */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-350 text-left">
                Os seus dados da candidatura e carta formatada serão partilhados com o especialista Netek por WhatsApp para revisão de português jurídico, paginação e entrega de suporte em ficheiro PDF.
              </p>
              <a
                href={getWhatsAppLetterPayload()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-slate-950 hover:bg-purple-400 font-extrabold tracking-widest uppercase text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-purple-500/15 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar para WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      ) : activeSegment === 'propostas' ? (
        // ==================== PROPOSALS INTERFACE ====================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: PROPOSAL FORM */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[9px] font-mono text-amber-500 uppercase font-black tracking-widest block">Formatador de Ofertas</span>
              <h3 className="text-base font-bold text-white">Proposta Formal de Emprego</h3>
              <p className="text-[11.5px] text-slate-400 mt-1">
                Gere uma oferta estruturada para prender talentos sob regras de submissão do mercado laboral moçambicano.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nome da Organização Emitente *</label>
                <input
                  type="text"
                  value={proposalForm.companyName}
                  onChange={(e) => setProposalForm({ ...proposalForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contacto da Empresa *</label>
                <input
                  type="text"
                  value={proposalForm.companyContact}
                  onChange={(e) => setProposalForm({ ...proposalForm, companyContact: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nome do Candidato *</label>
                  <input
                    type="text"
                    placeholder="Ex: Manuel Langa"
                    value={proposalForm.candidateName}
                    onChange={(e) => setProposalForm({ ...proposalForm, candidateName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contacto do Candidato</label>
                  <input
                    type="text"
                    placeholder="Ex: +258 84..."
                    value={proposalForm.candidateContact}
                    onChange={(e) => setProposalForm({ ...proposalForm, candidateContact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cargo Proposto *</label>
                  <input
                    type="text"
                    value={proposalForm.positionTitle}
                    onChange={(e) => setProposalForm({ ...proposalForm, positionTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Oferta Salarial Base *</label>
                  <input
                    type="text"
                    value={proposalForm.salary}
                    onChange={(e) => setProposalForm({ ...proposalForm, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Local de Trabalho</label>
                  <input
                    type="text"
                    value={proposalForm.workLocation}
                    onChange={(e) => setProposalForm({ ...proposalForm, workLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Data de Início</label>
                  <input
                    type="text"
                    value={proposalForm.startDate}
                    onChange={(e) => setProposalForm({ ...proposalForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Benefícios e Regalias propostas</label>
                <textarea
                  rows={2}
                  value={proposalForm.benefits}
                  onChange={(e) => setProposalForm({ ...proposalForm, benefits: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Responsabilidades Associadas</label>
                <textarea
                  rows={3}
                  value={proposalForm.responsibilities}
                  onChange={(e) => setProposalForm({ ...proposalForm, responsibilities: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono leading-relaxed text-[11px]"
                />
              </div>
            </div>
            <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-300 text-[10px] rounded-xl font-mono leading-relaxed">
              💡 <strong>Conselho Profissional:</strong> Uma proposta formal enviada ao candidato selecionado aumenta o prestígio corporativo da PME perante consultores estrangeiros e evita desistências precoces.
            </div>
          </div>

          {/* RIGHT COLUMN: PROPOSAL PREVIEW */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono">📋 PROPOSTA DE CONTRATO COMPILADA</span>
              <button
                type="button"
                onClick={() => handleCopyText(getComputedProposalContent(), 'proposta')}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Proposta Completa</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-2xl p-8 space-y-6 select-text text-xs leading-relaxed text-slate-200 text-left font-sans whitespace-pre-wrap relative">
              <div className="absolute top-0 right-0 p-3 opacity-15 text-amber-500">
                <Briefcase className="h-10 w-10" />
              </div>
              <div className="font-mono text-[10.5px] text-slate-300 bg-white/[0.01] p-6 rounded-xl border border-white/5">
                {getComputedProposalContent()}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 text-left">
                Adicione o suporte técnico premium da Netek para que Peniel Mucavel revise noções e emita um ficheiro de registo PDF profissional com assinatura eletrônica.
              </p>
              <a
                href={getWhatsAppProposalPayload()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:bg-amber-400 font-extrabold tracking-widest uppercase text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar para WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        // ==================== CONTRACTS INTERFACE ====================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: CONTRACT FORM */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[9px] font-mono text-emerald-400 uppercase font-black tracking-widest block">Formatador Legal Moçambicano</span>
              <h3 className="text-base font-bold text-white">Contrato Individual de Trabalho</h3>
              <p className="text-[11.5px] text-slate-400 mt-1">
                Gere contratos individuais com base na Lei de Trabalho moçambicana (Lei nº 23/2007) com preenchimento assistido.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nome Completo do Empregador *</label>
                <input
                  type="text"
                  value={contractForm.employerName}
                  onChange={(e) => setContractForm({ ...contractForm, employerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sede / Endereço Empregador</label>
                <input
                  type="text"
                  value={contractForm.employerAddress}
                  onChange={(e) => setContractForm({ ...contractForm, employerAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nome Completo do Trabalhador *</label>
                <input
                  type="text"
                  placeholder="Ex: David Mabuie"
                  value={contractForm.employeeName}
                  onChange={(e) => setContractForm({ ...contractForm, employeeName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">BI / Identificação Trabalhador</label>
                  <input
                    type="text"
                    placeholder="BI nº..."
                    value={contractForm.employeeId}
                    onChange={(e) => setContractForm({ ...contractForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Morada do Trabalhador</label>
                  <input
                    type="text"
                    placeholder="Cidade / Província"
                    value={contractForm.employeeAddress}
                    onChange={(e) => setContractForm({ ...contractForm, employeeAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vigência de Contrato *</label>
                  <input
                    type="text"
                    value={contractForm.duration}
                    onChange={(e) => setContractForm({ ...contractForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Horário de Trabalho</label>
                  <input
                    type="text"
                    value={contractForm.clauseSchedule}
                    onChange={(e) => setContractForm({ ...contractForm, clauseSchedule: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cláusula de Remuneração *</label>
                  <input
                    type="text"
                    value={contractForm.clauseSalary}
                    onChange={(e) => setContractForm({ ...contractForm, clauseSalary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Período de Experiência</label>
                  <input
                    type="text"
                    value={contractForm.probationPeriod}
                    onChange={(e) => setContractForm({ ...contractForm, probationPeriod: e.target.value })}
                    className="w-full px-3 py-2 bg-[#05070a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 text-emerald-300 text-[10px] rounded-xl font-mono leading-relaxed">
              💡 <strong>Advertência em Moçambique:</strong> Segundo o Artigo 55 da LTM (Lei 23/2007), os contratos por tempo determinado devem justificar estritamente a temporariedade da tarefa sob pena de conversão em tempo indeterminado.
            </div>
          </div>

          {/* RIGHT COLUMN: CONTRACT PREVIEW */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono">📋 MINUTA JURÍDICA PREVIALIZADA</span>
              <button
                type="button"
                onClick={() => handleCopyText(getComputedContractContent(), 'contrato')}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Contrato Completo</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-2xl p-8 space-y-6 select-text text-xs leading-relaxed text-slate-200 text-left font-sans whitespace-pre-wrap relative">
              <div className="absolute top-0 right-0 p-3 opacity-15 text-emerald-400">
                <Award className="h-10 w-10" />
              </div>
              <div className="font-mono text-[10.5px] text-slate-300 bg-white/[0.01] p-6 rounded-xl border border-white/5">
                {getComputedContractContent()}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 text-left">
                Gostaria de obter a revisão deste contrato por peritos e registo fiduciário? Partilhe agora via WhatsApp Netek para obter suporte na validação.
              </p>
              <a
                href={getWhatsAppContractPayload()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:bg-emerald-400 font-extrabold tracking-widest uppercase text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-emerald-500/15 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar para WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mozambique Resume FAQ advice list */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#22d3ee]" />
          Dicas Importantes para Curriculum de Sucesso em Moçambique
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-350">
          <div className="p-3.5 bg-[#05070a] rounded-xl border border-white/5 space-y-1">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">1. Mantenha os seus Contactos Ativos</h4>
            <p className="text-slate-400">
              Certifique-se de manter o cartão de telemóvel registado online. Recrutadores moçambicanos preferem chamadas diretas ou convites via WhatsApp Business.
            </p>
          </div>
          <div className="p-3.5 bg-[#05070a] rounded-xl border border-white/5 space-y-1">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">2. Seja Honesto com Aptidões</h4>
            <p className="text-slate-400">
              Mencione apenas as ferramentas que sabe utilizar. É preferível listar "Noções de Informática Média" do que errar em avaliações de rede no escritório corporativo.
            </p>
          </div>
          <div className="p-3.5 bg-[#05070a] rounded-xl border border-white/5 space-y-1">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">3. Salve sempre em formato PDF</h4>
            <p className="text-slate-400">
              Nunca envie ficheiros editáveis de Word (.docx). O PDF garante que a paginação fique intata no ecrã do telemóvel ou computador do diretor de contratações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
