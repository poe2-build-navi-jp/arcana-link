import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://arcana-card-link.pages.dev'),
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7738997902416481" />
      </head>
      <body>{children}</body>
    </html>
  );
}
