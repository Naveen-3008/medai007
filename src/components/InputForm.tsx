import React, { useState, useRef, useEffect } from 'react';
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
  Bot,
  Languages,
  Loader2
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';

interface InputFormProps {
  language?: 'English' | 'Tamil';
  isTranslating?: boolean;
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
  language = 'English',
  isTranslating: parentTranslating = false,
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
  const [localTranslating, setLocalTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isTamil = language === 'Tamil';
  const isTranslating = parentTranslating || localTranslating;

  // Check if text has English characters
  const hasEnglishText = /[a-zA-Z]{3,}/.test(symptoms);

  // Manual or Triggered Translation from English to Tamil
  const translateToTamil = async (textToTranslate?: string) => {
    const text = textToTranslate ?? symptoms;
    if (!text || !text.trim() || !hasEnglishText) return;

    setLocalTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          targetLanguage: 'Tamil',
          action: 'translate',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) {
          onSymptomsChange(data.translatedText);
        }
      }
    } catch (err) {
      console.warn('Auto translate to Tamil error:', err);
    } finally {
      setLocalTranslating(false);
    }
  };

  // Debounced auto-translation when typing in English while in Tamil mode
  useEffect(() => {
    if (isTamil && hasEnglishText && symptoms.trim().length >= 4) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      typingTimerRef.current = setTimeout(() => {
        translateToTamil(symptoms);
      }, 1200);
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [symptoms, isTamil]);

  // Quick symptoms in English and Tamil
  const quickSymptomsEnglish = [
    { label: 'Hot Burn / Scald', text: 'Accidentally touched hot pan/kettle, painful red stinging with blister', pain: 6 },
    { label: 'Twisted Ankle', text: 'Twisted ankle playing sports, swollen with sharp pain putting weight on it', pain: 7 },
    { label: 'Throbbing Toothache', text: 'Sharp throbbing tooth pain sensitive to cold water and chewing', pain: 6 },
    { label: 'Headache & Neck', text: 'Dull throbbing band-like tension headache and tight neck muscles', pain: 4 },
    { label: 'Fever & Throat', text: 'Fever 101F, body chills, sore throat, and painful swallowing', pain: 5 },
    { label: 'Itchy Skin Rash', text: 'Red itchy bumps on skin after touching plant or new soap', pain: 3 },
    { label: 'Bleeding Cut', text: 'Fell and scraped knee, superficial bleeding and stinging pain', pain: 4 },
    { label: 'Stomach Ache', text: 'Sudden stomach cramps, bloating, and mild nausea after food', pain: 5 },
  ];

  const quickSymptomsTamil = [
    { label: 'சூடான தீக்காயம்', text: 'சுடு பாத்திரத்தை தொட்டதால் விரலில் தீக்காயம் ஏற்பட்டுள்ளது, எரிகிறது மற்றும் சிறிய கொப்புளம்', pain: 6 },
    { label: 'கால் சுளுக்கு', text: 'விளையாடும் போது கணுக்கால் சுளுக்கியது, வீக்கம் மற்றும் ஊன்ற முடியாத வலி உள்ளது', pain: 7 },
    { label: 'பல் கூச்சம் & வலி', text: 'குளிர்ந்த நீர் குடிக்கும் போது கடுமையான பல் கூச்சமும் துடிக்கும் வலியும் உள்ளது', pain: 6 },
    { label: 'கடுமையான தலைவலி', text: 'நீண்ட நேரம் கணினி பார்த்ததால் கடுமையான தலைவலி மற்றும் கழுத்து தசை இறுக்கம்', pain: 4 },
    { label: 'காய்ச்சல் & தொண்டை', text: 'லேசான காய்ச்சல், உடல் வலி மற்றும் எச்சில் விழுங்க முடியாத தொண்டை வலி', pain: 5 },
    { label: 'தோல் அரிப்பு & தடிப்பு', text: 'தோலில் திடீரென சிவப்பு தடிப்புகள் மற்றும் கடுமையான அரிப்பு ஏற்பட்டுள்ளது', pain: 3 },
    { label: 'வெட்டுக் காயம்', text: 'கீழே விழுந்ததில் முழங்காலில் சிராய்ப்பு காயம் மற்றும் லேசான ரத்தக்கசிவு', pain: 4 },
    { label: 'வயிற்று வலி & பிடிப்பு', text: 'சாப்பிட்ட பிறகு திடீர் வயிற்று வலி, பிடிப்பு மற்றும் லேசான குமட்டல்', pain: 5 },
  ];

  const quickSymptoms = isTamil ? quickSymptomsTamil : quickSymptomsEnglish;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(isTamil ? 'தயவுசெய்து புகைப்படத்தை மட்டும் பதிவேற்றவும் (JPEG, PNG, WEBP).' : 'Please upload an image file (JPEG, PNG, WEBP).');
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
    if (val === 0) return { label: isTamil ? 'வலி இல்லை' : 'No Pain', emoji: <Smile className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (val <= 3) return { label: isTamil ? 'லேசான வலி' : 'Mild', emoji: <Smile className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (val <= 6) return { label: isTamil ? 'நடுத்தர வலி' : 'Moderate', emoji: <Meh className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />, color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    if (val <= 8) return { label: isTamil ? 'கடுமையான வலி' : 'Severe', emoji: <Frown className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />, color: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800' };
    return { label: isTamil ? 'மிக அவசரம்' : 'Critical', emoji: <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-bounce" />, color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
  };

  const painInfo = getPainDetails(painLevel);

  const durationOptions = isTamil
    ? [
        'இப்போதுதான் நடந்தது (< 30 நிமிடங்கள்)',
        '1 - 3 மணி நேரத்திற்கு முன்',
        'இன்று (4 - 12 மணி நேரத்திற்குள்)',
        '1 - 2 நாட்களுக்கு முன்',
        '3 - 7 நாட்களுக்கு முன்',
        'ஒரு வாரத்திற்கு மேல்',
      ]
    : [
        'Just happened (< 30 mins)',
        '1 - 3 hours ago',
        'Today (4 - 12 hours)',
        '1 - 2 days ago',
        '3 - 7 days ago',
        'Over a week ago',
      ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTamil && hasEnglishText) {
      await translateToTamil(symptoms);
    }
    onSubmit();
  };

  return (
    <section
      id="mr-health-input-container"
      aria-labelledby="heading-symptom-input"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-3.5 sm:space-y-4 w-full"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-800 shadow-2xs shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 id="heading-symptom-input" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {isTamil ? 'அறிகுறிகள் பரிசோதனை' : 'Symptom Assessment'}
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block leading-tight">
              {isTamil ? 'ஆங்கிலம் / தமிழில் விவரிக்கவும் (தானாகவே மாறும்)' : 'Describe what happened or pick a quick tag below'}
            </span>
          </div>
        </div>

        <button
          id="btn-reset-input"
          type="button"
          onClick={onReset}
          disabled={isLoading || (!symptoms && !selectedImage)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer min-h-[36px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isTamil ? 'அழி' : 'Clear'}</span>
        </button>
      </div>

      {/* Touch-optimized horizontal scrolling pill carousel on mobile */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            {isTamil ? 'விரைவுத் தேர்வுகள்:' : 'Quick Select:'}
          </span>
          <span className="text-[10px] text-slate-400 sm:hidden">👈 Swipe for more</span>
        </div>

        {/* Scrollable container on mobile, neat grid on tablet/desktop */}
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 snap-x">
          {quickSymptoms.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectQuickSymptom(item)}
              className="snap-start shrink-0 whitespace-nowrap sm:whitespace-normal text-xs font-semibold py-2 px-3 sm:p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 hover:text-cyan-800 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700/60 hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center text-center leading-tight min-h-[42px]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
        {/* Responsive 2-Column Split (1 column on mobile, 12-col grid on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
          {/* Symptoms Description Area */}
          <div className="lg:col-span-7 space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="textarea-symptoms"
                className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isTamil ? 'அறிகுறிகள் (ஆங்கிலம் / தமிழ்)' : 'Describe Symptoms'}</span>
              </label>

              {/* Status and manual translate trigger */}
              <div className="flex items-center gap-2">
                {isTranslating ? (
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1 font-semibold animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {isTamil ? 'தமிழில் மாறுகிறது...' : 'Translating...'}
                  </span>
                ) : isTamil && hasEnglishText ? (
                  <button
                    type="button"
                    onClick={() => translateToTamil(symptoms)}
                    className="text-[11px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold cursor-pointer transition shadow-2xs"
                  >
                    <Languages className="w-3 h-3 text-cyan-600" />
                    தமிழில் மாற்றுக
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {symptoms.length} chars
                  </span>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus-within:border-cyan-500 focus-within:bg-white dark:focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col">
              <textarea
                id="textarea-symptoms"
                value={symptoms}
                onBlur={() => {
                  if (isTamil && hasEnglishText) {
                    translateToTamil(symptoms);
                  }
                }}
                onChange={(e) => onSymptomsChange(e.target.value)}
                placeholder={
                  isTamil
                    ? 'ஆங்கிலத்தில் தட்டச்சு செய்தாலும் தானாக தமிழில் மாறும் (எ.கா: I touched hot pan, finger is stinging...)'
                    : 'e.g. I touched a hot cooking pan, skin is stinging and red with a small blister...'
                }
                className="w-full flex-1 bg-transparent p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Right Column: Photo Upload, Pain Meter & Duration */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-3 flex flex-col justify-between">
            {/* Photo Upload Zone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isTamil ? 'காயத்தின் புகைப்படம் (விருப்பப்பட்டால்)' : 'Injury Photo (Optional)'}</span>
              </label>

              {selectedImage ? (
                <div className="relative rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/20 p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedImage}
                      alt="Injury Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-emerald-300 dark:border-emerald-500/30 shadow-2xs"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block leading-tight">
                        {isTamil ? '✓ புகைப்படம் உள்ளது' : '✓ Photo Attached'}
                      </span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">
                        {isTamil ? 'ஆய்வுக்கு தயார்' : 'Ready for AI check'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onImageChange(null)}
                    className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
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
                  className={`rounded-xl border border-dashed p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-150 ${
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

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 text-left line-clamp-1">
                        {isTamil ? (
                          <>படத்தை இடவும் / <span className="text-cyan-600 dark:text-cyan-400 font-semibold underline">தேர்வு</span></>
                        ) : (
                          <>Upload or <span className="text-cyan-600 dark:text-cyan-400 font-semibold underline">browse</span></>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCameraOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer min-h-[38px]"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{isTamil ? 'கேமரா' : 'Camera'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pain Meter & Duration Grid (1 col on mobile, 2 col on tablet+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Pain Slider */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {isTamil ? 'வலி அளவு' : 'Pain Scale'}
                  </label>
                  <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${painInfo.color}`}>
                    {painInfo.emoji}
                    <span>{painLevel}/10</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={painLevel}
                  onChange={(e) => onPainLevelChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-400 touch-pan-x"
                />
              </div>

              {/* Duration Selector */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {isTamil ? 'எப்போது நடந்தது?' : 'When Occurred'}
                </label>
                <select
                  value={duration}
                  onChange={(e) => onDurationChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden min-h-[36px]"
                >
                  {durationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Large 48px Touch Submit Button */}
        <button
          id="btn-ask-mr-health-ai"
          type="submit"
          disabled={isLoading || isTranslating || (!symptoms.trim() && !selectedImage)}
          className="w-full min-h-[48px] py-3 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:via-teal-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-md shadow-cyan-600/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isTamil ? 'பகுப்பாய்வு செய்கிறது...' : 'Analyzing symptoms...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {isTamil ? 'Mr Health AI இடம் கேளுங்கள் (5-புள்ளி வழிகாட்டி)' : 'Ask Mr Health AI (Get 5-Point Guide)'}
              </span>
            </>
          )}
        </button>
      </form>

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
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
