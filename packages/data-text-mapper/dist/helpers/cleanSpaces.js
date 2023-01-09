"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSpaces = void 0;
const cleanSpaces = (text) => {
    let reducedText = text;
    reducedText = reducedText.replace(/(\r\n)/g, "\n"); // harmonize line breaks
    reducedText = reducedText.replace(/\r/g, "\n"); // harmonize line breaks
    reducedText = reducedText.replace(/[\n]{2,}/g, "\n\n"); // reduce to max two breaks
    reducedText = reducedText.replace(/[ ]{1,}/g, " "); // reduce multiple spaces
    reducedText = reducedText.trim();
    return reducedText;
};
exports.cleanSpaces = cleanSpaces;
