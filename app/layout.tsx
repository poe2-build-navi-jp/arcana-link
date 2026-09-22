import type { Metadata } from 'next';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-C5L7SDL9W1';

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
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
