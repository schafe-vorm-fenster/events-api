"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScopeDistance = exports.scopeDistances = void 0;
exports.scopeDistances = [
    {
        scope: "nearby",
        distance: 2.5,
    },
    {
        scope: "region",
        distance: 20,
    },
];
const getScopeDistance = (scope) => {
    var _a, _b;
    return (((_b = (_a = exports.scopeDistances.filter((scopeDistance) => scopeDistance.scope == scope)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.distance) || null);
};
exports.getScopeDistance = getScopeDistance;
