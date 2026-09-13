CREATE TABLE `exchange_profiles` (
	`profile_key` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`display_name` text NOT NULL,
	`uid` text NOT NULL,
	`server` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`locale` text DEFAULT 'ja' NOT NULL,
	`inventory_json` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exchange_profiles_public_id_unique` ON `exchange_profiles` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_exchange_profiles_server_status_updated` ON `exchange_profiles` (`server`,`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `exchange_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reporter_key` text NOT NULL,
	`target_public_id` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_exchange_reports_target_created` ON `exchange_reports` (`target_public_id`,`created_at`);