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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AuthRouter = express_1.default.Router();
AuthRouter.use("*", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const token = _req.get("Sheep-Token");
    // check if token is present
    if (!token || token.length <= 2)
        return res.status(401).send("Unauthorized");
    // evealuate admin access
    const adminTokens = (_a = process.env.ADMIN_ACCESS_TOKENS) === null || _a === void 0 ? void 0 : _a.split(",").map((t) => t.trim());
    let adminAccess = false;
    if (adminTokens === null || adminTokens === void 0 ? void 0 : adminTokens.includes(token)) {
        adminAccess = true;
        _req.headers["admin-access"] = "true";
    }
    console.debug("adminAccess: ", adminAccess);
    // evaluate write access
    const writeTokens = (_b = process.env.WRITE_ACCESS_TOKENS) === null || _b === void 0 ? void 0 : _b.split(",").map((t) => t.trim());
    let writeAccess = false;
    if (writeTokens === null || writeTokens === void 0 ? void 0 : writeTokens.includes(token)) {
        writeAccess = true;
        _req.headers["write-access"] = "true";
    }
    console.debug("writeAccess: ", writeAccess);
    // evaluate read access
    const readTokens = (_c = process.env.READ_ACCESS_TOKENS) === null || _c === void 0 ? void 0 : _c.split(",").map((t) => t.trim());
    let readAccess = false;
    if (writeAccess || (readTokens === null || readTokens === void 0 ? void 0 : readTokens.includes(token))) {
        readAccess = true;
        _req.headers["read-access"] = "true";
    }
    if (readAccess || writeAccess || adminAccess) {
        next();
    }
    else {
        return res.status(401).send("Unauthorized");
    }
}));
exports.default = AuthRouter;
