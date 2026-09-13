import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';
import { languageAlternates } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: 'このサイトについて | ARCANA LINK',
  description: 'ARCANA LINKの目的、運営方針、掲載情報についてご案内します。',
  alternates: { canonical: '/about', languages: languageAlternates('about') },
};
export default function About() {
  return (
    <ArticleShell
      kicker="ABOUT"
      title="このサイトについて"
      lead="ARCANA LINKは、22種類のコレクションカードの重複を、まだ持っていないコレクターと繋ぐための独立運営サイトです。"
      path="about"
    >
      <section>
        <h2>サイトの目的</h2>
        <p>
          カードは収集を進めるほど重複しやすく、目的の一枚を持つ交換相手を時系列の投稿から探すのは大変です。ARCANA
          LINKは、22種類の所持数から不足と重複を自動判定し、相互条件の完全一致を優先することで、募集の新しさに左右されず交換候補を見つけられることを目指しています。
        </p>
      </section>
      <section>
        <h2>掲載内容と編集方針</h2>
        <p>
          当サイトでは、カード名、交換機能の利用手順、ユーザー間で安全に連絡するための注意点を、初めて交換する人にも理解できる言葉で編集しています。他サイトの記事を転載せず、利用者が交換前に必要とする情報を独自に整理します。
        </p>
        <p>
          対応サービスの更新により仕様が変更されることがあるため、交換の確定前には必ず実際の交換画面を優先してください。
        </p>
      </section>
      <section>
        <h2>運営情報</h2>
        <dl className="operator">
          <div>
            <dt>サイト名</dt>
            <dd>ARCANA LINK</dd>
          </div>
          <div>
            <dt>運営者</dt>
            <dd>ARCANA LINK運営</dd>
          </div>
          <div>
            <dt>運営開始</dt>
            <dd>2026年9月</dd>
          </div>
          <div>
            <dt>運営目的</dt>
            <dd>
              22種類のコレクションカード交換情報の整理と安全な交換手順の案内
            </dd>
          </div>
        </dl>
      </section>
      <section>
        <h2>運営の独立性</h2>
        <p>
          当サイトは特定の作品、ゲーム、企業またはブランドの公式サイトではありません。画像、ロゴ、音楽、物語、キャラクターなど、第三者が権利を有する素材は使用していません。
        </p>
      </section>
      <p className="updated">最終更新：2026年9月6日</p>
    </ArticleShell>
  );
}
