import { ScreenShell } from "../components/ScreenShell";

const placeholderItems = [
  "Upgrade Attack",
  "Add Element",
  "Add Shield",
  "Duplicate Card",
];

export function Shop() {
  return (
    <ScreenShell eyebrow="Upgrade" title="Shop">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderItems.map((item) => (
          <div key={item} className="rounded-md border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">{item}</p>
            <p className="mt-2 text-sm text-slate-600">
              Current-run upgrade placeholder.
            </p>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
