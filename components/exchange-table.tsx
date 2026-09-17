'use client';
import {useState} from 'react';
import {neededCards, offeredCards, type InventoryCounts} from '@/lib/arcana-profile';
import {cardNames, localizedPath, type SiteLocale} from '@/lib/site-i18n';
import {cardSlugById} from '@/lib/arcana-cards';
import {serverLabels, type ServerRegion} from '@/lib/server-region';
import {statusLabel, type ExchangeStatus} from '@/lib/v2-i18n';
import {track} from '@/lib/analytics';

export function ExchangeTable({inventory,server,status,publicId,locale='ja'}:{inventory:InventoryCounts;server:ServerRegion|'';status:ExchangeStatus;publicId?:string;locale?:SiteLocale}) {
  const [message,setMessage] = useState('');
  const names = cardNames[locale];
  const want = neededCards(inventory).map(c=>names[c]).join(' / ');
  const offer = offeredCards(inventory).map(c=>names[c]).join(' / ');
  const wantSlugs = neededCards(inventory).map(c=>cardSlugById[c]).join(',');
  const offerSlugs = offeredCards(inventory).map(c=>cardSlugById[c]).join(',');
  const t = locale === 'ja' ? {title:'月諭アルカナ交換表',want:'求',offer:'譲',none:'なし',match:'この条件で交換相手を探す',copy:'共有URLをコピー',post:'Xで募集する',private:'UID・表示名・メモは共有URLやX本文に含めません。',save:'プロフィールを保存すると、最新の募集状態を表示する専用URLを共有できます。',copied:'共有URLをコピーしました。',error:'コピーできませんでした。URLを選択してコピーしてください。'} : locale === 'en' ? {title:'Lunar Arcana Exchange Table',want:'Wanted',offer:'Offered',none:'None',match:'Find compatible players',copy:'Copy share URL',post:'Recruit on X',private:'UID, name and notes are not included in shared pages or posts.',save:'Save your profile to share a URL with your current listing status.',copied:'Share URL copied.',error:'Copy failed. Select and copy the URL.'} : {title:'月谕圣牌交换表',want:'求',offer:'出',none:'无',match:'查找匹配伙伴',copy:'复制分享链接',post:'在X发布',private:'分享链接和帖子不包含UID、昵称或备注。',save:'保存个人资料后，可分享包含最新招募状态的专属链接。',copied:'已复制链接。',error:'复制失败，请手动复制链接。'};
  const url = publicId ? `https://arcana-card-link.pages.dev/genshin-arcana/share/${publicId}` : '';
  const text = [`【${t.title}】`,`${t.want}：${want||t.none}`,`${t.offer}：${offer||t.none}`,`Server：${server ? serverLabels.en[server] : '—'}`,url ? url+'?utm_source=x&utm_medium=social&utm_campaign=exchange' : '', '#原神 #アルカナ交換'].join('\n');
  const params = new URLSearchParams();
  if(server) params.set('server',server);
  if(wantSlugs) params.set('want',wantSlugs);
  if(offerSlugs) params.set('offer',offerSlugs);
  return <section className="exchange-table"><h3>{t.title}</h3><p>Server：{server ? serverLabels.en[server] : '—'} · {statusLabel(locale,status)}</p><dl><dt>{t.want}</dt><dd>{want||t.none}</dd><dt>{t.offer}</dt><dd>{offer||t.none}</dd></dl><a className="card-seo-action" href={`${localizedPath(locale)}?${params.toString()}#matches`}>{t.match}</a>
    {url && server ? <><p className="seo-actions"><a href={`https://x.com/intent/post?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" onClick={()=>track('share_x',{server})}>{t.post}</a><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(url);setMessage(t.copied);}catch{setMessage(t.error);}}}>{t.copy}</button></p><input aria-label={t.copy} value={url} readOnly onFocus={e=>e.currentTarget.select()} /></> : <p>{t.save} <a href={`${localizedPath(locale)}#inventory`}>{locale === 'ja' ? '登録へ' : 'Register'}</a></p>}
    <p>{t.private}</p><output>{message}</output></section>;
}
