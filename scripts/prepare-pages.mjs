import {readFile,writeFile,mkdir} from 'node:fs/promises';
// Keep Pages deployment separate from Vite's generated Worker configuration.
const config=JSON.parse(await readFile('wrangler.json','utf8'));
config.pages_build_output_dir='../arcana-link/dist/client';
await mkdir('../.local-deploy',{recursive:true});
await writeFile('../.local-deploy/wrangler.json',JSON.stringify(config,null,2));

// The Vite plugin adds a local placeholder D1 binding alongside the real
// production binding. Wrangler rejects duplicate binding names during a Pages
// deploy, so keep the last entry for each name (the production entry).
const serverConfigPath='dist/server/wrangler.json';
const serverConfig=JSON.parse(await readFile(serverConfigPath,'utf8'));
serverConfig.d1_databases=[
  ...new Map(
    (serverConfig.d1_databases??[]).map(database=>[database.binding,database]),
  ).values(),
];
await writeFile(serverConfigPath,JSON.stringify(serverConfig));

const wrapper=await readFile('cloudflare/worker-wrapper.mjs','utf8');
await writeFile('dist/client/_worker.js',wrapper.replace('../dist/server/index.js','../server/index.js'));
console.log('Pages bundle prepared with original production DB binding.');
