import React from 'react';
import { X, Keyboard, Smartphone, Gamepad2 } from 'lucide-react';

interface ControlsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const ControlsHelpModal: React.FC<ControlsHelpModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 w-full bg-orange-500" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-display">
                {isBn ? 'কন্ট্রোল ও চালনার নিয়ম' : 'HOW TO PLAY & EXPLORE'}
              </h2>
              <p className="text-xs text-orange-400 font-medium">
                {isBn ? 'কীবোর্ড ও টাচ স্ক্রিন শর্টকাট' : 'Keyboard & Touchscreen Controls'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Controls Modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-sm">
          {/* Keyboard Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-orange-400" />
              {isBn ? 'কীবোর্ড শর্টকাট (ডেস্কটপ)' : 'KEYBOARD (DESKTOP)'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'সামনে এগোনো' : 'Accelerate'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">W / ↑</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'পেছনে যাওয়া' : 'Reverse / Brake'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">S / ↓</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'বামে মোড়' : 'Steer Left'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">A / ←</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'ডানে মোড়' : 'Steer Right'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">D / →</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'হ্যান্ডব্রেক' : 'Handbrake'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">SPACE</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'নাইট্রো বুস্ট' : 'Nitro Boost'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">SHIFT / B</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'হর্ন বাজানো' : 'Honk Horn'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">H</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'গাড়ি রিসেট' : 'Reset Car'}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-bold">R</span>
              </div>
            </div>
          </div>

          {/* Touchscreen Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              {isBn ? 'টাচ স্ক্রিন (মোবাইল ও ট্যাবলেট)' : 'TOUCH CONTROLS (MOBILE)'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {isBn
                ? 'স্ক্রিনের নিচের ডানে গ্যাস ও ব্রেক প্যাডেল চেপে গাড়ি চালান। বাম পাশে বাম/ডান স্টিয়ারিং বাটন দিয়ে দিক পরিবর্তন করুন। হর্ন ও বুস্ট বাটন চাপলে সাউন্ড ও গতি বৃদ্ধি পায়।'
                : 'Use on-screen pedals on the bottom right to accelerate and reverse. Use the steering buttons to turn. Tap the horn icon for sound and the flame icon for Nitro speed boost.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-colors shadow-md"
          >
            {isBn ? 'বুঝেছি, ড্রাইভ শুরু করি!' : 'Got it, let’s drive!'}
          </button>
        </div>
      </div>
    </div>
  );
};
