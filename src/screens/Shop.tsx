import { useEffect, useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, StatCard } from "../components/ui";
import { sampleShopItems } from "../data";
import {
  ADD_SHIELD_AMOUNT,
  MIN_DISTINCT_VISIBLE_WORDS,
  MIN_RUN_DECK_SIZE,
  SHOP_REROLL_COST,
  UPGRADE_ATTACK_AMOUNT,
} from "../game/balance";
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
  onSpendRunGold: (cost: number) => boolean;
  runGold: number;
  runProgress: RunProgressState;
};

type PurchaseFeedback = {
  tone: "success" | "danger" | "neutral";
  message: string;
};

const offerCount = 4;
const targetOfferCount = 4;

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

function countUniqueWords(deck: WordCard[]) {
  return new Set(deck.map((card) => card.word.toLowerCase())).size;
}

function canRemoveCardWithoutBreakingQuestions(deck: WordCard[], cardId: string) {
  const deckAfterRemoval = deck.filter((card) => card.id !== cardId);

  return (
    deckAfterRemoval.length >= MIN_RUN_DECK_SIZE &&
    countUniqueWords(deckAfterRemoval) >= MIN_DISTINCT_VISIBLE_WORDS
  );
}

function shuffleItems<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getRandomOffers() {
  return shuffleItems(sampleShopItems).slice(0, offerCount);
}

function getCardEffectSummary(card: WordCard) {
  const shieldAmount = getCardShieldAmount(card);
  const element = getCardElement(card);
  const summary = [`ATK ${card.baseAttack}`];

  if (shieldAmount > 0) {
    summary.push(`SHD +${shieldAmount}`);
  }

  if (element) {
    summary.push(formatElementName(element.element));
  }

  return summary.join(" / ");
}

function getEligibleTargets(item: ShopItem, currentRunDeck: WordCard[]) {
  if (item.type !== "remove-card") {
    return currentRunDeck;
  }

  return currentRunDeck.filter((card) =>
    canRemoveCardWithoutBreakingQuestions(currentRunDeck, card.id),
  );
}

function getPurchasePreview(item: ShopItem, card: WordCard, deckSize: number) {
  const element = getShopItemElement(item);

  if (item.type === "upgrade-attack") {
    return `Attack ${card.baseAttack} -> ${card.baseAttack + UPGRADE_ATTACK_AMOUNT}`;
  }

  if (item.type === "add-shield") {
    const currentShield = getCardShieldAmount(card);

    return `Shield ${currentShield} -> ${currentShield + ADD_SHIELD_AMOUNT}`;
  }

  if (element) {
    const currentElement = getCardElement(card);

    return `${
      currentElement ? formatElementName(currentElement.element) : "No element"
    } -> ${formatElementName(element)}`;
  }

  if (item.type === "remove-card") {
    return `Deck size ${deckSize} -> ${deckSize - 1}`;
  }

  if (item.type === "duplicate-card") {
    return `Deck size ${deckSize} -> ${deckSize + 1}`;
  }

  return getCardEffectSummary(card);
}

function getOfferShortEffect(item: ShopItem) {
  const element = getShopItemElement(item);

  if (item.type === "upgrade-attack") {
    return `+${UPGRADE_ATTACK_AMOUNT} attack to one card`;
  }

  if (item.type === "add-shield") {
    return `Add Shield +${ADD_SHIELD_AMOUNT}`;
  }

  if (element) {
    return `Add or replace ${formatElementName(element)} element`;
  }

  if (item.type === "remove-card") {
    return "Remove one current-run card";
  }

  if (item.type === "duplicate-card") {
    return "Copy one current-run card";
  }

  return item.description;
}

function getPurchaseSuccessMessage(item: ShopItem, card: WordCard) {
  const element = getShopItemElement(item);

  if (item.type === "upgrade-attack") {
    return `${card.word} attack upgraded by +${UPGRADE_ATTACK_AMOUNT} for this run only.`;
  }

  if (item.type === "add-shield") {
    return `${card.word} gained Shield +${ADD_SHIELD_AMOUNT} for this run only.`;
  }

  if (element) {
    return `${card.word} now has Element: ${formatElementName(element)} for this run only.`;
  }

  if (item.type === "remove-card") {
    return `${card.word} removed from this run deck only.`;
  }

  if (item.type === "duplicate-card") {
    return `${card.word} duplicated with current-run upgrades preserved.`;
  }

  return `${item.name} purchased.`;
}

export function Shop({
  currentRunDeck,
  onNavigate,
  onPurchaseDuplicateCard,
  onPurchaseAttackUpgrade,
  onPurchaseElementUpgrade,
  onPurchaseRemoveCard,
  onPurchaseShieldUpgrade,
  onSpendRunGold,
  runGold,
  runProgress,
}: ShopProps) {
  const [shopOffers, setShopOffers] = useState<ShopItem[]>(() =>
    getRandomOffers(),
  );
  const [activeOffer, setActiveOffer] = useState<ShopItem | null>(null);
  const [targetCards, setTargetCards] = useState<WordCard[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [purchaseFeedback, setPurchaseFeedback] = useState<PurchaseFeedback>({
    tone: "neutral",
    message:
      "Choose a limited shop offer, then pick from a small set of current-run card targets.",
  });
  const activeTarget = targetCards.find((card) => card.id === selectedTargetId);

  const offerTargetCounts = useMemo(
    () =>
      Object.fromEntries(
        shopOffers.map((item) => [
          item.id,
          getEligibleTargets(item, currentRunDeck).length,
        ]),
      ),
    [currentRunDeck, shopOffers],
  );

  useEffect(() => {
    if (!activeOffer) {
      return;
    }

    const validTargetIds = new Set(currentRunDeck.map((card) => card.id));

    if (!selectedTargetId || validTargetIds.has(selectedTargetId)) {
      return;
    }

    setActiveOffer(null);
    setTargetCards([]);
    setSelectedTargetId("");
    setPurchaseFeedback({
      tone: "danger",
      message: "That target is no longer available in the current-run deck.",
    });
  }, [activeOffer, currentRunDeck, selectedTargetId]);

  function openOfferModal(item: ShopItem) {
    const eligibleTargets = getEligibleTargets(item, currentRunDeck);

    if (eligibleTargets.length === 0) {
      setPurchaseFeedback({
        tone: "danger",
        message: `${item.name} has no eligible targets right now.`,
      });
      return;
    }

    const nextTargets = shuffleItems(eligibleTargets).slice(0, targetOfferCount);

    setActiveOffer(item);
    setTargetCards(nextTargets);
    setSelectedTargetId(nextTargets[0]?.id ?? "");
    setPurchaseFeedback({
      tone: "neutral",
      message: `Choose one current-run card for ${item.name}. Gold is spent only after confirmation.`,
    });
  }

  function closeOfferModal() {
    setActiveOffer(null);
    setTargetCards([]);
    setSelectedTargetId("");
  }

  function confirmPurchase() {
    if (!activeOffer || !activeTarget) {
      setPurchaseFeedback({
        tone: "danger",
        message: "Choose a valid target before confirming the purchase.",
      });
      return;
    }

    const element = getShopItemElement(activeOffer);
    const isPurchased =
      activeOffer.type === "upgrade-attack"
        ? onPurchaseAttackUpgrade(activeTarget.id, activeOffer.cost)
        : activeOffer.type === "add-shield"
          ? onPurchaseShieldUpgrade(activeTarget.id, activeOffer.cost)
          : element
            ? onPurchaseElementUpgrade(
                activeTarget.id,
                activeOffer.cost,
                element,
              )
            : activeOffer.type === "remove-card"
              ? onPurchaseRemoveCard(activeTarget.id, activeOffer.cost)
              : activeOffer.type === "duplicate-card"
                ? onPurchaseDuplicateCard(activeTarget.id, activeOffer.cost)
                : false;

    if (!isPurchased) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Unable to buy ${activeOffer.name}. Check gold, target validity, and current-run deck safety rules.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${getPurchaseSuccessMessage(activeOffer, activeTarget)} Temporary run change only.`,
    });
    closeOfferModal();
  }

  function rerollOffers() {
    if (!onSpendRunGold(SHOP_REROLL_COST)) {
      setPurchaseFeedback({
        tone: "danger",
        message: `Reroll costs ${SHOP_REROLL_COST} gold.`,
      });
      return;
    }

    setShopOffers(getRandomOffers());
    closeOfferModal();
    setPurchaseFeedback({
      tone: "success",
      message: `Shop offers rerolled for ${SHOP_REROLL_COST} current-run gold.`,
    });
  }

  return (
    <ScreenShell
      eyebrow="Merchant"
      title="Current Run Shop"
      description="Trade temporary gold for a small set of run-only wares."
      framed={false}
    >
      <CardPanel className="mb-5 border-amber-700/30 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge tone="emerald">Current-run only</Badge>
            <p className="mt-3 text-xl font-black text-amber-950">
              The merchant reveals a few wares at a time.
            </p>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-amber-950/75">
              Upgrades, removals, duplicates, and elements affect only this
              current-run deck. Permanent mastery is not changed by shop
              purchases.
            </p>
            <details className="mt-3 rounded-xl border border-amber-900/10 bg-white/65 px-3 py-2">
              <summary className="cursor-pointer text-sm font-black text-amber-950">
                How the shop works
              </summary>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-900/75">
                Each visit shows limited offers. Refresh Wares spends run gold
                to reroll them. Inspect an offer, choose a target card, then
                confirm the trade. All shop changes are lost after run end,
                abandon, refresh, or deck change.
              </p>
            </details>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[34rem]">
            <StatCard label="Gold" value={runGold} helper="Temporary" tone="amber" />
            <StatCard label="Offers" value={shopOffers.length} helper="This visit" tone="emerald" />
            <StatCard
              label="Deck Size"
              value={currentRunDeck.length}
              helper={`Min ${MIN_RUN_DECK_SIZE} cards`}
              tone={currentRunDeck.length > MIN_RUN_DECK_SIZE ? "sky" : "red"}
            />
            <StatCard
              label="Progress"
              value={runProgress.monstersDefeated}
              helper={`Next shop ${runProgress.nextShopAt}`}
              tone="amber"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={rerollOffers}
            variant="secondary"
            disabled={runGold < SHOP_REROLL_COST}
          >
            Refresh Wares ({SHOP_REROLL_COST} gold)
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onNavigate("dungeon")}
          >
            Back To Dungeon
          </Button>
        </div>
      </CardPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shopOffers.map((item) => {
          const eligibleTargetCount = offerTargetCounts[item.id] ?? 0;
          const hasEnoughGold = runGold >= item.cost;
          const canSelectOffer = eligibleTargetCount > 0;

          return (
            <CardPanel
              key={item.id}
              className="flex min-h-64 flex-col border-amber-700/30 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 transition hover:-translate-y-0.5 hover:shadow-[0_10px_0_rgba(120,53,15,0.16),0_20px_38px_rgba(35,22,14,0.18),inset_0_1px_0_rgba(255,255,255,0.75)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-14 place-items-center rounded-xl border border-amber-900/15 bg-amber-100 text-sm font-black text-amber-950 shadow-inner">
                  {item.icon}
                </div>
                <Badge tone={canSelectOffer ? "emerald" : "red"}>
                  {item.type.replaceAll("-", " ")}
                </Badge>
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="text-xl font-black text-amber-950">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm font-black text-amber-900">
                  {getOfferShortEffect(item)}
                </p>
                <p className="mt-2 flex-1 text-sm font-medium leading-6 text-amber-950/70">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 border-t border-amber-900/10 pt-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge tone="amber">{item.cost} gold</Badge>
                  <p className="text-xs font-black uppercase text-amber-800/70">
                    {eligibleTargetCount > 0
                      ? `${eligibleTargetCount} eligible`
                      : "No eligible targets"}
                  </p>
                </div>
                <Button
                  type="button"
                  className="w-full"
                  disabled={!canSelectOffer}
                  onClick={() => openOfferModal(item)}
                  variant={hasEnoughGold ? "primary" : "secondary"}
                >
                  {canSelectOffer ? "Inspect Ware" : "No Eligible Targets"}
                </Button>
                {!hasEnoughGold && canSelectOffer && (
                  <p className="mt-2 text-xs font-bold text-red-700">
                    Not enough gold to buy after selecting.
                  </p>
                )}
              </div>
            </CardPanel>
          );
        })}
      </div>

      <div
        className={`mt-5 rounded-xl border-2 p-4 ${
          purchaseFeedback.tone === "success"
            ? "reward-pulse border-emerald-300 bg-emerald-100"
            : purchaseFeedback.tone === "danger"
              ? "damage-shake border-red-300 bg-red-100"
              : "border-amber-700/20 bg-amber-50"
        }`}
      >
        <p className="font-black text-amber-950">Merchant Note</p>
        <p className="mt-1 text-sm font-medium text-amber-950/75">
          {purchaseFeedback.message}
        </p>
      </div>

      {activeOffer && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-stone-950/70 p-2 backdrop-blur-sm sm:p-4">
          <div className="max-h-[min(88dvh,48rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-amber-300 bg-amber-50 p-3 text-amber-950 shadow-[0_18px_0_rgba(120,53,15,0.24)] sm:max-h-[min(92vh,48rem)] sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge tone="emerald">Enchant a card</Badge>
                <h3 className="mt-2 text-3xl font-black">
                  {activeOffer.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Pick one eligible current-run card. Gold is spent only when
                  you confirm the enchantment.
                </p>
              </div>
              <Badge tone={runGold >= activeOffer.cost ? "amber" : "red"}>
                {activeOffer.cost} gold
              </Badge>
            </div>

            <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
              {targetCards.map((card) => {
                const isSelected = selectedTargetId === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                  onClick={() => setSelectedTargetId(card.id)}
                  className={`rounded-2xl border-2 p-2.5 text-left transition sm:p-3 ${
                    isSelected
                      ? "selected-glow border-emerald-500 bg-white shadow-md ring-2 ring-emerald-200"
                      : "border-amber-900/10 bg-white/75 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md active:translate-y-0.5"
                  }`}
                >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-black capitalize sm:text-xl">
                          {card.word}
                        </p>
                        <p className="mt-1 truncate text-sm font-bold text-amber-900/65">
                          {card.meaningTh}
                        </p>
                        <p className="mt-2 text-xs font-black uppercase text-amber-800/70">
                          {getCardEffectSummary(card)}
                        </p>
                      </div>
                      {isSelected && <Badge tone="emerald">Selected</Badge>}
                    </div>
                    <p className="mt-2 rounded-lg bg-amber-100 px-2.5 py-2 text-sm font-black text-amber-950 sm:mt-3 sm:px-3">
                      {getPurchasePreview(
                        activeOffer,
                        card,
                        currentRunDeck.length,
                      )}
                    </p>
                  </button>
                );
              })}
            </div>

            {targetCards.length === 0 && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-black text-red-800">
                No eligible targets.
              </p>
            )}

            <div className="sticky bottom-0 mt-3 flex flex-col gap-2 border-t border-amber-900/10 bg-amber-50 pt-3 sm:mt-5 sm:flex-row sm:justify-end sm:gap-3">
              <Button type="button" variant="ghost" onClick={closeOfferModal}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmPurchase}
                disabled={
                  !activeTarget ||
                  targetCards.length === 0 ||
                  runGold < activeOffer.cost
                }
              >
                Confirm Trade
              </Button>
            </div>
            {runGold < activeOffer.cost && (
              <p className="mt-3 text-right text-sm font-black text-red-700">
                Not enough gold.
              </p>
            )}
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
