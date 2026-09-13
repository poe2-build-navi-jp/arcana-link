import { SeoGuidePage } from '@/components/international-seo-page';
import { buildSeoPageMetadata } from '@/lib/international-seo';

export const metadata = buildSeoPageMetadata('zh-cn');

export default function Page() {
  return <SeoGuidePage locale="zh-cn" />;
}
