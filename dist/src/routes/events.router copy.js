"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_controller_1 = __importDefault(require("../controllers/events.controller"));
const eventsSchema_1 = __importDefault(require("../search/schema/eventsSchema"));
const typesenseClient_1 = __importDefault(require("../search/typesenseClient"));
const router = express_1.default.Router();
router.get("/test", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("GET: /events/test");
    console.log(_req.params);
    const { q } = _req.query;
    const searchParameters = {
        q: "Stark",
        query_by: "summary.de",
        sort_by: "start:desc",
    };
    typesenseClient_1.default
        .collections("events")
        .documents()
        .search(searchParameters)
        .then(function (searchResults) {
        res.send(searchResults);
    }, (err) => {
        res.send(err);
    });
    // return res.send({ debug: "all events for community" });
}));
router.post("/schema", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("POST: /events/schema");
    // await client.collections("events").delete();
    typesenseClient_1.default
        .collections()
        .create(eventsSchema_1.default)
        .then((data) => {
        console.debug(data);
        res.send(data);
    }, (err) => {
        res.send(err);
    });
    // console.log(_req.params);
    // return res.send({ debug: "all events for community" });
}));
router.get("/schema/list", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("GET: /events/schema/list");
    const collections = yield typesenseClient_1.default.collections().retrieve();
    return res.send(collections);
}));
router.get("/:community/:scope/:category", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new events_controller_1.default();
    let response = undefined;
    console.log(_req.params);
    try {
        response = yield controller.getEventsForCommunityFilteredByScopeAndCategory("geone-1234567", "local", "sports");
    }
    catch (error) {
        return res.status(400).json(error);
    }
    if (!response) {
        return res.status(404).json({ message: "No events found" });
    }
    return res.send(response);
}));
router.get("/:community/:scope", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new events_controller_1.default();
    let response = undefined;
    console.log(_req.params);
    return res.send({ debug: "scope filtered events for community" });
}));
router.get("/:community", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new events_controller_1.default();
    let response = undefined;
    return res.send({ debug: "debug" });
}));
router.post("/:id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("POST: /events/:id");
    console.log(_req.params);
    // const controller = new EventsController();
    // let response = undefined;
    const newEvent = JSON.parse(JSON.stringify(Object.assign(Object.assign({}, _req.body), { id: _req.params.id })));
    console.debug(JSON.stringify(newEvent, null, 2));
    let document = {
        id: "124",
        "summary.de": "Stark Industries",
        start: 123456789,
    };
    typesenseClient_1.default
        .collections("events")
        .documents()
        .create(JSON.parse(JSON.stringify(document)))
        .then((data) => {
        res.send(data);
    }, (err) => {
        res.send(err);
    });
    // return res.send({ debug: "all events for community" });
}));
exports.default = router;
