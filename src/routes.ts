import express from "express";
import swaggerUi from "swagger-ui-express";
import EventsRouter from "./events/events.router";
import * as swaggerDocument from "./swagger/swagger.json";
import SchemaRouter from "./schema/schema.router";
import CategoriesRouter from "./categories/categories.router";
import LanguagesRouter from "./languages/languages.router";
import AuthRouter from "./auth/auth.middleware";

const router = express.Router();

router.use(express.static("public"));

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

router.use("*", AuthRouter);

router.use("/languages", LanguagesRouter);

router.use("/categories", CategoriesRouter);

router.use("/events", EventsRouter);

// TODO: Add specific auth token handling for admin functions
router.use("/schema", SchemaRouter);

export default router;
