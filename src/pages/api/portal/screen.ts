// src/pages/api/portal/screen.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { getPortalState } from '../../../lib/portalState';

export const GET: APIRoute = async () => {
  const state = await getPortalState();
  const isHome = state.mode === 'home';
  const timestamp = new Date().toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });

  // 800x600 E-Ink optimiertes Schwarz-Weiß SVG
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" style="background:#ffffff;">
    <style>
      .mono { font-family: "Courier New", monospace; }
      .sans { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; }
      .bold { font-weight: bold; }
    </style>

    <!-- Header Frame -->
    <rect x="20" y="20" width="760" height="560" fill="none" stroke="#000000" stroke-width="4" />
    
    <text x="50" y="70" class="sans bold" font-size="28" fill="#000000">paulchen.at — PORTAL</text>
    <text x="750" y="70" class="mono" font-size="20" text-anchor="end" fill="#000000">${timestamp}</text>
    <line x1="20" y1="95" x2="780" y2="95" stroke="#000000" stroke-width="2" />

    <!-- Center Content basierend auf Mode -->
    ${isHome ? `
      <!-- HOME STATE -->
      <circle cx="400" cy="260" r="90" fill="#000000" />
      <text x="400" y="280" class="sans bold" font-size="50" fill="#ffffff" text-anchor="middle">AT HOME</text>
      <text x="400" y="420" class="sans" font-size="24" text-anchor="middle" fill="#000000">${state.customText || 'Paul ist im Studio / zu Hause'}</text>
      <text x="400" y="460" class="mono" font-size="16" text-anchor="middle" fill="#666666">Status: AKTIV • GEOLOCATION VERBUNDEN</text>
    ` : `
      <!-- AWAY STATE -->
      <rect x="260" y="190" width="280" height="140" fill="none" stroke="#000000" stroke-width="3" stroke-dasharray="12,8" />
      <text x="400" y="275" class="sans bold" font-size="44" fill="#000000" text-anchor="middle">ON TOUR</text>
      <text x="400" y="420" class="sans" font-size="24" text-anchor="middle" fill="#000000">Derzeit unterwegs / Außer Haus</text>
      <text x="400" y="460" class="mono" font-size="16" text-anchor="middle" fill="#666666">Status: STANDBY • BILDERRAHMEN MODUS</text>
    `}

    <!-- Footer Meta -->
    <line x1="20" y1="520" x2="780" y2="520" stroke="#000000" stroke-width="2" />
    <text x="50" y="555" class="mono" font-size="14" fill="#000000">MODE: ${state.mode.toUpperCase()}</text>
    <text x="750" y="555" class="mono" font-size="14" text-anchor="end" fill="#000000">TRMNL BYOD v1.0</text>
  </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};
