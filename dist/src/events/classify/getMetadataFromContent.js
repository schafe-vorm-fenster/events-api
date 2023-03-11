"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataFromContent = void 0;
const src_1 = require("../../../packages/data-text-mapper/src");
const containsHtml_1 = require("../../../packages/data-text-mapper/src/helpers/containsHtml");
const getMetadataFromContent = (body) => {
    if (!body)
        throw new Error("body is required");
    // extract tags from body
    let textWithData;
    if ((0, containsHtml_1.containsHtml)(body)) {
        textWithData = (0, src_1.htmlToData)(body);
    }
    else {
        textWithData = (0, src_1.textToData)(body);
    }
    return {
        url: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.url) || "",
        tags: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.tags) || [],
        scopes: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.scopes) || [],
        image: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.image) || "",
    };
};
exports.getMetadataFromContent = getMetadataFromContent;
