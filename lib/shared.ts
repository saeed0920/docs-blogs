export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative path (e.g. "/images/x.png") with the GH Pages basePath. next/image doesn't do this itself. */
export const withBasePath = (src: string) =>
  src.startsWith("/") ? `${basePath}${src}` : src;

export const appName = "Saeed0920";
export const docsRoute = "/docs";
export const lpic1Route = "/lpic1";
export const gitRoute = "/git";
export const frontRoute = "/front";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "saeed0920",
  repo: "docs",
  branch: "main",
};
