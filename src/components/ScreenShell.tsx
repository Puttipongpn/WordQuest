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
      <section className="min-h-[calc(100vh-3.5rem)] overflow-x-hidden px-2 py-2 sm:min-h-[calc(100vh-4rem)] sm:px-3 xl:h-[calc(100vh-4rem)] xl:overflow-hidden">
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
        <p className="text-sm font-extrabold uppercase text-amber-200 drop-shadow">
          {eyebrow}
        </p>
        <h2 className="text-4xl font-black text-amber-50 drop-shadow-md">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl rounded-lg border border-amber-900/15 bg-amber-50/80 px-4 py-2 text-sm font-medium leading-6 text-amber-950 shadow-sm">
            {description}
          </p>
        )}
      </div>
      {framed ? (
        <div className="rounded-xl border-2 border-amber-900/25 bg-amber-50/95 p-6 shadow-[0_14px_0_rgba(77,45,20,0.16),0_24px_48px_rgba(46,25,12,0.22)]">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
