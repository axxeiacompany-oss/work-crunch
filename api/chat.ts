import { GoogleGenAI } from '@google/genai';
import {
  SYSTEM_INSTRUCTION,
  cleanAndParseJson,
  generateFallbackResponse,
} from '../src/utils/assistantLogic.ts';

export default async function handler(req: any, res: any) {
  // CORS support for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use as is
      }
    }

    const { messages, currentOrder } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json(generateFallbackResponse(lastUserMsg, currentOrder));
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let rawTurns = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    if (rawTurns.length > 0 && rawTurns[0].role === 'model') {
      rawTurns = rawTurns.slice(1);
    }

    if (rawTurns.length === 0) {
      rawTurns = [{ role: 'user', parts: [{ text: lastUserMsg || 'Hola' }] }];
    }

    if (currentOrder && currentOrder.items && currentOrder.items.length > 0) {
      const orderContext = `[Contexto actual del pedido del cliente: ${JSON.stringify(currentOrder.items)}, Total acumulado: ₲${currentOrder.total}. Mantén la lista completa actualizada con los ítems y calcula el total exacto.]`;
      rawTurns[rawTurns.length - 1].parts.push({ text: `\n\n${orderContext}` });
    }

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: rawTurns,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.5,
          },
        });

        const text = response.text || '';
        const parsedData = cleanAndParseJson(text);

        if (parsedData && parsedData.reply) {
          return res.status(200).json(parsedData);
        }
      } catch (err: any) {
        console.warn(`[Vercel Serverless] Model ${modelName} error:`, err?.status || err?.message);
      }
    }

    return res.status(200).json(generateFallbackResponse(lastUserMsg, currentOrder));
  } catch (error: any) {
    console.error('[Vercel Serverless] Error in /api/chat:', error);
    const lastUserMsg = req.body?.messages?.[req.body?.messages?.length - 1]?.content || '';
    return res.status(200).json(generateFallbackResponse(lastUserMsg, req.body?.currentOrder));
  }
}
