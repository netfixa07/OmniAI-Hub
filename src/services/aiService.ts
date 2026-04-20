import { AGENTS } from "../constants";

export async function generateAIResponse(prompt: string, toolId: string, agentId?: string) {
  try {
    const agent = agentId ? AGENTS.find(a => a.id === agentId) : null;
    let systemInstructionContent = agent 
      ? agent.systemInstruction 
      : `Você é o AI ORCHESTRATOR SUPREME. Sua missão é elevar cada solicitação do usuário a um patamar executivo de elite.
Diretrizes de Inteligência:
1. PENSAMENTO ESTRATÉGICO: Não apenas responda, mas analise o impacto macro e micro da solicitação.
2. COMUNICAÇÃO DE ELITE: Use um tom profissional, sofisticado e preciso, mas mantenha a clareza absoluta (evite jargões desnecessários, explique conceitos complexos).
3. ORQUESTRAÇÃO RADICAL: Simule um conselho deliberativo entre seus agentes especializados (CEO, Marketing, Copy, Analyst, Builder). Apresente o resultado desse debate interno como uma solução integrada e superior.
4. ESTRUTURAÇÃO IMPECÁVEL: Utilize Markdown para criar hierarquia visual clara, tabelas para dados e listas para ações.
Sempre finalize com uma seção de 'Insights de Escala' e 'Roadmap de Curto Prazo'.`;

    if (toolId.includes('mission')) {
       systemInstructionContent += "\nMODO MISSÃO: Crie sub-tarefas claras, métricas de sucesso, e um plano em 30-60-90 dias.";
    }

    // Usando estrutura recomendada pela skill gemini-api
    const finalPrompt = `CONTEXTO DO SISTEMA: ${systemInstructionContent}\n\nSOLICITAÇÃO DO USUÁRIO: ${prompt}\n\nResponda estritamente em JSON: { "content": "Markdown", "score": { "quality": 100, "profitPotential": 100, "riskLevel": 100 } }`;

    const requestBody = { finalPrompt };
    
    const backendResponse = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!backendResponse.ok) {
       let errMessage = "Internal Server Error";
       try {
         const errData = await backendResponse.json();
         errMessage = errData.error || errMessage;
       } catch(e) {}
       throw new Error(errMessage);
    }

    const response = await backendResponse.json();
    const text = response.text || "";

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("JSON Parsing failed, attempting extraction:", e);
      let manualContent = text;
      
      try {
        let cleanText = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        parsed = JSON.parse(cleanText);
      } catch (innerError) {
        const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)"(?=\s*,\s*"score"|\s*})/);
        if (contentMatch && contentMatch[1]) {
           manualContent = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        } else {
           manualContent = "*(Processado em modo de segurança)*\n\n" + text;
        }
        
        parsed = {
          content: manualContent,
          score: { quality: 80, profitPotential: 75, riskLevel: 20 }
        };
      }
    }

    return {
      content: parsed.content || "Não foi possível estruturar a resposta.",
      score: parsed.score || { quality: 50, profitPotential: 50, riskLevel: 50 }
    };
  } catch (error: any) {
    console.error("AI OS Generation Error:", error);
    
    if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("COTA EXCEDIDA: O projeto atingiu o limite de gastos. Verifique o Google AI Studio.");
    }
    
    if (error?.message?.includes('404') || error?.message?.includes('not found')) {
      throw new Error("ERRO DE MODELO: O motor de IA solicitado não foi encontrado. O sistema está sendo reajustado.");
    }
    
    throw new Error(`Erro na conexão neural: ${error?.message || "Erro interno"}`);
  }
}
