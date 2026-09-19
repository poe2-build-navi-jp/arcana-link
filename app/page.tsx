import { ExchangeHome } from '@/components/exchange-home';
import { readExchangeSummary } from '@/lib/arcana-db';
import { buildHomeMetadata } from '@/lib/site-metadata';

export const metadata = buildHomeMetadata('ja');
export const dynamic = 'force-dynamic';

export default async function Home() {
  const summary = await readExchangeSummary();
  return <ExchangeHome locale="ja" initialSummary={summary} />;
}
