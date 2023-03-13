import express, { Request, Response as Res } from "express";
import SchemaController from "./schema.controller";

const SchemaRouter = express.Router();

SchemaRouter.get("", async (_req: Request, res: Res) => {
  console.debug("GET: /schema");
  if (!_req.headers["admin-access"])
    return res.status(401).send("Unauthorized");

  const controller = new SchemaController();
  await controller
    .getSchema()
    .then((schemas) => {
      if (schemas.length === 0) {
        res.status(204).json(schemas);
      } else {
        res.status(200).json(schemas);
      }
    })
    .catch((error) => {
      return res
        .status(error.status || 500)
        .json({ status: error.status || 500, error: error.message });
    });
});

SchemaRouter.post("", async (_req: Request, res: Res) => {
  console.debug("POST: /schema");
  if (!_req.headers["admin-access"])
    return res.status(401).send("Unauthorized");

  console.debug("auth: ", _req.headers["admin-access"]);
  const controller = new SchemaController();
  await controller
    .createSchema()
    .then((schema) => {
      res.status(201).json(schema);
    })
    .catch((error) => {
      return res
        .status(error.status || 500)
        .json({ status: error.status || 500, error: error.message });
    });
});

SchemaRouter.delete("", async (_req: Request, res: Res) => {
  console.debug("DELETE: /schema");
  if (!_req.headers["admin-access"])
    return res.status(401).send("Unauthorized");

  const controller = new SchemaController();
  await controller
    .deleteSchema()
    .then((schema) => {
      res.status(200).json(schema);
    })
    .catch((error) => {
      return res
        .status(error.status || 500)
        .json({ status: error.status || 500, error: error.message });
    });
});

export default SchemaRouter;
