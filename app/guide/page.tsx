/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';
import { languageAlternates } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: 'コレクションカード交換ガイド | ARCANA LINK',
  description:
    '22種類のコレクションカードを、フレンドと安全に交換する手順と注意点を解説します。',
  alternates: { canonical: '/guide', languages: languageAlternates('guide') },
};
export default function Guide() {
  return (
    <ArticleShell
      kicker="GUIDE"
      title="コレクションカード交換ガイド"
      lead="相手を見つけてから、対応サービス内で交換を完了するまで。初めてでも迷わないように順番にまとめました。"
      path="guide"
    >
      <nav className="toc">
        <b>このページの内容</b>
        <a href="#prepare">1. 交換前の準備</a>
        <a href="#match">2. 相手の探し方</a>
        <a href="#ingame">3. 交換サービス内の手順</a>
        <a href="#safe">4. 安全に利用するために</a>
        <a href="#trouble">5. うまくいかないとき</a>
      </nav>
      <section id="prepare">
        <h2>1. 交換前の準備</h2>
        <p>
          交換に出す前に、手元のカードの種類と枚数を対応するサービス内で確認しましょう。コレクション用の1枚と交換に出せる予備を混同しないことが大切です。
        </p>
        <div className="checklist">
          <b>確認リスト</b>
          <ul>
            <li>欲しいアルカナの正式名称</li>
            <li>交換に出せるアルカナと枚数</li>
            <li>自分のサーバーとUID</li>
            <li>交換ルームで合流できる時間</li>
          </ul>
        </div>
      </section>
      <section id="match">
        <h2>2. 相手の探し方</h2>
        <p>
          <a href="/">マッチング画面</a>
          で「集めているアルカナ」と「交換に出せるアルカナ」を選びます。候補は、あなたが欲しいカードを相手が出せ、かつ相手が欲しいカードをあなたが出せるときに絞り込まれます。別サーバーのプレイヤーとは通常同じ世界に合流できないため、サーバーも必ず合わせます。
        </p>
      </section>
      <section id="ingame">
        <h2>3. 交換サービス内の手順</h2>
        <ol className="numbered">
          <li>
            <b>UIDでフレンド申請</b>
            <span>
              申請時は、募集に記載された合言葉やメモがあればそれに従います。
            </span>
          </li>
          <li>
            <b>交換ルームで合流</b>
            <span>どちらの世界で交換するか、予めチャットで確認します。</span>
          </li>
          <li>
            <b>カード交換機能を使用</b>
            <span>
              バッグから対象アイテムを開き、交換画面でお互いのカードを選択します。
            </span>
          </li>
          <li>
            <b>内容を相互確認</b>
            <span>
              カード名と枚数を最終確認し、両者が納得してから確定します。
            </span>
          </li>
        </ol>
      </section>
      <section id="safe">
        <h2>4. 安全に利用するために</h2>
        <p>
          ARCANA
          LINKは交換相手を見つけるためのサイトであり、アカウントのログイン情報は必要ありません。パスワード、SMSやメールで届く認証コード、他サービスのログイン画面は、相手に求められても共有しないでください。交換は対応サービス内の正式機能だけを使用します。
        </p>
      </section>
      <section id="trouble">
        <h2>5. うまくいかないとき</h2>
        <div className="faq">
          <h3>フレンド検索で相手が出てこない</h3>
          <p>
            UIDの入力ミスとサーバーが同じかを確認してください。サーバーが異なる場合、同じ交換ルームに入れないことがあります。
          </p>
          <h3>募集のアルカナがすでに交換済みだった</h3>
          <p>
            登録情報と実際の所持状況に時間差があることがあります。相手を責めず、別の候補を探しましょう。
          </p>
        </div>
      </section>
      <aside className="related">
        <h2>次に読む</h2>
        <a href="/arcana">22種類のコレクションカード一覧 →</a>
      </aside>
    </ArticleShell>
  );
}
