const {chromium}=require('C:/Users/Famicon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs/promises'); const assert=require('node:assert/strict');
const root='qa_artifacts/phase72b';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});const results=[];const errors=[];const badResponses=[];
 async function start({rng=.45,width=390,height=667,reduced=false,failure=false}={}) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push({message:m.text(),location:m.location(),expectedAssetFailure:failure})});
  page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});
  if(failure)await page.route('**/*.png',r=>r.abort());
  await page.addInitScript(v=>{Math.random=()=>v},rng);
  await page.goto('http://127.0.0.1:5174');
  assert.equal(await page.title(),'Vocabulary Dungeon Deckbuilder');
  await page.getByRole('button',{name:'Start Adventure',exact:true}).click();
  const intro=await page.locator('body').innerText(); await page.waitForTimeout(1100); assert.equal(await page.locator('body').innerText(),intro);
  await page.getByRole('button',{name:'Start Battle',exact:true}).click(); return page;
 }
 const overflow=page=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 const timer=page=>page.locator('.dungeon-question-timer').innerText();
 const anim=page=>page.locator('[data-animation-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.animationId,state:e.dataset.animationState,frame:e.dataset.frameIndex})));
 try {
  if(process.argv[2]!=='progression') {
  // Newly relocated details: keyboard access, timer continues, all old information reachable.
  let page=await start(); const summary=page.locator('.dungeon-details > summary');
  await summary.focus(); await page.keyboard.press('Enter');
  assert.notEqual(await page.locator('.dungeon-details').getAttribute('open'),null);
  const timeBefore=await timer(page); await page.waitForTimeout(1100);const timeAfter=await timer(page);assert.notEqual(timeBefore,timeAfter);
  for(const name of ['Word Energy','Battle Log','Learning Info']) {const s=page.locator('.dungeon-details details > summary').filter({hasText:name});await s.click();assert.notEqual(await s.locator('..').getAttribute('open'),null);}
  assert.equal(await page.locator('summary').filter({hasText:'Card Trigger'}).count(),0);
  await summary.focus();await page.keyboard.press('Enter'); assert.equal(await page.locator('.dungeon-details').getAttribute('open'),null);
  results.push({test:'details-keyboard-no-pause-no-target-reveal',timeBefore,timeAfter,overflow:await overflow(page)});await page.close();
  // Reduced motion; shield card selected through the real Check Pair handler.
  page=await start({reduced:true});await page.getByRole('button',{name:/^courage\b/i}).click();await page.getByRole('button',{name:/^ความกล้าหาญ/}).click();await page.getByRole('button',{name:'Check Pair',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[data-animation-state="reduced-motion"]'));
  const reduced=await anim(page);assert.ok(reduced.some(a=>a.state==='reduced-motion'));
  assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).isEnabled(),true);
  const values=await page.locator('.dungeon-scene').innerText();assert.match(values,/Shield 3/);
  await page.screenshot({path:`${root}/reduced-motion-shield-390.png`,fullPage:true});
  await page.getByRole('button',{name:'Next Mini-Game',exact:true}).click();
  assert.equal(await page.locator('[data-animation-state="playing"]').count(),0);
  results.push({test:'reduced-motion-cast-hit-shield-and-fast-next',reduced,values,overflow:await overflow(page)});await page.close();
  // Force every PNG request to fail: text identities and all actions must still work.
  page=await start({rng:.1,failure:true});assert.equal(await page.locator('[data-battle-background-state="fallback"]').count(),1);
  await page.getByRole('button',{name:/^music\b/i}).click();
  assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).isEnabled(),true);
  await page.waitForTimeout(800);await page.screenshot({path:`${root}/failed-art-390.png`,fullPage:true});
  results.push({test:'failed-actor-effect-icon-background',scene:await page.locator('.dungeon-scene').innerText(),animations:await anim(page),overflow:await overflow(page)});
  await page.getByRole('button',{name:'Next Mini-Game',exact:true}).click();await page.close();
  // Desktop 200% equivalent layout viewport (1366/2 by 768/2), plus keyboard submission.
  page=await start({width:683,height:384}); await page.getByRole('button',{name:/^music\b/i}).focus();await page.keyboard.press('Enter');
  await page.getByRole('button',{name:/^ดนตรี/}).focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'Check Pair',exact:true}).focus();
  await page.screenshot({path:`${root}/zoom-equivalent-200.png`,fullPage:true});assert.equal(await overflow(page),0);await page.keyboard.press('Enter');
  assert.equal(await page.getByRole('button',{name:'Next Mini-Game',exact:true}).isEnabled(),true);
  results.push({test:'200-percent-equivalent-reflow-keyboard',viewport:'683x384 CSS pixels; not native browser zoom',overflow:await overflow(page)});await page.close();
  }
  // Unmapped actor via ordinary encounters: Slime -> Bat -> Goblin -> Wolf, no forced-result helper.
  let page=await start({rng:.1,width:1366,height:768});
  for(let i=0;i<40;i++) {
   if((await page.locator('.dungeon-scene').innerText()).includes('Wolf'))break;
   const nextEncounter=page.getByRole('button',{name:'Next Encounter',exact:true});
   if(await nextEncounter.count()) {await nextEncounter.click();await page.getByRole('button',{name:'Start Battle',exact:true}).click();continue;}
   const next=page.getByRole('button',{name:'Next Mini-Game',exact:true});if(await next.count()){await next.click();continue;}
   // Same deterministic choice prompt follows the first card in each generated cloze question.
   const prompt=await page.locator('.dungeon-quiz .relative > div').first().innerText();
   const cards=await page.evaluate(async()=> (await import('/src/data/starterDeck.ts')).starterDeck.cards);
   const correct=cards.find(c=>prompt.includes(c.exampleSentence.replace(new RegExp('\\b'+c.word+'\\b','gi'),'____'))) || cards.find(c=>prompt.split('\n').some(line=>line.trim().toLowerCase()===c.word || line.trim()===c.meaningTh));
   assert.ok(correct,`Cannot solve ${prompt}`);await page.getByRole('button',{name:new RegExp('\\b'+correct.word+'\\b','i')}).click();
   results.push({test:'progression-answer',word:correct.word,scene:await page.locator('.dungeon-scene').innerText(),animations:await anim(page)});
  }
  assert.match(await page.locator('.dungeon-scene').innerText(),/Wolf/);
  results.push({test:'ordinary-progression-unmapped-wolf',scene:await page.locator('.dungeon-scene').innerText()});
  await page.screenshot({path:`${root}/progression-scene.png`,fullPage:true});await page.close();
 } finally {await fs.writeFile(`${root}/${process.argv[2]==='progression'?'progression':'extended'}.json`,JSON.stringify({browser:await browser.version(),results,errors,badResponses},null,2));await browser.close();}
 console.log(results);
})().catch(e=>{console.error(e);process.exitCode=1});
