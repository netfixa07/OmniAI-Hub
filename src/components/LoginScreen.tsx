import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function LoginScreen({ onLogin, isLoading, error }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card-bg border border-card-border p-8 rounded-[40px] shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-6 shadow-xl shadow-brand-primary/20">
              <Sparkles className="text-white w-10 h-10 fill-current" />
            </div>
            <h1 className="font-display font-bold text-4xl mb-2 tracking-tight">OmniAI Hub</h1>
            <p className="text-zinc-400">Sua plataforma all-in-one de inteligência artificial.</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl font-medium text-center">
                {error}
              </div>
            )}
            
            <button
              onClick={onLogin}
              disabled={isLoading}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                "bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-lg",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5"
                referrerPolicy="no-referrer"
              />
              {isLoading ? 'Iniciando sessão...' : 'Entrar com Google'}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-card-border flex-1" />
              <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Acesso seguro</span>
              <div className="h-px bg-card-border flex-1" />
            </div>

            <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-semibold leading-relaxed">
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold font-display">17+</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Ferramentas AI</p>
          </div>
          <div className="w-px h-8 bg-card-border" />
          <div className="text-center">
            <p className="text-2xl font-bold font-display">100%</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Cloud Ready</p>
          </div>
          <div className="w-px h-8 bg-card-border" />
          <div className="text-center">
            <p className="text-2xl font-bold font-display">Turbo</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Gemini Engine</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
