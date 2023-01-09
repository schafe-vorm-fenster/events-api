"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegex = exports.removeUrlFromText = exports.urlFromText = void 0;
const urlRegexSafe = require("url-regex-safe");
const urlRegex = urlRegexSafe();
exports.urlRegex = urlRegex;
const urlFromText = (text) => {
    const matches = text.match(urlRegex);
    if (matches && (matches === null || matches === void 0 ? void 0 : matches.length) > 0)
        return matches[0];
    return null;
};
exports.urlFromText = urlFromText;
const removeUrlFromText = (text) => {
    const regExp = new RegExp(urlRegex);
    const reducedText = text.replace(regExp, "").trim();
    return reducedText;
};
exports.removeUrlFromText = removeUrlFromText;
