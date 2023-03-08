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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const events_router_1 = __importDefault(require("./events/events.router"));
const swaggerDocument = __importStar(require("./swagger/swagger.json"));
const schema_router_1 = __importDefault(require("./schema/schema.router"));
const categories_router_1 = __importDefault(require("./categories/categories.router"));
const languages_router_1 = __importDefault(require("./languages/languages.router"));
const router = express_1.default.Router();
router.use(express_1.default.static("public"));
router.use("/api-docs", swagger_ui_express_1.default.serve);
router.get("/api-docs", swagger_ui_express_1.default.setup(swaggerDocument));
// TODO: Add auth token header handling
router.use("/languages", languages_router_1.default);
router.use("/categories", categories_router_1.default);
router.use("/events", events_router_1.default);
// TODO: Add specific auth token handling for admin functions
router.use("/schema", schema_router_1.default);
exports.default = router;
