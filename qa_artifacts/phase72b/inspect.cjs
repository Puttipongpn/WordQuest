const { chromium } = require('C:/Users/Famicon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const root = 'qa_artifacts/phase72b';
(async () => {
 const label=process.argv[2] || 'after'; const saved={}; let browser;
 try {
 if(label==='before')for(const f of ['src/screens/Dungeon.tsx','src/styles.css']) {saved[f]=await fs.readFile(f);await fs.writeFile(f,execFileSync('git',['show',`HEAD:${f}`]));}
 browser = await chromium.launch({headless:true, channel:'msedge'});
 const results=[];
 for (const [mode,rng] of [['choice',0.1],['match',0.45],['scramble',0.8]]) {
  const page = await browser.newPage({viewport:{width:1366,height:768}});
  await page.addInitScript(value=>{Math.random=()=>value},rng);
  await page.goto('http://127.0.0.1:5174');
  await page.getByRole('button',{name:'Start Adventure',exact:true}).click();
  await page.waitForTimeout(400);
  if(mode==='choice') await page.screenshot({path:`${root}/${label}-intro.png`});
  await page.getByRole('button',{name:'Start Battle',exact:true}).click();
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  await page.waitForTimeout(400);
  await page.clock.install(); await page.clock.pauseAt(new Date(Date.now()+100));
  for(const [width,height] of [[1366,768],[1440,900],[390,844],[390,667]]) {
   await page.setViewportSize({width,height}); await page.mouse.move(0,0); await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:`${root}/${label}-${mode}-${width}x${height}.png`,fullPage:true});
   results.push({mode,width,height,text:await page.locator('body').innerText(),metrics:await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,buttons:[...document.querySelectorAll('button')].filter(e=>e.checkVisibility()).length,frames:[...document.querySelectorAll('section,div,aside,details,button')].filter(e=>e.checkVisibility()&&parseFloat(getComputedStyle(e).borderTopWidth)>0).length,controls:[...document.querySelectorAll('button')].filter(e=>e.checkVisibility()).map(e=>({text:e.textContent,bottom:e.getBoundingClientRect().bottom})),sceneHeight:document.querySelector('.dungeon-scene-surface')?.getBoundingClientRect().height}))});
  }
  await page.close();
 }
 await fs.writeFile(`${root}/${label}-layout.json`,JSON.stringify(results,null,2));
 console.log(results.map(({mode,width,height,metrics})=>({mode,width,height,metrics})));
 } finally {if(browser)await browser.close();for(const [f,c] of Object.entries(saved))await fs.writeFile(f,c);}
})();
