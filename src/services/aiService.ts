import { GoogleGenAI, Type } from "@google/genai";
import { AGENTS } from "../constants";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function generateAIResponse(prompt: string, toolId: string, agentId?: string) {
  try {
    const agent = agentId ? AGENTS.find(a => a.id === agentId) : null;
    const systemInstructionContent = agent 
      ? agent.systemInstruction 
      : "Você é o núcleo do OmniAI OS, um sistema extremamente avançado de produtividade e IA. Sua missão é fornecer respostas estruturadas, úteis e de alta performance.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `${systemInstructionContent} Adicionalmente, você deve fornecer uma resposta estruturada contendo o conteúdo principal em Markdown e três métricas (0-100): Qualidade, Potencial de Lucro e Nível de Risco.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "O conteúdo principal da resposta formatado em Markdown" },
            score: {
              type: Type.OBJECT,
              properties: {
                quality: { type: Type.NUMBER },
                profitPotential: { type: Type.NUMBER },
                riskLevel: { type: Type.NUMBER }
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
