"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeSynonymsLowercase = exports.scopeSynonyms = void 0;
exports.scopeSynonyms = {
    nearby: ["Umgebung", "Nähe"],
    community: ["Ort", "Dorf"],
    region: ["Region"],
    municipality: ["Gemeinde", "Kommune", "Stadt"],
    county: ["Landkreis", "Kreis"],
    state: ["Bundesland"],
    country: ["Land"],
    global: ["Weltweit"],
};
exports.scopeSynonymsLowercase = {
    nearby: exports.scopeSynonyms.nearby.map((s) => s.toLowerCase()),
    community: exports.scopeSynonyms.community.map((s) => s.toLowerCase()),
    region: exports.scopeSynonyms.region.map((s) => s.toLowerCase()),
    municipality: exports.scopeSynonyms.municipality.map((s) => s.toLowerCase()),
    county: exports.scopeSynonyms.county.map((s) => s.toLowerCase()),
    state: exports.scopeSynonyms.state.map((s) => s.toLowerCase()),
    country: exports.scopeSynonyms.country.map((s) => s.toLowerCase()),
    global: exports.scopeSynonyms.global.map((s) => s.toLowerCase()),
};
