import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Copy, Check, Sparkles, AlertCircle, Bot, User, ArrowRight } from 'lucide-react';
import { Tool, AIAgent, AIScore } from '../types';
import { AGENTS } from '../constants';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { ScoreDisplay } from './ScoreDisplay';

interface GenerationModalProps {
  tool: Tool | null;
  onClose: () => void;
  onGenerate: (prompt: string, agentId?: string) => Promise<{ content: string; score: AIScore }>;
  onSave: (prompt: string, result: string, score: AIScore, agentId?: string) => void;
  isGenerating: boolean;
  canGenerate: boolean;
  viewingResult?: { content: string; score: AIScore };
}

export function GenerationModal({ tool, onClose, onGenerate, onSave, isGenerating, canGenerate, viewingResult }: GenerationModalProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState<AIScore | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingState, setThinkingState] = useState('');

  // Auto-set result if tool has predefined content or if viewing from history
  React.useEffect(() => {
    if (viewingResult) {
      setResult(viewingResult.content);
      setScore(viewingResult.score);
    } else if (tool?.id === 'market_report_2026') {
      const mockResult = `
# Relatório de Mercado: O Futuro da IA em 2026

## 1. Hiper-Personalização em Escala
A IA não será mais apenas uma ferramenta de resposta, mas um agente proativo que antecipa necessidades de consumo antes mesmo do usuário expressá-las.

## 2. Economia de Agentes
Empresas serão geridas por "enxames" de agentes autônomos. A função humana migrará de "executor" para "curador de inteligência".

## 3. Democratização do Desenvolvimento
Criar softwares complexos será tão simples quanto descrever uma ideia em áudio. A barreira técnica deixará de existir.

## 4. Otimização de Lucro Real-Time
Algoritmos de precificação dinâmica e análise de sentimento dominarão o e-commerce, ajustando ofertas em milissegundos.

---
*Este é um relatório exclusivo da OmniAI Research.*
      `;
      setResult(mockResult);
      setScore({ quality: 98, profitPotential: 95, riskLevel: 10 });
    } else {
      setResult(null);
      setScore(null);
      setInput('');
    }
  }, [tool, viewingResult]);

  if (!tool) return null;

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating || !canGenerate) return;
    setError(null);
    setThinkingState('Iniciando Orchestrator Supreme...');
    
    // Simular passos do pensamento do "Brain"
    const steps = [
      "Analisando métricas de negócio e intenção oculta...",
      "Quebrando problema em tarefas acionáveis...",
      "Convocando Sistema de Multi-Agentes...",
      "CEO AI debatendo estratégia com Analyst AI...",
      "Consolidando plano com Marketing AI...",
      "Gerando documentação final através do Builder AI..."
    ];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setThinkingState(steps[stepIndex]);
        stepIndex++;
      }
    }, 1500);

    try {
      const prompt = tool.promptTemplate(input);
      const res = await onGenerate(prompt, selectedAgentId);
      clearInterval(interval);
      setResult(res.content);
      setScore(res.score);
      onSave(input, res.content, res.score, selectedAgentId);
    } catch (e: any) {
      clearInterval(interval);
      setError(e?.message || "Ocorreu um erro ao gerar. Tente novamente.");
    } finally {
      clearInterval(interval);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-card-border flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              {tool.icon}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">{tool.name}</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{tool.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-500">Erro de Processamento</p>
                <p className="text-xs text-red-400/80 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {!result ? (
            <div className="space-y-6">
              <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Bot className="w-3 h-3" />
                    Escolha seu Agente Especialista
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AGENTS.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                          selectedAgentId === agent.id 
                            ? "bg-brand-primary/10 border-brand-primary/40 ring-1 ring-brand-primary/20" 
                            : "bg-white/5 border-white/5 hover:border-white/10"
                        )}
                      >
                        <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-sm font-bold leading-tight">{agent.name}</p>
                          <p className="text-[10px] text-zinc-500 leading-tight">{agent.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                  <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Contexto da Solicitação
                    </label>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      input.length > 4000 ? "text-red-400" : "text-zinc-600"
                    )}>
                      {input.length} / 5000
                    </span>
                  </div>
                  <textarea
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, 5000))}
                    placeholder="Descreva seu objetivo detalhadamente para uma melhor resposta..."
                    className="w-full h-40 bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none shadow-inner"
                  />
                </div>
                {!canGenerate && (
                  <div className="flex items-center gap-2 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Você atingiu seu limite diário. Faça upgrade para o PRO!
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {score && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Análise de Inteligência Artificial</span>
                    <ScoreDisplay score={score} />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Relatório Funcional</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold transition-all border border-white/5"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                  <div className="markdown-body p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <ReactMarkdown>{result || ''}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!result && (
            <div className="p-6 border-t border-card-border bg-white/[0.02]">
              <button
                disabled={!input.trim() || isGenerating || !canGenerate}
                onClick={handleGenerate}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all shadow-lg",
                  input.trim() && !isGenerating && canGenerate
                    ? "bg-linear-to-r from-brand-primary to-brand-secondary text-white hover:opacity-90 active:scale-95 shadow-brand-primary/20"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed",
                  isGenerating && "py-6"
                )}
              >
                {isGenerating ? (
                  <>
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5 text-zinc-100" />
                      </motion.div>
                      <span className="text-white text-base">Orchestrator Trabalhando...</span>
                    </div>
                    <motion.p 
                      key={thinkingState}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-zinc-300 font-medium mt-1 font-mono text-center"
                    >
                      {thinkingState}
                    </motion.p>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    EXECUTAR ORCHESTRATOR
                  </div>
                )}
              </button>
              <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.2em] font-bold">
                Powered by Gemini AI (Google) • Turbo Mode Ativo
              </p>
            </div>
          )}
      </motion.div>
    </div>
  );
}
