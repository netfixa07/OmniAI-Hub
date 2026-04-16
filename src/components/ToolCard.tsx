import React from 'react';
import { motion } from 'motion/react';
import { Tool } from '../types';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => onClick(tool)}
      className="group flex flex-col p-5 bg-card-bg border border-card-border rounded-2xl text-left transition-colors hover:border-brand-primary/50 relative overflow-hidden"
    >
      <div className="mb-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand-primary transition-colors">
        {tool.icon}
      </div>
      
      <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-white transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">
        {tool.description}
      </p>

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-brand-primary transition-colors">
        Usar ferramenta
        <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 blur-3xl rounded-full translate-x-12 -translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
