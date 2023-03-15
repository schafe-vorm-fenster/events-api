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
exports.searchEvents = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const ruralEventScopes_1 = require("../../../packages/rural-event-types/src/ruralEventScopes");
const scopeDistances_1 = require("../scopes/scopeDistances");
const client_1 = __importDefault(require("./client"));
const schema_1 = __importDefault(require("./schema"));
const searchEvents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("query: ", query);
    // validate geo center
    if (!query.center ||
        !query.center.geopint ||
        !query.center.communityId ||
        !query.center.municipalityId ||
        !query.center.countyId ||
        !query.center.stateId ||
        !query.center.countryId) {
        throw (0, http_errors_1.default)(400, "invalid center param, event search requires a valid center geopoint and geoname ids for all levels");
    }
    // validate scope
    if (!query.scope || !(0, ruralEventScopes_1.isRuralEventScope)(query.scope)) {
        throw (0, http_errors_1.default)(400, "invalid scope param, event search requires a valid scope");
    }
    // pre-define admin filters
    const communityFilter = `community.id: ${query.center.communityId}`;
    const municipalityFilter = `municipality.id: ${query.center.municipalityId} && scope: [municipality,nearby,region,county,state,country]`;
    const countyFilter = `county.id: ${query.center.countyId} && scope: [county,state,country]`;
    const stateFilter = `state.id: ${query.center.stateId} && scope: [state,country]`;
    const countryFilter = `country.id: ${query.center.countryId} && scope: country`;
    // pre-define distance filters
    const nearbyFilter = `community.geopoint:(${query.center.geopint[0]}, ${query.center.geopint[1]}, ${(0, scopeDistances_1.getScopeDistance)("nearby")} km) && scope: [nearby,region,county,state,country]`;
    const regionFilter = `community.geopoint:(${query.center.geopint[0]}, ${query.center.geopint[1]}, ${(0, scopeDistances_1.getScopeDistance)("region")} km) && scope: [region,county,state,country]`;
    /**
     * generate geo distance query filters incl. aggregation levels if containTighterScopes is set
     *
     * community
     *  - radius:community with scope:community
     *
     * municipality: contains community plus
     *  - radius:municipality with scope:municipality
     *
     * nearby:
     *  - radius:nearby with scope:nearby
     *  - radius:community with scope:community
     *  - radius:municipality with scope:municipality
     *
     * region: should contain all from nearby plus
     *  - radius:region with scope:region
     *
     * county, state, country ...
     *  - radius:county with scope:county
     *  - radius:state with scope:state
     */
    let scopeBasedFilters = [];
    switch (query.scope) {
        case "community":
            scopeBasedFilters.push(communityFilter);
            break;
        case "municipality":
            scopeBasedFilters.push(municipalityFilter);
            if (query.containTighterScopes) {
                scopeBasedFilters.push(communityFilter);
            }
            break;
        case "nearby":
            scopeBasedFilters.push(nearbyFilter);
            if (query.containTighterScopes) {
                scopeBasedFilters.push(communityFilter);
                scopeBasedFilters.push(municipalityFilter);
            }
            break;
        case "region":
            scopeBasedFilters.push(regionFilter);
            if (query.containTighterScopes) {
                scopeBasedFilters.push(nearbyFilter);
                scopeBasedFilters.push(communityFilter);
                scopeBasedFilters.push(municipalityFilter);
            }
            break;
        case "county":
            scopeBasedFilters.push(countyFilter);
            if (query.containTighterScopes) {
                scopeBasedFilters.push(regionFilter);
                scopeBasedFilters.push(nearbyFilter);
                scopeBasedFilters.push(communityFilter);
                scopeBasedFilters.push(municipalityFilter);
            }
            break;
        case "state":
            scopeBasedFilters.push(stateFilter);
            if (query.containTighterScopes) {
                scopeBasedFilters.push(countyFilter);
                scopeBasedFilters.push(regionFilter);
                scopeBasedFilters.push(nearbyFilter);
                scopeBasedFilters.push(communityFilter);
                scopeBasedFilters.push(municipalityFilter);
            }
            break;
        case "country":
            scopeBasedFilters.push(countryFilter);
            if (query.containTighterScopes) {
                scopeBasedFilters.push(stateFilter);
                scopeBasedFilters.push(countyFilter);
                scopeBasedFilters.push(regionFilter);
                scopeBasedFilters.push(nearbyFilter);
                scopeBasedFilters.push(communityFilter);
                scopeBasedFilters.push(municipalityFilter);
            }
            break;
        default:
            throw (0, http_errors_1.default)(400, "invalid scope");
    }
    console.log("scopeBasedFilters", scopeBasedFilters);
    const searchParameters = {
        q: "*",
        filter_by: scopeBasedFilters.map((f) => `(${f})`).join(" || "),
        facet_by: "categories,occurrence,scope",
        sort_by: "start:desc",
        exclude_fields: "description.en, description.pl, summary.en, summary.pl",
        per_page: 100,
        limit_hits: 100,
    };
    console.log("searchParameters: ", searchParameters);
    // TODO: put into one generic function?
    const result = yield client_1.default
        .collections(schema_1.default.name)
        .documents()
        .search(searchParameters)
        .then(function (searchResults) {
        return searchResults;
    }, (err) => {
        return err;
    });
    return result;
});
exports.searchEvents = searchEvents;
