"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsHtml = void 0;
const containsHtml = (text) => {
    const matchTags = new RegExp("(<.*>.*</.*>)|(<.*/>)", "gi");
    const matches = text.match(matchTags);
    return matches ? true : false;
};
exports.containsHtml = containsHtml;
