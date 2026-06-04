import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "slate" | "emerald" | "red" | "amber" | "sky" | "purple";

const toneStyles: Record<Tone, string> = {
  slate: "border-stone-300 bg-stone-100 text-stone-800",
  emerald: "border-emerald-300 bg-emerald-100 text-emerald-900",
  red: "border-red-300 bg-red-100 text-red-800",
  amber: "border-amber-300 bg-amber-100 text-amber-900",
  sky: "border-sky-300 bg-sky-100 text-sky-900",
  purple: "border-violet-300 bg-violet-100 text-violet-900",
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
      className={`rounded-lg border-2 border-amber-900/20 bg-amber-50/95 p-5 shadow-[0_10px_0_rgba(77,45,20,0.14),0_18px_36px_rgba(46,25,12,0.18)] ${className}`}
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
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase shadow-sm ${
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
      <div className="h-3 rounded-full border border-amber-950/10 bg-stone-200 shadow-inner">
        <div
          className={`h-full rounded-full ${barStyles[tone]} shadow-sm`}
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
    <div className={`rounded-lg border p-4 shadow-sm ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {children && <div className="mt-3">{children}</div>}
      {helper && <p className="mt-2 text-xs opacity-75">{helper}</p>}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border-amber-950/20 bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 shadow-[0_4px_0_rgba(92,51,23,0.55)] hover:from-amber-300 hover:to-amber-500",
  secondary:
    "border-amber-800/30 bg-amber-50 text-amber-950 shadow-[0_3px_0_rgba(92,51,23,0.22)] hover:border-amber-700 hover:bg-amber-100",
  danger:
    "border-red-500/40 bg-red-100 text-red-800 shadow-[0_3px_0_rgba(127,29,29,0.28)] hover:border-red-600 hover:bg-red-50",
  ghost:
    "border-stone-300 bg-stone-100 text-stone-700 hover:border-stone-400 hover:bg-stone-50",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md border px-4 py-2 font-extrabold transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none ${
        buttonVariants[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
