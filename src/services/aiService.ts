import { GoogleGenAI, Type } from "@google/genai";
import { AGENTS } from "../constants";

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function generateAIResponse(prompt: string, toolId: string, agentId?: string) {
  try {
    const ai = getAIClient();
    const agent = agentId ? AGENTS.find(a => a.id === agentId) : null;
    let systemInstructionContent = agent 
      ? agent.systemInstruction 
      : `Você é o AI ORCHESTRATOR do *OmniAI OS Supreme*. Sua função não é apenas responder, mas atuar como Cérebro Central. 
Diretrizes do Orchestrator:
1. ENTENDA: Analise a intenção oculta do usuário e os objetivos de negócio.
2. PLANEJE: Quebre o problema em etapas acionáveis.
3. CONVOQUE: Simule múltiplos agentes (ex: CEO para estratégia, Marketing para viralidade, Analyst para risco) debatendo internamente para chegar à resposta final.
4. EXECUTE: Forneça um plano de ação tangível, templates, ou execuções reais.
Sempre organize sua resposta em tópicos claros, e adicione uma seção 'Próximos Passos'.`;

    if (toolId.includes('mission')) {
       systemInstructionContent += "\nMODO MISSÃO: Crie sub-tarefas claras, métricas de sucesso, e um plano em 30-60-90 dias.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `${systemInstructionContent} Em seguida, retorne um log estruturado na chave 'content' (em Markdown) e a análise em 'score' (Métricas de 0 a 100).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "Plano de ação formadado em Markdown elegante e denso." },
            score: {
              type: Type.OBJECT,
              properties: {
                quality: { type: Type.NUMBER, description: "Nível de sofisticação 0-100" },
                profitPotential: { type: Type.NUMBER, description: "Potencial de lucro 0-100" },
                riskLevel: { type: Type.NUMBER, description: "Nível de risco (baixo risco = menor valor)" }
              },
              required: ["quality", "profitPotential", "riskLevel"]
            }
          },
          required: ["content", "score"]
        }
      },
    });

    let text = response.text || "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("JSON Parsing failed, attempting manual extraction:", e);
      let manualContent = text;
      
      try {
        // Try to fix markdown artifacts
        let cleanText = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        parsed = JSON.parse(cleanText);
      } catch (innerError) {
        // Attempt regex extraction of "content" field
        const match = text.match(/"content"\s*:\s*"([\s\S]*?)",\s*"score"/);
        if (match && match[1]) {
           manualContent = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        } else {
           // Provide raw text if regex fails, so nothing is lost
           manualContent = "*(Aviso: A formatação da resposta apresentou falhas)*\n\n" + text;
        }
        
        parsed = {
          content: manualContent,
          score: { quality: 70, profitPotential: 50, riskLevel: 30 } // Default metrics fallback
        };
      }
    }

    return {
      content: parsed.content || "Não foi possível gerar conteúdo estruturado.",
      score: parsed.score || { quality: 50, profitPotential: 50, riskLevel: 50 }
    };
  } catch (error) {
    console.error("AI OS Generation Error:", error);
    throw new Error("Falha na rede neural do OmniAI. Tente novamente.");
  }
}
