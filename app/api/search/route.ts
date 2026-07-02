import { source, git } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import { createSearchAPI } from "fumadocs-core/search/server";

// Merge both sources and tag each page by section
const merged = {
  getPages: () => [...git.getPages(), ...source.getPages()],
};

export const { GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: git.getPages().map((page) => ({
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
  })),
});
