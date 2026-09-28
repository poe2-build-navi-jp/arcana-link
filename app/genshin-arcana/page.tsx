/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ExchangeInsights } from '@/components/exchange-insights';
import { ArticleShell } from '@/components/public-shell';
import { SeoFigure } from '@/components/seo-figure';
import { readExchangeSummary } from '@/lib/arcana-db';
import { languageAlternates } from '@/lib/site-i18n';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '原神 月諭アルカナ交換のやり方｜募集・相手の探し方 | ARCANA LINK',
  description:
    '原神の月諭アルカナ交換は、同じサーバーのフレンドとマルチプレイ中に「月諭の箱」を使います。交換条件、操作手順、交換できないときの確認点と、求・譲が合う相手の探し方を解説。',
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
    a: '幻想シアターの月諭モードで、すべてのアルカナ挑戦を完了してから第十幕をクリアすると、月諭のアルカナを引けます。開催期ごとの詳細はゲーム内の報酬表示で確認してください。',
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
    q: '原神のアルカナ交換には何が必要ですか？',
    a: '同じサーバーのフレンド、交換するアルカナ、ゲーム内アイテム「月諭の箱」を確認します。マルチプレイで同じ世界に入り、塵歌壺の外で箱から交換招待を送ります。',
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
    dateModified: '2026-09-29T00:08:24+09:00',
    image: 'https://arcana-card-link.pages.dev/images/arcana-trade-reciprocal-match.svg',
    citation: 'https://genshin.hoyoverse.com/ja/news/detail/159349',
    inLanguage: 'ja',
    author: { '@type': 'Organization', name: 'ARCANA LINK運営', url: 'https://arcana-card-link.pages.dev/about' },
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
        title="原神 月諭のアルカナ交換方法・条件"
        lead="原神の月諭アルカナは、同じサーバーのフレンドとマルチプレイ中に「月諭の箱」を使って交換します。交換場所は塵歌壺の外です。準備・操作手順・交換できないときの確認点を順番に案内します。"
        path="genshin-arcana"
      >
        <section aria-labelledby="arcana-answer">
          <h2 id="arcana-answer">原神のアルカナとは？入手・交換の要点</h2>
          <p>原神「月諭のアルカナ」は、幻想シアターの月諭モードで集める全22種類のコレクションです。すべてのアルカナ挑戦を終えて第十幕をクリアすると抽選でき、フレンドとの交換にはゲーム内アイテム「月諭の箱」を使います。</p>
          <ul>
            <li><b>入手：</b>月諭モードでアルカナ挑戦をすべて完了し、第十幕をクリアする。</li>
            <li><b>交換：</b>同じサーバーのフレンドとマルチプレイ中に「月諭の箱」を使う。塵歌壺の中は対象外。</li>
            <li><b>相手探し：</b>足りない種類と余っている種類を整理し、お互いの求・譲が合う人を探す。</li>
          </ul>
          <p>入手・交換仕様の出典：<a href="https://genshin.hoyoverse.com/ja/news/detail/159349">原神公式「Luna Ⅰ」バージョンアップのお知らせ</a>。開催期ごとの条件はゲーム内表示を優先してください。</p>
          <nav className="seo-actions"><a href="/genshin-arcana/lunar-mode">幻想シアターの入手条件を確認する</a><a href="/arcana">番号順に22種類を見る</a></nav>
        </section>
        <section aria-labelledby="service-answer">
          <h2 id="service-answer">アルカナ交換相手はどう探す？</h2>
          <p>ARCANA LINKは、原神「月諭のアルカナ」の交換相手を探す非公式ツールです。サーバーを選び、22種類の所持数を登録すると、同じサーバーでお互いの求・譲が一致する公開募集を確認できます。実際のカード交換は原神のゲーム内で行います。</p>
          <p>0枚は「求」、2枚以上は「譲」として判定します。「完全マッチ」は登録条件の一致であり、相手の承諾や交換成立を保証するものではありません。</p>
          <nav className="seo-actions"><a href="/#inventory">カードを登録して相手を探す</a><a href="/guide#match">具体例で完全マッチを確認する</a></nav>
        </section>
        <SeoFigure
          src="/images/arcana-trade-reciprocal-match.svg"
          alt="月諭アルカナ交換で22種類の所持数を登録し、同じサーバーの相手と双方の求・譲を照合して完全マッチを探す流れ"
          caption="交換条件の例です。実際の募集人数や交換成立を示すものではありません。"
          width={1200}
          height={790}
        />
        <nav className="toc">
          <b>このページの内容</b>
          <a href="#what">原神の月諭アルカナとは</a>
          <a href="#before">交換相手を探す前に確認すること</a>
          <a href="#conditions">アルカナの交換条件</a>
          <a href="#find">アルカナ交換の募集を探す方法</a>
          <a href="#exchange-status">現在の交換状況</a>
          <a href="#steps">交換完了までの手順</a>
          <a href="#cant-find-partner">相手が見つからないとき</a><a href="#uid">UIDとサーバー</a><a href="#complete-guide">22種類の整理</a><a href="#faq">よくある質問</a>
        </nav>
        {summary ? <ExchangeInsights locale="ja" summary={summary} /> : <section id="exchange-status"><h2>現在の交換状況</h2><p>現在、公開募集データを取得できません。募集が0件であることを示すものではありません。<a href="/">マッチング画面</a>で読み込み状況を確認してください。</p></section>}
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
        <section id="conditions">
          <h2>原神のアルカナを交換する条件</h2>
          <div className="seo-table-wrap">
            <table className="seo-table">
              <thead><tr><th scope="col">確認するもの</th><th scope="col">交換前の確認</th></tr></thead>
              <tbody>
                <tr><th scope="row">交換相手</th><td>同じサーバーのフレンドと交換します。相手のUIDとサーバーを確認してから申請します。</td></tr>
                <tr><th scope="row">合流する場所</th><td>マルチプレイで同じ世界に入り、塵歌壺の外で操作します。</td></tr>
                <tr><th scope="row">使うアイテム</th><td>ゲーム内の「月諭の箱」から、フレンドに交換招待を送ります。</td></tr>
                <tr><th scope="row">交換するカード</th><td>渡す種類・受け取る種類と枚数を両者で確認します。サイト上の所持数も最新に合わせます。</td></tr>
              </tbody>
            </table>
          </div>
          <p>ゲーム内の交換仕様の出典：<a href="https://genshin.hoyoverse.com/ja/news/detail/159349">原神公式「Luna Ⅰ」バージョンアップのお知らせ</a>。ARCANA LINKの「2枚以上を譲にする」という判定は、コレクション用の1枚を残すためのサイト側のルールです。</p>
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
          <ol>
            <li><b>求・譲を決める：</b>欲しいカードと渡せるカードを整理し、相手と交換する種類・枚数を確認します。<a href="/genshin-arcana/exchange-table">交換表</a>を使うと条件をまとめられます。</li>
            <li><b>フレンドになる：</b>同じサーバーであることを確認し、UIDからフレンド申請を行います。</li>
            <li><b>同じ世界に合流する：</b>合流時間を相談し、マルチプレイで合流します。塵歌壺の外へ移動してください。</li>
            <li><b>交換を招待する：</b>「月諭の箱」を使い、ゲーム内の案内に従ってフレンドへ交換招待を送ります。</li>
            <li><b>双方のカードを確認して確定する：</b>渡すカードと受け取るカードの種類・枚数を確認し、ゲーム内で交換します。</li>
            <li><b>所持数と募集を更新する：</b>交換後の枚数を確認してARCANA LINKにも反映します。募集を終える場合は状態を「終了」にします。</li>
          </ol>
          <p>
            パスワードや認証コードは交換に必要ありません。これらの情報を求められた場合は交換を中止し、アカウントの安全を優先してください。
          </p>
        </section>
        <section id="cant-find-partner">
          <h2>アルカナ交換ができない・相手が見つからないとき</h2>
          <p>まずサーバーを確認し、次に所持数をゲーム内の最新状態に合わせてください。欲しいカードが相手にあっても、相手の欲しいカードを自分が出せなければ完全マッチにはなりません。</p>
          <div className="seo-table-wrap">
            <table className="seo-table">
              <thead><tr><th scope="col">今の状態</th><th scope="col">次に確認すること</th></tr></thead>
              <tbody>
                <tr><th scope="row">相手と合流できない</th><td>サーバーとフレンド登録を確認します。サイトの表示言語を変えてもゲームのサーバーは変わりません。</td></tr>
                <tr><th scope="row">ゲーム内で交換を始められない</th><td>マルチプレイで同じ世界にいるか、塵歌壺の外か、「月諭の箱」から招待しているかを確認します。エラーが表示されたら、その内容を確認してください。</td></tr>
                <tr><th scope="row">完全マッチが0件</th><td>0枚が求、2枚以上が譲として登録されているかを確認します。条件が正しければ募集を公開し、交換表を共有して次の候補を待てます。</td></tr>
                <tr><th scope="row">自分の募集が候補に出ない</th><td>公開保存が完了したか、状態が受付中か、更新から7日以上たっていないかを確認します。実際の所持数を確認して募集を更新してください。</td></tr>
                <tr><th scope="row">募集の読み込みエラー</th><td>候補0件とは異なり、データを確認できていない状態です。通信状態を確認して再読み込みします。</td></tr>
              </tbody>
            </table>
          </div>
          <p><b>条件の例：</b>求・譲が次の種類だけの場合、自分が「求：世界／譲：魔術師」、同じサーバーの相手が「求：魔術師／譲：世界」なら相互に一致します。相手の求が「月」だけなら、自分は渡せるカードがないため完全マッチにはなりません。この例は実際の募集データではありません。</p>
          <nav className="seo-actions"><a href="/#inventory">所持数を登録して交換相手を探す</a><a href="/genshin-arcana/exchange-table">求・譲の交換表を作る</a><a href="/guide#publish">募集の公開・更新方法を確認する</a></nav>
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
          <p>編集：<a href="/about">ARCANA LINK運営</a>。ゲーム仕様は上記公式告知、求・譲や7日の募集期限は当サイトの仕様に基づきます。記載に誤りがある場合は<a href="/contact">お問い合わせ・訂正依頼</a>からお知らせください。</p>
          <p>
            このページは、交換をする人が必要とする手順と安全上の注意点をARCANA
            LINK運営が独自に整理したものです。第三者の画像、ロゴ、音楽、物語文、キャラクター素材は掲載していません。当サイトは非公式であり、対象ゲームの開発・運営会社とは関係ありません。
          </p>
        </section>
        <p className="updated">公開日：2026年9月5日 / 最終更新：2026年9月29日</p>
      </ArticleShell>
    </>
  );
}
