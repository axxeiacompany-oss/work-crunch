import React from 'react';
import { RESTAURANT_INFO } from '../data/menu';
import { Phone, MessageSquare, UtensilsCrossed, ShoppingBag, Flame, Clock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'menu' | 'info';
  setActiveTab: (tab: 'chat' | 'menu' | 'info') => void;
  orderCount: number;
  openOrderDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  orderCount,
  openOrderDrawer,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#121216]/95 backdrop-blur-md border-b border-red-950/40 shadow-xl">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 px-4 py-1.5 text-xs text-amber-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-white tracking-wide">
            Delivery Activo en Asunción & alrededores
          </span>
          <span className="hidden sm:inline text-red-200">|</span>
          <span className="hidden sm:inline text-red-100 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" /> Abierto 18:00 a 23:30 hs
          </span>
        </div>

        <a
          href={RESTAURANT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center space-x-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-medium transition-colors"
        >
          <Phone className="w-3 h-3" />
          <span>WhatsApp: {RESTAURANT_INFO.whatsappPhone}</span>
        </a>
      </div>

      {/* Main navigation header */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand logo & tagline */}
        <div 
          onClick={() => setActiveTab('chat')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 p-0.5 shadow-lg shadow-red-950/50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#16161c] rounded-[10px] flex items-center justify-center relative">
              <Flame className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
              <span className="absolute -bottom-1 text-[8px] font-black text-amber-400 tracking-tighter">WOK</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                WOK CRUNCH <span className="text-red-500">ORIENTAL</span>
              </h1>
              <span className="bg-red-950/80 text-red-400 border border-red-800/50 text-[10px] font-bold px-1.5 py-0.5 rounded">
                美味しい
              </span>
            </div>
            <p className="text-xs text-amber-400/90 font-medium tracking-wide">
              {RESTAURANT_INFO.slogan}
            </p>
          </div>
        </div>

        {/* Tab switchers and actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <nav className="flex items-center bg-[#1b1b22] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-900/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Asistente Virtual</span>
              <span className="sm:hidden">Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-900/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menú</span>
            </button>
          </nav>

          {/* Cart / Order button */}
          <button
            onClick={openOrderDrawer}
            className="relative flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-zinc-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-950" />
            <span className="hidden sm:inline">Mi Pedido</span>
            {orderCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[11px] font-black rounded-full animate-bounce">
                {orderCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
