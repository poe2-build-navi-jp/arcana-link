/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ToolGuide } from '@/components/tool-guide';
import { ArticleShell } from '@/components/public-shell';
import { languageAlternates } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: '原神 月諭アルカナ交換ガイド｜交換方法と注意点 | ARCANA LINK',
  description:
    '原神「月諭のアルカナ」の交換方法を解説。交換前の準備、相手の探し方、UID確認、安全な交換手順をまとめています。',
  alternates: { canonical: '/guide', languages: languageAlternates('guide') },
};
export default function Guide(){return <ArticleShell kicker="TOOL GUIDE" title="原神 月諭アルカナ交換ガイド" lead="入力、保存、公開、交換後の更新まで。実際の条件例で、自動マッチの仕組みと安全な交換手順を確認できます。" path="guide"><ToolGuide/></ArticleShell>;}
