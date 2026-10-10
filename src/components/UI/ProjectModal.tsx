import React from 'react';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';

interface ProjectModalProps {
  projectId: string | null;
  onClose: () => void;
  onSelectProject: (id: string) => void;
  language: 'en' | 'bn';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  projectId,
  onClose,
  onSelectProject,
  language
}) => {
  if (!projectId) return null;

  const projectIndex = PROJECTS.findIndex((p) => p.id === projectId);
  const project = PROJECTS[projectIndex !== -1 ? projectIndex : 0];
  const isBn = language === 'bn';

  const handlePrev = () => {
    const prevIdx = (projectIndex - 1 + PROJECTS.length) % PROJECTS.length;
    onSelectProject(PROJECTS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (projectIndex + 1) % PROJECTS.length;
    onSelectProject(PROJECTS[nextIdx].id);
  };

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
        {/* Top colored accent stripe */}
        <div className="h-2 w-full" style={{ backgroundColor: project.color }} />

        {/* Header bar */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: project.color }}
              >
                {project.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {projectIndex + 1} / {PROJECTS.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
              {isBn ? project.titleBn : project.title}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {isBn ? project.taglineBn : project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Project Modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-sm">
          {/* Overview Prose */}
          <p className="leading-relaxed text-slate-200">
            {isBn ? project.descriptionBn : project.description}
          </p>

          {/* Key Metrics strip */}
          {project.metrics && (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-mono text-orange-400 flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                {isBn ? 'পারফরম্যান্স:' : 'METRICS:'}
              </span>
              <span>{project.metrics}</span>
            </div>
          )}

          {/* Highlights & Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              {isBn ? 'মূল টেকনিক্যাল হাইলাইটস' : 'TECHNICAL HIGHLIGHTS'}
            </h3>
            <ul className="space-y-2">
              {(isBn ? project.highlightsBn : project.highlights).map((hl, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {isBn ? 'ব্যবহৃত টেকনোলজি' : 'TECHNOLOGY STACK'}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 font-mono">
              {project.tags.map((tag, i) => (
                <React.Fragment key={tag}>
                  <span className="text-white font-medium">{tag}</span>
                  {i < project.tags.length - 1 && <span className="text-slate-600">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions & Navigation */}
        <div className="p-4 sm:p-6 pt-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
          {/* Prev/Next buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              title="Previous project"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? 'পূর্ববর্তী' : 'Prev'}</span>
            </button>
            <button
              onClick={handleNext}
              title="Next project"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <span className="hidden sm:inline">{isBn ? 'পরবর্তী' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Direct External Links */}
          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              <span>{isBn ? 'সোর্স কোড' : 'Code'}</span>
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>{isBn ? 'লাইভ ডেমো দেখুন' : 'Live Demo'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
