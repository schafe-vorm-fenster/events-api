"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToData = void 0;
const cleanSpaces_1 = require("./helpers/cleanSpaces");
const imageFromText_1 = require("./helpers/imageFromText");
const scopesFromText_1 = require("./helpers/scopesFromText");
const tagsFromText_1 = require("./helpers/tagsFromText");
const urlFromText_1 = require("./helpers/urlFromText");
const textToData = (text) => {
    const description = (0, cleanSpaces_1.cleanSpaces)((0, scopesFromText_1.removeScopesFromText)((0, tagsFromText_1.removeTagsFromText)((0, urlFromText_1.removeUrlFromText)(text))));
    const textWithData = {
        description: description,
        url: (0, urlFromText_1.urlFromText)(text) || undefined,
        image: (0, imageFromText_1.imageFromText)(text) || undefined,
        tags: (0, tagsFromText_1.tagsFromText)(text) || undefined,
        scopes: (0, scopesFromText_1.scopesFromText)(text) || undefined,
    };
    return textWithData;
};
exports.textToData = textToData;
