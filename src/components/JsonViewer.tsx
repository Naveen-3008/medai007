import React, { useState } from 'react';
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  title?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  title = 'st.json Output Inspector (Academic Schema)',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="streamlit-json-inspector"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
          <Code className="w-4 h-4 text-rose-500" />
          <span className="font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <span className="text-slate-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-96">
          <pre>{jsonString}</pre>
        </div>
      )}
    </div>
  );
};
