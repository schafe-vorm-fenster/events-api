import express from "express";
import EventsController from "../controllers/events.controller";
import debugSchema from "../search/schema/debugSchema";
import eventsSchema from "../search/schema/eventsSchema";
import client from "../search/typesenseClient";

const router = express.Router();

router.get("/test", async (_req, res) => {
  console.debug("GET: /events/test");
  console.log(_req.params);

  const { q } = _req.query;

  const searchParameters = {
    q: "Stark",
    query_by: "summary.de",
    sort_by: "start:desc",
  };

  client
    .collections("events")
    .documents()
    .search(searchParameters)
    .then(
      function (searchResults: any) {
        res.send(searchResults);
      },
      (err: any) => {
        res.send(err);
      }
    );

  // return res.send({ debug: "all events for community" });
});

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
  return res.send({ debug: "debug" });
});

router.post("/:id", async (_req, res) => {
  console.debug("POST: /events/:id");
  console.log(_req.params);
  // const controller = new EventsController();
  // let response = undefined;

  const newEvent = JSON.parse(
    JSON.stringify({ ..._req.body, id: _req.params.id })
  );
  console.debug(JSON.stringify(newEvent, null, 2));

  let document = {
    id: "124",
    "summary.de": "Stark Industries",
    start: 123456789,
  };

  client
    .collections("events")
    .documents()
    .create(JSON.parse(JSON.stringify(document)))
    .then(
      (data: any) => {
        res.send(data);
      },
      (err: any) => {
        res.send(err);
      }
    );

  // return res.send({ debug: "all events for community" });
});

export default router;
