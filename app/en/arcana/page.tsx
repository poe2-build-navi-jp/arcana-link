import { LocalizedPublicPage } from '@/components/localized-public-page';
import { buildTranslatedPageMetadata } from '@/lib/site-metadata';

export const metadata = buildTranslatedPageMetadata('en', 'arcana');

export default function Page() {
  return <LocalizedPublicPage locale="en" page="arcana" />;
}
