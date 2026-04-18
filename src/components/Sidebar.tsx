import React from 'react';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { Sparkles, History, CreditCard, LogOut, User, Workflow, Layout, ShieldCheck, X } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  currentPage: 'dashboard' | 'flows' | 'history' | 'billing';
  setCurrentPage: (page: 'dashboard' | 'flows' | 'history' | 'billing') => void;
  user: UserProfile | null;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ 
  activeCategory, 
  setActiveCategory, 
  currentPage, 
  setCurrentPage,
  user,
  onLogout,
  isOpen = false,
  onClose
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 lg:w-64 border-r border-card-border bg-dashboard-bg flex flex-col h-screen transition-transform duration-300 lg:relative lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0 shadow-2xl shadow-brand-primary/20" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8 lg:block">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Layout className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg tracking-tight leading-none">OmniAI OS</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Supreme Edition</span>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

        <nav className="space-y-1">
          <button
            onClick={() => { setCurrentPage('dashboard'); setActiveCategory('all'); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              currentPage === 'dashboard' ? "bg-white/10 text-brand-primary shadow-lg ring-1 ring-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Sparkles className={cn("w-4 h-4 transition-transform group-hover:scale-110", currentPage === 'dashboard' ? "text-brand-primary" : "")} />
            Super Ferramentas
          </button>

          <button
            onClick={() => setCurrentPage('flows')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              currentPage === 'flows' ? "bg-white/10 text-brand-primary shadow-lg ring-1 ring-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Workflow className={cn("w-4 h-4 transition-transform group-hover:scale-110", currentPage === 'flows' ? "text-brand-primary" : "")} />
            Fluxos de Escala
          </button>
          
          <button
            onClick={() => setCurrentPage('history')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              currentPage === 'history' ? "bg-white/10 text-brand-primary shadow-lg ring-1 ring-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <History className={cn("w-4 h-4 transition-transform group-hover:scale-110", currentPage === 'history' ? "text-brand-primary" : "")} />
            Memória Inteligente
          </button>

          <button
            onClick={() => setCurrentPage('billing')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              currentPage === 'billing' ? "bg-white/10 text-brand-primary shadow-lg ring-1 ring-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <CreditCard className={cn("w-4 h-4 transition-transform group-hover:scale-110", currentPage === 'billing' ? "text-brand-primary" : "")} />
            Planos & Pagamentos
          </button>
        </nav>

        {currentPage === 'dashboard' && (
          <div className="mt-8">
            <h2 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              MODOS DE IA
            </h2>
            <div className="space-y-1">
              {CATEGORIES.slice(1).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeCategory === cat.id ? "text-brand-primary bg-brand-primary/10 border-r-2 border-brand-primary rounded-r-none" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {cat.icon}
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t border-card-border bg-white/[0.01]">
        {user && (
          <div className="space-y-4">
            <div className="bg-linear-to-br from-brand-primary/10 to-transparent p-4 rounded-2xl border border-brand-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand-primary/20 p-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Perfil Supreme</p>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10 shrink-0">
                  <User className="w-full h-full p-2 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{user.displayName || 'Usuário'}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold truncate">{user.plan || 'Free Account'}</p>
                </div>
              </div>

              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary transition-all duration-1000" 
                  style={{ width: `${Math.min(((user?.generationsLeft || 0) / (user?.totalGenerations || 5)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase">
                {user?.generationsLeft} / {user?.totalGenerations || 5} Créditos
              </p>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair do Sistema
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
