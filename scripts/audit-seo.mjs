import { mkdir, writeFile, readFile } from 'node:fs/promises';
const origin = process.argv[2] || 'https://arcana-card-link.pages.dev';
const label = process.argv[3] || 'before';
const sitemap = await fetch(origin + '/sitemap.xml').then(r => r.text());
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
// Audit retained card pages even when empty listings are intentionally noindex.
const cardSource=await readFile('lib/arcana-cards.ts','utf8');
for(const match of cardSource.matchAll(/slug: '([^']+)'/g)) {
  for(const prefix of ['', '/en','/zh-cn']) {
    const path=prefix+'/genshin-arcana/'+match[1];
    if(!urls.includes(path)) urls.push(path);
  }
}
const records = [];
let cursor = 0;
await Promise.all(Array.from({length: 4}, async () => {
  while (cursor < urls.length) {
    const path = urls[cursor++];
    try {
      const response = await fetch(origin + path);
      const html = await response.text();
      const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(m => m[0]);
      records.push({path, status:response.status, title:html.match(/<title>(.*?)<\/title>/s)?.[1], h1:[...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map(m => m[1].replace(/<[^>]*>/g,'')), canonical:tags.filter(t => t.includes('canonical')), description:tags.filter(t => /name="description"/.test(t)), languages:tags.filter(t => /hreflang=/i.test(t)), robots:tags.filter(t => /name="robots"/.test(t)), analytics:tags.filter(t => /google-analytics|googletagmanager/.test(t)), links:[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1])});
    } catch (error) { records.push({path,error:String(error)}); }
  }
}));
const extra = {};
for (const path of ['/robots.txt','/ads.txt','/definitely-not-a-page','/genshin-arcana/not-a-card']) {
  const response = await fetch(origin + path);
  extra[path] = {status:response.status, ...(path.endsWith('.txt') ? {body:await response.text()} : {})};
}
await mkdir('outputs', {recursive:true});
await writeFile(`outputs/seo-${label}.json`, JSON.stringify({origin,checkedAt:new Date().toISOString(),records:records.sort((a,b)=>a.path.localeCompare(b.path)),extra},null,2));
console.log(JSON.stringify({pages:records.length,failures:records.filter(r=>r.status!==200||r.h1?.length!==1||!r.canonical?.length).map(r=>({path:r.path,status:r.status,h1:r.h1,canonical:r.canonical})),extra},null,2));
