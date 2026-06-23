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
      className={`mx-auto px-3 py-5 sm:px-5 sm:py-6 lg:px-6 ${
        wide ? "max-w-[1800px]" : "max-w-6xl"
      }`}
    >
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="rounded-full border border-amber-200/20 bg-amber-100/10 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-200/90 shadow-inner">
            {eyebrow}
          </p>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-amber-200/45 to-transparent sm:block" />
        </div>
        <h2 className="mt-1.5 text-3xl font-black text-amber-50 drop-shadow-md sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl rounded-lg border border-amber-900/10 bg-amber-50/80 px-3 py-2 text-sm font-bold leading-6 text-amber-950/85 shadow-inner">
            {description}
          </p>
        )}
      </div>
      {framed ? (
        <div className="rounded-xl border border-amber-900/20 bg-amber-50/95 p-5 shadow-[0_7px_0_rgba(77,45,20,0.14),0_18px_34px_rgba(46,25,12,0.18),inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-white/30">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
