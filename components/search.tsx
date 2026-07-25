"use client";

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogList,
  SearchDialogOverlay,
  useSearch,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static";
import { create } from "@orama/orama";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function initOrama() {
  return create({
    schema: { _: "string" },
    language: "english",
  });
}

function SearchInput() {
  const { search, onSearchChange } = useSearch();

  return (
    <input
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search"
      className="w-0 flex-1  bg-transparent text-lg placeholder:text-fd-muted-foreground border-0 focus:outline-none focus:border-0 ring-0 shadow-none focus:ring-0 focus-visible:outline-none!"
    />
  );
}

export default function StaticSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    client: oramaStaticClient({
      from: `${basePath}/api/search`,
      initOrama,
    }),
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
