import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
// Keep Pages deployment separate from Vite's generated Worker configuration.
const config=JSON.parse(await readFile('wrangler.json','utf8'));
config.pages_build_output_dir='../arcana-link/dist/client';
await mkdir('../.local-deploy',{recursive:true});
await writeFile('../.local-deploy/wrangler.json',JSON.stringify(config,null,2));

// Vite emits a Worker-only config next to the server bundle. It contains
// `main`, `assets`, and local placeholder bindings, which are invalid when
// Wrangler discovers it during a Pages deployment. The root Pages config is
// authoritative, so exclude the generated Worker config from the upload.
await rm('dist/server/wrangler.json');

const wrapper=await readFile('cloudflare/worker-wrapper.mjs','utf8');
await writeFile('dist/client/_worker.js',wrapper.replace('../dist/server/index.js','../server/index.js'));
console.log('Pages bundle prepared with original production DB binding.');
