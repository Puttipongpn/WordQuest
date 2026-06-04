import { useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, StatCard } from "../components/ui";
import { sampleShopItems } from "../data";
import type { RunProgressState, ScreenName, WordCard } from "../types";

type ShopProps = {
  currentRunDeck: WordCard[];
  onNavigate: (screen: ScreenName) => void;
  onPurchaseAttackUpgrade: (cardId: string, cost: number) => boolean;
  runGold: number;
  runProgress: RunProgressState;
};

type PurchaseFeedback = {
  tone: "success" | "danger" | "neutral";
  message: string;
};

const upgradeAttackItemId = "upgrade-attack";
const attackUpgradeAmount = 2;

export function Shop({
  currentRunDeck,
  onNavigate,
  onPurchaseAttackUpgrade,
  runGold,
  runProgress,
}: ShopProps) {
  const [selectedAttackCardId, setSelectedAttackCardId] = useState(
    currentRunDeck[0]?.id ?? "",
  );
  const [purchaseFeedback, setPurchaseFeedback] = useState<PurchaseFeedback>({
    tone: "neutral",
    message: "Choose a card to preview the Upgrade Attack purchase.",
  });
  const selectedAttackCard = currentRunDeck.find(
    (card) => card.id === selectedAttackCardId,
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

  return (
    <ScreenShell
      eyebrow="Upgrade"
      title="Current Run Shop"
      description="Buy temporary current-run upgrades. Only Upgrade Attack is active in this phase."
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
              Upgrade Attack can modify a copied current-run card. Other shop
              item types remain preview-only for now.
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
              helper="Attack only"
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

          return (
            <CardPanel
              key={item.id}
              className={`flex min-h-72 flex-col ${
                isUpgradeAttack ? "border-emerald-300" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                  {item.icon}
                </div>
                <Badge tone={isUpgradeAttack ? "emerald" : "slate"}>
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
