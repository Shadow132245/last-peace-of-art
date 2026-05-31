"use client";

import { useState, useEffect } from "react";

const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const GITHUB_REGEX = /github\.com\/([^\/]+)\/([^\/\s]+)/;

export function RichEmbed({ url }: { url: string }) {
  const [meta, setMeta] = useState<{ title?: string; description?: string; image?: string; siteName?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch) {
    return (
      <div className="my-4 aspect-video overflow-hidden rounded-xl">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          className="h-full w-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  const githubMatch = url.match(GITHUB_REGEX);
  if (githubMatch) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="my-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
      >
        <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{githubMatch[1]} / {githubMatch[2]}</p>
          <p className="truncate text-xs text-zinc-500">{url}</p>
        </div>
      </a>
    );
  }

  if (loading) return <div className="my-2 h-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />;
  if (meta) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="my-4 block overflow-hidden rounded-xl border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
        <div className="flex">
          {meta.image && <img src={meta.image} alt="" className="h-24 w-24 shrink-0 object-cover" />}
          <div className="flex flex-col justify-center p-3">
            {meta.siteName && <p className="text-xs text-zinc-500">{meta.siteName}</p>}
            {meta.title && <p className="text-sm font-medium leading-tight">{meta.title}</p>}
            {meta.description && <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{meta.description}</p>}
          </div>
        </div>
      </a>
    );
  }

  return null;
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<]+[^\s<.,!?)}\]'"`]/g;
  return text.match(urlRegex) ?? [];
}

export function RichEmbedContent({ content }: { content: string }) {
  const urls = extractUrls(content);
  if (urls.length === 0) return null;
  return (
    <>
      {urls.map((url, i) => (
        <RichEmbed key={i} url={url} />
      ))}
    </>
  );
}
