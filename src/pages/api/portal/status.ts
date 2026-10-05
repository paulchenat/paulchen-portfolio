// src/pages/api/portal/status.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { getPortalState, setPortalState, PORTAL_SECRET } from '../../../lib/portalState';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-portal-token');
  const state = url.searchParams.get('state') as 'home' | 'away' | 'custom' | null;

  if (token !== PORTAL_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (state && ['home', 'away', 'custom'].includes(state)) {
    const updated = await setPortalState({ mode: state });
    return new Response(JSON.stringify({ success: true, state: updated }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const current = await getPortalState();
  return new Response(JSON.stringify(current), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-portal-token');

  if (token !== PORTAL_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const updated = await setPortalState(body);

  return new Response(JSON.stringify({ success: true, state: updated }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
