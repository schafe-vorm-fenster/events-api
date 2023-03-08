import express, { Request, Response } from "express";
import CategoriesController from "./categories.controller";

const CategoriesRouter = express.Router();

CategoriesRouter.get("/", async (_req: Request, res: Response) => {
  const controller = new CategoriesController();
  const response = await controller.getCategories();
  res.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60"
  );
  return res.send(response);
});

export default CategoriesRouter;
