import { useEffect, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, StatCard } from "../components/ui";
import { sampleShopItems } from "../data";
import type {
  ElementType,
  RunProgressState,
  ScreenName,
  ShopItem,
  WordCard,
} from "../types";

type ShopProps = {
  currentRunDeck: WordCard[];
  onNavigate: (screen: ScreenName) => void;
  onPurchaseDuplicateCard: (cardId: string, cost: number) => boolean;
  onPurchaseAttackUpgrade: (cardId: string, cost: number) => boolean;
  onPurchaseElementUpgrade: (
    cardId: string,
    cost: number,
    element: ElementType,
  ) => boolean;
  onPurchaseRemoveCard: (cardId: string, cost: number) => boolean;
  onPurchaseShieldUpgrade: (cardId: string, cost: number) => boolean;
  runGold: number;
  runProgress: RunProgressState;
};

type PurchaseFeedback = {
  tone: "success" | "danger" | "neutral";
  message: string;
};

const upgradeAttackItemId = "upgrade-attack";
const addShieldItemId = "add-shield";
const removeCardItemId = "remove-card";
const duplicateCardItemId = "duplicate-card";
const attackUpgradeAmount = 2;
const shieldUpgradeAmount = 3;
const minimumRunDeckSize = 5;
const minimumBattleWordOptions = 4;

function formatElementName(element: ElementType) {
  return element.charAt(0).toUpperCase() + element.slice(1);
}

function getCardShieldAmount(card: WordCard) {
  return (
    card.effects?.reduce(
      (total, effect) => total + (effect.type === "shield" ? effect.amount : 0),
      0,
    ) ?? 0
  );
}

function getCardElement(card: WordCard) {
  return card.effects?.find((effect) => effect.type === "element");
}

function getShopItemElement(item: ShopItem) {
  return item.effect?.type === "element" ? item.effect.element : null;
}

function getCardEffectSummary(card: WordCard) {
  const shieldAmount = getCardShieldAmount(card);
  const element = getCardElement(card);
  const summary = [`Attack ${card.baseAttack}`];

  if (shieldAmount > 0) {
    summary.push(`Shield +${shieldAmount}`);
  }

  if (element) {
    summary.push(`Element: ${formatElementName(element.element)}`);
  }

  return summary.join(" / ");
}

function countUniqueWords(deck: WordCard[]) {
  return new Set(deck.map((card) => card.word.toLowerCase())).size;
}

function canRemoveCardWithoutBreakingQuestions(deck: WordCard[], cardId: string) {
  const deckAfterRemoval = deck.filter((card) => card.id !== cardId);

  return (
    deckAfterRemoval.length >= minimumRunDeckSize &&
    countUniqueWords(deckAfterRemoval) >= minimumBattleWordOptions
  );
}

export function Shop({
  currentRunDeck,
  onNavigate,
  onPurchaseDuplicateCard,
  onPurchaseAttackUpgrade,
  onPurchaseElementUpgrade,
  onPurchaseRemoveCard,
  onPurchaseShieldUpgrade,
  runGold,
  runProgress,
}: ShopProps) {
  const [selectedAttackCardId, setSelectedAttackCardId] = useState(
    currentRunDeck[0]?.id ?? "",
  );
  const [selectedShieldCardId, setSelectedShieldCardId] = useState(
    currentRunDeck[0]?.id ?? "",
  );
  const [selectedRemoveCardId, setSelectedRemoveCardId] = useState(
    currentRunDeck[0]?.id ?? "",
  );
  const [selectedDuplicateCardId, setSelectedDuplicateCardId] = useState(
    currentRunDeck[0]?.id ?? "",
  );
  const [selectedElementCardIds, setSelectedElementCardIds] = useState<
    Record<string, string>
  >({});
  const [purchaseFeedback, setPurchaseFeedback] = useState<PurchaseFeedback>({
    tone: "neutral",
    message: "Choose a card to preview an active shop purchase.",
  });
  const selectedAttackCard = currentRunDeck.find(
    (card) => card.id === selectedAttackCardId,
  );
  const selectedShieldCard = currentRunDeck.find(
    (card) => card.id === selectedShieldCardId,
  );
  const selectedRemoveCard = currentRunDeck.find(
    (card) => card.id === selectedRemoveCardId,
  );
  const selectedDuplicateCard = currentRunDeck.find(
    (card) => card.id === selectedDuplicateCardId,
  );
  const canRemoveCards = currentRunDeck.length > minimumRunDeckSize;
  const canRemoveSelectedCard =
    Boolean(selectedRemoveCard) &&
    canRemoveCards &&
    canRemoveCardWithoutBreakingQuestions(
      currentRunDeck,
      selectedRemoveCardId,
    );
  const firstRunCardId = currentRunDeck[0]?.id ?? "";

  useEffect(() => {
    const cardIds = new Set(currentRunDeck.map((card) => card.id));

    if (!cardIds.has(selectedAttackCardId)) {
      setSelectedAttackCardId(firstRunCardId);
    }

    if (!cardIds.has(selectedShieldCardId)) {
      setSelectedShieldCardId(firstRunCardId);
    }

    if (!cardIds.has(selectedRemoveCardId)) {
      setSelectedRemoveCardId(firstRunCardId);
    }

    if (!cardIds.has(selectedDuplicateCardId)) {
      setSelectedDuplicateCardId(firstRunCardId);
    }

    setSelectedElementCardIds((currentSelections) => {
      let didChange = false;
      const nextSelections: Record<string, string> = {};

      for (const [itemId, cardId] of Object.entries(currentSelections)) {
        if (cardIds.has(cardId)) {
          nextSelections[itemId] = cardId;
          continue;
        }

        nextSelections[itemId] = firstRunCardId;
        didChange = true;
      }

      return didChange ? nextSelections : currentSelections;
    });
  }, [
    currentRunDeck,
    firstRunCardId,
    selectedAttackCardId,
    selectedDuplicateCardId,
    selectedRemoveCardId,
    selectedShieldCardId,
  ]);

  function handlePurchaseAttackUpgrade(cost: number) {
    if (!selectedAttackCard) {
      setPurchaseFeedback({
        tone: "danger",
        message: "Choose a card before buying Upgrade Attack.",
      });
      return;
    }

    const isPurchased = onPurchaseAttackUpgrade(selectedAttackCard.id, cost);

    if (!isPurchased) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Unable to buy Upgrade Attack. It costs ${cost} gold and needs a valid current-run card.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedAttackCard.word} attack upgraded by +${attackUpgradeAmount} for this run only. This upgrade resets on run restart, failure, or refresh.`,
    });
  }

  function handlePurchaseShieldUpgrade(cost: number) {
    if (!selectedShieldCard) {
      setPurchaseFeedback({
        tone: "danger",
        message: "Choose a card before buying Add Shield.",
      });
      return;
    }

    const isPurchased = onPurchaseShieldUpgrade(selectedShieldCard.id, cost);

    if (!isPurchased) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Unable to buy Add Shield. It costs ${cost} gold and needs a valid current-run card.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedShieldCard.word} gained Shield +${shieldUpgradeAmount} for this run only. This shield effect resets with the run deck.`,
    });
  }

  function getSelectedElementCard(itemId: string) {
    const selectedCardId = selectedElementCardIds[itemId] ?? currentRunDeck[0]?.id;

    return currentRunDeck.find((card) => card.id === selectedCardId);
  }

  function handleSelectElementCard(itemId: string, cardId: string) {
    setSelectedElementCardIds((currentSelections) => ({
      ...currentSelections,
      [itemId]: cardId,
    }));
  }

  function handlePurchaseElementUpgrade(item: ShopItem, element: ElementType) {
    const selectedElementCard = getSelectedElementCard(item.id);

    if (!selectedElementCard) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Choose a card before buying ${item.name}.`,
      });
      return;
    }

    const isPurchased = onPurchaseElementUpgrade(
      selectedElementCard.id,
      item.cost,
      element,
    );

    if (!isPurchased) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Unable to buy ${item.name}. It costs ${item.cost} gold and needs a valid current-run card.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedElementCard.word} now has Element: ${formatElementName(element)} for this run only. Element effects are display-only for now.`,
    });
  }

  function handlePurchaseRemoveCard(cost: number) {
    if (!canRemoveCards) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Remove Card is disabled because the current-run deck must keep at least ${minimumRunDeckSize} cards.`,
      });
      return;
    }

    if (!selectedRemoveCard) {
      setPurchaseFeedback({
        tone: "danger",
        message: "Choose a card before buying Remove Card.",
      });
      return;
    }

    if (!canRemoveSelectedCard) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Choose a different card. Battle questions need at least ${minimumBattleWordOptions} distinct visible words after removal.`,
      });
      return;
    }

    const isPurchased = onPurchaseRemoveCard(selectedRemoveCard.id, cost);

    if (!isPurchased) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Unable to buy Remove Card. It costs ${cost} gold, needs a valid current-run card, and cannot reduce the deck below ${minimumRunDeckSize} cards.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedRemoveCard.word} removed from this run deck only. The source deck and permanent progress were not changed.`,
    });
  }

  function handlePurchaseDuplicateCard(cost: number) {
    if (!selectedDuplicateCard) {
      setPurchaseFeedback({
        tone: "danger",
        message: "Choose a card before buying Duplicate Card.",
      });
      return;
    }

    const isPurchased = onPurchaseDuplicateCard(selectedDuplicateCard.id, cost);

    if (!isPurchased) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Unable to buy Duplicate Card. It costs ${cost} gold and needs a valid current-run card.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedDuplicateCard.word} duplicated with current-run upgrades preserved. The copy exists only for this run.`,
    });
  }

  return (
    <ScreenShell
      eyebrow="Upgrade"
      title="Current Run Shop"
      description="Buy temporary current-run upgrades and mutate the current-run deck."
      framed={false}
    >
      <CardPanel className="mb-6 border-amber-700/30 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="emerald">Current-run only</Badge>
            <p className="mt-3 text-xl font-black text-amber-950">
              Shop upgrades are temporary and affect only the current run.
            </p>
            <p className="mt-2 text-sm font-medium text-amber-950/75">
              Upgrade Attack, Add Shield, and Element items can modify copied
              current-run cards. Remove and Duplicate now mutate only this run
              deck.
            </p>
            <p className="mt-2 text-sm font-bold text-amber-900">
              Run failure, run restart, or page refresh resets these deck
              changes. Word mastery and completed deck status stay permanent.
            </p>
          </div>
          <div className="grid gap-3 sm:min-w-72 sm:grid-cols-4">
            <StatCard
              label="Gold"
              value={runGold}
              helper="Temporary"
              tone="amber"
            />
            <StatCard
              label="Mode"
              value="Active"
              helper="Current run"
              tone="emerald"
            />
            <StatCard
              label="Deck Size"
              value={currentRunDeck.length}
              helper={`Min ${minimumRunDeckSize} cards / ${minimumBattleWordOptions} words`}
              tone={canRemoveCards ? "sky" : "red"}
            />
            <StatCard
              label="Progress"
              value={runProgress.monstersDefeated}
              helper={`Next shop ${runProgress.nextShopAt}`}
              tone="amber"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-5"
          onClick={() => onNavigate("dungeon")}
        >
          Back To Dungeon
        </Button>
      </CardPanel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sampleShopItems.map((item) => {
          const isUpgradeAttack = item.id === upgradeAttackItemId;
          const isAddShield = item.id === addShieldItemId;
          const isRemoveCard = item.id === removeCardItemId;
          const isDuplicateCard = item.id === duplicateCardItemId;
          const element = getShopItemElement(item);
          const isAddElement = element !== null;
          const isActivePurchase =
            isUpgradeAttack ||
            isAddShield ||
            isAddElement ||
            isRemoveCard ||
            isDuplicateCard;
          const selectedElementCard = getSelectedElementCard(item.id);

          return (
            <CardPanel
              key={item.id}
              className={`flex min-h-72 flex-col ${
                isActivePurchase
                  ? "border-amber-700/30 bg-gradient-to-br from-amber-50 to-orange-50"
                  : "opacity-85"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-amber-900/15 bg-amber-100 text-xl font-black text-amber-950 shadow-inner">
                  {item.icon}
                </div>
                <Badge tone={isActivePurchase ? "emerald" : "slate"}>
                  {item.type.replaceAll("-", " ")}
                </Badge>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="text-xl font-black text-amber-950">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm font-medium leading-6 text-amber-950/70">
                  {item.description}
                </p>
              </div>

              {isUpgradeAttack && (
                <div className="mt-5 rounded-lg border border-emerald-700/20 bg-emerald-100/70 p-3">
                  <p className="text-sm font-black text-emerald-950">
                    Choose current-run card
                  </p>
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {currentRunDeck.map((card) => {
                      const isSelected = selectedAttackCardId === card.id;

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setSelectedAttackCardId(card.id)}
                          className={`w-full rounded-md border p-3 text-left transition ${
                            isSelected
                              ? "border-emerald-600 bg-white ring-1 ring-emerald-300"
                              : "border-emerald-700/20 bg-white/70 hover:border-emerald-500"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold capitalize text-slate-950">
                              {card.word}
                            </span>
                            <span className="text-sm font-semibold text-slate-600">
                              {card.baseAttack} -&gt;{" "}
                              {card.baseAttack + attackUpgradeAmount}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAttackCard && (
                    <p className="mt-3 text-sm font-semibold text-emerald-900">
                      Preview: {selectedAttackCard.word}{" "}
                      {selectedAttackCard.baseAttack} -&gt;{" "}
                      {selectedAttackCard.baseAttack + attackUpgradeAmount}
                    </p>
                  )}
                </div>
              )}

              {isAddShield && (
                <div className="mt-5 rounded-lg border border-sky-700/20 bg-sky-100/70 p-3">
                  <p className="text-sm font-black text-sky-950">
                    Choose current-run card
                  </p>
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {currentRunDeck.map((card) => {
                      const isSelected = selectedShieldCardId === card.id;
                      const currentShield = getCardShieldAmount(card);

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setSelectedShieldCardId(card.id)}
                          className={`w-full rounded-md border p-3 text-left transition ${
                            isSelected
                              ? "border-sky-500 bg-white ring-1 ring-sky-200"
                              : "border-sky-100 bg-white/70 hover:border-sky-400"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold capitalize text-slate-950">
                              {card.word}
                            </span>
                            <span className="text-sm font-semibold text-slate-600">
                              Shield {currentShield} -&gt;{" "}
                              {currentShield + shieldUpgradeAmount}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedShieldCard && (
                    <p className="mt-3 text-sm font-semibold text-sky-900">
                      Preview: {selectedShieldCard.word} Shield{" "}
                      {getCardShieldAmount(selectedShieldCard)} -&gt;{" "}
                      {getCardShieldAmount(selectedShieldCard) +
                        shieldUpgradeAmount}
                    </p>
                  )}
                </div>
              )}

              {element && (
                <div className="mt-5 rounded-lg border border-amber-700/20 bg-amber-100/80 p-3">
                  <p className="text-sm font-black text-amber-950">
                    Choose current-run card
                  </p>
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {currentRunDeck.map((card) => {
                      const selectedCardId =
                        selectedElementCardIds[item.id] ?? currentRunDeck[0]?.id;
                      const isSelected = selectedCardId === card.id;
                      const currentElement = getCardElement(card);

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleSelectElementCard(item.id, card.id)}
                          className={`w-full rounded-md border p-3 text-left transition ${
                            isSelected
                              ? "border-amber-500 bg-white ring-1 ring-amber-200"
                              : "border-amber-100 bg-white/70 hover:border-amber-400"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold capitalize text-slate-950">
                              {card.word}
                            </span>
                            <span className="text-sm font-semibold text-slate-600">
                              {currentElement
                                ? formatElementName(currentElement.element)
                                : "None"}{" "}
                              -&gt; {formatElementName(element)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedElementCard && (
                    <p className="mt-3 text-sm font-semibold text-amber-900">
                      Preview: {selectedElementCard.word}{" "}
                      {getCardElement(selectedElementCard)
                        ? formatElementName(
                            getCardElement(selectedElementCard)!.element,
                          )
                        : "None"}{" "}
                      -&gt; {formatElementName(element)}
                    </p>
                  )}
                </div>
              )}

              {isRemoveCard && (
                <div className="mt-5 rounded-lg border border-red-700/20 bg-red-100/70 p-3">
                  <p className="text-sm font-black text-red-950">
                    Choose card to remove
                  </p>
                  {!canRemoveCards && (
                    <p className="mt-2 rounded-md border border-red-200 bg-white p-2 text-sm font-semibold text-red-700">
                      Remove Card is disabled. Current-run deck must keep at
                      least {minimumRunDeckSize} cards and{" "}
                      {minimumBattleWordOptions} distinct words so battle
                      questions still have enough options.
                    </p>
                  )}
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {currentRunDeck.map((card) => {
                      const isSelected = selectedRemoveCardId === card.id;

                      return (
                        <button
                          key={card.id}
                          type="button"
                          disabled={!canRemoveCards}
                          onClick={() => setSelectedRemoveCardId(card.id)}
                          className={`w-full rounded-md border p-3 text-left transition ${
                            isSelected
                              ? "border-red-500 bg-white ring-1 ring-red-200"
                              : "border-red-100 bg-white/70 hover:border-red-400"
                          } ${canRemoveCards ? "" : "cursor-not-allowed opacity-60"}`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold capitalize text-slate-950">
                              {card.word}
                            </span>
                            <span className="text-sm text-slate-600">
                              {getCardEffectSummary(card)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedRemoveCard && canRemoveCards && (
                    <p className="mt-3 text-sm font-semibold text-red-900">
                      {canRemoveSelectedCard
                        ? `Preview: remove ${selectedRemoveCard.word}. Deck size ${currentRunDeck.length} -> ${currentRunDeck.length - 1}`
                        : `Choose a different card. At least ${minimumBattleWordOptions} distinct words must remain for battle questions.`}
                    </p>
                  )}
                </div>
              )}

              {isDuplicateCard && (
                <div className="mt-5 rounded-lg border border-violet-700/20 bg-violet-100/70 p-3">
                  <p className="text-sm font-black text-violet-950">
                    Choose card to duplicate
                  </p>
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {currentRunDeck.map((card) => {
                      const isSelected = selectedDuplicateCardId === card.id;

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setSelectedDuplicateCardId(card.id)}
                          className={`w-full rounded-md border p-3 text-left transition ${
                            isSelected
                              ? "border-violet-500 bg-white ring-1 ring-violet-200"
                              : "border-violet-100 bg-white/70 hover:border-violet-400"
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold capitalize text-slate-950">
                              {card.word}
                            </span>
                            <span className="text-sm text-slate-600">
                              {getCardEffectSummary(card)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedDuplicateCard && (
                    <p className="mt-3 text-sm font-semibold text-violet-900">
                      Preview: copy {selectedDuplicateCard.word} with{" "}
                      {getCardEffectSummary(selectedDuplicateCard)}. Deck size{" "}
                      {currentRunDeck.length} -&gt; {currentRunDeck.length + 1}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase text-amber-800/70">Cost</p>
                  <Badge tone="amber">{item.cost} gold</Badge>
                </div>
                {isUpgradeAttack ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!selectedAttackCard}
                    onClick={() => handlePurchaseAttackUpgrade(item.cost)}
                  >
                    Buy Upgrade Attack
                  </Button>
                ) : isAddShield ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!selectedShieldCard}
                    onClick={() => handlePurchaseShieldUpgrade(item.cost)}
                  >
                    Buy Add Shield
                  </Button>
                ) : element ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!selectedElementCard}
                    onClick={() => handlePurchaseElementUpgrade(item, element)}
                  >
                    Buy {item.name}
                  </Button>
                ) : isRemoveCard ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!canRemoveSelectedCard}
                    onClick={() => handlePurchaseRemoveCard(item.cost)}
                  >
                    {canRemoveCards ? "Buy Remove Card" : "Deck Too Small"}
                  </Button>
                ) : isDuplicateCard ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!selectedDuplicateCard}
                    onClick={() => handlePurchaseDuplicateCard(item.cost)}
                  >
                    Buy Duplicate Card
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    disabled
                  >
                    Coming Soon
                  </Button>
                )}
              </div>
            </CardPanel>
          );
        })}
      </div>

      <div
        className={`mt-5 rounded-xl border-2 p-4 ${
          purchaseFeedback.tone === "success"
            ? "border-emerald-300 bg-emerald-100"
            : purchaseFeedback.tone === "danger"
              ? "border-red-300 bg-red-100"
              : "border-amber-700/20 bg-amber-50"
        }`}
      >
        <p className="font-black text-amber-950">Shopkeeper Note</p>
        <p className="mt-1 text-sm font-medium text-amber-950/75">
          {purchaseFeedback.message}
        </p>
      </div>
    </ScreenShell>
  );
}
