import { ExchangeHome } from '@/components/exchange-home';
import { buildHomeMetadata } from '@/lib/site-metadata';

export const metadata = buildHomeMetadata('zh-cn');

export default function ChineseHome() {
  return <ExchangeHome locale="zh-cn" />;
}
