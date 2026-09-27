import React from 'react';
import { RESTAURANT_INFO, MENU_ITEMS, formatGuarani } from '../data/menu';
import { 
  Flame, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare,
  Utensils
} from 'lucide-react';

interface RestaurantInfoProps {
  onOpenChatWithPrompt: (prompt: string) => void;
  onSelectTab: (tab: 'chat' | 'menu' | 'info') => void;
}

export const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  onOpenChatWithPrompt,
  onSelectTab,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Brand Profile Card */}
      <div className="bg-[#15151c] border border-red-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 p-1 shadow-xl flex-shrink-0">
            <div className="w-full h-full bg-[#121216] rounded-xl flex flex-col items-center justify-center p-2">
              <Flame className="w-10 h-10 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-amber-400 mt-1">WOK CRUNCH</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 rounded-full text-xs font-bold text-red-300 mb-2">
              <span>美味しい Sabor oriental en cada bocado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Wok Crunch Oriental
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Restaurante especializado en cocina oriental al wok, con servicio de delivery rápido y platos recién preparados a fuego vivo: Arroz frito, auténtico Yakisoba japonés, pollo crujiente agridulce y picante, papas fritas y hamburguesas.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href={RESTAURANT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-95"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>WhatsApp: {RESTAURANT_INFO.whatsappPhone}</span>
              </a>

              <button
                onClick={() => onSelectTab('chat')}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-red-950/40 transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hablar con el Asistente Virtual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#171720] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Pedidos & Delivery
              </h3>
              <p className="text-sm font-extrabold text-white">
                {RESTAURANT_INFO.whatsappPhone}
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400">
            Recepción directa de pedidos vía WhatsApp y asistente online.
          </p>
        </div>

        <div className="bg-[#171720] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Horario de Cocina
              </h3>
              <p className="text-sm font-extrabold text-white">
                18:00 a 23:30 hs
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400">
            Abierto todos los días en horario nocturno para tus cenas y antojos.
          </p>
        </div>

        <div className="bg-[#171720] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Modalidad
              </h3>
              <p className="text-sm font-extrabold text-white">
                Delivery & Retiro
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400">
            Envío directo hasta tu puerta o retiro coordinado con el local.
          </p>
        </div>
      </div>

      {/* Menu Quick Price List Card */}
      <div className="bg-[#15151c] border border-red-950/60 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-white">
              Lista Oficial de Precios (Guaraníes ₲)
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('menu')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold"
          >
            Ver Menú con Fotos →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Arroz & Yakisoba */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              🍚 Arroz Frito
            </h4>
            <div className="bg-[#191924] rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-200">
                <span>Arroz frito de pollo</span>
                <span className="font-bold text-white">₲23.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Arroz frito con carne</span>
                <span className="font-bold text-white">₲25.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Arroz frito de camarón</span>
                <span className="font-bold text-white">₲75.000</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider pt-2">
              🍜 Yakisoba
            </h4>
            <div className="bg-[#191924] rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-200">
                <span>Yakisoba de pollo</span>
                <span className="font-bold text-white">₲25.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Yakisoba de carne</span>
                <span className="font-bold text-white">₲28.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Yakisoba de camarón</span>
                <span className="font-bold text-white">₲75.000</span>
              </div>
            </div>
          </div>

          {/* Pollo, Papas, Hamburguesas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              🍗 Pollo Frito
            </h4>
            <div className="bg-[#191924] rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-200">
                <span>Pollo frito agridulce</span>
                <span className="font-bold text-white">₲40.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Pollo frito picante</span>
                <span className="font-bold text-white">₲40.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Pollo frito normal</span>
                <span className="font-bold text-white">₲35.000</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider pt-2">
              🍟 Papas Fritas & 🍔 Hamburguesas
            </h4>
            <div className="bg-[#191924] rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-200">
                <span>Papas fritas (Pequeña)</span>
                <span className="font-bold text-white">₲15.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Papas fritas (Grande)</span>
                <span className="font-bold text-white">₲20.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Hamburguesa (Pequeña)</span>
                <span className="font-bold text-white">₲15.000</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Hamburguesa (Grande)</span>
                <span className="font-bold text-white">₲25.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
