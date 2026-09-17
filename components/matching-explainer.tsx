'use client';
import {useState} from 'react';
import {evaluateMatch} from '@/lib/matching';
import {arcanaIds} from '@/lib/site-i18n';
import type {InventoryCounts} from '@/lib/arcana-profile';
export function MatchingExplainer(){
 const [example,setExample]=useState('mutual');
 const own=Object.fromEntries(arcanaIds.map(card=>[card,1])) as InventoryCounts;
 own.世界=0;own.月=2;
 const other={...own,世界:2,月:example==='oneway'?1:0} as InventoryCounts;
 const server=example==='server'?'europe':'asia';
 const result=evaluateMatch({server:'asia',inventory:own},{server,inventory:other});
 return <div className="matching-explainer"><b>入力例で確認（実際の募集ではありません）</b><label htmlFor="match-example">条件を切り替える</label><select id="match-example" value={example} onChange={e=>setExample(e.target.value)}><option value="mutual">双方の欲しいカードが一致</option><option value="oneway">自分だけが欲しいカードを受け取れる</option><option value="server">カード条件は合うがサーバーが違う</option></select><div className="seo-table-wrap"><table className="seo-table"><thead><tr><th>条件</th><th>あなた</th><th>相手</th></tr></thead><tbody><tr><th>サーバー</th><td>Asia</td><td>{server==='asia'?'Asia':'Europe'}</td></tr><tr><th>世界</th><td>0枚（欲しい）</td><td>2枚（1枚出せる）</td></tr><tr><th>月</th><td>2枚（1枚出せる）</td><td>{example==='oneway'?'1枚（所持済み）':'0枚（欲しい）'}</td></tr></tbody></table></div><p role="status">{!result ? '候補外：サーバーが異なるため、完全マッチとして表示しません。' : result.exact ? '完全マッチ：あなたは月を1枚渡し、世界を1枚受け取れる条件です。双方に不足を補うカードがあります。' : '片方向の候補：相手は世界を出せますが、あなたの月を必要としていません。これだけでは相互交換の条件は成立しません。'}</p><p>「完全マッチ」は在庫条件の一致を表し、相手の承諾や実際の交換成立を保証するものではありません。合流時間とゲーム内の交換条件は別途確認してください。</p></div>;
}
