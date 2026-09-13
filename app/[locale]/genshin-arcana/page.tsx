import { notFound } from 'next/navigation';
import { SeoGuidePage } from '@/components/international-seo-page';
import { buildSeoPageMetadata } from '@/lib/international-seo';
const locales = ['zh-tw', 'ko', 'es', 'pt-br'] as const;
type Locale = (typeof locales)[number];
function locale(value: string): Locale {
  if ((locales as readonly string[]).includes(value)) return value as Locale;
  notFound();
}
export const generateStaticParams = () =>
  locales.map((value) => ({ locale: value }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildSeoPageMetadata(locale((await params).locale));
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <SeoGuidePage locale={locale((await params).locale)} />;
}
