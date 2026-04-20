import React, { useState, useEffect, useMemo } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { UserProfile, GenerationLog, Tool, Plan, AIScore, AIAgent, Workflow } from './types';
import { TOOLS, CATEGORIES, AGENTS, WORKFLOWS } from './constants';
import { Sidebar } from './components/Sidebar';
import { ToolCard } from './components/ToolCard';
import { GenerationModal } from './components/GenerationModal';
import { LoginScreen } from './components/LoginScreen';
import { generateAIResponse } from './services/aiService';
import { formatDate } from './lib/utils';
import { 
  Search, 
  Crown, 
  History, 
  Trash2, 
  ExternalLink, 
  CheckSquare, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Workflow as WorkflowIcon,
  Sparkles,
  ShieldCheck,
  Zap,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FREE_DAILY_LIMIT = 5;

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export default function App() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'flows' | 'history' | 'billing'>('dashboard');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GenerationLog[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [viewingHistoryResult, setViewingHistoryResult] = useState<{ content: string; score: AIScore } | undefined>(undefined);

  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(0);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDatabaseError = (error: unknown, operationType: OperationType, path: string | null) => {
    let errorMessage = String(error);
    if (error && typeof error === 'object') {
      if ('message' in error) {
        errorMessage = String((error as any).message);
        if ('details' in error) errorMessage += ` | Details: ${(error as any).details}`;
        if ('hint' in error) errorMessage += ` | Hint: ${(error as any).hint}`;
      } else {
        try { errorMessage = JSON.stringify(error); } catch (e) {}
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    const errInfo = {
      error: errorMessage,
      authInfo: {
        userId: user?.id,
        email: user?.email,
      },
      operationType,
      path
    };
    console.error('Supabase Error: ', JSON.stringify(errInfo));
  };

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Profile and Usage Loader
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.rpc('sync_profile');
        
        if (error) {
          handleDatabaseError(error, OperationType.GET, 'users');
          return;
        }

        if (data && data.length > 0) {
          setProfile(data[0] as UserProfile);
        }
      } catch (err) {
        handleDatabaseError(err, OperationType.GET, 'users');
      }
    };
    fetchProfile();
  }, [user]);

  // History Listener
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('uid', user.id)
          .order('createdAt', { ascending: false });
          
        if (error) {
          handleDatabaseError(error, OperationType.GET, 'generations');
        } else if (data) {
          setHistory(data as GenerationLog[]);
        }
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleLogin = async (email: string, password: string, isSignUp: boolean) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error?.message?.includes('already registered')) {
        setLoginError("Este e-mail já está em uso por outra conta.");
      } else if (error?.message?.includes('Invalid login credentials')) {
        setLoginError("E-mail ou senha incorretos.");
      } else if (error?.message?.includes('Password should be at least')) {
        setLoginError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setLoginError(`Falha ao conectar: ${error?.message || error.toString()}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGenerate = async (finalPrompt: string, agentId?: string) => {
    if (!profile || profile.generationsLeft <= 0 || !user) {
      throw new Error("Limite atingido");
    }

    setIsGenerating(true);
    try {
      // 1. Debita o crédito com autoridade total usando o banco de dados (RPC Backend)
      const { data: allowed, error: limitError } = await supabase.rpc('consume_generation', { p_tool_id: selectedTool!.id });
      if (limitError || !allowed) {
        throw new Error("Seu limite de crédito diário para ferramentas foi atingido.");
      }

      // Simulação visual de inteligência evolutiva
      console.log("🧠 [Learning Loop] Analisando contexto anterior na Memória Profunda...");

      // 2. Após o débito real, podemos consultar a resposta
      const response = await generateAIResponse(finalPrompt, selectedTool!.id, agentId);
      
      console.log("✅ [Learning Loop] Resposta otimizada e padrões atualizados. Salvando na Memória.");

      // 3. Atualiza a interface silenciosamente com os novos dados frescos e seguros do DB
      const { data: profileData } = await supabase.rpc('sync_profile');
      if (profileData && profileData.length > 0) {
        setProfile(profileData[0] as UserProfile);
      }

      return response;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneration = async (prompt: string, result: string, score: AIScore, agentId?: string) => {
    if (!user || !selectedTool) return;

    try {
      const newLog = {
        uid: user.id,
        toolId: selectedTool.id,
        toolType: selectedTool.category,
        toolName: selectedTool.name,
        prompt,
        result,
        score,
        agentId,
        createdAt: new Date().toISOString()
      };
      
      const { data, error } = await supabase.from('generations').insert([newLog]).select();
      
      if (error) throw error;
      
      // Update local history
      if (data && data[0]) {
        setHistory(prev => [data[0] as GenerationLog, ...prev]);
      }
    } catch (error) {
      handleDatabaseError(error, OperationType.WRITE, 'generations');
    }

    if (activeWorkflow) {
      if (currentWorkflowStep < activeWorkflow.steps.length - 1) {
        // We stay in the modal but let user know they can proceed
      }
    }
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-xl bg-brand-primary"
        />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} isLoading={isLoading} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-dashboard-bg flex overflow-hidden">
      <Sidebar 
        activeCategory={activeCategory}
        setActiveCategory={(id) => { setActiveCategory(id); setCurrentPage('dashboard'); setIsSidebarOpen(false); }}
        currentPage={currentPage}
        setCurrentPage={(page) => { setCurrentPage(page); setIsSidebarOpen(false); }}
        user={profile}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto w-full">
        <header className="sticky top-0 z-20 bg-dashboard-bg/80 backdrop-blur-md border-b border-card-border p-4 sm:p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-xl lg:hidden text-zinc-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-display font-bold truncate">
                {currentPage === 'dashboard' && (activeCategory === 'all' ? 'Dashboard Inteligente' : CATEGORIES.find(c => c.id === activeCategory)?.name)}
                {currentPage === 'flows' && 'Fluxos de Trabalho'}
                {currentPage === 'history' && 'Memória de Sistema'}
                {currentPage === 'billing' && 'Planos de Alta Performance'}
              </h2>
              <p className="text-[10px] sm:text-sm text-zinc-500 truncate">
                {currentPage === 'dashboard' && `Olá, ${profile?.displayName || 'Usuário'}. Sistema operacional de IA pronto.`}
                {currentPage === 'flows' && 'Siga sequências automatizadas para escalar seus resultados.'}
                {currentPage === 'history' && 'Acesso rápido a todo o contexto gerado anteriormente.'}
                {currentPage === 'billing' && 'Desbloqueie o potencial máximo do OmniAI OS.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all w-64"
              />
            </div>
            {profile?.plan === 'free' && (
              <button 
                onClick={() => setCurrentPage('billing')}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-sm font-bold animate-pulse hover:animate-none transition-all shadow-lg shadow-amber-500/10"
              >
                <Crown className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Upgrade PRO</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            {currentPage === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 bg-linear-to-r from-zinc-900 to-black border border-white/10 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-5 rounded-full blur-[100px] group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col gap-6 font-display">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <Brain className="w-6 h-6 text-brand-primary animate-pulse shrink-0" />
                           <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">AI Orchestrator (Cérebro Central)</h2>
                        </div>
                        <p className="text-sm sm:text-base text-zinc-500 font-sans">O que você deseja conquistar? Digite seu objetivo e deixe o sistema de multi-agentes criar a estratégia.</p>
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const query = formData.get('orchestratorQuery') as string;
                        if(query && query.trim().length > 0) {
                          const missionTool = TOOLS.find(t => t.id === 'mission_mode');
                          if(missionTool) {
                             setSelectedTool(missionTool);
                          }
                        }
                      }} className="relative flex flex-col sm:block">
                        <input 
                          name="orchestratorQuery"
                          type="text" 
                          placeholder="Ex: Quero criar um SaaS em 30 dias..." 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-6 sm:pr-32 py-4 sm:py-5 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white/10 transition-all text-white placeholder:text-zinc-600 font-sans shadow-inner"
                        />
                        <button type="submit" className="mt-4 sm:mt-0 sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 bg-brand-primary hover:bg-brand-secondary text-white px-6 py-4 sm:py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4" />
                          INICIAR MISSÃO
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Gerações Totais</p>
                      <p className="text-2xl font-bold">{profile?.totalGenerations || 0}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Modo de IA</p>
                      <p className="text-2xl font-bold uppercase">{profile?.plan === 'pro' ? 'Neural Pro' : 'Eco Flash'}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Créditos Restantes</p>
                      <p className="text-2xl font-bold">{profile?.generationsLeft || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                  <div className="md:col-span-3 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Super Ferramentas
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTools.map(tool => (
                        <ToolCard 
                          key={tool.id} 
                          tool={tool} 
                          onClick={setSelectedTool} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Tendências do Sistema
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6">
                      {[
                        { title: 'Negócio SaaS', tag: 'Money', hot: true },
                        { title: 'TikTok Ads Mastery', tag: 'Viral', hot: true },
                        { title: 'IA Agents para E-commerce', tag: 'Automation', hot: false }
                      ].map((trend, i) => (
                        <div key={i} className="flex flex-col gap-2 group cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{trend.tag}</span>
                            {trend.hot && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />}
                          </div>
                          <p className="text-sm font-bold group-hover:text-brand-primary transition-colors">{trend.title}</p>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.random() * 60 + 40}%` }}
                              className="h-full bg-linear-to-r from-brand-primary to-brand-secondary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div 
                      onClick={() => {
                        const report = TOOLS.find(t => t.id === 'market_report_2026');
                        if (report) setSelectedTool(report);
                      }}
                      className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-[32px] p-6 text-white overflow-hidden relative group cursor-pointer"
                    >
                      <Crown className="w-20 h-20 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">OmniAI Research</p>
                      <h4 className="text-lg font-bold leading-tight mb-4">Relatório de Mercado: IA em 2026</h4>
                      <button className="flex items-center gap-2 text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors">
                        Ler agora <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentPage === 'flows' && (
              <motion.div 
                key="flows"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {WORKFLOWS.map((flow) => (
                    <div 
                      key={flow.id} 
                      className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:border-brand-primary/40 transition-all group flex flex-col h-full"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <WorkflowIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{flow.name}</h3>
                          <p className="text-sm text-zinc-500">{flow.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        {flow.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                              {i + 1}
                            </div>
                            <span className="text-sm text-zinc-400 font-medium">{step.label}</span>
                            {i < flow.steps.length - 1 && <div className="h-4 w-px bg-white/10 mx-auto" />}
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          const firstTool = TOOLS.find(t => t.id === flow.steps[0].toolId);
                          if (firstTool) {
                            setActiveWorkflow(flow);
                            setCurrentWorkflowStep(0);
                            setSelectedTool(firstTool);
                          }
                        }}
                        className="mt-auto w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        Iniciar Fluxo <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentPage === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 max-w-4xl mx-auto"
              >
                {isHistoryLoading ? (
                  <div className="flex flex-col gap-4 animate-pulse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white/5 h-32 rounded-2xl border border-white/10" />
                    ))}
                  </div>
                ) : (
                  <>
                    {history.map((item) => (
                      <div key={item.id} className="bg-card-bg border border-card-border p-6 rounded-2xl group transition-all hover:border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
                          {TOOLS.find(t => t.id === item.toolId)?.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{item.toolName}</h4>
                          <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            const t = TOOLS.find(t => t.id === item.toolId);
                            if (t) {
                               // Open tool with history results
                               setSelectedTool(t);
                            }
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-zinc-400 mb-2 truncate bg-white/5 px-3 py-1.5 rounded-lg">
                      Input: {item.prompt}
                    </p>
                    <div className="markdown-body p-4 bg-white/[0.01] border border-white/5 rounded-xl line-clamp-3 mb-4">
                      {item.result}
                    </div>
                    <button 
                      onClick={() => {
                        const t = TOOLS.find(tool => tool.id === item.toolId);
                        if (t) {
                          setViewingHistoryResult({ 
                            content: item.result, 
                            score: item.score || { quality: 0, profitPotential: 0, riskLevel: 0 } 
                          });
                          setSelectedTool(t);
                        }
                      }}
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                    >
                      Ler agora <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="py-20 text-center">
                    <History className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Seu histórico está vazio. Comece a criar!</p>
                  </div>
                )}
                </>
                )}
              </motion.div>
            )}

            {currentPage === 'billing' && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] relative overflow-hidden flex flex-col">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2">Eco Flash</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold">R$ 0</span>
                        <span className="text-zinc-500">/mês</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-sm text-zinc-400">
                          <CheckSquare className="w-4 h-4 text-brand-primary" />
                          5 gerações básicas/dia
                        </li>
                        <li className="flex items-center gap-3 text-sm text-zinc-400">
                          <CheckSquare className="w-4 h-4 text-brand-primary" />
                          IA Standard (Flash)
                        </li>
                        <li className="flex items-center gap-3 text-sm text-zinc-500 line-through">
                          <CheckSquare className="w-4 h-4" />
                          Rede Neural Premium
                        </li>
                      </ul>
                      <button disabled className="mt-auto w-full py-4 bg-zinc-800 text-zinc-500 rounded-2xl font-bold cursor-not-allowed">
                        Plano Atual
                      </button>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-brand-primary to-brand-secondary p-[1px] rounded-[40px] shadow-2xl shadow-brand-primary/20 flex flex-col scale-105 z-10">
                    <div className="bg-card-bg h-full w-full p-8 rounded-[40px] relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-4">
                        <Crown className="w-6 h-6 text-amber-500 fill-current rotate-12" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Neural PRO</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-4xl font-bold">R$ 49,90</span>
                          <span className="text-zinc-500">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            Gerações Ilimitadas
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            IA Gemini 3.1 Pro
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            Análise de Scores Ilimitada
                          </li>
                        </ul>
                        <a 
                          href="https://pay.cakto.com.br/kbusidc_853388"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto w-full py-4 bg-linear-to-r from-brand-primary to-brand-secondary text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 block text-center"
                        >
                          Ativar Modo PRO
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-100 p-[1px] rounded-[40px] flex flex-col">
                    <div className="bg-zinc-900 h-full w-full p-8 rounded-[40px] relative overflow-hidden flex flex-col border border-zinc-800">
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 text-white">OS Business</h3>
                        <div className="flex items-baseline gap-1 mb-6 text-white">
                          <span className="text-4xl font-bold">R$ 79,90</span>
                          <span className="text-zinc-500">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            Tudo do PRO + Team Sync
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            Agentes Customizados
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            Suporte 24h via WhatsApp
                          </li>
                        </ul>
                        <a 
                          href="https://pay.cakto.com.br/zhgzgkh_853403"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-100 transition-all shadow-xl block text-center"
                        >
                          Ativar Modo Business
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 bg-white/5 border border-white/10 p-8 rounded-[40px] text-center">
                  <h4 className="text-lg font-bold mb-2">Dúvidas sobre o plano PRO?</h4>
                  <p className="text-zinc-400 text-sm mb-6">Entre em contato com nosso suporte especializado.</p>
                  <a 
                    href="https://wa.me/5564996768385" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all text-white"
                  >
                    Falar com Suporte
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {selectedTool && (
          <GenerationModal 
            tool={selectedTool}
            onClose={() => {
              setSelectedTool(null);
              setViewingHistoryResult(undefined);
            }}
            onGenerate={handleGenerate}
            onSave={handleSaveGeneration}
            isGenerating={isGenerating}
            canGenerate={(profile?.generationsLeft || 0) > 0}
            viewingResult={viewingHistoryResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
