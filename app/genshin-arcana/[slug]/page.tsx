import { CardExchangePage } from '@/components/card-exchange-page';
import { buildCardMetadata, cardStaticParams } from '@/lib/card-seo';

export const generateStaticParams = () => cardStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return buildCardMetadata('ja', (await params).slug);
}

export default async function JapaneseCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <CardExchangePage locale="ja" slug={(await params).slug} />;
}
