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

export const ASPIRATOR_PARTS = [
  { id: 'part_feed', name: 'A. FEED', originalLabel: 'A. FEED', role: 'inlet', description: 'Raw grain feed container that supplies consistent, uncleaned cereals (wheat or maize) to the feed system.' },
  { id: 'part_feeder', name: 'B. VIBRATORY FEEDER', originalLabel: 'B. VIBRATORY FEEDER', role: 'moving', description: 'High-frequency vibratory tray distributing a thin, uniform curtain of grain across the entire width of the aspiration leg.' },
  { id: 'part_discharge', name: 'C. CLEAN GRAIN DISCHARGE', originalLabel: 'C. CLEAN WHEAT DISCHARGE / CLEAN MAIZE DISCHARGE', role: 'outlet', description: 'Heavy grain kernels drop directly down through the ascending air stream, exiting clean at the bottom discharge.' },
  { id: 'part_adj_plate', name: 'D. ADJUSTABLE PLATE', originalLabel: 'D. ADJUSTABLE PLATE', role: 'separator', description: 'Sliding plate used to restrict the cross-section of the separation channel, optimizing air velocity and lift capacity.' },
  { id: 'part_leg', name: 'E. ASPIRATION LEG TO FAN', originalLabel: 'E. ASPIRATION LEG TO FAN', role: 'separator', description: 'The primary vertical sorting column where heavy grains fall down while lightweight dust is accelerated upwards.' },
  { id: 'part_rotary_seal', name: 'F. ROTARY AIR SEAL', originalLabel: 'F. ROTARY AIR SEAL', role: 'moving', description: 'Rotating star valve releasing separated light impurities from the expansion chamber pressure drop without allowing air loss.' },
  { id: 'part_expansion', name: 'G. EXPANSION CHAMBER', originalLabel: 'G. EXPANSION CHAMBER', role: 'separator', description: 'Large settlement section where the cross-sectional area expands, slowing the airflow velocity so that light particles fall out of suspension.' },
  { id: 'part_air_to_fan', name: 'H. AIR TO FAN', originalLabel: 'H. AIR TO FAN', role: 'structure', description: 'Suction duct drawing low-density air from the clean section of the settling expansion chamber into the fan input.' },
  { id: 'part_fan_eye', name: 'J. FAN EYE', originalLabel: 'J. FAN EYE', role: 'moving', description: 'Central intake eye of the centrifugal blower where air enters before being accelerated radially.' },
  { id: 'part_impurity_discharge', name: 'K. IMPURITY DISCHARGE', originalLabel: 'K. IMPURITY DISCHARGE', role: 'outlet', description: 'Discharge chute situated below the rotary air seal where dust, husks, straw, and shriveled grains exit.' },
  { id: 'part_clean_air_fan', name: 'L. CLEAN AIR FROM FAN', originalLabel: 'L. CLEAN AIR FROM FAN', role: 'structure', description: 'Return duct channel recirculating clean air from the fan pressure discharge back to the bottom inlet of the aspiration leg.' }
];

export default function ClosedCircuitAspirator({
  state,
  theme,
  hoveredPartId,
  setHoveredPartId,
  selectedPartId,
  setSelectedPartId,
}: ComponentProps) {
  const maskId = useId();
  // Interactive control for adjustable plate (let users move it in UI)
  const [bafflePosition, setBafflePosition] = useState<number>(295);

  const colors = {
    bg: theme === 'blueprint' ? '#0a192f' : theme === 'dark-industry' ? '#121214' : '#ffffff',
    text: theme === 'blueprint' ? '#38bdf8' : theme === 'dark-industry' ? '#e2e8f0' : '#1e293b',
    border: theme === 'blueprint' ? '#0ea5e9' : theme === 'dark-industry' ? '#334155' : '#94a3b8',
    structure: theme === 'blueprint' ? '#115e59' : theme === 'dark-industry' ? '#334155' : '#e2e8f0',
    structureStroke: theme === 'blueprint' ? '#0ea5e9' : theme === 'dark-industry' ? '#64748b' : '#334155',
    airPath: theme === 'blueprint' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.08)',
    activeHighlight: 'rgba(234, 179, 8, 0.25)',
  };

  const speedSec = state.speed === 'paused' ? 0 : state.speed === 'slow' ? 12 : state.speed === 'fast' ? 3 : 6;

  // Toggle maize/wheat label
  const [isMaizeLabel, setIsMaizeLabel] = useState<boolean>(false);

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
        id="aspirator-canvas"
      >
        <svg 
          viewBox="0 0 850 550" 
          className="w-full h-full cursor-crosshair font-sans transition-transform duration-300"
          style={{
            transform: `scale(${state.zoom}) translate(${state.panX}px, ${state.panY}px)`
          }}
        >
          {/* BACKGROUND AIRFLOW/DUST VOLUME GRADIENTS */}
          <defs>
            <radialGradient id="fan-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="leg-suction" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AIR DUCTS SHADING (EXPANSION CHAMBERS / PRESSURE COLUMNS) */}
          <g opacity="0.8">
            {/* Aspiration vertical channel */}
            <path d="M 270 200 L 320 200 L 320 460 L 270 460 Z" fill="url(#leg-suction)" />
            {/* Duct curve head */}
            <path d="M 270 200 C 270 90, 480 90, 480 200 L 410 200 C 410 140, 320 140, 320 200 Z" fill={colors.airPath} />
            {/* Expansion chamber G */}
            <polygon points="410,200 480,200 500,380 430,420 380,380" fill={colors.airPath} className="opacity-70" />
          </g>

          {/* MAIN CASING PROFILE SCHEMATIC */}
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Bottom ground stand structure */}
            <path d="M 250 490 L 520 490" stroke={colors.structureStroke} strokeWidth="3.5" />
            <path d="M 330 490 L 330 520 M 460 490 L 460 520" stroke={colors.structureStroke} strokeWidth="2.5" />

            {/* Aspiration Leg Column Walls */}
            <path d="M 270 280 L 270 460" stroke={colors.structureStroke} strokeWidth="3" />
            <path d="M 320 200 L 320 460" stroke={colors.structureStroke} strokeWidth="3" id="inner-leg-wall" />

            {/* Upper loop profile canopy */}
            <path d="M 270 200 L 270 180" stroke={colors.structureStroke} strokeWidth="3" />
            <path d="M 270 180 C 270 70, 480 70, 480 180 L 480 340" stroke={colors.structureStroke} strokeWidth="3" />
            <path d="M 320 200 C 320 115, 410 115, 410 180 L 410 240" stroke={colors.structureStroke} strokeWidth="2" />

            {/* Expansion Chamber G Walls */}
            <path d="M 480 200 L 510 390 M 510 390 L 450 430 L 450 460" stroke={colors.structureStroke} strokeWidth="3.5" />
            <path d="M 380 240 L 380 360 M 380 360 L 410 430 L 410 460" stroke={colors.structureStroke} strokeWidth="3" />

            {/* Recirculation Fan Outer scroll enclosure */}
            <circle cx="430" cy="310" r="45" stroke={colors.structureStroke} strokeWidth="3" fill="none" />
            <path d="M 385 310 L 340 310 L 340 450 L 320 450" stroke={colors.structureStroke} strokeWidth="2.5" />
          </g>

          {/* INTERACTIVE MECHANICAL CLASSIFIER ELEMENTS */}

          {/* A. FEED CONTAINER */}
          <g 
            id="part_feed" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_feed')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_feed' ? null : 'part_feed')}
          >
            <path 
              d="M 210 140 L 255 140 L 245 230 L 225 230 Z" 
              fill={hoveredPartId === 'part_feed' || selectedPartId === 'part_feed' ? colors.activeHighlight : colors.structure} 
              stroke={colors.structureStroke} 
              strokeWidth="2.5" 
            />
            {/* Hopper grid lining detail */}
            <line x1="225" y1="160" x2="245" y2="160" stroke={colors.structureStroke} strokeWidth="1" />
            <line x1="223" y1="180" x2="247" y2="180" stroke={colors.structureStroke} strokeWidth="1" />
            <line x1="221" y1="200" x2="249" y2="200" stroke={colors.structureStroke} strokeWidth="1" />
          </g>

          {/* B. VIBRATORY FEEDER */}
          <g 
            id="part_feeder" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_feeder')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_feeder' ? null : 'part_feeder')}
          >
            {/* The Vibratory Tray block slanted down-right */}
            <polygon 
              points="185,250 205,245 260,265 240,274" 
              fill={hoveredPartId === 'part_feeder' || selectedPartId === 'part_feeder' ? colors.activeHighlight : colors.structure} 
              stroke={colors.structureStroke} 
              strokeWidth="2.5" 
              style={{
                animation: state.speed !== 'paused' ? 'screen-jiggle 0.08s ease-in-out infinite' : 'none'
              }}
            />
            {/* Vibrating anchor mount springs */}
            <path d="M 195 258 L 190 280 M 230 270 L 225 300" stroke={colors.structureStroke} strokeWidth="2" />
          </g>

          {/* D. ADJUSTABLE BAFFLE PLATE (DRAGGABLE IN REAL-TIME OR CLICK TO MOVE) */}
          <g 
            id="part_adj_plate" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_adj_plate')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_adj_plate' ? null : 'part_adj_plate')}
          >
            {/* Drag guide line background */}
            <line x1="280" y1="330" x2="315" y2="330" stroke={colors.structureStroke} strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Baffle Plate Core */}
            <line 
              x1={bafflePosition} y1="300" x2={bafflePosition} y2="360" 
              stroke={hoveredPartId === 'part_adj_plate' || selectedPartId === 'part_adj_plate' ? '#eab308' : colors.structureStroke} 
              strokeWidth="5.5" 
            />
            <rect 
              x={bafflePosition - 4} y="322" width="8" height="16" 
              rx="2" 
              fill={colors.structureStroke} 
            />
            {/* Micro horizontal adjust arrows */}
            <path d="M 270 330 L 273 327 M 270 330 L 273 333" stroke={colors.structureStroke} strokeWidth="1.5" />
            <path d="M 325 330 L 322 327 M 325 330 L 322 333" stroke={colors.structureStroke} strokeWidth="1.5" />
            <line x1="268" y1="330" x2="327" y2="330" stroke={colors.structureStroke} strokeWidth="1" />
          </g>

          {/* F. ROTARY AIR SEAL STAR WHEEL VALVE */}
          <g 
            id="part_rotary_seal" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_rotary_seal')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_rotary_seal' ? null : 'part_rotary_seal')}
          >
            <circle 
              cx="430" cy="445" r="28" 
              fill={hoveredPartId === 'part_rotary_seal' || selectedPartId === 'part_rotary_seal' ? colors.activeHighlight : 'rgba(200,200,200,0.1)'} 
              stroke={colors.structureStroke} 
              strokeWidth="2.5" 
            />
            {/* Star wheel paddles rotating clockwise */}
            <g style={{ transformOrigin: '430px 445px', animation: state.speed !== 'paused' ? `spin-clockwise ${speedSec * 1.5}s linear infinite` : 'none' }}>
              <line x1="430" y1="417" x2="430" y2="473" stroke={colors.structureStroke} strokeWidth="2" />
              <line x1="402" y1="445" x2="458" y2="445" stroke={colors.structureStroke} strokeWidth="2" />
              <line x1="410" y1="425" x2="450" y2="465" stroke={colors.structureStroke} strokeWidth="1.5" />
              <line x1="410" y1="465" x2="450" y2="425" stroke={colors.structureStroke} strokeWidth="1.5" />
            </g>
            <circle cx="430" cy="445" r="8" fill={colors.structure} stroke={colors.structureStroke} strokeWidth="2" />
            <circle cx="430" cy="445" r="2.5" fill="#ffffff" />
          </g>

          {/* J. FAN ROTATING VANE WHEEL */}
          <g 
            id="part_fan_eye" 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredPartId('part_fan_eye')}
            onMouseLeave={() => setHoveredPartId(null)}
            onClick={() => setSelectedPartId(selectedPartId === 'part_fan_eye' ? null : 'part_fan_eye')}
          >
            {/* Center Fan Eye glow circle */}
            <circle cx="430" cy="310" r="16" fill="url(#fan-glow)" />
            <circle 
              cx="430" cy="310" r="38" 
              fill={hoveredPartId === 'part_fan_eye' || selectedPartId === 'part_fan_eye' ? colors.activeHighlight : 'transparent'} 
              stroke={colors.structureStroke} 
              strokeWidth="1.5" 
            />

            {/* Impeller blades vector */}
            <g style={{ transformOrigin: '430px 310px', animation: state.speed !== 'paused' ? `spin-clockwise ${speedSec / 3}s linear infinite` : 'none' }}>
              {/* Radial curved blades as shown on Vane Wheel diagrams */}
              <path d="M 430 272 Q 442 284, 430 300" stroke={colors.structureStroke} strokeWidth="2" fill="none" />
              <path d="M 430 348 Q 418 336, 430 320" stroke={colors.structureStroke} strokeWidth="2" fill="none" />
              <path d="M 392 310 Q 404 322, 420 310" stroke={colors.structureStroke} strokeWidth="2" fill="none" />
              <path d="M 468 310 Q 456 298, 440 310" stroke={colors.structureStroke} strokeWidth="2" fill="none" />
              <path d="M 403 283 Q 418 293, 423 303" stroke={colors.structureStroke} strokeWidth="1.5" fill="none" />
              <path d="M 457 337 Q 442 327, 437 317" stroke={colors.structureStroke} strokeWidth="1.5" fill="none" />
              <path d="M 457 283 Q 442 293, 437 303" stroke={colors.structureStroke} strokeWidth="1.5" fill="none" />
              <path d="M 403 337 Q 418 327, 423 317" stroke={colors.structureStroke} strokeWidth="1.5" fill="none" />
            </g>
            {/* Center axle boss */}
            <circle cx="430" cy="310" r="7" fill={colors.structure} stroke={colors.structureStroke} strokeWidth="2" />
          </g>


          {/* ========================================================= */}
          {/* RE-CIRCULATING AIRFLOW VECTOR LINES (LIGHT BLUE ANIMA) */}
          {/* ========================================================= */}
          {state.showAir && state.speed !== 'paused' && (
            <g id="recirulating-airflow-vectors">
              {/* Loop 1: Air column rushing up Aspiration Leg */}
              <path 
                d="M 295 440 L 295 190 Q 295 110 390 120 T 450 165 L 450 250" 
                fill="none" 
                stroke="#0ea5e9" 
                strokeWidth="2.5" 
                strokeDasharray="18,10"
                style={{ animation: `airflow-run ${speedSec/2}s infinite linear` }}
              />
              <path 
                d="M 285 435 L 285 195 Q 285 120 375 130 T 435 180 L 435 240" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="1.5" 
                strokeDasharray="10,8"
                style={{ animation: `airflow-run ${speedSec/2}s linear 0.4s infinite` }}
              />
              <path 
                d="M 305 442 L 305 185 Q 305 100 405 110 T 465 155 L 465 270" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="2" 
                strokeDasharray="15,12"
                style={{ animation: `airflow-run ${speedSec/2}s linear 0.8s infinite` }}
              />

              {/* Loop 2: Air descending in Settling chamber G into Fan inlet */}
              <path 
                d="M 460 270 L 460 360 Q 460 380, 440 380 L 430 355" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="1.5" 
                strokeDasharray="12,12"
                style={{ animation: `airflow-run ${speedSec/2}s linear infinite` }}
              />

              {/* Loop 3: Air blown through Fan outlet housing returning via duct L to bottom of Leg */}
              <path 
                d="M 430 294 L 430 260 M 360 360 L 335 360 L 335 440 Q 335 460 300 460" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="1.5" 
                strokeDasharray="10,6"
                style={{ animation: `airflow-run ${speedSec/2.5}s linear infinite` }}
              />
            </g>
          )}

          {/* ========================================================= */}
          {/* HEAVY GRAIN FLOW LINES - DROP DOWN (GOLD CIRCLES) */}
          {/* ========================================================= */}
          {state.showGrain && state.speed !== 'paused' && (
            <g id="wheat-heavy-particles">
              {/* Raw grain in hopper feeding down */}
              <circle r="3.5" fill="#d97706" style={{ animation: `flow-hopper-sift ${speedSec/5}s linear infinite` }} />
              <circle r="4.2" fill="#f59e0b" style={{ animation: `flow-hopper-sift-2 ${speedSec/5}s linear 0.3s infinite` }} />

              {/* Grain traversing Vibrating Feeder B */}
              <circle r="3.8" fill="#d97706" style={{ animation: `flow-feeder-slide ${speedSec/4}s linear infinite` }} />
              <circle r="3.2" fill="#f59e0b" style={{ animation: `flow-feeder-slide-2 ${speedSec/4}s linear 0.2s infinite` }} />

              {/* Heavy Grains falling through separation column E counter-current to airflow */}
              <circle r="4.2" fill="#fbbf24" style={{ animation: `flow-grain-fall-leg-1 ${speedSec/3}s linear infinite` }} />
              <circle r="3.8" fill="#d97706" style={{ animation: `flow-grain-fall-leg-2 ${speedSec/3}s linear 0.25s infinite` }} />
              <circle r="3" fill="#ca8a04" style={{ animation: `flow-grain-fall-leg-3 ${speedSec/3}s linear 0.5s infinite` }} />
              <circle r="4.5" fill="#d97706" style={{ animation: `flow-grain-fall-leg-4 ${speedSec/3}s linear 0.75s infinite` }} />

              {/* Heavy Clean wheat falling from bottom C outlet */}
              <circle r="4" fill="#f59e0b" style={{ animation: `flow-clean-output-1 ${speedSec/4}s linear infinite` }} />
              <circle r="3.5" fill="#ca8a04" style={{ animation: `flow-clean-output-2 ${speedSec/4}s linear 0.15s infinite` }} />
              <circle r="4.5" fill="#d97706" style={{ animation: `flow-clean-output-3 ${speedSec/4}s linear 0.35s infinite` }} />
            </g>
          )}

          {/* ========================================================= */}
          {/* LIGHT IMPURITY SORTING LINES & PARTICLES (RED / GREY DOTS) */}
          {/* ========================================================= */}
          {state.showWaste && state.speed !== 'paused' && (
            <g id="light-impurity-suspended-particles">
              {/* Lightweight husks separation in Column E - flying upwards! */}
              <polygon points="0,0 5,0 2.5,5" fill="#ef4444" style={{ animation: `flow-impurity-lift-1 ${speedSec/2.5}s linear infinite` }} />
              <rect width="3.5" height="3.5" fill="#64748b" style={{ animation: `flow-impurity-lift-2 ${speedSec/2.5}s linear 0.3s infinite` }} />
              <polygon points="0,0 4,0 2,4" fill="#f87171" style={{ animation: `flow-impurity-lift-3 ${speedSec/2.5}s linear 0.6s infinite` }} />

              {/* Travelling around top loop and precipitating in Expansion Chamber G */}
              <rect width="4" height="4" fill="#64748b" style={{ animation: `flow-impurity-precipitate-1 ${speedSec/2}s linear infinite` }} />
              <polygon points="0,0 5,0 2.5,5" fill="#ef4444" style={{ animation: `flow-impurity-precipitate-2 ${speedSec/2}s linear 0.5s infinite` }} />
              <rect width="3" height="3" fill="#475569" style={{ animation: `flow-impurity-precipitate-3 ${speedSec/2}s linear 1.0s infinite` }} />

              {/* Sifting through Rotary Valve star F into Chute K */}
              <polygon points="0,0 4,0 2,4" fill="#ef4444" style={{ animation: `flow-impurity-discharge-1 ${speedSec/3.5}s linear infinite` }} />
              <rect width="3.5" height="3.5" fill="#64748b" style={{ animation: `flow-impurity-discharge-2 ${speedSec/3.5}s linear 0.2s infinite` }} />
            </g>
          )}

          {/* DYNAMIC VALUE MANIPULATOR SLIDER GADGET AT BOTTOM COUPLING INTEGRATION */}
          <foreignObject x="40" y="470" width="180" height="70" className="overflow-visible pointer-events-auto">
            <div className="bg-slate-900/90 text-slate-200 text-[10px] p-2.5 rounded-lg border border-slate-700 font-mono shadow-md flex flex-col gap-1">
              <span className="text-[#38bdf8] font-bold">LEG DAMPER CONTROLLER</span>
              <div className="flex items-center gap-1">
                <input 
                  type="range" 
                  min="282" 
                  max="315" 
                  value={bafflePosition} 
                  onChange={(e) => setBafflePosition(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 rounded-md bg-slate-700"
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-400">
                <span>OPEN</span>
                <span className="text-emerald-400 font-bold">SPAN: {Math.round((bafflePosition-270) * 1.8)}%</span>
                <span>RESTRICT</span>
              </div>
            </div>
          </foreignObject>


          {/* ========================================================= */}
          {/* TEXT SPECS & INFOGRAPHICS (100% TEXT ACCURACY MATCH) */}
          {/* ========================================================= */}
          {state.showLabels && (
            <g id="aspirator-labels" className="text-[10px] font-semibold tracking-wider font-sans">
              <text 
                x="410" y="35" 
                textAnchor="middle" 
                className="text-sm font-bold tracking-widest uppercase"
                fill={colors.text}
              >
                CLOSED CIRCUIT ASPIRATOR
              </text>

              {/* A. FEED */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_feed' || selectedPartId === 'part_feed' ? 1 : 0.7}>
                <text x="210" y="110" fill={colors.text} textAnchor="end">A. Feed (or FEED)</text>
                <line x1="210" y1="107" x2="235" y2="135" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="235" cy="135" r="2" fill={colors.text} />
              </g>

              {/* B. VIBRATORY FEEDER */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_feeder' || selectedPartId === 'part_feeder' ? 1 : 0.7}>
                <text x="110" y="270" fill={colors.text} textAnchor="end">B. Vibratory feeder</text>
                <line x1="115" y1="267" x2="228" y2="257" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="228" cy="257" r="2" fill={colors.text} />
              </g>

              {/* C. CLEAN GRAIN DISCHARGE */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_discharge' || selectedPartId === 'part_discharge' ? 1 : 0.7}>
                {/* Dynamic selection text as shown inside Page 20 dual glossary */}
                <text x="140" y="525" fill="#d97706" textAnchor="start" className="cursor-pointer underline decoration-dotted" onClick={() => setIsMaizeLabel(!isMaizeLabel)}>
                  {isMaizeLabel ? 'C. Clean maize discharge' : 'C. Clean wheat discharge'}
                </text>
                <line x1="205" y1="510" x2="280" y2="480" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="280" cy="480" r="2" fill={colors.text} />
              </g>

              {/* D. ADJUSTABLE PLATE */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_adj_plate' || selectedPartId === 'part_adj_plate' ? 1 : 0.7}>
                <text x="180" y="380" fill={colors.text} textAnchor="end">D. Adjustable plate</text>
                <line x1="185" y1="377" x2={bafflePosition} y2="340" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx={bafflePosition} cy="340" r="2" fill={colors.text} />
              </g>

              {/* E. ASPIRATION LEG */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_leg' || selectedPartId === 'part_leg' ? 1 : 0.7}>
                <text x="350" y="222" fill={colors.text} textAnchor="start">E. Aspiration leg to fan</text>
                <line x1="345" y1="219" x2="295" y2="245" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="295" cy="245" r="2" fill={colors.text} />
              </g>

              {/* F. ROTARY AIR SEAL */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_rotary_seal' || selectedPartId === 'part_rotary_seal' ? 1 : 0.7}>
                <text x="560" y="445" fill={colors.text} textAnchor="start">F. Rotary air seal</text>
                <line x1="555" y1="442" x2="455" y2="445" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="455" cy="445" r="2" fill={colors.text} />
              </g>

              {/* G. EXPANSION chamber */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_expansion' || selectedPartId === 'part_expansion' ? 1 : 0.7}>
                <text x="560" y="325" fill={colors.text} textAnchor="start">G. Expansion chamber</text>
                <line x1="555" y1="322" x2="460" y2="310" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="460" cy="310" r="2" fill={colors.text} />
              </g>

              {/* H. AIR TO FAN */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_air_to_fan' || selectedPartId === 'part_air_to_fan' ? 1 : 0.7}>
                <text x="540" y="270" fill={colors.text} textAnchor="start">H. Air to fan</text>
                <line x1="535" y1="267" x2="465" y2="282" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="465" cy="282" r="2" fill={colors.text} />
              </g>

              {/* J. FAN EYE */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_fan_eye' || selectedPartId === 'part_fan_eye' ? 1 : 0.7}>
                <text x="510" y="375" fill={colors.text} textAnchor="start">J. Fan eye</text>
                <line x1="505" y1="372" x2="440" y2="320" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="440" cy="320" r="2" fill={colors.text} />
              </g>

              {/* K. IMPURITY DISCHARGE */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_impurity_discharge' || selectedPartId === 'part_impurity_discharge' ? 1 : 0.7}>
                <text x="495" y="525" fill="#ef4444" textAnchor="start" className="font-bold">K. Impurity discharge</text>
                <line x1="490" y1="522" x2="445" y2="480" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="445" cy="480" r="2" fill={colors.text} />
              </g>

              {/* L. CLEAN AIR FROM FAN */}
              <g className="transition-opacity duration-200" opacity={hoveredPartId === 'part_clean_air_fan' || selectedPartId === 'part_clean_air_fan' ? 1 : 0.7}>
                <text x="350" y="405" fill={colors.text} textAnchor="start">L. Clean air from fan</text>
                <line x1="345" y1="402" x2="335" y2="400" stroke={colors.text} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="335" cy="400" r="2" fill={colors.text} />
              </g>
            </g>
          )}
        </svg>

        {/* COMPONENT DESCRIPTIVE CONTROLS CAPTURING */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 align-end text-right">
          <div className="bg-slate-950/80 text-[9px] text-[#38bdf8] font-mono px-2 py-1 rounded border border-slate-700">
            AIR SPEED: {state.speed === 'paused' ? '0 m/s' : state.speed === 'slow' ? '4.5 m/s' : '12.5 m/s'}
          </div>
          <button 
            onClick={() => setIsMaizeLabel(!isMaizeLabel)}
            className="pointer-events-auto bg-slate-800 hover:bg-slate-700 text-white text-[9px] px-2 py-1 rounded font-mono transition-all border border-slate-600 self-end cursor-pointer"
          >
            SWITCH CROP: {isMaizeLabel ? 'MAIZE / CORN' : 'WHEAT / OATS'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes airflow-run {
          to { stroke-dashoffset: -120; }
        }

        /* Particle motion path keys */
        @keyframes flow-hopper-sift {
          0% { cx: 232px; cy: 145px; opacity: 1; }
          100% { cx: 235px; cy: 228px; opacity: 0; }
        }
        @keyframes flow-hopper-sift-2 {
          0% { cx: 244px; cy: 145px; opacity: 1; }
          100% { cx: 241px; cy: 228px; opacity: 0; }
        }

        @keyframes flow-feeder-slide {
          0% { cx: 200px; cy: 247px; opacity: 1; }
          100% { cx: 248px; cy: 268px; opacity: 1; }
        }
        @keyframes flow-feeder-slide-2 {
          0% { cx: 215px; cy: 251px; opacity: 1; }
          100% { cx: 253px; cy: 270px; opacity: 1; }
        }

        @keyframes flow-grain-fall-leg-1 {
          0% { cx: 255px; cy: 271px; opacity: 1; }
          40% { cx: 280px; cy: 300px; opacity: 1; }
          80% { cx: 274px; cy: 400px; opacity: 1; }
          100% { cx: 290px; cy: 460px; opacity: 1; }
        }
        @keyframes flow-grain-fall-leg-2 {
          0% { cx: 258px; cy: 273px; opacity: 1; }
          30% { cx: 274px; cy: 298px; opacity: 1; }
          70% { cx: 278px; cy: 370px; opacity: 1; }
          100% { cx: 285px; cy: 460px; opacity: 1; }
        }
        @keyframes flow-grain-fall-leg-3 {
          0% { cx: 253px; cy: 270px; opacity: 1; }
          35% { cx: 285px; cy: 310px; opacity: 1; }
          75% { cx: 273px; cy: 390px; opacity: 1; }
          100% { cx: 295px; cy: 460px; opacity: 1; }
        }
        @keyframes flow-grain-fall-leg-4 {
          0% { cx: 254px; cy: 272px; opacity: 1; }
          45% { cx: 275px; cy: 330px; opacity: 1; }
          100% { cx: 282px; cy: 460px; opacity: 1; }
        }

        @keyframes flow-clean-output-1 {
          0% { cx: 288px; cy: 462px; opacity: 1; }
          100% { cx: 315px; cy: 512px; opacity: 0; }
        }
        @keyframes flow-clean-output-2 {
          0% { cx: 282px; cy: 464px; opacity: 1; }
          100% { cx: 305px; cy: 512px; opacity: 0; }
        }
        @keyframes flow-clean-output-3 {
          0% { cx: 293px; cy: 461px; opacity: 1; }
          100% { cx: 322px; cy: 512px; opacity: 0; }
        }

        /* Impurity Lift dynamic curves */
        @keyframes flow-impurity-lift-1 {
          0% { cx: 254px; cy: 272px; opacity: 1; }
          30% { cx: 280px; cy: 250px; opacity: 1; }
          60% { cx: 280px; cy: 190px; opacity: 1; }
          100% { cx: 345px; cy: 105px; opacity: 1; }
        }
        @keyframes flow-impurity-lift-2 {
          0% { cx: 258px; cy: 273px; opacity: 1; }
          25% { cx: 290px; cy: 250px; opacity: 1; }
          55% { cx: 295px; cy: 185px; opacity: 1; }
          100% { cx: 360px; cy: 98px; opacity: 1; }
        }
        @keyframes flow-impurity-lift-3 {
          0% { cx: 253px; cy: 270px; opacity: 1; }
          35% { cx: 285px; cy: 245px; opacity: 1; }
          65% { cx: 275px; cy: 170px; opacity: 1; }
          100% { cx: 350px; cy: 102px; opacity: 1; }
        }

        @keyframes flow-impurity-precipitate-1 {
          0% { cx: 345px; cy: 105px; opacity: 1; }
          30% { cx: 435px; cy: 112px; opacity: 1; }
          60% { cx: 460px; cy: 175px; opacity: 1; }
          100% { cx: 434px; cy: 410px; opacity: 1; }
        }
        @keyframes flow-impurity-precipitate-2 {
          0% { cx: 360px; cy: 98px; opacity: 1; }
          30% { cx: 442px; cy: 108px; opacity: 1; }
          65% { cx: 465px; cy: 188px; opacity: 1; }
          100% { cx: 442px; cy: 410px; opacity: 1; }
        }
        @keyframes flow-impurity-precipitate-3 {
          0% { cx: 350px; cy: 102px; opacity: 1; }
          25% { cx: 428px; cy: 114px; opacity: 1; }
          55% { cx: 452px; cy: 180px; opacity: 1; }
          100% { cx: 426px; cy: 410px; opacity: 1; }
        }

        @keyframes flow-impurity-discharge-1 {
          0% { cx: 432px; cy: 445px; opacity: 1; }
          100% { cx: 438px; cy: 495px; opacity: 0; }
        }
        @keyframes flow-impurity-discharge-2 {
          0% { cx: 428px; cy: 455px; opacity: 1; }
          100% { cx: 422px; cy: 495px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
