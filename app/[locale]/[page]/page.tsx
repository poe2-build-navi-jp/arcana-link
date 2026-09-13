import { notFound } from 'next/navigation';
import {
  InternationalPublicPage,
  internationalPublicCopy,
  type IntlPublicPage,
} from '@/components/international-public-page';
import { buildInternationalPublicMetadata } from '@/lib/site-metadata';
const locales = ['zh-tw', 'ko', 'es', 'pt-br'] as const;
const pages = ['guide', 'arcana', 'about', 'privacy', 'terms'] as const;
type Locale = (typeof locales)[number];
function locale(value: string): Locale {
  if ((locales as readonly string[]).includes(value)) return value as Locale;
  notFound();
}
function page(value: string): IntlPublicPage {
  if ((pages as readonly string[]).includes(value))
    return value as IntlPublicPage;
  notFound();
}
export const generateStaticParams = () =>
  locales.flatMap((l) => pages.map((p) => ({ locale: l, page: p })));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const p = await params;
  const l = locale(p.locale);
  const key = page(p.page);
  const copy = internationalPublicCopy[l][key];
  return buildInternationalPublicMetadata(l, key, copy.title, copy.lead);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const p = await params;
  return (
    <InternationalPublicPage locale={locale(p.locale)} page={page(p.page)} />
  );
}
