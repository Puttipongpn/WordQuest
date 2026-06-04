import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "slate" | "emerald" | "red" | "amber" | "sky" | "purple";

const toneStyles: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-700",
  emerald: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-800",
  purple: "bg-purple-100 text-purple-800",
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
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}
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
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${
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
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${barStyles[tone]}`}
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
    <div className={`rounded-md p-4 ${toneStyles[tone]}`}>
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
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:border-emerald-500 hover:text-emerald-700",
  danger:
    "border border-red-200 bg-white text-red-700 hover:border-red-400 hover:bg-red-50",
  ghost: "border border-transparent bg-slate-100 text-slate-600",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 ${
        buttonVariants[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
