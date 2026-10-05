export const prerender = false;
import type { APIRoute } from 'astro';
import { setPortalState } from '../../lib/portalState';

export const GET: APIRoute = async ({ request, url }) => {
  const origin = url.origin || 'https://www.paulchen.at';
  const battery = request.headers.get('battery-voltage') || request.headers.get('Battery-Level');
  
  await setPortalState({
    lastDeviceSync: new Date().toISOString(),
    ...(battery ? { batteryLevel: battery } : {})
  });

  return new Response(JSON.stringify({
    status: 0,
    image_url: `${origin}/api/portal/screen?t=${Date.now()}`,
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
