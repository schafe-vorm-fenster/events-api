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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapScopes = void 0;
const mapScope_1 = require("./mapScope");
/**
 * Maps scopes from loose text to RuralEventScope.
 * @param scopes
 * @returns RuralEventScope
 */
const mapScopes = (scopes) => __awaiter(void 0, void 0, void 0, function* () {
    if (!scopes)
        return mapScope_1.defaultScope;
    if (scopes.length === 0)
        return mapScope_1.defaultScope;
    if (scopes.length === 1)
        return (0, mapScope_1.mapScope)(scopes[0]);
    // map scopes if multiple scopes coming in
    const mappedScopes = scopes.map((scope) => {
        return (0, mapScope_1.mapScope)(scope);
    });
    // return the scope with the highest range
    if (mappedScopes.includes("global"))
        return "global";
    if (mappedScopes.includes("country"))
        return "country";
    if (mappedScopes.includes("state"))
        return "state";
    if (mappedScopes.includes("county"))
        return "county";
    if (mappedScopes.includes("region"))
        return "region";
    if (mappedScopes.includes("nearby"))
        return "nearby";
    if (mappedScopes.includes("municipality"))
        return "municipality";
    if (mappedScopes.includes("community"))
        return "community";
    // fallback
    return mapScope_1.defaultScope;
});
exports.mapScopes = mapScopes;
