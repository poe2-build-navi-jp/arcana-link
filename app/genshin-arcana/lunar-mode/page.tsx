/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';

const canonical = '/genshin-arcana/lunar-mode';

export const metadata: Metadata = {
  title: '原神 幻想シアターの月諭モード｜アルカナ入手条件・手順 | ARCANA LINK',
  description:
    '原神の幻想シアター「月諭モード」で月諭のアルカナを入手する条件を解説。参加条件、アルカナ挑戦、10幕クリアまでの確認点と、入手できない時のチェック項目をまとめています。',
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: '原神 幻想シアターの月諭モード｜アルカナ入手条件・手順',
    description:
      '月諭モードの参加条件、アルカナ挑戦、10幕クリアまでの確認点を整理。',
    type: 'article',
    locale: 'ja_JP',
    url: canonical,
  },
  twitter: {
    card: 'summary',
    title: '原神 幻想シアターの月諭モード｜アルカナ入手条件・手順',
    description: '月諭のアルカナを入手するまでの条件と確認手順を解説。',
  },
};

const faq = [
  {
    question: '月諭モードをクリアするだけでアルカナを入手できますか？',
    answer:
      '第十幕のクリアだけではなく、すべてのアルカナ挑戦を完了している必要があります。公式告知では、両方を満たすと月諭のアルカナを引けると案内されています。',
  },
  {
    question: '月諭モードが表示されないのはなぜですか？',
    answer:
      '一つ前の難易度のクリア状況、編成できるキャラクター数、キャラクターレベルなどの参加条件を確認してください。現在の不足条件はゲーム内の編成画面に表示されます。',
  },
  {
    question: '月諭のアルカナが重複したらどうすればよいですか？',
    answer:
      'コレクション用の1枚を残し、2枚以上ある種類を交換候補として整理できます。ARCANA LINKでは同じサーバーの求・譲が相互に合う相手を探せます。',
  },
];

export default function LunarModeGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: '原神 幻想シアターの月諭モード｜アルカナ入手条件・手順',
        description:
          '幻想シアター月諭モードの参加条件と、月諭のアルカナを入手するまでの確認手順。',
        datePublished: '2026-09-19',
        dateModified: '2026-09-26',
        citation: 'https://genshin.hoyoverse.com/ja/news/detail/159349',
        inLanguage: 'ja',
        author: { '@type': 'Organization', name: 'ARCANA LINK運営', url: 'https://arcana-card-link.pages.dev/about' },
        publisher: { '@type': 'Organization', name: 'ARCANA LINK' },
        mainEntityOfPage: `https://arcana-card-link.pages.dev${canonical}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ARCANA LINK',
            item: 'https://arcana-card-link.pages.dev/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '原神 月諭アルカナ交換',
            item: 'https://arcana-card-link.pages.dev/genshin-arcana',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '幻想シアター月諭モード攻略',
            item: `https://arcana-card-link.pages.dev${canonical}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArticleShell
        kicker="IMAGINARIUM THEATER"
        title="原神 幻想シアターの月諭モードとアルカナ入手方法"
        lead="月諭のアルカナを取り逃さないために、参加前の準備からアルカナ挑戦、10幕クリア後の確認までを順番に整理します。"
        path="genshin-arcana"
      >
        <section aria-labelledby="theater-answer">
          <h2 id="theater-answer">幻想シアターでアルカナを入手するには？</h2>
          <p>原神の幻想シアターでは、月諭モードですべての「アルカナ挑戦」を完了し、第十幕をクリアすると「月諭のアルカナ」を引けます。公演を進めるだけでなく、途中に発生するアルカナ挑戦を完了しているかが確認点です。</p>
          <p>出典：<a href="https://genshin.hoyoverse.com/ja/news/detail/159349">原神公式「Luna Ⅰ」バージョンアップのお知らせ</a>（入手条件・交換仕様）。</p>
          <dl>
            <dt><b>幻想シアター</b></dt><dd>出演条件に合うキャラクターで公演を進める原神の戦闘コンテンツ。</dd>
            <dt><b>月諭モード</b></dt><dd>幻想シアターの難易度の一つ。アルカナ入手の対象モード。</dd>
            <dt><b>アルカナ挑戦</b></dt><dd>月諭モード中に発生する挑戦イベント。集めるカードそのものとは異なる。</dd>
            <dt><b>月諭のアルカナ</b></dt><dd>条件を満たして入手するコレクション。<a href="/arcana">22種類の番号・名称一覧</a>で所持状況を整理できる。</dd>
          </dl>
        </section>
        <nav className="toc">
          <b>このページの内容</b>
          <a href="#conditions">月諭モードの参加条件</a>
          <a href="#get-arcana">アルカナの入手手順</a>
          <a href="#challenge">アルカナ挑戦の注意点</a>
          <a href="#missing">入手できない時の確認</a>
          <a href="#next-action">今の状態から次にすること</a>
          <a href="#after">重複したアルカナの整理</a>
          <a href="#faq">よくある質問</a>
        </nav>

        <section>
          <h2>月諭モードと月諭のアルカナ</h2>
          <p>
            月諭モードは、原神の幻想シアターに用意された高難度の公演です。条件を満たして公演とアルカナ挑戦を完了すると、コレクション要素である「月諭のアルカナ」を獲得できます。
          </p>
          <p>
            幻想シアター全般の編成例ではなく、ここではアルカナ獲得に必要な確認点へ絞っています。開催期によって対象元素や使用できるキャラクターが変わるため、当期の出場条件は必ずゲーム内で確認してください。
          </p>
        </section>

        <section id="conditions">
          <h2>幻想シアター月諭モードの参加条件</h2>
          <p>
            月諭モードへ進む前に、直前の難易度をクリアし、出場可能なキャラクターを必要数そろえる必要があります。必要人数・レベル・開幕キャストや特別招待キャストの扱いは、開催期の編成画面で確認してください。
          </p>
          <div className="checklist">
            <b>挑戦前チェック</b>
            <ul>
              <li>マスターモードのクリア状況を確認する</li>
              <li>当期の対象元素と出場可能キャラクターを確認する</li>
              <li>必要なレベルと編成人数を参加画面で確認する</li>
              <li>主力を序盤だけで使い切らないよう役割を分ける</li>
              <li>ゲーム内の月諭モード報酬条件を読み直す</li>
            </ul>
          </div>
        </section>

        <section id="get-arcana">
          <h2>月諭のアルカナ入手までの手順</h2>
          <ol className="numbered">
            <li>
              <b>月諭モードで公演を開始する</b>
              <span>通常・ハード・マスターではなく、月諭モードを選んだことを確認します。</span>
            </li>
            <li>
              <b>公演を進めて活力を消費する</b>
              <span>仲間を使いながら幕を進め、アルカナ挑戦の出現状況を確認します。</span>
            </li>
            <li>
              <b>アルカナ挑戦を2回完了する</b>
              <span>通常戦だけでなくボス戦になる挑戦もあるため、対応できるキャラクターを残します。</span>
            </li>
            <li>
              <b>第10幕をクリアする</b>
              <span>アルカナ挑戦の達成状態を確認してから、最終幕まで公演を完了します。</span>
            </li>
            <li>
              <b>報酬画面で受け取りを確認する</b>
              <span>所持一覧を開き、新しく追加されたアルカナの種類まで確認します。</span>
            </li>
          </ol>
        </section>

        <section id="challenge">
          <h2>アルカナ挑戦を取り逃さないための注意点</h2>
          <p>
            アルカナ挑戦は通常の幕とは別に表示されます。出現を確認しないまま終盤へ進むと、主力の活力が足りず挑戦しにくくなる場合があります。公演の途中で挑戦の解放状況を確認し、対応できる編成を残しておくのが安全です。
          </p>
          <p>
            星の獲得数を狙う進行と、アルカナ獲得条件を満たす進行では、活力の配分が変わることがあります。一度ですべてを達成しにくい場合は、ゲーム内で再挑戦時の条件を確認し、目的を分けて進めてください。
          </p>
        </section>

        <section id="missing">
          <h2>月諭のアルカナを入手できない時の確認順</h2>
          <ol>
            <li>挑戦した難易度が「月諭モード」だったか。</li>
            <li>アルカナ挑戦を必要回数完了したか。</li>
            <li>アルカナ挑戦の達成後に第10幕までクリアしたか。</li>
            <li>当期分の報酬をすでに受け取っていないか。</li>
            <li>イベント画面や所持一覧に受け取り表示が残っていないか。</li>
          </ol>
          <p>
            アップデートで条件や表記が変わった場合は、ゲーム内に表示される最新の説明を優先してください。
          </p>
        </section>

        <section id="next-action">
          <h2>シアターの進行状況から次にすること</h2>
          <p>入手前と入手後では確認する内容が違います。今の状態に合う手順へ進んでください。</p>
          <ul>
            <li><b>月諭モードへ進めない：</b><a href="#conditions">参加条件</a>でクリア状況・出場条件を確認。</li>
            <li><b>第十幕をクリアしたが引けない：</b><a href="#missing">アルカナ挑戦と当期の受け取り状況</a>を確認。</li>
            <li><b>所持カードを整理したい：</b><a href="/arcana">全22種類一覧</a>で不足・重複を確認。</li>
            <li><b>同じカードが余った：</b><a href="/genshin-arcana#steps">月諭の箱を使う交換方法</a>を確認し、<a href="/#inventory">交換相手を探す</a>。</li>
            <li><b>交換相手が見つからない：</b><a href="/genshin-arcana/exchange-table">求・譲の交換表</a>を作って募集条件を共有。</li>
          </ul>
          <p>募集数・求人数・譲人数はARCANA LINK内の登録データです。原神の全プレイヤーの所持率や、ゲーム内の抽選確率を示すものではありません。</p>
        </section>
        <section id="after">
          <h2>重複したアルカナは交換候補にする</h2>
          <p>
            月諭のアルカナは全22種類です。同じ種類を2枚以上持っている場合は、コレクション用の1枚を残し、余った分を交換候補として整理できます。ARCANA LINKでは22種類の所持数を入力すると、「求」と「譲」を自動判定し、同じサーバーで双方の条件が合う相手を優先表示します。
          </p>
          <nav className="seo-actions">
            <a href="/#inventory">22種類を登録して相手を探す</a>
            <a href="/arcana">月諭アルカナ全22種類を見る</a>
            <a href="/genshin-arcana/exchange-table">求・譲の交換表を作る</a>
          </nav>
        </section>

        <section id="faq">
          <h2>幻想シアター月諭モードのよくある質問</h2>
          <div className="faq">
            {faq.map((item) => (
              <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>出典・情報の確認方針</h2>
          <p>編集：<a href="/about">ARCANA LINK運営</a>。公式の基本仕様と、当サイトが提案する確認順・所持数の整理方法を区別して掲載しています。<a href="/contact">お問い合わせ・訂正依頼</a>も受け付けています。</p>
          <p>
            本ページは、幻想シアターからアルカナ交換へ進む人が迷いやすい条件をARCANA LINK運営が独自に整理したものです。開催期やアップデートで変わる対象元素、敵、キャラクター条件は固定情報として掲載せず、ゲーム内の最新表示を優先します。当サイトは非公式であり、対象ゲームの開発・運営会社とは関係ありません。
          </p>
        </section>
        <p className="updated">公開日：2026年9月19日 / 最終更新：2026年9月26日</p>
      </ArticleShell>
    </>
  );
}
