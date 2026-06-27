import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.DOCS_SECRET!);
const EXPIRES_IN = "7d"; // change to '1d', '12h', '30d' etc.

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.DOCS_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await new SignJWT({ access: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET);

  const from = request.nextUrl.searchParams.get("from") ?? "/";
  const response = NextResponse.json({ ok: true, from });

  response.cookies.set("docs-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // match EXPIRES_IN in seconds
  });

  return response;
}
