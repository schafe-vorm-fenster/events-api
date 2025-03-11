import { prefixedStringsFromText, removePrefixedStringsFromText, } from "./prefixedStringsFromText";
const tagsFromText = (text) => {
    return prefixedStringsFromText(text, "#");
};
const removeTagsFromText = (text) => {
    return removePrefixedStringsFromText(text, "#");
};
export { tagsFromText, removeTagsFromText };
