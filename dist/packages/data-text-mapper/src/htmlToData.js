"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToData = void 0;
const cleanSpaces_1 = require("./helpers/cleanSpaces");
const imageFromText_1 = require("./helpers/imageFromText");
const scopesFromText_1 = require("./helpers/scopesFromText");
const tagsFromText_1 = require("./helpers/tagsFromText");
const urlFromText_1 = require("./helpers/urlFromText");
const htmlToData = (text) => {
    let description = text;
    // strip link tag from description
    description = description.replace(new RegExp('(<p class="link">.*</p>)', "gi"), "");
    // strip taxonomy tag from description
    description = description.replace(new RegExp('(<p class="taxonomy">.*</p>)', "gi"), "");
    // strip image tag from description
    description = description.replace(new RegExp("(<img .*/>)", "gi"), "");
    // strip html from description if wrapped in known tag
    if (description.match('<p class="p-description">.*</p>'))
        description = description
            .replace('<p class="p-description">', "")
            .replace("</p>", "");
    // final cleanup of the description
    description = (0, cleanSpaces_1.cleanSpaces)(description);
    const textWithData = {
        description: description,
        url: (0, urlFromText_1.urlFromText)(text) || undefined,
        tags: (0, tagsFromText_1.tagsFromText)(text) || undefined,
        scopes: (0, scopesFromText_1.scopesFromText)(text) || undefined,
        image: (0, imageFromText_1.imageFromText)(text) || undefined,
    };
    return textWithData;
};
exports.htmlToData = htmlToData;
