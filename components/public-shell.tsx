/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { Sparkles } from '@/components/icons';
import { EditorialAd } from '@/components/editorial-ad';
import {
  homeCopy,
  languageLinks,
  localeInfo,
  localizedPath,
  type SiteLocale,
} from '@/lib/site-i18n';

function DocumentLanguage({ locale }: { locale: SiteLocale }) {
  const language = localeInfo[locale].htmlLang;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(language)}`,
      }}
    />
  );
}

export function PublicHeader({
  locale = 'ja',
  path = '',
}: {
  locale?: SiteLocale;
  path?: string;
}) {
  const copy = homeCopy[locale];
  return (
    <>
      <DocumentLanguage locale={locale} />
      <header className="public-header">
        <a className="public-brand" href={localizedPath(locale)}>
          <span>
            <Sparkles size={16} />
          </span>
          <div>
            <strong>ARCANA LINK</strong>
            <small>{copy.brandSubtitle}</small>
          </div>
        </a>
        <nav
          aria-label={
            locale === 'zh-cn'
              ? '主导航'
              : locale === 'en'
                ? 'Main navigation'
                : 'メインナビゲーション'
          }
        >
          <a href={localizedPath(locale)}>{copy.nav[0]}</a>
          <a href={localizedPath(locale, 'genshin-arcana')}>{copy.nav[1]}</a>
          <a href={localizedPath(locale, 'guide')}>{copy.nav[2]}</a>
          <a href={localizedPath(locale, 'arcana')}>{copy.nav[3]}</a>
          <a href={localizedPath(locale, 'about')}>{copy.nav[4]}</a>
        </nav>
        <div
          className="language-switcher"
          aria-label={
            locale === 'zh-cn' ? '语言' : locale === 'en' ? 'Language' : '言語'
          }
        >
          {languageLinks.map((link) => (
            <a
              className={link.locale === locale ? 'current' : ''}
              href={localizedPath(link.locale, path)}
              hrefLang={localeInfo[link.locale].hreflang}
              key={link.locale}
            >
              {link.locale === 'ja' ? 'JA' : link.locale === 'en' ? 'EN' : '中'}
            </a>
          ))}
        </div>
      </header>
    </>
  );
}

export function PublicFooter({ locale = 'ja' }: { locale?: SiteLocale }) {
  const copy = homeCopy[locale];
  return (
    <footer className="public-footer">
      <div>
        <strong>ARCANA LINK</strong>
        <p>{copy.footerDescription}</p>
      </div>
      <nav
        aria-label={
          locale === 'zh-cn'
            ? '页脚导航'
            : locale === 'en'
              ? 'Footer navigation'
              : 'フッターナビゲーション'
        }
      >
        <a href={localizedPath(locale, 'genshin-arcana')}>
          {copy.footerLinks[0]}
        </a>
        <a href={localizedPath(locale, 'guide')}>{copy.footerLinks[1]}</a>
        <a href={localizedPath(locale, 'arcana')}>{copy.nav[3]}</a>
        <a href={localizedPath(locale, 'about')}>{copy.footerLinks[2]}</a>
        <a href={localizedPath(locale, 'privacy')}>{copy.footerLinks[3]}</a>
        <a href={localizedPath(locale, 'terms')}>{copy.footerLinks[4]}</a>
        <a href="/contact">{locale === 'ja' ? 'お問い合わせ・訂正依頼' : locale === 'en' ? 'Contact / corrections (JA)' : '联系与更正（日语）'}</a>
      </nav>
      <small>© 2026 ARCANA LINK</small>
    </footer>
  );
}

export function ArticleShell({
  kicker,
  title,
  lead,
  children,
  locale = 'ja',
  path = '',
}: {
  kicker: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  locale?: SiteLocale;
  path?: string;
}) {
  return (
    <>
      <PublicHeader locale={locale} path={path} />
      {locale === 'ja' && ['guide','genshin-arcana'].includes(path) && <EditorialAd/>}
      <main className="article-page" lang={localeInfo[locale].htmlLang}>
        <header className="article-hero">
          <span>{kicker}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
        </header>
        <article className="article-body">{children}</article>
      </main>
      <PublicFooter locale={locale} />
    </>
  );
}
