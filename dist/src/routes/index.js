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
const apicache_1 = __importDefault(require("apicache"));
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const categories_controller_2 = __importDefault(require("../controllers/categories.controller"));
const user_router_1 = __importDefault(require("./user.router"));
const languages_controller_1 = __importDefault(require("../controllers/languages.controller"));
const router = express_1.default.Router();
const cache = apicache_1.default.options({ debug: true }).middleware;
router.get("/ping", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pingController = new categories_controller_1.default();
    const response = yield pingController.getMessage();
    return res.send(response);
}));
router.get("/languages", cache("1 month"), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new languages_controller_1.default();
    const response = yield controller.getMessage();
    return res.send(response);
}));
router.get("/categories", cache("1 month"), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new categories_controller_2.default();
    const response = yield controller.getMessage();
    return res.send(response);
}));
router.use("/users", user_router_1.default);
router.use(express_1.default.static("public"));
router.use("/api-docs", swagger_ui_express_1.default.serve);
router.get("/api-docs", swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
exports.default = router;
