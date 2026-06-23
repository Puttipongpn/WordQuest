import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "slate" | "emerald" | "red" | "amber" | "sky" | "purple";

const toneStyles: Record<Tone, string> = {
  slate: "border-stone-300 bg-stone-100 text-stone-700",
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-800",
  red: "border-red-300 bg-red-50 text-red-800",
  amber: "border-amber-300 bg-amber-50 text-amber-900",
  sky: "border-sky-300 bg-sky-50 text-sky-800",
  purple: "border-violet-300 bg-violet-50 text-violet-800",
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
      className={`rounded-lg border border-amber-900/20 bg-amber-50/95 p-4 shadow-[0_5px_0_rgba(83,48,20,0.12),0_14px_28px_rgba(35,22,14,0.15),inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-white/30 sm:p-5 ${className}`}
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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${
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
      <div className="h-2.5 overflow-hidden rounded-full border border-amber-950/10 bg-stone-200 shadow-inner">
        <div
          className={`h-full rounded-full ${barStyles[tone]} shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]`}
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
    <div className={`rounded-lg border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_0_rgba(92,51,23,0.08)] ${toneStyles[tone]}`}>
      <p className="text-xs font-extrabold uppercase opacity-75">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
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
    "border-amber-950/25 bg-gradient-to-b from-amber-300 to-orange-400 text-amber-950 shadow-[0_3px_0_rgba(92,51,23,0.45),0_8px_14px_rgba(92,51,23,0.14)] hover:from-yellow-200 hover:to-amber-400",
  secondary:
    "border-amber-800/25 bg-amber-50 text-amber-950 shadow-[0_2px_0_rgba(92,51,23,0.16)] hover:border-amber-700 hover:bg-white",
  danger:
    "border-red-400/45 bg-red-50 text-red-800 shadow-[0_2px_0_rgba(127,29,29,0.22)] hover:border-red-600 hover:bg-red-100",
  ghost:
    "border-stone-300 bg-stone-100 text-stone-700 hover:border-stone-400 hover:bg-white",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md border px-3.5 py-2 text-sm font-extrabold transition hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none disabled:hover:translate-y-0 ${
        buttonVariants[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
