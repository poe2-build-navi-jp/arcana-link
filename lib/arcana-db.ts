import { env } from 'cloudflare:workers';
import {
  normalizeInventory,
  type ExchangeProfile,
  type InventoryCounts,
} from '@/lib/arcana-profile';
import { type SiteLocale } from '@/lib/site-i18n';
import { type ExchangeStatus } from '@/lib/v2-i18n';
import {
  normalizeServerRegion,
  serverDatabaseValues,
  type ServerRegion,
} from '@/lib/server-region';

type ProfileRow = {
  public_id: string;
  display_name: string;
  uid: string;
  server: string;
  note: string;
  status: ExchangeStatus;
  locale: SiteLocale;
  inventory_json: string;
  updated_at: string;
};

function database() {
  return (env as unknown as { DB?: D1Database }).DB;
}

async function profileKey(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function rowToProfile(row: ProfileRow): ExchangeProfile | null {
  const inventory = normalizeInventory(JSON.parse(row.inventory_json));
  const server = normalizeServerRegion(row.server);
  if (!inventory || !server) return null;
  return {
    publicId: row.public_id,
    displayName: row.display_name,
    uid: row.uid,
    server,
    note: row.note,
    status: row.status,
    locale: row.locale,
    inventory,
    updatedAt: row.updated_at,
  };
}

export async function readProfiles(server?: ServerRegion) {
  const db = database();
  if (!db) return null;
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const statement = server
    ? (() => {
        const [currentValue, legacyValue] = serverDatabaseValues(server);
        return db
          .prepare(
            `SELECT public_id, display_name, uid, server, note, status, locale, inventory_json, updated_at
           FROM exchange_profiles
           WHERE server IN (?, ?) AND status != 'closed' AND updated_at >= ?
           ORDER BY updated_at DESC
           LIMIT 100`,
          )
          .bind(currentValue, legacyValue, cutoff);
      })()
    : db
        .prepare(
          `SELECT public_id, display_name, uid, server, note, status, locale, inventory_json, updated_at
           FROM exchange_profiles
           WHERE status != 'closed' AND updated_at >= ?
           ORDER BY updated_at DESC
           LIMIT 100`,
        )
        .bind(cutoff);
  const result = await statement.all<ProfileRow>();
  return result.results
    .map(rowToProfile)
    .filter((profile): profile is ExchangeProfile => Boolean(profile));
}

export async function saveProfile(input: {
  token: string;
  displayName: string;
  uid: string;
  server: ServerRegion;
  note: string;
  status: ExchangeStatus;
  locale: SiteLocale;
  inventory: InventoryCounts;
}) {
  const db = database();
  if (!db) return null;
  const key = await profileKey(input.token);
  const publicId = key.slice(0, 20);
  const updatedAt = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO exchange_profiles
       (profile_key, public_id, display_name, uid, server, note, status, locale, inventory_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(profile_key) DO UPDATE SET
         display_name = excluded.display_name,
         uid = excluded.uid,
         server = excluded.server,
         note = excluded.note,
         status = excluded.status,
         locale = excluded.locale,
         inventory_json = excluded.inventory_json,
         updated_at = excluded.updated_at`,
    )
    .bind(
      key,
      publicId,
      input.displayName,
      input.uid,
      input.server,
      input.note,
      input.status,
      input.locale,
      JSON.stringify(input.inventory),
      updatedAt,
    )
    .run();
  return { publicId, updatedAt };
}

export async function saveReport(input: {
  token: string;
  targetPublicId: string;
  reason: string;
}) {
  const db = database();
  if (!db) return null;
  const reporterKey = await profileKey(input.token);
  await db
    .prepare(
      `INSERT INTO exchange_reports
       (id, reporter_key, target_public_id, reason, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(
      crypto.randomUUID(),
      reporterKey,
      input.targetPublicId,
      input.reason,
      new Date().toISOString(),
    )
    .run();
  return true;
}
