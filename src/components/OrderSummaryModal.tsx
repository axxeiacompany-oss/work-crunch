import React, { useState } from 'react';
import { CurrentOrder } from './ChatAssistant';
import { formatGuarani, RESTAURANT_INFO } from '../data/menu';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  CreditCard, 
  Send, 
  Phone, 
  CheckCircle2, 
  Flame,
  AlertCircle
} from 'lucide-react';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CurrentOrder;
  onUpdateOrder: (order: Partial<CurrentOrder>) => void;
  onClearOrder: () => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrder,
  onClearOrder,
  onOpenChatWithPrompt,
}) => {
  const [address, setAddress] = useState(order.deliveryAddress || '');
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || 'Efectivo');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (itemName: string, delta: number) => {
    const existing = [...order.items];
    const itemIndex = existing.findIndex((i) => i.name === itemName);
    if (itemIndex === -1) return;

    const newQty = existing[itemIndex].quantity + delta;
    if (newQty <= 0) {
      existing.splice(itemIndex, 1);
    } else {
      existing[itemIndex] = {
        ...existing[itemIndex],
        quantity: newQty,
        subtotal: newQty * existing[itemIndex].unitPrice,
      };
    }

    const newTotal = existing.reduce((sum, item) => sum + item.subtotal, 0);
    onUpdateOrder({
      items: existing,
      total: newTotal,
      deliveryAddress: address,
      paymentMethod: paymentMethod,
    });
  };

  const handleRemoveItem = (itemName: string) => {
    const updated = order.items.filter((i) => i.name !== itemName);
    const newTotal = updated.reduce((sum, item) => sum + item.subtotal, 0);
    onUpdateOrder({
      items: updated,
      total: newTotal,
      deliveryAddress: address,
      paymentMethod: paymentMethod,
    });
  };

  const generateWhatsAppMessage = () => {
    let text = `🥢 *¡Hola Wok Crunch Oriental! Quiero confirmar mi pedido:*\n\n`;
    text += `📋 *DETALLE DEL PEDIDO:*\n`;
    order.items.forEach((item) => {
      text += `• ${item.quantity}x ${item.name} - ${formatGuarani(item.subtotal || item.quantity * item.unitPrice)}\n`;
    });

    text += `\n💰 *TOTAL A PAGAR:* ${formatGuarani(order.total)}\n`;

    if (address.trim()) {
      text += `📍 *Dirección de entrega:* ${address.trim()}\n`;
    } else {
      text += `📍 *Entrega:* A coordinar con el local\n`;
    }

    text += `💳 *Forma de pago:* ${paymentMethod}\n`;

    if (notes.trim()) {
      text += `📝 *Observaciones:* ${notes.trim()}\n`;
    }

    text += `\n✨ _"Sabor oriental en cada bocado"_ - Pedido gestionado mediante el Asistente Virtual.`;

    return text;
  };

  const handleSendToWhatsApp = () => {
    onUpdateOrder({
      deliveryAddress: address,
      paymentMethod: paymentMethod,
      isConfirmed: true,
    });

    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/595991607393?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#14141b] border border-red-900/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950 via-[#181822] to-amber-950/80 px-6 py-4 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-500">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Resumen de tu Pedido
              </h2>
              <p className="text-xs text-zinc-400">
                Wok Crunch Oriental • Delivery 0991607393
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-zinc-700">
          {order.items.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-300 font-semibold mb-1">Tu carrito está vacío</p>
              <p className="text-xs text-zinc-500 mb-4">
                Elige deliciosos platos del menú o pídeselos a nuestro asistente virtual.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithPrompt('¡Hola! Quiero ordenar algo del menú');
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                Abrir Asistente Virtual
              </button>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  <span>Platos Seleccionados</span>
                  <span>Subtotal</span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className="bg-[#1a1a24] border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {formatGuarani(item.unitPrice)} c/u
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.name, -1)}
                          className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-amber-400 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.name, 1)}
                          className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <div className="text-sm font-black text-amber-400">
                          {formatGuarani(item.subtotal || item.quantity * item.unitPrice)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.name)}
                          className="text-[10px] text-zinc-500 hover:text-red-400 transition"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={onClearOrder}
                    className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Vaciar carrito
                  </button>
                </div>
              </div>

              {/* Delivery Address Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>Dirección de Entrega (Delivery):</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle 200 casi Boquerón, casa blanca..."
                  className="w-full bg-[#181822] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Forma de Pago:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Efectivo', 'Transferencia', 'Tarjeta'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        paymentMethod === method
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                          : 'bg-[#181822] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  Observaciones adicionales (opcional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Salsa agridulce extra, timbrar fuerte..."
                  className="w-full bg-[#181822] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                />
              </div>

              {/* Friendly notice */}
              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start space-x-2 text-amber-200/90 text-[11px]">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  Los tiempos exactos de entrega y costo del envío según zona se confirman directamente con el local a través de WhatsApp.
                </p>
              </div>

              {/* Grand Total */}
              <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                    Total a Pagar
                  </span>
                  <span className="text-2xl font-black text-amber-400">
                    {formatGuarani(order.total)}
                  </span>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="text-xs bg-[#1f1f2a] hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition"
                >
                  {copied ? '¡Copiado! ✓' : 'Copiar Resumen'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        {order.items.length > 0 && (
          <div className="p-4 bg-[#111117] border-t border-zinc-800 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenChatWithPrompt(`Tengo en mi pedido: ${order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}. ¿Podrías confirmarlo?`);
              }}
              className="flex-1 bg-[#1a1a24] hover:bg-zinc-800 text-zinc-300 font-bold text-xs py-3 px-4 rounded-xl border border-zinc-700 transition"
            >
              Consultar con el Asistente
            </button>

            <button
              onClick={handleSendToWhatsApp}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Enviar Pedido por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
