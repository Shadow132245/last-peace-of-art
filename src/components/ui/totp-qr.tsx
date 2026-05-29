"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export function TotpQr({ uri }: { uri: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, uri, {
      width: 200,
      margin: 2,
      color: { dark: "#18181b", light: "#ffffff" },
    }).catch(() => setError(true));
  }, [uri]);

  if (error) {
    return (
      <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="px-4 text-center text-xs text-zinc-400">Failed to generate QR code</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl border border-zinc-200 dark:border-zinc-700"
    />
  );
}
