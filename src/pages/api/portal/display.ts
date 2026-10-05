// src/pages/api/portal/display.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { getPortalState, setPortalState } from '../../../lib/portalState';

export const GET: APIRoute = async ({ request, url }) => {
  const origin = url.origin || 'https://www.paulchen.at';
  
  // Batterie / Device Info aus Headern auslesen (falls TRMNL mitsendet)
  const battery = request.headers.get('battery-voltage') || request.headers.get('Battery-Level');
  
  await setPortalState({
    lastDeviceSync: new Date().toISOString(),
    ...(battery ? { batteryLevel: battery } : {})
  });

  // Liefert das TRMNL-kompatible JSON
  return new Response(JSON.stringify({
    status: 0,
    image_url: `${origin}/api/portal/screen?t=${Date.now()}`,
    filename: `screen-${Date.now()}.png`,
    refresh_rate: 900, // 15 Minuten
    reset_firmware: false,
    update_firmware: false
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};
