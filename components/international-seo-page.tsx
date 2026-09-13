/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { ArticleShell } from '@/components/public-shell';
import { arcanaCards } from '@/lib/arcana-cards';
import { readProfiles } from '@/lib/arcana-db';
import { neededCards, offeredCards } from '@/lib/arcana-profile';
import {
  internationalSeoCopy,
  seoTopicSlugs,
  serverPageSlugs,
  serverSlugToRegion,
  type SeoTopic,
  type ServerPageSlug,
} from '@/lib/international-seo';
import {
  cardNames,
  localeInfo,
  localizedPath,
  type ArcanaId,
  type SiteLocale,
} from '@/lib/site-i18n';
import { serverLabels } from '@/lib/server-region';

const base = 'https://arcana-card-link.pages.dev';
function StructuredData({
  locale,
  path,
  headline,
  description,
}: {
  locale: SiteLocale;
  path: string;
  headline: string;
  description: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline,
          description,
          inLanguage: localeInfo[locale].htmlLang,
          datePublished: '2026-09-11',
          dateModified: '2026-09-11',
          author: { '@type': 'Organization', name: 'ARCANA LINK' },
          publisher: { '@type': 'Organization', name: 'ARCANA LINK' },
          mainEntityOfPage: `${base}${localizedPath(locale, path)}`,
        }),
      }}
    />
  );
}
function ClusterLinks({ locale }: { locale: SiteLocale }) {
  const copy = internationalSeoCopy[locale];
  return (
    <>
      <section>
        <h2>{copy.clusterTitle}</h2>
        <div className="seo-link-grid">
          {seoTopicSlugs.map((slug) => (
            <a
              href={localizedPath(locale, `genshin-arcana/${slug}`)}
              key={slug}
            >
              <strong>{copy.topics[slug].title}</strong>
              <span>{copy.topics[slug].description}</span>
            </a>
          ))}
        </div>
      </section>
      <section>
        <h2>{copy.serverTitle}</h2>
        <div className="seo-server-links">
          {serverPageSlugs.map((slug) => (
            <a
              href={localizedPath(locale, `genshin-arcana/${slug}`)}
              key={slug}
            >
              {serverLabels[locale][serverSlugToRegion[slug]]}
            </a>
          ))}
        </div>
      </section>
      <p>
        <a className="card-seo-action" href={localizedPath(locale, 'arcana')}>
          {copy.allCards} →
        </a>
      </p>
    </>
  );
}
export function SeoGuidePage({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug?: SeoTopic;
}) {
  const copy = internationalSeoCopy[locale];
  const content = slug ? copy.topics[slug] : copy.overview;
  const path = slug ? `genshin-arcana/${slug}` : 'genshin-arcana';
  return (
    <>
      <StructuredData
        locale={locale}
        path={path}
        headline={content.title}
        description={content.description}
      />
      <ArticleShell
        kicker="ARCANA LINK"
        title={content.title}
        lead={content.lead}
        locale={locale}
        path={path}
      >
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <p>
          <a className="card-seo-action" href={localizedPath(locale)}>
            {content.cta} →
          </a>
        </p>
        <ClusterLinks locale={locale} />
      </ArticleShell>
    </>
  );
}
function topCards(values: Record<ArcanaId, number>) {
  return arcanaCards
    .map((card) => ({ id: card.id, count: values[card.id] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
export async function ServerSeoPage({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: ServerPageSlug;
}) {
  const copy = internationalSeoCopy[locale];
  const region = serverSlugToRegion[slug];
  const profiles = (await readProfiles(region)) ?? [];
  const wanted = Object.fromEntries(
    arcanaCards.map((card) => [card.id, 0]),
  ) as Record<ArcanaId, number>;
  const offered = { ...wanted };
  for (const profile of profiles) {
    for (const card of neededCards(profile.inventory)) wanted[card] += 1;
    for (const card of offeredCards(profile.inventory)) offered[card] += 1;
  }
  let perfectMatches = 0;
  for (let left = 0; left < profiles.length; left += 1) {
    const leftNeeds = new Set(neededCards(profiles[left].inventory));
    const leftOffers = new Set(offeredCards(profiles[left].inventory));
    for (let right = left + 1; right < profiles.length; right += 1) {
      const rightNeeds = neededCards(profiles[right].inventory);
      const rightOffers = offeredCards(profiles[right].inventory);
      if (
        rightNeeds.some((card) => leftOffers.has(card)) &&
        rightOffers.some((card) => leftNeeds.has(card))
      )
        perfectMatches += 1;
    }
  }
  const title = `${copy.serverTitle}: ${serverLabels[locale][region]}`;
  const path = `genshin-arcana/${slug}`;
  return (
    <>
      <StructuredData
        locale={locale}
        path={path}
        headline={title}
        description={copy.serverNotes[slug]}
      />
      <ArticleShell
        kicker={serverLabels[locale][region]}
        title={title}
        lead={copy.serverNotes[slug]}
        locale={locale}
        path={path}
      >
        <section className="server-seo-stats">
          <div>
            <small>{copy.activePlayers}</small>
            <strong>{profiles.length}</strong>
          </div>
          <div>
            <small>{copy.perfectMatches}</small>
            <strong>{perfectMatches}</strong>
          </div>
        </section>
        {profiles.length ? (
          <section className="server-card-rankings">
            <div>
              <h2>{copy.mostWanted}</h2>
              {topCards(wanted).map((card) => (
                <p key={card.id}>
                  <span>{cardNames[locale][card.id]}</span>
                  <strong>{card.count}</strong>
                </p>
              ))}
            </div>
            <div>
              <h2>{copy.mostOffered}</h2>
              {topCards(offered).map((card) => (
                <p key={card.id}>
                  <span>{cardNames[locale][card.id]}</span>
                  <strong>{card.count}</strong>
                </p>
              ))}
            </div>
          </section>
        ) : (
          <p>{copy.noData}</p>
        )}
        <p>
          <a
            className="card-seo-action"
            href={`${localizedPath(locale)}?server=${region}`}
          >
            {copy.serverCta} →
          </a>
        </p>
        <ClusterLinks locale={locale} />
      </ArticleShell>
    </>
  );
}
