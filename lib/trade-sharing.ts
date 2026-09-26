import { arcanaCards, cardBySlug, cardSlugById } from '@/lib/arcana-cards';
import { inventoryFromQuickSelection, neededCards, offeredCards, type InventoryCounts } from '@/lib/arcana-profile';
import { cardNames, localizedPath, type SiteLocale } from '@/lib/site-i18n';
import { normalizeServerRegion, serverLabels, type ServerRegion } from '@/lib/server-region';

export type SharedConditions = { server: ServerRegion; inventory: InventoryCounts };

// Only the public card conditions travel with a share, never profile identifiers.
export function sharedTradeUrl({server, inventory}: SharedConditions, locale: SiteLocale, source = 'copy') {
  const params = new URLSearchParams({
    shared: '1', server, locale,
    want: neededCards(inventory).map(card => cardSlugById[card]).join(','),
    offer: offeredCards(inventory).map(card => cardSlugById[card]).join(','),
    utm_source: ['x', 'copy', 'native', 'shared_listing'].includes(source) ? source : 'copy',
    utm_medium: source === 'x' ? 'social' : 'referral', utm_campaign: 'exchange',
  });
  return `https://arcana-card-link.pages.dev${localizedPath(locale)}?${params}#shared-condition`;
}

export function readSharedConditions(params: URLSearchParams): SharedConditions | null {
  if (params.get('shared') !== '1') return null;
  const server = normalizeServerRegion(params.get('server'));
  if (!server || !params.has('want') || !params.has('offer')) return null;
  const readCards = (value: string) => {
    const slugs = value ? value.split(',') : [];
    if (slugs.length > arcanaCards.length || slugs.some(slug => !Object.hasOwn(cardBySlug, slug))) return null;
    return [...new Set(slugs.map(slug => cardBySlug[slug].id))];
  };
  const wanted = readCards(params.get('want')!);
  const offered = readCards(params.get('offer')!);
  if (!wanted || !offered || wanted.some(card => offered.includes(card))) return null;
  return {server, inventory: inventoryFromQuickSelection(wanted, offered)};
}

// Conservative X weighting: URLs are 23; non-ASCII characters count as two.
export function shareWeight(text: string) {
  return text.split(/(https:\/\/[^\s]+)/g).reduce((total, part) => total +
    // oxlint-disable-next-line typescript/no-misused-spread -- Count Unicode code points conservatively, not display graphemes.
    (part.startsWith('https://') ? 23 : [...part].reduce((n, char) => n + (char.codePointAt(0)! > 127 ? 2 : 1), 0)), 0);
}

export function tradeShareText(conditions: SharedConditions, locale: SiteLocale, source = 'x') {
  const words = locale === 'ja'
    ? {title:'原神 月諭のアルカナ交換', want:'求', offer:'譲', none:'なし', more:'種', action:'交換条件はこちら', tags:'#原神 #アルカナ交換'}
    : locale === 'en'
      ? {title:'Genshin Impact Lunar Arcana trade', want:'Wanted', offer:'Offered', none:'None', more:' more', action:'Compare your cards', tags:'#GenshinImpact #ArcanaTrade'}
      : {title:'原神月谕圣牌交换', want:'求', offer:'出', none:'无', more:'种', action:'查看交换条件', tags:'#原神 #月谕圣牌'};
  const wanted = neededCards(conditions.inventory);
  const offered = offeredCards(conditions.inventory);
  const url = sharedTradeUrl(conditions, locale, source);
  const format = (cards: typeof wanted, limit: number) => !cards.length ? words.none
    : `${cards.slice(0, limit).map(card => cardNames[locale][card]).join(' / ')}${cards.length > limit ? ` +${cards.length - limit}${words.more}` : ''}`.trim();
  const render = (limit: number) => [words.title, `${words.want}: ${format(wanted, limit)}`, `${words.offer}: ${format(offered, limit)}`, `Server: ${serverLabels.en[conditions.server]}`, words.action, url, words.tags].join('\n');
  if (source !== 'x') return render(22);
  for (let limit = 22; limit >= 0; limit--) {
    const text = render(limit);
    if (shareWeight(text) <= 280) return text;
  }
  return `${words.title}\n${url}`;
}
