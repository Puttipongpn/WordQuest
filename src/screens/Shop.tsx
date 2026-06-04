import { ScreenShell } from "../components/ScreenShell";
import { sampleShopItems } from "../data";

export function Shop() {
  return (
    <ScreenShell eyebrow="Upgrade" title="Current Run Shop" framed={false}>
      <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-950">
          Shop upgrades are temporary and affect only the current run.
        </p>
        <p className="mt-2 text-sm text-emerald-800">
          Purchase logic is not active yet. These items are placeholders for
          future card upgrades, elements, shield effects, removal, and
          duplication.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sampleShopItems.map((item) => (
          <div
            key={item.id}
            className="flex min-h-64 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                {item.icon}
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                {item.type.replaceAll("-", " ")}
              </span>
            </div>

            <div className="mt-4 flex flex-1 flex-col">
              <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-900">
                {item.cost} gold
              </p>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-500"
                disabled
              >
                Preview Only
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
