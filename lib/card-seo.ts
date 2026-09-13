import type { Metadata } from 'next';
import {
  arcanaCards,
  cardBySlug,
  englishCardSlugById,
} from '@/lib/arcana-cards';
import {
  cardNames,
  localeInfo,
  localizedPath,
  siteLocales,
  type SiteLocale,
} from '@/lib/site-i18n';

const base = 'https://arcana-card-link.pages.dev';

export const cardStaticParams = arcanaCards.map((card) => ({
  slug: card.slug,
}));

function cardAlternates(slug: string) {
  const englishSlug = cardBySlug[slug]
    ? englishCardSlugById[cardBySlug[slug].id]
    : slug;
  return Object.fromEntries([
    ...siteLocales.map((locale) => [
      localeInfo[locale].hreflang,
      localizedPath(
        locale,
        locale === 'en'
          ? `lunar-arcana/${englishSlug}`
          : `genshin-arcana/${slug}`,
      ),
    ]),
    ['x-default', localizedPath('en', `lunar-arcana/${englishSlug}`)],
  ]);
}

export function buildCardMetadata(
  locale: SiteLocale,
  slug: string,
  pathOverride?: string,
  legacy = false,
): Metadata {
  const card = cardBySlug[slug];
  if (!card) return {};
  const name = cardNames[locale][card.id];
  const content = {
    ja: {
      title: `${name}のアルカナ交換募集｜原神 月諭アルカナ`,
      description: `原神の月諭アルカナ「${name}」を探している人、交換に出せる人を相互条件で探せます。所持数を登録すると交換内容を自動計算します。`,
    },
    en: {
      title: `${name} Lunar Arcana Trade Listings`,
      description: `Find players who can offer ${name} Lunar Arcana and match the duplicate cards you have. Register your 22-card collection for automatic matching.`,
    },
    'zh-cn': {
      title: `${name}月谕圣牌交换招募`,
      description: `查找可提供“${name}”月谕圣牌、且需要你所持重复圣牌的玩家。登记22种持有数量后即可自动匹配。`,
    },
    'zh-tw': {
      title: `${name}月諭聖牌交換`,
      description: `尋找可提供「${name}」且需要你重複聖牌的玩家。登記22種持有數量即可自動配對。`,
    },
    ko: {
      title: `${name} 월의 아르카나 교환`,
      description: `${name} 카드를 제공하면서 내 중복 카드를 필요로 하는 플레이어를 찾으세요.`,
    },
    es: {
      title: `Intercambio del Arcano Lunar ${name}`,
      description: `Encuentra jugadores que ofrecen ${name} y necesitan uno de tus duplicados.`,
    },
    'pt-br': {
      title: `Troca do Arcano Lunar ${name}`,
      description: `Encontre jogadores que oferecem ${name} e precisam de uma carta repetida sua.`,
    },
  }[locale];
  const path = pathOverride ?? `genshin-arcana/${slug}`;
  const canonical = localizedPath(locale, path);
  return {
    title: `${content.title} | ARCANA LINK`,
    description: content.description,
    alternates: {
      canonical,
      languages: cardAlternates(slug),
    },
    robots: { index: !legacy, follow: true },
    openGraph: {
      type: 'article',
      title: content.title,
      description: content.description,
      url: canonical,
      locale: localeInfo[locale].htmlLang.replace('-', '_'),
    },
    twitter: {
      card: 'summary',
      title: content.title,
      description: content.description,
    },
  };
}

export function cardStructuredData(
  locale: SiteLocale,
  slug: string,
  pathOverride?: string,
) {
  const card = cardBySlug[slug];
  if (!card) return null;
  const name = cardNames[locale][card.id];
  const headline =
    locale === 'ja'
      ? `${name}のアルカナ交換募集`
      : locale === 'en'
        ? `${name} Lunar Arcana Trade Listings`
        : `${name} Lunar Arcana`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    inLanguage: localeInfo[locale].htmlLang,
    datePublished: '2026-09-06',
    dateModified: '2026-09-06',
    author: { '@type': 'Organization', name: 'ARCANA LINK' },
    publisher: { '@type': 'Organization', name: 'ARCANA LINK' },
    mainEntityOfPage: `${base}${localizedPath(locale, pathOverride ?? `genshin-arcana/${slug}`)}`,
  };
}
