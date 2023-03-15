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
const events_controller_1 = __importDefault(require("./events.controller"));
const router = express_1.default.Router();
// TODO: add  cache header to all event fetch/query methods
router.get("/test", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("GET: /events/test");
    console.log(_req.params);
    // return res.send({ debug: "all events for community" });
}));
router.get("/:community/:scope/:category", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new events_controller_1.default();
    let response = undefined;
    console.log(_req.params);
    try {
        response =
            yield controller.getEventsForCommunityFilteredByScopeAndCategory("geone-1234567", "local", "sports");
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
    console.log(_req.params);
    console.debug("scope filtered events for community");
    const community = _req.params.community;
    const scope = _req.params.scope;
    const controller = new events_controller_1.default();
    yield controller
        .getEventsForCommunityFilteredByScope(community, scope)
        .then((result) => {
        res.status(200).json(result);
    })
        .catch((error) => {
        return res
            .status(error.status || 500)
            .json({ status: error.status || 500, error: error.message });
    });
}));
router.get("/:community", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new events_controller_1.default();
    let response = undefined;
    return res.send({ debug: "debug" });
}));
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new events_controller_1.default();
    let response = undefined;
    try {
        response = yield controller.getAllEvents();
    }
    catch (error) {
        return res.status(400).json(error);
    }
    if (!response) {
        return res.status(404).json({ message: "Di not work" });
    }
    return res.send(response);
}));
router.post("", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("POST: events");
    if (!_req.headers["write-access"])
        return res.status(401).send("Unauthorized");
    const controller = new events_controller_1.default();
    yield controller
        .createEvent(_req.body)
        .then((data) => {
        return res.status(201).json(data);
    })
        .catch((error) => {
        return res
            .status(error.status || 400)
            .json({ status: error.status || 400, error: error.message });
    });
}));
router.patch("", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("PATCH: events");
    if (!_req.headers["write-access"])
        return res.status(401).send("Unauthorized");
    const controller = new events_controller_1.default();
    yield controller
        .updateEvent(_req.body)
        .then((data) => {
        return res.status(200).json(data);
    })
        .catch((error) => {
        return res
            .status(error.status || 400)
            .json({ status: error.status || 400, error: error.message });
    });
}));
exports.default = router;
