import React from 'react';
import { X, Award, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { PROFILE_INFO, SKILLS } from '../../data/portfolioData';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 w-full bg-emerald-500" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl font-display">
              S
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                {isBn ? PROFILE_INFO.nameBn : PROFILE_INFO.name}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                {isBn ? PROFILE_INFO.roleBn : PROFILE_INFO.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close About Modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Bio text */}
          <p className="leading-relaxed text-slate-200 text-sm sm:text-base">
            {isBn ? PROFILE_INFO.bioBn : PROFILE_INFO.bio}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROFILE_INFO.stats.map((stat, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-center"
              >
                <div className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isBn ? stat.labelBn : stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              {isBn ? 'কর্ম অভিজ্ঞতা' : 'EXPERIENCE'}
            </h3>
            <div className="space-y-3">
              {PROFILE_INFO.experience.map((exp, i) => (
                <div key={i} className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{isBn ? exp.roleBn : exp.role}</span>
                    <span className="font-mono text-slate-400">{exp.period}</span>
                  </div>
                  <div className="text-xs text-emerald-400 mb-1">{exp.company}</div>
                  <p className="text-xs text-slate-300">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Radar / Tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              {isBn ? 'প্রযুক্তিগত দক্ষতা' : 'CORE COMPETENCIES'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SKILLS.map((s) => (
                <div
                  key={s.id}
                  className="p-2 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-200">{s.name}</span>
                  <span className="font-mono text-emerald-400 tabular-nums">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              {isBn ? 'শিক্ষাগত যোগ্যতা' : 'EDUCATION'}
            </h3>
            {PROFILE_INFO.education.map((edu, i) => (
              <div key={i} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-xs">
                <div className="font-bold text-white">{isBn ? edu.degreeBn : edu.degree}</div>
                <div className="text-slate-400 mt-0.5">
                  {isBn ? edu.schoolBn : edu.school} · {edu.period}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
