// src/lib/portalState.ts

export interface PortalState {
  mode: 'home' | 'away' | 'custom';
  updatedAt: string;
  lastDeviceSync?: string;
  batteryLevel?: string;
  homeImage?: string;
  awayImage?: string;
  customText?: string;
  canvasData?: string;
}

// Globaler In-Memory Speicher (während der Server läuft)
let inMemoryState: PortalState = {
  mode: 'home',
  updatedAt: new Date().toISOString(),
  homeImage: '/images/portal/home-default.png',
  awayImage: '/images/portal/away-default.png',
  customText: 'Willkommen zu Hause, Paul.',
  canvasData: ''
};

// Falls du Upstash Redis / Vercel KV in deinen Vercel Env Vars hast:
const KV_REST_API_URL = import.meta.env.KV_REST_API_URL || process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = import.meta.env.KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;
export const PORTAL_SECRET = import.meta.env.PORTAL_SECRET || process.env.PORTAL_SECRET || 'paulchen-secret-2026';

export async function getPortalState(): Promise<PortalState> {
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const res = await fetch(`${KV_REST_API_URL}/get/portal_state`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
      });
      const data = await res.json();
      if (data.result) return JSON.parse(data.result);
    } catch (e) {
      console.error('KV Read Error:', e);
    }
  }
  return inMemoryState;
}

export async function setPortalState(partial: Partial<PortalState>): Promise<PortalState> {
  const current = await getPortalState();
  const updated: PortalState = {
    ...current,
    ...partial,
    updatedAt: new Date().toISOString()
  };

  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      await fetch(`${KV_REST_API_URL}/set/portal_state`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error('KV Write Error:', e);
    }
  }

  inMemoryState = updated;
  return updated;
}
