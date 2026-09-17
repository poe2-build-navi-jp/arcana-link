import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';
import { languageAlternates } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: 'プライバシーポリシー | ARCANA LINK',
  description:
    'ARCANA LINKにおける利用者情報、Cookie、広告配信の取り扱いを記載します。',
  alternates: {
    canonical: '/privacy',
    languages: languageAlternates('privacy'),
  },
};
export default function Privacy() {
  return (
    <ArticleShell
      kicker="POLICY"
      title="プライバシーポリシー"
      lead="ARCANA LINKは、利用者の情報を必要な範囲で適切に取り扱います。"
      path="privacy"
    >
      <section>
        <h2>1. 収集する情報</h2>
        <p>
          当サイトで交換プロフィールを登録する場合、表示名、UID、サーバー、22種類の所持数、交換受付状態、利用者が任意で入力したメモを保存します。端末にはプロフィールを更新するためのランダムな識別情報と通知設定を保存します。パスワード、認証コード、本名や住所など、交換に不要な情報の入力は求めません。
        </p>
        <p>
          また、サイトの安全な運用、不具合の調査、利用状況の分析のため、IPアドレス、ブラウザの種類、参照元、閲覧日時などが、サーバーのログに自動的に記録される場合があります。
        </p>
      </section>
      <section>
        <h2>2. 利用目的</h2><p>お問い合わせフォームでは、選択した種類、本文、受付番号、送信日時と、連続送信を抑えるためのランダムな識別子のハッシュ値を保存します。メールアドレスは求めません。内容は公開せず、訂正・不具合調査・不正対応に使用します。個別返信はできません。</p>
        <ul>
          <li>コレクションカードの交換候補を表示するため</li>
          <li>サイトの利便性、表示速度、マッチング精度を改善するため</li>
          <li>不正利用、スパム、利用規約に反する行為を防止するため</li>
          <li>利用者からの通報を確認し、安全性を改善するため</li>
          <li>必要なお知らせとサポートを提供するため</li>
        </ul>
      </section>
      <section>
        <h2>3. Cookieと広告配信</h2>
        <p>
          当サイトでは、設定の保存、サイトの利用状況の把握、広告の配信と効果測定のためにCookieまたは類似技術を使用することがあります。Cookieはブラウザに保存される小さな情報であり、それ自体に氏名やメールアドレスが直接記録されるものではありません。
        </p>
        <p>
          当サイトではGoogle
          AdSenseを利用しています。GoogleやそのパートナーはCookieを使用し、利用者の過去のアクセス情報に基づく広告を配信することがあります。利用者は
          <a href="https://adssettings.google.com/" rel="noreferrer">
            広告設定
          </a>
          でパーソナライズ広告を無効にできます。Googleによる情報の使用は
          <a
            href="https://policies.google.com/technologies/partner-sites?hl=ja"
            rel="noreferrer"
          >
            Googleのポリシー
          </a>
          をご確認ください。
        </p>
      </section>
      <section>
        <h2>4. 第三者への提供</h2>
        <p>
          法令に基づく場合、人の生命や財産の保護に必要な場合、または利用者の同意がある場合を除き、収集した個人を特定できる情報を第三者に提供しません。運用上必要なサービス事業者への委託を行う場合は、必要な範囲で適切に管理します。
        </p>
      </section>
      <section>
        <h2>5. 公開情報の注意</h2>
        <p>
          交換プロフィールに入力した表示名、UID、サーバー、アルカナ所持状況、受付状態、メモは、交換候補を探す他の利用者に表示されます。本名、SNSアカウント、住所、電話番号など、交換に不要な個人情報は入力しないでください。7日以上更新されていないプロフィールはマッチ候補に表示されません。
        </p>
      </section>
      <section>
        <h2>6. ポリシーの変更</h2>
        <p>
          法令、利用するサービス、またはサイトの機能の変更に応じて、本ポリシーを改定することがあります。重要な変更は当サイト上でお知らせします。
        </p>
      </section>
      <p className="updated">制定：2026年9月5日</p>
    </ArticleShell>
  );
}
