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
  Languages,
  Hospital
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { InputForm } from './components/InputForm';
import { GuideResults } from './components/GuideResults';
import { NearbyCareLocator } from './components/NearbyCareLocator';
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
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 selection:bg-cyan-500 selection:text-white">
        
        {/* Centered Mobile-App Shell Frame */}
        <div className="w-full max-w-lg md:max-w-xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col shadow-2xl border-x border-slate-200/80 dark:border-slate-800">
          
          {/* Mobile App Header */}
          <header
            id="mobile-app-header"
            className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <button
                  id="btn-toggle-sidebar"
                  type="button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  aria-label="Menu"
                >
                  <Menu className="w-4 h-4 text-cyan-600" />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xs shadow-cyan-600/25">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h1 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                      Mr Health AI
                    </h1>
                    <p className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold">
                      {language === 'Tamil' ? '5-புள்ளி சுகாதார வழிகாட்டி' : '5-Point Health Guide'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1.5">
                {/* Language Toggle Pill */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('English')}
                    disabled={isTranslating}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer text-xs ${
                      language === 'English'
                        ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-2xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('Tamil')}
                    disabled={isTranslating}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer text-xs ${
                      language === 'Tamil'
                        ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-2xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>

                {/* Theme toggle */}
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                  title="Toggle theme"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                {/* Reset button */}
                <button
                  id="btn-top-reset"
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                  title="New Case"
                >
                  <RotateCcw className="w-4 h-4" />
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

          {/* Main Mobile App Stream */}
          <main className="p-4 space-y-3.5 flex-1">
            
            {/* Friendly Greeting Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-blue-50/60 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 border border-cyan-100 dark:border-slate-700 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xs shadow-cyan-600/20 shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {language === 'Tamil' ? 'வணக்கம், நான் Mr Health AI!' : 'Hello, I am Mr Health AI!'}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
                    {language === 'Tamil'
                      ? 'அறிகுறிகளைக் கூறி உடனடி 5-புள்ளி வழிகாட்டியைப் பெறுங்கள்.'
                      : 'Enter symptoms or upload a photo for a 5-point guide.'}
                  </p>
                </div>
              </div>

              {/* 5-Point Chips */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold">
                  1. {language === 'Tamil' ? 'காரணம்' : 'Cause'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[10px] font-bold">
                  2. {language === 'Tamil' ? 'தாக்கம்' : 'Effect'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                  3. {language === 'Tamil' ? 'ஏன்' : 'Reason'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-bold">
                  4. {language === 'Tamil' ? 'சிகிச்சை' : 'Treatment'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-bold">
                  5. {language === 'Tamil' ? 'உணவு' : 'Diet'}
                </span>
              </div>
            </div>

            {/* Compact Hospital & Pharmacy Map Card */}
            <NearbyCareLocator
              language={language}
              severity={currentAssessment?.severity}
            />

            {/* Error Callout if needed */}
            {error && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 shadow-2xs"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Input Card Form */}
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

            {/* Assessment Guide Results */}
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
