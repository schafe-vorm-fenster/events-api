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
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
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
    createEvent(id, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return { name: "jan" };
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
    (0, tsoa_1.Post)("{id}"),
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(422, "Validation Failed"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
EventsController = __decorate([
    (0, tsoa_1.Route)("events"),
    (0, tsoa_1.Tags)("Events")
], EventsController);
exports.default = EventsController;
