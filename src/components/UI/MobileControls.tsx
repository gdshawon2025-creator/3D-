import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Flame, Volume2, RotateCcw } from 'lucide-react';

interface MobileControlsProps {
  onInputStart: (action: 'forward' | 'backward' | 'left' | 'right' | 'nitro' | 'brake' | 'horn') => void;
  onInputEnd: (action: 'forward' | 'backward' | 'left' | 'right' | 'nitro' | 'brake' | 'horn') => void;
  onResetVehicle: () => void;
  language: 'en' | 'bn';
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInputStart,
  onInputEnd,
  onResetVehicle,
  language
}) => {
  const isBn = language === 'bn';

  const makeTouchHandlers = (action: 'forward' | 'backward' | 'left' | 'right' | 'nitro' | 'brake' | 'horn') => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      onInputStart(action);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      onInputEnd(action);
    },
    onMouseDown: () => onInputStart(action),
    onMouseUp: () => onInputEnd(action),
    onMouseLeave: () => onInputEnd(action)
  });

  return (
    <div className="fixed bottom-4 right-4 z-20 pointer-events-none select-none flex items-end gap-3">
      {/* Steering Cluster (Left / Right) */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800">
        <button
          {...makeTouchHandlers('left')}
          aria-label="Steer Left"
          className="w-13 h-13 rounded-xl bg-slate-800 active:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-md touch-manipulation"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          {...makeTouchHandlers('right')}
          aria-label="Steer Right"
          className="w-13 h-13 rounded-xl bg-slate-800 active:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-md touch-manipulation"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Pedals & Actions Cluster */}
      <div className="pointer-events-auto flex flex-col gap-2">
        {/* Aux Action Row: Nitro, Horn, Reset */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onResetVehicle}
            aria-label="Reset Car"
            title="Reset position"
            className="w-10 h-10 rounded-xl bg-slate-800/90 active:bg-slate-700 text-slate-300 flex items-center justify-center shadow-md touch-manipulation border border-slate-700/60"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            {...makeTouchHandlers('horn')}
            aria-label="Horn"
            title="Honk horn"
            className="w-10 h-10 rounded-xl bg-amber-600/90 active:bg-amber-500 text-white flex items-center justify-center shadow-md touch-manipulation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            {...makeTouchHandlers('nitro')}
            aria-label="Nitro Boost"
            title="Nitro speed boost"
            className="w-10 h-10 rounded-xl bg-orange-600 active:bg-orange-500 text-white flex items-center justify-center shadow-md touch-manipulation font-bold text-xs"
          >
            <Flame className="w-4 h-4" />
          </button>
        </div>

        {/* Forward & Reverse/Brake Pedals */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800">
          <button
            {...makeTouchHandlers('backward')}
            aria-label="Reverse or Brake"
            className="w-13 h-13 rounded-xl bg-slate-800 active:bg-rose-600 text-white flex flex-col items-center justify-center transition-colors shadow-md touch-manipulation"
          >
            <ChevronDown className="w-6 h-6" />
            <span className="text-[9px] font-mono text-slate-400 uppercase">
              {isBn ? 'ব্রেক' : 'REV'}
            </span>
          </button>

          <button
            {...makeTouchHandlers('forward')}
            aria-label="Drive Forward"
            className="w-14 h-14 rounded-xl bg-emerald-600 active:bg-emerald-500 text-white flex flex-col items-center justify-center transition-colors shadow-lg touch-manipulation"
          >
            <ChevronUp className="w-7 h-7" />
            <span className="text-[10px] font-mono font-bold uppercase">
              {isBn ? 'ড্রাইভ' : 'GAS'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
