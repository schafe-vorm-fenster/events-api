"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapScope = exports.defaultScope = void 0;
const scopeSynonyms_1 = require("./scopeSynonyms");
exports.defaultScope = "nearby";
/**
 * Maps scopes from loose text to RuralEventScope.
 * @param scopes
 * @returns RuralEventScope
 */
const mapScope = (scope) => {
    if (!scope)
        return exports.defaultScope;
    const scopeLowercase = scope.toLowerCase();
    if (scopeSynonyms_1.scopeSynonymsLowercase.community.includes(scopeLowercase))
        return "community";
    if (scopeSynonyms_1.scopeSynonymsLowercase.nearby.includes(scopeLowercase))
        return "nearby";
    if (scopeSynonyms_1.scopeSynonymsLowercase.region.includes(scopeLowercase))
        return "region";
    if (scopeSynonyms_1.scopeSynonymsLowercase.municipality.includes(scopeLowercase))
        return "municipality";
    if (scopeSynonyms_1.scopeSynonymsLowercase.county.includes(scopeLowercase))
        return "county";
    if (scopeSynonyms_1.scopeSynonymsLowercase.state.includes(scopeLowercase))
        return "state";
    if (scopeSynonyms_1.scopeSynonymsLowercase.country.includes(scopeLowercase))
        return "country";
    if (scopeSynonyms_1.scopeSynonymsLowercase.global.includes(scopeLowercase))
        return "global";
    return exports.defaultScope;
};
exports.mapScope = mapScope;
