/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import type { Metadata } from 'next';
import { ArticleShell } from '@/components/public-shell';
import { arcanaCards, cardSlugById } from '@/lib/arcana-cards';
import { cardNames, languageAlternates, romans } from '@/lib/site-i18n';
export const metadata: Metadata = {
  title: '原神 月諭アルカナ全22種類一覧｜交換ページ付き | ARCANA LINK',
  description:
    '原神「月諭のアルカナ」全22種類を一覧で確認。各アルカナの交換募集ページから、探している人・出せる人を確認できます。',
  alternates: { canonical: '/arcana', languages: languageAlternates('arcana') },
};
export default function Arcana() {
  return (
    <ArticleShell
      kicker="COLLECTION"
      title="原神 月諭アルカナ全22種類一覧"
      lead="交換募集で使う名称を、アルカナ番号順に確認できます。似た名称の入力間違い防止にお使いください。"
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
        <a href="/">手持ちから交換相手をマッチング →</a>
        <a href="/genshin-arcana/lunar-mode">幻想シアター月諭モードの入手条件 →</a>
      </aside>
    </ArticleShell>
  );
}
