"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixedStringsRegex = exports.removePrefixedStringsFromText = exports.prefixedStringsFromText = void 0;
const prefixedStringsRegex = (prefix) => {
    const regExpStr = "(" + prefix + ".*?<)|(" + prefix + ".*?\\s" + ")|(" + prefix + ".*?$)";
    return new RegExp(regExpStr, "g");
};
exports.prefixedStringsRegex = prefixedStringsRegex;
const prefixedStringsFromText = (text, prefix) => {
    const regExp = prefixedStringsRegex(prefix);
    const matches = text.match(regExp);
    if (matches && (matches === null || matches === void 0 ? void 0 : matches.length) > 0)
        return matches.map((tag) => tag.replace(prefix, "").replace("<", "").trim());
    return null;
};
exports.prefixedStringsFromText = prefixedStringsFromText;
const removePrefixedStringsFromText = (text, prefix) => {
    const regExp = prefixedStringsRegex(prefix);
    const reducedText = text.replace(regExp, "").trim();
    return reducedText;
};
exports.removePrefixedStringsFromText = removePrefixedStringsFromText;
