import { LocalizedPublicPage } from '@/components/localized-public-page';
import { buildTranslatedPageMetadata } from '@/lib/site-metadata';

export const metadata = buildTranslatedPageMetadata('en', 'about');

export default function Page() {
  return <LocalizedPublicPage locale="en" page="about" />;
}
