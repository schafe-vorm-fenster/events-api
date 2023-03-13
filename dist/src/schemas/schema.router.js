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
const schema_controller_1 = __importDefault(require("./schema.controller"));
const SchemaRouter = express_1.default.Router();
SchemaRouter.get("", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("GET: /schema");
    if (!_req.headers["admin-access"])
        return res.status(401).send("Unauthorized");
    const controller = new schema_controller_1.default();
    yield controller
        .getSchema()
        .then((schemas) => {
        if (schemas.length === 0) {
            res.status(204).json(schemas);
        }
        else {
            res.status(200).json(schemas);
        }
    })
        .catch((error) => {
        return res
            .status(error.status || 500)
            .json({ status: error.status || 500, error: error.message });
    });
}));
SchemaRouter.post("", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("POST: /schema");
    if (!_req.headers["admin-access"])
        return res.status(401).send("Unauthorized");
    console.debug("auth: ", _req.headers["admin-access"]);
    const controller = new schema_controller_1.default();
    yield controller
        .createSchema()
        .then((schema) => {
        res.status(201).json(schema);
    })
        .catch((error) => {
        return res
            .status(error.status || 500)
            .json({ status: error.status || 500, error: error.message });
    });
}));
SchemaRouter.delete("", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("DELETE: /schema");
    if (!_req.headers["admin-access"])
        return res.status(401).send("Unauthorized");
    const controller = new schema_controller_1.default();
    yield controller
        .deleteSchema()
        .then((schema) => {
        res.status(200).json(schema);
    })
        .catch((error) => {
        return res
            .status(error.status || 500)
            .json({ status: error.status || 500, error: error.message });
    });
}));
exports.default = SchemaRouter;
