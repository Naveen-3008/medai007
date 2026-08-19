import React, { useState, useEffect } from 'react';
import {
  Menu,
  RotateCcw,
  Sparkles,
  Bot,
  Sun,
  Moon,
  Activity,
  HeartPulse,
  ShieldCheck
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { InputForm } from './components/InputForm';
import { GuideResults } from './components/GuideResults';
import { MedicalAssessment, HistoryItem, PresetCase } from './types';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [painLevel, setPainLevel] = useState(4);
  const [duration, setDuration] = useState('1 - 3 hours ago');
  const [language, setLanguage] = useState('English');
  const [detailLevel, setDetailLevel] = useState<'Concise' | 'Standard' | 'Comprehensive'>('Standard');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<MedicalAssessment | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mrhealthai_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load local history', e);
    }
  }, []);

  const saveHistoryItem = (assessment: MedicalAssessment, hasImage: boolean, imagePreview?: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      symptomsSummary: symptoms || 'Visual injury inspection',
      hasImage,
      imagePreview,
      result: assessment,
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem('mrhealthai_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('mrhealthai_history');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSelectPreset = (preset: PresetCase) => {
    setSymptoms(preset.symptoms);
    setPainLevel(preset.painLevel);
    setDuration(preset.duration);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentAssessment(item.result);
    setSymptoms(item.symptomsSummary);
    if (item.imagePreview) {
      setSelectedImage(item.imagePreview);
    }
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSymptoms('');
    setPainLevel(4);
    setDuration('1 - 3 hours ago');
    setSelectedImage(null);
    setCurrentAssessment(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!symptoms.trim() && !selectedImage) {
      setError('Please provide a symptom description or upload an injury photo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          painLevel,
          duration,
          language,
          detailLevel,
          imageBase64: selectedImage,
          mimeType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: MedicalAssessment = await response.json();
      setCurrentAssessment(data);
      saveHistoryItem(data, !!selectedImage, selectedImage || undefined);

      setTimeout(() => {
        const resultsEl = document.getElementById('medical-guide-results-container');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      setError(err.message || 'An unexpected error occurred while analyzing the symptoms.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 selection:bg-cyan-500 selection:text-white">
        {/* Compact Top Header */}
        <header
          id="app-header"
          className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs"
        >
          <div className="max-w-5xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Sidebar toggle button */}
              <button
                id="btn-toggle-sidebar"
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Logo & Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xs shadow-cyan-600/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-none">
                      Mr Health AI
                    </h1>
                    <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      5-Point Guide
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Smart Health & First-Aid Assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Right Badges & Controls */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>

              {/* Light / Dark Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                id="btn-top-reset"
                type="button"
                onClick={handleReset}
                className="p-1.5 sm:px-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-slate-200 dark:border-slate-800"
                title="Reset case"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Case</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Layout with Tight Gaps */}
        <div className="flex-1 max-w-5xl w-full mx-auto flex">
          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            language={language}
            onLanguageChange={setLanguage}
            detailLevel={detailLevel}
            onDetailLevelChange={setDetailLevel}
            onSelectPreset={handleSelectPreset}
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
          />

          {/* Main Content Area - Reduced Padding & Tight Vertical Spacing */}
          <main
            id="main-app-content"
            className="flex-1 lg:pl-80 p-2.5 sm:p-4 space-y-3.5 w-full max-w-3xl mx-auto"
          >
            {/* Compact Hero Banner */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-slate-900 border border-cyan-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xs shadow-cyan-600/20 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Hello, I am Mr Health AI!
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    Enter your symptoms or upload an injury photo for a fast, simple <strong className="text-cyan-700 dark:text-cyan-400 font-bold">5-point recovery guide</strong>.
                  </p>
                </div>
              </div>

              {/* 5 Points preview badges - Compact */}
              <div className="grid grid-cols-5 gap-1.5 mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                <div className="py-1 px-1 rounded-lg bg-white dark:bg-slate-950/60 border border-indigo-200 dark:border-indigo-900/40 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs truncate">
                  🎯 Cause
                </div>
                <div className="py-1 px-1 rounded-lg bg-white dark:bg-slate-950/60 border border-sky-200 dark:border-sky-900/40 text-[10px] font-bold text-sky-700 dark:text-sky-300 shadow-2xs truncate">
                  ⚡ Effect
                </div>
                <div className="py-1 px-1 rounded-lg bg-white dark:bg-slate-950/60 border border-emerald-200 dark:border-emerald-900/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs truncate">
                  🧬 Reason
                </div>
                <div className="py-1 px-1 rounded-lg bg-white dark:bg-slate-950/60 border border-rose-200 dark:border-rose-900/40 text-[10px] font-bold text-rose-700 dark:text-rose-300 shadow-2xs truncate">
                  🩹 Treatment
                </div>
                <div className="py-1 px-1 rounded-lg bg-white dark:bg-slate-950/60 border border-teal-200 dark:border-teal-900/40 text-[10px] font-bold text-teal-700 dark:text-teal-300 shadow-2xs truncate">
                  🥗 Diet
                </div>
              </div>
            </section>

            {/* Error Alert Callout if needed */}
            {error && (
              <div
                id="alert-submission-error"
                role="alert"
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 shadow-2xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                <div>
                  <strong className="font-bold text-rose-900 dark:text-rose-100">Notice: </strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Input Form Component with tight spacing */}
            <InputForm
              symptoms={symptoms}
              onSymptomsChange={setSymptoms}
              painLevel={painLevel}
              onPainLevelChange={setPainLevel}
              duration={duration}
              onDurationChange={setDuration}
              selectedImage={selectedImage}
              onImageChange={(img, mime) => {
                setSelectedImage(img);
                if (mime) setMimeType(mime);
              }}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isLoading={isLoading}
            />

            {/* Results Display */}
            {currentAssessment && (
              <GuideResults
                assessment={currentAssessment}
                attachedImagePreview={selectedImage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
