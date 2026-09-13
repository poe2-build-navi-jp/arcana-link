import { notFound } from 'next/navigation';
import { ExchangeHome } from '@/components/exchange-home';
import { buildHomeMetadata } from '@/lib/site-metadata';
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
  return buildHomeMetadata(locale((await params).locale));
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <ExchangeHome locale={locale((await params).locale)} />;
}
