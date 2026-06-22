import { useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, ProgressBar, StatCard } from "../components/ui";
import { BOSS_MONSTER_REQUIREMENT } from "../game/balance";
import {
  getNextUnlockedDeckId,
  getDeckRequirementText,
  getNextUnlockTarget,
} from "../game/deckProgression";
import type {
  ActiveRunSummary,
  PlayerStatistics,
  ScreenName,
  VocabularyDeck,
  WordMasteryByCardId,
} from "../types";

type HomeProps = {
  activeRunSummary: ActiveRunSummary;
  availableDecks: VocabularyDeck[];
  completedDeckIds: string[];
  hasActiveRun: boolean;
  onContinueRun: () => void;
  onNavigate: (screen: ScreenName) => void;
  onResetProgress: () => void;
  onSelectDeck: (deckId: string) => void;
  onStartNewRun: () => void;
  playerStatistics: PlayerStatistics;
  selectedDeckId: string;
  unlockedDeckIds: string[];
  wordMastery: WordMasteryByCardId;
};

function getDeckMasterySummary(
  deck: VocabularyDeck,
  wordMastery: WordMasteryByCardId,
) {
  const totalCards = deck.cards.length;
  const totalMastery = deck.cards.reduce(
    (total, card) => total + (wordMastery[card.id] ?? 0),
    0,
  );
  const masteredWords = deck.cards.filter(
    (card) => (wordMastery[card.id] ?? 0) >= 5,
  ).length;
  const averageMastery =
    totalCards > 0 ? Number((totalMastery / totalCards).toFixed(1)) : 0;
  const masteryPercent =
    totalCards > 0 ? Math.round((totalMastery / (totalCards * 5)) * 100) : 0;

  return {
    averageMastery,
    masteredWords,
    masteryPercent,
    totalCards,
  };
}

export function Home({
  activeRunSummary,
  availableDecks,
  completedDeckIds,
  hasActiveRun,
  onContinueRun,
  onNavigate,
  onResetProgress,
  onSelectDeck,
  onStartNewRun,
  playerStatistics,
  selectedDeckId,
  unlockedDeckIds,
  wordMastery,
}: HomeProps) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isStartNewRunConfirmOpen, setIsStartNewRunConfirmOpen] =
    useState(false);
  const selectedDeck =
    availableDecks.find((deck) => deck.id === selectedDeckId) ??
    availableDecks[0];
  const isSelectedDeckCompleted = completedDeckIds.includes(selectedDeck.id);
  const nextUnlockTarget = getNextUnlockTarget(completedDeckIds, availableDecks);
  const selectedDeckMastery = getDeckMasterySummary(selectedDeck, wordMastery);
  const nextUnlockedDeckId = getNextUnlockedDeckId(selectedDeck.id);
  const nextUnlockedDeck = availableDecks.find(
    (deck) => deck.id === nextUnlockedDeckId,
  );
  const isEveryDeckCompleted = availableDecks.every((deck) =>
    completedDeckIds.includes(deck.id),
  );
  const selectedDeckNextAction = isEveryDeckCompleted
    ? "All current decks completed. More decks coming soon."
    : isSelectedDeckCompleted && nextUnlockedDeck && unlockedDeckIds.includes(nextUnlockedDeck.id)
      ? `Next: Try ${nextUnlockedDeck.name}.`
      : selectedDeckMastery.averageMastery < 2
        ? "Next: Training can improve mastery and increase Dungeon damage."
        : "Next: Review or enter the Dungeon when ready.";

  function confirmResetProgress() {
    onResetProgress();
    setIsResetConfirmOpen(false);
  }

  function requestStartAdventure() {
    if (hasActiveRun) {
      setIsStartNewRunConfirmOpen(true);
      return;
    }

    onStartNewRun();
  }

  function confirmStartNewRun() {
    onStartNewRun();
    setIsStartNewRunConfirmOpen(false);
  }

  return (
    <ScreenShell
      eyebrow="Campfire Hub"
      title="WordQuest"
      description="Choose a deck, sharpen your vocabulary, and venture into the dungeon."
      framed={false}
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        <CardPanel className="relative overflow-hidden border-amber-700/40 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent" />
          <div className="relative">
          <div className="flex flex-wrap gap-2">
            <Badge tone="emerald">Vocabulary cards</Badge>
            <Badge tone="purple">Deckbuilder run</Badge>
            <Badge tone="sky">Training untimed</Badge>
            <Badge tone="red">Dungeon timed</Badge>
            <Badge tone="amber">Saved locally</Badge>
          </div>
          <h3 className="mt-5 max-w-2xl text-5xl font-black leading-none text-amber-950 sm:text-6xl">
            {selectedDeck.name}
          </h3>
          <p className="mt-3 max-w-2xl text-lg font-bold leading-8 text-amber-950/80">
            {selectedDeck.description}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Status"
              value={isSelectedDeckCompleted ? "Completed" : "Unlocked"}
              helper={
                isSelectedDeckCompleted
                  ? "Boss cleared"
                  : "Ready to play"
              }
              tone={isSelectedDeckCompleted ? "emerald" : "sky"}
            />
            <StatCard
              label="Cards"
              value={selectedDeck.cards.length}
              helper="Vocabulary cards"
              tone="amber"
            />
            <StatCard
              label="Mastered"
              value={`${selectedDeckMastery.masteredWords} / ${selectedDeckMastery.totalCards}`}
              helper="Words at 5 / 5"
              tone="emerald"
            />
            <StatCard
              label="Average"
              value={`${selectedDeckMastery.averageMastery} / 5`}
              helper="Saved mastery"
              tone="purple"
            />
          </div>
          <div className="mt-5 rounded-2xl border-2 border-amber-900/10 bg-white/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-black text-amber-950">
                Mastery Progress
              </p>
              <Badge tone="emerald">
                {selectedDeckMastery.masteryPercent}%
              </Badge>
            </div>
            <div className="mt-3">
              <ProgressBar
                value={selectedDeckMastery.masteryPercent}
                max={100}
                label={`${selectedDeck.name} mastery progress`}
                tone="emerald"
              />
            </div>
            <p className="mt-3 text-sm font-bold text-amber-900/75">
              {selectedDeckNextAction}
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-amber-950/75">
            Permanent progress is saved locally in this browser. Dungeon HP,
            shield, gold, shop upgrades, and Word Energy are temporary run state.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {hasActiveRun && (
              <Button type="button" onClick={onContinueRun}>
                Continue Run
              </Button>
            )}
            <Button type="button" onClick={() => onNavigate("deck-review")}>
              Open Spellbook
            </Button>
            <Button
              type="button"
              onClick={() => onNavigate("training")}
              variant="secondary"
            >
              Train At Camp
            </Button>
            <Button
              type="button"
              onClick={requestStartAdventure}
              variant={hasActiveRun ? "secondary" : "primary"}
            >
              {hasActiveRun ? "Start New Run" : "Start Adventure"}
            </Button>
          </div>
          </div>
        </CardPanel>
        {hasActiveRun && (
          <CardPanel className="border-sky-800/30 bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge tone="sky">Current run in progress</Badge>
                <h3 className="mt-2 text-2xl font-black text-amber-950">
                  Continue your paused dungeon run.
                </h3>
                <p className="mt-2 text-sm font-bold leading-6 text-amber-900/75">
                  This run is kept only in memory for this app session. Refreshing
                  or closing the page can still lose it.
                </p>
              </div>
              <Button type="button" onClick={onContinueRun}>
                Continue Run
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Deck"
                value={activeRunSummary.deckName}
                helper={activeRunSummary.statusLabel ?? "Paused"}
                tone="sky"
              />
              <StatCard
                label="Floor"
                value={activeRunSummary.currentFloor}
                helper={`${activeRunSummary.monstersDefeated} defeated`}
                tone="amber"
              />
              <StatCard
                label="HP / Shield"
                value={`${activeRunSummary.playerHp ?? "?"} / ${activeRunSummary.shield ?? "?"}`}
                helper={activeRunSummary.encounterName ?? "Dungeon"}
                tone="red"
              />
              <StatCard
                label="Gold"
                value={activeRunSummary.gold}
                helper={`Shop ${activeRunSummary.nextShopAt}, Boss ${activeRunSummary.monstersDefeated}/${activeRunSummary.bossRequirement}`}
                tone="emerald"
              />
            </div>
          </CardPanel>
        )}
        <CardPanel className="border-emerald-800/30 bg-gradient-to-br from-emerald-100 to-amber-50">
          <div className="flex items-center gap-4">
            <p className="grid size-16 place-items-center rounded-lg border border-amber-900/20 bg-white/70 text-5xl shadow-inner" aria-hidden="true">
              🏕️
            </p>
            <div>
              <p className="font-black text-amber-950">Adventure Status</p>
              <p className="mt-1 text-sm font-medium text-amber-900/80">
                Cozy fantasy prototype, CSS-only visuals.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              label="Deck"
              value={selectedDeck.cards.length}
              helper="Active cards"
            />
            <StatCard
              label={selectedDeck.name}
              value={isSelectedDeckCompleted ? "Completed" : "In Progress"}
              helper={
                isSelectedDeckCompleted
                  ? "Permanent progress saved"
                  : "Defeat the boss to complete"
              }
              tone={isSelectedDeckCompleted ? "emerald" : "sky"}
            />
            <StatCard
              label="Mastery"
              value={`${selectedDeckMastery.masteryPercent}%`}
              helper="Selected deck"
              tone="emerald"
            />
            <StatCard
              label="Runs"
              value={playerStatistics.completedRuns + playerStatistics.failedRuns}
              helper="Ended runs"
              tone="amber"
            />
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-900/10 bg-white/70 p-4">
            <Badge tone="emerald">Local Save</Badge>
            <p className="mt-2 text-sm font-bold leading-6 text-amber-900/80">
              Permanent progress is saved on this device. Reset Progress is the
              only Home action that clears mastery, unlocks, completions, and
              saved stats.
            </p>
          </div>
        </CardPanel>
      </div>

      <CardPanel className="mt-6 border-sky-800/25 bg-gradient-to-br from-sky-50 via-amber-50 to-emerald-50">
        <details>
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
            <span>
              <Badge tone="sky">How to Play</Badge>
              <span className="ml-3 text-xl font-black text-amber-950">
                New adventurer guide
              </span>
            </span>
            <span className="text-sm font-black uppercase text-amber-800/70">
              Tap to open
            </span>
          </summary>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-amber-900/10 bg-white/75 p-4">
              <Badge tone="purple">1. Review Deck</Badge>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-950/75">
                Inspect cards, Thai meanings, examples, attack, effects, and
                mastery before you fight.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white/75 p-4">
              <Badge tone="sky">2. Training</Badge>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-950/75">
                Practice safely with no timer. Correct answers increase mastery;
                wrong answers do not reduce it.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white/75 p-4">
              <Badge tone="red">3. Dungeon</Badge>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-950/75">
                Start battles, answer timed mini-games, and trigger cards.
                Wrong answers or timeouts let enemies attack.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white/75 p-4">
              <Badge tone="amber">4. Shop</Badge>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-950/75">
                Spend run gold on temporary card upgrades. Shop changes vanish
                when the run ends or resets.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white/75 p-4">
              <Badge tone="emerald">5. Boss</Badge>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-950/75">
                Defeat the boss to complete the selected deck and unlock the
                next deck in the path.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-black text-emerald-950">
                Permanent progress
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-emerald-900/80">
                Word mastery, unlocked decks, completed decks, and saved stats
                stay in this browser.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-black text-amber-950">
                Temporary run progress
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-900/80">
                HP, shield, gold, shop upgrades, duplicated or removed cards,
                enchantments, Word Energy, and the current run reset when the
                run ends, is abandoned, refreshes, or decks change.
              </p>
            </div>
          </div>
          <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold leading-6 text-sky-950">
            WordQuest is an early prototype. No account is required, there is
            no cloud save, and clearing browser data can clear LocalStorage
            progress.
          </p>
        </details>
      </CardPanel>

      <CardPanel className="mt-6 border-emerald-800/30 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="emerald">Adventurer Records</Badge>
            <h3 className="mt-2 text-2xl font-black text-amber-950">
              Best Run Summary
            </h3>
            <p className="mt-2 max-w-2xl text-sm font-bold text-amber-900/75">
              Only completed or failed run summaries are saved. Active dungeon
              state, HP, shield, gold, monster state, and run deck changes stay
              temporary.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <StatCard
            label="Best Monsters"
            value={playerStatistics.bestMonstersDefeated}
            helper="Ended run"
            tone="emerald"
          />
          <StatCard
            label="Best Accuracy"
            value={`${playerStatistics.bestAccuracy}%`}
            helper="Correct / answered"
            tone="sky"
          />
          <StatCard
            label="Best Damage"
            value={playerStatistics.bestDamageDealt}
            helper="Total dealt"
            tone="red"
          />
          <StatCard
            label="Completed"
            value={playerStatistics.completedRuns}
            helper="Boss defeated"
            tone="purple"
          />
          <StatCard
            label="Failed"
            value={playerStatistics.failedRuns}
            helper="Run ended"
            tone="amber"
          />
          <StatCard
            label="Total Correct"
            value={playerStatistics.totalCorrectAnswers}
            helper="Saved answers"
            tone="emerald"
          />
          <StatCard
            label="Total Wrong"
            value={playerStatistics.totalWrongAnswers}
            helper="Saved answers"
            tone="red"
          />
        </div>
      </CardPanel>

      <CardPanel className="mt-6 border-amber-700/30 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="purple">Journey Map</Badge>
            <h3 className="mt-2 text-2xl font-black text-amber-950">
              Deck Progression Path
            </h3>
            <p className="mt-2 max-w-2xl text-sm font-bold text-amber-900/75">
              Deck Review, Training, Dungeon battles, shop mutations, and boss
              completion all use the selected deck. Changing decks starts a
              fresh run. Locked decks appear here but cannot be selected yet.
            </p>
            <p className="mt-3 text-lg font-black text-amber-950">
              Starter Deck → Food Deck → Travel Deck → Nature Deck → Daily Life Deck → Emotion Deck
            </p>
            <p className="mt-3 rounded-lg border border-amber-900/10 bg-white/70 px-3 py-2 text-sm font-black text-amber-950">
              Next unlock target: {nextUnlockTarget}
            </p>
          </div>
          <StatCard
            label="Available Decks"
            value={availableDecks.length}
            helper={nextUnlockTarget}
            tone="emerald"
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {availableDecks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            const isCompleted = completedDeckIds.includes(deck.id);
            const isUnlocked = unlockedDeckIds.includes(deck.id);
            const requirement = getDeckRequirementText(deck.id, availableDecks);
            const masterySummary = getDeckMasterySummary(deck, wordMastery);
            const statusLabel = isCompleted
              ? "Completed"
              : isUnlocked
                ? "Unlocked"
                : "Locked";

            return (
              <article
                key={deck.id}
                className={`rounded-xl border-2 p-4 text-left shadow-[0_8px_0_rgba(120,53,15,0.12)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  !isUnlocked
                    ? "border-slate-300 bg-slate-100/80 opacity-75"
                    : isSelected
                      ? "selected-glow border-amber-700 bg-white ring-2 ring-amber-300"
                      : "border-amber-900/15 bg-white/70 hover:border-amber-500"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-amber-950">
                      {deck.name}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-amber-950/70">
                      {deck.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isSelected && isUnlocked && (
                      <Badge tone="amber" className="attack-pop">
                        Selected
                      </Badge>
                    )}
                    <Badge
                      tone={
                        isCompleted
                          ? "emerald"
                          : !isUnlocked
                            ? "slate"
                            : "sky"
                      }
                    >
                      {statusLabel}
                    </Badge>
                    <Badge tone={isCompleted ? "emerald" : "sky"}>
                      {isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <StatCard label="Cards" value={deck.cards.length} />
                  <StatCard
                    label="Mastered"
                    value={`${masterySummary.masteredWords} / ${masterySummary.totalCards}`}
                    helper={`Avg ${masterySummary.averageMastery} / 5`}
                    tone="emerald"
                  />
                </div>
                <div className="mt-4 rounded-lg border border-amber-900/10 bg-white/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase text-amber-800/70">
                      Mastery
                    </p>
                    <p className="text-xs font-black text-amber-950">
                      {masterySummary.masteryPercent}%
                    </p>
                  </div>
                  <div className="mt-2">
                    <ProgressBar
                      value={masterySummary.masteryPercent}
                      max={100}
                      label={`${deck.name} mastery`}
                      tone={isCompleted ? "emerald" : "sky"}
                    />
                  </div>
                </div>
                <p
                  className={`mt-3 rounded-md border px-3 py-2 text-sm font-bold ${
                    isUnlocked
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-300 bg-white/70 text-slate-700"
                  }`}
                >
                  {isCompleted
                    ? "Completed. You can still replay this deck."
                    : isUnlocked
                      ? isSelected
                        ? "Selected. Study, train, or start the adventure."
                        : "Unlocked. Select this deck to begin a fresh run."
                      : requirement}
                </p>
                <Button
                  type="button"
                  disabled={!isUnlocked || isSelected}
                  onClick={() => onSelectDeck(deck.id)}
                  variant={isSelected ? "secondary" : "primary"}
                  className="mt-4 w-full"
                >
                  {isSelected
                    ? "Selected"
                    : isUnlocked
                      ? "Select Deck"
                      : "Locked"}
                </Button>
              </article>
            );
          })}
        </div>
      </CardPanel>

      <CardPanel className="mt-6 border-red-800/30 bg-gradient-to-br from-red-50 via-amber-50 to-stone-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="red">Danger Zone</Badge>
            <h3 className="mt-2 text-2xl font-black text-red-950">
              Reset Progress
            </h3>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-red-950/75">
              This clears word mastery, unlocked decks, completed decks, and
              saved statistics from this browser. It is separate from Abandon
              Run, which only ends the current temporary run.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            variant="danger"
          >
            Reset Progress
          </Button>
        </div>
      </CardPanel>

      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border-2 border-red-300 bg-amber-50 p-6 text-amber-950 shadow-[0_18px_0_rgba(127,29,29,0.24)]">
            <Badge tone="red">Permanent Reset</Badge>
            <h3 className="mt-3 text-3xl font-black">Reset all progress?</h3>
            <p className="mt-3 text-sm font-bold leading-6 text-amber-900/80">
              This clears permanent progress saved in this browser. This is
              different from abandoning a dungeon run.
            </p>
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-950">
              <p>This will clear:</p>
              <p>word mastery, unlocked decks, completed decks, and best run stats.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" variant="danger" onClick={confirmResetProgress}>
                Reset All Progress
              </Button>
            </div>
          </div>
        </div>
      )}

      {isStartNewRunConfirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 text-amber-950 shadow-[0_18px_0_rgba(120,53,15,0.24)]">
            <Badge tone="amber">Start New Run</Badge>
            <h3 className="mt-3 text-3xl font-black">Start a new run?</h3>
            <p className="mt-3 text-sm font-bold leading-6 text-amber-900/80">
              This will abandon your current in-memory dungeon run. Permanent
              progress stays safe.
            </p>
            <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-bold leading-6 text-sky-950">
              <p>Current run: {activeRunSummary.deckName}</p>
              <p>
                Floor {activeRunSummary.currentFloor}, {activeRunSummary.gold} gold,
                {` ${activeRunSummary.monstersDefeated}`} monsters defeated.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsStartNewRunConfirmOpen(false);
                  onContinueRun();
                }}
              >
                Continue Current Run
              </Button>
              <Button type="button" variant="danger" onClick={confirmStartNewRun}>
                Start New Run
              </Button>
            </div>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
