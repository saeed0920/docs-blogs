import { NextRequest, NextResponse } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { docsRoute, gitRoute, lpic1Route, privetPath } from "@/lib/shared";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.DOCS_SECRET!);

const { rewrite: rewriteDocs } = rewritePath(
  `${gitRoute}{/*path}`,
  `${lpic1Route}{/*path}`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${gitRoute}{/*path}.md`,
  `${lpic1Route}{/*path}.md`,
);

function isProtected(pathname: string): boolean {
  return privetPath.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("docs-token")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // guard protected routes first
  if (isProtected(pathname)) {
    if (!(await isAuthenticated(request))) {
      const loginUrl = new URL("/login", request.nextUrl);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
