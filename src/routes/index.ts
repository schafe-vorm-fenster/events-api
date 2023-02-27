import express from "express";
import swaggerUi from "swagger-ui-express";
import CategoriesController from "../controllers/categories.controller";
import EventsRouter from "./events.router";
import LanguagesController from "../controllers/languages.controller";
import * as swaggerDocument from "../swagger/swagger.json";

const router = express.Router();

router.get("/languages", async (_req, res) => {
  const controller = new LanguagesController();
  const response = await controller.getLanguages();
  res.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60"
  );
  return res.send(response);
});

router.get("/categories", async (_req, res) => {
  const controller = new CategoriesController();
  const response = await controller.getCategories();
  res.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60"
  );
  return res.send(response);
});

router.use("/events", EventsRouter);

router.use(express.static("public"));

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

export default router;
