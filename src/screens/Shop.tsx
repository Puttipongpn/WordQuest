import { useEffect, useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel } from "../components/ui";
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
import { playSound } from "../utils/soundManager";

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
  title: string;
  message: string;
  details?: string[];
  badge?: string;
  affectedCardId?: string;
};

type PurchaseCeremony = {
  title: string;
  cardWord: string;
  cardMeaning: string;
  cardIcon: string;
  icon: string;
  badge: string;
  statLine: string;
  goldLine: string;
  summary: string;
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
    return `ATK ${card.baseAttack} -> ${card.baseAttack + UPGRADE_ATTACK_AMOUNT}`;
  }

  if (item.type === "add-shield") {
    const currentShield = getCardShieldAmount(card);

    return `SHD +${currentShield} -> +${currentShield + ADD_SHIELD_AMOUNT}`;
  }

  if (element) {
    const currentElement = getCardElement(card);

    return `Element ${
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

function getPurchasePreviewHelper(item: ShopItem) {
  if (item.type === "remove-card") {
    return "Remove from this run.";
  }

  if (item.type === "duplicate-card") {
    return "Copy keeps upgrades.";
  }

  return "Run-only upgrade.";
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

function getPurchaseReceipt(
  item: ShopItem,
  card: WordCard,
  deckSizeBefore: number,
  goldBefore: number,
): PurchaseFeedback {
  const element = getShopItemElement(item);
  const goldAfter = goldBefore - item.cost;
  const goldLine = `Spent ${item.cost} gold. ${goldAfter} gold left.`;

  if (item.type === "upgrade-attack") {
    const attackAfter = card.baseAttack + UPGRADE_ATTACK_AMOUNT;

    return {
      tone: "success",
      title: `${card.word} upgraded`,
      badge: `+${UPGRADE_ATTACK_AMOUNT} ATK`,
      affectedCardId: card.id,
      message: `ATK ${card.baseAttack} -> ${attackAfter}. ${goldLine}`,
    };
  }

  if (item.type === "add-shield") {
    const shieldBefore = getCardShieldAmount(card);
    const shieldAfter = shieldBefore + ADD_SHIELD_AMOUNT;

    return {
      tone: "success",
      title: `${card.word} fortified`,
      badge: `SHD +${ADD_SHIELD_AMOUNT}`,
      affectedCardId: card.id,
      message: `SHD +${shieldBefore} -> +${shieldAfter}. ${goldLine}`,
    };
  }

  if (element) {
    const currentElement = getCardElement(card);
    const beforeElement = currentElement
      ? formatElementName(currentElement.element)
      : "None";
    const afterElement = formatElementName(element);

    return {
      tone: "success",
      title: `${card.word} infused`,
      badge: `${afterElement} Element`,
      affectedCardId: card.id,
      message: `Element ${beforeElement} -> ${afterElement}. ${goldLine}`,
    };
  }

  if (item.type === "remove-card") {
    return {
      tone: "success",
      title: `${card.word} removed`,
      badge: "Removed",
      affectedCardId: card.id,
      message: `Deck ${deckSizeBefore} -> ${deckSizeBefore - 1}. ${goldLine}`,
    };
  }

  if (item.type === "duplicate-card") {
    return {
      tone: "success",
      title: `${card.word} copied`,
      badge: "Copied",
      affectedCardId: card.id,
      message: `Deck ${deckSizeBefore} -> ${deckSizeBefore + 1}. ${goldLine}`,
    };
  }

  return {
    tone: "success",
    title: "Trade Complete!",
    badge: "Purchased",
    affectedCardId: card.id,
    message: `${getPurchaseSuccessMessage(item, card)} ${goldLine}`,
  };
}

function getPurchaseCeremony(
  item: ShopItem,
  card: WordCard,
  deckSizeBefore: number,
): PurchaseCeremony {
  const element = getShopItemElement(item);
  const goldLine = `-${item.cost} G`;

  if (item.type === "upgrade-attack") {
    return {
      title: `${card.word} upgraded`,
      cardWord: card.word,
      cardMeaning: card.meaningTh,
      cardIcon: card.imagePlaceholder,
      icon: "🔨",
      badge: `+${UPGRADE_ATTACK_AMOUNT} ATK`,
      statLine: `ATK ${card.baseAttack} -> ${
        card.baseAttack + UPGRADE_ATTACK_AMOUNT
      }`,
      goldLine,
      summary: getCardEffectSummary(card),
    };
  }

  if (item.type === "add-shield") {
    const shieldBefore = getCardShieldAmount(card);

    return {
      title: `${card.word} fortified`,
      cardWord: card.word,
      cardMeaning: card.meaningTh,
      cardIcon: card.imagePlaceholder,
      icon: "🛡️",
      badge: `+${ADD_SHIELD_AMOUNT} SHD`,
      statLine: `SHD ${shieldBefore} -> ${shieldBefore + ADD_SHIELD_AMOUNT}`,
      goldLine,
      summary: getCardEffectSummary(card),
    };
  }

  if (element) {
    const currentElement = getCardElement(card);
    const beforeElement = currentElement
      ? formatElementName(currentElement.element)
      : "None";
    const afterElement = formatElementName(element);

    return {
      title: `${card.word} infused`,
      cardWord: card.word,
      cardMeaning: card.meaningTh,
      cardIcon: card.imagePlaceholder,
      icon: "✨",
      badge: afterElement.toUpperCase(),
      statLine: `${beforeElement} -> ${afterElement}`,
      goldLine,
      summary: getCardEffectSummary(card),
    };
  }

  if (item.type === "remove-card") {
    return {
      title: `${card.word} removed`,
      cardWord: card.word,
      cardMeaning: card.meaningTh,
      cardIcon: card.imagePlaceholder,
      icon: "🗑️",
      badge: "Removed",
      statLine: `Deck ${deckSizeBefore} -> ${deckSizeBefore - 1}`,
      goldLine,
      summary: getCardEffectSummary(card),
    };
  }

  if (item.type === "duplicate-card") {
    return {
      title: `${card.word} copied`,
      cardWord: card.word,
      cardMeaning: card.meaningTh,
      cardIcon: card.imagePlaceholder,
      icon: "🃏",
      badge: "Copied",
      statLine: `Deck ${deckSizeBefore} -> ${deckSizeBefore + 1}`,
      goldLine,
      summary: getCardEffectSummary(card),
    };
  }

  return {
    title: `${card.word} changed`,
    cardWord: card.word,
    cardMeaning: card.meaningTh,
    cardIcon: card.imagePlaceholder,
    icon: "✨",
    badge: "Purchased",
    statLine: item.name,
    goldLine,
    summary: getCardEffectSummary(card),
  };
}

function getFeedbackIcon(feedback: PurchaseFeedback) {
  if (feedback.tone === "danger") {
    return "⚠️";
  }

  if (feedback.tone === "success") {
    if (feedback.badge?.includes("ATK")) {
      return "🔨";
    }

    if (feedback.badge?.includes("SHD")) {
      return "🛡️";
    }

    if (feedback.badge?.includes("Element")) {
      return "✨";
    }

    if (feedback.badge === "Removed") {
      return "🗑️";
    }

    if (feedback.badge === "Copied") {
      return "🃏";
    }

    return "✨";
  }

  return "🧾";
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
  const [purchaseCeremony, setPurchaseCeremony] =
    useState<PurchaseCeremony | null>(null);
  const [purchaseFeedback, setPurchaseFeedback] = useState<PurchaseFeedback>({
    tone: "neutral",
    title: "Merchant Note",
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
      title: "Target Lost",
      message: "That target is no longer available in the current-run deck.",
    });
  }, [activeOffer, currentRunDeck, selectedTargetId]);

  function openOfferModal(item: ShopItem) {
    const eligibleTargets = getEligibleTargets(item, currentRunDeck);
    setPurchaseCeremony(null);

    if (eligibleTargets.length === 0) {
      playSound("shop-error");
      setPurchaseFeedback({
        tone: "danger",
        title: "No Eligible Targets",
        message: `${item.name} has no eligible targets right now.`,
      });
      return;
    }

    const nextTargets = shuffleItems(eligibleTargets).slice(0, targetOfferCount);

    setActiveOffer(item);
    setTargetCards(nextTargets);
    setSelectedTargetId(nextTargets[0]?.id ?? "");
    playSound(runGold < item.cost ? "shop-error" : "ui-click");
    setPurchaseFeedback({
      tone: "neutral",
      title: runGold >= item.cost ? "Inspect Ware" : "Not Enough Gold",
      message:
        runGold >= item.cost
          ? `Choose one card for ${item.name}.`
          : `Need +${item.cost - runGold} gold to buy ${item.name}. You can inspect, but Confirm is disabled.`,
    });
  }

  function closeOfferModal() {
    playSound("ui-click");
    setActiveOffer(null);
    setTargetCards([]);
    setSelectedTargetId("");
  }

  function confirmPurchase() {
    if (!activeOffer || !activeTarget) {
      playSound("shop-error");
      setPurchaseCeremony(null);
      setPurchaseFeedback({
        tone: "danger",
        title: "Choose A Target",
        message: "Choose a valid target before confirming the purchase.",
      });
      return;
    }

    const element = getShopItemElement(activeOffer);
    const goldBefore = runGold;
    const deckSizeBefore = currentRunDeck.length;
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
      playSound("shop-error");
      setPurchaseCeremony(null);
      setPurchaseFeedback({
        tone: "danger",
        title: runGold < activeOffer.cost ? "Not Enough Gold" : "Trade Blocked",
        message:
          runGold < activeOffer.cost
            ? `Need +${activeOffer.cost - runGold} gold. No card changed.`
            : `Unable to buy ${activeOffer.name}. No gold was spent and no card changed.`,
      });
      return;
    }

    playSound("shop-buy");
    setPurchaseCeremony(
      getPurchaseCeremony(activeOffer, activeTarget, deckSizeBefore),
    );
    setPurchaseFeedback(
      getPurchaseReceipt(activeOffer, activeTarget, deckSizeBefore, goldBefore),
    );
    setActiveOffer(null);
    setTargetCards([]);
    setSelectedTargetId("");
  }

  function rerollOffers() {
    const goldBefore = runGold;
    setPurchaseCeremony(null);

    if (!onSpendRunGold(SHOP_REROLL_COST)) {
      playSound("shop-error");
      setPurchaseFeedback({
        tone: "danger",
        title: "Not Enough Gold",
        message: `Need +${SHOP_REROLL_COST - runGold} gold to refresh wares.`,
      });
      return;
    }

    playSound("reroll");
    setShopOffers(getRandomOffers());
    setActiveOffer(null);
    setTargetCards([]);
    setSelectedTargetId("");
    setPurchaseFeedback({
      tone: "success",
      title: "Wares Refreshed!",
      badge: "Rerolled",
      message: `Spent ${SHOP_REROLL_COST} gold. ${
        goldBefore - SHOP_REROLL_COST
      } gold left.`,
    });
  }

  return (
    <ScreenShell
      eyebrow="Merchant"
      title="Current Run Shop"
      description="Trade temporary gold for a small set of run-only wares."
      framed={false}
    >
      <CardPanel className="mb-4 border-amber-700/25 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-white/75 text-3xl shadow-inner">
              🛒
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-amber-950">
                  Merchant Wares
                </h3>
                <Badge tone="emerald">Current-run only</Badge>
              </div>
              <p className="mt-1 max-w-2xl text-sm font-bold text-amber-950/75">
                Choose one upgrade. Upgrades affect this run only.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-black text-amber-950">
              Gold {runGold}
            </span>
            <span className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-900">
              {shopOffers.length} Offers
            </span>
            <span className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-black text-sky-900">
              Deck {currentRunDeck.length}
            </span>
            <span className="rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 text-sm font-black text-stone-700">
              {runProgress.monstersDefeated}/{runProgress.nextShopAt}
            </span>
            <Button
              type="button"
              onClick={rerollOffers}
              variant="secondary"
              disabled={runGold < SHOP_REROLL_COST}
            >
              Refresh ({SHOP_REROLL_COST}g)
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onNavigate("dungeon")}
            >
              Back To Dungeon
            </Button>
          </div>
        </div>

        <details className="mt-3 rounded-lg border border-amber-900/10 bg-white/55 px-3 py-2">
          <summary className="cursor-pointer text-sm font-black text-amber-950">
            Shop rules
          </summary>
          <p className="mt-2 text-sm font-bold leading-6 text-amber-900/75">
            Inspect an offer, choose a current-run card, then confirm the
            trade. All shop changes disappear when the run ends, is abandoned,
            refreshed, or the deck changes.
          </p>
        </details>
      </CardPanel>

      <div
        className={`mb-3 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${
          purchaseFeedback.tone === "success"
            ? "border-emerald-300 bg-emerald-50 text-emerald-950"
            : purchaseFeedback.tone === "danger"
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-amber-300 bg-amber-50 text-amber-950"
        }`}
      >
        <span className="text-lg" aria-hidden="true">
          {getFeedbackIcon(purchaseFeedback)}
        </span>
        <span className="font-black">{purchaseFeedback.title}</span>
        {purchaseFeedback.badge && (
          <Badge tone={purchaseFeedback.tone === "danger" ? "red" : "emerald"}>
            {purchaseFeedback.badge}
          </Badge>
        )}
        <span className="min-w-0 flex-1">{purchaseFeedback.message}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shopOffers.map((item) => {
          const eligibleTargetCount = offerTargetCounts[item.id] ?? 0;
          const hasEnoughGold = runGold >= item.cost;
          const canSelectOffer = eligibleTargetCount > 0;
          const missingGold = Math.max(item.cost - runGold, 0);
          const affordabilityCopy = hasEnoughGold
            ? "Affordable"
            : `Need +${missingGold} gold`;

          return (
            <CardPanel
              key={item.id}
              className="flex min-h-48 flex-col border-amber-700/25 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-3 transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(120,53,15,0.12),0_16px_30px_rgba(35,22,14,0.14),inset_0_1px_0_rgba(255,255,255,0.75)]"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100 text-sm font-black text-amber-950 shadow-inner">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-black text-amber-950">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm font-black text-amber-900">
                    {getOfferShortEffect(item)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="amber">{item.cost} gold</Badge>
                <Badge tone={hasEnoughGold ? "emerald" : "red"}>
                  {affordabilityCopy}
                </Badge>
                {!canSelectOffer && <Badge tone="red">Not eligible</Badge>}
              </div>

              <div className="mt-auto border-t border-amber-900/10 pt-3">
                <Button
                  type="button"
                  className="w-full"
                  disabled={!canSelectOffer}
                  onClick={() => openOfferModal(item)}
                  variant={hasEnoughGold ? "primary" : "secondary"}
                >
                  {canSelectOffer ? "Inspect" : "No Eligible Targets"}
                </Button>
                {!hasEnoughGold && canSelectOffer && (
                  <p className="mt-2 text-center text-xs font-black text-red-700">
                    Need +{missingGold} gold. You have {runGold}.
                  </p>
                )}
              </div>
            </CardPanel>
          );
        })}
      </div>

      {activeOffer && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-stone-950/70 p-2 backdrop-blur-sm sm:p-4">
          <div className="max-h-[min(88dvh,44rem)] w-full max-w-5xl overflow-y-auto rounded-2xl border-2 border-amber-300 bg-amber-50 p-3 text-amber-950 shadow-[0_18px_0_rgba(120,53,15,0.24)] sm:max-h-[min(92vh,44rem)] sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge tone="emerald">Choose a target card</Badge>
                <h3 className="mt-2 text-2xl font-black">
                  {activeOffer.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Pick one card from this small hand.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="amber">Gold {runGold}</Badge>
                <Badge tone="amber">Cost {activeOffer.cost}</Badge>
                <Badge tone={runGold >= activeOffer.cost ? "emerald" : "red"}>
                  {runGold >= activeOffer.cost
                    ? `After ${runGold - activeOffer.cost}`
                    : `+${activeOffer.cost - runGold} gold`}
                </Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {targetCards.map((card) => {
                const isSelected = selectedTargetId === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedTargetId(card.id)}
                    className={`flex min-h-52 flex-col rounded-2xl border-2 bg-gradient-to-br from-white via-amber-50 to-emerald-50 p-3 text-left shadow-[0_5px_0_rgba(120,53,15,0.12)] transition ${
                      isSelected
                        ? "selected-glow border-emerald-500 ring-2 ring-emerald-200"
                        : "border-amber-900/10 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md active:translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-amber-900/10 bg-amber-100 text-2xl shadow-inner">
                        {card.imagePlaceholder}
                      </span>
                      {isSelected && <Badge tone="emerald">Selected</Badge>}
                    </div>
                    <div className="mt-3 min-w-0">
                      <p className="truncate text-xl font-black capitalize text-amber-950">
                        {card.word}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-bold text-emerald-900">
                        {card.meaningTh}
                      </p>
                    </div>
                    <div className="mt-auto space-y-2 pt-4">
                      <p className="rounded-lg border border-amber-900/10 bg-white/80 px-2.5 py-2 text-sm font-black text-amber-950">
                        {getPurchasePreview(
                          activeOffer,
                          card,
                          currentRunDeck.length,
                        )}
                      </p>
                      <p className="truncate text-xs font-black uppercase text-amber-800/70">
                        {getCardEffectSummary(card)}
                      </p>
                      <p className="text-xs font-bold text-amber-900/70">
                        {getPurchasePreviewHelper(activeOffer)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {targetCards.length === 0 && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-black text-red-800">
                No eligible targets.
              </p>
            )}

            <p className="mt-3 text-xs font-bold text-amber-900/70">
              Lost when the run ends.
            </p>

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
                Confirm Trade ({activeOffer.cost} gold)
              </Button>
            </div>
            {runGold < activeOffer.cost && (
              <p className="mt-2 text-sm font-black text-red-700 sm:text-right">
                Need +{activeOffer.cost - runGold} gold.
              </p>
            )}
          </div>
        </div>
      )}

      {purchaseCeremony && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/65 p-3 backdrop-blur-sm">
          <div className="result-pop w-full max-w-sm rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 text-center text-amber-950 shadow-[0_18px_0_rgba(120,53,15,0.28),0_30px_55px_rgba(15,23,42,0.32)]">
            <div className="relative mx-auto max-w-[15rem]">
              <div className="shop-card-ceremony rounded-2xl border-2 border-emerald-400 bg-white p-4 shadow-[0_10px_0_rgba(6,95,70,0.18),0_20px_40px_rgba(35,22,14,0.2)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="grid size-14 place-items-center rounded-xl border border-amber-900/10 bg-amber-100 text-4xl shadow-inner">
                    {purchaseCeremony.cardIcon}
                  </span>
                  <Badge tone="emerald">{purchaseCeremony.badge}</Badge>
                </div>
                <p className="mt-4 truncate text-2xl font-black capitalize">
                  {purchaseCeremony.cardWord}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-bold text-emerald-900">
                  {purchaseCeremony.cardMeaning}
                </p>
                <p className="mt-4 rounded-xl bg-amber-100 px-3 py-2 text-sm font-black">
                  {purchaseCeremony.statLine}
                </p>
                <p className="mt-2 truncate text-xs font-black uppercase text-amber-800/70">
                  {purchaseCeremony.summary}
                </p>
              </div>

              <span className="shop-ceremony-icon absolute -right-3 -top-4 text-4xl">
                {purchaseCeremony.icon}
              </span>
              <span className="shop-floating-stat absolute -left-4 top-20 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800 shadow-md">
                {purchaseCeremony.badge}
              </span>
              <span className="shop-floating-gold absolute -right-4 bottom-16 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-black text-amber-900 shadow-md">
                {purchaseCeremony.goldLine}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black">
              {purchaseCeremony.title}
            </h3>
            <p className="mt-1 text-sm font-bold text-amber-900/75">
              {purchaseCeremony.statLine} · {purchaseCeremony.goldLine}
            </p>
            <Button
              type="button"
              className="mt-5 w-full"
              onClick={() => setPurchaseCeremony(null)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
