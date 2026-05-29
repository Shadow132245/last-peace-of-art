"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";

type InsertMode = "markdown" | "url" | "media";

export function ImageUpload({
  onInsert,
  mode = "markdown",
  label = "Add File",
  accept = "image/*,.zip",
}: {
  onInsert: (url: string) => void;
  mode?: InsertMode;
  label?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      const isZip = file.type === "application/zip" || file.type === "application/x-zip-compressed" || file.name.endsWith(".zip");
      if (mode === "markdown" && !isZip) {
        onInsert(`![${file.name}](${url})`);
      } else if (mode === "markdown" && isZip) {
        onInsert(`[${file.name}](${url})`);
      } else {
        onInsert(url);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        {uploading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {label}
          </>
        )}
      </motion.button>
    </>
  );
}
