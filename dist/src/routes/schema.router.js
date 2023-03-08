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
const schema_controller_1 = __importDefault(require("../controllers/schema.controller"));
const SchemaRouter = express_1.default.Router();
SchemaRouter.post("/:schema", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("POST: /schema/{schema}");
    console.debug(_req.params);
    const controller = new schema_controller_1.default();
    let response = undefined;
    try {
        response = yield controller.createSchema("events");
    }
    catch (error) {
        return res.status(400).json(error);
    }
    if (!response) {
        return res.status(404).json({ message: "No schema found" });
    }
    return res.send(response);
}));
SchemaRouter.delete("/:schema", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("DELETE: /schema/{schema}");
    console.debug(_req.params);
    const controller = new schema_controller_1.default();
    let response = undefined;
    try {
        response = yield controller.deleteSchema("events");
    }
    catch (error) {
        return res.status(400).json(error);
    }
    if (!response) {
        return res.status(404).json({ message: "No schema found" });
    }
    return res.send(response);
}));
SchemaRouter.get("/list", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("GET: /schema/list");
    console.debug(_req.params);
    const controller = new schema_controller_1.default();
    let response = undefined;
    try {
        response = yield controller.listSchemas();
    }
    catch (error) {
        return res.status(400).json(error);
    }
    if (!response) {
        return res.status(404).json({ message: "No schema found" });
    }
    return res.send(response);
}));
exports.default = SchemaRouter;
