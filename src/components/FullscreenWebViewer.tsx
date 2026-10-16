import React from 'react';
import { ChevronRight, ExternalLink, RotateCw, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FullscreenWebViewer: React.FC = () => {
  const { customWebUrl, isCustomWebActive, setIsCustomWebActive } = useApp();

  if (!isCustomWebActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white select-none">
      {/* Top Bar with return button */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md">
        <button
          onClick={() => setIsCustomWebActive(false)}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs cursor-pointer transition-transform active:scale-95 shadow-sm"
        >
          <ChevronRight className="w-4 h-4 rtl:rotate-0" />
          <span>واپس نیک اعمال پر جائیں</span>
        </button>

        <div className="text-center truncate max-w-xs px-2 text-xs font-mono text-slate-300">
          {customWebUrl}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => window.open(customWebUrl, '_blank', 'noopener,noreferrer')}
            title="براؤزر کے نئے ٹیب میں کھولیں"
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-200 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCustomWebActive(false)}
            title="بند کریں"
            className="w-7 h-7 rounded-lg bg-rose-600/80 hover:bg-rose-600 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame */}
      <div className="flex-1 w-full bg-white relative">
        <iframe
          src={customWebUrl}
          title="External Web Viewer"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};
