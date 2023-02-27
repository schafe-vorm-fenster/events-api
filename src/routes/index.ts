import express from "express";
import apicache from "apicache";
import PingController from "../controllers/categories.controller";
import swaggerUi from "swagger-ui-express";
import CategoriesController from "../controllers/categories.controller";
import UserRouter from "./user.router";
import LanguagesController from "../controllers/languages.controller";

const router = express.Router();
const cache = apicache.options({ debug: true }).middleware;

router.get("/ping", async (_req, res) => {
  const pingController = new PingController();
  const response = await pingController.getMessage();
  return res.send(response);
});

router.get("/languages", cache("1 month"), async (_req, res) => {
  const controller = new LanguagesController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.get("/categories", cache("1 month"), async (_req, res) => {
  const controller = new CategoriesController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/users", UserRouter);

router.use(express.static("public"));

router.use("/api-docs", swaggerUi.serve);
router.get(
  "/api-docs",
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

export default router;
