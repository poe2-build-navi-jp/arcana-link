import { CardExchangePage } from '@/components/card-exchange-page';
import { buildCardMetadata, cardStaticParams } from '@/lib/card-seo';

export const generateStaticParams = () => cardStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return buildCardMetadata('en', (await params).slug);
}

export default async function EnglishCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <CardExchangePage locale="en" slug={(await params).slug} />;
}
