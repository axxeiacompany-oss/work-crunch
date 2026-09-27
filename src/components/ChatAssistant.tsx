import React, { useState, useRef, useEffect } from 'react';
import { RESTAURANT_INFO, formatGuarani } from '../data/menu';
import { 
  Send, 
  Flame, 
  RotateCcw, 
  Sparkles, 
  Phone, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  MessageCircleQuestion,
  MapPin,
  CreditCard
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  orderPreview?: {
    items: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }>;
    total: number;
    deliveryAddress?: string | null;
    paymentMethod?: string | null;
  };
  quickReplies?: string[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CurrentOrder {
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  isConfirmed: boolean;
}

interface ChatAssistantProps {
  currentOrder: CurrentOrder;
  onUpdateOrder: (order: Partial<CurrentOrder>) => void;
  onOpenOrderModal: () => void;
  onSelectTab: (tab: 'chat' | 'menu' | 'info') => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  role: 'assistant',
  content: `¡Hola! 👋 ¡Te damos la bienvenida a **Wok Crunch Oriental**! 🥢\n\n*"Sabor oriental en cada bocado"*\n\nSoy tu asistente virtual oficial. Estoy aquí para mostrarte nuestro menú, recomendarte platos, tomar tu pedido de delivery y calcular el total exacto. ¿Qué se te antoja disfrutar hoy?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  quickReplies: [
    '📜 Ver menú completo',
    '🍗 Pollo frito opciones',
    '🍜 Yakisoba de carne',
    '🍚 Arroz frito de pollo',
    '🛵 Delivery a mi dirección'
  ]
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  currentOrder,
  onUpdateOrder,
  onOpenOrderModal,
  onSelectTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build API messages payload
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          currentOrder,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '¡Pedido recibido! ¿Te gustaría confirmar algo más?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: data.quickReplies && data.quickReplies.length > 0 ? data.quickReplies : undefined,
        orderPreview: data.order && data.order.items && data.order.items.length > 0 ? data.order : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If backend detected an updated order state, synchronize with main app order
      if (data.order && Array.isArray(data.order.items) && data.order.items.length > 0) {
        onUpdateOrder({
          items: data.order.items,
          total: data.order.total || data.order.items.reduce((s: number, i: any) => s + (i.subtotal || i.unitPrice * i.quantity), 0),
          deliveryAddress: data.order.deliveryAddress || currentOrder.deliveryAddress,
          paymentMethod: data.order.paymentMethod || currentOrder.paymentMethod,
          isConfirmed: Boolean(data.order.isConfirmed),
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '¡Disculpa! Hubo un detalle de conexión, pero aquí estoy listo para seguir tomando tu pedido. También puedes contactar directamente con el local por WhatsApp al 0991607393. ¿Qué deseas ordenar?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['📜 Ver Menú', '🍗 Pollo Frito', '📲 WhatsApp'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setShowResetConfirm(false);
  };

  const activeQuickReplies = messages[messages.length - 1]?.quickReplies || [];

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-4xl mx-auto px-2 sm:px-4 py-2">
      {/* Top Banner Card with Flyer Inspiration */}
      <div className="bg-gradient-to-r from-red-950/80 via-[#181822] to-amber-950/70 border border-red-900/40 rounded-2xl p-3.5 mb-2.5 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
            <Flame className="w-5 h-5 fill-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Asistente de Pedidos Delivery</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded border border-red-500/30">
                En Línea
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Pide tu plato favorito, consulta precios exactos y confirma tu total.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentOrder.items.length > 0 && (
            <button
              onClick={onOpenOrderModal}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{formatGuarani(currentOrder.total)}</span>
            </button>
          )}

          {showResetConfirm ? (
            <div className="flex items-center space-x-1.5 bg-[#251518] border border-red-800/80 px-2 py-1 rounded-xl text-xs animate-fade-in">
              <span className="text-zinc-300 text-[11px]">¿Reiniciar?</span>
              <button
                onClick={handleResetChat}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-0.5 rounded text-[10px] transition"
              >
                Sí
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded text-[10px] transition"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reiniciar conversación"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center shadow-md shadow-red-950/60 mt-0.5">
                  <Flame className="w-4 h-4 text-white fill-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                  isAssistant
                    ? 'bg-[#181820] border border-red-950/60 text-zinc-100 rounded-tl-sm'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-tr-sm shadow-red-950/30'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* If assistant detects an order preview card */}
                {msg.orderPreview && msg.orderPreview.items.length > 0 && (
                  <div className="mt-3 p-3 bg-black/40 rounded-xl border border-red-900/40 text-xs">
                    <div className="flex items-center justify-between text-amber-400 font-bold mb-2 pb-1 border-b border-zinc-800">
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" /> Resumen del Pedido
                      </span>
                      <span>Total: {formatGuarani(msg.orderPreview.total)}</span>
                    </div>

                    <div className="space-y-1.5 mb-2">
                      {msg.orderPreview.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-zinc-300">
                          <span>
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-semibold text-zinc-200">
                            {formatGuarani(it.subtotal || it.unitPrice * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {msg.orderPreview.deliveryAddress && (
                      <div className="flex items-center gap-1.5 text-zinc-400 pt-1 border-t border-zinc-800/80">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>Dirección: {msg.orderPreview.deliveryAddress}</span>
                      </div>
                    )}

                    {msg.orderPreview.paymentMethod && (
                      <div className="flex items-center gap-1.5 text-zinc-400 pt-1">
                        <CreditCard className="w-3 h-3 text-amber-400" />
                        <span>Pago: {msg.orderPreview.paymentMethod}</span>
                      </div>
                    )}

                    <div className="mt-2.5 pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={onOpenOrderModal}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmar y Enviar a WhatsApp</span>
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 flex items-center justify-end ${
                    isAssistant ? 'text-zinc-500' : 'text-red-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold text-zinc-200">
                  Tú
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center shadow-md shadow-red-950/60">
              <Flame className="w-4 h-4 text-white fill-white animate-spin" />
            </div>
            <div className="bg-[#181820] border border-red-950/60 rounded-2xl rounded-tl-sm p-4 text-zinc-400 text-xs flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-zinc-400 ml-1">Wok Crunch está escribiendo...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Suggestions */}
      {activeQuickReplies.length > 0 && !isLoading && (
        <div className="py-2 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Sugerencias:
          </span>
          {activeQuickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => handleSend(qr)}
              className="flex-shrink-0 bg-[#1c1c24] hover:bg-red-950/50 hover:border-red-600/60 border border-zinc-800 text-zinc-200 text-xs font-medium px-3 py-1 rounded-full transition-all active:scale-95"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-[#16161e] border border-red-950/80 rounded-2xl p-1.5 focus-within:border-red-600/80 transition-colors shadow-xl"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pedido o consulta (ej: 'Quiero 1 Arroz de pollo y papas')..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl font-semibold transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-950/50 hover:scale-105 active:scale-95'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Fast Shortcuts */}
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span>¿Prefieres ver fotos?</span>
            <button
              onClick={() => onSelectTab('menu')}
              className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-0.5"
            >
              Ver Menú Ilustrado <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <a
            href={RESTAURANT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <Phone className="w-3 h-3" /> {RESTAURANT_INFO.whatsappPhone}
          </a>
        </div>
      </div>
    </div>
  );
};
