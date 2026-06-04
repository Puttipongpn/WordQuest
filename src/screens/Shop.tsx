import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, StatCard } from "../components/ui";
import { sampleShopItems } from "../data";
import type { RunProgressState, ScreenName } from "../types";

type ShopProps = {
  onNavigate: (screen: ScreenName) => void;
  runProgress: RunProgressState;
};

export function Shop({ onNavigate, runProgress }: ShopProps) {
  return (
    <ScreenShell
      eyebrow="Upgrade"
      title="Current Run Shop"
      description="Preview current-run item concepts before purchase logic exists."
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
              Purchase logic is not active yet. These items are placeholders for
              future card upgrades, elements, shield effects, removal, and
              duplication.
            </p>
          </div>
          <div className="grid gap-3 sm:min-w-72 sm:grid-cols-2">
            <StatCard
              label="Mode"
              value="Preview"
              helper="No purchases yet"
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
        {sampleShopItems.map((item) => (
          <CardPanel key={item.id} className="flex min-h-72 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                {item.icon}
              </div>
              <Badge>{item.type.replaceAll("-", " ")}</Badge>
            </div>

            <div className="mt-4 flex flex-1 flex-col">
              <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-500">Cost</p>
                <Badge tone="amber">{item.cost} gold</Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled
              >
                Preview Only
              </Button>
            </div>
          </CardPanel>
        ))}
      </div>
    </ScreenShell>
  );
}
