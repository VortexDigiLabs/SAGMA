/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  Layers, 
  Eye, 
  Sparkles, 
  Sliders, 
  FileText, 
  Info,
  CheckCircle2,
  RefreshCw,
  Search
} from 'lucide-react';
import { FlowState, ThemeType, MechanicalPart } from '../types';

interface ControlProps {
  state: FlowState;
  onChangeState: (updater: (prev: FlowState) => FlowState) => void;
  theme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
  parts: MechanicalPart[];
  hoveredPartId: string | null;
  selectedPartId: string | null;
  onSelectPartId: (id: string | null) => void;
  diagramName: string;
}

const THEME_OPTIONS: { id: ThemeType; label: string; desc: string; color: string }[] = [
  { id: 'textbook', label: 'Classic Textbook', desc: 'Slightly off-white cream backsheet, steel details, colored material flows.', color: 'bg-white border-slate-300 text-slate-800' },
  { id: 'blueprint', label: 'Technical Blueprint', desc: 'Luminescent neon cyan shapes over dark cobalt engineering drafting sheet.', color: 'bg-slate-950 border-sky-500 text-sky-400' },
  { id: 'dark-industry', label: 'Dark Operator', desc: 'Clean charcoal matte panels, dark slate frames, optimized eye safety.', color: 'bg-zinc-900 border-zinc-700 text-slate-300' },
  { id: 'monochrome', label: 'Archival Ink', desc: 'High contrast crisp monochrome black & white illustration detailing.', color: 'bg-slate-100 border-black text-black' }
];

export default function ControlPanel({
  state,
  onChangeState,
  theme,
  onChangeTheme,
  parts,
  hoveredPartId,
  selectedPartId,
  onSelectPartId,
  diagramName
}: ControlProps) {
  
  // Find currently active hovered or selected part
  const activePart = parts.find(p => p.id === selectedPartId) || parts.find(p => p.id === hoveredPartId);

  const toggleFlow = (key: 'showGrain' | 'showAir' | 'showWaste') => {
    onChangeState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setSpeed = (speed: 'paused' | 'slow' | 'normal' | 'fast') => {
    onChangeState(prev => ({ ...prev, speed }));
  };

  return (
    <div className="w-full lg:w-96 flex flex-col gap-5 text-slate-200">
      
      {/* SECTION 1: STYLE SELECTOR & PRESETS */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Drafting Style</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChangeTheme(opt.id)}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all group cursor-pointer duration-300 relative overflow-hidden ${
                theme === opt.id 
                  ? 'border-emerald-500 bg-slate-850 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30' 
                  : 'border-slate-850 bg-slate-950/40 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] font-bold tracking-wide text-slate-100 group-hover:text-emerald-400 transition-colors">
                {opt.label}
              </span>
              <span className="text-[9px] text-slate-400 leading-normal">
                {opt.desc}
              </span>
              {theme === opt.id && (
                <div className="absolute right-1 bottom-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: FLOW CONTROL ENGINE */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Flow & Rate Controllers</h2>
          </div>
          <span className="text-[9px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
            SPEED: {state.speed.toUpperCase()}
          </span>
        </div>

        {/* Dynamic Toggle buttons representing specific material streams */}
        <div className="flex flex-col gap-2">
          {/* Grain stream (Gold) */}
          <button
            onClick={() => toggleFlow('showGrain')}
            className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              state.showGrain 
                ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.06)]' 
                : 'bg-slate-950/30 border-slate-850 text-slate-450 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${state.showGrain ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`}></span>
              <span>Grain Stream (Gold)</span>
            </div>
            <Eye className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Air currents flux (Blue) */}
          <button
            onClick={() => toggleFlow('showAir')}
            className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              state.showAir 
                ? 'bg-sky-500/10 border-sky-500 text-sky-450 shadow-[0_0_10px_rgba(14,165,233,0.06)]' 
                : 'bg-slate-950/30 border-slate-850 text-slate-450 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${state.showAir ? 'bg-sky-500 animate-pulse' : 'bg-slate-600'}`}></span>
              <span>Aspiration Air / Screen Dust</span>
            </div>
            <Eye className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Waste rubbish dump (Red / Dark Grey) */}
          <button
            onClick={() => toggleFlow('showWaste')}
            className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              state.showWaste 
                ? 'bg-rose-500/10 border-rose-500 text-rose-450 shadow-[0_0_10px_rgba(239,68,68,0.06)]' 
                : 'bg-slate-950/30 border-slate-850 text-slate-450 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${state.showWaste ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`}></span>
              <span>Debris & Metal Rejects</span>
            </div>
            <Eye className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

        {/* Speed selectors */}
        <div className="flex items-center justify-between gap-1 border-t border-slate-800 pt-3 mt-1">
          <button
            onClick={() => setSpeed('paused')}
            className={`flex-1 py-1.5 rounded-md text-[10px] font-mono tracking-wider flex items-center justify-center gap-1 cursor-pointer border ${
              state.speed === 'paused' 
                ? 'bg-rose-600 border-rose-500 text-white font-bold' 
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-850'
            }`}
          >
            <Pause className="w-2.5 h-2.5" /> PAUSE
          </button>
          {['slow', 'normal', 'fast'].map((vel) => (
            <button
              key={vel}
              onClick={() => setSpeed(vel as any)}
              className={`flex-1 py-1.5 rounded-md text-[10px] font-mono tracking-wider cursor-pointer border uppercase ${
                state.speed === vel 
                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              {vel}
            </button>
          ))}
        </div>

        {/* Labels checklist and overlay display */}
        <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={() => onChangeState(prev => ({ ...prev, showLabels: !prev.showLabels }))}
            className={`py-2 px-2.5 rounded-lg border text-[10px] font-bold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
              state.showLabels 
                ? 'bg-slate-800 border-slate-700 text-slate-100' 
                : 'bg-slate-950/20 border-slate-850 text-slate-500'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {state.showLabels ? 'LABELS: ON' : 'LABELS: OFF'}
          </button>

          <button
            onClick={() => onChangeState(prev => ({ ...prev, showFidelityOverlay: !prev.showFidelityOverlay }))}
            className={`py-2 px-2.5 rounded-lg border text-[10px] font-bold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
              state.showFidelityOverlay 
                ? 'bg-sky-950/80 border-sky-700 text-sky-200 shadow-[0_0_10px_rgba(14,165,233,0.1)]' 
                : 'bg-slate-950/20 border-slate-850 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-sky-400" />
            FIDELITY VERIFY
          </button>
        </div>
      </div>

      {/* SECTION 3: PARALYSIS / EXPLORATION METADATA ANNOTATOR */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-3 min-h-[160px] relative overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Info className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Mechanical Inspector</h2>
        </div>

        {activePart ? (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-750">
                {activePart.name}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400">
                ID: {activePart.id.toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">ORIGINAL LABEL TEXT:</div>
              <div className="text-xs font-semibold text-emerald-300 font-mono italic">
                "{activePart.originalLabel}"
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">FUNCTION DESCRIPTION:</div>
              <p className="text-xs text-slate-305 leading-relaxed font-sans">
                {activePart.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-3 text-slate-500">
            <Info className="w-7 h-7 stroke-[1.25] text-slate-700 mb-1.5 stroke-dashed" />
            <span className="text-xs leading-relaxed font-semibold">
              Hover over blueprint nodes or click parts to explore the internal layout.
            </span>
          </div>
        )}
      </div>

      {/* SECTION 4: EXACT ORIGINAL TEXT INDEX DIRECT SEARCH */}
      <div className="flex-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-3 max-h-[220px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase">Original PDF Labels Index</h2>
          </div>
          <span className="text-[9px] text-[#38bdf8] font-mono">{parts.length} entries</span>
        </div>

        <div className="overflow-y-auto flex-1 pr-1.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
          {parts.map((part) => {
            const isSelected = selectedPartId === part.id;
            const isHovered = hoveredPartId === part.id;

            return (
              <button
                key={part.id}
                onMouseEnter={() => onSelectPartId(part.id)}
                onMouseLeave={() => onSelectPartId(null)}
                onClick={() => onSelectPartId(selectedPartId === part.id ? null : part.id)}
                className={`w-full p-2 rounded text-left flex items-center justify-between text-[11px] transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-500/15 border border-amber-500 text-amber-200' 
                    : isHovered
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'bg-slate-950/30 text-slate-400 border border-slate-950 hover:bg-slate-950/65'
                }`}
              >
                <span className="truncate font-mono font-bold tracking-wide">
                  {part.originalLabel}
                </span>
                <span className="text-[9px] text-slate-500 capitalize px-1.5 py-0.2 rounded bg-slate-900/50">
                  {part.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
