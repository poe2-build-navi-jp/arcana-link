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
  'zh-tw': {
    asia: '亞洲',
    america: '美洲',
    europe: '歐洲',
    tw_hk_mo: '台港澳',
  },
  ko: {
    asia: '아시아',
    america: '아메리카',
    europe: '유럽',
    tw_hk_mo: '대만·홍콩·마카오',
  },
  es: {
    asia: 'Asia',
    america: 'América',
    europe: 'Europa',
    tw_hk_mo: 'TW / HK / MO',
  },
  'pt-br': {
    asia: 'Ásia',
    america: 'América',
    europe: 'Europa',
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
