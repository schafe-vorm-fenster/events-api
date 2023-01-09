"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTagsFromText = exports.tagsFromText = void 0;
const prefixedStringsFromText_1 = require("./prefixedStringsFromText");
const tagsFromText = (text) => {
    return (0, prefixedStringsFromText_1.prefixedStringsFromText)(text, "#");
};
exports.tagsFromText = tagsFromText;
const removeTagsFromText = (text) => {
    return (0, prefixedStringsFromText_1.removePrefixedStringsFromText)(text, "#");
};
exports.removeTagsFromText = removeTagsFromText;
