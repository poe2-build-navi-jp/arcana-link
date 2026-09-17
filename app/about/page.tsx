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
      <section><h2>マッチングと集計の基準</h2><p>当サイトは登録された所持数から、0枚を不足、2枚以上を交換候補として判定します。同一サーバーで双方に受け渡し可能な種類がある場合を「完全マッチ」と呼びます。交換の成立率やカードの希少性を示すものではありません。</p><p>カードページの人数は、過去7日以内に更新された受付中の登録プロフィール数です。交渉中・終了した募集は集計しません。ひとりが複数の端末で登録した場合に重複する可能性があり、ゲーム全体の需要や総プレイヤー数を表す統計ではありません。</p></section><section><h2>訂正と更新の方針</h2><p>サイトの操作説明は実装されている機能に照らして確認し、ゲーム内の仕様は現在のゲーム画面を優先します。実際の体験談、公式認定、交換実績を装う情報は掲載しません。説明用のケースは実際の募集と区別して表示します。</p><p>誤りや動作不良は<a href="/contact">お問い合わせ・訂正依頼フォーム</a>へお知らせください。運営者のメールアドレスや利用者のメールアドレスを公開せずに、報告を受け付けています。個別返信は行っていません。</p></section><p className="updated">最終更新：2026年9月17日</p>
    </ArticleShell>
  );
}
