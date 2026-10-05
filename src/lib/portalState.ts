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

let inMemoryState: PortalState = {
  mode: 'home',
  updatedAt: new Date().toISOString(),
  homeImage: '/images/portal/home-default.png',
  awayImage: '/images/portal/away-default.png',
  customText: 'Willkommen zu Hause, Paul.',
  canvasData: ''
};

const env = import.meta.env as Record<string, string | undefined>;
const KV_REST_API_URL = env.KV_REST_API_URL;
const KV_REST_API_TOKEN = env.KV_REST_API_TOKEN;
export const PORTAL_SECRET = env.PORTAL_SECRET || 'paulchen-secret-2026';

export async function getPortalState(): Promise<PortalState> {
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const res = await fetch(`${KV_REST_API_URL}/get/portal_state`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
      });
      const data = await res.json();
      if (data && data.result) return JSON.parse(data.result);
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
}  inMemoryState = updated;
  return updated;
}
