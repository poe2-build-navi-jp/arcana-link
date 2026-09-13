import { ExchangeHome } from '@/components/exchange-home';
import { buildHomeMetadata } from '@/lib/site-metadata';

export const metadata = buildHomeMetadata('ja');

export default function Home() {
  return <ExchangeHome locale="ja" />;
}
