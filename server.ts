import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API key is missing in backend environment.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/debug-env', (req, res) => {
    const key = process.env.GEMINI_API_KEY;
    res.json({ key_exists: !!key, key_start: key ? key.slice(0, 5) : null, key_len: key ? key.length : 0 });
  });

  app.post('/api/generate', async (req, res) => {
    try {
      if (process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY' || !process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'Configuração Incorreta: Você salvou a chave "MY_GEMINI_API_KEY" nas variáveis de ambiente. Por favor, vá em "Settings > Secrets" (Configurações > Segredos), APAGUE o segredo "GEMINI_API_KEY" e reinicie a página. O sistema providenciará uma chave gratuita automaticamente.'
        });
      }

      const { finalPrompt } = req.body;
      if (!finalPrompt) return res.status(400).json({ error: "Missing finalPrompt" });
      
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash", 
        contents: finalPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Backend GenAI Error:", err);
      res.status(500).json({ error: err?.message ? err.message : String(err) });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniAI Hub Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
