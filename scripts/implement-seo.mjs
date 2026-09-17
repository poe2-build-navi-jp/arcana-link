import {readFileSync,writeFileSync} from 'node:fs';
function edit(file, fn) {writeFileSync(file,fn(readFileSync(file,'utf8')));}
edit('lib/site-metadata.ts', s=>s.replace('原神 アルカナ交換・募集｜同じサーバーの交換相手を自動マッチング｜ARCANA LINK','原神 月諭アルカナ交換マッチング｜条件一致の相手を自動検索 | ARCANA LINK'));
edit('lib/card-seo.ts',s=>s.replace('${name}のアルカナ交換募集｜原神 月諭アルカナ','${name}｜原神 月諭アルカナ交換相手を探す').replace('2026-09-06\',\n    author','2026-09-14\',\n    author'));
edit('app/genshin-arcana/page.tsx',s=>s.replaceAll('原神のアルカナ交換・募集の探し方','原神 月諭アルカナ交換のやり方｜募集・相手の探し方').replace('title="原神 月諭アルカナ交換のやり方｜募集・相手の探し方"','title="原神 月諭のアルカナ交換方法"').replaceAll('2026-09-06','2026-09-14').replace('最終更新：2026年9月6日','最終更新：2026年9月14日').replace('<section id="faq">',`<section id="cant-find-partner">
          <h2>交換相手が見つからないときの確認順</h2>
          <p>まずサーバーを確認し、次に所持数をゲーム内の最新状態に合わせてください。欲しいカードが相手にあっても、相手の欲しいカードを自分が出せなければ完全マッチにはなりません。</p>
          <ol><li>「求」は0枚、「譲」は2枚以上として入力する。</li><li>同じサーバーの募集で、双方が渡せるカードを確認する。</li><li>公開募集を更新する。7日以上更新のない募集は候補から外れます。</li><li>交換表をXやnoteから共有して、自分の条件に合う人を募る。</li></ol>
          <p>募集がないときは、成立を保証する数字やサンプルを実際の相手と見なさず、新しい募集を待ちましょう。</p>
          <a href="/genshin-arcana/exchange-table">求・譲の交換表を作る →</a>
        </section>
        <section id="uid"><h2>UIDとサーバーを安全に伝える</h2><p>UIDは原神内で相手を検索するために使います。言語設定からサーバーを推測せず、ゲーム内の表示を確認してください。共有URL・X本文・交換表の画像にはUIDを含めません。公開募集への登録時のみ、交換相手にUIDが表示されることを確認して保存してください。</p></section>
        <section id="complete-guide"><h2>22種類コンプリートに向けた所持数の整理</h2><p>1枚だけ持っているカードはコレクション用として残し、2枚以上ある種類を交換候補にします。交換が完了したら、渡した種類を減らし、受け取った種類を増やして再確認しましょう。未所持が減るほど条件が限定されるので、足りないカードの個別ページからサーバー別の募集状況も確認できます。</p><a href="/arcana">22種類一覧から不足カードを見る →</a></section>
        <section id="faq">`).replace('<a href="#faq">','<a href="#cant-find-partner">相手が見つからないとき</a><a href="#uid">UIDとサーバー</a><a href="#complete-guide">22種類の整理</a><a href="#faq">'));
edit('components/exchange-home.tsx',s=>{
  s=s.replace("import { arcanaCards }", "import { ExchangeTable } from '@/components/exchange-table';\nimport { track } from '@/lib/analytics';\nimport { arcanaCards, cardBySlug }");
  s=s.replace("  const knownMatches =", "  const [intent, setIntent] = useState<{slug:string; action:string} | null>(null);\n  const registerTracked = useRef(false);\n  const completeTracked = useRef(false);\n  const matchTracked = useRef('');\n  const knownMatches =");
  s=s.replace('    if (urlServer) setRequestedServer(urlServer);',`    if (urlServer) setRequestedServer(urlServer);
    const params = new URL(window.location.href).searchParams;
    const requestedCard = params.get('card');
    if (requestedCard && Object.hasOwn(cardBySlug, requestedCard)) setIntent({slug:requestedCard,action:params.get('intent') === 'offer' ? 'offer' : 'want'});`);
  s=s.replace('  function updateCount(card: ArcanaId, change: -1 | 1) {',`  function startRegistration() {
    if (!registerTracked.current) {track('register_start'); registerTracked.current = true;}
  }
  function updateCount(card: ArcanaId, change: -1 | 1) {
    startRegistration();`);
  s=s.replace('  function openProfileSettings() {','  function openProfileSettings() {\n    startRegistration();');
  s=s.replace('    void navigator.clipboard.writeText(uid);',"    track('uid_copy');\n    void navigator.clipboard.writeText(uid);");
  s=s.replace("        if (data.mode === 'shared') setShareMode('shared');",`        if (data.mode === 'shared') {
          setShareMode('shared');
          if (!completeTracked.current) {track('register_complete', {server:profile.server}); completeTracked.current = true;}
        }`);
  s=s.replace('    const exactIds = new Set(',`    const liveIds = matches.filter(m=>m.exact && !m.profile.sample).map(m=>m.profile.publicId).sort().join(',');
    if (liveIds && liveIds !== matchTracked.current) track('match_found', {count:matches.filter(m=>m.exact && !m.profile.sample).length});
    matchTracked.current = liveIds;
    const exactIds = new Set(`);
  s=s.replace('<h1 id="collection-heading">{copy.inventory}</h1>',`<h1 id="collection-heading">{locale === 'ja' ? '月諭のアルカナ交換相手を自動で探す' : locale === 'en' ? 'Find a Lunar Arcana trading partner' : '自动寻找月谕圣牌交换伙伴'}</h1>`);
  s=s.replace('<div className="v2-progress-track"',`{!profile.publicId && collected === 0 && <div className="seo-empty"><p>{locale === 'ja' ? '未登録：まだカード情報が登録されていません。' : locale === 'en' ? 'No cards registered yet.' : '尚未登记圣牌。'}</p><a href="#inventory" onClick={()=>{startRegistration(); if (!profile.server) setServerOpen(true);}}>{locale === 'ja' ? '登録を始める' : locale === 'en' ? 'Start registration' : '开始登记'}</a></div>}
          <div className="v2-progress-track"`);
  s=s.replace('<section className="v2-inventory-section" id="inventory">',`<section className="v2-inventory-section" id="inventory">
        {intent && <div className="seo-empty"><p>{labels[cardBySlug[intent.slug].id]}：{locale === 'ja' ? (intent.action === 'offer' ? 'このカードを出せる方は、実際の所持数を2枚以上で入力してください。' : 'このカードを探す方は、所持数を0枚にしてください。') : 'Confirm your actual card count below.'}</p><p>{locale === 'ja' ? '他の21種類も確認すると、相互に条件の合う相手を探せます。' : 'Check all 22 counts to find a two-way match.'}</p></div>}`);
  s=s.replace('      {shareOpen && (',`      {shareOpen && (`);
  s=s.replace('<div className="v2-share-body">',`<div className="v2-share-body">
              <ExchangeTable inventory={inventory} server={profile.server} status={profile.status} publicId={profile.publicId} locale={locale} />`);
  s=s.replace('onClick={() => setShareOpen(true)}',"onClick={() => {if (!profile.server) {setServerOpen(true); return;} track('exchange_table_create', {server:profile.server}); setShareOpen(true);}} ");
  s=s.replace('<b>{shareCopy.open}</b>',"<b>{locale === 'ja' ? '交換表を作る' : shareCopy.open}</b>");
  // Make the existing text/image sharing use the same UID-free recruitment conditions.
  const start=s.indexOf('  function shareText() {');
  const end=s.indexOf('\n  }', start)+4;
  s=s.slice(0,start)+`  function shareText() {
    const url = profile.publicId ? 'https://arcana-card-link.pages.dev/genshin-arcana/share/' + profile.publicId : 'https://arcana-card-link.pages.dev/genshin-arcana/exchange-table';
    return ['【原神 月諭アルカナ交換】', '求：' + (missing.map(c=>labels[c]).join(' / ') || 'なし'), '譲：' + (duplicates.map(c=>labels[c]).join(' / ') || 'なし'), 'Server：' + activeServerLabel, '交換条件はこちら', url + '?utm_source=x&utm_medium=social&utm_campaign=exchange', '#原神 #アルカナ交換'].join('\\n');
  }`+s.slice(end);
  return s;
});
