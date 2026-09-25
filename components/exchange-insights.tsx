import type { ExchangeSummary } from '@/lib/arcana-db';
import { cardNames, localizedPath, type SiteLocale } from '@/lib/site-i18n';
import { serverLabels, serverRegions } from '@/lib/server-region';

function relativeUpdate(locale: SiteLocale, value: string | null, now: number) {
  if (!value) return '—';
  const minutes = Math.max(0, Math.floor((now - Date.parse(value)) / 60000));
  if (locale === 'ja')
    return minutes < 1
      ? '1分以内'
      : minutes < 60
        ? `${minutes}分前`
        : minutes < 1440
          ? `${Math.floor(minutes / 60)}時間前`
          : `${Math.floor(minutes / 1440)}日前`;
  if (locale === 'zh-cn')
    return minutes < 60
      ? `${Math.max(1, minutes)}分钟前`
      : `${Math.floor(minutes / 60)}小时前`;
  return minutes < 60
    ? `${Math.max(1, minutes)} min ago`
    : `${Math.floor(minutes / 60)} hr ago`;
}

export function ExchangeInsights({
  locale,
  summary,
  now,
}: {
  locale: SiteLocale;
  summary: ExchangeSummary;
  now?: number;
}) {
  const labels = cardNames[locale];
  const referenceTime = now || Date.parse(summary.generatedAt);
  const recentListings = summary.recentListings ?? [];
  const summarize = (cards: Array<keyof typeof labels>) => {
    const visible = cards.slice(0, 3).map((card) => labels[card]);
    return `${visible.join(' / ')}${cards.length > 3 ? ` +${cards.length - 3}` : ''}` || '—';
  };
  return (
    <section
      className="v2-service-status"
      id="exchange-status"
      aria-label={locale === 'ja' ? '現在の交換状況' : 'Current exchange activity'}
    >
      <h2>
        {locale === 'ja'
          ? '現在の交換状況'
          : locale === 'en'
            ? 'Current exchange activity'
            : '当前交换状态'}
      </h2>
      <div className={`v2-service-totals${summary.open < 10 ? ' is-low-volume' : ''}`}>
        <span>
          <b>{summary.open}</b>
          {locale === 'ja'
            ? '受付中の募集'
            : locale === 'zh-cn'
              ? '招募中'
              : ' open listings'}
        </span>
        <span>
          <b>{summary.recent}</b>
          {locale === 'ja'
            ? '過去24時間に更新'
            : locale === 'zh-cn'
              ? '过去24小时更新'
              : ' updated in the last 24 hours'}
        </span>
        <span>
          <b>{relativeUpdate(locale, summary.updatedAt, referenceTime)}</b>
          {locale === 'ja'
            ? '最終更新'
            : locale === 'zh-cn'
              ? '最后更新'
              : ' last update'}
        </span>
      </div>
      {summary.open > 0 ? (
        <div className="v2-server-activity">
          <h3>
            {locale === 'ja'
              ? 'サーバー別の受付中募集'
              : locale === 'zh-cn'
                ? '各服务器招募数'
                : 'Open listings by server'}
          </h3>
          <ul>
            {serverRegions.map((server) => (
              <li key={server}>
                <span>{serverLabels.en[server]}</span>
                <b>{summary.servers[server]}</b>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="v2-first-listing">
          <h3>
            {locale === 'ja'
              ? '先行募集を受付中'
              : locale === 'zh-cn'
                ? '正在接受首批招募'
                : 'Early listings are open'}
          </h3>
          <p>
            {locale === 'ja'
              ? '欲しいアルカナと余っているアルカナを選ぶだけ。交換表を作成し、そのまま同じ条件でマッチ待ちできます。'
              : locale === 'zh-cn'
                ? '选择想要和多余的圣牌，制作交换表后即可等待自动匹配。'
                : 'Select missing cards and duplicates, create a trade list, and wait for automatic matches.'}
          </p>
          <a href={`${localizedPath(locale)}#quick-create`}>
            {locale === 'ja'
              ? '30秒で交換募集を作る'
              : locale === 'zh-cn'
                ? '30秒制作交换招募'
                : 'Create a trade listing in 30 seconds'}
          </a>
          <small>
            {locale === 'ja'
              ? '現在の受付中募集：0件'
              : locale === 'zh-cn'
                ? '当前公开招募：0条'
                : 'Current open listings: 0'}
          </small>
        </div>
      )}
      {summary.popularPairs.length > 0 && (
        <div className="v2-popular-pairs">
          <h3>
            {locale === 'ja'
              ? '現在、相互条件が一致する組み合わせ'
              : locale === 'zh-cn'
                ? '最近易匹配的组合'
                : 'Recently matchable combinations'}
          </h3>
          <p>
            {locale === 'ja'
              ? '過去7日以内の受付中データから、同じサーバーで求・譲が相互に一致する候補を集計しています。'
              : locale === 'zh-cn'
                ? '根据过7天内同服务器的求与出条件计算。'
                : 'Calculated from reciprocal wanted and offered conditions in active listings from the last 7 days.'}
          </p>
          <ul>
            {summary.popularPairs.map((pair) => (
              <li key={`${pair.server}-${pair.want}-${pair.offer}`}>
                <span>{serverLabels.en[pair.server]}</span>
                <b>
                  {labels[pair.want]} ↔ {labels[pair.offer]}
                </b>
                <small>
                  {locale === 'ja'
                    ? `${pair.matches}組の相互条件候補`
                    : locale === 'zh-cn'
                      ? `${pair.matches}组双向条件候选`
                      : `${pair.matches} reciprocal candidate${pair.matches > 1 ? 's' : ''}`}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
      {recentListings.length > 0 && (
        <div className="v2-recent-listings">
          <h3>
            {locale === 'ja'
              ? '最近の交換募集'
              : locale === 'zh-cn'
                ? '最近的交换招募'
                : 'Recent exchange listings'}
          </h3>
          <div>
            {recentListings.map((listing) => (
              <article key={listing.publicId}>
                <header>
                  <b>🌏 {serverLabels.en[listing.server]}</b>
                  <small>
                    {relativeUpdate(locale, listing.updatedAt, referenceTime)}
                    {locale === 'ja' ? '更新' : ''}
                  </small>
                </header>
                <p>
                  <span>{locale === 'en' ? 'Wanted' : '求'}</span>
                  {summarize(listing.wants)}
                </p>
                <p>
                  <span>{locale === 'en' ? 'Offered' : locale === 'ja' ? '譲' : '出'}</span>
                  {summarize(listing.offers)}
                </p>
                <a href={`/genshin-arcana/share/${listing.publicId}`}>
                  {locale === 'ja'
                    ? '自分のカードと比較'
                    : locale === 'zh-cn'
                      ? '与自己的圣牌比较'
                      : 'Compare with your cards'}
                </a>
              </article>
            ))}
          </div>
        </div>
      )}
      {locale === 'ja' && (
        <details>
          <summary>集計日時とデータの見方</summary>
          <p>集計日時：<time dateTime={summary.generatedAt}>{new Intl.DateTimeFormat('ja-JP', {timeZone: 'Asia/Tokyo', dateStyle: 'medium', timeStyle: 'short'}).format(new Date(summary.generatedAt))}</time>（日本時間）。「最終更新」は集計対象の募集が最後に更新された時刻です。</p>
          <p>ARCANA LINKに登録された、過去7日以内に更新のある受付中募集を集計しています。原神の全プレイヤー数や、他サイトの募集数ではありません。「過去24時間に更新」はこの期間内に更新された対象募集数で、更新操作の回数ではありません。</p>
          <p>組み合わせの候補数は、同じサーバーで逆向きの求・譲を持つ募集数の小さい方です。同じ募集が複数の組み合わせに含まれる場合があります。交換成立数・成立率・カードの希少性を示すものではありません。</p>
        </details>
      )}
      <small className="v2-data-scope">
        {locale === 'ja'
          ? 'ARCANA LINK登録データ・過去7日以内に更新された受付中募集のみ集計'
          : locale === 'zh-cn'
            ? 'ARCANA LINK登记数据：仅统计过7天内更新的公开招募。'
            : 'ARCANA LINK data: open listings updated within the last 7 days.'}
      </small>
    </section>
  );
}
