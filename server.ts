import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `Eres el asistente virtual oficial de "Wok Crunch Oriental", un restaurante de comida oriental con servicio de delivery.
Tu tono es amable, cercano y entusiasta, reflejando el eslogan "Sabor oriental en cada bocado".

INFORMACIÓN DEL NEGOCIO:
- Nombre: Wok Crunch Oriental
- Delivery: WhatsApp 0991607393 (Paraguay, prefijo internacional: +595991607393)

MENÚ EXACTO Y PRECIOS:
🍚 ARROZ FRITO
- Arroz frito de pollo: ₲23.000
- Arroz frito con carne: ₲25.000
- Arroz frito de camarón: ₲75.000

🍜 YAKISOBA
- Yakisoba de pollo: ₲25.000
- Yakisoba de carne: ₲28.000
- Yakisoba de camarón: ₲75.000

🍗 POLLO FRITO
- Pollo frito agridulce: ₲40.000
- Pollo frito picante: ₲40.000
- Pollo frito normal: ₲35.000

🍟 PAPAS FRITAS
- Pequeña: ₲15.000
- Grande: ₲20.000

🍔 HAMBURGUESAS
- Pequeña: ₲15.000
- Grande: ₲25.000

TUS FUNCIONES:
1. Saludar al cliente y presentarte como el asistente de Wok Crunch Oriental.
2. Mostrar el menú completo o por categorías si el cliente lo pide.
3. Tomar el pedido, confirmando cantidad, tamaño (si aplica) y variante (agridulce, picante, normal, etc.).
4. Calcular el total del pedido.
5. Preguntar la dirección de entrega y forma de pago.
6. Confirmar el pedido completo antes de finalizar (resumen con ítems, cantidades y precio total).
7. Si el cliente pregunta por ingredientes o tiempos de entrega y no tienes esa información, indica amablemente que debe confirmarlo con el local al WhatsApp 0991607393.

REGLAS ESTRICTAS:
- Usa siempre los precios exactos indicados arriba (en guaraníes, símbolo ₲).
- No inventes platos ni precios que no estén en el menú.
- Sé breve y claro en las respuestas, usando emojis con moderación para mantener el tono festivo de la marca.
- Si el pedido es ambiguo (ej. "quiero pollo frito" sin especificar variante), pregunta cuál desea con amabilidad detallando las opciones (Agridulce ₲40.000, Picante ₲40.000 o Normal ₲35.000).

Responde SIEMPRE en formato JSON válido:
{
  "reply": "Tu mensaje para el cliente (amable, con formato claro)",
  "order": {
    "items": [
      {
        "name": "Nombre exacto del plato",
        "quantity": 1,
        "unitPrice": 23000,
        "subtotal": 23000
      }
    ],
    "total": 23000,
    "deliveryAddress": "Dirección mencionada o null",
    "paymentMethod": "Forma de pago o null",
    "isConfirmed": false
  },
  "quickReplies": ["Texto sugerencia 1", "Texto sugerencia 2"]
}`;

const MENU_CATALOG_DATA = [
  { keywords: ['arroz', 'pollo'], name: 'Arroz frito de pollo', price: 23000 },
  { keywords: ['arroz', 'carne'], name: 'Arroz frito con carne', price: 25000 },
  { keywords: ['arroz', 'camaron'], name: 'Arroz frito de camarón', price: 75000 },
  { keywords: ['arroz', 'camarón'], name: 'Arroz frito de camarón', price: 75000 },
  { keywords: ['yakisoba', 'pollo'], name: 'Yakisoba de pollo', price: 25000 },
  { keywords: ['yakisoba', 'carne'], name: 'Yakisoba de carne', price: 28000 },
  { keywords: ['yakisoba', 'camaron'], name: 'Yakisoba de camarón', price: 75000 },
  { keywords: ['yakisoba', 'camarón'], name: 'Yakisoba de camarón', price: 75000 },
  { keywords: ['pollo', 'agridulce'], name: 'Pollo frito agridulce', price: 40000 },
  { keywords: ['pollo', 'picante'], name: 'Pollo frito picante', price: 40000 },
  { keywords: ['pollo', 'normal'], name: 'Pollo frito normal', price: 35000 },
  { keywords: ['papa', 'pequeña'], name: 'Papas fritas (Pequeña)', price: 15000 },
  { keywords: ['papa', 'grande'], name: 'Papas fritas (Grande)', price: 20000 },
  { keywords: ['hamburguesa', 'pequeña'], name: 'Hamburguesa (Pequeña)', price: 15000 },
  { keywords: ['hamburguesa', 'grande'], name: 'Hamburguesa (Grande)', price: 25000 },
];

function generateFallbackResponse(userMessage: string, previousOrder?: any) {
  const lower = userMessage.toLowerCase().trim();

  // Check greetings
  if (lower.includes('hola') || lower.includes('buenas') || lower.includes('inicio')) {
    return {
      reply: '¡Hola! 👋 ¡Bienvenido/a a Wok Crunch Oriental! 🥢 "Sabor oriental en cada bocado". Soy tu asistente virtual y estoy listo para tomar tu pedido de delivery o mostrarte nuestro delicioso menú. ¿En qué te puedo ayudar hoy?',
      order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
      quickReplies: ['📜 Ver menú completo', '🍗 Pollo frito opciones', '🍜 Yakisoba', '🍚 Arroz frito']
    };
  }

  // Check menu request
  if (lower.includes('menu') || lower.includes('menú') || lower.includes('carta') || lower.includes('precios')) {
    return {
      reply: `🥢 ¡Con gusto! Aquí tienes el menú oficial de Wok Crunch Oriental:\n\n🍚 ARROZ FRITO\n• Pollo: ₲23.000\n• Carne: ₲25.000\n• Camarón: ₲75.000\n\n🍜 YAKISOBA\n• Pollo: ₲25.000\n• Carne: ₲28.000\n• Camarón: ₲75.000\n\n🍗 POLLO FRITO\n• Agridulce: ₲40.000\n• Picante: ₲40.000\n• Normal: ₲35.000\n\n🍟 PAPAS FRITAS\n• Pequeña: ₲15.000 | Grande: ₲20.000\n\n🍔 HAMBURGUESAS\n• Pequeña: ₲15.000 | Grande: ₲25.000\n\n¿Qué delicia te gustaría pedir? ✨`,
      order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
      quickReplies: ['1 Arroz frito de pollo', '1 Yakisoba de carne', '1 Pollo frito agridulce', 'Papas grandes']
    };
  }

  // Check ambiguous chicken order
  if (lower.includes('pollo frito') && !lower.includes('agridulce') && !lower.includes('picante') && !lower.includes('normal')) {
    return {
      reply: '¡Excelente elección! 🍗 Para el Pollo Frito tenemos 3 opciones deliciosas:\n\n1️⃣ Pollo frito agridulce: ₲40.000\n2️⃣ Pollo frito picante: ₲40.000\n3️⃣ Pollo frito normal: ₲35.000\n\n¿Cuál de estas variantes prefieres?',
      order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
      quickReplies: ['Pollo frito agridulce', 'Pollo frito picante', 'Pollo frito normal']
    };
  }

  // Check items detected in message
  const detectedItems: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }> = 
    previousOrder?.items ? [...previousOrder.items] : [];

  MENU_CATALOG_DATA.forEach((menuItem) => {
    const match = menuItem.keywords.every((kw) => lower.includes(kw));
    if (match) {
      // Find quantity if specified like "2 arroz"
      const qtyMatch = lower.match(new RegExp(`(\\d+)\\s*(?:x|de)?\\s*${menuItem.keywords[0]}`));
      const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;

      const existingIndex = detectedItems.findIndex((it) => it.name === menuItem.name);
      if (existingIndex >= 0) {
        detectedItems[existingIndex].quantity += qty;
        detectedItems[existingIndex].subtotal = detectedItems[existingIndex].quantity * menuItem.price;
      } else {
        detectedItems.push({
          name: menuItem.name,
          quantity: qty,
          unitPrice: menuItem.price,
          subtotal: qty * menuItem.price,
        });
      }
    }
  });

  if (detectedItems.length > 0) {
    const total = detectedItems.reduce((acc, it) => acc + it.subtotal, 0);
    return {
      reply: `¡Excelente elección! 🥢 He anotado en tu pedido:\n${detectedItems.map((i) => `• ${i.quantity}x ${i.name} (${i.subtotal.toLocaleString('es-PY')} ₲)`).join('\n')}\n\n💰 Total acumulado: ₲${total.toLocaleString('es-PY')}.\n\n¿Te gustaría agregar algo más, o me indicas tu dirección de entrega y forma de pago?`,
      order: {
        items: detectedItems,
        total,
        deliveryAddress: previousOrder?.deliveryAddress || null,
        paymentMethod: previousOrder?.paymentMethod || null,
        isConfirmed: false,
      },
      quickReplies: ['📍 Indicar dirección', '🍗 Agregar Pollo Frito', '🍟 Agregar Papas Fritas', '✅ Confirmar pedido'],
    };
  }

  return {
    reply: '¡Con gusto te ayudo! 🥢 Puedes pedir cualquiera de nuestros platos: Arroz frito, Yakisoba, Pollo frito (agridulce, picante o normal), Papas o Hamburguesas. ¿Qué deseas ordenar hoy?',
    order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
    quickReplies: ['📜 Ver Menú', '🍗 Pollo Frito', '🛵 WhatsApp 0991607393'],
  };
}

app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, currentOrder } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json(generateFallbackResponse(lastUserMsg, currentOrder));
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Build contents payload
  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  if (currentOrder && currentOrder.items && currentOrder.items.length > 0) {
    const orderContext = `[Contexto actual del pedido del cliente: ${JSON.stringify(currentOrder.items)}, Total acumulado: ₲${currentOrder.total}. Mantén la lista completa actualizada con los ítems y calcula el total exacto.]`;
    contents[contents.length - 1].parts.push({ text: `\n\n${orderContext}` });
  }

  // Model cascade: 'gemini-3.8-flash' -> fallback 'gemini-flash-latest' -> fallback 'gemini-3.1-flash-lite'
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const text = response.text || '';
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      }

      if (parsedData && parsedData.reply) {
        return res.json(parsedData);
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} returned error:`, err?.status || err?.message);
      // continue to next model in cascade
    }
  }

  // If all models failed (e.g. temporary API spike or rate limit), use intelligent rule-based response
  return res.json(generateFallbackResponse(lastUserMsg, currentOrder));
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    restaurant: 'Wok Crunch Oriental',
    version: '1.0.0',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
