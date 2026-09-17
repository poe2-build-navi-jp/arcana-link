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

const homeMetadata = {
  ja: {
    title:
      '原神 月諭アルカナ交換マッチング｜条件一致の相手を自動検索 | ARCANA LINK',
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
} as const;

const alternateOgLocales: Record<SiteLocale, string[]> = {
  ja: ['en_US', 'zh_CN'],
  en: ['ja_JP', 'zh_CN'],
  'zh-cn': ['ja_JP', 'en_US'],
};

export function buildHomeMetadata(locale: SiteLocale): Metadata {
  const copy = homeMetadata[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: localizedPath(locale),
      languages: languageAlternates(),
    },
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
