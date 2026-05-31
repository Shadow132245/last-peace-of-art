import ReactMarkdown from "react-markdown";
import { RichEmbedContent } from "@/components/ui/rich-embed";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-zinc-600 dark:prose-a:text-zinc-400">
      <ReactMarkdown>{content}</ReactMarkdown>
      <RichEmbedContent content={content} />
    </div>
  );
}
