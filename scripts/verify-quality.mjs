import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const esbuild=createRequire(require.resolve('wrangler/package.json'))('esbuild');
await mkdir('work',{recursive:true});
await esbuild.build({entryPoints:['tests/matching.test.ts'],bundle:true,platform:'node',format:'esm',outfile:'work/matching-test.mjs'});
await import('../work/matching-test.mjs');
const base='http://localhost:3000';
const ids=[...((await readFile('lib/site-i18n.ts','utf8')).match(/export const arcanaIds = \[([\s\S]*?)\] as const/)[1]).matchAll(/'([^']+)'/g)].map(m=>m[1]);
const inventory=Object.fromEntries(ids.map(id=>[id,1]));inventory.世界=0;inventory.月=2;
const fixture={token:crypto.randomUUID(),displayName:'LOCAL QA',uid:'800000001',server:'asia',note:'LOCAL TEST ONLY',status:'open',locale:'ja',inventory};
const put=async body=>{const r=await fetch(base+'/api/profiles',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,200);return r.json();};
let saved;
try {
 saved=await put(fixture);
 const listing=await fetch(base+'/api/profiles?server=asia').then(r=>r.json());
 assert(listing.profiles.some(p=>p.publicId===saved.publicId));
 const html=await fetch(base+'/genshin-arcana/sekai').then(r=>r.text());
 assert(html.includes('サーバー別の公開募集'));assert(html.includes('現在、このカードを出せる人を募集中です。'));
 assert(!html.includes('noindex'));assert(!html.includes('adsbygoogle.js'));
 const shared=await fetch(base+'/genshin-arcana/share/'+saved.publicId).then(r=>r.text());
 assert(shared.includes('noindex'));assert(!shared.includes(fixture.uid));assert(!shared.includes(fixture.token));assert(!shared.includes(fixture.displayName));assert(!shared.includes(fixture.note));assert(!shared.includes('adsbygoogle.js'));
 await put({...fixture,status:'closed'});
 const closed=await fetch(base+'/api/profiles?server=asia').then(r=>r.json());assert(!closed.profiles.some(p=>p.publicId===saved.publicId));
 const empty=await fetch(base+'/genshin-arcana/sekai').then(r=>r.text());assert(empty.includes('noindex'));
 const token=crypto.randomUUID();
 for(let i=0;i<4;i++) {const r=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json',origin:base},body:JSON.stringify({token,category:'bug',message:'LOCAL QA ONLY: automated contact flow verification.'})});assert.equal(r.status,i===3?429:200);}
 for(const route of ['/genshin-arcana/not-a-card','/genshin-arcana/constructor','/en/genshin-arcana/not-a-card','/zh-cn/genshin-arcana/not-a-card','/genshin-arcana/share/invalid']) assert.equal((await fetch(base+route)).status,404,route);
 for(const route of ['/','/contact','/about','/privacy']) assert(!(await fetch(base+route).then(r=>r.text())).includes('adsbygoogle.js'),route);
 for(const route of ['/guide','/genshin-arcana']) assert((await fetch(base+route).then(r=>r.text())).includes('adsbygoogle.js'),route);
 console.log('PASS: matching, local persistence, card counts/indexing, share privacy, expiry/closed filtering, contact throttling, 404 and ad eligibility.');
 await writeFile('outputs/quality-verification.txt',new Date().toISOString()+'\nPASS: matching, local persistence, counts/indexing, share privacy, closed filtering, contact throttling, 404, ad eligibility.\n');
} finally {if(saved) await put({...fixture,status:'closed'});}
