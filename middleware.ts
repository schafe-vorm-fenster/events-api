import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/api/*"],
};

export function middleware(req: NextRequest) {
  const token = req.headers.get("Sheep-Token");

  // collect tokens from env
  const readTokens: String[] | undefined =
    process.env.READ_ACCESS_TOKENS?.split(",").map((t) => t.trim());
  const writeTokens: String[] | undefined =
    process.env.WRITE_ACCESS_TOKENS?.split(",").map((t) => t.trim());
  const adminTokens: String[] | undefined =
    process.env.ADMIN_ACCESS_TOKENS?.split(",").map((t) => t.trim());
  const allowedTokens: String[] = [
    ...(readTokens as String[]),
    ...(writeTokens as String[]),
    ...(adminTokens as String[]),
  ];

  if (token && allowedTokens?.includes(token)) {
    return NextResponse.next();
  }

  return new NextResponse(
    JSON.stringify({
      status: 401,
      message: "Unauthorized",
    }),
    { status: 401, headers: { "content-type": "application/json" } }
  );
}
