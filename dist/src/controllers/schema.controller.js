"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const tsoa_1 = require("tsoa");
const eventsSchema_1 = __importDefault(require("../search/schema/eventsSchema"));
const typesenseClient_1 = __importDefault(require("../search/typesenseClient"));
let SchemaController = class SchemaController {
    listSchemas() {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield typesenseClient_1.default.collections().retrieve();
            return { name: "jan", debug: collections };
        });
    }
    createSchema(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typesenseClient_1.default
                .collections()
                .create(eventsSchema_1.default)
                .then((data) => {
                console.debug(data);
                return data;
            }, (err) => {
                return err;
            });
            return { name: "jan", debug: result };
        });
    }
    deleteSchema(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typesenseClient_1.default
                .collections(schema)
                .delete()
                .then((data) => {
                console.debug(data);
                return data;
            }, (err) => {
                return err;
            });
            return { name: "DELETE", debug: result };
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("list"),
    (0, tsoa_1.SuccessResponse)("201", "Found"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchemaController.prototype, "listSchemas", null);
__decorate([
    (0, tsoa_1.Post)("{schema}"),
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    (0, tsoa_1.Response)(409, "ObjectAlreadyExists"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchemaController.prototype, "createSchema", null);
__decorate([
    (0, tsoa_1.Delete)("{schema}"),
    (0, tsoa_1.SuccessResponse)("201", "Deleted"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(404, "ObjectNotFound"),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchemaController.prototype, "deleteSchema", null);
SchemaController = __decorate([
    (0, tsoa_1.Route)("schema"),
    (0, tsoa_1.Tags)("Schema")
], SchemaController);
exports.default = SchemaController;
