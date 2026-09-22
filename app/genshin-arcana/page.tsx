/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ExchangeInsights } from '@/components/exchange-insights';
import { ArticleShell } from '@/components/public-shell';
import { readExchangeSummary } from '@/lib/arcana-db';
import { languageAlternates } from '@/lib/site-i18n';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '原神 月諭アルカナ交換のやり方｜募集・相手の探し方 | ARCANA LINK',
  description:
    '原神の月諭アルカナの交換相手を探す方法を解説。欲しいアルカナ、出せるアルカナ、サーバー、UIDから条件の合う相手を見つけられます。',
  alternates: {
    canonical: '/genshin-arcana',
    languages: languageAlternates('genshin-arcana'),
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: '原神 月諭アルカナ交換のやり方｜募集・相手の探し方',
    description:
      '月諭アルカナの交換条件を整理し、相手を探すための実用ガイドです。',
    type: 'article',
    locale: 'ja_JP',
  },
};

const faq = [
  {
    q: '原神のアルカナはどこで入手できますか？',
    a: '幻想シアターの月諭モードを進め、対象のアルカナ挑戦と公演を完了することで入手できます。最新の条件は必ずゲーム内の表示を確認してください。',
  },
  {
    q: 'アルカナはサイト上で交換できますか？',
    a: 'できません。ARCANA LINKは条件の合う相手を探すためのサービスです。実際の交換は、フレンドとマルチプレイ中にゲーム内の正式機能を使って行います。',
  },
  {
    q: '異なるサーバーの人と交換できますか？',
    a: '交換相手を探すときは、同じサーバーを選んでください。サーバーが異なると同じ世界に合流できないため、交換を完了できません。',
  },
  {
    q: '交換相手に何を教えても大丈夫ですか？',
    a: 'フレンド検索に必要なUIDと交換条件以外の情報は、原則として共有する必要がありません。パスワードや認証コードは絶対に教えないでください。',
  },
];

export default async function GenshinArcana() {
  const summary = await readExchangeSummary();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '原神 月諭アルカナ交換のやり方｜募集・相手の探し方',
    description:
      '原神の月諭アルカナ交換をする前に必要な準備と、条件の合う相手の探し方を解説します。',
    datePublished: '2026-09-05',
    dateModified: '2026-09-22',
    author: { '@type': 'Organization', name: 'ARCANA LINK運営' },
    publisher: { '@type': 'Organization', name: 'ARCANA LINK' },
    mainEntityOfPage: 'https://arcana-card-link.pages.dev/genshin-arcana',
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArticleShell
        kicker="GENSHIN ARCANA GUIDE"
        title="原神 月諭のアルカナ交換方法"
        lead="月諭のアルカナで欲しい一枚を探したい人へ。交換前の準備、条件の登録、実際にフレンドと交換するまでの流れをまとめました。"
        path="genshin-arcana"
      >
        <section aria-labelledby="service-answer">
          <h2 id="service-answer">アルカナ交換相手はどう探す？</h2>
          <p>ARCANA LINKは、原神「月諭のアルカナ」の交換相手を探す非公式ツールです。サーバーを選び、22種類の所持数を登録すると、同じサーバーでお互いの求・譲が一致する公開募集を確認できます。実際のカード交換は原神のゲーム内で行います。</p>
          <p>0枚は「求」、2枚以上は「譲」として判定します。「完全マッチ」は登録条件の一致であり、相手の承諾や交換成立を保証するものではありません。</p>
          <nav className="seo-actions"><a href="/#inventory">カードを登録して相手を探す</a><a href="/guide#match">具体例で完全マッチを確認する</a></nav>
        </section>
        <nav className="toc">
          <b>このページの内容</b>
          <a href="#what">原神の月諭アルカナとは</a>
          <a href="#before">交換相手を探す前に確認すること</a>
          <a href="#find">アルカナ交換の募集を探す方法</a>
          <a href="#exchange-status">現在の交換状況</a>
          <a href="#steps">交換完了までの手順</a>
          <a href="#cant-find-partner">相手が見つからないとき</a><a href="#uid">UIDとサーバー</a><a href="#complete-guide">22種類の整理</a><a href="#faq">よくある質問</a>
        </nav>
        {summary && <ExchangeInsights locale="ja" summary={summary} />}
        <section id="what">
          <h2>原神の月諭アルカナとは</h2>
          <p>
            月諭のアルカナは、原神の幻想シアターにある月諭モードで入手するコレクション要素です。アルカナは22種類あり、収集が進むとすでに持っている種類が重複することがあります。そのようなときは、予備を持つフレンドと条件が合えばカードを交換できます。
          </p>
          <p>
            実際の交換はウェブサイト上ではなく、フレンドと同じ世界に入ったマルチプレイ中に行います。ARCANA
            LINKの役割は、その前段階となる「お互いの条件が合う相手を見つけること」です。
          </p>
          <p>
            入手条件を先に確認したい場合は、<a href="/genshin-arcana/lunar-mode">幻想シアター月諭モードの攻略とアルカナ入手手順</a>を確認してください。
          </p>
        </section>
        <section id="before">
          <h2>交換相手を探す前に確認すること</h2>
          <p>
            最初にゲーム内で所持状況を確認し、22種類それぞれを「未所持・1枚・2枚・3枚以上」で登録します。未所持は欲しいカード、2枚以上は交換に出せるカードとしてARCANA
            LINKが自動判定します。
          </p>
          <div className="checklist">
            <b>登録前の確認リスト</b>
            <ul>
              <li>22種類それぞれの現在の所持枚数</li>
              <li>交換完了後に残したいカードが1枚あるか</li>
              <li>Asia、America、Europeなどのサーバー</li>
              <li>フレンド検索に使うUID</li>
              <li>マルチプレイで合流できる時間</li>
            </ul>
          </div>
        </section>
        <section id="find">
          <h2>原神のアルカナ交換募集を探す方法</h2>
          <p>
            同じサーバーを選択して所持数を登録すると、双方の欲しいカードと出せるカードを自動比較します。過去7日以内に更新された受付中募集から、相互に条件が一致する「完全マッチ」を優先表示します。
          </p>
          <ol className="numbered">
            <li>
              <b>22枚の所持数を登録する</b>
              <span>未所持と重複カードが自動的に判定されます。</span>
            </li>
            <li>
              <b>完全マッチを確認する</b>
              <span>
                あなたが渡すカードと、もらうカードが一画面に表示されます。
              </span>
            </li>
            <li>
              <b>同じサーバーに絞る</b>
              <span>マルチプレイで合流できる相手だけを表示します。</span>
            </li>
            <li>
              <b>UIDをコピーして原神で検索する</b>
              <span>
                原神でUID検索 → フレンド申請の順に進み、交換内容を再確認します。
              </span>
            </li>
          </ol>
          <p>
            <a href="/">アルカナ交換のマッチングを開く →</a>
          </p>
        </section>
        <section id="steps">
          <h2>フレンドとアルカナを交換する手順</h2>
          <p>
            条件が合ったらUIDからフレンド申請を行い、交換するカードと合流時間を確認します。マルチプレイで同じ世界に合流した後、ゲーム内の交換機能でお互いにカードを選択します。確定ボタンを押す前に、種類と枚数が事前の約束と合っているかを両者で確認しましょう。
          </p>
          <p>
            パスワードや認証コードは交換に必要ありません。これらの情報を求められた場合は交換を中止し、アカウントの安全を優先してください。
          </p>
        </section>
        <section id="cant-find-partner">
          <h2>交換相手が見つからないときの確認順</h2>
          <p>まずサーバーを確認し、次に所持数をゲーム内の最新状態に合わせてください。欲しいカードが相手にあっても、相手の欲しいカードを自分が出せなければ完全マッチにはなりません。</p>
          <ol><li>「求」は0枚、「譲」は2枚以上として入力する。</li><li>同じサーバーの募集で、双方が渡せるカードを確認する。</li><li>公開募集を更新する。7日以上更新のない募集は候補から外れます。</li><li>交換表をXやnoteから共有して、自分の条件に合う人を募る。</li></ol>
          <p>募集がないときは、成立を保証する数字やサンプルを実際の相手と見なさず、新しい募集を待ちましょう。</p>
          <a href="/genshin-arcana/exchange-table">求・譲の交換表を作る →</a>
        </section>
        <section id="uid"><h2>UIDとサーバーを安全に伝える</h2><p>UIDは原神内で相手を検索するために使います。言語設定からサーバーを推測せず、ゲーム内の表示を確認してください。共有URL・X本文・交換表の画像にはUIDを含めません。公開募集への登録時のみ、交換相手にUIDが表示されることを確認して保存してください。</p></section>
        <section id="complete-guide"><h2>22種類コンプリートに向けた所持数の整理</h2><p>1枚だけ持っているカードはコレクション用として残し、2枚以上ある種類を交換候補にします。交換が完了したら、渡した種類を減らし、受け取った種類を増やして再確認しましょう。未所持が減るほど条件が限定されるので、足りないカードの個別ページからサーバー別の募集状況も確認できます。</p><a href="/arcana">22種類一覧から不足カードを見る →</a></section>
        <section id="faq">
          <h2>原神のアルカナ交換に関するよくある質問</h2>
          <div className="faq">
            {faq.map((x) => (
              <div key={x.q}>
                <h3>{x.q}</h3>
                <p>{x.a}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>本ページの編集方針</h2>
          <p>
            このページは、交換をする人が必要とする手順と安全上の注意点をARCANA
            LINK運営が独自に整理したものです。第三者の画像、ロゴ、音楽、物語文、キャラクター素材は掲載していません。当サイトは非公式であり、対象ゲームの開発・運営会社とは関係ありません。
          </p>
        </section>
        <p className="updated">公開日：2026年9月5日 / 最終更新：2026年9月22日</p>
      </ArticleShell>
    </>
  );
}
