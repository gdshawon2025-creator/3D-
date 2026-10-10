import React, { useState } from 'react';
import { X, Mail, Send, Check, Copy, Github, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import { PROFILE_INFO } from '../../data/portfolioData';
import { sound } from '../../utils/soundEngine';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_INFO.socials.email);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSent(true);
    sound.playSuccess();
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 w-full bg-cyan-500" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                {isBn ? 'যোগাযোগ করুন' : 'GET IN TOUCH'}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-400 font-medium">
                {isBn ? 'নতুন প্রজেক্ট বা কাজের ব্যাপারে মেসেজ পাঠান' : 'Have a project in mind or want to collaborate?'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Contact Modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Email quick copy box */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase text-slate-400">
                {isBn ? 'সরাসরি ইমেইল' : 'DIRECT EMAIL'}
              </div>
              <div className="text-sm font-mono text-cyan-400 truncate font-semibold">
                {PROFILE_INFO.socials.email}
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি' : 'Copy')}</span>
            </button>
          </div>

          {/* Contact Form */}
          {formSent ? (
            <div className="p-8 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isBn ? 'মেসেজটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? 'ধন্যবাদ! আমি খুব দ্রুত আপনার সাথে যোগাযোগ করব।' : 'Thank you for reaching out. I will get back to you shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isBn ? 'আপনার নাম' : 'YOUR NAME'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isBn ? 'উদা: মোঃ আকাশ' : 'e.g. John Doe'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isBn ? 'ইমেইল অ্যাড্রেস' : 'EMAIL ADDRESS'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isBn ? 'মেসেজ' : 'MESSAGE'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={isBn ? 'প্রজেক্ট ডিটেইলস লিখুন...' : 'Tell me about your project, timeline, and goals...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isBn ? 'মেসেজ পাঠান' : 'Send Message'}</span>
              </button>
            </form>
          )}

          {/* Social Links Row */}
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 mb-2.5 text-center">
              {isBn ? 'সোশ্যাল নেটওয়ার্ক' : 'FIND ME ONLINE'}
            </div>
            <div className="flex items-center justify-center gap-3">
              <a
                href={PROFILE_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={PROFILE_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={PROFILE_INFO.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
