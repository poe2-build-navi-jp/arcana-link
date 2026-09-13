import { notFound } from 'next/navigation';
import { CardExchangePage } from '@/components/card-exchange-page';
import {
  SeoGuidePage,
  ServerSeoPage,
} from '@/components/international-seo-page';
import { buildCardMetadata, cardStaticParams } from '@/lib/card-seo';
import {
  buildSeoPageMetadata,
  isSeoTopic,
  isServerPageSlug,
  seoTopicSlugs,
  serverPageSlugs,
} from '@/lib/international-seo';
const locales = ['zh-tw', 'ko', 'es', 'pt-br'] as const;
type Locale = (typeof locales)[number];
function locale(value: string): Locale {
  if ((locales as readonly string[]).includes(value)) return value as Locale;
  notFound();
}
export const generateStaticParams = () =>
  locales.flatMap((value) =>
    [
      ...cardStaticParams,
      ...seoTopicSlugs.map((slug) => ({ slug })),
      ...serverPageSlugs.map((slug) => ({ slug })),
    ].map(({ slug }) => ({ locale: value, slug })),
  );
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const p = await params;
  const l = locale(p.locale);
  return isSeoTopic(p.slug) || isServerPageSlug(p.slug)
    ? buildSeoPageMetadata(l, p.slug)
    : buildCardMetadata(l, p.slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const p = await params;
  const l = locale(p.locale);
  if (isSeoTopic(p.slug)) return <SeoGuidePage locale={l} slug={p.slug} />;
  if (isServerPageSlug(p.slug))
    return <ServerSeoPage locale={l} slug={p.slug} />;
  return <CardExchangePage locale={l} slug={p.slug} />;
}
