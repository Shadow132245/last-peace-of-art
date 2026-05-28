import type { Metadata } from "next";
import SearchInput from "./search-input";
import SearchResults from "./search-results";

export const metadata: Metadata = {
  title: "Search",
  description: "Search projects, posts, and users.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Search</h1>
      <SearchInput />
      <SearchResults />
    </div>
  );
}
