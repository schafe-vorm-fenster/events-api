"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const events_router_1 = __importDefault(require("./events.router"));
const languages_controller_1 = __importDefault(require("../controllers/languages.controller"));
const swaggerDocument = __importStar(require("../swagger/swagger.json"));
const router = express_1.default.Router();
router.get("/languages", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new languages_controller_1.default();
    const response = yield controller.getLanguages();
    res.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60");
    return res.send(response);
}));
router.get("/categories", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new categories_controller_1.default();
    const response = yield controller.getCategories();
    res.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60, stale-if-error=60");
    return res.send(response);
}));
router.use("/events", events_router_1.default);
router.use(express_1.default.static("public"));
router.use("/api-docs", swagger_ui_express_1.default.serve);
router.get("/api-docs", swagger_ui_express_1.default.setup(swaggerDocument));
exports.default = router;
