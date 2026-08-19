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
  ShieldCheck,
  Globe,
  Languages
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
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [detailLevel, setDetailLevel] = useState<'Concise' | 'Standard' | 'Comprehensive'>('Standard');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');

  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
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
      symptomsSummary: symptoms || (language === 'Tamil' ? 'புகைப்படம் ஆய்வு' : 'Visual injury inspection'),
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

  // Language Change with Auto-Translation of input text
  const handleLanguageChange = async (newLang: 'English' | 'Tamil') => {
    if (newLang === language) return;
    setLanguage(newLang);

    if (symptoms && symptoms.trim()) {
      setIsTranslating(true);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: symptoms,
            targetLanguage: newLang,
            action: 'translate',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.translatedText) {
            setSymptoms(data.translatedText);
          }
        }
      } catch (err) {
        console.warn('Automatic symptom translation error:', err);
      } finally {
        setIsTranslating(false);
      }
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
      setError(
        language === 'Tamil'
          ? 'தயவுசெய்து உங்கள் அறிகுறிகளை விவரிக்கவும் அல்லது காயத்தின் புகைப்படத்தைப் பதிவேற்றவும்.'
          : 'Please provide a symptom description or upload an injury photo.'
      );
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
      setError(err.message || (language === 'Tamil' ? 'மருத்துவ வழிகாட்டியை பகுப்பாய்வு செய்வதில் பிழை ஏற்பட்டது.' : 'An unexpected error occurred while analyzing the symptoms.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 selection:bg-cyan-500 selection:text-white w-full">
        {/* Full-width Top Header */}
        <header
          id="app-header"
          className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs w-full px-4 sm:px-6 lg:px-8"
        >
          <div className="w-full h-14 flex items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              {/* Sidebar toggle button */}
              <button
                id="btn-toggle-sidebar"
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Toggle menu"
                title="Open menu & history"
              >
                <Menu className="w-4 h-4 text-cyan-600" />
                <span className="hidden sm:inline">{language === 'Tamil' ? 'பட்டியல்' : 'Menu'}</span>
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
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      {language === 'Tamil' ? '5-புள்ளி வழிகாட்டி' : '5-Point Guide'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {language === 'Tamil' ? 'ஸ்மார்ட் சுகாதார & முதலுதவி AI' : 'Smart Health & First-Aid Assistant'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Badges & Controls */}
            <div className="flex items-center gap-2">
              {/* Direct Quick Language Toggle (English | தமிழ்) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('English')}
                  disabled={isTranslating}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    language === 'English'
                      ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                  title="Switch to English"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('Tamil')}
                  disabled={isTranslating}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    language === 'Tamil'
                      ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                  title="தமிழுக்கு மாற்றவும் (Switch to Tamil)"
                >
                  தமிழ்
                </button>
              </div>

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
                className="p-1.5 sm:px-3 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-slate-200 dark:border-slate-800"
                title="Reset case"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'Tamil' ? 'புதிய பதிவு' : 'New Case'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          language={language}
          onLanguageChange={(l) => handleLanguageChange(l as 'English' | 'Tamil')}
          detailLevel={detailLevel}
          onDetailLevelChange={setDetailLevel}
          onSelectPreset={handleSelectPreset}
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />

        {/* Main Content Layout */}
        <main
          id="main-app-content"
          className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-7xl mx-auto"
        >
          {/* Full-width Stretched Hero Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-50/90 via-white to-blue-50/70 dark:from-cyan-950/25 dark:via-slate-900 dark:to-slate-900 border border-cyan-100 dark:border-slate-800 p-4 sm:p-5 shadow-2xs w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {language === 'Tamil' ? 'வணக்கம், நான் Mr Health AI!' : 'Hello, I am Mr Health AI!'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {language === 'Tamil'
                      ? 'உங்கள் அறிகுறிகளைக் குறிப்பிடவும் அல்லது புகைப்படத்தை பதிவேற்றவும். எளிய 5-புள்ளி வழிகாட்டியை உடனே பெறுங்கள்.'
                      : 'Enter your symptoms or upload an injury photo for an instant, simple 5-point recovery guide.'}
                  </p>
                </div>
              </div>

              {/* 5 Points preview badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-950/60 border border-indigo-200 dark:border-indigo-900/40 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs">
                  🎯 {language === 'Tamil' ? '1. காரணம்' : '1. Cause'}
                </div>
                <div className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-950/60 border border-sky-200 dark:border-sky-900/40 text-xs font-bold text-sky-700 dark:text-sky-300 shadow-2xs">
                  ⚡ {language === 'Tamil' ? '2. தாக்கம்' : '2. Effect'}
                </div>
                <div className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-950/60 border border-emerald-200 dark:border-emerald-900/40 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
                  🧬 {language === 'Tamil' ? '3. ஏன் ஏற்படுகிறது' : '3. Reason'}
                </div>
                <div className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-950/60 border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-700 dark:text-rose-300 shadow-2xs">
                  🩹 {language === 'Tamil' ? '4. சிகிச்சை & முதலுதவி' : '4. Treatment'}
                </div>
                <div className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-950/60 border border-teal-200 dark:border-teal-900/40 text-xs font-bold text-teal-700 dark:text-teal-300 shadow-2xs">
                  🥗 {language === 'Tamil' ? '5. உணவு & தண்ணீர்' : '5. Diet'}
                </div>
              </div>
            </div>
          </section>

          {/* Error Alert Callout if needed */}
          {error && (
            <div
              id="alert-submission-error"
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 shadow-2xs w-full"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
              <div>
                <strong className="font-bold text-rose-900 dark:text-rose-100">{language === 'Tamil' ? 'அறிவிப்பு: ' : 'Notice: '}</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Input Form with Language awareness and Translation */}
          <InputForm
            language={language}
            isTranslating={isTranslating}
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
  );
}
