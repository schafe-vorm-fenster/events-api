import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const AuthRouter = express.Router();

AuthRouter.use(
  "*",
  async (_req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = _req.get("Sheep-Token");

    // check if token is present
    if (!token || token.length <= 2)
      return res.status(401).send("Unauthorized");

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

    if (readAccess || writeAccess) {
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  }
);

export default AuthRouter;
