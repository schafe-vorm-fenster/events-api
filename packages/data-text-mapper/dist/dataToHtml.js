"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataToHtml = void 0;
const cleanSpaces_1 = require("./helpers/cleanSpaces");
const containsHtml_1 = require("./helpers/containsHtml");
const dataToHtml = (data) => {
    var _a, _b;
    let descriptionLine = (0, cleanSpaces_1.cleanSpaces)(data.description);
    if (!(0, containsHtml_1.containsHtml)(descriptionLine)) {
        descriptionLine = `<p class="description">${descriptionLine}</p>`;
    }
    const urlLine = data.url
        ? `<p class="link"><a href="${data.url}">${data.url}</a></p>`
        : null;
    const tags = ((_a = data.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => `<span class="tag">#${tag}</span>`).join(" ")) || null;
    const scopes = ((_b = data.scopes) === null || _b === void 0 ? void 0 : _b.map((scope) => `<span class="scope">@${scope}</span>`).join(" ")) || null;
    const tagScopeLine = tags || scopes
        ? '<p class="taxonomy">' +
            [tags, scopes].filter((item) => item !== null).join(" ") +
            "</p>"
        : null;
    return [descriptionLine, urlLine, tagScopeLine]
        .filter((line) => line !== null)
        .join("\n");
};
exports.dataToHtml = dataToHtml;
