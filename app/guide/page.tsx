/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ToolGuide } from '@/components/tool-guide';
import { ArticleShell } from '@/components/public-shell';
import { languageAlternates } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: 'ARCANA LINKの使い方・マッチング判定ガイド | ARCANA LINK',
  description:
    '22種類のコレクションカードを、フレンドと安全に交換する手順と注意点を解説します。',
  alternates: { canonical: '/guide', languages: languageAlternates('guide') },
};
export default function Guide(){return <ArticleShell kicker="TOOL GUIDE" title="ARCANA LINKの使い方とマッチ判定" lead="入力、保存、公開、交換後の更新まで。実際の条件例で、自動マッチの仕組みと使い方を確認できます。" path="guide"><ToolGuide/></ArticleShell>;}
