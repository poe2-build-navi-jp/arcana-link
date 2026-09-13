import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';
import { languageAlternates } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: '利用規約 | ARCANA LINK',
  description: 'ARCANA LINKの利用条件、禁止行為、免責事項を記載します。',
  alternates: { canonical: '/terms', languages: languageAlternates('terms') },
};
export default function Terms() {
  return (
    <ArticleShell
      kicker="TERMS"
      title="利用規約"
      lead="ARCANA LINKを気持ちよく安全に利用するためのルールです。"
      path="terms"
    >
      <section>
        <h2>1. 適用</h2>
        <p>
          本規約は、ARCANA
          LINKが提供するマッチング、交換情報、ガイドその他の機能の利用に適用されます。利用者は、本規約に同意した上で当サイトを利用するものとします。
        </p>
      </section>
      <section>
        <h2>2. 提供するサービス</h2>
        <p>
          当サイトは、利用者が入力した22種類の所持数と交換受付状態に基づき、相互条件の合う候補を表示します。実際の交換は当サイト上では行われず、利用者間でゲーム内の正式な交換機能を使用して行われます。
        </p>
      </section>
      <section>
        <h2>3. 禁止行為</h2>
        <ul>
          <li>
            虚偽のUID、誤った所持数、意図的に誤解を生む交換状態を登録する行為
          </li>
          <li>
            他の利用者にパスワード、認証コード、金銭または金銭的価値のあるものを要求する行為
          </li>
          <li>詐欺、なりすまし、嫌がらせ、差別的または攻撃的な表現</li>
          <li>スパム、商業広告、交換と無関係な勧誘を投稿する行為</li>
          <li>サイトの運営を妨害する行為、不正アクセス、過度な自動操作</li>
          <li>法令、公序良俗、またはゲームの利用規約に反する行為</li>
        </ul>
      </section>
      <section>
        <h2>4. 登録情報の取り扱い</h2>
        <p>
          運営者は、規約に反する内容、長期間更新されていない情報、安全な運営に支障があると判断した情報を、予告なく非表示または削除できるものとします。
        </p>
      </section>
      <section>
        <h2>5. 免責事項</h2>
        <p>
          当サイトは、交換候補の成立、利用者が登録した情報の正確性、ゲームの仕様変更に対する常時の最新性を保証しません。利用者間の連絡や交換によって生じたトラブルは、当事者間で解決するものとします。ただし、運営者に故意または重大な過失がある場合を除きます。
        </p>
      </section>
      <section>
        <h2>6. サービスの変更と停止</h2>
        <p>
          メンテナンス、障害、外部サービスの変更その他運営上必要な場合、機能の全部または一部を変更・中断・終了することがあります。
        </p>
      </section>
      <section>
        <h2>7. 規約の変更</h2>
        <p>
          利用者の利益に適合する場合、または変更の必要性と内容が合理的である場合、本規約を変更することがあります。重要な変更は当サイト上でお知らせします。
        </p>
      </section>
      <p className="updated">制定：2026年9月5日</p>
    </ArticleShell>
  );
}
