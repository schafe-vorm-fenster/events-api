import express from "express";
import SchemaController from "../controllers/schema.controller";

const SchemaRouter = express.Router();

SchemaRouter.post("/:schema", async (_req, res) => {
  console.debug("POST: /schema/{schema}");
  console.debug(_req.params);

  const controller = new SchemaController();
  let response = undefined;

  try {
    response = await controller.createSchema("events");
  } catch (error) {
    return res.status(400).json(error);
  }

  if (!response) {
    return res.status(404).json({ message: "No schema found" });
  }

  return res.send(response);
});

SchemaRouter.delete("/:schema", async (_req, res) => {
  console.debug("DELETE: /schema/{schema}");
  console.debug(_req.params);

  const controller = new SchemaController();
  let response = undefined;

  try {
    response = await controller.deleteSchema("events");
  } catch (error) {
    return res.status(400).json(error);
  }

  if (!response) {
    return res.status(404).json({ message: "No schema found" });
  }

  return res.send(response);
});

SchemaRouter.get("/list", async (_req, res) => {
  console.debug("GET: /schema/list");
  console.debug(_req.params);

  const controller = new SchemaController();
  let response = undefined;

  try {
    response = await controller.listSchemas();
  } catch (error) {
    return res.status(400).json(error);
  }

  if (!response) {
    return res.status(404).json({ message: "No schema found" });
  }

  return res.send(response);
});

export default SchemaRouter;
