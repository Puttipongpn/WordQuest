const { chromium } = require('C:/Users/Famicon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const root = 'qa_artifacts/phase72b';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  const errors = [];
  async function start({ failure = false, reduced = false, rng = .1 } = {}) {
    const page = await browser.newPage({ viewport: { width: 390, height: 667 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    page.on('pageerror', e => errors.push(String(e)));
    if (failure) await page.route('**/*.png', route => route.abort());
    await page.addInitScript(value => { Math.random = () => value; }, rng);
    await page.goto('http://127.0.0.1:5174');
    await page.getByRole('button', { name: 'Start Adventure', exact: true }).click();
    await page.getByRole('button', { name: 'Start Battle', exact: true }).click();
    return page;
  }
  const overflow = page => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  try {
    let page = await start();
    const details = page.locator('.dungeon-details');
    await details.locator(':scope > summary').click();
    const before = await page.locator('.dungeon-question-timer').innerText();
    await page.waitForTimeout(1100);
    assert.notEqual(await page.locator('.dungeon-question-timer').innerText(), before);
    await page.locator('summary').filter({ hasText: 'QA Helper' }).click();
    await page.getByRole('button', { name: 'Set HP Low', exact: true }).click();
    await details.locator(':scope > summary').click();
    await page.getByRole('button', { name: /^water\b/i }).click();
    assert.match(await page.locator('.dungeon-quiz').innerText(), /Run Failed/);
    assert.equal(await details.getAttribute('open'), null);
    const restart = page.locator('.dungeon-quiz').getByRole('button', { name: 'Restart Run', exact: true });
    await restart.scrollIntoViewIfNeeded();
    assert.equal(await restart.isEnabled(), true);
    assert.equal(await overflow(page), 0);
    await page.screenshot({ path: `${root}/review-run-failed-390.png`, fullPage: true });
    await restart.click();
    assert.equal(await page.getByRole('button', { name: 'Start Battle', exact: true }).isVisible(), true);
    results.push({ test: 'details-do-not-pause; low-HP-wrong-answer; run-failed-restart-outside-closed-details', passed: true });
    await page.close();

    page = await start({ failure: true });
    await page.locator('[data-battle-background-state="fallback"]').waitFor();
    await page.getByRole('button', { name: /^music\b/i }).click();
    assert.equal(await page.getByRole('button', { name: 'Next Mini-Game', exact: true }).isEnabled(), true);
    assert.equal(await overflow(page), 0);
    await page.screenshot({ path: `${root}/review-fallback-390.png`, fullPage: true });
    results.push({ test: 'all-PNG-failure-background-and-answer-controls', passed: true });
    await page.close();

    page = await start({ reduced: true, rng: .45 });
    await page.getByRole('button', { name: /^courage\b/i }).click();
    await page.getByRole('button', { name: /^\u0e04\u0e27\u0e32\u0e21\u0e01\u0e25\u0e49\u0e32\u0e2b\u0e32\u0e0d/ }).click();
    await page.getByRole('button', { name: 'Check Pair', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[data-animation-state="reduced-motion"]'));
    const frames = await page.locator('[data-animation-state="reduced-motion"]').evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.animationId, frame: node.dataset.frameIndex })));
    assert.match(await page.locator('.dungeon-scene').innerText(), /Shield 3/);
    assert.equal(await page.getByRole('button', { name: 'Next Mini-Game', exact: true }).isEnabled(), true);
    assert.equal(await overflow(page), 0);
    results.push({ test: 'reduced-motion-resolved-shield-and-immediate-next', frames, passed: true });
    await page.close();
    assert.deepEqual(errors, []);
  } finally {
    await fs.writeFile(`${root}/review-smoke.json`, JSON.stringify({ date: '2026-10-15', results, errors }, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify({ results, errors }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
