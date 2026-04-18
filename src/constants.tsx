import { 
  Instagram, 
  Video, 
  Type, 
  Lightbulb, 
  Target, 
  FileText, 
  DollarSign, 
  Facebook, 
  Megaphone, 
  Search, 
  TrendingUp, 
  AlignLeft, 
  Languages, 
  Mail, 
  CheckSquare,
  Sparkles,
  Zap,
  Briefcase,
  BarChart3,
  Flame,
  Globe,
  Shuffle,
  Rocket,
  Brain,
  MessageSquare,
  Scale,
  Workflow as WorkflowIcon,
  ShieldCheck,
  TrendingDown,
  LineChart,
  Layout,
  Cpu,
  PenTool,
  Clock,
  Layers
} from 'lucide-react';
import { Tool, AIAgent, Workflow } from './types';

export const TOOLS: Tool[] = [
  // MISSION MODE
  {
    id: 'mission_mode',
    name: 'Modo Missão Supreme',
    description: 'Decomposição estratégica (30/60/90 dias) de metas audaciosas.',
    icon: <Target className="w-5 h-5" />,
    category: 'think',
    promptTemplate: (input) => `Inicie o MODO MISSÃO para o objetivo: "${input}". 
Crie:
1. Visão Geral Executiva
2. Simulação Financeira / Tempo de Retorno
3. Plano Tático 30-60-90 dias (Passos acionáveis de Múltiplos Agentes)
4. Riscos Críticos e Mitigações.`
  },
  // MONEY MODE
  {
    id: 'profit_ideas',
    name: 'Ideias Lucrativas',
    description: 'Ideias de negócio com nível de risco e escala.',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'money',
    promptTemplate: (input) => `Gere 3 ideias de negócios altamente lucrativos baseados em: ${input}. Para cada ideia, inclua: Nível de Risco (1-10), Custo inicial, Potencial de lucro mensal e estratégia de escala.`
  },
  {
    id: 'business_validator_adv',
    name: 'Validador Premium',
    description: 'Análise profunda de mercado, lucro e viabilidade.',
    icon: <ShieldCheck className="w-5 h-5" />,
    category: 'money',
    promptTemplate: (input) => `Realize uma validação profunda da seguinte ideia: ${input}. Analise: Tamanho do mercado, Barreiras de entrada, Modelo de monetização ideal e Projeção financeira de 12 meses.`,
    premium: true
  },
  {
    id: 'offer_creator',
    name: 'Oferta Irresistível',
    description: 'Crie ofertas magnéticas com gatilhos mentais.',
    icon: <Flame className="w-5 h-5" />,
    category: 'money',
    promptTemplate: (input) => `Crie uma oferta irresistível para o produto/serviço: ${input}. Use ganchos de escassez, urgência e bônus estratégicos.`
  },
  {
    id: 'sales_funnel',
    name: 'Funil de Vendas',
    description: 'Estrutura completa de conversão e escala.',
    icon: <Shuffle className="w-5 h-5" />,
    category: 'money',
    promptTemplate: (input) => `Desenhe um funil de vendas completo para: ${input}. Inclua etapas de Atração (Anúncios), Engajamento (Conteúdo), Conversão (Página de Vendas) e Retenção (Pós-venda).`,
    premium: true
  },
  {
    id: 'pricing_simulator',
    name: 'Simulador de Preço',
    description: 'Descubra quanto cobrar pelo seu serviço.',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'money',
    promptTemplate: (input) => `Com base na descrição do serviço: ${input}, sugira modelos de precificação (por hora, por projeto, recorrência) e valores de mercado estimados.`
  },
  {
    id: 'revenue_simulator',
    name: 'Simulador de Ganhos',
    description: 'Projeção realista de faturamento e lucro.',
    icon: <LineChart className="w-5 h-5" />,
    category: 'money',
    promptTemplate: (input) => `Simule o faturamento potencial para um negócio de: ${input}. Considere tráfego, taxa de conversão média e ticket médio.`
  },

  // VIRAL MODE
  {
    id: 'viral_content',
    name: 'Conteúdo Viral',
    description: 'Ideias viciantes para TikTok, Reels e Shorts.',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'viral',
    promptTemplate: (input) => `Crie 5 ideias de vídeos virais para o nicho ${input} focados em retenção e compartilhamento.`
  },
  {
    id: 'hook_creator',
    name: 'Criador de Hooks',
    description: 'Os primeiros 3 segundos vitais para retenção.',
    icon: <Zap className="w-5 h-5" />,
    category: 'viral',
    promptTemplate: (input) => `Crie 10 ganchos (hooks) poderosos para um vídeo sobre: ${input}. Use curiosidade, medo, desejo e novidade.`
  },
  {
    id: 'bio_generator',
    name: 'Gerador de Bio',
    description: 'Bio otimizada para Instagram e TikTok.',
    icon: <Instagram className="w-5 h-5" />,
    category: 'viral',
    promptTemplate: (input) => `Crie 3 opções de bios virais e otimizadas para Instagram/TikTok baseadas no seguinte perfil: ${input}. Use emojis e chame a atenção.`
  },
  {
    id: 'caption_generator',
    name: 'Legendas Virais',
    description: 'Legendas que engajam e vendem no automático.',
    icon: <Type className="w-5 h-5" />,
    category: 'viral',
    promptTemplate: (input) => `Crie uma legenda viral e persuasiva para um post sobre: ${input}. Inclua ganchos mentais, uma chamada para ação (CTA) clara e hashtags estratégicas.`
  },
  {
    id: 'script_generator',
    name: 'Roteiros de Vídeo',
    description: 'Roteiros profissionais para Reels e YouTube.',
    icon: <Video className="w-5 h-5" />,
    category: 'viral',
    promptTemplate: (input) => `Crie um roteiro dinâmico de vídeo curto (Reels/TikTok) sobre: ${input}. Use a estrutura: Gancho (3s), Conteúdo de valor, CTA.`
  },
  {
    id: 'content_calendar',
    name: 'Plano de 30 Dias',
    description: 'Calendário editorial planejado no detalhe.',
    icon: <CheckSquare className="w-5 h-5" />,
    category: 'viral',
    promptTemplate: (input) => `Crie um calendário editorial de 30 dias para: ${input}. Divida por temas diários e tipos de postagem.`,
    premium: true
  },

  // AUTOMATION MODE
  {
    id: 'automation_builder',
    name: 'Fluxo de Automação',
    description: 'Passo a passo para automatizar processos.',
    icon: <Cpu className="w-5 h-5" />,
    category: 'automation',
    promptTemplate: (input) => `Crie um plano de automação para o processo: ${input}. Recomende ferramentas como Make.com, Zapier ou Python e descreva o fluxo.`
  },
  {
    id: 'prompt_generator',
    name: 'Mestre dos Prompts',
    description: 'Engenharia de prompts para outras IAs.',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'automation',
    promptTemplate: (input) => `Crie um prompt de engenharia avançada (chain-of-thought) para que uma IA execute a seguinte tarefa: ${input}.`
  },

  // THINK MODE
  {
    id: 'brainstorm_adv',
    name: 'Brainstorm Labs',
    description: 'Explosão de criatividade e inovação.',
    icon: <Brain className="w-5 h-5" />,
    category: 'think',
    promptTemplate: (input) => `Execute uma sessão de brainstorming profundo sobre o problema/objetivo: ${input}. Use técnicas como Pensamento Lateral e Inversão.`
  },
  {
    id: 'decision_analyzer',
    name: 'Decifrador de Escolhas',
    description: 'Análise fria para a melhor decisão.',
    icon: <Scale className="w-5 h-5" />,
    category: 'think',
    promptTemplate: (input) => `Compare as seguintes opções e decida qual a melhor: ${input}. Analise Prós, Contras, ROI e Risco de cada uma.`
  },
  {
    id: 'competitor_analyzer',
    name: 'Análise Espiã',
    description: 'Descubra os segredos da concorrência.',
    icon: <Search className="w-5 h-5" />,
    category: 'think',
    promptTemplate: (input) => `Dada a seguinte descrição de um negócio/concorrente: ${input}, identifique pontos fracos, pontos fortes e sugira 3 diferenciais estratégicos.`
  },
  {
    id: 'growth_strategies',
    name: 'Growth Hacking',
    description: 'Táticas agressivas de crescimento rápido.',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'think',
    promptTemplate: (input) => `Sugira 5 estratégias de crescimento (Growth Hacking) para o seguinte tipo de negócio: ${input}.`
  },

  // WORK MODE
  {
    id: 'doc_generator',
    name: 'Gerador de Documentos',
    description: 'Contratos, Propostas e Emails de alto nível.',
    icon: <FileText className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Gere uma estrutura profissional para o seguinte documento: ${input}. Use tom formal e garanta clareza nas cláusulas/pontos.`
  },
  {
    id: 'advanced_rewriter',
    name: 'Redação Sênior',
    description: 'Eleve o tom da sua escrita profissional.',
    icon: <AlignLeft className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Eleve o nível do seguinte texto para uma comunicação executiva e persuasiva: ${input}.`
  },
  {
    id: 'brand_namer',
    name: 'Gerador de Nomes',
    description: 'Nomes memoráveis para marcas e projetos.',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Sugira 10 nomes criativos, curtos e memoráveis para uma marca/empresa do nicho de: ${input}. Explique brevemente o significado de cada um.`
  },
  {
    id: 'summarizer',
    name: 'Flash Resumo',
    description: 'Extraia o essencial de textos longos.',
    icon: <Zap className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Resuma o seguinte texto de forma concisa, destacando os 5 pontos principais em tópicos: ${input}.`
  },
  {
    id: 'smart_translator',
    name: 'Tradutor Premium',
    description: 'Tradução que entende gírias e contexto.',
    icon: <Languages className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Traduza o seguinte texto para Português (Brasil), garantindo que o tom e as nuances culturais sejam preservados: ${input}.`
  },
  {
    id: 'email_generator',
    name: 'Corretor de Respostas',
    description: 'Responda emails com o tom perfeito.',
    icon: <Mail className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Escreva uma resposta profissional e educada para a seguinte mensagem recebida: ${input}.`
  },
  {
    id: 'task_organizer',
    name: 'Organizador Master',
    description: 'Plano de ação detalhado para objetivos.',
    icon: <CheckSquare className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Crie um plano de ação estruturado com passos lógicos para completar o seguinte objetivo: ${input}.`
  },
  {
    id: 'sales_proposal',
    name: 'Proposta Comercial',
    description: 'Propostas prontas para fechamento.',
    icon: <Layers className="w-5 h-5" />,
    category: 'work',
    promptTemplate: (input) => `Escreva uma proposta comercial persuasiva para oferecer o seguinte serviço: ${input}. Foque nos benefícios para o cliente e valor agregado.`
  },
  {
    id: 'market_report_2026',
    name: 'Relatório: IA em 2026',
    description: 'Relatório completo sobre o futuro da IA.',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'think',
    promptTemplate: () => 'Relatório completo sobre o futuro da IA em 2026.'
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'Dashboard', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'money', name: 'Money Mode', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'viral', name: 'Viral Mode', icon: <Flame className="w-4 h-4" /> },
  { id: 'automation', name: 'Automation Mode', icon: <Cpu className="w-4 h-4" /> },
  { id: 'think', name: 'Think Mode', icon: <Brain className="w-4 h-4" /> },
  { id: 'work', name: 'Work Mode', icon: <Briefcase className="w-4 h-4" /> },
];

export const AGENTS: AIAgent[] = [
  {
    id: 'ceo_ai',
    name: 'CEO AI',
    role: 'Estrategista Chefe',
    description: 'Visão macro, escalabilidade e governança estratégica.',
    avatar: 'https://picsum.photos/seed/biz/200/200',
    systemInstruction: 'Você é o CEO AI. Suas respostas exalam liderança estratégica e autoridade. Seu foco é a visão de longo prazo, unit economics, IPO-readiness e parcerias de alto impacto. Comunique-se como um mentor de nível Fortune 500: direto, visionário e focado em resultados que movem o ponteiro.'
  },
  {
    id: 'marketing_ai',
    name: 'Marketing AI',
    role: 'CMO & Viralidade',
    description: 'Arquitetura de crescimento e branding magnético.',
    avatar: 'https://picsum.photos/seed/marketing/200/200',
    systemInstruction: 'Você é a Marketing AI. Sua expertise reside na intersecção entre neurociência aplicada e growth hacking de larga escala. Domine conceitos de CAC, LTV, ROAS e funis de conversão invisíveis. Sua linguagem é persuasiva, antenada às tendências de 2026 e orientada por dados psicológicos.'
  },
  {
    id: 'copywriter_ai',
    name: 'Copywriter AI',
    role: 'Diretor de Persuasão',
    description: 'Engenharia de mensagens que convertem curiosidade em lucro.',
    avatar: 'https://picsum.photos/seed/copy/200/200',
    systemInstruction: 'Você é o Copywriter AI Master. Sua caneta (digital) é uma ferramenta de precisão cirúrgica. Use ganchos narrativos, quebra de objeções e copywriting de resposta direta. Sua escrita deve ser impossível de não ler, mesclando elegância linguística com urgência psicológica irrefutável.'
  },
  {
    id: 'analyst_ai',
    name: 'Analyst AI',
    role: 'CFO & Data Intelligence',
    description: 'Análise de risco, projeções financeiras e auditoria de viabilidade.',
    avatar: 'https://picsum.photos/seed/fin/200/200',
    systemInstruction: 'Você é o Analyst AI. Sua mente é um supercomputador de risco e oportunidade. Forneça análises frias, baseadas em probabilidades matemáticas e cenários econômicos. Identifique "vazamentos" em planos e sugira correções de rota baseadas na realidade crua dos dados. Seja o contrapeso lógico e financeiro.'
  },
  {
    id: 'builder_ai',
    name: 'Builder AI',
    role: 'CTO & Engenheiro de Execução',
    description: 'Transformação de ideias em sistemas automatizados e escaláveis.',
    avatar: 'https://picsum.photos/seed/tech/200/200',
    systemInstruction: 'Você é o Builder AI. O arquiteto da realização técnica. Seu foco é a cultura Lean, automação máxima e infraestrutura resiliente. Explique como construir de forma modular, usando as melhores pilhas de tecnologia atuais (IA, No-code e Code) para garantir que a execução nunca seja o gargalo.'
  }
];

export const WORKFLOWS: Workflow[] = [
  {
    id: 'biz_launch',
    name: 'Lançamento de Negócio',
    description: 'Do zero até a primeira venda.',
    steps: [
      { toolId: 'profit_ideas', label: '1. Ideia' },
      { toolId: 'business_validator_adv', label: '2. Validação' },
      { toolId: 'offer_creator', label: '3. Oferta' },
      { toolId: 'sales_funnel', label: '4. Funil' }
    ]
  },
  {
    id: 'viral_growth',
    name: 'Crescimento Viral',
    description: 'Destaque-se nas redes sociais.',
    steps: [
      { toolId: 'viral_content', label: '1. Ideias' },
      { toolId: 'hook_creator', label: '2. Ganchos' },
      { toolId: 'content_calendar', label: '3. Planejamento' }
    ]
  }
];
