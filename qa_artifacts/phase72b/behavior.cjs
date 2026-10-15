const {chromium}=require('C:/Users/Famicon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const root='qa_artifacts/phase72b';
const label=process.argv[2]||'after';
const modes={choice:.1,match:.45,scramble:.8};
const errors=[]; const results=[];
let browser;
async function start(mode,width=1366,options={}) {
 const page=await browser.newPage({viewport:{width,height:width===390?844:768},reducedMotion:options.reduced?'reduce':'no-preference'});
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error'&&!options.failure)errors.push(m.text())});
 if(options.failure) await page.route('**/*.png',r=>r.abort());
 await page.addInitScript(v=>{Math.random=()=>v},modes[mode]);
 await page.goto('http://127.0.0.1:5174');
 await page.getByRole('button',{name:'Start Adventure',exact:true}).click();
 await page.getByRole('button',{name:'Start Battle',exact:true}).click();
 return page;
}
async function details(page) {
 const outer=page.locator('.dungeon-details');
 if(await outer.count() && !(await outer.getAttribute('open')!==null)) await outer.locator(':scope > summary').click();
}
async function log(page) {
 await details(page);
 const box=page.locator('details').filter({has:page.locator('summary').filter({hasText:'Battle Log'})}).last();
 if(await box.getAttribute('open')===null) await box.locator(':scope > summary').click();
 return (await box.innerText()).replace(/\s+/g,' ').trim();
}
async function values(page) {
 return page.evaluate(()=>{
 const player=document.querySelector('[aria-label="Player HP"]')?.parentElement.innerText;
 const enemy=document.querySelector('[aria-label="Slime HP"]')?.parentElement.innerText;
 return {player,enemy,storage:JSON.stringify(localStorage),overflow:document.documentElement.scrollWidth-innerWidth};
 });
}
async function answer(page,mode,correct) {
 if(mode==='choice') await page.getByRole('button',{name:correct?/^music\b/i:/^water\b/i}).click();
 if(mode==='match') {
  await page.getByRole('button',{name:/^music\b/i}).click();
  await page.getByRole('button',{name:correct?/^ดนตรี/:/^ความกล้าหาญ/}).click();
  assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).count(),0);
  await page.getByRole('button',{name:'Check Pair',exact:true}).click();
 }
 if(mode==='scramble') {
  await page.getByRole('button',{name:/^aeppl\b/}).click();
  // Exercise duplicate-letter identity, returning a tile and clearing before submission.
  const bank=()=>page.locator('button').filter({hasText:/^p$/i}).last();
  await bank().click();
  await page.locator('button').filter({hasText:/^p$/i}).first().click();
  await bank().click();
  await page.getByRole('button',{name:'Clear Answer',exact:true}).click();
  for(const letter of correct?'apple':'alpep') await page.getByRole('button',{name:letter,exact:true}).last().click();
  assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).count(),0);
  await page.getByRole('button',{name:'Check Word',exact:true}).click();
 }
}
(async()=>{
 const saved={};
 try {
  if(label==='baseline') {
   for(const f of ['src/screens/Dungeon.tsx','src/styles.css']) {
    saved[f]=await fs.readFile(f); await fs.writeFile(f,execFileSync('git',['show',`HEAD:${f}`]));
   }
  }
  browser=await chromium.launch({headless:true,channel:'msedge'});
  for(const mode of Object.keys(modes)) for(const width of [1366,390]) for(const correct of [true,false]) {
   const page=await start(mode,width);
   const before=await values(page);
   await answer(page,mode,correct);
   const animation=await page.locator('[data-animation-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.animationId,state:e.dataset.animationState,frame:e.dataset.frameIndex})));
   assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).isEnabled(),true);
   const resultLog=await log(page);
   const resolved=await values(page);
   await page.waitForTimeout(700);
   assert.deepEqual(await values(page),resolved);
   assert.equal(resolved.overflow,0);
   await page.screenshot({path:`${root}/${label}-${mode}-${correct?'correct':'wrong'}-${width}.png`,fullPage:true});
   results.push({mode,width,correct,before,resolved,resultLog,animation});
   await page.getByRole('button',{name:'Next Mini-Game',exact:true}).click();
   assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).count(),0);
   await page.close();
  }
  // Real timers, never mocked, run independently in parallel.
  await Promise.all(Object.keys(modes).map(async mode=>{
   const page=await start(mode); const before=await values(page); const begin=Date.now();
   await page.getByRole('button',{name:'Next Mini-Game',exact:true}).waitFor({timeout:30000});
   const elapsed=Date.now()-begin; const resultLog=await log(page); const resolved=await values(page);
   await page.waitForTimeout(700); assert.deepEqual(await values(page),resolved);
   results.push({mode,test:'real-timeout',elapsed,before,resolved,resultLog}); await page.close();
  }));
  const page=await start('match',390);
  const timer=()=>page.locator('[aria-label="Battle timer"], [aria-label="Mobile battle timer"]').filter({visible:true}).first().evaluate(e=>e.parentElement.parentElement.innerText);
  await page.waitForTimeout(1100); await page.getByRole('button',{name:'Pause',exact:true}).click();
  const paused=await timer(); await page.waitForTimeout(1500); assert.equal(await timer(),paused);
  await page.screenshot({path:`${root}/${label}-paused-390.png`,fullPage:true});
  await page.getByRole('button',{name:'Resume',exact:true}).click(); await page.waitForTimeout(1100);
  const resumed=await timer(); assert.notEqual(resumed,paused);
  results.push({test:'pause-resume',paused,resumed}); await page.close();
  console.log(`${label}: ${results.length} cases, errors: ${errors.length}`);
 } finally {
  if(browser)await browser.close();
  for(const [f,content] of Object.entries(saved)) await fs.writeFile(f,content);
  await fs.writeFile(`${root}/${label}-behavior.json`,JSON.stringify({results,errors},null,2));
 }
})().catch(e=>{console.error(e);process.exitCode=1});
