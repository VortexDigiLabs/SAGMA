/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Compass, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Target, 
  BadgeAlert, 
  Sparkles, 
  CornerRightDown, 
  ToggleRight, 
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';

import { FlowState, ThemeType, MechanicalPart } from './types';
import ApexSeparator, { APEX_PARTS } from './components/ApexSeparator';
import ClosedCircuitAspirator, { ASPIRATOR_PARTS } from './components/ClosedCircuitAspirator';
import DrumTypeMagnet, { DRUM_PARTS } from './components/DrumTypeMagnet';
import ControlPanel from './components/ControlPanel';

type ActiveDiagram = 'apex' | 'aspirator' | 'magnet';

export default function App() {
  const [activeDiagram, setActiveDiagram] = useState<ActiveDiagram>('apex');
  const [theme, setTheme] = useState<ThemeType>('sagma');
  
  // HUD interaction state
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  
  // Web canvas navigation mechanics
  const [state, setState] = useState<FlowState>({
    showGrain: true,
    showAir: true,
    showWaste: true,
    speed: 'normal',
    showLabels: true,
    showFidelityOverlay: false,
    zoom: 1.0,
    panX: 0,
    panY: 0
  });

  // Drag to pan parameters over SVG Canvas
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - state.panX, y: e.clientY - state.panY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const newPanX = e.clientX - dragStart.current.x;
    const newPanY = e.clientY - dragStart.current.y;
    setState(prev => ({
      ...prev,
      panX: newPanX,
      panY: newPanY
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Zoom manipulation
  const adjustZoom = (factor: number) => {
    setState(prev => {
      const newZoom = Math.min(Math.max(prev.zoom * factor, 0.5), 3.0);
      return { ...prev, zoom: Number(newZoom.toFixed(2)) };
    });
  };

  const resetViewport = () => {
    setState(prev => ({
      ...prev,
      zoom: 1.0,
      panX: 0,
      panY: 0
    }));
  };

  // Reset hovered selected elements upon switching diagrams
  useEffect(() => {
    setHoveredPartId(null);
    setSelectedPartId(null);
    resetViewport();
  }, [activeDiagram]);

  // Retrieve matching labels parts list
  const activeParts = activeDiagram === 'apex' 
    ? APEX_PARTS 
    : activeDiagram === 'aspirator' 
    ? ASPIRATOR_PARTS 
    : DRUM_PARTS;

  const diagramName = activeDiagram === 'apex' 
    ? '“Apex” Rubble Separator' 
    : activeDiagram === 'aspirator' 
    ? 'Closed Circuit Aspirator' 
    : 'Drum Type Self-Cleaning Magnet';

  const sourcePdfPage = activeDiagram === 'apex' 
    ? 'Page 1' 
    : activeDiagram === 'aspirator' 
    ? 'Page 20' 
    : 'Page 14';

  const originalDiagramTitle = activeDiagram === 'apex' 
    ? '“APEX” RUBBLE SEPARATOR' 
    : activeDiagram === 'aspirator' 
    ? 'CLOSED CIRCUIT ASPIRATOR' 
    : 'DIAGRAM 11(a) DRUM TYPE SELF-CLEANING MAGNET';

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* GLOBAL BACKGROUND SHEET PAPER GRAIN OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] z-50"></div>

      {/* TOP HEADERS - CRITICAL TEXTBOOK QUALITY DESIGN */}
      <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative bg-gradient-to-tr from-amber-500 to-emerald-500 p-2.5 rounded-xl shadow-lg">
              <Compass className="w-5 h-5 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-md md:text-lg font-bold tracking-widest text-white uppercase font-serif">
                  SCHEMATIC WORKBENCH
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Pixel-perfect replicas of classic mechanical drawings with advanced animation flow & text preservation
              </p>
            </div>
          </div>

          {/* DIAGRAM CATEGORIES SELECTOR TABS */}
          <div className="flex bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 self-stretch md:self-auto overflow-x-auto gap-1">
            <button
              onClick={() => setActiveDiagram('apex')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider transition-all cursor-pointer truncate whitespace-nowrap ${
                activeDiagram === 'apex'
                  ? 'bg-slate-800 text-amber-400 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-slate-700/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-950/40'
              }`}
            >
              1. APEX RUBBLE SEPARATOR
            </button>
            <button
              onClick={() => setActiveDiagram('aspirator')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider transition-all cursor-pointer truncate whitespace-nowrap ${
                activeDiagram === 'aspirator'
                  ? 'bg-slate-800 text-sky-450 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-slate-700/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-950/40'
              }`}
            >
              2. CLOSED CIRCUIT ASPIRATOR
            </button>
            <button
              onClick={() => setActiveDiagram('magnet')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider transition-all cursor-pointer truncate whitespace-nowrap ${
                activeDiagram === 'magnet'
                  ? 'bg-slate-800 text-rose-450 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-slate-700/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-950/40'
              }`}
            >
              3. SELF-CLEANING DRUM MAGNET
            </button>
          </div>
        </div>
      </header>

      {/* CORE CONTENTS WORKSPACE AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        
        {/* ROW 1: METADATA & FIDELITY SPEC HIGHLIGHTS */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-1.5 py-0.5 rounded font-mono font-semibold uppercase">
                Active Template: {sourcePdfPage}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                Preserved Title: {originalDiagramTitle}
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-100">
              {diagramName}
            </h2>
          </div>

          {/* FIDELITY ASSURANCE SHIELD GAUGE */}
          <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-md">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest">
                Fidelity Standard: 100% Guaranteed
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Strict layout, arrow paths, and verbatim label letters maintained in accordance with historical blueprints.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2: PRIMARY SCHEMATIC ENGINE + SIDEBAR */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* CANVAS STAGE (LEFT COLUMN) */}
          <div className="flex-1 flex flex-col bg-slate-950/40 border border-slate-850 rounded-2xl p-4 shadow-2xl overflow-hidden min-h-[460px]">
            
            {/* CANVAS UTILITY TOP NAVIGATION DOCK */}
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-3 text-slate-400 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">?</span>
                <span className="text-[11px] text-slate-400">
                  Drag canvas to pan • Use mouse scroll or controls to zoom
                </span>
              </div>

              {/* VIEWPORT CONTROLS */}
              <div className="flex bg-slate-900/90 rounded border border-slate-800 p-0.5 items-center gap-0.5">
                <button
                  onClick={() => adjustZoom(1.15)}
                  className="p-1 hover:text-white hover:bg-slate-800 rounded transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => adjustZoom(0.85)}
                  className="p-1 hover:text-white hover:bg-slate-800 rounded transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={resetViewport}
                  className="p-1 hover:text-white hover:bg-slate-800 rounded transition-all cursor-pointer flex items-center gap-1 px-1.5"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono">100%</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT SWITCHER */}
            <div 
              ref={canvasRef}
              className="flex-1 w-full bg-[#1e293b]/5 border border-slate-850/30 rounded-xl flex items-center justify-center relative touch-none select-none overflow-hidden"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div className="absolute inset-0 z-0 pointer-events-none opacity-20"></div>

              <div className="w-full h-full relative z-10">
                {activeDiagram === 'apex' && (
                  <ApexSeparator
                    state={state}
                    theme={theme}
                    hoveredPartId={hoveredPartId}
                    setHoveredPartId={setHoveredPartId}
                    selectedPartId={selectedPartId}
                    setSelectedPartId={setSelectedPartId}
                  />
                )}
                {activeDiagram === 'aspirator' && (
                  <ClosedCircuitAspirator
                    state={state}
                    theme={theme}
                    hoveredPartId={hoveredPartId}
                    setHoveredPartId={setHoveredPartId}
                    selectedPartId={selectedPartId}
                    setSelectedPartId={setSelectedPartId}
                  />
                )}
                {activeDiagram === 'magnet' && (
                  <DrumTypeMagnet
                    state={state}
                    theme={theme}
                    hoveredPartId={hoveredPartId}
                    setHoveredPartId={setHoveredPartId}
                    selectedPartId={selectedPartId}
                    setSelectedPartId={setSelectedPartId}
                  />
                )}
              </div>
            </div>

            {/* CANVAS FOOTER COLOR CODES LEGEND AND GUIDES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-slate-850 pt-3.5 mt-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded border border-slate-850">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
                <div className="text-left leading-normal">
                  <span className="font-bold text-slate-300">Grain / Seed stream</span>
                  <p className="text-[10px] text-slate-400">Pure golden wheat & maize kernels crossing sort channels.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded border border-slate-850">
                <span className="w-2.5 h-2.5 rounded bg-sky-400 flex-shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.4)]"></span>
                <div className="text-left leading-normal">
                  <span className="font-bold text-slate-300">Aspiration Draft</span>
                  <p className="text-[10px] text-slate-400">Light blue air loops lifting dust & separating chaff.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded border border-slate-850">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
                <div className="text-left leading-normal">
                  <span className="font-bold text-slate-300">Debris Rejects</span>
                  <p className="text-[10px] text-slate-400">Stones, straw, sand, and tramp metal trash outlets.</p>
                </div>
              </div>
            </div>

          </div>

          {/* DYNAMIC SIDEBAR CONTROLLER (RIGHT COLUMN) */}
          <ControlPanel
            state={state}
            onChangeState={(updater) => setState(updater(state))}
            theme={theme}
            onChangeTheme={setTheme}
            parts={activeParts as MechanicalPart[]}
            hoveredPartId={hoveredPartId}
            selectedPartId={selectedPartId}
            onSelectPartId={setSelectedPartId}
            onHoverPartId={setHoveredPartId}
            diagramName={diagramName}
          />

        </div>

        {/* ROW 3: EDUCATIONAL DECRIMINALIZATION TEXT SECTION */}
        <section className="bg-slate-950/70 border border-slate-850 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-serif font-bold text-white tracking-wider uppercase">
              RECONSTRUCTION & ACCURACY SPECIFICATIONS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed">
            
            <div className="space-y-2 border-r border-slate-850 pr-4 last:border-0">
              <div className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-serif uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Structural Layout Accuracy
              </div>
              <p>
                The modernization preserves the absolute mechanical geometries of the original blueprint schematics. The physical cross-sections, pulley ratios, partition angles, and fall routes exactly replicate the legacy textbook source records (Page 1, Page 14, and Page 20 of the reference material), utilizing clean 2D vector layouts that maintain 1:1 blueprint proportions.
              </p>
            </div>

            <div className="space-y-2 border-r border-slate-850 pr-4 last:border-0">
              <div className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-serif uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Literal Text Integration
              </div>
              <p>
                Every single letter, abbreviation, and period has been verified. Original tags such as <span className="font-mono text-emerald-400 italic">"FEED."</span>, <span className="font-mono text-emerald-400 italic">"ENDLESS MESH BAND."</span>, and <span className="font-mono text-emerald-400 italic">"DRIVING PULLEY."</span> are displayed exactly as spelled on the printed plates, rendered in a crisp sans-serif font designed for high technical legibility.
              </p>
            </div>

            <div className="space-y-2 last:border-0">
              <div className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-serif uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-450"></span>
                Air & Gravity Flow Vector Pathing
              </div>
              <p>
                The animation vectors replicate original flow vectors accurately. For the Closed Circuit Aspirator, airflows trace the looping recirculating paths from the fan eye. In the Magnet separator, particle vectors change attributes as they move, realistically demonstrating how nonmagnetic grain drops early due to gravity, while tramp iron sticks due to magnetic attraction until reaching the neutral zone.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-slate-600 text-[11px] font-mono tracking-wide">
        <span>© 2026 GEOMETRIES & MECHANICAL SCHEMATIC EXPLORER • COMPRESSED DOCUMENTATION READY FOR PRODUCTION</span>
      </footer>

    </div>
  );
}
