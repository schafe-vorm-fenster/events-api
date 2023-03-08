import express, { Request, Response, Router } from "express";
import LanguagesController from "./languages.controller";

const LanguagesRouter: Router = express.Router();

LanguagesRouter.get("/", async (_req: Request, res: Response) => {
  const controller = new LanguagesController();
  const response = await controller.getLanguages();
  res.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60"
  );
  return res.send(response);
});

export default LanguagesRouter;
