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
    ? buildSeoPageMetadata('zh-cn', slug)
    : buildCardMetadata('zh-cn', slug);
}

export default async function ChineseCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isSeoTopic(slug)) return <SeoGuidePage locale="zh-cn" slug={slug} />;
  if (isServerPageSlug(slug))
    return <ServerSeoPage locale="zh-cn" slug={slug} />;
  return <CardExchangePage locale="zh-cn" slug={slug} />;
}
