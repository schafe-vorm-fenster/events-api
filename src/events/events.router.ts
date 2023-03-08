import express, { Request, Response } from "express";
import EventsController from "./events.controller";
import eventsSchema from "./search/schema";
import client from "./search/client";

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

router.post("/:id", async (_req: Request, res: Response) => {
  console.debug("POST: /events/:id");
  console.log(_req.params);
  const controller = new EventsController();
  let response = undefined;

  try {
    response = await controller.createEvent("123");
  } catch (error) {
    return res.status(400).json(error);
  }

  if (!response) {
    return res.status(404).json({ message: "Di not work" });
  }

  return res.send(response);
});

export default router;
