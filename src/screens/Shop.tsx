import { useState } from "react";
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
  onPurchaseAttackUpgrade: (cardId: string, cost: number) => boolean;
  onPurchaseElementUpgrade: (
    cardId: string,
    cost: number,
    element: ElementType,
  ) => boolean;
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
const attackUpgradeAmount = 2;
const shieldUpgradeAmount = 3;

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

export function Shop({
  currentRunDeck,
  onNavigate,
  onPurchaseAttackUpgrade,
  onPurchaseElementUpgrade,
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
        message: `Not enough gold. Upgrade Attack costs ${cost} gold.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedAttackCard.word} attack upgraded by +${attackUpgradeAmount} for this run.`,
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
        message: `Not enough gold. Add Shield costs ${cost} gold.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedShieldCard.word} gained Shield +${shieldUpgradeAmount} for this run.`,
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
        message: `Not enough gold. ${item.name} costs ${item.cost} gold.`,
      });
      return;
    }

    setPurchaseFeedback({
      tone: "success",
      message: `${selectedElementCard.word} now has Element: ${formatElementName(element)} for this run.`,
    });
  }

  return (
    <ScreenShell
      eyebrow="Upgrade"
      title="Current Run Shop"
      description="Buy temporary current-run upgrades. Attack, Shield, and Element purchases are active in this phase."
      framed={false}
    >
      <CardPanel className="mb-6 border-emerald-200 bg-emerald-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="emerald">Current-run only</Badge>
            <p className="mt-3 font-semibold text-emerald-950">
              Shop upgrades are temporary and affect only the current run.
            </p>
            <p className="mt-2 text-sm text-emerald-800">
              Upgrade Attack, Add Shield, and Element items can modify copied
              current-run cards. Remove and Duplicate remain preview-only for
              now.
            </p>
          </div>
          <div className="grid gap-3 sm:min-w-72 sm:grid-cols-3">
            <StatCard
              label="Gold"
              value={runGold}
              helper="Temporary"
              tone="amber"
            />
            <StatCard
              label="Mode"
              value="Partial"
              helper="Attack + Shield + Element"
              tone="emerald"
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
          const element = getShopItemElement(item);
          const isAddElement = element !== null;
          const isActivePurchase = isUpgradeAttack || isAddShield || isAddElement;
          const selectedElementCard = getSelectedElementCard(item.id);

          return (
            <CardPanel
              key={item.id}
              className={`flex min-h-72 flex-col ${
                isActivePurchase ? "border-emerald-300" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                  {item.icon}
                </div>
                <Badge tone={isActivePurchase ? "emerald" : "slate"}>
                  {item.type.replaceAll("-", " ")}
                </Badge>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="text-lg font-bold text-slate-950">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>

              {isUpgradeAttack && (
                <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-sm font-semibold text-emerald-950">
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
                              ? "border-emerald-500 bg-white ring-1 ring-emerald-200"
                              : "border-emerald-100 bg-white/70 hover:border-emerald-400"
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
                <div className="mt-5 rounded-md border border-sky-100 bg-sky-50 p-3">
                  <p className="text-sm font-semibold text-sky-950">
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
                <div className="mt-5 rounded-md border border-amber-100 bg-amber-50 p-3">
                  <p className="text-sm font-semibold text-amber-950">
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

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">Cost</p>
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
        className={`mt-5 rounded-lg border p-4 ${
          purchaseFeedback.tone === "success"
            ? "border-emerald-200 bg-emerald-50"
            : purchaseFeedback.tone === "danger"
              ? "border-red-200 bg-red-50"
              : "border-slate-200 bg-white"
        }`}
      >
        <p className="font-semibold text-slate-950">Shop Feedback</p>
        <p className="mt-1 text-sm text-slate-700">
          {purchaseFeedback.message}
        </p>
      </div>
    </ScreenShell>
  );
}
