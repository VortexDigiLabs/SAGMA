/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeType = 'textbook' | 'blueprint' | 'monochrome' | 'dark-industry';

export interface MechanicalPart {
  id: string;
  name: string;
  description: string;
  originalLabel: string;
  role: 'structure' | 'moving' | 'separator' | 'sensor' | 'inlet' | 'outlet';
}

export interface FlowState {
  showGrain: boolean;
  showAir: boolean;
  showWaste: boolean;
  speed: 'paused' | 'slow' | 'normal' | 'fast';
  showLabels: boolean;
  showFidelityOverlay: boolean;
  zoom: number;
  panX: number;
  panY: number;
}
