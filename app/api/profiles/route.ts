import { NextRequest, NextResponse } from 'next/server';
import { normalizeInventory } from '@/lib/arcana-profile';
import { readExchangeSummary, readProfiles, saveProfile } from '@/lib/arcana-db';
import { siteLocales, type SiteLocale } from '@/lib/site-i18n';
import { type ExchangeStatus } from '@/lib/v2-i18n';
import { normalizeServerRegion, type ServerRegion } from '@/lib/server-region';

const statuses = new Set<ExchangeStatus>(['open', 'negotiating', 'closed']);

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('summary') === '1') {
    const summary = await readExchangeSummary();
    if (!summary) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
    return NextResponse.json({
      open: summary.open_count || 0,
      recent: summary.recent_count || 0,
      asia: summary.asia_count || 0,
      updatedAt: summary.updated,
    }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  }
  const server = normalizeServerRegion(
    request.nextUrl.searchParams.get('server'),
  );
  if (!server) {
    return NextResponse.json({ error: 'server_required' }, { status: 400 });
  }
  const profiles = await readProfiles(server);
  if (!profiles) {
    return NextResponse.json(
      { profiles: [], mode: 'local' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  return NextResponse.json(
    { profiles, mode: 'shared' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function PUT(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    displayName?: string;
    uid?: string;
    server?: ServerRegion;
    note?: string;
    status?: ExchangeStatus;
    locale?: SiteLocale;
    inventory?: unknown;
  } | null;
  const inventory = normalizeInventory(body?.inventory);
  if (
    !body ||
    !body.token ||
    body.token.length < 32 ||
    body.token.length > 160 ||
    !body.displayName ||
    body.displayName.trim().length > 30 ||
    !body.uid ||
    !/^\d{9,10}$/.test(body.uid) ||
    !body.server ||
    !normalizeServerRegion(body.server) ||
    !body.status ||
    !statuses.has(body.status) ||
    !body.locale ||
    !siteLocales.includes(body.locale) ||
    (body.note || '').length > 160 ||
    !inventory
  ) {
    return NextResponse.json({ error: 'invalid_profile' }, { status: 400 });
  }
  const result = await saveProfile({
    token: body.token,
    displayName: body.displayName.trim(),
    uid: body.uid,
    server: normalizeServerRegion(body.server)!,
    note: (body.note || '').trim(),
    status: body.status,
    locale: body.locale,
    inventory,
  });
  if (!result) {
    return NextResponse.json({ mode: 'local' }, { status: 503 });
  }
  return NextResponse.json({ ...result, mode: 'shared' });
}
