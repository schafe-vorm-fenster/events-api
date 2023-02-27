"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegex = exports.removeUrlFromText = exports.urlFromText = void 0;
const urlRegexSafe = require("url-regex-safe");
const urlRegex = urlRegexSafe();
exports.urlRegex = urlRegex;
const urlFromText = (text) => {
    const urlMatches = text.match(urlRegex);
    const imageRexExp = new RegExp(/\.(jpg|jpeg|png|gif|svg)/gi);
    let linkMatches = [];
    if (urlMatches && (urlMatches === null || urlMatches === void 0 ? void 0 : urlMatches.length) > 0)
        linkMatches = urlMatches.filter((url) => !(url || "").match(imageRexExp));
    if (linkMatches && (linkMatches === null || linkMatches === void 0 ? void 0 : linkMatches.length) > 0)
        return linkMatches[0];
    return null;
};
exports.urlFromText = urlFromText;
const removeUrlFromText = (text) => {
    const regExp = new RegExp(urlRegex);
    const reducedText = text.replace(regExp, "").trim();
    return reducedText;
};
exports.removeUrlFromText = removeUrlFromText;
