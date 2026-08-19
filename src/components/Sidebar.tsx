import React from 'react';
import {
  Globe,
  Sparkles,
  History,
  PhoneCall,
  ChevronRight,
  Trash2,
  X,
  Bot
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
    { code: 'English', label: 'English' },
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto shadow-sm`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 dark:bg-gradient-to-tr dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
                Smart Assistant
              </div>
              <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
                Mr Health AI
              </h1>
            </div>
          </div>
          <button
            id="btn-close-sidebar-mobile"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 flex-1 text-sm text-slate-700 dark:text-slate-300">
          {/* Language Selector */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </section>

          {/* Example Scenarios */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Example Scenarios
              </label>
            </div>
            <div className="space-y-2">
              {PRESET_CASES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500/40 transition group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-white group-hover:text-cyan-800 dark:group-hover:text-cyan-300">
                      {preset.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    {preset.symptoms}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Consultation History */}
          {history.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Recent History
                </label>
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectHistory(item);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                  >
                    <div className="font-semibold text-xs text-slate-800 dark:text-white truncate">
                      {item.result.conditionName}
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                      <span>{item.result.severity}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Emergency Hotlines */}
          <section className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              Emergency Numbers
            </div>
            <div className="text-[11px] text-rose-800 dark:text-rose-200 space-y-1 font-medium">
              <div>US/Canada: <span className="font-bold">911</span></div>
              <div>UK: <span className="font-bold">999</span> | EU: <span className="font-bold">112</span></div>
              <div>Poison Control: <span className="font-bold">1-800-222-1222</span></div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
};
