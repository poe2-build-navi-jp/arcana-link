import { type SiteLocale } from '@/lib/site-i18n';

export const serverRegions = ['asia', 'america', 'europe', 'tw_hk_mo'] as const;

export type ServerRegion = (typeof serverRegions)[number];

export const serverLabels: Record<SiteLocale, Record<ServerRegion, string>> = {
  ja: {
    asia: 'アジア',
    america: 'アメリカ',
    europe: 'ヨーロッパ',
    tw_hk_mo: 'TW・HK・MO',
  },
  en: {
    asia: 'Asia',
    america: 'America',
    europe: 'Europe',
    tw_hk_mo: 'TW / HK / MO',
  },
  'zh-cn': {
    asia: '亚洲',
    america: '美洲',
    europe: '欧洲',
    tw_hk_mo: 'TW / HK / MO',
  },
};

const legacyServerValues: Record<ServerRegion, string> = {
  asia: 'Asia',
  america: 'America',
  europe: 'Europe',
  tw_hk_mo: 'TW, HK, MO',
};

export function normalizeServerRegion(value: unknown): ServerRegion | null {
  if (typeof value !== 'string') return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[・,/\s]+/g, '_');
  const aliases: Record<string, ServerRegion> = {
    asia: 'asia',
    america: 'america',
    europe: 'europe',
    tw_hk_mo: 'tw_hk_mo',
  };
  return aliases[normalized] ?? null;
}

export function serverDatabaseValues(server: ServerRegion) {
  return [server, legacyServerValues[server]] as const;
}
