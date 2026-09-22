/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';
import { arcanaCards, cardSlugById } from '@/lib/arcana-cards';
import { cardNames, languageAlternates, romans } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title:
    '原神 月諭のアルカナ22種類一覧｜カード名・番号・交換状況 | ARCANA LINK',
  description:
    '原神「月諭のアルカナ」全22種類を番号順に一覧掲載。各カードの名称と現在の交換状況を確認し、不足カードの交換相手を探せます。',
  alternates: { canonical: '/arcana', languages: languageAlternates('arcana') },
  openGraph: {
    title: '原神 月諭のアルカナ22種類一覧｜カード名・番号・交換状況',
    description:
      '月諭のアルカナ全22種類を番号順に確認し、カード別の交換状況へ進めます。',
    url: '/arcana',
  },
  twitter: {
    card: 'summary',
    title: '原神 月諭のアルカナ22種類一覧 | ARCANA LINK',
  },
};
export default function Arcana() {
  return (
    <ArticleShell
      kicker="COLLECTION"
      title="原神 月諭のアルカナ22種類一覧｜番号・名称・交換状況"
      lead="原神「月諭のアルカナ」全22種類を番号順に確認できます。不足しているカードや重複カードを確認し、各カードページから現在の交換状況や交換相手を探せます。"
      path="arcana"
    >
      <section>
        <h2>交換時の名称確認</h2>
        <p>
          当サイトが対応するコレクションカードは全22種類です。ARCANA
          LINKでは、同じ番号のカードが重複しないよう、番号と日本語名の組み合わせで管理しています。相手とやり取りするときも、名称だけでなく番号まで確認すると安心です。
        </p>
      </section>
      <div className="arcana-catalog">
        {arcanaCards.map((card, index) => (
          <a href={`/genshin-arcana/${cardSlugById[card.id]}`} key={card.id}>
            <span>{romans[index]}</span>
            <b>{cardNames.ja[card.id]}</b>
          </a>
        ))}
      </div>
      <section>
        <h2>収集を進めるコツ</h2>
        <h3>所持状況は毎回見直す</h3>
        <p>
          アルカナを新しく入手したり交換したりした後は、22枚の所持数を更新しましょう。未所持と交換可能な重複は自動的に再計算されます。
        </p>
        <h3>一枚に絞り込みすぎない</h3>
        <p>
          複数の欲しいカードと予備カードをまとめて登録すると、交換が成立する候補が増えます。ただし、実際に出せる枚数以上の約束をしないようにしましょう。
        </p>
      </section>
      <aside className="related">
        <h2>すぐに探す</h2>
        <a href="/genshin-arcana">月諭アルカナの交換方法を確認 →</a>
        <a href="/">22種類を登録して交換相手を探す →</a>
        <a href="/genshin-arcana/exchange-table">求・譲の交換表を作る →</a>
        <a href="/genshin-arcana/lunar-mode">
          幻想シアター月諭モードの入手条件 →
        </a>
      </aside>
    </ArticleShell>
  );
}
