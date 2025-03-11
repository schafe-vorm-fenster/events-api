import { cleanSpaces, htmlToData, textToData, } from "../../../packages/data-text-mapper/src";
import { containsHtml } from "../../../packages/data-text-mapper/src/helpers/containsHtml";
import { isDataHtml } from "./helpers/isDataHtml";
export const unknownToData = (body) => {
    if (!body)
        return null;
    // extract tags from body
    let textWithData;
    if (isDataHtml(body)) {
        textWithData = htmlToData(body);
    }
    else if (containsHtml(body)) {
        textWithData = Object.assign(Object.assign({}, textToData(body)), { description: cleanSpaces(body) });
    }
    else {
        textWithData = textToData(body);
    }
    return {
        description: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.description) || "",
        url: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.url) || "",
        tags: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.tags) || [],
        scopes: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.scopes) || [],
        image: (textWithData === null || textWithData === void 0 ? void 0 : textWithData.image) || "",
    };
};
