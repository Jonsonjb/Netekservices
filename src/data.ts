import { Course, ServiceItem, BlogPost } from './types';

export const COURSES_DATA: Course[] = [
  {
    id: 'c1',
    title: 'Domínio do ChatGPT & Gemini para Produtividade',
    shortDescription: 'Aprenda a automatizar tarefas diárias, criar relatórios e poupar horas de trabalho usando IA gratuita.',
    longDescription: 'Este curso é desenhado especificamente para profissionais e estudantes em Moçambique que desejam usar inteligência artificial para otimizar o seu tempo de trabalho. Vamos cobrir engenharia de prompts (Prompt Engineering), automatização de folhas de Excel/Sheets, redação rápida de emails profissionais e geração de ideias para negócios locais.',
    duration: '10 Horas',
    level: 'Iniciante',
    price: 0,
    category: 'Gratuito',
    skills: ['Prompt Engineering', 'ChatGPT', 'Gemini AI', 'Automação de Escritório'],
    instructor: 'Eng. Amadeu Banze (Especialista IA)'
  },
  {
    id: 'c2',
    title: 'Marketing Digital de Alto Impacto via WhatsApp',
    shortDescription: 'Como criar um canal de vendas imbatível usando apenas o WhatsApp e redes sociais sem gastar uma fortuna em anúncios.',
    longDescription: 'O WhatsApp é a ferramenta mais utilizada em Moçambique para fazer negócios. Aprenda a estruturar o WhatsApp Business de forma profissional, automatizar respostas rápidas, fechar vendas pelo chat, segmentar clientes locais e criar materiais gráficos incríveis usando o Canva e IA de imagem gratuita.',
    duration: '15 Horas',
    level: 'Iniciante',
    price: 950,
    category: 'Pago',
    skills: ['WhatsApp Marketing', 'Vendas Consultivas', 'Canva Pro', 'Copywriting com IA'],
    instructor: 'Dra. Elsa Matusse (Gestora de Tráfego local)'
  },
  {
    id: 'c3',
    title: 'Criação de Negócios e Integração de Pagamentos Locais',
    shortDescription: 'Aprenda do zero como lançar um serviço digital em Moçambique com recebimentos via M-Pesa, e-Mola e cartões.',
    longDescription: 'Domine a logística e tecnologia do mercado moçambicano. Este curso ensina como funciona o ecossistema de pagamentos instantâneos (APIs M-Pesa, e-Mola, gateways como carteiras locais), formalização básica ou operações ágeis sem burocracia, e atendimento automatizado para garantir a máxima confiança do cliente de Maputo a Pemba.',
    duration: '22 Horas',
    level: 'Intermédio',
    price: 1800,
    category: 'Pago',
    skills: ['Integração M-Pesa', 'Logística de Pagamentos', 'Fintechs', 'Negócios Online'],
    instructor: 'Dr. Valter Tembe (Co-founder Netek)'
  },
  {
    id: 'c4',
    title: 'Desenvolvimento Web Moderno com React & Tailwind CSS',
    shortDescription: 'Construa sites rápidos, responsivos e profissionais que funcionam incrivelmente bem mesmo em ligações 3G lentas.',
    longDescription: 'Um curso avançado e focado na prática de desenvolvimento de ponta. Aprenda HTML5, CSS3, JavaScript moderno, React e estilização avançada com Tailwind CSS. Foco em otimização de performance técnica para garantir baixo consumo de megas de internet, oferecendo a melhor experiência de UI para utilizadores de telemóveis em Moçambique.',
    duration: '45 Horas',
    level: 'Avançado',
    price: 3450,
    category: 'Pago',
    skills: ['React JS', 'Tailwind CSS', 'Otimização Web', 'JavaScript ES6+'],
    instructor: 'Eng. Nelson Tamele (Tech Lead na Netek)'
  },
  {
    id: 'c5',
    title: 'Segredos da Conectividade: Instalação e Redes de Baixo Custo',
    shortDescription: 'Aprenda a configurar antenas, router 4G, repetidores de sinal e Wi-Fi estável na sua zona rural ou escritório.',
    longDescription: 'Um treinamento inteiramente prático focado na infraestrutura de internet. Aprenda a configurar equipamentos comuns no mercado nacional (TP-Link, MikroTik, Huawei), melhorar significativamente a velocidade de dados móveis, gerir a largura de banda de forma inteligente e resolver problemas comuns de rede de forma autónoma e barata.',
    duration: '12 Horas',
    level: 'Intermédio',
    price: 0,
    category: 'Gratuito',
    skills: ['Redes Sem Fio', 'Routers 4G', 'Otimização de Banda', 'Hardware de Rede'],
    instructor: 'Eng. Nelson Tamele (Infraestrutura)'
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 's1',
    title: 'Destaque Web (Landing Page de Alta Conversão)',
    description: 'Criação de uma página web leve, otimizada para telemóveis e focada em converter visitantes em clientes. Ideal para destacar serviços locais, com botão direto para o WhatsApp.',
    basePrice: 9500,
    deliveryTime: '5-7 Dias',
    category: 'Presença Digital',
    iconName: 'Globe'
  },
  {
    id: 's2',
    title: 'Integração de Pagamentos M-Pesa e e-Mola',
    description: 'Automatize os recebimentos da sua empresa ou loja online. Configuramos botões de pagamento automáticos por push USSD que facilitam a vida do seu cliente.',
    basePrice: 12000,
    deliveryTime: '7-10 Dias',
    category: 'Fintech & Automação',
    iconName: 'CreditCard'
  },
  {
    id: 's3',
    title: 'Consultoria de Conectividade & Redes de Escritório',
    description: 'Análise detalhada do seu sinal de internet. Instalamos router, redes mesh, configuramos operadoras ideais (Vodacom, Movitel ou Tmcel) e melhoramos a estabilidade de ligação da sua equipa.',
    basePrice: 5000,
    deliveryTime: '2-3 Dias',
    category: 'Suporte Técnico',
    iconName: 'Wifi'
  },
  {
    id: 's4',
    title: 'Chatbot de Atendimento Inteligente para WhatsApp',
    description: 'Integração de assistentes virtuais baseados na API do Gemini/ChatGPT para responder a dúvidas frequentes, catalogar leads e encaminhar vendas 24 horas por dia.',
    basePrice: 15000,
    deliveryTime: '10-15 Dias',
    category: 'Fintech & Automação',
    iconName: 'MessageSquareText'
  }
];

export const BLOG_DATA: BlogPost[] = [
  {
    id: 'b1',
    title: 'Como Usar Inteligência Artificial para Atender Clientes pelo WhatsApp Sem Gastar Nada',
    summary: 'Guia simples para automatizar o atendimento inicial do seu negócio local usando ferramentas de IA gratuitas conectadas com o seu número de telemóvel.',
    content: `Falar com os clientes a tempo inteiro pode ser uma tarefa exaustiva para pequenos empreendedores em Moçambique. Felizmente, as novas ferramentas de Inteligência Artificial tornam possível criar assistentes automáticos de excelente qualidade sem custo.

Neste artigo prático, mostramos os passos exatos para conseguir isso:

### 1. Configure o seu WhatsApp Business
Antes de mais, deve migrar para a aplicação **WhatsApp Business**. Ela traz funcionalidades nativas extremamente importantes para empresas:
* Respostas Rápidas (atalhos como \`/obrigado\`)
* Mensagem de Saudação automática
* Mensagem de Ausência para fora do horário de serviço

### 2. Utilize o ChatGPT de forma Inteligente para Respostas Frequentes
Pode guardar um documento de texto com os dados do seu negócio (preços, localização, formas de pagamento com M-Pesa). Quando o cliente faz perguntas complexas, basta introduzir essas respostas em modelos como ChatGPT ou Gemini para gerar textos amigáveis em português local:
* **Exemplo de prompt:** *"Atua como assistente de vendas em Maputo. Escreve uma resposta simpática e curta para o cliente que quer saber se aceitamos pagamentos eletrónicos, baseando-te no facto de aceitarmos M-Pesa (8401666592), e-Mola (874786943) ou mKesh (835109190)."*

### 3. Integrações Básicas Automatizadas
Ferramentas de ligação como ManyChat ou Zapier permitem ligar o WhatsApp diretamente a motores de resposta inteligentes. Atualmente, com a API gratuita do Gemini ou OpenAI, já podemos criar conversas fluidas.

A Netek Services oferece este serviço completo para empresas de todos os tamanhos, permitindo automatizar até 80% do atendimento diário!`,
    category: 'IA e Produtividade',
    date: '18 de Maio de 2026',
    readTime: '4 min',
    author: 'Eng. Amadeu Banze',
    views: 312
  },
  {
    id: 'b2',
    title: 'M-Pesa e e-Mola: Como Ativar e Integrar Pagamentos Automáticos no seu Site',
    summary: 'Entenda os requisitos técnicos e jurídicos para empresas moçambicanas configurarem o pagamento automático por telemóvel nos seus ecossistemas digitais.',
    content: `Os pagamentos móveis através de carteiras eletrónicas como **M-Pesa**, **e-Mola** e **mKesh** lideram a inclusão financeira em Moçambique. Ter este tipo de pagamento de forma automática no seu website gera total segurança para os seus clientes e multiplica a sua taxa de conversão.

### O Fluxo Perfeito do Utilizador (C2B Core)
Para garantir a melhor experiência do utilizador:
1. O cliente preenche o formulário com o seu contacto (ex: 84XXXXXXX).
2. O sistema envia uma solicitação de pagamento ao gateway.
3. Um pop-up (Push USSD) surge instantaneamente no ecrã do telemóvel do cliente pedindo o PIN.
4. O cliente confirma e recebe imediatamente a mensagem do sucesso da compra de forma automatizada no próprio site.

### Como Implementar?

#### Método 1: Gateway de Pagamentos Prontos
Utilizar gateways que já possuem a ligação feita com os bancos e operadoras. Empresas inovadoras locais em Moçambique oferecem este conector completo, simplificando os contratos com os operadores.

#### Método 2: Integração Direta via API
Ideal para startups com equipas de engenharia consolidadas. Requer:
* Conta Empresarial na respetiva operadora (API oficial de pagamentos móveis).
* Certificados de segurança HTTPS.
* Servidor backend robusto para escutar os callbacks seguros (IPNs).

Se precisar de ajuda para instalar esta automação perfeita, a **Netek Services** tem uma equipa especializada em Moçambique pronta para codificar a integração na sua loja ou landing page em menos de uma semana.`,
    category: 'Negócios e M-Pesa',
    date: '12 de Maio de 2026',
    readTime: '6 min',
    author: 'Dr. Valter Tembe',
    views: 450
  },
  {
    id: 'b3',
    title: 'Guia de Economia de Saldo: Economize até 50% dos seus Dados Móveis utilizando o Computador',
    summary: 'Conselhos cruciais para desenvolvedores, estudantes e profissionais que usam Hotspot móvel no Windows e macOS para trabalhar sem consumir megas de forma oculta.',
    content: `Em Moçambique, a internet é barata de madrugada, mas os pacotes de dados de trabalho podem terminar muito rápido devido a atualizações automáticas silenciosas em computadores. Aqui estão algumas definições simples que vão duplicar as horas em que pode trabalhar com os seus megas de internet:

### 1. Definir Ligação como "Ligação Medida" (Metered Connection)
Esta é a definição de ouro para quem partilha internet do telemóvel para o portátil:
* No **Windows**: Vá a Definições > Rede e Internet > Wi-Fi. Clique na rede do seu telemóvel partilhado e ative a opção **"Definir como ligação medida"**. Isto impede o Windows de descarregar atualizações enormes em segundo plano de forma oculta.
* No **macOS**: Vá a Preferências do Sistema > Wi-Fi, escolha as opções avançadas e selecione **"Modo de Baixo Consumo de Dados"** para o seu ponto de acesso pessoal.

### 2. Ativar a Otimização de Imagens e Bloqueadores de Anúncios no Navegador
Os sites de notícias e blogs costumam carregar imagens pesadas e publicidades que esgotam o seu saldo.
* Instale uma extensão bloqueadora de anúncios leve (como o *uBlock Origin*) no seu Chrome, Edge ou Brave.
* Ative a funcionalidade de "Compactar Páginas" ou "Modo Lite" do seu browser.

### 3. Suspenda Sincronizações automáticas de Nuvem (OneDrive, Dropbox, iCloud)
Evite manter o OneDrive ou iCloud ativos enquanto estiver ligado aos dados móveis do dia. Agende para carregar os seus ficheiros pesados apenas à noite ou em ligações de fibra fixa.`,
    category: 'Economia de Dados',
    date: '02 de Maio de 2026',
    readTime: '3 min',
    author: 'Eng. Nelson Tamele',
    views: 625
  }
];

export const THEORETICAL_PLAN = {
  identidadeVisual: {
    cores: [
      { hex: '#060B18', role: 'Fundo Escuro Principal (Main Background)', description: 'Traz ar de elegância, maturidade tecnológica e estabilidade, reduzindo também o consumo de bateria em ecrãs OLED (muito comuns em telemóveis).' },
      { hex: '#0284C7', role: 'Cor Primária (Sky/Telemático Azul)', description: 'Simboliza inovação, conectividade e confiança profissional. Usada em links, botões principais de ação e acentos UI.' },
      { hex: '#10B981', role: 'Cor de Destaque Local (Verde M-Pesa / Movitel)', description: 'Atrai imediatamente a atenção, representando prosperidade, sucesso e integrando perfeitamente a segurança emocional de pagamentos nativos moçambicanos.' },
      { hex: '#8B5CF6', role: 'Acento de Inovação (Roxo Neon)', description: 'Usado com sobriedade em pormenores, badges e subtis gradientes para evocar inteligência artificial, futuro e avanço tecnológico.' },
      { hex: '#F1F5F9', role: 'Cor dos Textos Metálicos (Cinzento Claro / Off-White)', description: 'Garante excelente rácio de contraste (WCAG 2.1 AA) sobre fundos escuros, permitindo leitura suave mesmo sob luz solar.' }
    ],
    tipografia: {
      familiaPrincipal: 'Inter (Sans-serif)',
      familiaPrincipalDesc: 'Altamente geométrica e legível em ecrãs pequenos de marcas de telemóveis de entrada (como Tecno, Infinix, Itel), amplamente utilizados no mercado moçambicano.',
      familiaDisplay: 'Space Grotesk (Sans-serif display)',
      familiaDisplayDesc: 'Estruturação futurista e limpa para títulos grandes (headings), transmitindo solidez de marca e design contemporâneo.',
      familiaMono: 'JetBrains Mono',
      familiaMonoDesc: 'Usada em metadados, durações, preços e áreas técnicas de tutoriais de código, transmitindo precisão.'
    },
    tomDeVoz: [
      { titulo: 'Didático e Inclusivo', texto: 'Comunicação simples, que desmistifica palavras técnicas e traduz a IA para conceitos práticos do dia a dia moçambicano, do estudante de secundário ao empresário local.' },
      { titulo: 'Alto Profissionalismo e Credibilidade', texto: 'Gera confiança de que os serviços digitais serão entregues com rigor de código limpo e os cursos são lecionados por quem domina de facto a indústria.' },
      { titulo: 'Acolhedor e Dinâmico', texto: 'Uso controlado de expressões naturais moçambicanas simpáticas (como "Kanimambo", "Tudo Pronto") conjugando com uma linguagem altamente orientada a resultados e pragmatismo.' },
      { titulo: 'Foco em Eficiência e Otimização', texto: 'A marca comunica constantemente como economizar tempo, dinheiro emegas, mostrando-se parceira do bolso do cliente.' }
    ]
  },
  arquitecturaPaginas: {
    homepage: [
      { sec: '1. Cabeçalho (Navbar)', desc: 'Logo Netek moderno + links fluidos (Serviços, Cursos, Blog/IA) + Indicador de WhatsApp de emergência sempre visível.' },
      { sec: '2. Hero Section (Início)', desc: 'Título apelativo ("Capacite o seu negócio com tecnologia e conectividade"), chamada curta para cursos rápidos e simulação de serviços, estatísticas de aceleração digital.' },
      { sec: '3. Pilares em Foco (Cartões Rápidos)', desc: 'Atalhos direto para Conectividade e Internet, Cursos Práticos de IA e Soluções Digitais.' },
      { sec: '4. Centro de Conversão Instantânea', desc: 'Simulador interativo de Orçamentos Digitais que emite estimativas em tempo real (evita o "preço no inbox" que afasta os utilizadores).' },
      { sec: '5. Vitrine de Sucesso do Cliente', desc: 'Área com perguntas frequentes, explicações dinâmicas sobre como pagar com M-Pesa de forma automatizada e segura.' },
      { sec: '6. Rodapé Prático (Footer)', desc: 'Contactos com endereço local, links rápidos, métodos de pagamento suportados e indicação de integridade técnica.' }
    ],
    servicosInternet: 'Listagem inteligente de competências (Criação de código leve, Web design adaptável ao sol e calor, Redes Mesh Wi-Fi para escritório) acompanhada do estimador interativo auto-calculável com conversão imediata para contacto direto.',
    blogTutoriais: 'Focado em publicações ultra levezinhas, que gastam pouquíssimos dados móveis, apresentando código, prompts úteis prontos a copiar-colar e tutoriais práticos sobre IA local.'
  },
  estruturaCursos: {
    layout: 'Grelha fluída de cartões (Grid layout), totalmente adaptável a telemóveis do mercado. Contém filtros táteis por preço (Todos, Grátis, Pagos), por nível de complexidade e barra de pesquisa inteligente por termos.',
    elementosPorCurso: [
      { item: 'Título & Mentor', desc: 'Identifica o que se vai aprender e quem valida a experiência com autoridade local.' },
      { item: 'Badges de Apoio', desc: 'Identificação imediata da Carga Horária (ex: 15h) e Nível de Competência.' },
      { item: 'Preço em Meticais (MT)', desc: 'Visualização honesta e simplificada (ex: "Inteiramente Grátis" ou "1.500 MT").' },
      { item: 'Botões Dinâmicos de Chamada', desc: 'Opção de ver detalhes completos do programa ou botão de inscrição imediata integrada para iniciar conversa de reserva no WhatsApp.' }
    ],
    organizacaoCursos: 'Separação categorizada intuitiva com barras coloridas específicas (Verde Neon com borda pulsante para Cursos Grátis e Azul Cósmico elegante para os Cursos Profissionais com Certificação Netek).'
  },
  logisticaConversao: {
    whatsapp: [
      { passo: '1. Pré-preenchimento Intuitivo', texto: 'Ao clicar para se inscrever num curso ou contratar um serviço, o utilizador não precisa de pensar na frase. O sistema abre o WhatsApp com um texto exato, ex: "Olá Netek, gostava de me registar no curso de ChatGPT e Gemini de 10 horas. O meu nome é..."' },
      { passo: '2. Suporte Humano Ágil', texto: 'A equipa da Netek acede instantaneamente ao funil, gerando conversões fáceis em poucos minutos.' }
    ],
    pagamentosLocais: [
      { canal: 'M-Pesa (Vodacom)', instrucoess: 'Inscrições com push de validação automática USSD (*150#) ou exibição detalhada com Passo a Passo visual do fluxo clássico de envio de dinheiro ("Como Pagar com M-Pesa"), o que reduz o atrito e desconfiança de iniciantes.' },
      { canal: 'e-Mola (Movitel)', instrucoess: 'Manual simplificado de transferência direta (*155#) com confirmação instantânea do talão digital via WhatsApp pela Netek.' },
      { canal: 'Badge de Confiança FinTech', instrucoess: 'Exibição de logótipos vetorizados límpidos no ecrã de checkout com a mensagem "Pagamento Directo e Seguro por Operadoras Oficiais de Moçambique: Sem Cartão de Crédito Necessário".' }
    ]
  }
};
