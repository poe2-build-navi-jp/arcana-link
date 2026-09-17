import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {PublicHeader,PublicFooter} from '@/components/public-shell';
import {ExchangeTable} from '@/components/exchange-table';
import {SharedMatch} from '@/components/shared-match';
import {PageEvent} from '@/components/page-event';
import {readSharedProfile} from '@/lib/arcana-db';
export const dynamic = 'force-dynamic';
export const metadata:Metadata={title:'月諭アルカナ交換条件 | ARCANA LINK',description:'サーバーと求・譲を確認して、条件の合う交換相手を探せます。',robots:{index:false,follow:true},openGraph:{title:'月諭アルカナ交換条件 | ARCANA LINK',description:'求・譲とサーバーを確認して交換相手を探す',images:[]},twitter:{card:'summary',title:'月諭アルカナ交換条件 | ARCANA LINK',images:[]}};
export default async function SharePage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 const profile=await readSharedProfile(id);
 if (!profile) notFound();
 const active=!profile.expired&&profile.status==='open';
 return <><PublicHeader/><main className="article-page"><header className="article-hero"><span>ARCANA LINK</span><h1>月諭アルカナ交換条件</h1><p>募集者が登録した所持数から作成した交換表です。交換前に最新の条件を確認してください。</p></header><article className="article-body"><PageEvent event="share_url_view"/><p>最終更新：<time dateTime={profile.updatedAt}>{new Date(profile.updatedAt).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo'})}（日本時間）</time>{profile.expired && ' · 期限切れ（7日以上更新なし）'}</p><SharedMatch server={profile.server} inventory={profile.inventory} active={active}/><ExchangeTable inventory={profile.inventory} server={profile.server} status={profile.expired ? 'closed' : profile.status}/><p><a href={`/?server=${profile.server}#inventory`}>あなたの22種類を登録する →</a></p><p><a href="/genshin-arcana">交換のやり方と安全ガイド</a></p></article></main><PublicFooter/></>;
}
