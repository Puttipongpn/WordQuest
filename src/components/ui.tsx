import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "slate" | "emerald" | "red" | "amber" | "sky" | "purple";

const toneStyles: Record<Tone, string> = {
  slate: "border-stone-300 bg-gradient-to-b from-stone-100 to-stone-200 text-stone-800",
  emerald: "border-emerald-300 bg-gradient-to-b from-emerald-100 to-emerald-200 text-emerald-900",
  red: "border-red-300 bg-gradient-to-b from-red-100 to-rose-200 text-red-800",
  amber: "border-amber-300 bg-gradient-to-b from-amber-100 to-yellow-200 text-amber-900",
  sky: "border-sky-300 bg-gradient-to-b from-sky-100 to-cyan-200 text-sky-900",
  purple: "border-violet-300 bg-gradient-to-b from-violet-100 to-fuchsia-200 text-violet-900",
};

const barStyles: Record<Tone, string> = {
  slate: "bg-slate-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  purple: "bg-purple-500",
};

type CardPanelProps = {
  children: ReactNode;
  className?: string;
};

export function CardPanel({ children, className = "" }: CardPanelProps) {
  return (
    <section
      className={`rounded-lg border-2 border-amber-900/20 bg-amber-50/95 p-5 shadow-[0_8px_0_rgba(83,48,20,0.2),0_18px_36px_rgba(35,22,14,0.2),inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-white/35 ${className}`}
    >
      {children}
    </section>
  );
}

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Badge({ children, tone = "slate", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(41,24,12,0.18)] ${
        toneStyles[tone]
      } ${className}`}
    >
      {children}
    </span>
  );
}

type ProgressBarProps = {
  value: number;
  max: number;
  tone?: Tone;
  label?: string;
};

export function ProgressBar({
  value,
  max,
  tone = "emerald",
  label,
}: ProgressBarProps) {
  const percentage =
    max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div aria-label={label}>
      <div className="h-3 overflow-hidden rounded-full border border-amber-950/10 bg-stone-200 shadow-inner">
        <div
          className={`h-full rounded-full ${barStyles[tone]} shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_12px_rgba(251,191,36,0.18)]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
};

export function StatCard({
  label,
  value,
  helper,
  tone = "slate",
  children,
}: StatCardProps) {
  return (
    <div className={`rounded-lg border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_3px_0_rgba(92,51,23,0.12)] ${toneStyles[tone]}`}>
      <p className="text-xs font-extrabold uppercase opacity-75">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
      {children && <div className="mt-3">{children}</div>}
      {helper && <p className="mt-2 text-xs font-bold opacity-75">{helper}</p>}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border-amber-950/25 bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 text-amber-950 shadow-[0_5px_0_rgba(92,51,23,0.6),0_10px_18px_rgba(92,51,23,0.18)] hover:from-yellow-200 hover:to-amber-500",
  secondary:
    "border-amber-800/35 bg-gradient-to-b from-amber-50 to-yellow-100 text-amber-950 shadow-[0_3px_0_rgba(92,51,23,0.24)] hover:border-amber-700 hover:from-white hover:to-amber-100",
  danger:
    "border-red-500/45 bg-gradient-to-b from-red-100 to-rose-200 text-red-800 shadow-[0_3px_0_rgba(127,29,29,0.32)] hover:border-red-600 hover:from-red-50 hover:to-red-100",
  ghost:
    "border-stone-300 bg-gradient-to-b from-stone-100 to-stone-200 text-stone-700 hover:border-stone-400 hover:from-white hover:to-stone-100",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md border px-4 py-2 font-extrabold transition hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none disabled:hover:translate-y-0 ${
        buttonVariants[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
