import express from "express";
import EventsController from "../controllers/events.controller";

const router = express.Router();

router.get("/:community/:scope/:category", async (_req, res) => {
  const controller = new EventsController();
  let response = undefined;

  console.log(_req.params);

  try {
    response = await controller.getEventsForCommunityFilteredByScopeAndCategory(
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
});

router.get("/:community/:scope", async (_req, res) => {
  const controller = new EventsController();
  let response = undefined;
  console.log(_req.params);
  return res.send({ debug: "scope filtered events for community" });
});

router.get("/:community", async (_req, res) => {
  const controller = new EventsController();
  let response = undefined;
  console.log(_req.params);
  return res.send({ debug: "all events for community" });
});

export default router;
