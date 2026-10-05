// src/pages/api/display.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { getPortalState, setPortalState } from '../../lib/portalState';

// Lädt die hochgeladenen Bilder aus Keystatic
const portalFiles = import.meta.glob('/src/content/singletons/portal.json', { eager: true });
const portalMod: any = Object.values(portalFiles)[0] || {};
const portalData = portalMod?.default || portalMod || {};

export const GET: APIRoute = async ({ request }) => {
  // Immer deine echte Domain erzwingen (verhindert localhost-Fehler auf Vercel)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.paulchen.at';
  const origin = host.includes('localhost') ? 'https://www.paulchen.at' : `https://${host}`;

  const state = await getPortalState();
  const battery = request.headers.get('battery-voltage') || request.headers.get('Battery-Level');
  
  await setPortalState({
    lastDeviceSync: new Date().toISOString(),
    ...(battery ? { batteryLevel: battery } : {})
  });

  // Wählt das in Keystatic hochgeladene Bild aus (oder Standard-Screen als Fallback)
  let finalImageUrl = `${origin}/api/portal/screen?t=${Date.now()}`;

  if (state.mode === 'home' && portalData.homeImage) {
    finalImageUrl = `${origin}${portalData.homeImage.startsWith('/') ? '' : '/'}${portalData.homeImage}`;
  } else if (state.mode === 'away' && portalData.awayImage) {
    finalImageUrl = `${origin}${portalData.awayImage.startsWith('/') ? '' : '/'}${portalData.awayImage}`;
  }

  return new Response(JSON.stringify({
    status: 0,
    image_url: finalImageUrl,
    filename: `screen-${Date.now()}.png`,
    refresh_rate: 1800,
    reset_firmware: false,
    update_firmware: false
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};
