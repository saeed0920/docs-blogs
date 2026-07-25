import { source, git, front, blog } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

// Merge both sources and tag each page by section
const merged = {
  getPages: () => [...git.getPages(), ...source.getPages(), ...front.getPages(), ...blog.getPages()],
};

export const { GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: merged.getPages().map((page) => ({
    title: page.data?.title,
    description: page.data?.description,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
  })),
});
