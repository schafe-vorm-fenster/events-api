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
const languages_controller_1 = __importDefault(require("./languages.controller"));
const LanguagesRouter = express_1.default.Router();
LanguagesRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new languages_controller_1.default();
    const response = yield controller.getLanguages();
    console.debug("languages: ", _req.headers["read-access"]);
    console.debug("languages: ", _req.headers["write-access"]);
    res.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60");
    return res.send(response);
}));
exports.default = LanguagesRouter;
