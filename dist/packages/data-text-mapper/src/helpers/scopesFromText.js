"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopesRegex = exports.removeScopesFromText = exports.scopesFromText = void 0;
const prefixedStringsFromText_1 = require("./prefixedStringsFromText");
const scopesRegex = /(@.*?\s)|(@.*?$)/g;
exports.scopesRegex = scopesRegex;
const scopesFromText = (text) => {
    return (0, prefixedStringsFromText_1.prefixedStringsFromText)(text, "@");
};
exports.scopesFromText = scopesFromText;
const removeScopesFromText = (text) => {
    return (0, prefixedStringsFromText_1.removePrefixedStringsFromText)(text, "@");
};
exports.removeScopesFromText = removeScopesFromText;
