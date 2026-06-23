import { useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, ProgressBar } from "../components/ui";
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

function getDeckStatusLabel({
  isCompleted,
  isSelected,
  isUnlocked,
}: {
  isCompleted: boolean;
  isSelected: boolean;
  isUnlocked: boolean;
}) {
  if (isSelected) {
    return "Selected";
  }

  if (isCompleted) {
    return "Completed";
  }

  if (isUnlocked) {
    return "Unlocked";
  }

  return "Locked";
}

function getSelectedDeckRecommendation({
  isEveryDeckCompleted,
  isSelectedDeckCompleted,
  nextUnlockedDeck,
  selectedDeckMastery,
  unlockedDeckIds,
}: {
  isEveryDeckCompleted: boolean;
  isSelectedDeckCompleted: boolean;
  nextUnlockedDeck?: VocabularyDeck;
  selectedDeckMastery: ReturnType<typeof getDeckMasterySummary>;
  unlockedDeckIds: string[];
}) {
  if (isEveryDeckCompleted) {
    return "All current decks are complete. Replay a favorite deck or train mastery.";
  }

  if (
    isSelectedDeckCompleted &&
    nextUnlockedDeck &&
    unlockedDeckIds.includes(nextUnlockedDeck.id)
  ) {
    return `Completed. You can replay this deck or try ${nextUnlockedDeck.name}.`;
  }

  if (selectedDeckMastery.averageMastery < 2) {
    return "Next: train weak words to increase dungeon damage.";
  }

  return "Next: enter the dungeon and clear the boss.";
}

function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-amber-900/10 bg-white/65 px-3 py-2">
      <p className="text-[11px] font-black uppercase text-amber-800/65">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-black text-amber-950">{value}</p>
    </div>
  );
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
  const completedDeckCount = availableDecks.filter((deck) =>
    completedDeckIds.includes(deck.id),
  ).length;
  const selectedDeckNextAction = getSelectedDeckRecommendation({
    isEveryDeckCompleted,
    isSelectedDeckCompleted,
    nextUnlockedDeck,
    selectedDeckMastery,
    unlockedDeckIds,
  });
  const deckProgressPath = availableDecks
    .map((deck) => deck.name.replace(" Deck", ""))
    .join(" -> ");

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
      description="Choose what to do next with your selected vocabulary deck."
      framed={false}
    >
      <CardPanel className="border-amber-700/30 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-50">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-amber-800/70">
              Campfire Hub
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h3 className="text-3xl font-black leading-tight text-amber-950 sm:text-5xl">
                {selectedDeck.name}
              </h3>
              <Badge tone={isSelectedDeckCompleted ? "emerald" : "amber"}>
                {isSelectedDeckCompleted ? "Completed" : "Selected"}
              </Badge>
            </div>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-amber-950/75 sm:text-base">
              {selectedDeckNextAction}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="rounded-xl border border-amber-900/10 bg-white/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase text-amber-800/70">
                    Mastery
                  </p>
                  <p className="text-sm font-black text-amber-950">
                    {selectedDeckMastery.masteryPercent}%
                  </p>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={selectedDeckMastery.masteryPercent}
                    max={100}
                    label={`${selectedDeck.name} mastery progress`}
                    tone="emerald"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:w-64">
                <CompactMetric
                  label="Mastered"
                  value={`${selectedDeckMastery.masteredWords}/${selectedDeckMastery.totalCards}`}
                />
                <CompactMetric
                  label="Words"
                  value={selectedDeck.cards.length}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={hasActiveRun ? onContinueRun : requestStartAdventure}
              >
                {hasActiveRun ? "Continue Run" : "Start Adventure"}
              </Button>
              <Button
                type="button"
                onClick={() => onNavigate("training")}
                variant="secondary"
              >
                Train
              </Button>
              <Button
                type="button"
                onClick={() => onNavigate("deck-review")}
                variant="secondary"
              >
                Review Deck
              </Button>
              {hasActiveRun && (
                <Button
                  type="button"
                  onClick={requestStartAdventure}
                  variant="ghost"
                >
                  Start New Run
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-900/10 bg-white/70 p-3">
            {hasActiveRun ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-amber-950">Run in progress</p>
                  <Badge tone="sky">Continue</Badge>
                </div>
                <p className="mt-2 text-sm font-bold leading-5 text-amber-900/75">
                  Kept in memory for this app session. Timer is stopped while
                  you are on Home.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <CompactMetric
                    label="Floor"
                    value={activeRunSummary.currentFloor}
                  />
                  <CompactMetric
                    label="Gold"
                    value={activeRunSummary.gold}
                  />
                  <CompactMetric
                    label="Defeated"
                    value={`${activeRunSummary.monstersDefeated}/${activeRunSummary.bossRequirement}`}
                  />
                  <CompactMetric
                    label="HP / SHD"
                    value={`${activeRunSummary.playerHp ?? "?"}/${activeRunSummary.shield ?? "?"}`}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="font-black text-amber-950">Ready at camp</p>
                <p className="mt-2 text-sm font-bold leading-5 text-amber-900/75">
                  Progress is saved locally in this browser. Dungeon HP, gold,
                  shield, and upgrades stay temporary.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <CompactMetric
                    label="Deck"
                    value={isSelectedDeckCompleted ? "Done" : "Open"}
                  />
                  <CompactMetric
                    label="Avg"
                    value={`${selectedDeckMastery.averageMastery}/5`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardPanel>

      <CardPanel className="mt-5 border-amber-700/25 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-amber-800/70">
              Select Deck
            </p>
            <h3 className="mt-1 text-2xl font-black text-amber-950">
              Journey Map
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-amber-900/75">
              {deckProgressPath}
            </p>
            <p className="mt-1 text-sm font-black text-amber-950">
              Next unlock: {nextUnlockTarget}
            </p>
          </div>
          <p className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-900">
            {completedDeckCount}/{availableDecks.length} completed
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {availableDecks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            const isCompleted = completedDeckIds.includes(deck.id);
            const isUnlocked = unlockedDeckIds.includes(deck.id);
            const requirement = getDeckRequirementText(deck.id, availableDecks);
            const masterySummary = getDeckMasterySummary(deck, wordMastery);
            const statusLabel = getDeckStatusLabel({
              isCompleted,
              isSelected,
              isUnlocked,
            });

            return (
              <article
                key={deck.id}
                className={`rounded-xl border p-3 transition ${
                  !isUnlocked
                    ? "border-stone-300 bg-stone-100/75 opacity-80"
                    : isSelected
                      ? "selected-glow border-amber-500 bg-white shadow-[0_4px_0_rgba(120,53,15,0.12)]"
                      : "border-amber-900/15 bg-white/70 hover:-translate-y-0.5 hover:border-amber-500"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-amber-950">
                      {deck.name}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-amber-900/65">
                      {deck.cards.length} words · {masterySummary.masteryPercent}% mastery
                    </p>
                  </div>
                  <Badge
                    tone={
                      isCompleted
                        ? "emerald"
                        : !isUnlocked
                          ? "slate"
                          : isSelected
                            ? "amber"
                            : "sky"
                    }
                  >
                    {statusLabel}
                  </Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={masterySummary.masteryPercent}
                    max={100}
                    label={`${deck.name} mastery`}
                    tone={isCompleted ? "emerald" : "sky"}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`text-xs font-bold leading-5 ${
                      isUnlocked ? "text-amber-900/70" : "text-stone-600"
                    }`}
                  >
                    {isUnlocked
                      ? isSelected
                        ? "Selected for Review, Training, and Dungeon."
                        : isCompleted
                          ? "Completed. Replay anytime."
                          : "Unlocked."
                      : requirement}
                  </p>
                  {isUnlocked && !isSelected && (
                    <Button
                      type="button"
                      onClick={() => onSelectDeck(deck.id)}
                      className="px-3 py-1.5 text-sm"
                      variant="secondary"
                    >
                      Select
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </CardPanel>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <CardPanel className="border-emerald-800/20 bg-emerald-50/90">
          <details>
            <summary className="cursor-pointer">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-800/70">
                    Adventurer Records
                  </p>
                  <h3 className="mt-1 text-xl font-black text-amber-950">
                    Compact best run summary
                  </h3>
                </div>
                <span className="text-sm font-black uppercase text-amber-800/70">
                  Open details
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <CompactMetric
                  label="Best"
                  value={playerStatistics.bestMonstersDefeated}
                />
                <CompactMetric
                  label="Accuracy"
                  value={`${playerStatistics.bestAccuracy}%`}
                />
                <CompactMetric
                  label="Runs"
                  value={playerStatistics.completedRuns + playerStatistics.failedRuns}
                />
              </div>
            </summary>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <CompactMetric
                label="Best Damage"
                value={playerStatistics.bestDamageDealt}
              />
              <CompactMetric
                label="Completed Runs"
                value={playerStatistics.completedRuns}
              />
              <CompactMetric
                label="Failed Runs"
                value={playerStatistics.failedRuns}
              />
              <CompactMetric
                label="Total Correct"
                value={playerStatistics.totalCorrectAnswers}
              />
              <CompactMetric
                label="Total Wrong"
                value={playerStatistics.totalWrongAnswers}
              />
              <CompactMetric
                label="Decks Done"
                value={`${completedDeckCount}/${availableDecks.length}`}
              />
            </div>
          </details>
        </CardPanel>

        <CardPanel className="border-sky-800/20 bg-sky-50/90">
          <details>
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span>
                <span className="text-xs font-black uppercase tracking-wide text-sky-800/70">
                  How to Play
                </span>
                <span className="mt-1 block text-xl font-black text-amber-950">
                  New adventurer guide
                </span>
              </span>
              <span className="text-sm font-black uppercase text-amber-800/70">
                Open guide
              </span>
            </summary>
            <ol className="mt-4 grid gap-2 text-sm font-bold leading-6 text-amber-950/75">
              <li>1. Review Deck to inspect words, meanings, and examples.</li>
              <li>2. Train safely with untimed recall questions.</li>
              <li>3. Enter Dungeon and answer timed mini-games to trigger cards.</li>
              <li>4. Spend temporary run gold in Shop when checkpoints appear.</li>
              <li>5. Defeat the boss to complete the selected deck.</li>
            </ol>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-950">
                Permanent: mastery, unlocks, completed decks, records.
              </p>
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
                Temporary: HP, shield, gold, upgrades, run deck, Word Energy.
              </p>
            </div>
          </details>
        </CardPanel>
      </div>

      <CardPanel className="mt-5 border-stone-400/30 bg-stone-100/90">
        <details>
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
            <span>
              <span className="text-xs font-black uppercase tracking-wide text-stone-600">
                Local Save
              </span>
              <span className="mt-1 block text-xl font-black text-amber-950">
                Progress is saved locally in this browser.
              </span>
            </span>
            <span className="text-sm font-black uppercase text-red-700/70">
              Reset options
            </span>
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <p className="text-sm font-bold leading-6 text-amber-950/75">
              Reset Progress clears word mastery, unlocked decks, completed
              decks, and saved statistics. It is separate from Abandon Run,
              which only ends the current temporary run.
            </p>
            <Button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              variant="danger"
            >
              Reset Progress
            </Button>
          </div>
        </details>
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
