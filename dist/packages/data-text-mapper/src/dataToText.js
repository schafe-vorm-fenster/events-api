"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataToText = void 0;
const cleanSpaces_1 = require("./helpers/cleanSpaces");
const dataToText = (data) => {
    var _a, _b;
    let text = (0, cleanSpaces_1.cleanSpaces)(data.description);
    const image = data.image || null;
    const url = data.url || null;
    const tags = ((_a = data.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => "#" + tag).join(" ")) || null;
    const scopes = ((_b = data.scopes) === null || _b === void 0 ? void 0 : _b.map((scope) => "@" + scope).join(" ")) || null;
    const tagScopeLine = tags || scopes ? [tags, scopes].filter(Boolean).join(" ") : null;
    return [text, image, url, tagScopeLine]
        .filter((line) => line !== null)
        .join("\n\n");
};
exports.dataToText = dataToText;
