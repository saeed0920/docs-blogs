import { lpic1, blogPosts, gitPosts, puzzleyPosts , FrontPosts } from "collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { lpic1Route, gitRoute, frontRoute } from "./shared";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: lpic1Route,
  source: lpic1?.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const git = loader({
  baseUrl: gitRoute,
  source: gitPosts?.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
export const front = loader({
  baseUrl: frontRoute,
  source: FrontPosts?.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const blog = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogPosts, []),
});
export const puzzley = loader({
  baseUrl: "/puzzley",
  source: toFumadocsSource(puzzleyPosts, []),
});

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
  };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "content.md"];
  return {
    segments,
  };
}
