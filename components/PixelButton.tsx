"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const VARIANT: Record<string, string> = {
  primary: "bg-pixyellow text-bg border-black hover:bg-yellow-300",
  secondary: "bg-pixcyan text-bg border-black hover:bg-cyan-300",
  ghost: "bg-bgalt text-ink border-pixyellow hover:bg-bg",
};

const SIZE: Record<string, string> = {
  sm: "px-3 py-2 text-[10px]",
  md: "px-5 py-3 text-xs",
  lg: "px-8 py-4 text-sm",
};

export default function PixelButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`font-pixel uppercase tracking-wider border-4 shadow-pixel transition-all
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixelsm
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {children}
    </button>
  );
}
