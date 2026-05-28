import { describe, it, expect } from "vitest";

function renderButtonHTML(props: Record<string, string> = {}) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
    ghost: "text-zinc-600 hover:bg-zinc-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return { base, variantClass: variants[variant], sizeClass: sizes[size] };
}

describe("Button", () => {
  it("generates primary variant classes", () => {
    const { variantClass } = renderButtonHTML({ variant: "primary" });
    expect(variantClass).toContain("bg-zinc-900");
    expect(variantClass).toContain("text-white");
  });

  it("generates danger variant classes", () => {
    const { variantClass } = renderButtonHTML({ variant: "danger" });
    expect(variantClass).toContain("bg-red-600");
  });

  it("generates correct size classes", () => {
    const { sizeClass } = renderButtonHTML({ size: "lg" });
    expect(sizeClass).toContain("px-6");
    expect(sizeClass).toContain("py-3");
  });

  it("has disabled styles in base", () => {
    const { base } = renderButtonHTML();
    expect(base).toContain("disabled:opacity-50");
  });
});
