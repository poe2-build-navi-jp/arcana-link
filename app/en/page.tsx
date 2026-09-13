import { ExchangeHome } from '@/components/exchange-home';
import { buildHomeMetadata } from '@/lib/site-metadata';

export const metadata = buildHomeMetadata('en');

export default function EnglishHome() {
  return <ExchangeHome locale="en" />;
}
