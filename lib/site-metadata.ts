import type { Metadata } from 'next';
import {
  localizedPages,
  type PublicPageKey,
  type TranslatedLocale,
} from '@/lib/localized-pages';
import {
  languageAlternates,
  localizedPath,
  type SiteLocale,
} from '@/lib/site-i18n';

const indexedLocales = new Set<SiteLocale>(['ja', 'en', 'zh-cn']);

const homeMetadata = {
  ja: {
    title:
      '原神 アルカナ交換・募集｜同じサーバーの交換相手を自動マッチング｜ARCANA LINK',
    description:
      '原神「月諭のアルカナ」の交換相手を探せる無料マッチングサイト。欲しいアルカナと余っているアルカナを登録すると、Asia・America・Europe・TW/HK/MOの同じサーバーから条件の合う相手を探せます。',
    ogLocale: 'ja_JP',
  },
  en: {
    title: 'Genshin Impact Lunar Arcana Trade Finder | ARCANA LINK',
    description:
      'Find Genshin Impact Lunar Arcana trading partners on your server. Match your missing Arcana with compatible players in Asia, America, Europe, or TW/HK/MO.',
    ogLocale: 'en_US',
  },
  'zh-cn': {
    title: '原神月谕圣牌交换匹配｜同服务器自动寻找交换伙伴｜ARCANA LINK',
    description:
      '免费寻找原神月谕圣牌交换伙伴。登记缺少和重复的圣牌后，仅从亚洲、美洲、欧洲或TW/HK/MO的同一服务器玩家中自动匹配。',
    ogLocale: 'zh_CN',
  },
  'zh-tw': {
    title: '原神月諭聖牌交換｜同伺服器自動配對｜ARCANA LINK',
    description: '登記22種月諭聖牌，自動尋找同伺服器且交換條件相符的玩家。',
    ogLocale: 'zh_TW',
  },
  ko: {
    title: '원신 월의 아르카나 교환·자동 매칭 | ARCANA LINK',
    description:
      '22종 카드 현황을 등록하고 같은 서버에서 조건이 맞는 플레이어를 찾으세요.',
    ogLocale: 'ko_KR',
  },
  es: {
    title: 'Intercambio de Arcanos Lunares de Genshin Impact | ARCANA LINK',
    description:
      'Registra las 22 cartas y encuentra intercambios compatibles en tu servidor.',
    ogLocale: 'es_ES',
  },
  'pt-br': {
    title: 'Troca de Arcanos Lunares de Genshin Impact | ARCANA LINK',
    description:
      'Cadastre as 22 cartas e encontre trocas compatíveis no seu servidor.',
    ogLocale: 'pt_BR',
  },
} as const;

const alternateOgLocales = Object.fromEntries(
  Object.entries(homeMetadata).map(([locale]) => [
    locale,
    Object.entries(homeMetadata)
      .filter(([candidate]) => candidate !== locale)
      .map(([, copy]) => copy.ogLocale),
  ]),
) as Record<SiteLocale, string[]>;

export function buildHomeMetadata(locale: SiteLocale): Metadata {
  const copy = homeMetadata[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: localizedPath(locale),
      languages: languageAlternates(),
    },
    robots: { index: indexedLocales.has(locale), follow: true },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      url: localizedPath(locale),
      locale: copy.ogLocale,
      alternateLocale: alternateOgLocales[locale],
    },
    twitter: {
      card: 'summary',
      title: copy.title,
      description: copy.description,
    },
  };
}

export function buildTranslatedPageMetadata(
  locale: TranslatedLocale,
  page: PublicPageKey,
): Metadata {
  const copy = localizedPages[locale][page];
  const canonical = localizedPath(locale, page);
  return {
    title: `${copy.title} | ARCANA LINK`,
    description: copy.description,
    alternates: {
      canonical,
      languages: languageAlternates(page),
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'article',
      url: canonical,
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      alternateLocale:
        locale === 'en' ? ['ja_JP', 'zh_CN'] : ['ja_JP', 'en_US'],
    },
    twitter: {
      card: 'summary',
      title: copy.title,
      description: copy.description,
    },
  };
}

export function buildInternationalPublicMetadata(
  locale: SiteLocale,
  page: string,
  title: string,
  description: string,
): Metadata {
  const canonical = localizedPath(locale, page);
  return {
    title: `${title} | ARCANA LINK`,
    description,
    alternates: { canonical, languages: languageAlternates(page) },
    robots: { index: indexedLocales.has(locale), follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      locale: homeMetadata[locale].ogLocale,
      alternateLocale: alternateOgLocales[locale],
    },
    twitter: { card: 'summary', title, description },
  };
}
