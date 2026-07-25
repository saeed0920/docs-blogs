import {
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config";

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
//export const docs = defineDocs({
//  dir: "content/lpic1",
//  docs: {
//    schema: pageSchema,
//    postprocess: {
//      includeProcessedMarkdown: true,
//    },
//  },
//  meta: {
//    schema: metaSchema,
//  },
//});

export const lpic1 = defineDocs({
  dir: "content/lpic1",
});
export const gitPosts = defineDocs({
  dir: "content/git",
});
export const FrontPosts = defineDocs({
  dir: "content/front",
});

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
});

export default defineConfig();
