import { source, git, front, blog } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

const pages = [
  ...git.getPages(),
  ...source.getPages(),
  ...front.getPages(),
  ...blog.getPages(),
];

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: pages.map((page) => ({
    title: page.data?.title,
    description: page.data?.description,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
  })),
});
