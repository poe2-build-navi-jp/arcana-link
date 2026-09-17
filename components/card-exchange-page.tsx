/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { ArticleShell } from '@/components/public-shell';
import { cardBySlug, arcanaCards } from '@/lib/arcana-cards';
import { readCardStats } from '@/lib/arcana-db';
import { notFound } from 'next/navigation';
import { serverRegions, serverLabels } from '@/lib/server-region';
import { PageEvent } from '@/components/page-event';
import { cardStructuredData } from '@/lib/card-seo';
import {
  cardNames,
  localizedPath,
  romans,
  type SiteLocale,
} from '@/lib/site-i18n';

export async function CardExchangePage({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: string;
}) {
  const card = cardBySlug[slug];
  if (!Object.hasOwn(cardBySlug, slug) || !card) notFound();
  const index = Object.values(cardBySlug).findIndex(
    (item) => item.slug === slug,
  );
  const name = cardNames[locale][card.id];
  const stats = await readCardStats(card.id);
  const wanting = stats?.reduce((sum,row)=>sum+row.wanting,0) ?? null;
  const offering = stats?.reduce((sum,row)=>sum+row.offering,0) ?? null;
  const updated = stats?.map(row=>row.updated).sort().at(-1);
  const ui = locale === 'ja' ? {collecting:'データ収集中',noWanting:`現在「${name}」の公開募集はありません。${name}を探している場合は、所持状況を登録すると交換募集に参加できます。`,noOffering:`現在「${name}」を交換に出せる公開ユーザーはいません。2枚以上持っている場合は、交換候補として登録できます。`,want:`${name}を探す`,offer:`${name}を出せる`,server:'サーバー別の公開募集',scope:'過去7日以内に更新された受付中の募集を集計。交渉中・終了・期限切れは含みません。人数は登録プロフィール数です。',updated:'最終更新',dataset:'ARCANA LINK登録データ',none:'まだ募集はありません',recent:'直近24時間に更新された募集',links:'交換を進める',guide:'交換ガイド',match:'自動マッチ',all:'22種類一覧',related:'ほかのカードの交換状況'} : locale === 'en' ? {collecting:'Collecting data',noWanting:`There are no public listings seeking ${name}. Register your collection to join.`,noOffering:`No public user is currently offering ${name}. Register it if you have two or more copies.`,want:`Find ${name}`,offer:`Offer ${name}`,server:'Listings by server',scope:'Open profiles updated within 7 days. Negotiating, closed and expired profiles are excluded. Counts represent profiles.',updated:'Last update',dataset:'ARCANA LINK listing data',none:'No listings yet',recent:'Listings updated in the last 24 hours',links:'Continue trading',guide:'Exchange guide',match:'Auto matching',all:'All 22 cards',related:'Other cards'} : {collecting:'数据收集中',noWanting:`目前没有寻找“${name}”的公开招募。登记持有情况即可参加。`,noOffering:`目前没有可提供“${name}”的公开用户。持有2张以上时可以登记。`,want:`寻找${name}`,offer:`提供${name}`,server:'各服务器公开招募',scope:'统计7天内更新且可交换的个人资料，不含协商中、已结束或过期招募。人数代表资料数。',updated:'最后更新',dataset:'ARCANA LINK登记数据',none:'暂无招募',recent:'24小时内更新的招募',links:'继续交换',guide:'交换指南',match:'自动匹配',all:'22种圣牌',related:'其他圣牌'};
  const copy = {
    ja: {
      kicker: '原神 月諭アルカナ交換',
      title: `「${name}」のアルカナ交換募集`,
      lead: `「${name}」を探している人と、交換に出せる人を相互条件で見つけるための専用ページです。`,
      want: `${name}を探している人`,
      offer: `${name}を出せる人`,
      heading: `${name}を交換で入手するには`,
      intro: `自分の22枚の所持数を登録すると、「${name}」が未所持なら欲しいカードとして自動判定されます。2枚以上持っているカードは交換候補となり、相手の不足カードと一致した完全マッチが優先表示されます。`,
      examples: '現在の交換条件例',
      points: [
        `${name}を出せる → あなたの重複カードが欲しい`,
        `あなたが${name}を受け取る → 相手の不足カードを渡す`,
        '同じサーバーで、交換受付中の相手だけを確認する',
      ],
      action: '22枚を登録して交換相手を探す →',
      faq: `${name}が出ないときは`,
      faqText:
        '収集状況には偏りが生じることがあります。同じカードを繰り返し狙うより、手元の重複カードを登録して相互交換できる相手を待つ方が効率的です。',
      safety: '交換前に確認すること',
      safetyText:
        '原神でUID検索を行い、フレンド申請後に交換内容を再確認してください。パスワード、認証コード、金銭は交換に必要ありません。',
    },
    en: {
      kicker: 'LUNAR ARCANA EXCHANGE',
      title: `${name} Lunar Arcana Trade Listings`,
      lead: `A dedicated page for finding collectors who need or can offer ${name}.`,
      want: `Players looking for ${name}`,
      offer: `Players offering ${name}`,
      heading: `How to trade for ${name}`,
      intro: `Register the count of all 22 cards. If ${name} is missing, it becomes a wanted card automatically. Cards with two or more copies become offers, and exact two-way matches appear first.`,
      examples: 'Current exchange examples',
      points: [
        `They offer ${name} and need one of your duplicates`,
        `You receive ${name} and give a card they are missing`,
        'Review only active collectors on the same server',
      ],
      action: 'Register all 22 cards and find a match →',
      faq: `What if ${name} does not drop?`,
      faqText:
        'Collection results can be uneven. Instead of repeatedly targeting one card, register your duplicates and wait for a two-way match.',
      safety: 'Check before exchanging',
      safetyText:
        'Search the UID in the game, send a friend request, and confirm both cards again. A password, verification code, or payment is never required.',
    },
    'zh-cn': {
      kicker: '原神月谕圣牌交换',
      title: `“${name}”月谕圣牌交换招募`,
      lead: `用于查找需要“${name}”或可提供该圣牌玩家的专属页面。`,
      want: `正在寻找“${name}”的玩家`,
      offer: `可提供“${name}”的玩家`,
      heading: `如何交换获得“${name}”`,
      intro: `登记22种圣牌的持有数量后，如果缺少“${name}”，系统会自动将其设为想要的圣牌。持有2张以上的圣牌会成为可交换项，并优先显示双方条件一致的完全匹配。`,
      examples: '当前交换条件示例',
      points: [
        `对方可提供“${name}”，并需要你的重复圣牌`,
        `你获得“${name}”，向对方提供其缺少的圣牌`,
        '仅查看同一服务器且处于可交换状态的玩家',
      ],
      action: '登记22种圣牌并查找匹配 →',
      faq: `一直无法获得“${name}”怎么办？`,
      faqText:
        '收集结果可能会有偏差。与其反复获取同一种圣牌，不如登记重复圣牌并等待双方条件一致的交换。',
      safety: '交换前请确认',
      safetyText:
        '在游戏中搜索UID、发送好友申请，并再次确认双方圣牌。交换不需要密码、验证码或付款。',
    },
  }[locale];
  const structuredData = cardStructuredData(locale, slug);
  return (
    <>
      <PageEvent event="card_page_view" card={slug}/>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ArticleShell
        kicker={copy.kicker}
        title={copy.title}
        lead={copy.lead}
        locale={locale}
        path={`genshin-arcana/${slug}`}
      >
        <section className="card-seo-summary">
          <div className="card-seo-symbol">
            <span>{romans[index]}</span>
            <strong>{card.symbol}</strong>
            <b>{name}</b>
          </div>
          <div>
            <small>{copy.want}</small>
            <strong>{wanting ?? ui.collecting}</strong>
          </div>
          <div>
            <small>{copy.offer}</small>
            <strong>{offering ?? ui.collecting}</strong>
          </div>
        </section>
        <section>
          <p>{ui.scope}</p>
          {wanting === 0 && <p className="seo-empty">{ui.noWanting}</p>}
          {offering === 0 && <p className="seo-empty">{ui.noOffering}</p>}
          <div className="seo-actions"><a className="card-seo-action" href={`${localizedPath(locale)}?card=${slug}&intent=want#inventory`}>{ui.want}</a><a className="card-seo-action" href={`${localizedPath(locale)}?card=${slug}&intent=offer#inventory`}>{ui.offer}</a></div>
          <h2>{ui.server}</h2>
          <div className="seo-table-wrap"><table className="seo-table"><thead><tr><th>Server</th><th>{copy.want}</th><th>{copy.offer}</th><th>{ui.updated}</th></tr></thead><tbody>{serverRegions.map(server=>{
            const rows=stats?.filter(row=>row.server===server);
            const last=rows?.map(row=>row.updated).sort().at(-1);
            return <tr key={server}><th><a href={`${localizedPath(locale)}?server=${server}&card=${slug}#inventory`}>{serverLabels.en[server]}</a></th><td>{rows ? rows.reduce((sum,row)=>sum+row.wanting,0) : ui.collecting}</td><td>{rows ? rows.reduce((sum,row)=>sum+row.offering,0) : ui.collecting}</td><td>{last ? <time dateTime={last}>{new Date(last).toLocaleDateString(locale,{timeZone:'Asia/Tokyo'})}</time> : '—'}</td></tr>;
          })}</tbody></table></div>
          <p>{ui.recent}：{stats ? stats.reduce((sum,row)=>sum+row.recent,0) : ui.collecting}</p>
          <p><strong>{ui.dataset}</strong><br/>{ui.updated}：{updated ? <time dateTime={updated}>{new Date(updated).toLocaleString(locale,{timeZone:'Asia/Tokyo'})} (JST)</time> : stats ? ui.none : ui.collecting}</p>
        </section>
        <section>
          <h2>{copy.heading}</h2>
          <p>{copy.intro}</p>
          <h3>{copy.examples}</h3>
          <ul>
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>
            <a
              className="card-seo-action"
              href={`${localizedPath(locale)}?card=${slug}`}
            >
              {copy.action}
            </a>
          </p>
        </section>
        <section>
          <h2>{copy.faq}</h2>
          <p>{copy.faqText}</p>
        </section>
        <section>
          <h2>{copy.safety}</h2>
          <p>{copy.safetyText}</p>
        </section>
        <section><h2>{ui.links}</h2><nav className="seo-actions"><a href={localizedPath(locale,'genshin-arcana')}>{ui.guide}</a><a href={`${localizedPath(locale)}#matches`}>{ui.match}</a><a href={localizedPath(locale,'arcana')}>{ui.all}</a></nav><h3>{ui.related}</h3><nav className="seo-actions">{[arcanaCards[(index+21)%22],arcanaCards[(index+1)%22],arcanaCards[(index+11)%22]].map(related=><a key={related.slug} href={localizedPath(locale,`genshin-arcana/${related.slug}`)}>{cardNames[locale][related.id]}</a>)}</nav></section>
      </ArticleShell>
    </>
  );
}
