import { ExchangeHome } from '@/components/exchange-home';
import { readExchangeSummary } from '@/lib/arcana-db';
import { buildHomeMetadata } from '@/lib/site-metadata';

export const metadata = buildHomeMetadata('zh-cn');
export const dynamic = 'force-dynamic';

export default async function ChineseHome() {
  const summary = await readExchangeSummary();
  return <ExchangeHome locale="zh-cn" initialSummary={summary} />;
}
