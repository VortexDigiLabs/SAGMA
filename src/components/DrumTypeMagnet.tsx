/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId, useState } from 'react';
import { FlowState, ThemeType } from '../types';

interface ComponentProps {
  state: FlowState;
  theme: ThemeType;
  hoveredPartId: string | null;
  setHoveredPartId: (id: string | null) => void;
  selectedPartId: string | null;
  setSelectedPartId: (id: string | null) => void;
}

export const DRUM_PARTS = [
  { id: 'part_feed', name: 'Feed', originalLabel: 'Feed', role: 'inlet', description: 'Raw material feed inlet supplying grain with tramp iron particles onto the rotating separator drum.' },
  { id: 'part_separator', name: 'MAGNETIC SEPARATOR', originalLabel: 'MAGNETIC SEPARATOR', role: 'structure', description: 'Outer protective steel casing housing the magnetic assembly and directing discharge streams safely.' },
  { id: 'part_deflector', name: 'Adjustable deflector', originalLabel: 'Adjustable deflector', role: 'separator', description: 'Angled sliding sheet that regulates the velocity and landing position of material on the drum surface.' },
  { id: 'part_mag_section', name: 'Stationary Magnetic Section', originalLabel: 'Stationary Magnetic Section', role: 'separator', description: 'Static internal sector of permanent high-intensity magnets that holds iron particles against the shell.' },
  { id: 'part_drum', name: 'Rotating drum', originalLabel: 'Rotating drum', role: 'moving', description: 'Non-magnetic stainless steel terminal cylinder revolving clockwise around the fixed magnetic core.' },
  { id: 'part_receptacle', name: 'Receptacle for iron', originalLabel: 'Receptacle for iron', role: 'outlet', description: 'Collection bin on the left side where iron particles drop off once they pass outside the stationary magnetic field.' }
];

export default function DrumTypeMagnet({
  state,
  theme,
  hoveredPartId,
  setHoveredPartId,
  selectedPartId,
  setSelectedPartId,
}: ComponentProps) {
  const maskId = useId();
  // Live control for deflector angle
  const [deflectorAngle, setDeflectorAngle] = useState<number>(32);

  const colors = {
    bg: theme === 'sagma' ? '#ffffff' : theme === 'blueprint' ? '#0a192f' : theme === 'dark-industry' ? '#121214' : '#ffffff',
    text: theme === 'sagma' ? '#003366' : theme === 'blueprint' ? '#38bdf8' : theme === 'dark-industry' ? '#e2e8f0' : '#1e293b',
    border: theme === 'sagma' ? '#003366' : theme === 'blueprint' ? '#0ea5e9' : theme === 'dark-industry' ? '#334155' : '#94a3b8',
    structure: theme === 'sagma' ? '#E1E8ED' : theme === 'blueprint' ? '#0f766e' : theme === 'dark-industry' ? '#475569' : '#e2e8f0',
    structureStroke: theme === 'sagma' ? '#003366' : theme === 'blueprint' ? '#0ea5e9' : theme === 'dark-industry' ? '#94a3b8' : '#334155',
    magnetField: theme === 'sagma' ? 'rgba(0, 51, 102, 0.08)' : theme === 'blueprint' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.12)',
    activeHighlight: theme === 'sagma' ? 'rgba(242, 169, 0, 0.3)' : 'rgba(234, 179, 8, 0.25)',
  };

  const flowColors = {
    grain1: theme === 'sagma' ? '#F2A900' : '#d97706',
    grain2: theme === 'sagma' ? '#F2A900' : '#f59e0b',
    grain3: theme === 'sagma' ? '#F2A900' : '#fbbf24',
    
    waste1: theme === 'sagma' ? '#8B0000' : '#ef4444',
    waste2: theme === 'sagma' ? '#8B0000' : '#475569',
    waste3: theme === 'sagma' ? '#8B0000' : '#1e293b',
    waste4: theme === 'sagma' ? '#8B0000' : '#64748b',
  };

  const speedSec = state.speed === 'paused' ? 0 : state.speed === 'slow' ? 12 : state.speed === 'fast' ? 3 : 6;

  // Render vector representation of Drum Type Magnet
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      <div 
        className="w-full max-w-4xl aspect-[1.5] relative shadow-inner rounded-xl border transition-all duration-300 overflow-hidden"
        style={{ 
          backgroundColor: colors.bg,
          borderColor: colors.border,
          backgroundImage: theme === 'blueprint' 
            ? 'radial-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px)' 
            : 'radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        id="magnet-canvas"
      >
        <svg 
          viewBox="0 0 850 550" 
          className="w-full h-full cursor-crosshair font-sans transition-transform duration-300"
          style={{
            transform: `scale(${state.zoom}) translate(${state.panX}px, ${state.panY}px)`
          }}
        >
          {/* BACKGROUND MAGNETIC FIELD INTENSITY LINES */}
          <defs>
            <radialGradient id="magnetic-glow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* MAIN CASING PROFILE SCHEMATIC */}
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outer box frame of magnetic separator */}
            <path 
              d="M 280 470 L 610 470 L 630 470 M 285 470 L 285 155 L 430 155" 
              stroke={colors.structureStroke} 
              strokeWidth="3.5" 
            />
            {/* Curved top roof hatch */}
            <path 
              d="M 430 155 L 530 185 L 610 240 L 610 470" 
              stroke={colors.structureStroke} 
              strokeWidth="3.5" 
            />

            {/* Bottom division splitter board */}
            <path d="M 430 380 L 430 470" stroke={colors.structureStroke} strokeWidth="3" />
            <path d="M 520 405 L 610 470" stroke={colors.structureStroke} strokeWidth="1.5" />
          </g>

          {/* BACKGROUND GLOWING MAGNET SECTOR ATTRACTION */}
          {state.showWaste && (
            <path 
              d="M 420 270 L 490 190 A 100 100 0 0 1 480 340 Z" 
              fill="url(#magnetic-glow)" 
              className="opacity-80"
            />
          )}

          {/* INTERACTIVE PARTS HOVER-SENSITIVE VECTOR SHAPES */}

          {/* 1. SEPARATOR CASING OVERALL VIEW SELECTION */}
          <g 
            id="part_separator" 
            className="group cursor-pointer opacity-50"
            onMouseEnter={() => setHoveredPartId('part_separator')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_separator' ? null : 'part_separator')}
          >
            <path 
              d="M 290 165 L 420 165" 
              stroke={hoveredPartId === 'part_separator' || selectedPartId === 'part_separator' ? '#eab308' : colors.structureStroke} 
              strokeWidth="5" 
              strokeDasharray="4,4"
            />
          </g>

          {/* 2. FEED MODULE CHUTE */}
          <g 
            id="part_feed" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_feed')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_feed' ? null : 'part_feed')}
          >
            <polygon 
              points="310,100 375,100 350,160 327,160" 
              fill={hoveredPartId === 'part_feed' || selectedPartId === 'part_feed' ? colors.activeHighlight : colors.structure} 
              stroke={colors.structureStroke} 
              strokeWidth="2.5" 
            />
            <path d="M 327 160 L 400 200" stroke={colors.structureStroke} strokeWidth="2.5" />
          </g>

          {/* 3. ADJUSTABLE DEFLECTOR BAFFLE FLAP */}
          <g 
            id="part_deflector" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_deflector')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_deflector' ? null : 'part_deflector')}
          >
            {/* Pivot support node */}
            <circle cx="370" cy="180" r="5" fill={colors.structureStroke} />

            {/* Rotating Damper flap based on custom adjustment state */}
            <line 
              x1="370" y1="180" 
              x2={370 + Math.cos((deflectorAngle * Math.PI) / 180) * 80} 
              y2={180 + Math.sin((deflectorAngle * Math.PI) / 180) * 80} 
              stroke={hoveredPartId === 'part_deflector' || selectedPartId === 'part_deflector' ? '#eab308' : colors.structureStroke} 
              strokeWidth="4" 
            />
            {/* Drag guide details */}
            <path 
              d="M 370 230 A 50 50 0 0 1 430 200" 
              stroke={colors.structureStroke} 
              strokeWidth="1" 
              strokeDasharray="2,2" 
            />
          </g>

          {/* 4. DRUM CYLINDER SHELL (ROTATING DRUM) */}
          <g 
            id="part_drum" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_drum')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_drum' ? null : 'part_drum')}
          >
            {/* Cylinder shell fill */}
            <circle 
              cx="420" cy="270" r="95" 
              fill={hoveredPartId === 'part_drum' || selectedPartId === 'part_drum' ? colors.activeHighlight : 'rgba(100,116,139,0.06)'} 
              stroke={colors.structureStroke} 
              strokeWidth="4.5" 
            />
            
            {/* Revolving mechanical line details simulating outer shell ribs */}
            <g style={{ transformOrigin: '420px 270px', animation: state.speed !== 'paused' ? `spin-clockwise ${speedSec}s linear infinite` : 'none' }}>
              <line x1="420" y1="175" x2="420" y2="185" stroke={colors.structureStroke} strokeWidth="3" />
              <line x1="420" y1="355" x2="420" y2="365" stroke={colors.structureStroke} strokeWidth="3" />
              <line x1="325" y1="270" x2="335" y2="270" stroke={colors.structureStroke} strokeWidth="3" />
              <line x1="505" y1="270" x2="515" y2="270" stroke={colors.structureStroke} strokeWidth="3" />
              {/* Corner ribs */}
              <line x1="353" y1="203" x2="360" y2="210" stroke={colors.structureStroke} strokeWidth="2" />
              <line x1="487" y1="337" x2="480" y2="330" stroke={colors.structureStroke} strokeWidth="2" />
              <line x1="487" y1="203" x2="480" y2="210" stroke={colors.structureStroke} strokeWidth="2" />
              <line x1="353" y1="337" x2="360" y2="330" stroke={colors.structureStroke} strokeWidth="2" />
            </g>

            {/* Rotating arrow indicator surrounding cylinder */}
            <path d="M 295 270 A 125 125 0 0 1 420 145" fill="none" stroke={colors.structureStroke} strokeWidth="1.5" strokeDasharray="5,5" />
            <path d="M 420 145 L 413 140 M 420 145 L 413 150" stroke={colors.structureStroke} strokeWidth="2" />
          </g>

          {/* 5. INTERNAL STATIONARY MAGNET ASSEMBLAGE */}
          <g 
            id="part_mag_section" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_mag_section')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_mag_section' ? null : 'part_mag_section')}
          >
            {/* Magnet core segment (shaded semicircle block on right half) */}
            <path 
              d="M 420 270 L 485 220 A 75 75 0 0 1 485 320 Z" 
              fill={hoveredPartId === 'part_mag_section' || selectedPartId === 'part_mag_section' ? '#f87171' : '#ef4444'} 
              stroke="#b91c1c" 
              strokeWidth="3.5" 
            />
            {/* Double polar hash marks inside magnet representing North/South poles */}
            <text x="445" y="260" fill="#ffffff" className="text-[12px] font-bold font-mono">N</text>
            <text x="445" y="295" fill="#ffffff" className="text-[12px] font-bold font-mono">S</text>

            <circle cx="420" cy="270" r="14" fill={colors.structure} stroke={colors.structureStroke} strokeWidth="3" />
            <circle cx="420" cy="270" r="4" fill="#ffffff" />
          </g>

          {/* 6. RECEPTACLE COLLECTION CHAMBER FOR IRON */}
          <g 
            id="part_receptacle" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_receptacle')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_receptacle' ? null : 'part_receptacle')}
          >
            {/* Draw a subtle scrap iron container outline at bottom left */}
            <rect 
              x="305" y="445" width="105" height="23" 
              fill={hoveredPartId === 'part_receptacle' || selectedPartId === 'part_receptacle' ? colors.activeHighlight : 'rgba(100,116,139,0.1)'} 
              stroke={colors.structureStroke} 
              strokeWidth="2" 
              rx="3"
            />
            {/* Small jagged nails/bolts scrap shapes inside bin */}
            <path d="M 315 455 L 325 450 M 330 460 L 340 455 M 360 450 L 370 453 M 380 461 L 392 453" stroke={colors.structureStroke} strokeWidth="2.5" />
          </g>


          {/* ========================================================= */}
          {/* NON-MAGNETIC CLEAN GRAIN FLOW TRAJECTORIES (GOLD COLOR) */}
          {/* ========================================================= */}
          {state.showGrain && state.speed !== 'paused' && (
            <g id="pure-grain-particles">
              {/* Feed flow entering drum */}
              <circle r="3.5" fill={flowColors.grain1} style={{ animation: `flow-mag-inlet ${speedSec/4}s linear infinite` }} />
              <circle r="4" fill={flowColors.grain2} style={{ animation: `flow-mag-inlet-2 ${speedSec/4}s linear 0.3s infinite` }} />

              {/* Grain sliding along rotating outer shell */}
              <circle r="3.5" fill={flowColors.grain1} style={{ animation: `flow-grain-drum-slide-1 ${speedSec/2.5}s linear infinite` }} />
              <circle r="4.2" fill={flowColors.grain3} style={{ animation: `flow-grain-drum-slide-2 ${speedSec/2.5}s linear 0.4s infinite` }} />

              {/* Falling off into clear flow to bottom-right exit */}
              <circle r="4" fill={flowColors.grain1} style={{ animation: `flow-grain-mag-clean-1 ${speedSec/3.5}s linear infinite` }} />
              <circle r="3" fill={flowColors.grain2} style={{ animation: `flow-grain-mag-clean-2 ${speedSec/3.5}s linear 0.2s infinite` }} />
              <circle r="3.5" fill={flowColors.grain3} style={{ animation: `flow-grain-mag-clean-3 ${speedSec/3.5}s linear 0.45s infinite` }} />
            </g>
          )}

          {/* ========================================================= */}
          {/* CAPTURED TRAMP IRON PARTICLE TRACKING (RED/DARK GREY) */}
          {/* ========================================================= */}
          {state.showWaste && state.speed !== 'paused' && (
            <g id="attracted-iron-particles">
              {/* Iron falling from feed and getting stuck on right-half boundary */}
              <circle r="3" fill={flowColors.waste1} style={{ animation: `flow-iron-attract-1 ${speedSec/1.5}s linear infinite` }} />
              <circle r="3.5" fill={flowColors.waste2} style={{ animation: `flow-iron-attract-2 ${speedSec/1.5}s linear 0.6s infinite` }} />

              {/* Falling off on the left side (outside N/S field) into waste bin */}
              <circle r="3.5" fill={flowColors.waste1} style={{ animation: `flow-iron-release-1 ${speedSec/3.5}s linear infinite` }} />
              <circle r="2.8" fill={flowColors.waste3} style={{ animation: `flow-iron-release-2 ${speedSec/3.5}s linear 0.4s infinite` }} />

              {/* Extra minor debris particles for beautiful volumetric coverage */}
              <circle r="1.6" fill={flowColors.waste3} style={{ animation: `flow-iron-attract-1 ${speedSec/1.8}s linear 0.3s infinite` }} />
              <circle r="2.2" fill={flowColors.waste1} style={{ animation: `flow-iron-release-1 ${speedSec/4.0}s linear 0.2s infinite` }} />
              <circle r="1.8" fill={flowColors.waste4} style={{ animation: `flow-iron-release-2 ${speedSec/3.0}s linear 0.5s infinite` }} />
            </g>
          )}

          {/* LIVE ADJUSTMENT CONTROL INTEGRATION */}
          <foreignObject x="610" y="455" width="200" height="70" className="overflow-visible pointer-events-auto">
            <div className="bg-slate-900/90 text-slate-200 text-[10px] p-2.5 rounded-lg border border-slate-700 font-mono shadow-md flex flex-col gap-1">
              <span className="text-[#38bdf8] font-bold">DEFLECTOR ANGLE: {deflectorAngle}°</span>
              <div className="flex items-center gap-1">
                <input 
                  type="range" 
                  min="0" 
                  max="70" 
                  value={deflectorAngle} 
                  onChange={(e) => setDeflectorAngle(Number(e.target.value))}
                  className="w-full h-1 bg-slate-700 accent-emerald-500 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-400">
                <span>STEEP</span>
                <span className="text-emerald-400">TRAJECTORY</span>
                <span>FLAT</span>
              </div>
            </div>
          </foreignObject>


          {/* ========================================================= */}
          {/* TEXT SPECS & INFOGRAPHICS (100% TEXT ACCURACY MATCH) */}
          {/* ========================================================= */}
          {state.showLabels && (
            <g id="magnet-labels" className="text-[11px] font-semibold tracking-wider font-sans">
              <text 
                x="425" y="32" 
                textAnchor="middle" 
                className="text-sm font-bold tracking-widest uppercase"
                fill={colors.text}
              >
                DRUM TYPE SELF-CLEANING MAGNET
              </text>

              {/* Feed */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_feed' || selectedPartId === 'part_feed' ? 1 : 0.75}>
                <text x="310" y="70" fill={colors.text} textAnchor="end">Feed</text>
                <line x1="315" y1="67" x2="335" y2="92" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="335" cy="92" r="2" fill={colors.text} />
              </g>

              {/* MAGNETIC SEPARATOR */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_separator' || selectedPartId === 'part_separator' ? 1 : 0.75}>
                <text x="560" y="115" fill={colors.text} textAnchor="start">MAGNETIC SEPARATOR</text>
                <line x1="555" y1="112" x2="430" y2="155" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="430" cy="155" r="2" fill={colors.text} />
              </g>

              {/* Adjustable deflector */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_deflector' || selectedPartId === 'part_deflector' ? 1 : 0.75}>
                <text x="610" y="180" fill={colors.text} textAnchor="start">Adjustable deflector</text>
                {/* Points near rotating dampers */}
                <line x1="605" y1="177" x2={375 + Math.cos((deflectorAngle * Math.PI) / 180) * 35} y2={180 + Math.sin((deflectorAngle * Math.PI) / 180) * 35} stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
              </g>

              {/* Stationary Magnetic Section */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_mag_section' || selectedPartId === 'part_mag_section' ? 1 : 0.75}>
                <text x="560" y="275" fill={colors.text} textAnchor="start">Stationary Magnetic Section</text>
                <line x1="555" y1="272" x2="445" y2="270" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="445" cy="270" r="2" fill={colors.text} />
              </g>

              {/* Rotating drum */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_drum' || selectedPartId === 'part_drum' ? 1 : 0.75}>
                <text x="555" y="325" fill={colors.text} textAnchor="start">Rotating drum</text>
                <line x1="550" y1="322" x2="495" y2="330" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="495" cy="330" r="2" fill={colors.text} />
              </g>

              {/* Receptacle for iron */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_receptacle' || selectedPartId === 'part_receptacle' ? 1 : 0.75}>
                <text x="180" y="420" fill="#ef4444" textAnchor="end" className="font-bold">Receptacle for iron</text>
                <line x1="185" y1="417" x2="310" y2="445" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="310" cy="445" r="2" fill={colors.text} />
              </g>
            </g>
          )}
        </svg>

        {/* RECONSTRUCTED MODEL STATS GAUGE */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          <div className="bg-slate-950/80 hover:bg-slate-900 border border-slate-700/50 text-[10px] font-mono p-2 rounded-lg text-rose-400">
            MAGNET POWER: 14,000 GAUSS
          </div>
        </div>
      </div>

      <style>{`
        /* Paths animations for Drum Sep magnet */
        @keyframes flow-mag-inlet {
          0% { cx: 338px; cy: 110px; opacity: 1; }
          100% { cx: 335px; cy: 162px; opacity: 0; }
        }
        @keyframes flow-mag-inlet-2 {
          0% { cx: 348px; cy: 110px; opacity: 1; }
          100% { cx: 345px; cy: 162px; opacity: 0; }
        }

        @keyframes flow-grain-drum-slide-1 {
          0% { cx: 375px; cy: 180px; opacity: 1; }
          30% { cx: 435px; cy: 178px; opacity: 1; }
          100% { cx: 506px; cy: 232px; opacity: 0; }
        }
        @keyframes flow-grain-drum-slide-2 {
          0% { cx: 350px; cy: 198px; opacity: 1; }
          40% { cx: 430px; cy: 178px; opacity: 1; }
          100% { cx: 508px; cy: 228px; opacity: 0; }
        }

        @keyframes flow-grain-mag-clean-1 {
          0% { cx: 510px; cy: 235px; opacity: 1; }
          100% { cx: 550px; cy: 450px; opacity: 0; }
        }
        @keyframes flow-grain-mag-clean-2 {
          0% { cx: 512px; cy: 260px; opacity: 1; }
          100% { cx: 520px; cy: 450px; opacity: 0; }
        }
        @keyframes flow-grain-mag-clean-3 {
          0% { cx: 504px; cy: 245px; opacity: 1; }
          100% { cx: 535px; cy: 450px; opacity: 0; }
        }

        /* Magnetics attraction and rotation path triggers */
        @keyframes flow-iron-attract-1 {
          0% { cx: 345px; cy: 162px; opacity: 1; }
          15% { cx: 435px; cy: 178px; opacity: 1; } /* stick */
          40% { cx: 508px; cy: 232px; opacity: 1; } /* travel S */
          75% { cx: 461px; cy: 350px; opacity: 1; } /* travel SW outside field */
          100% { cx: 440px; cy: 362px; opacity: 1; }
        }
        @keyframes flow-iron-attract-2 {
          0% { cx: 335px; cy: 162px; opacity: 1; }
          20% { cx: 428px; cy: 178px; opacity: 1; } /* stick */
          45% { cx: 513px; cy: 242px; opacity: 1; } /* travel S */
          80% { cx: 453px; cy: 352px; opacity: 1; } /* travel SW outside field */
          100% { cx: 435px; cy: 365px; opacity: 1; }
        }

        @keyframes flow-iron-release-1 {
          0% { cx: 440px; cy: 362px; opacity: 1; }
          100% { cx: 365px; cy: 445px; opacity: 0; }
        }
        @keyframes flow-iron-release-2 {
          0% { cx: 435px; cy: 365px; opacity: 1; }
          100% { cx: 345px; cy: 445px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
