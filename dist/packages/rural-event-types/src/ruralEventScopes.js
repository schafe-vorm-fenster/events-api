"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRuralEventScope = exports.isRuralEventAdminScope = exports.isRuralEventDistanceScope = exports.AllRuralEventScopes = exports.DistanceRuralEventScopes = exports.AdminRuralEventScopes = void 0;
exports.AdminRuralEventScopes = [
    "community",
    "municipality",
    "county",
    "state",
    "country",
];
exports.DistanceRuralEventScopes = [
    "nearby",
    "region", // in the greater region of the current location approximately 20-30km
];
exports.AllRuralEventScopes = [
    "community",
    "municipality",
    "county",
    "state",
    "country",
    "nearby",
    "region", // in the greater region of the current location approximately 20-30km
];
function isRuralEventDistanceScope(scopeInQuestion) {
    return exports.DistanceRuralEventScopes.includes(scopeInQuestion);
}
exports.isRuralEventDistanceScope = isRuralEventDistanceScope;
function isRuralEventAdminScope(scopeInQuestion) {
    return exports.AdminRuralEventScopes.includes(scopeInQuestion);
}
exports.isRuralEventAdminScope = isRuralEventAdminScope;
function isRuralEventScope(scopeInQuestion) {
    return exports.AllRuralEventScopes.includes(scopeInQuestion);
}
exports.isRuralEventScope = isRuralEventScope;
