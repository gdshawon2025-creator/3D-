import React from 'react';
import { Zap, Flame, MapPin, Sparkles, Trophy } from 'lucide-react';
import { ZONES } from '../../data/portfolioData';

interface SpeedometerHUDProps {
  speedKmh: number;
  nitroFuel: number;
  gear: string;
  activeZoneId: string | null;
  language: 'en' | 'bn';
  onOpenZoneModal: (zoneId: string) => void;
  onResetBlocks: () => void;
  onResetPins: () => void;
}

export const SpeedometerHUD: React.FC<SpeedometerHUDProps> = ({
  speedKmh,
  nitroFuel,
  gear,
  activeZoneId,
  language,
  onOpenZoneModal,
  onResetBlocks,
  onResetPins
}) => {
  const isBn = language === 'bn';
  const currentZone = ZONES.find((z) => z.id === activeZoneId);

  return (
    <div className="fixed bottom-4 left-4 z-20 pointer-events-none select-none flex flex-col gap-2.5 max-w-sm">
      {/* Zone Arrival Interactive Banner */}
      {currentZone && currentZone.id !== 'start' && (
        <div
          onClick={() => onOpenZoneModal(currentZone.id)}
          className="pointer-events-auto cursor-pointer group bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:border-orange-500/80 transition-all p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: currentZone.color }}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase truncate">
                {isBn ? currentZone.nameBn : currentZone.name}
              </h2>
              <span className="text-[10px] text-orange-400 font-semibold px-1 rounded bg-orange-950/60 border border-orange-800/40">
                {isBn ? 'প্রবেশ করেছেন' : 'ZONE REACHED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {isBn ? 'ক্লিক বা এন্টার চেপে বিস্তারিত দেখুন' : 'Click or press Enter to inspect'}
            </p>
          </div>
          <div className="text-orange-400 group-hover:translate-x-0.5 transition-transform text-xs font-bold shrink-0">
            ➜
          </div>
        </div>
      )}

      {/* Special Zone Action buttons: Reset Blocks or Reset Pins */}
      {activeZoneId === 'skills' && (
        <div className="pointer-events-auto">
          <button
            onClick={onResetBlocks}
            className="px-3 py-1.5 bg-violet-600/90 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isBn ? 'দক্ষতা ব্লক পুনরায় সাজান' : 'Restack Skill Blocks'}
          </button>
        </div>
      )}

      {activeZoneId === 'playground' && (
        <div className="pointer-events-auto">
          <button
            onClick={onResetPins}
            className="px-3 py-1.5 bg-pink-600/90 hover:bg-pink-500 text-white text-xs font-semibold rounded-xl shadow-lg backdrop-blur-sm transition-all flex items-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5" />
            {isBn ? 'বোলিং পিন পুনরায় সাজান' : 'Reset Bowling Pins'}
          </button>
        </div>
      )}

      {/* Speedometer & Nitro Cluster */}
      <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-800/80 p-3 rounded-2xl shadow-xl flex items-center gap-4">
        {/* Speed Digital Readout */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            {isBn ? 'গতিবেগ' : 'SPEED'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-white tracking-tight">
              {speedKmh}
            </span>
            <span className="text-[10px] font-mono text-slate-400">KM/H</span>
          </div>
        </div>

        {/* Transmission Gear Indicator */}
        <div className="h-9 w-px bg-slate-800" />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            {isBn ? 'গিয়ার' : 'GEAR'}
          </span>
          <span
            className={`text-xl font-black font-mono ${
              gear === 'D' ? 'text-emerald-400' : gear === 'R' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            {gear}
          </span>
        </div>

        {/* Nitro Booster Meter */}
        <div className="h-9 w-px bg-slate-800" />
        <div className="flex flex-col flex-1 min-w-[90px]">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-0.5 text-orange-400 font-bold">
              <Flame className="w-3 h-3 inline" /> NITRO
            </span>
            <span className="tabular-nums">{Math.round(nitroFuel)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-75 rounded-full"
              style={{ width: `${nitroFuel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
