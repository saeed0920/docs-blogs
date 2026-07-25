import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** Set `GITHUB_PAGES=true` when deploying to GitHub Pages (project site). */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "docs";
const basePath = isGithubPages ? `/${repo}` : "";

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  typescript: {
    //TODO
    ignoreBuildErrors: true,
  },
};

export default withMDX(config);
