import React from 'react';
import {
  Stethoscope,
  Globe,
  Sliders,
  Sparkles,
  History,
  FileText,
  PhoneCall,
  ChevronRight,
  BookOpen,
  Trash2,
  X
} from 'lucide-react';
import { PRESET_CASES } from '../data/presets';
import { HistoryItem, PresetCase } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  detailLevel: 'Concise' | 'Standard' | 'Comprehensive';
  onDetailLevelChange: (level: 'Concise' | 'Standard' | 'Comprehensive') => void;
  onSelectPreset: (preset: PresetCase) => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  detailLevel,
  onDetailLevelChange,
  onSelectPreset,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  const languages = [
    { code: 'English', label: 'English (US/UK)' },
    { code: 'Spanish', label: 'Español' },
    { code: 'French', label: 'Français' },
    { code: 'German', label: 'Deutsch' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)' },
    { code: 'Chinese', label: '中文 (Simplified)' },
    { code: 'Japanese', label: '日本語 (Japanese)' },
    { code: 'Arabic', label: 'العربية (Arabic)' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Streamlit Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-rose-500 to-red-600 rounded-xl text-white shadow-sm shadow-rose-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                MedStreamlit AI
              </div>
              <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                5-Point Clinical Guide
              </h1>
            </div>
          </div>
          <button
            id="btn-close-sidebar-mobile"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 flex-1 text-sm text-slate-700 dark:text-slate-300">
          {/* Streamlit Widget: Model Controls */}
          <section id="sidebar-controls" aria-labelledby="heading-sidebar-controls" className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
              <Sliders className="w-3.5 h-3.5" />
              <h2 id="heading-sidebar-controls">Parameters (st.sidebar)</h2>
            </div>

            {/* Language Select */}
            <div className="space-y-1.5">
              <label htmlFor="select-language" className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Response Language
              </label>
              <select
                id="select-language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full text-xs py-2 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Detail Depth */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Detail Level
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-lg text-xs">
                {(['Concise', 'Standard', 'Comprehensive'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onDetailLevelChange(level)}
                    className={`py-1.5 px-2 rounded-md font-medium transition-all ${
                      detailLevel === level
                        ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Demo Cases */}
          <section id="sidebar-presets" aria-labelledby="heading-sidebar-presets" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <h2 id="heading-sidebar-presets">Demo Case Studies</h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">1-click fill</span>
            </div>

            <div className="space-y-1.5">
              {PRESET_CASES.map((preset) => (
                <button
                  key={preset.id}
                  id={`btn-preset-${preset.id}`}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-800 transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      {preset.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 font-mono">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Session History */}
          {history.length > 0 && (
            <section id="sidebar-history" aria-labelledby="heading-sidebar-history" className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  <History className="w-3.5 h-3.5" />
                  <h2 id="heading-sidebar-history">Session History ({history.length})</h2>
                </div>
                <button
                  id="btn-clear-history"
                  type="button"
                  onClick={onClearHistory}
                  className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1"
                  title="Clear history"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectHistory(item);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                      {item.result.conditionName}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span>{item.hasImage ? '📷 Image + Text' : '📝 Text Only'}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Framework Breakdown */}
          <section id="sidebar-framework" aria-labelledby="heading-sidebar-framework" className="p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-300">
              <BookOpen className="w-3.5 h-3.5" />
              <h2 id="heading-sidebar-framework">The 5-Point Framework</h2>
            </div>
            <ol className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] list-decimal list-inside leading-snug">
              <li><strong>Cause:</strong> Etiology & mechanisms</li>
              <li><strong>Effect:</strong> Bodily symptoms & impact</li>
              <li><strong>Reason:</strong> Pathophysiology rationale</li>
              <li><strong>Treatment:</strong> First aid & care actions</li>
              <li><strong>Diet:</strong> Nutritional tissue recovery</li>
            </ol>
          </section>

          {/* Emergency Helpline Callout */}
          <section id="sidebar-emergency" aria-labelledby="heading-sidebar-emergency" className="p-3 bg-red-500/10 border border-red-200 dark:border-red-900/50 rounded-xl space-y-1.5 text-xs text-red-900 dark:text-red-200">
            <div className="flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <h2 id="heading-sidebar-emergency">Emergency Contacts</h2>
            </div>
            <div className="text-[11px] space-y-0.5 text-red-800/80 dark:text-red-300/80">
              <p>• US/Canada: <strong>911</strong> | Poison: <strong>1-800-222-1222</strong></p>
              <p>• Europe/India: <strong>112</strong> | UK: <strong>999 / 111</strong></p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 text-center border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 bg-slate-100/50 dark:bg-slate-900/50">
          Powered by Gemini Flash (Stable) & Streamlit UX
        </div>
      </aside>
    </>
  );
};
