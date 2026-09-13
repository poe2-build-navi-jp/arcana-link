import { notFound } from 'next/navigation';
import { CardExchangePage } from '@/components/card-exchange-page';
import {
  arcanaCards,
  cardByEnglishSlug,
  englishCardSlugById,
} from '@/lib/arcana-cards';
import { buildCardMetadata } from '@/lib/card-seo';
export const generateStaticParams = () =>
  arcanaCards.map((card) => ({ slug: englishCardSlugById[card.id] }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = cardByEnglishSlug[slug];
  return card ? buildCardMetadata('en', card.slug, `lunar-arcana/${slug}`) : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = cardByEnglishSlug[slug];
  if (!card) notFound();
  return (
    <CardExchangePage
      locale="en"
      slug={card.slug}
      path={`lunar-arcana/${slug}`}
    />
  );
}
