export interface DetectedOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AssistantOrderState {
  items: DetectedOrderItem[];
  total: number;
  deliveryAddress: string | null;
  paymentMethod: string | null;
  isConfirmed: boolean;
}

export interface AssistantResponse {
  reply: string;
  order: AssistantOrderState;
  quickReplies: string[];
}

export const SYSTEM_INSTRUCTION = `Eres el asistente virtual oficial de "Wok Crunch Oriental", un restaurante de comida oriental con servicio de delivery.
Tu tono es amable, cercano y entusiasta, reflejando el eslogan "Sabor oriental en cada bocado".

INFORMACIÓN DEL NEGOCIO:
- Nombre: Wok Crunch Oriental
- Delivery: WhatsApp 0991607393 (Paraguay, prefijo internacional: +595991607393)

MENÚ EXACTO Y PRECIOS (en Guaraníes, símbolo ₲):
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
5. Preguntar la dirección de entrega y forma de pago (Efectivo, Transferencia, Tarjeta).
6. Confirmar el pedido completo antes de finalizar (resumen con ítems, cantidades y precio total).
7. Si el cliente pregunta por ingredientes o tiempos de entrega y no tienes esa información, indica amablemente que debe confirmarlo con el local al WhatsApp 0991607393.
8. Si el cliente te escribe en portugués ("Olá", "gostaria de fazer um pedido", etc.), atiéndelo en portugués con calidez manteniendo los nombres exactos de los platos y precios en Guaraníes (₲).

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

export const MENU_CATALOG_DATA = [
  { keywords: ['arroz', 'pollo'], altKeywords: ['arroz', 'frango'], name: 'Arroz frito de pollo', price: 23000 },
  { keywords: ['arroz', 'carne'], altKeywords: ['arroz', 'bife'], name: 'Arroz frito con carne', price: 25000 },
  { keywords: ['arroz', 'camaron'], altKeywords: ['arroz', 'camarão'], name: 'Arroz frito de camarón', price: 75000 },
  { keywords: ['arroz', 'camarón'], altKeywords: ['arroz', 'camarao'], name: 'Arroz frito de camarón', price: 75000 },
  { keywords: ['yakisoba', 'pollo'], altKeywords: ['yakisoba', 'frango'], name: 'Yakisoba de pollo', price: 25000 },
  { keywords: ['yakisoba', 'carne'], altKeywords: ['yakisoba', 'bife'], name: 'Yakisoba de carne', price: 28000 },
  { keywords: ['yakisoba', 'camaron'], altKeywords: ['yakisoba', 'camarão'], name: 'Yakisoba de camarón', price: 75000 },
  { keywords: ['yakisoba', 'camarón'], altKeywords: ['yakisoba', 'camarao'], name: 'Yakisoba de camarón', price: 75000 },
  { keywords: ['pollo', 'agridulce'], altKeywords: ['frango', 'agridoce'], name: 'Pollo frito agridulce', price: 40000 },
  { keywords: ['pollo', 'picante'], altKeywords: ['frango', 'picante'], name: 'Pollo frito picante', price: 40000 },
  { keywords: ['pollo', 'normal'], altKeywords: ['frango', 'normal'], name: 'Pollo frito normal', price: 35000 },
  { keywords: ['papa', 'pequeña'], altKeywords: ['batata', 'pequena'], name: 'Papas fritas (Pequeña)', price: 15000 },
  { keywords: ['papa', 'grande'], altKeywords: ['batata', 'grande'], name: 'Papas fritas (Grande)', price: 20000 },
  { keywords: ['hamburguesa', 'pequeña'], altKeywords: ['hamburguer', 'pequena'], name: 'Hamburguesa (Pequeña)', price: 15000 },
  { keywords: ['hamburguesa', 'grande'], altKeywords: ['hamburguer', 'grande'], name: 'Hamburguesa (Grande)', price: 25000 },
];

export function cleanAndParseJson(raw: string): AssistantResponse | null {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export function generateFallbackResponse(userMessage: string, previousOrder?: any): AssistantResponse {
  const lower = userMessage.toLowerCase().trim();

  // Check greetings (Spanish and Portuguese)
  if (
    lower.includes('hola') ||
    lower.includes('buenas') ||
    lower.includes('ola') ||
    lower.includes('olá') ||
    lower.includes('boa noite') ||
    lower.includes('bom dia')
  ) {
    return {
      reply:
        '¡Hola! 👋 ¡Bienvenido/a a Wok Crunch Oriental! 🥢 "Sabor oriental en cada bocado". Soy tu asistente virtual y estoy listo para tomar tu pedido de delivery o mostrarte nuestro delicioso menú. ¿En qué te puedo ayudar hoy?',
      order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
      quickReplies: ['📜 Ver menú completo', '🍗 Pollo frito opciones', '🍜 Yakisoba', '🍚 Arroz frito'],
    };
  }

  // Check menu request
  if (
    lower.includes('menu') ||
    lower.includes('menú') ||
    lower.includes('carta') ||
    lower.includes('precios') ||
    lower.includes('cardapio') ||
    lower.includes('cardápio')
  ) {
    return {
      reply: `🥢 ¡Con gusto! Aquí tienes el menú oficial de Wok Crunch Oriental:\n\n🍚 ARROZ FRITO\n• Pollo: ₲23.000\n• Carne: ₲25.000\n• Camarón: ₲75.000\n\n🍜 YAKISOBA\n• Pollo: ₲25.000\n• Carne: ₲28.000\n• Camarón: ₲75.000\n\n🍗 POLLO FRITO\n• Agridulce: ₲40.000\n• Picante: ₲40.000\n• Normal: ₲35.000\n\n🍟 PAPAS FRITAS\n• Pequeña: ₲15.000 | Grande: ₲20.000\n\n🍔 HAMBURGUESAS\n• Pequeña: ₲15.000 | Grande: ₲25.000\n\n¿Qué delicia te gustaría pedir? ✨`,
      order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
      quickReplies: ['1 Arroz frito de pollo', '1 Yakisoba de carne', '1 Pollo frito agridulce', 'Papas grandes'],
    };
  }

  // Check ambiguous chicken order
  if (
    (lower.includes('pollo frito') || lower.includes('frango frito') || lower.includes('pollo') || lower.includes('frango')) &&
    !lower.includes('agridulce') &&
    !lower.includes('agridoce') &&
    !lower.includes('picante') &&
    !lower.includes('normal') &&
    !lower.includes('arroz') &&
    !lower.includes('yakisoba')
  ) {
    return {
      reply:
        '¡Excelente elección! 🍗 Para el Pollo Frito tenemos 3 opciones deliciosas:\n\n1️⃣ Pollo frito agridulce: ₲40.000\n2️⃣ Pollo frito picante: ₲40.000\n3️⃣ Pollo frito normal: ₲35.000\n\n¿Cuál de estas variantes prefieres?',
      order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
      quickReplies: ['Pollo frito agridulce', 'Pollo frito picante', 'Pollo frito normal'],
    };
  }

  // Check items detected in message
  const detectedItems: DetectedOrderItem[] = previousOrder?.items ? [...previousOrder.items] : [];

  MENU_CATALOG_DATA.forEach((menuItem) => {
    const matchEs = menuItem.keywords.every((kw) => lower.includes(kw));
    const matchPt = menuItem.altKeywords ? menuItem.altKeywords.every((kw) => lower.includes(kw)) : false;

    if (matchEs || matchPt) {
      const matchWord = matchEs ? menuItem.keywords[0] : menuItem.altKeywords?.[0] || '';
      const qtyMatch = lower.match(new RegExp(`(\\d+)\\s*(?:x|de)?\\s*${matchWord}`));
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
      reply: `¡Excelente elección! 🥢 He anotado en tu pedido:\n${detectedItems
        .map((i) => `• ${i.quantity}x ${i.name} (${i.subtotal.toLocaleString('es-PY')} ₲)`)
        .join('\n')}\n\n💰 Total acumulado: ₲${total.toLocaleString('es-PY')}.\n\n¿Te gustaría agregar algo más, o me indicas tu dirección de entrega y forma de pago?`,
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
    reply:
      '¡Con gusto te ayudo! 🥢 Puedes pedir cualquiera de nuestros platos: Arroz frito, Yakisoba, Pollo frito (agridulce, picante o normal), Papas o Hamburguesas. ¿Qué deseas ordenar hoy?',
    order: previousOrder || { items: [], total: 0, deliveryAddress: null, paymentMethod: null, isConfirmed: false },
    quickReplies: ['📜 Ver Menú', '🍗 Pollo Frito', '🛵 WhatsApp 0991607393'],
  };
}
