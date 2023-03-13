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
const schema_1 = __importDefault(require("../events/search/schema"));
const client_1 = __importDefault(require("../events/search/client"));
const http_errors_1 = require("http-errors");
const http_errors_2 = __importDefault(require("http-errors"));
const Errors_1 = require("typesense/lib/Typesense/Errors");
let SchemaController = class SchemaController {
    /**
     * Get the schema for the events collection.
     */
    getSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default
                .collections()
                .retrieve()
                .then((data) => {
                const eventSchema = data.filter((schema) => schema.name === eventSchema.name)[0];
                if (data.length === 0 || !eventSchema) {
                    throw (0, http_errors_2.default)(404, "Schema not found.");
                }
                else {
                    return eventSchema;
                }
            })
                .catch((error) => {
                let httpCode;
                if (error instanceof Errors_1.TypesenseError)
                    httpCode = error === null || error === void 0 ? void 0 : error.httpStatus;
                if (error instanceof http_errors_1.HttpError)
                    httpCode = error === null || error === void 0 ? void 0 : error.status;
                throw (0, http_errors_2.default)(httpCode || 500, error.message || "Could not fetch schema for unknown reason.");
            });
        });
    }
    /**
     * Create the schema for the events collection.
     */
    createSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default
                .collections()
                .create(schema_1.default)
                .then((data) => {
                return data;
            })
                .catch((error) => {
                throw (0, http_errors_2.default)((error === null || error === void 0 ? void 0 : error.httpStatus) || 500, error.message || "Could not create schema for unknown reason.");
            });
        });
    }
    /**
     * Delete the schema incl. all data of the events collection.
     */
    deleteSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.default
                .collections(schema_1.default.name)
                .delete()
                .then((data) => {
                return data;
            })
                .catch((error) => {
                throw (0, http_errors_2.default)((error === null || error === void 0 ? void 0 : error.httpStatus) || 500, error.message || "Could not delete schema for unknown reason.");
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)(""),
    (0, tsoa_1.SuccessResponse)(200, "OK"),
    (0, tsoa_1.Response)(404, "Not Found"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(500, "Server Error"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchemaController.prototype, "getSchema", null);
__decorate([
    (0, tsoa_1.Post)(""),
    (0, tsoa_1.SuccessResponse)(201, "Created"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(409, "ObjectAlreadyExists"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchemaController.prototype, "createSchema", null);
__decorate([
    (0, tsoa_1.Delete)(""),
    (0, tsoa_1.SuccessResponse)("200", "Deleted"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(404, "ObjectNotFound"),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchemaController.prototype, "deleteSchema", null);
SchemaController = __decorate([
    (0, tsoa_1.Route)("schema"),
    (0, tsoa_1.Tags)("Schema")
], SchemaController);
exports.default = SchemaController;
