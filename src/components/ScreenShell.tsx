import type { ReactNode } from "react";

type ScreenShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  framed?: boolean;
  description?: string;
  wide?: boolean;
  gameMode?: boolean;
};

export function ScreenShell({
  title,
  eyebrow,
  children,
  framed = true,
  description,
  wide = false,
  gameMode = false,
}: ScreenShellProps) {
  if (gameMode) {
    return (
      <section className="min-h-[calc(100vh-3.5rem)] overflow-x-hidden px-1 py-1 sm:min-h-[calc(100vh-4rem)] sm:px-3 sm:py-2 xl:h-[calc(100vh-4rem)] xl:overflow-hidden">
        {children}
      </section>
    );
  }

  return (
    <section
      className={`mx-auto px-4 py-7 sm:px-6 lg:px-8 ${
        wide ? "max-w-[1800px]" : "max-w-6xl"
      }`}
    >
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="rounded-full border border-amber-200/25 bg-amber-100/10 px-3 py-1 text-sm font-extrabold uppercase text-amber-200 shadow-inner">
            {eyebrow}
          </p>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-amber-200/45 to-transparent sm:block" />
        </div>
        <h2 className="mt-2 text-4xl font-black text-amber-50 drop-shadow-md">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl rounded-lg border border-amber-900/15 bg-amber-50/85 px-4 py-2 text-sm font-bold leading-6 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_0_rgba(92,51,23,0.12)]">
            {description}
          </p>
        )}
      </div>
      {framed ? (
        <div className="rounded-xl border-2 border-amber-900/25 bg-amber-50/95 p-6 shadow-[0_12px_0_rgba(77,45,20,0.2),0_24px_48px_rgba(46,25,12,0.24),inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-white/35">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
