'use client';
import {useEffect,useState} from 'react';
import {normalizeInventory,type InventoryCounts} from '@/lib/arcana-profile';
import {normalizeServerRegion,type ServerRegion} from '@/lib/server-region';
import {evaluateMatch} from '@/lib/matching';
export function SharedMatch({server,inventory,active}:{server:ServerRegion;inventory:InventoryCounts;active:boolean}) {
 const [text,setText]=useState('あなたも交換できますか？ 所持数を登録して条件を確認できます。');
 useEffect(()=>{try {
   const own=normalizeInventory(JSON.parse(localStorage.getItem('arcana-link-v2-inventory')||'null'));
   const ownServer=normalizeServerRegion(localStorage.getItem('arcana_server'));
   if (!active) {setText('この募集は現在受付中ではありません。');return;}
   if (own && ownServer) {
     const result=evaluateMatch({server:ownServer,inventory:own},{server,inventory});
     setText(result?.exact ? 'あなたと条件が一致しています。自動マッチで交換内容を確認してください。' : ownServer!==server ? 'この募集はあなたと異なるサーバーです。自分と同じサーバーで探してください。' : '現在、相互に一致する交換条件はありません。所持数を見直すか、別の募集を探せます。');
   }
 } catch {/* Browser storage may be unavailable. */}},[server,inventory,active]);
 return <p className="seo-empty">{text}</p>;
}
