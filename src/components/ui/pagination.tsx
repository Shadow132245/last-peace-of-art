import Link from "next/link";

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export function Pagination({ basePath, page, totalPages, hasNext, hasPrev }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {hasPrev && (
        <Link
          href={`${basePath}?page=${page - 1}`}
          className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Previous
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-zinc-400">...</span>
        ) : (
          <Link
            key={p}
            href={`${basePath}?page=${p}`}
            className={`rounded-lg px-3 py-2 text-sm ${
              p === page
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {hasNext && (
        <Link
          href={`${basePath}?page=${page + 1}`}
          className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
