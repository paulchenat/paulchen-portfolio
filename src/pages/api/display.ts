export const prerender = false;
import type { APIRoute } from 'astro';
import { getPortalState, setPortalState } from '../../lib/portalState';

// Lädt die hochgeladenen Bilder und Intervalle aus Keystatic
const portalFiles = import.meta.glob('/src/content/singletons/portal.json', { eager: true });
const portalMod: any = Object.values(portalFiles)[0] || {};
const portalData = portalMod?.default || portalMod || {};

// Berechnet die genaue Schlafdauer für den Kindle in Sekunden (basierend auf Wiener Zeit)
function calculateRefreshRateSeconds(portal: any): number {
  const now = new Date();
  
  // Exakte Zeit & Wochentag in Österreich (Europe/Vienna) ermitteln
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Vienna',
    weekday: 'short', // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    hour: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const weekday = parts.find(p => p.type === 'weekday')?.value || 'Mon';
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  const isActiveHours = hour >= 8 && hour < 18; // 08:00 bis 17:59:59 Uhr

  let intervalMinutes = 15;

  if (!isWeekend) {
    // Wochentag (Mo–Fr)
    intervalMinutes = isActiveHours
      ? (Number(portal?.weekdayActiveMinutes) || 15)
      : (Number(portal?.weekdayIdleMinutes) || 240);
  } else {
    // Wochenende (Sa–So)
    intervalMinutes = isActiveHours
      ? (Number(portal?.weekendActiveMinutes) || 60)
      : (Number(portal?.weekendIdleMinutes) || 240);
  }

  // Rückgabe in Sekunden (mindestens 60s)
  return Math.max(60, intervalMinutes * 60);
}

export const GET: APIRoute = async ({ request }) => {
  // Immer echte Domain erzwingen (kein localhost auf Vercel)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.paulchen.at';
  const origin = host.includes('localhost') ? 'https://www.paulchen.at' : `https://${host}`;

  const state = await getPortalState();
  const battery = request.headers.get('battery-voltage') || request.headers.get('Battery-Level');
  
  await setPortalState({
    lastDeviceSync: new Date().toISOString(),
    ...(battery ? { batteryLevel: battery } : {})
  });

  // Wählt das passende Bild aus
  let finalImageUrl = `${origin}/api/portal/screen?t=${Date.now()}`;

  if (state.mode === 'home' && portalData.homeImage) {
    finalImageUrl = `${origin}${portalData.homeImage.startsWith('/') ? '' : '/'}${portalData.homeImage}`;
  } else if (state.mode === 'away' && portalData.awayImage) {
    finalImageUrl = `${origin}${portalData.awayImage.startsWith('/') ? '' : '/'}${portalData.awayImage}`;
  }

  // Berechne die dynamische Schlafdauer
  const refreshSeconds = calculateRefreshRateSeconds(portalData);

  return new Response(JSON.stringify({
    status: 0,
    image_url: finalImageUrl,
    filename: `screen-${Date.now()}.png`,
    refresh_rate: refreshSeconds,
    reset_firmware: false,
    update_firmware: false
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};
