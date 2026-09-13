import { LocalizedPublicPage } from '@/components/localized-public-page';
import { buildTranslatedPageMetadata } from '@/lib/site-metadata';

export const metadata = buildTranslatedPageMetadata('zh-cn', 'privacy');

export default function Page() {
  return <LocalizedPublicPage locale="zh-cn" page="privacy" />;
}
