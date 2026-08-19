import React from 'react';
import {
  Globe,
  Sparkles,
  History,
  PhoneCall,
  ChevronRight,
  Trash2,
  X,
  Bot,
  Hospital,
  Pill,
  ExternalLink
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
  const isTamil = language === 'Tamil';
  const languages = [
    { code: 'English', label: 'English' },
    { code: 'Tamil', label: 'தமிழ் (Tamil)' },
  ];

  const openMaps = (query: string) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 dark:bg-gradient-to-tr dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white shadow-xs shadow-cyan-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
                Smart Assistant
              </div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-none">
                Mr Health AI
              </h1>
            </div>
          </div>
          <button
            id="btn-close-sidebar"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-5 flex-1 text-sm text-slate-700 dark:text-slate-300">
          {/* Language Selector (Only English & Tamil) */}
          <section className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Language / மொழி
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange(l.code)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    language === l.code
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs shadow-cyan-600/25'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          {/* Quick Nearby Places on Google Maps */}
          <section className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              {isTamil ? 'அருகிலுள்ள இடங்கள்' : 'Nearby on Google Maps'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openMaps('nearest 24/7 emergency hospital')}
                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                  <Hospital className="w-4 h-4" />
                  <ExternalLink className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white mt-1">
                  {isTamil ? 'மருத்துவமனை' : 'Hospitals'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => openMaps('nearest 24 hours pharmacy medical store')}
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                  <Pill className="w-4 h-4" />
                  <ExternalLink className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white mt-1">
                  {isTamil ? 'மருந்தகம்' : 'Pharmacies'}
                </span>
              </button>
            </div>
          </section>

          {/* Example Scenarios */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {isTamil ? 'மாதிரி நிகழ்வுகள்' : 'Example Scenarios'}
              </label>
            </div>
            <div className="space-y-1.5">
              {PRESET_CASES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500/40 transition group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-white group-hover:text-cyan-800 dark:group-hover:text-cyan-300">
                      {preset.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {preset.symptoms}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Consultation History */}
          {history.length > 0 && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {isTamil ? 'சமீபத்திய பதிவுகள்' : 'Recent History'}
                </label>
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3 h-3" />
                  {isTamil ? 'அழி' : 'Clear'}
                </button>
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectHistory(item);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                  >
                    <div className="font-semibold text-xs text-slate-800 dark:text-white truncate">
                      {item.result.conditionName}
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                      <span>{item.result.severity}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Emergency Hotlines */}
          <section className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              {isTamil ? 'அவசர உதவி எண்கள்' : 'Emergency Numbers'}
            </div>
            <div className="text-[11px] text-rose-800 dark:text-rose-200 space-y-0.5 font-medium">
              <div>India: <span className="font-bold">108 / 112</span></div>
              <div>US/Canada: <span className="font-bold">911</span> | UK: <span className="font-bold">999</span></div>
              <div>Poison Control: <span className="font-bold">1-800-222-1222</span></div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
};
