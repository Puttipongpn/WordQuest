import type { ReactNode } from "react";

type ScreenShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  framed?: boolean;
  description?: string;
};

export function ScreenShell({
  title,
  eyebrow,
  children,
  framed = true,
  description,
}: ScreenShellProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-slate-950">{title}</h2>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}
      </div>
      {framed ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
