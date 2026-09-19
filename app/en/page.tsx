import { ExchangeHome } from '@/components/exchange-home';
import { readExchangeSummary } from '@/lib/arcana-db';
import { buildHomeMetadata } from '@/lib/site-metadata';

export const metadata = buildHomeMetadata('en');
export const dynamic = 'force-dynamic';

export default async function EnglishHome() {
  const summary = await readExchangeSummary();
  return <ExchangeHome locale="en" initialSummary={summary} />;
}
