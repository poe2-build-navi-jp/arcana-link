// Shared by the detailed editor, quick setup and standalone exchange table.
export const inventoryStorageKeys = {
  inventory: 'arcana-link-v2-inventory',
  reviewed: 'arcana-link-v2-reviewed',
  server: 'arcana_server',
  quickDraft: 'arcana-link-v2-quick-draft',
};

export function readStoredJson(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
}
