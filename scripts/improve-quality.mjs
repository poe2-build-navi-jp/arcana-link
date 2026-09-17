import {readFileSync,writeFileSync} from 'node:fs';
function edit(file,fn){writeFileSync(file,fn(readFileSync(file,'utf8')));}
edit('components/exchange-home.tsx',s=>{
  const a=s.indexOf('function inventoryWith('),b=s.indexOf('function ',s.indexOf('\n}',s.indexOf('function sampleProfiles('))+2);
  // Remove the now-unused demo generation, keeping the next helper intact.
  if(a>=0&&b>a)s=s.slice(0,a)+s.slice(b);
  s=s.replace("  const [shareMode, setShareMode]", "  const [listingError, setListingError] = useState(false);\n  const [saving, setSaving] = useState(false);\n  const [shareMode, setShareMode]");
  s=s.replace("      setServerOpen(true);\n    }\n    let savedToken", "    }\n    let savedToken");
  s=s.replace("{(serverOpen || (hydrated && !profile.server)) && (", "{serverOpen && (");
  s=s.replace("          {profile.server && (\n            <button", "          {(true) && (\n            <button");
  s=s.replace("          mode?: 'local' | 'shared';\n        };\n        if (stopped) return;", "          mode?: 'local' | 'shared';\n        };\n        if (!response.ok) throw new Error('listing_unavailable');\n        if (stopped) return;\n        setListingError(data.mode !== 'shared');");
  s=s.replaceAll('setProfiles(sampleProfiles(locale));','setProfiles([]);\n          setListingError(true);');
  s=s.replace("        if (!response.ok) return;", "        if (!response.ok) throw new Error('save_failed');");
  s=s.replace("          setShareMode('shared');\n          if (!completeTracked", "          setShareMode('shared');\n          setSaving(false);\n          if (!completeTracked");
  s=s.replace("      } catch {\n        setShareMode('local');\n      }", "      } catch {\n        setSaving(false);\n        setShareMode('local');\n        setToast(locale === 'ja' ? '公開保存に失敗しました。通信状態を確認してプロフィールを保存し直してください。' : 'Could not publish. Please retry saving your profile.');\n      }");
  s=s.replace("    setToast(shareMode === 'shared' ? copy.saved : copy.localSaved);", "    setSaving(true);\n    setToast(locale === 'ja' ? '公開募集を保存しています…' : 'Saving your listing…');");
  s=s.replace("          setSaving(false);\n          if (!completeTracked", "          setSaving(false);\n          setToast(copy.saved);\n          if (!completeTracked");
  s=s.replace('<strong>{match.score}%</strong>', '<strong>{match.give.length} ↔ {match.receive.length}</strong>');
  s=s.replace('{selectedMatch.score}% MATCH', "{selectedMatch.exact ? 'TWO-WAY MATCH' : 'ONE-WAY MATCH'}");
  s=s.replace('  async function postToX() {', "  async function postToX() {\n    track('share_x', {server:profile.server});");
  s=s.replace('<section className="v2-overview"',`<div className="quality-intro"><p>{locale==='ja'?'所持数0枚は「求」、2枚以上は「譲」。同じサーバーで、お互いに不足を補える相手を探します。入力だけならUIDは不要です。':locale==='en'?'Enter your card counts to find two-way matches on your server. No UID is needed to edit your inventory.':'登记持有数量，寻找同服务器的双向交换伙伴。输入圣牌数量无需UID。'}</p><nav><a href={localizedPath(locale,'guide')}>{locale==='ja'?'使い方・マッチ判定の例':'How it works'}</a><a href={localizedPath(locale,'genshin-arcana')}>{locale==='ja'?'ゲーム内の交換手順':'Exchange guide'}</a></nav></div>
      <section className="v2-overview"`);
  s=s.replace('<section className="v2-inventory-section"',`{saving && <p role="status">{locale==='ja'?'公開保存中…':'Saving…'}</p>}
      <section className="v2-inventory-section"`);
  s=s.replace('<div className="v2-empty">',`<div className="v2-empty">
            {listingError && <p role="alert">{locale==='ja'?'募集を取得できませんでした。実際の募集状況は確認できていません。しばらくしてからページを再読み込みしてください。':'Listings are unavailable. Please reload later.'}</p>}`);
  s=s.replace('<a href={localizedPath(locale, \'terms\')}>{siteCopy.footerLinks[4]}</a>',`<a href={localizedPath(locale, 'terms')}>{siteCopy.footerLinks[4]}</a><a href="/contact">{locale==='ja'?'お問い合わせ・訂正依頼':'Contact (JA)'}</a>`);
  s=s.replace('<p className="v2-data-note">',`<label className="contact-consent"><input type="checkbox" required/><span>{locale==='ja'?'表示名・UID・サーバー・所持数・メモを交換候補として公開することを確認しました。':locale==='en'?'I understand that my name, UID, server, inventory and note will be publicly visible.':'我已确认昵称、UID、服务器、圣牌数量和备注将公开显示。'}</span></label><p className="v2-data-note">`);
  return s;
});
edit('app/about/page.tsx',s=>s.replace('<p className="updated">',`<section><h2>マッチングと集計の基準</h2><p>当サイトは登録された所持数から、0枚を不足、2枚以上を交換候補として判定します。同一サーバーで双方に受け渡し可能な種類がある場合を「完全マッチ」と呼びます。交換の成立率やカードの希少性を示すものではありません。</p><p>カードページの人数は、過去7日以内に更新された受付中の登録プロフィール数です。交渉中・終了した募集は集計しません。ひとりが複数の端末で登録した場合に重複する可能性があり、ゲーム全体の需要や総プレイヤー数を表す統計ではありません。</p></section><section><h2>訂正と更新の方針</h2><p>サイトの操作説明は実装されている機能に照らして確認し、ゲーム内の仕様は現在のゲーム画面を優先します。実際の体験談、公式認定、交換実績を装う情報は掲載しません。説明用のケースは実際の募集と区別して表示します。</p><p>誤りや動作不良は<a href="/contact">お問い合わせ・訂正依頼フォーム</a>へお知らせください。運営者のメールアドレスや利用者のメールアドレスを公開せずに、報告を受け付けています。個別返信は行っていません。</p></section><p className="updated">`).replace('最終更新：2026年9月6日','最終更新：2026年9月17日'));
edit('app/privacy/page.tsx',s=>s.replace('<h2>2. 利用目的</h2>',`<h2>2. 利用目的</h2><p>お問い合わせフォームでは、選択した種類、本文、受付番号、送信日時と、連続送信を抑えるためのランダムな識別子のハッシュ値を保存します。メールアドレスは求めません。内容は公開せず、訂正・不具合調査・不正対応に使用します。個別返信はできません。</p>`));
edit('components/exchange-table.tsx',s=>s.replace('サーバー別の自動マッチング','サーバー別の自動マッチング'));
edit('app/genshin-arcana/page.tsx',s=>s.replace('2026-09-14','2026-09-17').replace('2026年9月14日','2026年9月17日'));
