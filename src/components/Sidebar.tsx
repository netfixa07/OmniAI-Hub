import React from 'react';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { Sparkles, History, CreditCard, LogOut, User, Workflow, Layout, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  currentPage: 'dashboard' | 'flows' | 'history' | 'billing';
  setCurrentPage: (page: 'dashboard' | 'flows' | 'history' | 'billing') => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export function Sidebar({ 
  activeCategory, 
  setActiveCategory, 
  currentPage, 
  setCurrentPage,
  user,
  onLogout 
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-card-border bg-dashboard-bg flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
            <Layout className="text-white w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight">OmniAI OS</h1>
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
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t border-card-border">
        {user && (
          <>
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-full h-full p-1.5 text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.displayName || 'Usuário'}</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                    user.plan === 'pro' ? "bg-amber-500/20 text-amber-500" : "bg-zinc-700 text-zinc-400"
                  )}>
                    {user.plan}
                  </span>
                  <span className="text-[10px] text-zinc-500">{user.generationsLeft} rest.</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
