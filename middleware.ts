import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/api/", "/api/translate"],
};

export function middleware(req: NextRequest) {
  const token = req.headers.get("Sheep-Token");
  const allowedTokens: String[] | undefined = process.env.ALLOWED_TOKENS?.split(
    ","
  ).map((t) => t.trim());

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

/*

AuthRouter.use(
  "*",
  async (_req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = _req.get("Sheep-Token");

    // check if token is present
    if (!token || token.length <= 2)
      return res.status(401).send("Unauthorized");

    // evealuate admin access
    const adminTokens: String[] | undefined =
      process.env.ADMIN_ACCESS_TOKENS?.split(",").map((t) => t.trim());
    let adminAccess: boolean = false;
    if (adminTokens?.includes(token as string)) {
      adminAccess = true;
      _req.headers["admin-access"] = "true";
    }
    console.debug("adminAccess: ", adminAccess);

    // evaluate write access
    const writeTokens: String[] | undefined =
      process.env.WRITE_ACCESS_TOKENS?.split(",").map((t) => t.trim());
    let writeAccess: boolean = false;
    if (writeTokens?.includes(token as string)) {
      writeAccess = true;
      _req.headers["write-access"] = "true";
    }
    console.debug("writeAccess: ", writeAccess);

    // evaluate read access
    const readTokens: String[] | undefined =
      process.env.READ_ACCESS_TOKENS?.split(",").map((t) => t.trim());
    let readAccess: boolean = false;
    if (writeAccess || readTokens?.includes(token as string)) {
      readAccess = true;
      _req.headers["read-access"] = "true";
    }

    if (readAccess || writeAccess || adminAccess) {
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  }
);


*/
