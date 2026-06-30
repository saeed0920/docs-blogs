import { source, git } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Merge both sources and tag each page by section
const merged = {
  getPages: () => [...git.getPages(), ...source.getPages()],
};

export const { GET } = createFromSource(merged as any, {
  buildIndex(page) {
    // Derive tag from the URL: /git/... → 'git', /lpic1/... → 'lpic1'
    const tag = page.url.startsWith("/git") ? "git" : "lpic1";
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag,
    };
  },
  language: "english",
});
