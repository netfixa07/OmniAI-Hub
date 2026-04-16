export type Plan = 'free' | 'pro' | 'business';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  plan: Plan;
  generationsLeft: number;
  totalGenerations: number;
  lastGenerationDate: string;
  createdAt: string;
  usageStats?: {
    [toolId: string]: number;
  };
}

export interface AIScore {
  quality: number;
  profitPotential: number;
  riskLevel: number;
}

export interface GenerationLog {
  id?: string;
  uid: string;
  toolId: string;
  toolType: string;
  toolName: string;
  prompt: string;
  result: string;
  createdAt: string;
  score?: AIScore;
  agentId?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'money' | 'viral' | 'automation' | 'think' | 'work';
  promptTemplate: (input: string) => string;
  premium?: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  systemInstruction: string;
}

export interface WorkflowStep {
  toolId: string;
  label: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}
