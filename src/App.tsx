/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { ChatAssistant, CurrentOrder } from './components/ChatAssistant';
import { MenuCatalog } from './components/MenuCatalog';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { RestaurantInfo } from './components/RestaurantInfo';
import { MenuItem, RESTAURANT_INFO, formatGuarani } from './data/menu';
import { ShoppingBag, MessageSquare, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'menu' | 'info'>('chat');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [currentOrder, setCurrentOrder] = useState<CurrentOrder>({
    items: [],
    total: 0,
    deliveryAddress: '',
    paymentMethod: 'Efectivo',
    isConfirmed: false,
  });

  const handleUpdateOrder = (updated: Partial<CurrentOrder>) => {
    setCurrentOrder((prev) => {
      const newItems = updated.items !== undefined ? updated.items : prev.items;
      const newTotal = updated.total !== undefined ? updated.total : newItems.reduce((acc, it) => acc + (it.subtotal || it.unitPrice * it.quantity), 0);
      return {
        ...prev,
        ...updated,
        items: newItems,
        total: newTotal,
      };
    });
  };

  const handleAddItem = (item: MenuItem) => {
    setCurrentOrder((prev) => {
      const items = [...prev.items];
      const index = items.findIndex((i) => i.name === item.name);

      if (index >= 0) {
        const newQty = items[index].quantity + 1;
        items[index] = {
          ...items[index],
          quantity: newQty,
          subtotal: newQty * item.price,
        };
      } else {
        items.push({
          name: item.name,
          quantity: 1,
          unitPrice: item.price,
          subtotal: item.price,
        });
      }

      const total = items.reduce((acc, it) => acc + it.subtotal, 0);
      return { ...prev, items, total };
    });
  };

  const handleRemoveItem = (itemName: string) => {
    setCurrentOrder((prev) => {
      const items = [...prev.items];
      const index = items.findIndex((i) => i.name === itemName);
      if (index >= 0) {
        if (items[index].quantity > 1) {
          const newQty = items[index].quantity - 1;
          items[index] = {
            ...items[index],
            quantity: newQty,
            subtotal: newQty * items[index].unitPrice,
          };
        } else {
          items.splice(index, 1);
        }
      }
      const total = items.reduce((acc, it) => acc + it.subtotal, 0);
      return { ...prev, items, total };
    });
  };

  const handleClearOrder = () => {
    setCurrentOrder({
      items: [],
      total: 0,
      deliveryAddress: '',
      paymentMethod: 'Efectivo',
      isConfirmed: false,
    });
  };

  const handleAskAboutItem = (item: MenuItem) => {
    setActiveTab('chat');
    // We can let the user ask about the item in chat
    setTimeout(() => {
      const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.value = `Quiero ordenar 1 ${item.name} (${item.priceFormatted})`;
        inputEl.focus();
      }
    }, 150);
  };

  const handleOpenChatWithPrompt = (prompt: string) => {
    setActiveTab('chat');
    setTimeout(() => {
      const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.value = prompt;
        inputEl.focus();
      }
    }, 150);
  };

  const totalItemCount = currentOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0e0e12] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Header bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderCount={totalItemCount}
        openOrderDrawer={() => setIsOrderModalOpen(true)}
      />

      {/* Main content body */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatAssistant
            currentOrder={currentOrder}
            onUpdateOrder={handleUpdateOrder}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'menu' && (
          <MenuCatalog
            currentOrder={currentOrder}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onAskAboutItem={handleAskAboutItem}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
          />
        )}

        {activeTab === 'info' && (
          <RestaurantInfo
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
            onSelectTab={setActiveTab}
          />
        )}
      </main>

      {/* Floating Bottom Bar when there are items in the cart and modal is closed */}
      {currentOrder.items.length > 0 && !isOrderModalOpen && activeTab !== 'chat' && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-slide-up">
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 rounded-2xl p-3 shadow-2xl shadow-red-950/80 border border-red-500/50 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3 pl-1">
              <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center font-black text-amber-300 text-sm">
                {totalItemCount}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-red-100 font-bold block">
                  Total Pedido Delivery
                </span>
                <span className="text-base font-black text-white">
                  {formatGuarani(currentOrder.total)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-black/30 hover:bg-black/50 p-2.5 rounded-xl text-white transition active:scale-95"
                title="Hablar con el asistente"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="bg-zinc-950 hover:bg-zinc-900 text-amber-400 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary & WhatsApp Checkout Modal */}
      <OrderSummaryModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={currentOrder}
        onUpdateOrder={handleUpdateOrder}
        onClearOrder={handleClearOrder}
        onOpenChatWithPrompt={handleOpenChatWithPrompt}
      />
    </div>
  );
}
