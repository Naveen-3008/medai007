import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  X,
  Sparkles,
  RotateCcw,
  Clock,
  Activity,
  Flame,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  Bot
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';

interface InputFormProps {
  symptoms: string;
  onSymptomsChange: (val: string) => void;
  painLevel: number;
  onPainLevelChange: (val: number) => void;
  duration: string;
  onDurationChange: (val: string) => void;
  selectedImage: string | null;
  onImageChange: (image: string | null, mimeType?: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  symptoms,
  onSymptomsChange,
  painLevel,
  onPainLevelChange,
  duration,
  onDurationChange,
  selectedImage,
  onImageChange,
  onSubmit,
  onReset,
  isLoading,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickSymptoms = [
    { label: 'Hot Burn / Scald', text: 'Accidentally touched hot pan/kettle, painful red stinging with blister', pain: 6 },
    { label: 'Twisted Ankle', text: 'Twisted ankle playing sports, swollen with sharp pain putting weight on it', pain: 7 },
    { label: 'Throbbing Toothache', text: 'Sharp throbbing tooth pain sensitive to cold water and chewing', pain: 6 },
    { label: 'Headache / Tension', text: 'Dull throbbing band-like tension headache and tight neck muscles', pain: 4 },
    { label: 'Fever & Sore Throat', text: 'Fever 101F, body chills, sore throat, and painful swallowing', pain: 5 },
    { label: 'Itchy Skin Rash', text: 'Red itchy bumps on skin after touching plant or new soap', pain: 3 },
    { label: 'Bleeding Cut / Scrape', text: 'Fell and scraped knee, superficial bleeding and stinging pain', pain: 4 },
    { label: 'Stomach Ache', text: 'Sudden stomach cramps, bloating, and mild nausea after food', pain: 5 },
  ];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageChange(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const selectQuickSymptom = (item: { label: string; text: string; pain: number }) => {
    onSymptomsChange(item.text);
    onPainLevelChange(item.pain);
  };

  const getPainDetails = (val: number) => {
    if (val === 0) return { label: 'No Pain', emoji: <Smile className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (val <= 3) return { label: 'Mild', emoji: <Smile className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (val <= 6) return { label: 'Moderate', emoji: <Meh className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />, color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    if (val <= 8) return { label: 'Severe', emoji: <Frown className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />, color: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800' };
    return { label: 'Critical', emoji: <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-bounce" />, color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
  };

  const painInfo = getPainDetails(painLevel);

  const durationOptions = [
    'Just happened (< 30 mins)',
    '1 - 3 hours ago',
    'Today (4 - 12 hours)',
    '1 - 2 days ago',
    '3 - 7 days ago',
    'Over a week ago',
  ];

  return (
    <section
      id="mr-health-input-container"
      aria-labelledby="heading-symptom-input"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-800 shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 id="heading-symptom-input" className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              Symptom Assessment
            </h2>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Describe what happened or pick a quick tag below
            </span>
          </div>
        </div>

        <button
          id="btn-reset-input"
          type="button"
          onClick={onReset}
          disabled={isLoading || (!symptoms && !selectedImage)}
          className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 flex items-center gap-1 py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Quick Tap Symptom Ideas - Tight Gap */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          Quick Select:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickSymptoms.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectQuickSymptom(item)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 hover:text-cyan-800 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-3"
      >
        {/* 1. Symptoms Text Area */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="textarea-symptoms"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Describe Symptoms</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {symptoms.length} chars
            </span>
          </div>

          <div className="relative rounded-xl bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus-within:border-cyan-500 focus-within:bg-white dark:focus-within:bg-slate-950 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
            <textarea
              id="textarea-symptoms"
              rows={2}
              value={symptoms}
              onChange={(e) => onSymptomsChange(e.target.value)}
              placeholder="e.g. I touched a hot pan, skin is stinging with a small blister..."
              className="w-full bg-transparent p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden resize-y min-h-[60px]"
            />
          </div>
        </div>

        {/* 2. Photo Upload or Camera Zone - Compact */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Injury Photo (Optional)</span>
            </label>
          </div>

          {selectedImage ? (
            <div className="relative rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/20 p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedImage}
                  alt="Injury Preview"
                  className="w-11 h-11 object-cover rounded-lg border border-emerald-300 dark:border-emerald-500/30 shadow-2xs"
                />
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block leading-tight">
                    ✓ Photo Attached
                  </span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    Ready for AI evaluation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onImageChange(null)}
                className="p-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border border-dashed p-2.5 text-center cursor-pointer transition-all duration-150 ${
                isDragging
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
                  : 'border-slate-300 dark:border-slate-800 hover:border-cyan-400 bg-slate-50/50 dark:bg-slate-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
                    <UploadCloud className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 text-left">
                    Drop photo or <span className="text-cyan-600 dark:text-cyan-400 font-semibold underline">browse</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCameraOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  Camera
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Pain Meter & Duration Grid - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
          {/* Pain Slider */}
          <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Pain Scale
              </label>
              <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${painInfo.color}`}>
                {painInfo.emoji}
                <span>{painLevel}/10 ({painInfo.label})</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={painLevel}
              onChange={(e) => onPainLevelChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-400"
            />
          </div>

          {/* Duration Selector */}
          <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Duration / When Occurred
            </label>
            <select
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              {durationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="btn-ask-mr-health-ai"
          type="submit"
          disabled={isLoading || (!symptoms.trim() && !selectedImage)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:via-teal-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing symptoms with Mr Health AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Ask Mr Health AI (Get 5-Point Guide)</span>
            </>
          )}
        </button>
      </form>

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCaptureModal
          onCapture={(dataUrl) => {
            onImageChange(dataUrl, 'image/jpeg');
            setIsCameraOpen(false);
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </section>
  );
};
