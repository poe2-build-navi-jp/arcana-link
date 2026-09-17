import { type ArcanaId } from '@/lib/site-i18n';

export type ArcanaCard = {
  id: ArcanaId;
  slug: string;
  symbol: string;
};

export const arcanaCards: ArcanaCard[] = [
  { id: '魔術師', slug: 'majutsushi', symbol: '✦' },
  { id: '女教皇', slug: 'onna-kyoko', symbol: '☾' },
  { id: '女帝', slug: 'jotei', symbol: '♕' },
  { id: '皇帝', slug: 'kotei', symbol: '♔' },
  { id: '教皇', slug: 'kyoko', symbol: '⌘' },
  { id: '恋人', slug: 'koibito', symbol: '♡' },
  { id: '戦車', slug: 'sensha', symbol: '◈' },
  { id: '力', slug: 'chikara', symbol: '◆' },
  { id: '隠者', slug: 'inja', symbol: '⌁' },
  { id: '運命の輪', slug: 'unmei-no-wa', symbol: '◎' },
  { id: '正義', slug: 'seigi', symbol: '⚖' },
  { id: '吊るされた男', slug: 'tsurusareta-otoko', symbol: '◇' },
  { id: '死神', slug: 'shinigami', symbol: '†' },
  { id: '節制', slug: 'sessai', symbol: '△' },
  { id: '悪魔', slug: 'akuma', symbol: '♢' },
  { id: '塔', slug: 'to', symbol: '▥' },
  { id: '星', slug: 'hoshi', symbol: '★' },
  { id: '月', slug: 'tsuki', symbol: '☽' },
  { id: '太陽', slug: 'taiyo', symbol: '☀' },
  { id: '審判', slug: 'shinpan', symbol: '♪' },
  { id: '世界', slug: 'sekai', symbol: '◉' },
  { id: '愚者', slug: 'gusha', symbol: '○' },
];

export const cardBySlug = Object.fromEntries(
  arcanaCards.map((card) => [card.slug, card]),
) as Record<string, ArcanaCard>;

export const cardSlugById = Object.fromEntries(
  arcanaCards.map((card) => [card.id, card.slug]),
) as Record<ArcanaId, string>;
