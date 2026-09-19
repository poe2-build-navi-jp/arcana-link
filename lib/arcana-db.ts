import { env } from 'cloudflare:workers';
import {
  normalizeInventory,
  type ExchangeProfile,
  type InventoryCounts,
} from '@/lib/arcana-profile';
import { arcanaIds, type ArcanaId, type SiteLocale } from '@/lib/site-i18n';
import { type ExchangeStatus } from '@/lib/v2-i18n';
import {
  normalizeServerRegion,
  serverDatabaseValues,
  serverRegions,
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

export type ExchangePairInsight = {
  server: ServerRegion;
  want: ArcanaId;
  offer: ArcanaId;
  matches: number;
};

export type ExchangeSummary = {
  open: number;
  recent: number;
  servers: Record<ServerRegion, number>;
  updatedAt: string | null;
  generatedAt: string;
  popularPairs: ExchangePairInsight[];
};

export async function readExchangeSummary(): Promise<ExchangeSummary | null> {
  const db = database();
  if (!db) return null;
  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString();
  const recent = new Date(Date.now() - 86400000).toISOString();
  try {
    const summary = await db.prepare(`SELECT server,
      COUNT(*) AS open_count,
      SUM(CASE WHEN updated_at >= ? THEN 1 ELSE 0 END) AS recent_count,
      MAX(updated_at) AS updated
      FROM exchange_profiles
      WHERE status = 'open' AND updated_at >= ?
      GROUP BY server`)
      .bind(recent, cutoff)
      .all<{server:string;open_count:number;recent_count:number;updated:string}>();
    const pairRows = await db.prepare(`SELECT server, inventory_json
      FROM exchange_profiles
      WHERE status = 'open' AND updated_at >= ? AND json_valid(inventory_json)
      ORDER BY updated_at DESC`)
      .bind(cutoff)
      .all<{server:string;inventory_json:string}>();

    const servers = Object.fromEntries(serverRegions.map(server => [server, 0])) as Record<ServerRegion, number>;
    let open = 0;
    let recentCount = 0;
    let updatedAt: string | null = null;
    for (const row of summary.results) {
      const server = normalizeServerRegion(row.server);
      if (!server) continue;
      servers[server] += row.open_count;
      open += row.open_count;
      recentCount += row.recent_count;
      if (!updatedAt || row.updated > updatedAt) updatedAt = row.updated;
    }

    const conditions = new Map<string, number>();
    for (const row of pairRows.results) {
      const server = normalizeServerRegion(row.server);
      const inventory = normalizeInventory(JSON.parse(row.inventory_json));
      if (!server || !inventory) continue;
      const wants = arcanaIds.filter(card => inventory[card] === 0);
      const offers = arcanaIds.filter(card => inventory[card] >= 2);
      for (const want of wants) for (const offer of offers) {
        const key = `${server}|${want}|${offer}`;
        conditions.set(key, (conditions.get(key) ?? 0) + 1);
      }
    }
    const popularPairs: ExchangePairInsight[] = [];
    for (const server of serverRegions) {
      for (let left = 0; left < arcanaIds.length; left += 1) {
        for (let right = left + 1; right < arcanaIds.length; right += 1) {
          const want = arcanaIds[left];
          const offer = arcanaIds[right];
          const matches = Math.min(
            conditions.get(`${server}|${want}|${offer}`) ?? 0,
            conditions.get(`${server}|${offer}|${want}`) ?? 0,
          );
          if (matches > 0) popularPairs.push({ server, want, offer, matches });
        }
      }
    }
    popularPairs.sort((a, b) => b.matches - a.matches);
    return {
      open,
      recent: recentCount,
      servers,
      updatedAt,
      generatedAt: new Date().toISOString(),
      popularPairs: popularPairs.slice(0, 5),
    };
  } catch { return null; }
}

export async function readCardStats(card: ArcanaId) {
  const db = database();
  if (!db) return null;
  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString();
  const recent = new Date(Date.now() - 86400000).toISOString();
  const path = '$.' + JSON.stringify(card);
  try {
    const result = await db.prepare(`SELECT server,
      SUM(CASE WHEN json_extract(inventory_json, ?) = 0 THEN 1 ELSE 0 END) AS wanting,
      SUM(CASE WHEN json_extract(inventory_json, ?) >= 2 THEN 1 ELSE 0 END) AS offering,
      SUM(CASE WHEN updated_at >= ? THEN 1 ELSE 0 END) AS recent,
      MAX(updated_at) AS updated
      FROM exchange_profiles WHERE status = 'open' AND updated_at >= ?
      AND json_valid(inventory_json)
      AND (json_extract(inventory_json, ?) = 0 OR json_extract(inventory_json, ?) >= 2)
      GROUP BY server`).bind(path, path, recent, cutoff, path, path).all<{server:string;wanting:number;offering:number;recent:number;updated:string}>();
    return result.results.map(row => ({...row, server:normalizeServerRegion(row.server)})).filter(row=>row.server !== null);
  } catch { return null; }
}

// Shared pages intentionally omit UID, display name, private edit token and note.
export async function readSharedProfile(id: string) {
  const db = database();
  if (!db || !/^[a-f0-9]{20}$/.test(id)) return null;
  const row = await db.prepare('SELECT server, status, inventory_json, updated_at FROM exchange_profiles WHERE public_id = ?')
    .bind(id).first<{server:string;status:ExchangeStatus;inventory_json:string;updated_at:string}>();
  if (!row) return null;
  const server = normalizeServerRegion(row.server);
  const inventory = normalizeInventory(JSON.parse(row.inventory_json));
  if (!server || !inventory) return null;
  return {server,inventory,status:row.status,updatedAt:row.updated_at,expired:Date.now()-Date.parse(row.updated_at)>7*86400000};
}

async function profileKey(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function saveContact(token:string,category:string,message:string) {
  const db=database();if(!db)return null;
  const reporter=await profileKey(token);
  const cutoff=new Date(Date.now()-3600000).toISOString();
  const id=crypto.randomUUID();
  const result=await db.prepare(`INSERT INTO exchange_reports (id,reporter_key,target_public_id,reason,created_at)
    SELECT ?,?,'site-feedback',?,? WHERE (SELECT COUNT(*) FROM exchange_reports WHERE target_public_id='site-feedback' AND reporter_key=? AND created_at>=?) < 3`)
    .bind(id,reporter,JSON.stringify({category,message}),new Date().toISOString(),reporter,cutoff).run();
  return result.meta.changes ? id : 'limited';
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
