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
const http_errors_1 = __importDefault(require("http-errors"));
const tsoa_1 = require("tsoa");
const uuid_by_string_1 = __importDefault(require("uuid-by-string"));
const classifyContent_1 = require("./classify/classifyContent");
const getMetadataFromContent_1 = require("./classify/getMetadataFromContent");
const geoCodeLocation_1 = require("./geocode/geoCodeLocation");
const buildIndexableEvent_1 = require("./helpers/buildIndexableEvent");
const checkIfJsonObject_1 = require("./helpers/checkIfJsonObject");
const getUniqueIdStringForEvent_1 = require("./helpers/getUniqueIdStringForEvent");
const validateEventJsonObject_1 = require("./helpers/validateEventJsonObject");
const mapScopes_1 = require("./scopes/mapScopes");
const client_1 = __importDefault(require("./search/client"));
const translateContent_1 = require("./translate/translateContent");
let EventsController = class EventsController {
    /**
     * Returns a list of events for a given community.
     * @param community Geonames.org id of the community, e.g. "geoname-2838887".
     * @param scope Scope to filter events by, values see RuralEventScope. If no value is provided, all scopes are returned.
     * @param category Category to filter events by, values see RuralEventCategory. If no value is provided, all categories are returned.
     */
    getEventsForCommunityFilteredByScopeAndCategory(community, scope, category, days) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!community) {
                throw new Error("Community is required");
            }
            // check, if parameter "community" matches the pattern "geoname-1234567"
            if (!community.match(/^geoname-\d+$/)) {
                throw new Error("Community must match the pattern 'geoname-1234567'");
            }
            return { name: "jan" };
        });
    }
    /**
     * Returns a list of events for a given community.
     * @param community Geonames.org id of the community, e.g. "geoname-2838887".
     * @param scope Scope to filter events by, values see RuralEventScope. If no value is provided, all scopes are returned.
     * @param days Number of days to look ahead for events. If no value is provided, 30 days will be used.
     */
    getEventsForCommunityFilteredByScope(community, scope, days) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!community) {
                throw new Error("Community is required");
            }
            // check, if parameter "community" matches the pattern "geoname-1234567"
            if (!community.match(/^geoname-\d+$/)) {
                throw new Error("Community must match the pattern 'geoname-1234567'");
            }
            return { name: "jan" };
        });
    }
    /**
     * Returns a list of events for a given community.
     * @param community Geonames.org id of the community, e.g. "geoname-2838887".
     * @param days Number of days to look ahead for events. If no value is provided, 30 days will be used.
     */
    getEventsForCommunity(community, days) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!community) {
                throw new Error("Community is required");
            }
            // check, if parameter "community" matches the pattern "geoname-1234567"
            if (!community.match(/^geoname-\d+$/)) {
                throw new Error("Community must match the pattern 'geoname-1234567'");
            }
            return { name: "jan" };
        });
    }
    /**
     * Returns a list of all events. TODO: remove this method in production.
     * @param community Geonames.org id of the community, e.g. "geoname-2838887".
     * @param days Number of days to look ahead for events. If no value is provided, 30 days will be used.
     */
    getAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParameters = {
                q: "*",
                query_by: "summary.de",
                sort_by: "start:desc",
                exclude_fields: "description.en, description.pl, summary.en, summary.pl",
                per_page: 100,
                limit_hits: 100,
            };
            const result = yield client_1.default
                .collections("events")
                .documents()
                .search(searchParameters)
                .then(function (searchResults) {
                return searchResults;
            }, (err) => {
                return err;
            });
            return result;
        });
    }
    /**
     * Creates or updates an event.
     */
    createEvent(eventObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check incoming data
                (0, checkIfJsonObject_1.checkIfJsonObject)(eventObject);
                (0, validateEventJsonObject_1.validateEventJsonObject)(eventObject);
            }
            catch (error) {
                throw (0, http_errors_1.default)(422, "request data is not valid: " + error.message);
            }
            // enhance event data
            let uuid;
            let geolocation;
            let metadata;
            let scope;
            let classification;
            let translatedContent;
            try {
                // create uuid based on the event data
                uuid = (0, uuid_by_string_1.default)((0, getUniqueIdStringForEvent_1.getUniqueIdStringForEvent)(eventObject)); // low runtime
                metadata = (0, getMetadataFromContent_1.getMetadataFromContent)(eventObject === null || eventObject === void 0 ? void 0 : eventObject.description); // data needed in the next steps
                // do in parallel to save time
                [geolocation, scope, classification, translatedContent] =
                    yield Promise.all([
                        (0, geoCodeLocation_1.geoCodeLocation)(eventObject === null || eventObject === void 0 ? void 0 : eventObject.location),
                        (0, mapScopes_1.mapScopes)(metadata === null || metadata === void 0 ? void 0 : metadata.scopes),
                        (0, classifyContent_1.classifyContent)(metadata === null || metadata === void 0 ? void 0 : metadata.tags, eventObject.summary, eventObject.description),
                        (0, translateContent_1.translateContent)(eventObject.summary, eventObject.description),
                    ]);
            }
            catch (error) {
                throw (0, http_errors_1.default)(422, "could not process event data: " + error.message);
            }
            // TODO: build proper indexable object
            const newEvent = yield (0, buildIndexableEvent_1.buildIndexableEvent)(eventObject, uuid, geolocation, metadata, scope, classification, translatedContent);
            return yield client_1.default
                .collections("events")
                .documents()
                .create(newEvent)
                .then((data) => {
                console.debug("data: ", data);
                return data;
            }, (err) => {
                console.error(err);
                throw (0, http_errors_1.default)(err.httpStatus || 500, err.message || "could not create event without known reason");
            });
        });
    }
    /**
     * Update an event.
     */
    updateEvent(eventObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check incoming data
                (0, checkIfJsonObject_1.checkIfJsonObject)(eventObject);
                (0, validateEventJsonObject_1.validateEventJsonObject)(eventObject);
            }
            catch (error) {
                throw (0, http_errors_1.default)(422, "request data is not valid: " + error.message);
            }
            // enhance event data
            let uuid;
            let geolocation;
            let metadata;
            let scope;
            let classification;
            let translatedContent;
            try {
                // create uuid based on the event data
                uuid = (0, uuid_by_string_1.default)((0, getUniqueIdStringForEvent_1.getUniqueIdStringForEvent)(eventObject)); // low runtime
                metadata = (0, getMetadataFromContent_1.getMetadataFromContent)(eventObject === null || eventObject === void 0 ? void 0 : eventObject.description); // data needed in the next steps
                // do in parallel to save time
                [geolocation, scope, classification, translatedContent] =
                    yield Promise.all([
                        (0, geoCodeLocation_1.geoCodeLocation)(eventObject === null || eventObject === void 0 ? void 0 : eventObject.location),
                        (0, mapScopes_1.mapScopes)(metadata === null || metadata === void 0 ? void 0 : metadata.scopes),
                        (0, classifyContent_1.classifyContent)(metadata === null || metadata === void 0 ? void 0 : metadata.tags, eventObject.summary, eventObject.description),
                        (0, translateContent_1.translateContent)(eventObject.summary, eventObject.description),
                    ]);
            }
            catch (error) {
                throw (0, http_errors_1.default)(422, "could not process event data: " + error.message);
            }
            // TODO: build proper indexable object
            const newEvent = yield (0, buildIndexableEvent_1.buildIndexableEvent)(eventObject, uuid, geolocation, metadata, scope, classification, translatedContent);
            return yield client_1.default
                .collections("events")
                .documents(uuid)
                .update(newEvent)
                .then((data) => {
                console.debug("data: ", data);
                return data;
            }, (err) => {
                console.error(err);
                throw (0, http_errors_1.default)(err.httpStatus || 500, err.message || "could not create event without known reason");
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("{community}/{scope}/{category}"),
    (0, tsoa_1.SuccessResponse)("200", "Okay"),
    (0, tsoa_1.Response)("204", "No Events"),
    (0, tsoa_1.Response)("400", "Invalid Parameters"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventsForCommunityFilteredByScopeAndCategory", null);
__decorate([
    (0, tsoa_1.Get)("{community}/{scope}"),
    (0, tsoa_1.SuccessResponse)("200", "Okay"),
    (0, tsoa_1.Response)("204", "No Events"),
    (0, tsoa_1.Response)("400", "Invalid Parameters"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventsForCommunityFilteredByScope", null);
__decorate([
    (0, tsoa_1.Get)("{community}"),
    (0, tsoa_1.SuccessResponse)("200", "Okay"),
    (0, tsoa_1.Response)("204", "No Events"),
    (0, tsoa_1.Response)("400", "Invalid Parameters"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventsForCommunity", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.SuccessResponse)("200", "Okay"),
    (0, tsoa_1.Response)("204", "No Events"),
    (0, tsoa_1.Response)("400", "Invalid Parameters"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getAllEvents", null);
__decorate([
    (0, tsoa_1.Post)(""),
    (0, tsoa_1.SuccessResponse)(201, "Created") // TODO: use proper type
    ,
    (0, tsoa_1.Response)(200, "Updated") // TODO: use proper type
    ,
    (0, tsoa_1.Response)(422, "Unprocessable Entity"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
__decorate([
    (0, tsoa_1.Patch)(""),
    (0, tsoa_1.SuccessResponse)(200, "Updated") // TODO: use proper type
    ,
    (0, tsoa_1.Response)(422, "Unprocessable Entity"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEvent", null);
EventsController = __decorate([
    (0, tsoa_1.Route)("events"),
    (0, tsoa_1.Tags)("Events")
], EventsController);
exports.default = EventsController;
