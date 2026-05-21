import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
};

const buttonTones: Record<ButtonTone, string> = {
  primary:
    "border-aurora-cyan/70 bg-aurora-cyan text-ink-950 shadow-glow hover:bg-white",
  secondary:
    "border-white/[0.12] bg-white/[0.08] text-white hover:border-white/20 hover:bg-white/[0.12]",
  ghost:
    "border-transparent bg-transparent text-white/70 hover:bg-white/[0.08] hover:text-white",
  danger:
    "border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/[0.18]"
};

export function Button({
  className,
  tone = "secondary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        buttonTones[tone],
        className
      )}
      type={type}
      {...props}
    />
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  selected?: boolean;
};

export function IconButton({
  className,
  label,
  selected,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-white/[0.62] transition hover:bg-white/[0.08] hover:text-white",
        selected && "border-white/[0.12] bg-white/[0.1] text-white shadow-panel",
        className
      )}
      type={type}
      {...props}
    />
  );
}

export function Badge({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-medium text-white/[0.72]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function GlassPanel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.06] shadow-panel backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-aurora-cyan">
      {children}
    </div>
  );
}
