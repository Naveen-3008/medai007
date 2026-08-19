import React, { useState, useEffect } from 'react';
import {
  Activity,
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
  Share2,
  Clock,
  HeartPulse,
  Ban,
  Droplets,
  AlertCircle
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

  // Text-To-Speech handler using Web Speech API
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
      const textToRead = `Medical assessment for ${assessment.conditionName}. Severity is ${assessment.severity}. Point 1, Cause: ${g.cause.summary}. Point 2, Effect: ${g.effect.summary}. Point 3, Reason: ${g.reason.summary}. Point 4, Treatment: Immediate first aid includes ${g.treatment.immediateFirstAid.join(', ')}. Point 5, Diet: Recommended foods include ${g.diet.recommendedFoods.join(', ')}. Please remember this is an academic demonstration and not clinical medical advice.`;

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
    const reportText = `MEDSTREAMLIT 5-POINT MEDICAL GUIDE (ACADEMIC DEMO)
------------------------------------------------------
Condition: ${assessment.conditionName}
Category: ${assessment.category}
Severity: ${assessment.severity} (${assessment.severityDescription})
Analyzed At: ${new Date(assessment.analyzedAt).toLocaleString()}

1. CAUSE:
${g.cause.summary}
${g.cause.details.map((d) => `• ${d}`).join('\n')}

2. EFFECT:
${g.effect.summary}
${g.effect.details.map((d) => `• ${d}`).join('\n')}

3. REASON (Biological Mechanism):
${g.reason.summary}
${g.reason.details.map((d) => `• ${d}`).join('\n')}

4. TREATMENT:
Immediate First Aid:
${g.treatment.immediateFirstAid.map((d) => `• ${d}`).join('\n')}
Supportive & Clinical Care:
${g.treatment.clinicalTreatments.map((d) => `• ${d}`).join('\n')}
Important Precautions / Do Not:
${g.treatment.warnings.map((d) => `• ${d}`).join('\n')}

5. DIET & NUTRITION:
Recommended Foods: ${g.diet.recommendedFoods.join(', ')}
Foods to Avoid: ${g.diet.foodsToAvoid.join(', ')}
Hydration: ${g.diet.hydrationGuidance}

RED FLAGS / WHEN TO SEEK EMERGENCY CARE:
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

  const getSeverityBadge = () => {
    const sev = assessment.severity.toLowerCase();
    if (sev.includes('mild')) {
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        dot: 'bg-emerald-500',
        label: 'Mild Severity / Home Care Likely Appropriate',
      };
    }
    if (sev.includes('moderate')) {
      return {
        bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        dot: 'bg-amber-500',
        label: 'Moderate Severity / Monitor Closely',
      };
    }
    return {
      bg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border-rose-400 dark:border-rose-700 font-bold animate-pulse',
      dot: 'bg-rose-600',
      label: 'Severe / Seek Prompt In-Person Medical Attention',
    };
  };

  const severityBadge = getSeverityBadge();
  const guide = assessment.fivePointGuide;

  return (
    <div id="medical-guide-results-container" className="space-y-6 animate-fadeIn">
      {/* Assessment Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {assessment.category}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${severityBadge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${severityBadge.dot}`} />
                {assessment.severity}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {assessment.conditionName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Generated on {new Date(assessment.analyzedAt).toLocaleDateString()} at{' '}
              {new Date(assessment.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-tts-read-aloud"
              type="button"
              onClick={handleToggleSpeech}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title={isPlayingAudio ? 'Stop reading' : 'Read guide aloud'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              id="btn-copy-report"
              type="button"
              onClick={handleCopyReport}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Copy structured report"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              id="btn-print-report"
              type="button"
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Print report"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Clinical Rationale Note */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <HeartPulse className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">Triage Rationale: </strong>
            <span>{assessment.severityDescription}</span>
          </div>
        </div>
      </div>

      {/* 5-POINT SIMPLIFIED GUIDE CONTAINER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            <span>Structured 5-Point Simplified Medical Guide</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">5/5 points verified</span>
        </div>

        {/* 1. CAUSE CARD */}
        <div
          id="guide-point-1-cause"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition hover:border-blue-300 dark:hover:border-blue-800"
        >
          <div
            onClick={() => toggleSection('cause')}
            className="p-4 md:p-5 flex items-center justify-between bg-blue-50/40 dark:bg-blue-950/20 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-blue-500/20">
                1
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  Point 1 • Etiology
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {guide.cause.title || '1. Cause & Precipitating Factors'}
                </h4>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              {expandedSections.cause ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.cause && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5">
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 border-l-4 border-blue-600 rounded-r-xl text-sm font-medium text-blue-950 dark:text-blue-200 leading-relaxed">
                {guide.cause.summary}
              </div>
              {guide.cause.details && guide.cause.details.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Primary Triggers & Biomechanical Factors:
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {guide.cause.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. EFFECT CARD */}
        <div
          id="guide-point-2-effect"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition hover:border-amber-300 dark:hover:border-amber-800"
        >
          <div
            onClick={() => toggleSection('effect')}
            className="p-4 md:p-5 flex items-center justify-between bg-amber-50/40 dark:bg-amber-950/20 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-amber-500/20">
                2
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                  Point 2 • Symptomatology
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {guide.effect.title || '2. Effect & Bodily Manifestations'}
                </h4>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              {expandedSections.effect ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.effect && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5">
              <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 border-l-4 border-amber-600 rounded-r-xl text-sm font-medium text-amber-950 dark:text-amber-200 leading-relaxed">
                {guide.effect.summary}
              </div>
              {guide.effect.details && guide.effect.details.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Symptomatic Consequences & Tissue Impact:
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {guide.effect.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. REASON CARD */}
        <div
          id="guide-point-3-reason"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition hover:border-purple-300 dark:hover:border-purple-800"
        >
          <div
            onClick={() => toggleSection('reason')}
            className="p-4 md:p-5 flex items-center justify-between bg-purple-50/40 dark:bg-purple-950/20 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-purple-500/20">
                3
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
                  Point 3 • Pathophysiology
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {guide.reason.title || '3. Reason & Biological Mechanism'}
                </h4>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              {expandedSections.reason ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.reason && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5">
              <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/30 border-l-4 border-purple-600 rounded-r-xl text-sm font-medium text-purple-950 dark:text-purple-200 leading-relaxed">
                {guide.reason.summary}
              </div>
              {guide.reason.details && guide.reason.details.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Cellular & Biochemical Mechanisms:
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {guide.reason.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. TREATMENT CARD */}
        <div
          id="guide-point-4-treatment"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition hover:border-emerald-300 dark:hover:border-emerald-800"
        >
          <div
            onClick={() => toggleSection('treatment')}
            className="p-4 md:p-5 flex items-center justify-between bg-emerald-50/40 dark:bg-emerald-950/20 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-emerald-500/20">
                4
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  Point 4 • First Aid & Treatment Protocol
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {guide.treatment.title || '4. Treatment & First Aid Interventions'}
                </h4>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              {expandedSections.treatment ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.treatment && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
              {/* Immediate First Aid Actions */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Immediate Step-by-Step First Aid Protocol:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {guide.treatment.immediateFirstAid.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical & Supportive Options */}
              {guide.treatment.clinicalTreatments && guide.treatment.clinicalTreatments.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Supportive Measures & Clinical Modalities:
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {guide.treatment.clinicalTreatments.map((treatment, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Strict Warnings / What NOT to do */}
              {guide.treatment.warnings && guide.treatment.warnings.length > 0 && (
                <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1.5 text-xs text-rose-900 dark:text-rose-200">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                    <Ban className="w-4 h-4" />
                    Strict Contraindications (What NOT to do):
                  </div>
                  <ul className="space-y-1 text-rose-900/90 dark:text-rose-200/90">
                    {guide.treatment.warnings.map((warn, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>❌</span>
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. DIET CARD */}
        <div
          id="guide-point-5-diet"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition hover:border-teal-300 dark:hover:border-teal-800"
        >
          <div
            onClick={() => toggleSection('diet')}
            className="p-4 md:p-5 flex items-center justify-between bg-teal-50/40 dark:bg-teal-950/20 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-teal-500/20">
                5
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                  Point 5 • Nutritional Support & Diet
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {guide.diet.title || '5. Diet & Nutritional Healing Plan'}
                </h4>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              {expandedSections.diet ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.diet && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Healing Foods */}
                <div className="p-4 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Salad className="w-4 h-4 text-teal-600" />
                    Recommended Recovery Foods:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {guide.diet.recommendedFoods.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Foods to Avoid */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-slate-500" />
                    Foods / Substances to Avoid:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {guide.diet.foodsToAvoid.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hydration Guidance */}
              <div className="p-3.5 bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 rounded-xl text-xs text-sky-950 dark:text-sky-200 flex items-start gap-2.5">
                <Droplets className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-sky-900 dark:text-sky-100">Hydration Strategy: </strong>
                  <span>{guide.diet.hydrationGuidance}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RED FLAGS / EMERGENCY PROTOCOL CALLOUT */}
      {assessment.whenToSeekDoctor && assessment.whenToSeekDoctor.length > 0 && (
        <div
          id="card-red-flags"
          className="bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-800/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <h4 className="font-bold text-base">Red-Flag Warning Signs (When to Seek In-Person Medical Care)</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-rose-950 dark:text-rose-200 pt-1">
            {assessment.whenToSeekDoctor.map((flag, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white/70 dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2 shadow-2xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer Card at the end */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-medium text-slate-700 dark:text-slate-300">
          Academic Research Prototype • Powered by Gemini 3.7 Flash
        </p>
        <p className="max-w-2xl mx-auto text-[11px] leading-relaxed">
          {assessment.disclaimer}
        </p>
      </div>
    </div>
  );
};
