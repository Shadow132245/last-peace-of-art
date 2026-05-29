"use client";

import { useState } from "react";

export function SafeImg({ src, alt, className, fallback }: { src: string; alt: string; className?: string; fallback?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed && fallback) {
    return (
      <span className={`flex items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 ${className ?? ""}`}>
        {fallback}
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

export function SafeBanner({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} />;
}
