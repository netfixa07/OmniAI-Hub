import React from 'react';
import { AIScore } from '../types';
import { CheckCircle2, DollarSign, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScoreDisplayProps {
  score: AIScore;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const getLevel = (val: number) => {
    if (val >= 80) return 'high';
    if (val >= 40) return 'mid';
    return 'low';
  };

  const colors = {
    high: 'text-green-400 bg-green-400/10 shadow-green-400/20',
    mid: 'text-amber-400 bg-amber-400/10 shadow-amber-400/20',
    low: 'text-red-400 bg-red-400/10 shadow-red-400/20',
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/5", colors[getLevel(score.quality)])}>
        <CheckCircle2 className="w-3 h-3" />
        Qualidade {score.quality}%
      </div>
      <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/5", colors[getLevel(score.profitPotential)])}>
        <DollarSign className="w-3 h-3" />
        Lucro {score.profitPotential}%
      </div>
      <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/5", colors[getLevel(100 - score.riskLevel)])}>
        <AlertTriangle className="w-3 h-3" />
        Risco {score.riskLevel}%
      </div>
    </div>
  );
}
