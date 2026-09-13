import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const exchangeProfiles = sqliteTable(
  'exchange_profiles',
  {
    profileKey: text('profile_key').primaryKey(),
    publicId: text('public_id').notNull().unique(),
    displayName: text('display_name').notNull(),
    uid: text('uid').notNull(),
    server: text('server').notNull(),
    note: text('note').notNull().default(''),
    status: text('status').notNull().default('open'),
    locale: text('locale').notNull().default('ja'),
    inventoryJson: text('inventory_json').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_exchange_profiles_server_status_updated').on(
      table.server,
      table.status,
      table.updatedAt,
    ),
  ],
);

export const exchangeReports = sqliteTable(
  'exchange_reports',
  {
    id: text('id').primaryKey(),
    reporterKey: text('reporter_key').notNull(),
    targetPublicId: text('target_public_id').notNull(),
    reason: text('reason').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('idx_exchange_reports_target_created').on(
      table.targetPublicId,
      table.createdAt,
    ),
  ],
);
