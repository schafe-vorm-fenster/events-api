import express, { Request, Response } from "express";
import { HttpError } from "http-errors";
import EventsController from "./events.controller";

const router = express.Router();

// TODO: add  cache header to all event fetch/query methods

router.get("/test", async (_req, res) => {
  console.debug("GET: /events/test");
  console.log(_req.params);

  // return res.send({ debug: "all events for community" });
});

router.get(
  "/:community/:scope/:category",
  async (_req: Request, res: Response) => {
    const controller = new EventsController();
    let response = undefined;

    console.log(_req.params);

    try {
      response =
        await controller.getEventsForCommunityFilteredByScopeAndCategory(
          "geone-1234567",
          "local",
          "sports"
        );
    } catch (error) {
      return res.status(400).json(error);
    }

    if (!response) {
      return res.status(404).json({ message: "No events found" });
    }

    return res.send(response);
  }
);

router.get("/:community/:scope", async (_req: Request, res: Response) => {
  const controller = new EventsController();
  let response = undefined;
  console.log(_req.params);
  return res.send({ debug: "scope filtered events for community" });
});

router.get("/:community", async (_req: Request, res: Response) => {
  const controller = new EventsController();
  let response = undefined;
  return res.send({ debug: "debug" });
});

router.get("/", async (_req: Request, res: Response) => {
  const controller = new EventsController();
  let response = undefined;

  try {
    response = await controller.getAllEvents();
  } catch (error) {
    return res.status(400).json(error);
  }

  if (!response) {
    return res.status(404).json({ message: "Di not work" });
  }

  return res.send(response);
});

router.post("/", async (_req: Request, res: Response) => {
  console.debug("POST: /events");
  const controller = new EventsController();
  await controller
    .createEvent(_req.body)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res
        .status(error.status || 400)
        .json({ status: error.status || 400, error: error.message });
    });
});

export default router;
