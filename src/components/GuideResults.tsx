import React, { useState, useEffect } from 'react';
import {
  Target,
  Zap,
  Microscope,
  ShieldCheck,
  Salad,
  AlertTriangle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Ban,
  Droplets,
  Bot
} from 'lucide-react';
import { MedicalAssessment } from '../types';

interface GuideResultsProps {
  assessment: MedicalAssessment;
  attachedImagePreview?: string | null;
}

export const GuideResults: React.FC<GuideResultsProps> = ({
  assessment,
  attachedImagePreview,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    cause: true,
    effect: true,
    reason: true,
    treatment: true,
    diet: true,
    redFlags: true,
  });

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const g = assessment.fivePointGuide;
      const textToRead = `Mr Health AI guide for ${assessment.conditionName}. Point 1, Cause: ${g.cause.summary}. Point 2, Effect: ${g.effect.summary}. Point 3, Why it happens: ${g.reason.summary}. Point 4, Treatment: ${g.treatment.immediateFirstAid.join(', ')}. Point 5, Diet: ${g.diet.recommendedFoods.join(', ')}.`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyReport = () => {
    const g = assessment.fivePointGuide;
    const reportText = `MR HEALTH AI - 5-POINT HEALTH GUIDE
------------------------------------------------------
Assessment: ${assessment.conditionName}
Category: ${assessment.category}
Severity: ${assessment.severity} (${assessment.severityDescription})
Analyzed At: ${new Date(assessment.analyzedAt).toLocaleString()}

1. CAUSE:
${g.cause.summary}
${g.cause.details.map((d) => `• ${d}`).join('\n')}

2. EFFECT ON BODY:
${g.effect.summary}
${g.effect.details.map((d) => `• ${d}`).join('\n')}

3. WHY IT HAPPENS:
${g.reason.summary}
${g.reason.details.map((d) => `• ${d}`).join('\n')}

4. TREATMENT & WHAT TO DO:
Immediate First Aid:
${g.treatment.immediateFirstAid.map((d) => `• ${d}`).join('\n')}
Home Care & Support:
${g.treatment.clinicalTreatments.map((d) => `• ${d}`).join('\n')}
Things NOT to do:
${g.treatment.warnings.map((d) => `• ${d}`).join('\n')}

5. HEALING DIET & WATER:
Foods to Eat: ${g.diet.recommendedFoods.join(', ')}
Foods to Avoid: ${g.diet.foodsToAvoid.join(', ')}
Hydration: ${g.diet.hydrationGuidance}

WHEN TO SEE A DOCTOR:
${assessment.whenToSeekDoctor.map((d) => `⚠️ ${d}`).join('\n')}

DISCLAIMER:
${assessment.disclaimer}
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const g = assessment.fivePointGuide;

  const getSeverityBadge = (sev: string) => {
    if (sev.toLowerCase().includes('emergency') || sev.toLowerCase().includes('severe')) {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200',
        dot: 'bg-rose-500',
        label: 'Seek Medical Care / Clinical Check',
      };
    }
    if (sev.toLowerCase().includes('moderate')) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
        dot: 'bg-amber-500',
        label: 'Moderate Severity (Monitor Closely)',
      };
    }
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Mild Severity (Safe for Home Care)',
    };
  };

  const badge = getSeverityBadge(assessment.severity);

  return (
    <section
      id="medical-guide-results-container"
      aria-label="Mr Health AI 5-Point Report"
      className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200 w-full"
    >
      {/* 1. Header Overview Card - Full Width */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Mr Health AI Assessment
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                {assessment.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {assessment.conditionName}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                isPlayingAudio
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
              }`}
              title={isPlayingAudio ? 'Stop audio' : 'Listen with Voice'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReport}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Copy report"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Print report"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Severity Banner */}
        <div className={`py-2.5 px-3.5 rounded-xl border shadow-2xs flex items-center gap-3 ${badge.bg}`}>
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${badge.dot}`} />
          </span>
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold uppercase tracking-wider">
              {badge.label}:
            </span>{' '}
            <span className="font-medium opacity-90">
              {assessment.severityDescription}
            </span>
          </div>
        </div>
      </div>

      {/* 2. THE 5-POINT GUIDE CARDS - Responsive Bento Grid on Wide Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* POINT 1: CAUSE */}
        <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xs transition hover:border-indigo-300 flex flex-col">
          <div
            onClick={() => toggleSection('cause')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 font-bold">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 dark:text-indigo-400">Point 1</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  Cause
                </h3>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              {expandedSections.cause ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSections.cause && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 flex-1">
              <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/40 p-2.5 rounded-xl">
                {g.cause.summary}
              </p>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-1">
                {g.cause.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* POINT 2: EFFECT */}
        <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xs transition hover:border-sky-300 flex flex-col">
          <div
            onClick={() => toggleSection('effect')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800 font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-sky-700 dark:text-sky-400">Point 2</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  Effect on Body
                </h3>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              {expandedSections.effect ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSections.effect && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 flex-1">
              <p className="text-xs font-semibold text-sky-950 dark:text-sky-200 bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/40 p-2.5 rounded-xl">
                {g.effect.summary}
              </p>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-1">
                {g.effect.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* POINT 3: REASON */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xs transition hover:border-emerald-300 flex flex-col">
          <div
            onClick={() => toggleSection('reason')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 font-bold">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">Point 3</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  Why It Happens
                </h3>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              {expandedSections.reason ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSections.reason && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 flex-1">
              <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 p-2.5 rounded-xl">
                {g.reason.summary}
              </p>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-1">
                {g.reason.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* POINT 4: TREATMENT (Spans 2 columns on large screens) */}
        <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xs transition hover:border-rose-300 md:col-span-2 lg:col-span-2 flex flex-col">
          <div
            onClick={() => toggleSection('treatment')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800 font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-700 dark:text-rose-400">Point 4</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  Treatment & First-Aid
                </h3>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              {expandedSections.treatment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSections.treatment && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 flex-1">
              {/* Immediate Steps */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Immediate Steps:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {g.treatment.immediateFirstAid.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <span className="self-start px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[9px]">
                        Step {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid of Home Care & Warnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Supportive / Pharmacist */}
                {g.treatment.clinicalTreatments && g.treatment.clinicalTreatments.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 space-y-1">
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider block">
                      Home Care & Pharmacist Tips:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {g.treatment.clinicalTreatments.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {g.treatment.warnings && g.treatment.warnings.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-1">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <Ban className="w-3.5 h-3.5 text-rose-600" />
                      What NOT To Do:
                    </span>
                    <ul className="space-y-0.5 text-xs text-rose-800 dark:text-rose-200">
                      {g.treatment.warnings.map((warn, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>❌</span>
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* POINT 5: DIET (Spans 1 column on large screens) */}
        <div className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xs transition hover:border-teal-300 flex flex-col">
          <div
            onClick={() => toggleSection('diet')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800 font-bold">
                <Salad className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-teal-700 dark:text-teal-400">Point 5</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  Healing Diet & Water
                </h3>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              {expandedSections.diet ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSections.diet && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 flex-1">
              <div className="space-y-2">
                {/* Foods to Eat */}
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 space-y-1">
                  <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <Salad className="w-3 h-3 text-teal-600" />
                    Healing Foods:
                  </span>
                  <ul className="space-y-0.5 text-xs text-teal-900 dark:text-teal-200">
                    {g.diet.recommendedFoods.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>🥑</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Foods to Avoid */}
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Ban className="w-3 h-3 text-amber-600" />
                    Limit / Avoid:
                  </span>
                  <ul className="space-y-0.5 text-xs text-amber-900 dark:text-amber-200">
                    {g.diet.foodsToAvoid.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>⚠️</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hydration */}
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-800/50 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-sky-900 dark:text-cyan-400">Water: </strong>
                  {g.diet.hydrationGuidance}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. When to See a Doctor Card - Full Width */}
      {assessment.whenToSeekDoctor && assessment.whenToSeekDoctor.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs space-y-2.5 w-full">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                When to See a Doctor (Red Flag Warning Signs)
              </h4>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {assessment.whenToSeekDoctor.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                <span className="text-orange-500 font-bold">⚠️</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Disclaimer Footer */}
      <p className="text-[10px] text-center text-slate-500 px-3">
        {assessment.disclaimer || 'Mr Health AI provides educational guidance. For emergencies, please call emergency services.'}
      </p>
    </section>
  );
};
