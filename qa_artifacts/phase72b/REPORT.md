# Phase 72B — Dungeon Scene Prototype

วันที่สรุป: 2026-10-14 (Asia/Bangkok); เริ่มเก็บ baseline 2026-10-13
สถานะ: ต้นแบบพร้อมให้เจ้าของ review; ยังไม่อนุมัติทิศทางภาพรวม และยังไม่เริ่ม Phase 72C

## ขอบเขตและสภาพแวดล้อม

- Repository `D:/project/WordQuest`, branch `main`, baseline `35fccce`; worktree เดิม ไม่มี commit/push/deploy
- เก็บการแก้เอกสาร Phase 72A ที่มีอยู่ก่อนเริ่มไว้ทั้งหมด
- Runtime เปลี่ยนเฉพาะ `src/screens/Dungeon.tsx` และ `src/styles.css`
- ใช้ Playwright ที่ติดตั้งมากับ runtime และ Microsoft Edge headless 155.0.4283.45 บน Windows; Browser plugin not available ไม่มีการติดตั้ง dependency เพิ่ม
- URL ทดลอง: http://127.0.0.1:5174/ (Vite dev server; QA Helper มีเฉพาะ development)
- Viewport: 1366x768, 1440x900, 390x844, 390x667; ค่า 390 เป็น browser viewport ไม่ใช่อุปกรณ์จริง
- Setup: Starter Deck, mastery เริ่มต้น 0, Slime HP 18/18 ATK 4, ผู้เล่น HP 32/32 shield 0 gold 20, sound off
- กำหนด Math.random ใน browser test เป็น .1/.45/.8 เพื่อเลือกมินิเกมซ้ำได้ ไม่ได้แก้ runtime หรือฉีด React state
- ภาพนิ่งใช้ Playwright clock หลังเริ่มคำถามและโหลดภาพครบเพื่อเทียบ state เดียวกัน; **ชุดทดสอบ behavior/timeout ไม่ใช้ clock จำลอง**
- ชุด baseline behavior อ่าน source จาก HEAD เฉพาะสองไฟล์ runtime ชั่วคราวแล้วคืนไฟล์ต้นแบบใน finally; ไม่แตะเอกสารเดิม

## สิ่งที่เปลี่ยน

1. Word Mage กับศัตรูอยู่ซ้าย–ขวาในฉากเดียว ไม่มีกรอบโปรไฟล์และ Battle Lane แยกสามกล่อง ใช้ sprite 96px และ 128px เมื่อ desktop สูงพอ
2. HUD คง HP/shield, enemy HP/ATK พร้อม Floor, Shop counter, Boss counter และ Gold ที่แยกความหมายกันชัดเจน
3. Timer เหลือหนึ่งชุด อยู่ชิดพื้นที่คำถามทุก viewport; เอา sidebar timer ซ้ำออก
4. ใช้พื้นที่ตอบเต็มความกว้าง ลดกรอบชั้นนอก และเปิดการเลื่อนแนวตั้งตามเนื้อหาเฉพาะ Dungeon prototype
5. Word Energy, Battle Log, Card Trigger และ Learning Info อยู่ใต้ disclosure “รายละเอียดการต่อสู้”; เปิดอ่านไม่ pause ไม่ reset เวลา และ Card Trigger ยังปรากฏเฉพาะเมื่อกฎเดิมอนุญาต
6. Pause, Abandon, Sound และ result overlay ใช้ handlers/availability เดิม ไม่รวมเป็น menu ใหม่ ไม่ทำ Phase 72C
7. ใช้ component/asset/effect mapping เดิม ไม่มี asset/dependency ใหม่ ไม่ขยาย frame/background ไปหน้าหรือพื้นผิวใหม่

Maintained design context ยังเป็น GAME_UI_SCREEN_SPEC.md และ UI_HIERARCHY_GUIDE.md; ไม่มี DESIGN.md ซ้ำซ้อนหรือ global token redesign

## ผลทดสอบรอบนี้

| รายการ | ผล / หลักฐาน |
| --- | --- |
| Build ก่อนและหลัง | ผ่าน TypeScript + Vite, 94 modules; build สุดท้าย JS `index-BJFzMRgg.js`, CSS `index-DwQZ-HH2.css` |
| Word Choice ถูก/ผิด desktop + mobile | ผ่าน handlers จริง; ถูก music: ศัตรู 18→14, ผู้เล่น 32; ผิด: ผู้เล่น 32→28, ศัตรู 18 |
| Word Match ถูก/ผิด desktop + mobile | ผ่านเลือกคู่และ Check Pair จริง; ถูก music ทำ 4 damage, ผิดโดน 4; ไม่ submit ตอนเลือก |
| Word Scramble ถูก/ผิด desktop + mobile | ผ่านเลือก apple, ตัวอักษร p ซ้ำ, คืน tile, Clear Answer, Check Word; apple ถูกทำ 4 damage, alpep ผิดโดน 4 |
| Timeout จริงสามแบบ | ผ่าน 14/20/24 วินาที (หลังแก้ประมาณ 14.08/20.16/24.26 วินาทีรวมการตรวจ UI); ผู้เล่น 32→28 ครั้งเดียว |
| Pause/resume | ทั้ง baseline และต้นแบบหยุดที่ 19 วินาที ผ่านการรอจริง แล้ว resume ไป 18 ไม่ reset |
| Gameplay parity | 15 กรณีเทียบ Battle Log, player HP, enemy HP และ LocalStorage ตรงกันทั้งหมด; ค่าไม่เปลี่ยนซ้ำหลังรอ playback 700ms (`parity.json`) |
| Gold, shield, energy, mastery | matched screenshot/DOM แสดง gold 20, shield 0 ในชุดพื้นฐาน; ผลสำเร็จ energy 19 fresh/1 used; mastery เริ่ม 0 และ LocalStorage ไม่ถูกเขียน; ไม่อ้างว่าได้เทียบ non-zero mastery ทุกกรณี |
| Intro | ไม่เริ่มนับก่อน Start Battle; รอจริงแล้วข้อความ/state ยังเดิม |
| Details + keyboard | Enter เปิด/ปิดได้, เวลา 20→19 ระหว่างเปิด; Word Energy/Log/Learning Info อ่านได้; ไม่มี Card Trigger ก่อนตอบ |
| Reduced motion | cast frame 3, shield frame 2, hit frame 1; courage ทำ 8 damage และ shield +3; Next พร้อมกดโดยไม่รอ animation |
| Failed art | บังคับทุก PNG fail: WQ/emoji, HP/shield/gold, background fallback และคำตอบ/Next ยังทำงาน; effect ที่ fail ไม่ crash |
| Unmapped art + effects | เล่นผ่าน Slime/Goblin/Bat ไป Wolf จริง; Wolf ใช้ emoji; บันทึก cast/hit/defeat, shield และ Water/Earth/Fire ใน progression.json |
| Mobile/desktop layout | ไม่พบ horizontal overflow ใน 12 answering snapshots และ tested results ทั้งสองขนาด; ไทยอ่านได้และเลื่อนเข้าถึงคำตอบ/ปุ่มได้ |
| Desktop 1366x768 | ขอบล่างตัวเลือก Choice 668.9px, Check Pair 730.4px, Check Word 761.4px; controls อยู่ใน viewport ก่อนเลือก scramble |
| 200% equivalent | ทดสอบ reflow ที่ 683x384 CSS px ซึ่งเทียบพื้นที่ 1366x768/2, keyboard Check Pair ทำงาน ไม่มี overflow; **ไม่ได้ทดสอบ native browser zoom 200%** |
| Scope smoke | Home/Deck/Training เปิดได้; event ใช้ background disabled และไม่มี prototype class; boss helper setup แสดงชื่อ/HP/ATK/special move ครบ; pause→abandon→cancel→resume ผ่าน |
| Source invariants | logic ก่อน JSX (ยกเว้นตัวเลือกแท็ก disclosure) และ mini-game components/answer controls ตรง HEAD แบบ byte-identical (`source-invariants.json`) |
| Console | ไม่มี JavaScript pageerror; มี favicon.ico 404 เดิม และ ERR_FAILED ที่ตั้งใจบล็อกรูปใน fallback test ไม่ใช่ศูนย์ console errors แบบเหมารวม |
| Framework overlay / blank page | ไม่พบใน browser runs; title จริง `Vocabulary Dungeon Deckbuilder` และเนื้อหาแอปแสดงครบ |

## ก่อน/หลังและความหนาแน่น

นับ element ที่มองเห็นตาม checkVisibility และมี border-top > 0 ใน section/div/aside/details/button; เป็นตัวชี้วัด DOM ที่ทำซ้ำได้ ไม่ใช่คะแนนความสนุกหรือจำนวนกรอบเชิงออกแบบทั้งหมด

| State | Framed regions ก่อน → หลัง | ปุ่มก่อน → หลัง |
| --- | --- | --- |
| Word Choice | 26 → 11 | 7 → 7 |
| Word Match | 29 → 14 | 10 → 10 |
| Word Scramble (ยังไม่เลือกคำ) | 29 → 14 | 8 → 8 |

- Auxiliary buttons ยังมี 3: Sound, Pause, Abandon ตามขอบเขต 72B; ไม่ลดจำนวนคำตอบหรือ confirm
- กล่อง stat ย่อย Shield/Floor/Progress เดิม 3 กล่อง เปลี่ยนเป็นข้อความ HUD/actor status; ตัวเลขจำเป็นยังอยู่
- คำว่า Monster ที่ซ้ำใน actor badge ถูกตัด เหลือ encounter badge ด้านบน; Shop/Boss counters ไม่ถูกรวมเพราะเป็นคนละเป้าหมาย
- Timer เดิมสองชุดใน DOM (แสดงคนละ breakpoint) เหลือหนึ่งชุด; timer ที่ผู้เล่นเห็นยังหนึ่งชุด
- Mobile scene สูงประมาณ 214px; desktop 1366 สูงประมาณ 208px และ 1440x900 สูงประมาณ 240px

ภาพเปรียบเทียบหลัก:

| View | ก่อน | หลัง |
| --- | --- | --- |
| Desktop Match | [ก่อน](before-match-1366x768.png) | [หลัง](after-match-1366x768.png) |
| Mobile Choice | [ก่อน](before-choice-390x844.png) | [หลัง](after-choice-390x844.png) |
| Short mobile Scramble | [ก่อน](before-scramble-390x667.png) | [หลัง](after-scramble-390x667.png) |

มีภาพทุกมินิเกม/viewport ใน `before-*` และ `after-*`; ภาพผลลัพธ์ใช้ `baseline-*-correct/wrong-*` และ `after-*-correct/wrong-*`.
`baseline.json` เป็นการจับภาพรอบแรกก่อนรอ background opacity; ใช้ `before-layout.json` และภาพ before ล่าสุดเป็นหลักในการเทียบภาพ

## ข้อจำกัดและรายการค้าง

- Owner direction review และ external playtest ยังไม่เกิดขึ้น; ไม่อ้างว่าความสนุกหรือความชอบผ่านการยืนยันแล้ว
- ยังไม่ได้ทดสอบ native 200% browser zoom, Safari/Firefox, screen reader, อุปกรณ์สัมผัสจริง
- ไม่ได้ทำ full Phase 72C/72D matrix: Wind overlay รอบนี้, ทุก elite/boss victory, ทุก shield absorption/event outcome, failed/completed run, non-zero mastery, full persistence/reload และ shop/reward/unlock regression ยังไม่ครบ
- สคริปต์ progression ชุด extended รอบแรกหยุดที่ Bat ตามจำนวนรอบ; progression.json เป็นรอบเพิ่มเติมที่ยืนยัน Wolf สำเร็จ ไม่ใช่ forced-result helper
- Production build ผ่าน แต่ยังไม่ได้ทำ production-preview matrix ของ Phase 72H หรือทดสอบ deployment/live
- Generic premium strict audit ไม่ผ่าน 2 finding เดิมนอก runtime slice: DeckReview native select ยังไม่มี ownership declaration; shared Button ใน ui.tsx ส่ง handler ผ่าน {...props} ซึ่ง scanner มองไม่เห็น (false positive ที่ตรวจ source แล้ว). เก็บ `premium-audit.json`; ไม่อ้าง full audit pass และไม่แก้หน้ารองเพื่อเอาคะแนน
- Build ใน sandbox เคยติด EPERM realpath; Edge ใน sandbox เปิดไม่ได้ และ server session ก่อนหยุดเมื่อสลับ session จึงเปิด Vite ใหม่ ใช้ existing Edge นอก sandboxสำเร็จ ไม่มี dependency install

## วิธีทดสอบซ้ำ

- `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort`
- `node qa_artifacts/phase72b/inspect.cjs before` แล้ว `... after` (before อ่าน HEAD เป็น baseline และคืนสองไฟล์ runtime ใน finally; ใช้เมื่อ HEAD ยังเป็น baseline)
- `node qa_artifacts/phase72b/behavior.cjs baseline` แล้ว `... after`
- `node qa_artifacts/phase72b/extended.cjs` และ `... progression`
- `node qa_artifacts/phase72b/smoke.cjs`
- `npm run build`

สคริปต์ QA ใช้ absolute path ไป bundled Playwright ของเครื่องนี้ ไม่ใช่ dependency ของเกม และไม่ถูก bundle เข้า production

## Review gate

ส่งมอบเฉพาะ Phase 72B prototype พร้อมหลักฐานให้เจ้าของ review. Phase 72C ยัง Not started; ไม่เปลี่ยน gameplay/save/asset mapping/deployment และยังไม่มี commit/push/deploy.

## Technical Review Addendum - 2026-10-15

The original no-commit/push statement above records the 2026-10-14 handoff. The owner subsequently requested technical review and commit/push if no correction is needed.

- Reviewed the runtime diff, the plan's protected behavior, and desktop/mobile before/after and fresh result screenshots. No blocking finding; no runtime correction made during review.
- `npm run build` passes: 94 modules, JS `index-BJFzMRgg.js`, CSS `index-DwQZ-HH2.css`, matching the implementation handoff.
- `node qa_artifacts/phase72b/behavior.cjs review` passes 16 cases: 12 correct/wrong cases across three modes and desktop/mobile, three real timeouts, and pause/resume. All 15 resolved logs, HP/status values, overflow and LocalStorage snapshots equal the previous after evidence. Real timeout measurements were 14.071s, 20.215s and 24.297s including browser observation overhead; no timer configuration changed.
- `node qa_artifacts/phase72b/review.cjs` passes three additional 390x667 cases: details remain non-pausing; a wrong answer after the existing Set HP Low helper shows Run Failed and Restart Run outside closed details; forced PNG failures preserve background fallback and answer/Next controls; reduced-motion cast frame 3, shield frame 2 and hit frame 1 remain available with immediate continuation.
- Rerun states have zero horizontal overflow. Fresh screenshots include `review-run-failed-390.png`, `review-fallback-390.png`, and the `review-*-correct/wrong-*` set. No runtime exceptions in additional smoke checks. The behavior rerun captured one HTTP 404 console message, consistent with the previously documented missing favicon; intentional PNG failures remain expected network failures, not app exceptions.
- Browser plugin unavailable: used the existing bundled Playwright and headless Edge. The old dev server was no longer reachable; Vite and Edge were restarted outside the sandbox after sandbox browser/network isolation prevented the first attempts. These setup attempts were not application test failures. No dependency was added.
- Evidence: `review-behavior.json`, `review-smoke.json`, `review.cjs`. The new Run Failed check is scoped; it does not claim the full later-phase run completion/rewards/persistence matrix.
- Native browser zoom, real devices, other browser engines, owner visual acceptance and external playtest remain unverified. Phase 72C has not started. Technical approval for the requested commit/push is not a completed Phase 72D/72H acceptance gate or production verification.
- Baseline scripts read HEAD: do not run their `baseline`/`before` modes after committing this prototype and call that the old UI. Historical baseline is commit `35fccce`; use a separate checkout for future old-UI comparisons to avoid overwriting active work.
