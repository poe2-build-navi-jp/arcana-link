import { CardExchangePage } from '@/components/card-exchange-page';
import { buildCardMetadata, cardStaticParams } from '@/lib/card-seo';
import {
  SeoGuidePage,
  ServerSeoPage,
} from '@/components/international-seo-page';
import {
  buildSeoPageMetadata,
  isSeoTopic,
  isServerPageSlug,
  seoTopicSlugs,
  serverPageSlugs,
} from '@/lib/international-seo';

export const generateStaticParams = () => [
  ...cardStaticParams,
  ...seoTopicSlugs.map((slug) => ({ slug })),
  ...serverPageSlugs.map((slug) => ({ slug })),
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return isSeoTopic(slug) || isServerPageSlug(slug)
    ? buildSeoPageMetadata('ja', slug)
    : buildCardMetadata('ja', slug);
}

export default async function JapaneseCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isSeoTopic(slug)) return <SeoGuidePage locale="ja" slug={slug} />;
  if (isServerPageSlug(slug)) return <ServerSeoPage locale="ja" slug={slug} />;
  return <CardExchangePage locale="ja" slug={slug} />;
}
