/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { Fragment } from 'react';
import { ArticleShell } from '@/components/public-shell';
import { cardSlugById } from '@/lib/arcana-cards';
import { arcanaIds, cardNames, localizedPath, romans } from '@/lib/site-i18n';
import {
  localizedPages,
  type PublicPageKey,
  type TranslatedLocale,
} from '@/lib/localized-pages';

function StructuredData({
  locale,
  page,
}: {
  locale: TranslatedLocale;
  page: PublicPageKey;
}) {
  if (page !== 'genshin-arcana') return null;
  const copy = localizedPages[locale][page];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: copy.title,
    description: copy.description,
    inLanguage: locale === 'en' ? 'en' : 'zh-CN',
    datePublished: '2026-09-05',
    dateModified: '2026-09-06',
    author: { '@type': 'Organization', name: 'ARCANA LINK editorial team' },
    publisher: { '@type': 'Organization', name: 'ARCANA LINK' },
    mainEntityOfPage: `https://arcana-card-link.pages.dev${localizedPath(locale, page)}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalizedPublicPage({
  locale,
  page,
}: {
  locale: TranslatedLocale;
  page: PublicPageKey;
}) {
  const copy = localizedPages[locale][page];
  const isEnglish = locale === 'en';
  return (
    <>
      <StructuredData locale={locale} page={page} />
      <ArticleShell
        kicker={copy.kicker}
        title={copy.title}
        lead={copy.lead}
        locale={locale}
        path={page}
      >
        {copy.tocLabel && (
          <nav className="toc" aria-label={copy.tocLabel}>
            <b>{copy.tocLabel}</b>
            {copy.sections
              .filter((section) => section.id)
              .map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  {index + 1}. {section.heading}
                </a>
              ))}
          </nav>
        )}
        {copy.sections.map((section, index) => (
          <Fragment key={section.heading}>
            <section id={section.id}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.subheadings?.map((item) => (
                <div key={item.heading}>
                  <h3>{item.heading}</h3>
                  <p>{item.paragraph}</p>
                </div>
              ))}
              {section.details && (
                <dl className="operator">
                  {section.details.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
            {page === 'arcana' && index === 0 && (
              <div className="arcana-catalog">
                {arcanaIds.map((card, cardIndex) => (
                  <a
                    href={localizedPath(
                      locale,
                      `genshin-arcana/${cardSlugById[card]}`,
                    )}
                    key={card}
                  >
                    <span>{romans[cardIndex]}</span>
                    <strong>{cardNames[locale][card]}</strong>
                  </a>
                ))}
              </div>
            )}
          </Fragment>
        ))}
        {page === 'privacy' && (
          <aside className="related">
            <h2>{isEnglish ? 'Advertising choices' : '广告选项'}</h2>
            <a href="https://adssettings.google.com/" rel="noreferrer">
              {isEnglish ? 'Google Ads Settings' : 'Google广告设置'}
            </a>
            {' · '}
            <a
              href={`https://policies.google.com/technologies/partner-sites?hl=${isEnglish ? 'en' : 'zh-CN'}`}
              rel="noreferrer"
            >
              {isEnglish
                ? 'Google partner-sites policy'
                : 'Google合作伙伴网站政策'}
            </a>
          </aside>
        )}
        {copy.related && (
          <aside className="related">
            <h2>{copy.related.title}</h2>
            <a href={localizedPath(locale, copy.related.href)}>
              {copy.related.label}
            </a>
          </aside>
        )}
        <p className="updated">{copy.updated}</p>
      </ArticleShell>
    </>
  );
}
