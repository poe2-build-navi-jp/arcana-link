import {readFile,writeFile,mkdir} from 'node:fs/promises';
// Keep Pages deployment separate from Vite's generated Worker configuration.
const config=JSON.parse(await readFile('wrangler.json','utf8'));
config.pages_build_output_dir='../arcana-link/dist/client';
await mkdir('../.local-deploy',{recursive:true});
await writeFile('../.local-deploy/wrangler.json',JSON.stringify(config,null,2));
const wrapper=await readFile('cloudflare/worker-wrapper.mjs','utf8');
await writeFile('dist/client/_worker.js',wrapper.replace('../dist/server/index.js','../server/index.js'));
console.log('Pages bundle prepared with original production DB binding.');
