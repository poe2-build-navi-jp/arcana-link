import { CardExchangePage } from '@/components/card-exchange-page';
import { buildCardMetadata, cardStaticParams } from '@/lib/card-seo';

export const generateStaticParams = () => cardStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return buildCardMetadata('zh-cn', (await params).slug);
}

export default async function ChineseCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <CardExchangePage locale="zh-cn" slug={(await params).slug} />;
}
