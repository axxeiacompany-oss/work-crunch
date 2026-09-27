import React, { useState } from 'react';
import { 
  MENU_ITEMS, 
  MENU_CATEGORIES, 
  MenuItem, 
  formatGuarani,
  RESTAURANT_INFO 
} from '../data/menu';
import { CurrentOrder } from './ChatAssistant';
import { 
  Flame, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageSquare, 
  Phone, 
  Sparkles,
  Maximize2,
  X
} from 'lucide-react';

interface MenuCatalogProps {
  currentOrder: CurrentOrder;
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (itemName: string) => void;
  onAskAboutItem: (item: MenuItem) => void;
  onOpenOrderModal: () => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  currentOrder,
  onAddItem,
  onRemoveItem,
  onAskAboutItem,
  onOpenOrderModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemQuantity = (itemName: string): number => {
    const found = currentOrder.items.find((i) => i.name === itemName);
    return found ? found.quantity : 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-24">
      {/* Brand Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-6 border border-red-900/40 shadow-2xl bg-gradient-to-r from-black via-[#1c1214] to-red-950">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src="/images/wok_crunch_banner_1790467329265.jpg"
            alt="Wok Crunch Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold text-red-300 mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>SABOR ORIENTAL EN CADA BOCADO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Menú Digital & Delivery
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Cada plato preparado artesanalmente al fuego vivo de nuestro wok: Arroces tradicionales, Yakisoba japonés, crujiente pollo agridulce y picante, y nuestras papas y hamburguesas.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={RESTAURANT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Delivery WhatsApp: {RESTAURANT_INFO.whatsappPhone}</span>
              </a>
              <div className="text-xs text-amber-400 font-medium">
                🕒 18:00 a 23:30 hs
              </div>
            </div>
          </div>

          {/* Quick Cart Status Widget */}
          {currentOrder.items.length > 0 && (
            <div className="w-full md:w-auto bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Tu Pedido Actual</div>
              <div className="text-2xl font-black text-amber-400 mb-2">
                {formatGuarani(currentOrder.total)}
              </div>
              <button
                onClick={onOpenOrderModal}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-red-950/50 transition active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ver y Confirmar ({currentOrder.items.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="sticky top-[108px] z-30 bg-[#0e0e11]/90 backdrop-blur-md py-2.5 mb-6 border-b border-zinc-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950/40 border border-red-500/50'
                    : 'bg-[#181820] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const qty = getItemQuantity(item.name);
          return (
            <div
              key={item.id}
              className="bg-[#15151c] border border-red-950/50 hover:border-red-600/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group hover:-translate-y-1 duration-200"
            >
              {/* Image & Badges */}
              <div 
                className="relative h-52 w-full bg-zinc-900 overflow-hidden cursor-pointer"
                onClick={() => setPreviewItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15151c] via-transparent to-transparent opacity-80" />

                {item.badge && (
                  <span className="absolute top-3 left-3 bg-red-600/90 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                    {item.badge}
                  </span>
                )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(item);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition backdrop-blur-sm"
                  title="Ver foto ampliada"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="text-xs text-amber-300 font-semibold bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-zinc-800">
                    {item.categoryLabel}
                  </span>
                  <span className="text-lg font-black text-white bg-red-950/90 border border-red-600/60 px-2.5 py-0.5 rounded-lg shadow">
                    {item.priceFormatted}
                  </span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between gap-2">
                    {/* Add / Qty controls */}
                    {qty === 0 ? (
                      <button
                        onClick={() => onAddItem(item)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-red-950/50 transition active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar al Pedido</span>
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-between bg-[#1f1f28] border border-red-600/50 rounded-xl px-2 py-1">
                        <button
                          onClick={() => onRemoveItem(item.name)}
                          className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-950 text-white flex items-center justify-center transition active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-amber-400">
                          {qty} en pedido
                        </span>
                        <button
                          onClick={() => onAddItem(item)}
                          className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Ask Assistant button */}
                    <button
                      onClick={() => onAskAboutItem(item)}
                      title="Preguntar o pedir al asistente virtual"
                      className="p-2 bg-[#1c1c24] hover:bg-red-950/60 text-zinc-300 hover:text-amber-400 border border-zinc-800 hover:border-red-800/60 rounded-xl transition active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enlarged Photo Detail Modal */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-[#14141b] border border-red-900/60 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 sm:h-80 w-full bg-zinc-950">
              <img 
                src={previewItem.image} 
                alt={previewItem.name} 
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-red-950/90 text-amber-300 font-extrabold text-sm px-3 py-1 rounded-lg border border-red-700/50">
                {previewItem.priceFormatted}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {previewItem.categoryLabel}
                </span>
                <h3 className="text-xl font-black text-white">
                  {previewItem.name}
                </h3>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed bg-[#1b1b24] p-3.5 rounded-xl border border-zinc-800">
                {previewItem.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddItem(previewItem);
                    setPreviewItem(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition active:scale-95 text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar al Pedido</span>
                </button>

                <button
                  onClick={() => {
                    onAskAboutItem(previewItem);
                    setPreviewItem(null);
                  }}
                  className="bg-[#1e1e28] hover:bg-zinc-800 text-zinc-200 font-semibold py-2.5 px-4 rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Pedir por Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
