import React, { useState, useEffect } from 'react';
import {
  Menu,
  Stethoscope,
  Sparkles,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Share2,
  FileSpreadsheet,
  Moon,
  Sun
} from 'lucide-react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Sidebar } from './components/Sidebar';
import { InputForm } from './components/InputForm';
import { GuideResults } from './components/GuideResults';
import { JsonViewer } from './components/JsonViewer';
import { MedicalAssessment, HistoryItem, PresetCase } from './types';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Load history from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('medstreamlit_history');
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
      localStorage.setItem('medstreamlit_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('medstreamlit_history');
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
      setError('Please provide a symptom description or upload an image.');
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

      // Smooth scroll to results
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Streamlit Top Nav / App Header */}
      <header
        id="streamlit-app-header"
        className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button */}
            <button
              id="btn-toggle-sidebar"
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* App Logo & Title */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-600 text-white rounded-xl shadow-xs shadow-rose-600/30">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-base md:text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                    MedStreamlit
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 uppercase tracking-wider">
                    Academic Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  5-Point Medical Treatment & First Aid Recommender
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-mono border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gemini Flash (Stable)
            </span>

            <button
              id="btn-top-reset"
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Reset workspace"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">New Case</span>
            </button>
          </div>
        </div>
      </header>

      {/* App Body Layout: Sidebar + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Streamlit Sidebar */}
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

        {/* Main Content Area (offset by sidebar on desktop) */}
        <main
          id="main-app-content"
          className="flex-1 lg:pl-80 p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-4xl mx-auto"
        >
          {/* 1. MANDATORY CLEAR DISCLAIMER BANNER */}
          <DisclaimerBanner />

          {/* 2. Error Alert Callout */}
          {error && (
            <div
              id="alert-error-callout"
              className="p-4 bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 rounded-xl text-rose-900 dark:text-rose-200 flex items-start gap-3 text-sm animate-fadeIn"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-semibold">Assessment Error: </strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* 3. Streamlit Form for Input (Symptoms + Image Upload + Parameters) */}
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

          {/* 4. Processing Shimmer / Loading State */}
          {isLoading && (
            <div
              id="loading-synthesizing-box"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-pulse"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <Stethoscope className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Synthesizing 5-Point Medical Protocol...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Cross-referencing symptom pathology, tissue recovery kinetics, first-aid contraindications, and dietary healing nutrients.
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full animate-indeterminate" />
              </div>
            </div>
          )}

          {/* 5. 5-Point Guide Results Presentation */}
          {currentAssessment && !isLoading && (
            <>
              <GuideResults
                assessment={currentAssessment}
                attachedImagePreview={selectedImage}
              />

              {/* Streamlit-style JSON Inspector for Academic Validation */}
              <JsonViewer data={currentAssessment} />
            </>
          )}
        </main>
      </div>

      {/* App Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            MedStreamlit • Clinical Decision Support Demonstration Interface
          </p>
          <p className="text-[11px] text-slate-400">
            Strictly for academic presentation and educational simulation. Always seek professional healthcare advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
